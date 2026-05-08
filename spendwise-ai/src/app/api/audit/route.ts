import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runAudit } from '@/lib/audit-engine';
import { supabaseAdmin } from '@/lib/supabase';
import { generateSummary } from '@/lib/anthropic';
import { ApiResponse, FormData as AuditFormData, UseCase } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const toolInputSchema = z.object({
  toolId: z.string(),
  planId: z.string(),
  seats: z.number().min(1),
  monthlySpend: z.number().min(0),
});

const auditSchema = z.object({
  teamSize: z.number().min(1).max(500),
  useCase: z.enum(['coding', 'writing', 'data', 'research', 'mixed']),
  tools: z.array(toolInputSchema).min(1).max(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 1. Validate
    const validation = auditSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: validation.error.message,
      }, { status: 400 });
    }

    const formData = validation.data as unknown as AuditFormData;
    const auditResults = runAudit(formData);

    // 3. Generate AI Summary
    const summaryResult = await generateSummary({
      recommendations: auditResults.recommendations,
      totalMonthlySavings: auditResults.totalMonthlySavings,
      totalAnnualSavings: auditResults.totalAnnualSavings,
      useCase: formData.useCase as UseCase,
      teamSize: formData.teamSize,
    });

    // 4. Save to Supabase
    const publicToken = uuidv4();
    const { data: audit, error } = await supabaseAdmin
      .from('audits')
      .insert({
        team_size: formData.teamSize,
        primary_use_case: formData.useCase,
        tools: formData.tools,
        results: auditResults.recommendations,
        total_monthly_savings: auditResults.totalMonthlySavings,
        total_annual_savings: auditResults.totalAnnualSavings,
        ai_summary: summaryResult.summary,
        is_high_savings: auditResults.isHighSavings,
        public_token: publicToken,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Failed to save audit',
      }, { status: 500 });
    }

    // 5. Return
    return NextResponse.json<ApiResponse<{ id: string; publicToken: string }>>({
      success: true,
      data: {
        id: audit.id,
        publicToken: publicToken,
      },
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('API Audit Error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: message,
    }, { status: 500 });
  }
}
