import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiResponse } from '@/types';
import { sendAuditConfirmationEmail } from '@/lib/resend';

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; resetAt: number }>();

const leadSchema = z.object({
  auditId: z.string().uuid(),
  email: z.string().email(),
  companyName: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  website: z.string().optional(), // Honeypot
});

const DISPOSABLE_DOMAINS = [
  'mailinator.com', 
  'guerrillamail.com', 
  'tempmail.com', 
  'throwaway.email',
  '10minutemail.com', 
  'yopmail.com'
];

export async function POST(req: NextRequest) {
  try {
    const ip = req.ip || 'anonymous';
    const body = await req.json();

    // 1. Validate
    const validation = leadSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: validation.error.message,
      }, { status: 400 });
    }

    const { auditId, email, companyName, role, website } = validation.data;

    // 2. Abuse Protection
    
    // a) Rate Limiting (3 per hour)
    const now = Date.now();
    const limit = rateLimit.get(ip);
    if (limit && now < limit.resetAt) {
      if (limit.count >= 3) {
        return NextResponse.json<ApiResponse<null>>({
          success: false,
          error: 'Too many submissions. Try again later.',
        }, { status: 429 });
      }
      limit.count++;
    } else {
      rateLimit.set(ip, { count: 1, resetAt: now + 3600000 });
    }

    // b) Honeypot
    if (website) {
      console.log('Honeypot triggered:', ip);
      return NextResponse.json({ success: true, data: { leadId: 'hp_' + Date.now() } });
    }

    // c) Disposable Email Check
    const domain = email.split('@')[1];
    if (DISPOSABLE_DOMAINS.includes(domain)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Please use a valid work email',
      }, { status: 400 });
    }

    // 3. Fetch Audit
    const { data: audit, error: auditError } = await supabaseAdmin
      .from('audits')
      .select('team_size, total_monthly_savings, is_high_savings, public_token')
      .eq('id', auditId)
      .single();

    if (auditError || !audit) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Audit not found',
      }, { status: 404 });
    }

    // 4. Insert into leads
    const { data: lead, error: leadError } = await supabaseAdmin
      .from('leads')
      .insert({
        audit_id: auditId,
        email,
        company_name: companyName,
        role,
        team_size: audit.team_size,
        monthly_savings: audit.total_monthly_savings,
        is_high_savings: audit.is_high_savings,
      })
      .select('id')
      .single();

    if (leadError) {
      console.error('Lead insertion error:', leadError);
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Failed to process lead',
      }, { status: 500 });
    }

    // 5. Update Audits Table
    await supabaseAdmin
      .from('audits')
      .update({ email, company_name: companyName, role })
      .eq('id', auditId);

    // 6. Send Confirmation Email
    const auditUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/audit/${audit.public_token}?public=true`;
    let emailSent = false;
    try {
      await sendAuditConfirmationEmail(email, auditUrl, audit.total_monthly_savings);
      emailSent = true;
    } catch (err) {
      console.error('Resend error:', err);
    }

    // 7. Update lead email status
    if (emailSent) {
      await supabaseAdmin
        .from('leads')
        .update({ email_sent: true })
        .eq('id', lead.id);
    }

    return NextResponse.json<ApiResponse<{ leadId: string }>>({
      success: true,
      data: { leadId: lead.id },
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('API Lead Error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: message,
    }, { status: 500 });
  }
}
