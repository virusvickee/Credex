import { v4 as uuidv4 } from "uuid";
import { categoryFallbacks, pricingBenchmarks } from "@/lib/pricing-data";
import type { AuditToolInput, LegacyAuditResult, ToolRecommendation } from "@/types";
import { FormData, AuditRecommendation, ToolInput, UseCase, ToolId } from "@/types";
import { getToolById, getPlanById } from "@/lib/pricing-data";

export function calculateSavings(current: number, projected: number, seats: number): { monthly: number, annual: number } {
  const monthly = Math.max(0, current - projected);
  const annual = monthly * 12;
  return { monthly, annual };
}

export function checkDuplicates(tools: ToolInput[]): Map<ToolId, string> {
  const duplicates = new Map<ToolId, string>();
  const toolIds = tools.map(t => t.toolId);
  
  const hasCursor = toolIds.includes("cursor");
  const hasCopilot = toolIds.includes("github_copilot");
  if (hasCursor && hasCopilot) {
    duplicates.set("github_copilot", "Cursor subsumes GitHub Copilot functionality; running both is redundant for most coding workflows");
  }

  const hasChatgpt = toolIds.includes("chatgpt");
  const hasClaude = toolIds.includes("claude");
  if (hasChatgpt && hasClaude) {
    const chatgpt = tools.find(t => t.toolId === "chatgpt")!;
    const claude = tools.find(t => t.toolId === "claude")!;
    
    const chatgptPlan = getPlanById("chatgpt", chatgpt.planId);
    const claudePlan = getPlanById("claude", claude.planId);
    
    if (chatgptPlan && claudePlan) {
      const isBothFree = chatgptPlan.monthlyPricePerSeat === 0 && claudePlan.monthlyPricePerSeat === 0;
      if (!isBothFree && Math.abs(chatgptPlan.monthlyPricePerSeat - claudePlan.monthlyPricePerSeat) <= 10) {
        if (chatgpt.monthlySpend > claude.monthlySpend) {
          const savings = chatgpt.monthlySpend;
          duplicates.set("chatgpt", `Overlapping general-purpose LLM subscriptions; consolidating to one saves $${savings}/mo with minimal capability loss`);
        } else {
          const savings = claude.monthlySpend;
          duplicates.set("claude", `Overlapping general-purpose LLM subscriptions; consolidating to one saves $${savings}/mo with minimal capability loss`);
        }
      }
    }
  }

  return duplicates;
}

export function checkPlanSize(tool: ToolInput, teamSize: number): AuditRecommendation | null {
  const planInfo = getPlanById(tool.toolId, tool.planId);
  if (!planInfo) return null;

  const isTeamPlan = tool.planId.toLowerCase().includes("team") || tool.planId.toLowerCase().includes("business");
  if (isTeamPlan && tool.seats <= 2) {
    const toolInfo = getToolById(tool.toolId);
    const individualPlan = toolInfo.plans.find(p => 
      p.id.toLowerCase().includes("pro") || 
      p.id.toLowerCase().includes("individual") || 
      p.id.toLowerCase().includes("plus")
    );
    
    if (individualPlan) {
      const projectedMonthlySpend = individualPlan.monthlyPricePerSeat * tool.seats;
      const savings = calculateSavings(tool.monthlySpend, projectedMonthlySpend, tool.seats);
      const diffPerUser = Math.max(0, (tool.monthlySpend - projectedMonthlySpend) / tool.seats);
      
      return {
        toolId: tool.toolId,
        toolName: toolInfo.name,
        currentPlan: planInfo.name,
        currentMonthlySpend: tool.monthlySpend,
        recommendedAction: "downgrade",
        recommendedPlan: individualPlan.name,
        projectedMonthlySpend,
        monthlySavings: savings.monthly,
        annualSavings: savings.annual,
        reasoning: `Team plan requires minimum X seats; at ${tool.seats} seats, Individual plan saves $${diffPerUser}/user/mo`,
        savingsConfidence: "high"
      };
    }
  }
  return null;
}

