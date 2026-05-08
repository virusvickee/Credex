import Anthropic from '@anthropic-ai/sdk';
import { AuditRecommendation, UseCase } from '@/types';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function generateSummary(params: {
  recommendations: AuditRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  useCase: UseCase;
  teamSize: number;
}): Promise<{ summary: string; isFallback: boolean }> {
  const { recommendations, totalMonthlySavings, totalAnnualSavings, useCase, teamSize } = params;

  const topRecs = recommendations
    .filter((r) => r.recommendedAction !== 'keep')
    .slice(0, 2)
    .map((r) => `${r.toolName}: ${r.reasoning} (saves $${r.monthlySavings}/mo)`)
    .join('; ');

  const prompt = `You are a financial analyst writing a brief audit summary for a startup. Based on this AI tool spend audit data, write a single paragraph of exactly 90-110 words. If the savings opportunity is less than $100, describe the stack as optimal. Otherwise, be specific with dollar amounts, mention the top 1-2 recommendations, and end with an actionable next step. Do not use bullet points. Do not use headers. Plain paragraph only.
   
   Data:
   - Team size: ${teamSize}
   - Primary use case: ${useCase}
   - Total monthly savings opportunity: $${totalMonthlySavings}
   - Total annual savings opportunity: $${totalAnnualSavings}
   - Top recommendations: ${topRecs || 'None identified'}`;

  try {
    if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY is not set');
    }

    const message = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';

    return { summary: text, isFallback: false };
  } catch (error) {
    console.error('Anthropic API error:', error);
    
    // Fallback template
    const isOptimal = totalMonthlySavings < 100;
    
    if (isOptimal) {
      return {
        summary: `Your team's AI stack is well-optimized. Your current selection is correctly sized for a ${teamSize}-person team focused on ${useCase} tasks. No immediate changes needed — review again when your team size or usage volume increases significantly.`,
        isFallback: true,
      };
    }

    const topRec = recommendations.find(r => r.recommendedAction !== 'keep')?.reasoning || "Reviewing subscriptions quarterly";
    const totalSpend = recommendations.reduce((sum, r) => sum + r.currentMonthlySpend, 0);
    const fallback = `Based on your audit, your team of ${teamSize} is spending $${totalSpend.toFixed(2)}/month on AI tools with $${totalMonthlySavings.toFixed(2)}/month in potential monthly savings. We recommend ${topRec}. SpendWise AI recommends reviewing your subscriptions quarterly to maintain an optimal stack and avoid redundant costs.`;
    
    return {
      summary: fallback,
      isFallback: true,
    };
  }
}
