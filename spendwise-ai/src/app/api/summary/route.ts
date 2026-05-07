import { NextResponse } from "next/server";
import { z } from "zod";
import { anthropic } from "@/lib/anthropic";

const summarySchema = z.object({
  audit: z.object({
    totalMonthlySpend: z.number(),
    estimatedMonthlySavings: z.number(),
    estimatedAnnualSavings: z.number(),
    score: z.number(),
    recommendations: z.array(z.object({
      issue: z.string(),
      recommendation: z.string(),
      estimatedMonthlySavings: z.number(),
    })),
  }),
});

export async function POST(request: Request) {
  const { audit } = summarySchema.parse(await request.json());

  if (!anthropic) {
    return NextResponse.json({
      summary: `This stack spends $${audit.totalMonthlySpend.toLocaleString()} per month with an estimated $${audit.estimatedAnnualSavings.toLocaleString()} in annual savings. Prioritize the highest-savings recommendations first.`,
    });
  }

  const response = await anthropic.messages.create({
    model: "claude-3-5-haiku-latest",
    max_tokens: 220,
    messages: [{
      role: "user",
      content: `Write a concise founder-facing AI spend audit summary for this JSON: ${JSON.stringify(audit)}`,
    }],
  });

  const first = response.content[0];
  const summary = first.type === "text" ? first.text : "Summary unavailable.";

  return NextResponse.json({ summary });
}