export function checkUseCaseFit(tool: ToolInput, useCase: UseCase): AuditRecommendation | null {
  const toolInfo = getToolById(tool.toolId);
  const planInfo = getPlanById(tool.toolId, tool.planId);
  if (!planInfo) return null;

  if (useCase === "coding" && tool.toolId === "chatgpt" && (tool.planId.includes("plus") || tool.planId.includes("pro") || tool.planId.includes("team"))) {
    const cursorProPlan = getPlanById("cursor", "pro");
    const cursorPrice = cursorProPlan ? cursorProPlan.monthlyPricePerSeat * tool.seats : 20 * tool.seats;
    const diff = Math.max(0, (tool.monthlySpend - cursorPrice) / tool.seats);
    
    // We only recommend switch if projected < current. Otherwise keep.
    if (cursorPrice <= tool.monthlySpend) {
      return {
        toolId: tool.toolId,
        toolName: toolInfo.name,
        currentPlan: planInfo.name,
        currentMonthlySpend: tool.monthlySpend,
        recommendedAction: "switch",
        recommendedTool: "cursor",
        recommendedPlan: "Pro",
        projectedMonthlySpend: cursorPrice,
        monthlySavings: Math.max(0, tool.monthlySpend - cursorPrice),
        annualSavings: Math.max(0, tool.monthlySpend - cursorPrice) * 12,
        reasoning: `For coding teams, Cursor's IDE-native experience outperforms ChatGPT at $${diff} less/mo`,
        savingsConfidence: "high"
      };
    }
  }

  if (useCase === "writing" && tool.toolId === "cursor") {
    const claudeProPlan = getPlanById("claude", "pro");
    const claudePrice = claudeProPlan ? claudeProPlan.monthlyPricePerSeat * tool.seats : 20 * tool.seats;
    if (claudePrice <= tool.monthlySpend) {
      return {
        toolId: tool.toolId,
        toolName: toolInfo.name,
        currentPlan: planInfo.name,
        currentMonthlySpend: tool.monthlySpend,
        recommendedAction: "switch",
        recommendedTool: "claude",
        recommendedPlan: "Pro",
        projectedMonthlySpend: claudePrice,
        monthlySavings: Math.max(0, tool.monthlySpend - claudePrice),
        annualSavings: Math.max(0, tool.monthlySpend - claudePrice) * 12,
        reasoning: "Cursor is optimized for coding; Claude Pro is better for writing at same/lower cost",
        savingsConfidence: "high"
      };
    }
  }

  if ((useCase === "research" || useCase === "data") && tool.toolId === "claude" && tool.planId === "max") {
    const geminiAdvancedPlan = getPlanById("gemini", "gemini_advanced");
    const geminiPrice = geminiAdvancedPlan ? geminiAdvancedPlan.monthlyPricePerSeat * tool.seats : 19.99 * tool.seats;
    if (geminiPrice <= tool.monthlySpend) {
      return {
        toolId: tool.toolId,
        toolName: toolInfo.name,
        currentPlan: planInfo.name,
        currentMonthlySpend: tool.monthlySpend,
        recommendedAction: "switch",
        recommendedTool: "gemini",
        recommendedPlan: "Gemini Advanced (Google One AI Premium)",
        projectedMonthlySpend: geminiPrice,
        monthlySavings: Math.max(0, tool.monthlySpend - geminiPrice),
        annualSavings: Math.max(0, tool.monthlySpend - geminiPrice) * 12,
        reasoning: "Gemini Advanced is strong and cheaper than Claude Max",
        savingsConfidence: "high"
      };
    }
  }

  return null;
}

