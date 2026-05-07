"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LegacyAuditResult } from "@/types";

export function AIsummary({ audit }: { audit: LegacyAuditResult }) {
  const [summary, setSummary] = useState(audit.summary ?? "");

  async function generateSummary() {
    const response = await fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audit }),
    });
    const data = await response.json();
    setSummary(data.summary);
  }

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>AI summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-zinc-600">
          {summary || "Generate a concise executive summary for this audit."}
        </p>
        <Button type="button" variant="secondary" onClick={generateSummary}>
          Generate summary
        </Button>
      </CardContent>
    </Card>
  );
}
