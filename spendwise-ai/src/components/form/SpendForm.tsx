"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, MousePointer2, DollarSign, Zap, TrendingDown } from 'lucide-react';
import { useFormStore } from '@/store/formStore';
import { TOOL_LIST } from '@/lib/pricing-data';
import { ToolRow } from './ToolRow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseCase } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

const TOOL_LOGOS: Record<string, string> = {
  cursor: '/logos/cursor.png',
  github_copilot: '/logos/github-copilot.png',
  claude: '/logos/claude.png',
  chatgpt: '/logos/chatgpt.svg',
  anthropic_api: '/logos/anthropic.png',
  openai_api: '/logos/openai.svg',
  gemini: '/logos/gemini.svg',
  windsurf: '/logos/windsurf.png',
};

export const SpendForm = () => {
  const router = useRouter();
  const { 
    teamSize, 
    useCase, 
    tools, 
    setTeamSize, 
    setUseCase, 
    addTool, 
    removeTool,
    hasToolById 
  } = useFormStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (tools.length === 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamSize, useCase, tools }),
      });

      const result = await response.json();
      
      if (result.success) {
        router.push(`/audit/${result.data.id}`);
      } else {
        throw new Error(result.error || 'Failed to run audit');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      console.error('Audit submission error:', error);
      alert(message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="audit-form" className="w-full max-w-[1200px] mx-auto px-6 pb-32">
      {/* SECTION 1 — Vercel Style Hero */}
      <section className="pt-[120px] pb-[80px] max-w-[640px] mx-auto text-center">
        <div className="inline-flex items-center gap-2 border border-[#1a1a1a] rounded-full px-3 py-1 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00e5a0] animate-pulse" />
          <span className="text-[11px] text-[#666666] tracking-[0.05em] uppercase font-medium">500+ teams audited</span>
        </div>
        
        <h1 className="text-[42px] md:text-[56px] font-bold tracking-[-0.04em] leading-[1.1] text-[#ededed]">
          Find out if you&apos;re <span className="text-[#00e5a0]">overpaying</span> for AI tools
        </h1>
        
        <p className="text-[16px] text-[#666666] mt-6 leading-relaxed">
          Get a free audit in 60 seconds. No login required.
        </p>
      </section>

      {/* SECTION 1.5 — Stats Bar */}
      <div className="w-full max-w-[900px] mx-auto mb-16">
        <div className="grid grid-cols-3 gap-4 border border-[#1a1a1a] rounded-lg bg-[#0a0a0a] p-6">
          <div className="flex flex-col">
            <span className="text-[28px] font-bold text-[#00e5a0] tracking-[-0.02em]">$340</span>
            <span className="text-[12px] text-[#666666] mt-1">avg monthly savings found</span>
          </div>
          <div className="flex flex-col border-x border-[#1a1a1a] px-4">
            <span className="text-[28px] font-bold text-[#00e5a0] tracking-[-0.02em]">60s</span>
            <span className="text-[12px] text-[#666666] mt-1">to complete an audit</span>
          </div>
          <div className="flex flex-col pl-4">
            <span className="text-[28px] font-bold text-[#00e5a0] tracking-[-0.02em]">8</span>
            <span className="text-[12px] text-[#666666] mt-1">AI tools supported</span>
          </div>
        </div>
      </div>

      {/* SECTION 1.6 — How it works */}
      <section id="how-it-works" className="w-full max-w-[900px] mx-auto py-[80px] px-4">
        <h2 className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#666666] text-center mb-4">
          HOW IT WORKS
        </h2>
        <h3 className="text-[32px] font-bold tracking-[-0.02em] text-[#ededed] text-center mb-16">
          Three steps to a leaner AI stack
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="border border-[#1a1a1a] rounded-lg bg-[#0a0a0a] p-6 hover:border-[#333333] transition-colors duration-200 relative">
            <div className="text-[11px] font-mono text-[#333333] mb-4">01</div>
            <DollarSign className="w-8 h-8 text-[#00e5a0] mb-4" strokeWidth={1.5} />
            <h4 className="text-[15px] font-semibold text-[#ededed] mb-2">Enter your tools</h4>
            <p className="text-[13px] text-[#666666] leading-relaxed">
              Select the AI tools your team pays for. Add your plan, seat count, and monthly spend for each one.
            </p>
            <div className="hidden md:block absolute right-[-20px] top-[50%] -translate-y-1/2 text-[#333333] z-10">
              →
            </div>
          </div>

          {/* Step 2 */}
          <div className="border border-[#1a1a1a] rounded-lg bg-[#0a0a0a] p-6 hover:border-[#333333] transition-colors duration-200 relative">
            <div className="text-[11px] font-mono text-[#333333] mb-4">02</div>
            <Zap className="w-8 h-8 text-[#00e5a0] mb-4" strokeWidth={1.5} />
            <h4 className="text-[15px] font-semibold text-[#ededed] mb-2">Get your audit</h4>
            <p className="text-[13px] text-[#666666] leading-relaxed">
              Our engine applies 6 financial rules to identify overspend, duplicate tools, and wrong-sized plans.
            </p>
            <div className="hidden md:block absolute right-[-20px] top-[50%] -translate-y-1/2 text-[#333333] z-10">
              →
            </div>
          </div>

          {/* Step 3 */}
          <div className="border border-[#1a1a1a] rounded-lg bg-[#0a0a0a] p-6 hover:border-[#333333] transition-colors duration-200 relative">
            <div className="text-[11px] font-mono text-[#333333] mb-4">03</div>
            <TrendingDown className="w-8 h-8 text-[#00e5a0] mb-4" strokeWidth={1.5} />
            <h4 className="text-[15px] font-semibold text-[#ededed] mb-2">See your savings</h4>
            <p className="text-[13px] text-[#666666] leading-relaxed">
              Get a shareable report with specific recommendations and exact dollar savings per tool.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Team Context (Vercel Style Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
        <div className="border border-[#1a1a1a] border-l-2 border-l-[#00e5a0] rounded-lg bg-[#0a0a0a] p-5 hover:border-[#333333] transition-colors duration-200">
          <Label htmlFor="team-size" className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#666666] mb-3 block">
            Total Team Size
          </Label>
          <Input
            id="team-size"
            type="number"
            min="1"
            max="500"
            value={teamSize}
            onChange={(e) => setTeamSize(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full bg-[#000000] border border-[#1a1a1a] rounded-md px-3 py-2 text-[14px] text-[#ededed] focus:border-[#333333] focus:outline-none placeholder:text-[#444444] h-10"
          />
        </div>

        <div className="border border-[#1a1a1a] border-l-2 border-l-[#00e5a0] rounded-lg bg-[#0a0a0a] p-5 hover:border-[#333333] transition-colors duration-200">
          <Label htmlFor="use-case" className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#666666] mb-3 block">
            Primary Focus
          </Label>
          <Select value={useCase} onValueChange={(v) => setUseCase(v as UseCase)}>
            <SelectTrigger id="use-case" className="w-full bg-[#000000] border border-[#1a1a1a] rounded-md px-3 py-2 text-[14px] text-[#ededed] focus:border-[#333333] focus:outline-none h-10">
              <SelectValue placeholder="Select focus" />
            </SelectTrigger>
            <SelectContent className="bg-[#0a0a0a] border border-[#1a1a1a] text-[#ededed]">
              <SelectItem value="coding">Coding (Dev teams)</SelectItem>
              <SelectItem value="writing">Writing & Marketing</SelectItem>
              <SelectItem value="research">Data & Research</SelectItem>
              <SelectItem value="mixed">Mixed Usage</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* SECTION 3 — Tool Selector Grid */}
      <div className="mb-20">
        <h2 className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#666666] text-center mb-6">
          SELECT YOUR PAID TOOLS
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TOOL_LIST.map((tool) => {
            const selected = hasToolById(tool.id);
            return (
              <button
                key={tool.id}
                onClick={() => selected ? removeTool(tool.id) : addTool(tool.id)}
                className={`
                  relative flex flex-col items-center justify-center h-32 rounded-lg border transition-all duration-150 cursor-pointer group
                  ${selected 
                    ? 'bg-[#001a12] border-[#00e5a0]' 
                    : 'bg-[#0a0a0a] border-[#1a1a1a] hover:border-[#333333] hover:bg-[#111111]'}
                `}
              >
                {selected && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#00e5a0] flex items-center justify-center">
                    <span className="text-[#000000] text-[10px]">✓</span>
                  </span>
                )}
                <span className="w-9 h-9 relative mb-3 grayscale group-hover:grayscale-0 transition-all block">
                  <Image
                    src={TOOL_LOGOS[tool.id]}
                    alt={tool.name}
                    fill
                    className="object-contain"
                  />
                </span>
                <span className="text-[11px] font-medium tracking-[0.06em] uppercase text-[#a1a1a1]">
                  {tool.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 4 — Tool Detail Rows */}
      <div className="mb-20">
        <h2 className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#666666] text-center mb-6">
          AUDIT DETAILS
        </h2>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {tools.length > 0 ? (
              tools.map((tool) => (
                <motion.div 
                  key={tool.toolId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <ToolRow 
                    toolId={tool.toolId} 
                    onRemove={() => removeTool(tool.toolId)} 
                  />
                </motion.div>
              ))
            ) : (
              <div className="border border-dashed border-[#1a1a1a] rounded-lg p-12 flex flex-col items-center text-center">
                <MousePointer2 className="text-[#333333] w-8 h-8 mb-4" />
                <h3 className="text-[14px] text-[#444444] font-medium">No tools added yet</h3>
                <p className="text-[13px] text-[#333333] mt-1">Select the AI tools you pay for above</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* SECTION 5 — Submit */}
      <div className="flex flex-col items-center max-w-[400px] mx-auto">
        {tools.length === 0 ? (
          <div className="w-full py-3 rounded-md bg-[#0a0a0a] border border-[#1a1a1a] text-[#333333] text-[14px] font-medium cursor-not-allowed text-center uppercase tracking-wider">
            SELECT TOOLS TO CONTINUE
          </div>
        ) : (
          <Button
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="w-full py-6 rounded-md bg-[#00e5a0] text-[#000000] text-[14px] font-semibold hover:bg-[#00c988] active:scale-[0.99] transition-all duration-150 cursor-pointer uppercase tracking-wider"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ANALYZING...
              </>
            ) : (
              <>
                ANALYZE MY SPEND →
              </>
            )}
          </Button>
        )}
        <p className="mt-4 text-[11px] font-medium text-[#666666] uppercase tracking-[0.1em]">
          Results are instant & private
        </p>
      </div>
    </div>
  );
};
