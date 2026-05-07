"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { LegacyAuditResult } from "@/types";

export function LeadCaptureModal({ audit }: { audit: LegacyAuditResult }) {
  const [email, setEmail] = useState("");

  async function submitLead() {
    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auditId: audit.id, email }),
    });
    setEmail("");
  }

  return (
    <Card className="rounded-lg border-emerald-200">
      <CardHeader>
        <CardTitle>Talk to Credex</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-6 text-zinc-600">
          High-savings teams can book a deeper vendor and renewal review.
        </p>
        <Input value={email} type="email" placeholder="founder@company.com" onChange={(event) => setEmail(event.target.value)} />
        <Button type="button" className="w-full" onClick={submitLead} disabled={!email}>
          Request consultation
        </Button>
      </CardContent>
    </Card>
  );
}
