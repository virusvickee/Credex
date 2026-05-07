"use client";

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const Header = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('audit-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-xl">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tighter text-white">
              SPENDWISE <span className="text-emerald-500">AI</span>
            </span>
          </Link>
          <Badge variant="secondary" className="hidden sm:flex bg-slate-900 text-slate-400 border-slate-800 font-normal">
            by Credex
          </Badge>
        </div>

        <nav className="flex items-center gap-6">
          <Link 
            href="#how-it-works" 
            className="hidden md:block text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors"
          >
            How it works
          </Link>
          <Button 
            onClick={scrollToForm}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-full text-xs sm:text-sm px-6"
          >
            Get audit free →
          </Button>
        </nav>
      </div>
    </header>
  );
};
