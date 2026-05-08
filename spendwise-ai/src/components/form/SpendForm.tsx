"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ArrowRight, Loader2, Users, MousePointer2, Sparkles } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { UseCase } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div id="audit-form" className="w-full max-w-5xl mx-auto space-y-20 pb-32">
      {/* SECTION 1 — Refined Hero */}
      <section className="relative pt-20 pb-10 text-center space-y-8 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
            <Users className="h-3 w-3 mr-2" />
            Join 500+ efficiency-first teams
          </Badge>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-8xl font-black tracking-tighter text-white max-w-4xl mx-auto leading-[0.9] md:leading-[0.85]"
        >
          Stop the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-200">AI Subscription Bleed</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium"
        >
          Identify redundancies in your stack and save thousands per year. 
          Deterministic audit. No login. 60 seconds.
        </motion.p>
      </section>

      {/* SECTION 2 — Team Context (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3 p-10 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] backdrop-blur-md relative group hover:border-emerald-500/30 transition-all">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="h-24 w-24 text-white" />
          </div>
          <div className="relative space-y-4">
            <Label htmlFor="team-size" className="text-xs font-black uppercase tracking-widest text-slate-500">Total Team Size</Label>
            <div className="relative max-w-xs">
               <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
               <Input
                  id="team-size"
                  type="number"
                  min="1"
                  max="500"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Math.max(1, parseInt(e.target.value) || 1))}
                  className="bg-slate-950 border-slate-800 pl-12 h-14 rounded-2xl focus:ring-emerald-500/20 text-xl font-bold"
                />
            </div>
            <p className="text-sm text-slate-500 font-medium italic">&quot;We use this to benchmark your per-seat efficiency.&quot;</p>
          </div>
        </div>

        <div className="md:col-span-2 p-10 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] backdrop-blur-md relative group hover:border-emerald-500/30 transition-all">
          <div className="relative space-y-4">
            <Label htmlFor="use-case" className="text-xs font-black uppercase tracking-widest text-slate-500">Primary Focus</Label>
            <Select value={useCase} onValueChange={(v) => setUseCase(v as UseCase)}>
              <SelectTrigger id="use-case" className="bg-slate-950 border-slate-800 h-14 rounded-2xl focus:ring-emerald-500/20 text-lg font-bold">
                <SelectValue placeholder="Select focus" />
              </SelectTrigger>
              <SelectContent className="bg-slate-950 border-slate-800 text-slate-200 rounded-2xl">
                <SelectItem value="coding">Coding (Dev teams)</SelectItem>
                <SelectItem value="writing">Writing & Marketing</SelectItem>
                <SelectItem value="research">Data & Research</SelectItem>
                <SelectItem value="mixed">Mixed Usage</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-slate-500 font-medium italic">&quot;Helps us identify cheaper specialized alternatives.&quot;</p>
          </div>
        </div>
      </div>

      {/* SECTION 3 — Tool Selector (Modern Grid) */}
      <div className="space-y-10">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <MousePointer2 className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-black text-emerald-400 uppercase tracking-widest">Select Your Paid Tools</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
          {TOOL_LIST.map((tool) => {
            const selected = hasToolById(tool.id);
            return (
              <motion.button
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                key={tool.id}
                onClick={() => selected ? removeTool(tool.id) : addTool(tool.id)}
                className={`
                  relative flex flex-col items-center justify-center h-48 rounded-[2rem] border-2 transition-all duration-300
                  ${selected 
                    ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.1)]' 
                    : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'}
                `}
              >
                {selected && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 bg-emerald-500 rounded-full p-1"
                  >
                    <Check className="h-3 w-3 text-slate-950 font-black" />
                  </motion.div>
                )}
                <span className="text-5xl mb-4 grayscale group-hover:grayscale-0 transition-all">
                  {tool.id === 'cursor' && '🚀'}
                  {tool.id === 'github_copilot' && '🐙'}
                  {tool.id === 'claude' && '🤖'}
                  {tool.id === 'chatgpt' && '💬'}
                  {tool.id === 'anthropic_api' && '🏗️'}
                  {tool.id === 'openai_api' && '⚙️'}
                  {tool.id === 'gemini' && '✨'}
                  {tool.id === 'windsurf' && '🏄'}
                </span>
                <span className={`text-sm font-black uppercase tracking-widest ${selected ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {tool.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* SECTION 4 — Details Section */}
      <div className="space-y-10 min-h-[400px]">
        <div className="flex items-center justify-center gap-3">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-slate-800"></div>
          <div className="flex items-center gap-2 px-6 py-2 bg-slate-900 border border-slate-800 rounded-full">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Audit Details</span>
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-slate-800"></div>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {tools.length > 0 ? (
              tools.map((tool) => (
                <motion.div 
                  key={tool.toolId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <ToolRow 
                    toolId={tool.toolId} 
                    onRemove={() => removeTool(tool.toolId)} 
                  />
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 bg-slate-900/10 border-2 border-dashed border-slate-800/50 rounded-[3rem] text-center"
              >
                <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-6 border border-slate-800">
                  <MousePointer2 className="h-8 w-8 text-slate-700" />
                </div>
                <h3 className="text-slate-300 text-xl font-bold mb-2">No tools added yet</h3>
                <p className="text-slate-500 font-medium max-w-sm mx-auto">Select the AI subscriptions you pay for above to see your projected savings.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* SECTION 5 — The Big Button */}
      <div className="flex flex-col items-center pt-20">
        <motion.div
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            disabled={tools.length === 0 || isSubmitting}
            onClick={handleSubmit}
            className="h-24 px-20 rounded-[2rem] bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-2xl font-black transition-all shadow-[0_20px_80px_rgba(16,185,129,0.3)] disabled:bg-slate-800 disabled:text-slate-600 disabled:shadow-none uppercase tracking-tighter"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-4 h-8 w-8 animate-spin" />
                Auditing...
              </>
            ) : (
              <>
                Analyze My Spend
                <ArrowRight className="ml-4 h-8 w-8" />
              </>
            )}
          </Button>
        </motion.div>
        <p className="mt-8 text-sm font-bold text-slate-600 uppercase tracking-widest">
          Results are instant & private
        </p>
      </div>
    </div>
  );
};
