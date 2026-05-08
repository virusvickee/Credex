"use client";

import React from 'react';
import { Sparkles } from "lucide-react";

interface AIsummaryProps {
  summary: string;
}

export function AIsummary({ summary }: AIsummaryProps) {
  return (
    <div className="border border-[#1a1a1a] rounded-lg bg-[#0a0a0a] p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#00e5a0]" />
          <span className="text-[11px] tracking-[0.1em] text-[#666666] uppercase font-medium">AI ANALYSIS</span>
        </div>
        <div className="border border-[#1a1a1a] rounded-full px-2 py-0.5 text-[11px] text-[#444444] font-medium">
          claude haiku
        </div>
      </div>
      
      <p className="text-[14px] text-[#888888] leading-[1.7]">
        {summary}
      </p>
    </div>
  );
}
