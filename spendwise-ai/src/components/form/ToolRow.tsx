"use client";

import React, { useState, useEffect } from 'react';
import { X, Calculator } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

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
    <div className="relative group bg-slate-900/50 border border-slate-800 rounded-2xl p-4 md:p-6 transition-all hover:border-slate-700">
      <Button
        variant="ghost"
        size="icon"
        className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-red-500/20 transition-colors z-10"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        {/* Tool Info */}
        <div className="md:col-span-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 overflow-hidden">
            {/* Fallback to emoji if needed, but here we just use name for now */}
            <span className="text-xl">
              {toolId === 'cursor' && '🚀'}
              {toolId === 'github_copilot' && '🐙'}
              {toolId === 'claude' && '🤖'}
              {toolId === 'chatgpt' && '💬'}
              {toolId === 'anthropic_api' && '🏗️'}
              {toolId === 'openai_api' && '⚙️'}
              {toolId === 'gemini' && '✨'}
              {toolId === 'windsurf' && '🏄'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-100">{toolInfo.name}</h3>
            <p className="text-xs text-slate-500 capitalize">{toolInfo.category}</p>
          </div>
        </div>

        {/* Plan Selector */}
        <div className="md:col-span-3 space-y-2">
          <Label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Plan</Label>
          <Select value={toolData.planId} onValueChange={handlePlanChange}>
            <SelectTrigger className="bg-slate-950 border-slate-800 focus:ring-emerald-500/20">
              <SelectValue placeholder="Select plan" />
            </SelectTrigger>
            <SelectContent className="bg-slate-950 border-slate-800">
              {toolInfo.plans.map(plan => (
                <SelectItem key={plan.id} value={plan.id} className="focus:bg-slate-900 focus:text-emerald-400">
                  {plan.name} (${plan.monthlyPricePerSeat}/seat)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Seats */}
        <div className="md:col-span-2 space-y-2">
          <Label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Seats</Label>
          <Input
            type="number"
            min="1"
            value={toolData.seats}
            onChange={handleSeatsChange}
            className="bg-slate-950 border-slate-800 focus:ring-emerald-500/20"
          />
        </div>

        {/* Monthly Spend */}
        <div className="md:col-span-4 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Monthly Spend</Label>
            <div className="flex items-center gap-2">
               <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Calculator className="h-3 w-3" /> Auto
               </span>
               <Switch 
                checked={isAutoCalc} 
                onCheckedChange={(checked) => {
                  setIsAutoCalc(checked);
                  if (checked && currentPlan) {
                    updateTool(toolId, { monthlySpend: currentPlan.monthlyPricePerSeat * toolData.seats });
                  }
                }}
                className="data-[state=checked]:bg-emerald-500"
               />
            </div>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={toolData.monthlySpend}
              onChange={handleSpendChange}
              className="bg-slate-950 border-slate-800 pl-7 focus:ring-emerald-500/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
