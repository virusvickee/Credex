import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { LegacyAuditResult } from "@/types";

export function ToolBreakdown({ audit }: { audit: LegacyAuditResult }) {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Tool breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {audit.tools.map((tool) => {
          const recommendation = audit.recommendations.find((item) => item.toolId === tool.id);

          return (
            <div key={tool.id} className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{tool.name}</p>
                  <p className="text-sm text-zinc-500">{tool.seats} seats at ${tool.monthlyCost}/seat</p>
                </div>
                <p className="font-semibold">${(tool.seats * tool.monthlyCost).toLocaleString()}/mo</p>
              </div>
              {recommendation ? (
                <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-900">
                  {recommendation.recommendation}
                </p>
              ) : null}
              <Separator />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
