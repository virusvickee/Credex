"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareBar({ auditId }: { auditId: string }) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/audit/${auditId}`;

  return (
    <div className="flex items-center justify-between rounded-lg border bg-white p-4">
      <p className="truncate text-sm text-zinc-600">{url}</p>
      <Button type="button" variant="secondary" size="sm" onClick={() => navigator.clipboard.writeText(url)}>
        <Copy className="h-4 w-4" />
        Copy
      </Button>
    </div>
  );
}
