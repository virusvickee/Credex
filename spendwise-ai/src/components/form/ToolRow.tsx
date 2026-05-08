"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { ToolId, ToolInput } from '@/types';
import { TOOLS, getPlanById } from '@/lib/pricing-data';
import { useFormStore } from '@/store/formStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

interface ToolRowProps {
  toolId: ToolId;
  onRemove: () => void;
}

export const ToolRow: React.FC<ToolRowProps> = ({ toolId, onRemove }) => {
  const { tools, updateTool } = useFormStore();
  const toolData = tools.find(t => t.toolId === toolId);
  const toolInfo = TOOLS[toolId];
  
  const [isAutoCalc, setIsAutoCalc] = useState(true);

  if (!toolData) return null;

  const currentPlan = getPlanById(toolId, toolData.planId);

  const handlePlanChange = (newPlanId: string) => {
    const plan = getPlanById(toolId, newPlanId);
    const updates: Partial<ToolInput> = { planId: newPlanId };
    
    if (isAutoCalc && plan) {
      updates.monthlySpend = plan.monthlyPricePerSeat * toolData.seats;
    }
    
    updateTool(toolId, updates);
  };

  const handleSeatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSeats = Math.max(1, parseInt(e.target.value) || 1);
    const updates: Partial<ToolInput> = { seats: newSeats };
    
    if (isAutoCalc && currentPlan) {
      updates.monthlySpend = currentPlan.monthlyPricePerSeat * newSeats;
    }
    
    updateTool(toolId, updates);
  };

  const handleSpendChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpend = Math.max(0, parseFloat(e.target.value) || 0);
    updateTool(toolId, { monthlySpend: newSpend });
    if (isAutoCalc) setIsAutoCalc(false);
  };

  return (
    <div className="relative group bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-5 mb-3 transition-colors hover:border-[#222222]">
      <button
        className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center text-[#444444] hover:text-[#ededed] transition-colors"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        {/* Tool Info */}
        <div className="md:col-span-3 flex items-center gap-3">
          <div className="w-8 h-8 relative grayscale group-hover:grayscale-0 transition-all">
            <Image
              src={TOOL_LOGOS[toolId]}
              alt={toolInfo.name}
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h3 className="text-[14px] font-medium text-[#ededed]">{toolInfo.name}</h3>
            <p className="text-[11px] text-[#333333] uppercase tracking-wider">{toolInfo.category}</p>
          </div>
        </div>

        {/* Plan Selector */}
        <div className="md:col-span-3 space-y-1.5">
          <Label className="text-[11px] uppercase tracking-[0.06em] text-[#555555]">Plan</Label>
          <Select value={toolData.planId} onValueChange={handlePlanChange}>
            <SelectTrigger className="bg-[#000000] border border-[#1a1a1a] rounded-md px-3 py-2 text-[13px] text-[#ededed] focus:border-[#333333] focus:outline-none h-9">
              <SelectValue placeholder="Select plan" />
            </SelectTrigger>
            <SelectContent className="bg-[#0a0a0a] border border-[#1a1a1a] text-[#ededed]">
              {toolInfo.plans.map(plan => (
                <SelectItem key={plan.id} value={plan.id} className="focus:bg-[#111111] focus:text-[#00e5a0]">
                  {plan.name} (${plan.monthlyPricePerSeat})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Seats */}
        <div className="md:col-span-2 space-y-1.5">
          <Label className="text-[11px] uppercase tracking-[0.06em] text-[#555555]">Seats</Label>
          <Input
            type="number"
            min="1"
            value={toolData.seats}
            onChange={handleSeatsChange}
            className="bg-[#000000] border border-[#1a1a1a] rounded-md px-3 py-2 text-[13px] text-[#ededed] focus:border-[#333333] focus:outline-none h-9"
          />
        </div>

        {/* Monthly Spend */}
        <div className="md:col-span-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-[11px] uppercase tracking-[0.06em] text-[#555555]">Monthly Spend</Label>
            <button 
              onClick={() => {
                const newState = !isAutoCalc;
                setIsAutoCalc(newState);
                if (newState && currentPlan) {
                  updateTool(toolId, { monthlySpend: currentPlan.monthlyPricePerSeat * toolData.seats });
                }
              }}
              className="flex items-center gap-2 group/toggle"
            >
              <span className="text-[10px] text-[#444444] uppercase tracking-widest font-bold">Auto</span>
              <span className={`w-6 h-3 rounded-full transition-colors relative block ${isAutoCalc ? 'bg-[#00e5a0]' : 'bg-[#1a1a1a]'}`}>
                <span className={`absolute top-0.5 w-2 h-2 rounded-full bg-[#000000] transition-all block ${isAutoCalc ? 'right-0.5' : 'left-0.5'}`} />
              </span>
            </button>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444444] text-[13px]">$</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={toolData.monthlySpend}
              onChange={handleSpendChange}
              className="bg-[#000000] border border-[#1a1a1a] rounded-md pl-7 pr-3 py-2 text-[13px] text-[#ededed] focus:border-[#333333] focus:outline-none h-9 w-full"
              disabled={isAutoCalc}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
