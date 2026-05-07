import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateAudit } from "@/lib/audit-engine";
import { getSupabaseAdmin } from "@/lib/supabase";

const auditSchema = z.object({
  tools: z.array(z.object({
    id: z.string(),
    name: z.string().min(1),
    category: z.enum(["coding", "design", "writing", "meeting", "search", "other"]),
    seats: z.number().min(1),
    monthlyCost: z.number().min(0),
    billingCycle: z.enum(["monthly", "annual"]),
    usageScore: z.number().min(0).max(100),
  })).min(1),
});

export async function POST(request: Request) {
  const payload = auditSchema.parse(await request.json());
  const audit = calculateAudit(payload.tools);
  const supabase = getSupabaseAdmin();

  if (supabase) {
    await supabase.from("audits").insert({ id: audit.id, payload: audit });
  }

  return NextResponse.json(audit);
}