export function checkApiVsSubscription(tool: ToolInput, allTools: ToolInput[]): AuditRecommendation | null {
  const toolInfo = getToolById(tool.toolId);
  const planInfo = getPlanById(tool.toolId, tool.planId);
  if (!planInfo) return null;

  if (tool.toolId === "claude" && (tool.planId === "pro" || tool.planId === "team")) {
    const anthropicApi = allTools.find(t => t.toolId === "anthropic_api");
    if (anthropicApi && anthropicApi.monthlySpend < planInfo.monthlyPricePerSeat) {
      return {
        toolId: tool.toolId,
        toolName: toolInfo.name,
        currentPlan: planInfo.name,
        currentMonthlySpend: tool.monthlySpend,
        recommendedAction: "switch",
        recommendedTool: "anthropic_api",
        projectedMonthlySpend: 0,
        monthlySavings: tool.monthlySpend,
        annualSavings: tool.monthlySpend * 12,
        reasoning: "Your API spend suggests light usage; the API gives same model access without subscription overhead",
        savingsConfidence: "high"
      };
    }
  }

  if (tool.toolId === "chatgpt" && (tool.planId === "plus" || tool.planId === "team" || tool.planId === "pro")) {
    const openaiApi = allTools.find(t => t.toolId === "openai_api");
    if (openaiApi && openaiApi.monthlySpend < planInfo.monthlyPricePerSeat) {
      return {
        toolId: tool.toolId,
        toolName: toolInfo.name,
        currentPlan: planInfo.name,
        currentMonthlySpend: tool.monthlySpend,
        recommendedAction: "switch",
        recommendedTool: "openai_api",
        projectedMonthlySpend: 0,
        monthlySavings: tool.monthlySpend,
        annualSavings: tool.monthlySpend * 12,
        reasoning: "Your API spend suggests light usage; the API gives same model access without subscription overhead",
        savingsConfidence: "high"
      };
    }
  }

  return null;
}

export function checkSeatMismatch(tool: ToolInput): AuditRecommendation | null {
  const toolInfo = getToolById(tool.toolId);
  const planInfo = getPlanById(tool.toolId, tool.planId);
  if (!planInfo || planInfo.monthlyPricePerSeat === 0) return null;

  const reportedPricePerSeat = tool.monthlySpend / tool.seats;
  const variance = Math.abs(reportedPricePerSeat - planInfo.monthlyPricePerSeat) / planInfo.monthlyPricePerSeat;

  if (variance > 0.15) {
    const projectedSpend = planInfo.monthlyPricePerSeat * tool.seats;
    // Only optimize if projected <= current (so we never show negative savings)
    if (projectedSpend <= tool.monthlySpend) {
      return {
        toolId: tool.toolId,
        toolName: toolInfo.name,
        currentPlan: planInfo.name,
        currentMonthlySpend: tool.monthlySpend,
        recommendedAction: "optimize",
        projectedMonthlySpend: projectedSpend,
        monthlySavings: Math.max(0, tool.monthlySpend - projectedSpend),
        annualSavings: Math.max(0, tool.monthlySpend - projectedSpend) * 12,
        reasoning: `Your reported spend of $${reportedPricePerSeat.toFixed(2)}/seat differs from listed price of $${planInfo.monthlyPricePerSeat}/seat — verify billing or check for unused seats`,
        savingsConfidence: "high"
      };
    }
  }

  return null;
}

export function evaluateTool(tool: ToolInput, allTools: ToolInput[], useCase: UseCase, teamSize: number): AuditRecommendation {
  const toolInfo = getToolById(tool.toolId);
  const planInfo = getPlanById(tool.toolId, tool.planId);
  
  if (!planInfo) {
    return {
      toolId: tool.toolId,
      toolName: toolInfo.name,
      currentPlan: "Unknown",
      currentMonthlySpend: tool.monthlySpend,
      recommendedAction: "keep",
      projectedMonthlySpend: tool.monthlySpend,
      monthlySavings: 0,
      annualSavings: 0,
      reasoning: "Unknown plan",
      savingsConfidence: "low"
    };
  }

  // 1. Check duplicates
  const duplicatesMap = checkDuplicates(allTools);
  if (duplicatesMap.has(tool.toolId)) {
    return {
      toolId: tool.toolId,
      toolName: toolInfo.name,
      currentPlan: planInfo.name,
      currentMonthlySpend: tool.monthlySpend,
      recommendedAction: "switch",
      projectedMonthlySpend: 0,
      monthlySavings: tool.monthlySpend,
      annualSavings: tool.monthlySpend * 12,
      reasoning: duplicatesMap.get(tool.toolId)!,
      savingsConfidence: "high"
    };
  }

  // 2. Check API vs Subscription (Rule 4)
  const apiRec = checkApiVsSubscription(tool, allTools);
  if (apiRec) return apiRec;

  // 3. Check Wrong Plan Size (Rule 1)
  const planSizeRec = checkPlanSize(tool, teamSize);
  if (planSizeRec) return planSizeRec;

  // 4. Check Overpaying for Use Case (Rule 2)
  const useCaseRec = checkUseCaseFit(tool, useCase);
  if (useCaseRec) return useCaseRec;

  // 5. Check Seat Mismatch (Rule 6)
  const mismatchRec = checkSeatMismatch(tool);
  if (mismatchRec) return mismatchRec;

  // 6. Default to Keep (Rule 5)
  return {
    toolId: tool.toolId,
    toolName: toolInfo.name,
    currentPlan: planInfo.name,
    currentMonthlySpend: tool.monthlySpend,
    recommendedAction: "keep",
    projectedMonthlySpend: tool.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reasoning: "Current plan is well-matched to your team size and use case",
    savingsConfidence: "high"
  };
}

