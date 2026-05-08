"use client";

import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (totalMonthlySavings <= 0) {
      setCount(0);
      return;
    }
    
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
      <div className="border border-[#1a1a1a] rounded-lg bg-[#0a0a0a] p-8 text-center">
        <div className="flex flex-col items-center max-w-2xl mx-auto space-y-4">
          <CheckCircle2 className="h-8 w-8 text-[#00e5a0]" />
          <h1 className="text-[32px] md:text-[40px] font-bold tracking-[-0.04em] text-[#ededed] leading-tight">
            You&apos;re spending efficiently
          </h1>
          <p className="text-[14px] text-[#666666] leading-[1.6]">
            Your AI stack is well-optimized for your team size and use case.
          </p>
          <div className="text-[11px] tracking-[0.1em] uppercase text-[#666666] border border-[#1a1a1a] px-3 py-1 rounded-full">
            OPTIMIZED STACK
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#1a1a1a] rounded-lg bg-[#0a0a0a] p-8 text-center">
      <div className="flex flex-col items-center">
        <h2 className="text-[11px] tracking-[0.1em] uppercase text-[#666666] mb-4 font-medium">
          POTENTIAL MONTHLY SAVINGS
        </h2>
        
        <div className="flex items-center justify-center">
          <span className="text-[80px] font-bold tracking-[-0.04em] text-[#00e5a0] leading-none">
            ${isMounted ? count.toLocaleString() : "0"}
          </span>
        </div>
        
        <p className="text-[14px] text-[#666666] mt-4 font-medium">
          ${totalAnnualSavings.toLocaleString()} per year
        </p>

        {isHighSavings && (
          <div className="mt-8 border border-[#00e5a0]/20 rounded-lg bg-[#001a12] p-6 text-left w-full max-w-2xl">
            <h3 className="text-[13px] font-medium text-[#00e5a0] uppercase tracking-wider">
              Qualify for Credex credits
            </h3>
            <p className="text-[12px] text-[#666666] mt-2 leading-relaxed">
              Teams saving $500+/mo can access discounted AI credits through Credex. We&apos;ve saved startups over $2.4M in software waste this year.
            </p>
            <button 
              onClick={() => {
                const element = document.getElementById('consult-trigger');
                if (element) element.click();
              }}
              className="text-[12px] text-[#00e5a0] mt-3 inline-block hover:underline font-medium"
            >
              Book consultation →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
