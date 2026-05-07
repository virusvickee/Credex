"use client";

import React, { useEffect, useState } from 'react';
import { TrendingUp, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SavingsHeroProps {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isHighSavings: boolean;
  isOptimal: boolean;
}

export const SavingsHero: React.FC<SavingsHeroProps> = ({
  totalMonthlySavings,
  totalAnnualSavings,
  isHighSavings,
  isOptimal,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (totalMonthlySavings <= 0) return;
    
    let start = 0;
    const end = totalMonthlySavings;
    const duration = 1500;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [totalMonthlySavings]);

  if (isOptimal) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-emerald-500/5 border border-emerald-500/20 p-8 md:p-12">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="relative flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            You're spending efficiently ✓
          </h1>
          <p className="text-lg text-slate-400">
            Your AI stack is well-optimized for your team size and use case. 
            Great job maintaining a lean operations model.
          </p>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1">
            OPTIMIZED STACK
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900/50 border border-slate-800 p-8 md:p-12">
      {/* Background glow */}
      <div className={`absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 rounded-full blur-[120px] ${isHighSavings ? 'bg-orange-500/10' : 'bg-emerald-500/10'}`}></div>
      
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            {isHighSavings ? (
               <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20 px-3 py-1">
                <Zap className="h-3 w-3 mr-2" />
                CRITICAL SAVINGS FOUND
               </Badge>
            ) : (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1">
                <TrendingUp className="h-3 w-3 mr-2" />
                OPTIMIZATION OPPORTUNITY
              </Badge>
            )}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            {isHighSavings ? "You're overspending on AI tools" : "Identify your savings potential"}
          </h1>
          
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className={`text-6xl md:text-8xl font-black tracking-tighter ${isHighSavings ? 'text-orange-400' : 'text-emerald-400'}`}>
                ${count.toLocaleString()}
              </span>
              <span className="text-2xl text-slate-500 font-medium">/mo</span>
            </div>
            <p className="text-xl text-slate-400 font-medium">
              That's <span className="text-slate-200">${totalAnnualSavings.toLocaleString()} per year</span> 
              {isHighSavings && ` — enough for ~${Math.floor(totalAnnualSavings / 15000)} months of a dev salary.`}
            </p>
          </div>
        </div>

        <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-white mb-4">Want to capture even more?</h3>
          <p className="text-slate-400 mb-6 text-sm leading-relaxed">
            High-savings teams can book a deeper vendor and renewal review with the Credex team. 
            We've saved startups over $2.4M in software waste this year.
          </p>
          <Button className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
            Get a deeper review
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
