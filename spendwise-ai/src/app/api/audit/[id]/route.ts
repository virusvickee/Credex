import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiResponse, AuditResult } from '@/types';
import { validate as isUuid } from 'uuid';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const isPublic = req.nextUrl.searchParams.get('public') === 'true';

    // 1. Validate ID
    if (!id || !isUuid(id)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Invalid audit ID format',
      }, { status: 400 });
    }

    // 2. Fetch from Supabase
    // If it's a public request, we search by public_token instead of id
    const query = supabaseAdmin
      .from('audits')
      .select('*');
    
    if (isPublic) {
        query.eq('public_token', id);
    } else {
        query.eq('id', id);
    }

    const { data: audit, error } = await query.single();

    if (error || !audit) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Audit not found',
      }, { status: 404 });
    }

    // 4. Strip PII if public
    const result: AuditResult = {
      id: audit.id,
      publicToken: audit.public_token,
      createdAt: audit.created_at,
      formData: {
        teamSize: audit.team_size,
        useCase: audit.primary_use_case,
        tools: audit.tools,
      },
      recommendations: audit.results,
      totalMonthlySavings: audit.total_monthly_savings,
      totalAnnualSavings: audit.total_annual_savings,
      isHighSavings: audit.is_high_savings,
      isOptimal: audit.total_monthly_savings < 100,
      aiSummary: audit.ai_summary,
    };

    if (isPublic) {
      // In our mapping above we don't even include email/company_name from DB 
      // but if we were using a spread, we'd delete them here.
      // AuditResult type doesn't have email/company_name.
    }

    return NextResponse.json<ApiResponse<AuditResult>>({
      success: true,
      data: result,
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('API Get Audit Error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: message,
    }, { status: 500 });
  }
}
