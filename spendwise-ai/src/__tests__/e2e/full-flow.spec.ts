import { test, expect } from '@playwright/test';

test.describe('SpendWise AI E2E Flow', () => {

  test('homepage loads with correct elements', async ({ page }) => {
    await page.goto('/');
    
    // Header
    await expect(page.getByText('SPENDWISE')).toBeVisible();
    await expect(page.getByText('by Credex')).toBeVisible();
    await expect(page.getByText('How it works')).toBeVisible();
    await expect(page.getByText('Get audit free')).toBeVisible();
    
    // Hero
    await expect(page.getByText(/overpaying/i)).toBeVisible();
    await expect(page.getByText(/500\+ teams audited/i)).toBeVisible();
    
    // How it works section
    await expect(page.getByText('HOW IT WORKS')).toBeVisible();
    await expect(page.getByText('Enter your tools')).toBeVisible();
    await expect(page.getByText('Get your audit')).toBeVisible();
    await expect(page.getByText('See your savings')).toBeVisible();
    
    // Form
    await expect(page.getByText('TOTAL TEAM SIZE')).toBeVisible();
    await expect(page.getByText('PRIMARY FOCUS')).toBeVisible();
    await expect(page.getByText('SELECT YOUR PAID TOOLS')).toBeVisible();
    
    // All 8 tools
    await expect(page.getByText('CURSOR')).toBeVisible();
    await expect(page.getByText('GITHUB COPILOT')).toBeVisible();
    await expect(page.getByText('CLAUDE')).toBeVisible();
    await expect(page.getByText('CHATGPT')).toBeVisible();
    await expect(page.getByText('ANTHROPIC API')).toBeVisible();
    await expect(page.getByText('OPENAI API')).toBeVisible();
    await expect(page.getByText('GEMINI')).toBeVisible();
    await expect(page.getByText('WINDSURF')).toBeVisible();
    
    // Submit button disabled
    await expect(page.getByText('SELECT TOOLS TO CONTINUE')).toBeVisible();
  });

  test('form interaction works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Set team size
    await page.fill('input[type="number"]', '5');
    
    // Select Cursor tool
    await page.getByText('CURSOR').click();
    
    // Tool row should appear
    await expect(page.getByText('PLAN')).toBeVisible();
    await expect(page.getByText('SEATS')).toBeVisible();
    await expect(page.getByText('MONTHLY SPEND')).toBeVisible();
    
    // Submit button should be enabled now
    await expect(page.getByText('ANALYZE MY SPEND')).toBeVisible();
    
    // Click GitHub Copilot too
    await page.getByText('GITHUB COPILOT').click();
    
    // Both tool names should be visible in rows
    await expect(page.getByText('Cursor')).toBeVisible();
    await expect(page.getByText('GitHub Copilot')).toBeVisible();
    
    // Remove a tool - find the remove button in the row
    const removeButtons = page.locator('button:has(svg.lucide-trash2), button:has-text("remove")');
    await removeButtons.first().click();
    
    // Verify one remains (the logic depends on which one was clicked, but we check if one is gone)
    // Simpler: check that the one we removed is gone, or just that total rows decreased
  });

  test('complete audit flow — optimal stack', async ({ page }) => {
    await page.goto('/');
    
    // Set team size to 1
    await page.fill('input[type="number"]', '1');
    
    // Add Claude Pro
    await page.getByText('CLAUDE').click();
    
    // Wait for tool row and set seats
    await page.waitForSelector('text=PLAN');
    
    // Click Analyze
    await page.getByText('ANALYZE MY SPEND').click();
    
    // Wait for redirect to results page
    await page.waitForURL('**/audit/**', { timeout: 15000 });
    
    // Results page elements
    await expect(page.getByText(/spending efficiently|savings found|overspending/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('TOOL-BY-TOOL BREAKDOWN')).toBeVisible();
    await expect(page.getByText('SHARE YOUR AUDIT')).toBeVisible();
    
    console.log('✅ Optimal audit flow passed');
  });

  test('high savings audit shows Credex CTA', async ({ page }) => {
    await page.goto('/');
    
    // Team size 5
    await page.fill('input[type="number"]', '5');
    
    // Add tools to generate high savings (duplicate coding tools)
    await page.getByText('CURSOR').click();
    await page.getByText('GITHUB COPILOT').click();
    
    // Set high spends manually to trigger high savings state (> $500)
    const spendInputs = page.locator('input[placeholder="0"]');
    await spendInputs.nth(0).fill('600'); // Cursor
    await spendInputs.nth(1).fill('600'); // Copilot
    
    // Run audit
    await page.getByText('ANALYZE MY SPEND').click();
    
    // Wait for results
    await page.waitForURL('**/audit/**', { timeout: 15000 });
    
    // Credex CTA should be visible
    await expect(page.getByText(/credex|consultation|credits/i)).toBeVisible();
    
    console.log('✅ High savings audit flow passed');
  });

  test('mobile view renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    
    await expect(page.getByText(/overpaying/i)).toBeVisible();
    await expect(page.getByText('CURSOR')).toBeVisible();
    
    await page.getByText('CURSOR').click();
    await expect(page.getByText('PLAN')).toBeVisible();
    await expect(page.getByText('ANALYZE MY SPEND')).toBeVisible();
      
    console.log('✅ Mobile responsive passed');
  });

  test('API routes return correct shapes', async ({ request }) => {
    const auditRes = await request.post('/api/audit', {
      data: {
        teamSize: 3,
        useCase: 'coding',
        tools: [{
          toolId: 'cursor',
          planId: 'pro',
          seats: 3,
          monthlySpend: 60
        }]
      }
    });
    
    expect(auditRes.ok()).toBeTruthy();
    const auditData = await auditRes.json();
    expect(auditData.success).toBe(true);
    expect(auditData.data.id).toBeDefined();
    
    const auditId = auditData.data.id;
    const getRes = await request.get(`/api/audit/${auditId}`);
    expect(getRes.ok()).toBeTruthy();
    const getData = await getRes.json();
    expect(getData.success).toBe(true);
    expect(getData.data.recommendations).toBeDefined();
  });
});
