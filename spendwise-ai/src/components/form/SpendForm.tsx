"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ArrowRight, Loader2, Users, MousePointer2, Sparkles } from 'lucide-react';
import { useFormStore } from '@/store/formStore';
import { TOOLS, TOOL_LIST } from '@/lib/pricing-data';
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
import { Badge } from '@/components/ui/badge';
// import { toast } from '@/components/ui/toast'; // removed unused import
import { UseCase } from '@/types';

export const SpendForm = () => { /* Scroll anchor */
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
    } catch (error: any) {
      console.error('Audit submission error:', error);
      // Fallback if toast component is not fully wired up with a provider
      alert(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="audit-form" className="w-full max-w-5xl mx-auto space-y-12 pb-24">
      {/* SECTION 1 — Hero header */}
      <div className="text-center space-y-4 pt-12">
        <div className="flex justify-center mb-4">
          <Badge variant="outline" className="bg-emerald-500/5 text-emerald-400 border-emerald-500/20 px-3 py-1 animate-pulse">
            <Users className="h-3 w-3 mr-2" />
            Used by 500+ startup teams {/* MOCK DATA: For demonstration only */}
          </Badge>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Find out if you're <span className="text-emerald-400">overpaying</span> for AI tools
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
          Get a free audit in 60 seconds. No login required. 
          Stop the subscription bleed and optimize your AI stack.
        </p>
      </div>

      {/* SECTION 2 — Team context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-slate-900/30 border border-slate-800 rounded-3xl backdrop-blur-sm">
        <div className="space-y-3">
          <Label htmlFor="team-size" className="text-sm font-semibold text-slate-200">Total Team Size</Label>
          <div className="relative">
             <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
             <Input
                id="team-size"
                type="number"
                min="1"
                max="500"
                value={teamSize}
                onChange={(e) => setTeamSize(Math.max(1, parseInt(e.target.value) || 1))}
                className="bg-slate-950 border-slate-800 pl-10 h-12 focus:ring-emerald-500/20 text-lg"
              />
          </div>
          <p className="text-xs text-slate-500">We use this to calculate benchmark per-seat pricing.</p>
        </div>

        <div className="space-y-3">
          <Label htmlFor="use-case" className="text-sm font-semibold text-slate-200">Primary Use Case</Label>
          <Select value={useCase} onValueChange={(v) => setUseCase(v as UseCase)}>
            <SelectTrigger id="use-case" className="bg-slate-950 border-slate-800 h-12 focus:ring-emerald-500/20 text-lg">
              <SelectValue placeholder="Select use case" />
            </SelectTrigger>
            <SelectContent className="bg-slate-950 border-slate-800 text-slate-200">
              <SelectItem value="coding">Coding (Dev teams)</SelectItem>
              <SelectItem value="writing">Writing & Marketing</SelectItem>
              <SelectItem value="research">Data & Research</SelectItem>
              <SelectItem value="mixed">Mixed Usage</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500">Helps us suggest more efficient alternative tools.</p>
        </div>
      </div>

      {/* SECTION 3 — Tool list */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <MousePointer2 className="h-5 w-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Which AI tools do you pay for?</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {TOOL_LIST.map((tool) => {
            const selected = hasToolById(tool.id);
            return (
              <button
                key={tool.id}
                onClick={() => selected ? removeTool(tool.id) : addTool(tool.id)}
                className={`
                  relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 group
                  ${selected 
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-900'}
                `}
              >
                {selected && (
                  <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-0.5 animate-in zoom-in duration-300">
                    <Check className="h-3 w-3 text-slate-950" />
                  </div>
                )}
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {tool.id === 'cursor' && '🚀'}
                  {tool.id === 'github_copilot' && '🐙'}
                  {tool.id === 'claude' && '🤖'}
                  {tool.id === 'chatgpt' && '💬'}
                  {tool.id === 'anthropic_api' && '🏗️'}
                  {tool.id === 'openai_api' && '⚙️'}
                  {tool.id === 'gemini' && '✨'}
                  {tool.id === 'windsurf' && '🏄'}
                </span>
                <span className="text-sm font-medium">{tool.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 4 — Added tools */}
      <div className="space-y-6 min-h-[300px]">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">Audit Details</h2>
        </div>

        <div className="space-y-4">
          {tools.length > 0 ? (
            tools.map((tool) => (
              <div key={tool.toolId} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <ToolRow 
                  toolId={tool.toolId} 
                  onRemove={() => removeTool(tool.toolId)} 
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl text-center">
              <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4 text-slate-700">
                <MousePointer2 className="h-8 w-8" />
              </div>
              <h3 className="text-slate-300 font-medium mb-1">No tools selected yet</h3>
              <p className="text-slate-500 text-sm">Select the AI tools you pay for above to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 5 — Submit button */}
      <div className="flex flex-col items-center pt-8 border-t border-slate-900">
        <Button
          size="lg"
          disabled={tools.length === 0 || isSubmitting}
          onClick={handleSubmit}
          className="h-16 px-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xl font-bold transition-all hover:scale-105 active:scale-95 disabled:bg-slate-800 disabled:text-slate-600 disabled:scale-100 shadow-[0_0_40px_rgba(16,185,129,0.2)] hover:shadow-[0_0_60px_rgba(16,185,129,0.3)]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
              Running Audit...
            </>
          ) : (
            <>
              Run My Audit
              <ArrowRight className="ml-3 h-6 w-6" />
            </>
          )}
        </Button>
        <p className="mt-4 text-sm text-slate-500">
          Takes about 5 seconds. Results are private and non-binding.
        </p>
      </div>
    </div>
  );
};