export function runAudit(formData: FormData): {
  recommendations: AuditRecommendation[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  isHighSavings: boolean
  isOptimal: boolean
} {
  const recommendations = formData.tools.map(tool => evaluateTool(tool, formData.tools, formData.useCase, formData.teamSize));
  
  const totalMonthlySavings = recommendations.reduce((sum, rec) => sum + rec.monthlySavings, 0);
  const totalAnnualSavings = recommendations.reduce((sum, rec) => sum + rec.annualSavings, 0);

  return {
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings,
    isHighSavings: totalMonthlySavings > 500,
    isOptimal: totalMonthlySavings < 100
  };
}

const findBenchmark = (tool: AuditToolInput) => {
  const normalized = tool.name.trim().toLowerCase();
  return pricingBenchmarks.find((item) => normalized.includes(item.name.toLowerCase())) ?? categoryFallbacks[tool.category];
};

export function calculateAudit(tools: AuditToolInput[]): LegacyAuditResult {
  const normalizedTools = tools.map((tool) => ({
    ...tool,
    seats: Math.max(1, Number(tool.seats) || 1),
    monthlyCost: Math.max(0, Number(tool.monthlyCost) || 0),
    usageScore: Math.min(100, Math.max(0, Number(tool.usageScore) || 0)),
  }));

  const recommendations: ToolRecommendation[] = normalizedTools.flatMap((tool) => {
    const benchmark = findBenchmark(tool);
    const monthlySpend = tool.monthlyCost * tool.seats;
    const benchmarkSpend = benchmark.recommendedMonthlySeatCost * tool.seats;
    const lowUsageWaste = tool.usageScore < 50 ? monthlySpend * 0.35 : 0;
    const priceWaste = Math.max(0, monthlySpend - benchmarkSpend);
    const savings = Math.round(Math.max(lowUsageWaste, priceWaste));

    if (savings <= 0) {
      return [];
    }

    return [{
      toolId: tool.id,
      issue: tool.usageScore < 50 ? "Low utilization against active seats" : "Pricing is above market benchmark",
      recommendation: `Review ${tool.name} seats and compare against ${benchmark.lowerCostAlternative}.`,
      estimatedMonthlySavings: savings,
    }];
  });

  const totalMonthlySpend = normalizedTools.reduce((sum, tool) => sum + tool.monthlyCost * tool.seats, 0);
  const estimatedMonthlySavings = recommendations.reduce((sum, item) => sum + item.estimatedMonthlySavings, 0);
  const savingsRate = totalMonthlySpend === 0 ? 0 : estimatedMonthlySavings / totalMonthlySpend;

  return {
    id: uuidv4(),
    tools: normalizedTools,
    totalMonthlySpend,
    estimatedMonthlySavings,
    estimatedAnnualSavings: estimatedMonthlySavings * 12,
    savingsRate,
    score: Math.max(0, Math.round(100 - savingsRate * 100)),
    recommendations,
    createdAt: new Date().toISOString(),
  };
}
