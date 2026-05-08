"use client";

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ShareBarProps {
  auditId: string;
}

export function ShareBar({ auditId }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')}/audit/${auditId}?public=true`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="border border-[#1a1a1a] rounded-lg bg-[#0a0a0a] p-5">
      <h2 className="text-[11px] tracking-[0.1em] uppercase text-[#666666] mb-3 font-medium">
        SHARE YOUR AUDIT
      </h2>
      
      <div className="flex items-center gap-2 border border-[#1a1a1a] rounded-md bg-[#000000] px-3 py-2">
        <p className="text-[13px] text-[#555555] truncate flex-1 font-medium">
          {shareUrl}
        </p>
        
        <button 
          onClick={copyToClipboard}
          className={`text-[12px] font-medium px-3 py-1 rounded-md border transition-colors flex items-center gap-2 ${
            copied 
              ? "text-[#00e5a0] border-[#00e5a0]/30" 
              : "text-[#ededed] border-[#1a1a1a] hover:border-[#333333]"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              COPIED
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              COPY
            </>
          )}
        </button>
      </div>
    </div>
  );
}
