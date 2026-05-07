import type { LegacyAuditResult } from "@/types";
import { AIsummary } from "@/components/results/AIsummary";
import { LeadCaptureModal } from "@/components/results/LeadCaptureModal";
import { SavingsHero } from "@/components/results/SavingsHero";
import { ShareBar } from "@/components/results/ShareBar";
import { ToolBreakdown } from "@/components/results/ToolBreakdown";

type AuditResultsProps = {
  audit: LegacyAuditResult | null;
  auditId: string;
};

export function AuditResults({ audit, auditId }: AuditResultsProps) {
  if (!audit) {
    return (
      <div className="rounded-lg border bg-white p-8">
        <h1 className="text-2xl font-semibold">Audit not found</h1>
        <p className="mt-2 text-zinc-600">Connect Supabase or create a new audit to view persisted results.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SavingsHero audit={audit} />
      <ShareBar auditId={auditId} />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <ToolBreakdown audit={audit} />
        <div className="space-y-6">
          <AIsummary audit={audit} />
          <LeadCaptureModal audit={audit} />
        </div>
      </div>
    </div>
  );
}
