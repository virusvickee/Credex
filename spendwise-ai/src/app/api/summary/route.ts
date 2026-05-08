import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateSummary } from '@/lib/anthropic';
import { ApiResponse } from '@/types';

const summarySchema = z.object({
  recommendations: z.array(z.unknown()),
  totalMonthlySavings: z.number(),
  totalAnnualSavings: z.number(),
  useCase: z.string(),
  teamSize: z.number(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 1. Validate
    const validation = summarySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: validation.error.message,
      }, { status: 400 });
    }

    // 2. Call generateSummary
    const result = await generateSummary(validation.data as Parameters<typeof generateSummary>[0]);

    // 3. Return
    return NextResponse.json<ApiResponse<{ summary: string; isFallback: boolean }>>({
      success: true,
      data: result,
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('API Summary Error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: message,
    }, { status: 500 });
  }
}
