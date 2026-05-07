import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { LegacyAuditResult } from "@/types";

export function SavingsHero({ audit }: { audit: LegacyAuditResult }) {
  return (
    <Card className="rounded-lg">
      <CardContent className="grid gap-6 p-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Badge variant="secondary">Audit score {audit.score}/100</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Potential annual savings: ${audit.estimatedAnnualSavings.toLocaleString()}
          </h1>
        </div>
        <div>
          <p className="text-sm text-zinc-500">Monthly spend</p>
          <p className="mt-2 text-2xl font-semibold">${audit.totalMonthlySpend.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-zinc-500">Monthly savings</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-700">
            ${audit.estimatedMonthlySavings.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
