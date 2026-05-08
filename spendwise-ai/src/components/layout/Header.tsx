"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const Header = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1a1a1a] bg-[#000000] h-[64px] flex items-center">
      <div className="container max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[18px] font-semibold tracking-tight text-[#ededed]">
              SPENDWISE <span className="text-[#00e5a0]">AI</span>
            </span>
          </Link>
          <div className="hidden sm:flex border border-[#1a1a1a] text-[#666666] text-[11px] px-2 py-0.5 rounded-full">
            by Credex
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <button 
            onClick={() => scrollToSection('how-it-works')}
            className="hidden md:block text-[14px] font-medium text-[#666666] hover:text-[#ededed] transition-colors"
          >
            How it works
          </button>
          <Button 
            onClick={() => scrollToSection('audit-form')}
            className="bg-[#00e5a0] hover:bg-[#00c988] text-[#000000] text-[13px] font-medium px-4 py-1.5 rounded-md h-auto"
          >
            Get audit free
          </Button>
        </nav>
      </div>
    </header>
  );
};
