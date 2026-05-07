import { NextResponse } from "next/server";
import { z } from "zod";
import { resend } from "@/lib/resend";
import { getSupabaseAdmin } from "@/lib/supabase";

const leadSchema = z.object({
  auditId: z.string().uuid(),
  email: z.string().email(),
  company: z.string().optional(),
});

export async function POST(request: Request) {
  const lead = leadSchema.parse(await request.json());
  const supabase = getSupabaseAdmin();

  if (supabase) {
    await supabase.from("leads").insert(lead);
  }

  if (resend) {
    await resend.emails.send({
      from: "SpendWise AI <hello@credex.example>",
      to: lead.email,
      subject: "Credex received your SpendWise AI audit request",
      text: "Thanks for requesting a Credex consultation. We will follow up shortly.",
    });
  }

  return NextResponse.json({ ok: true });
}
