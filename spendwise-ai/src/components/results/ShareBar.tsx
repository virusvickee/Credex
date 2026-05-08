"use client";

import React, { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShareBarProps {
  auditId: string;
  totalMonthlySavings: number;
}

export function ShareBar({ auditId, totalMonthlySavings }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/audit/${auditId}?public=true`;

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

  const tweetText = `I just found $${totalMonthlySavings}/mo in AI tool savings using SpendWise AI! Get your free audit here: ${shareUrl}`;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-slate-900/30 border border-slate-800 rounded-3xl backdrop-blur-sm">
      <div className="flex items-center gap-4 flex-1 w-full overflow-hidden">
        <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
          <Share2 className="h-4 w-4 text-slate-400" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Public Share Link</p>
          <p className="text-sm text-slate-300 font-mono truncate">{shareUrl}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={copyToClipboard}
          className="bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-200 rounded-xl"
        >
          {copied ? <Check className="h-4 w-4 mr-2 text-emerald-400" /> : <Copy className="h-4 w-4 mr-2" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-6">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mr-2 hidden lg:block">Share on</p>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank')}
        >
          <Share2 className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')}
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
