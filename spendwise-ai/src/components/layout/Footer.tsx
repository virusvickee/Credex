import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full py-12 border-t border-slate-900 bg-slate-950">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white tracking-tighter">
              SPENDWISE <span className="text-emerald-500">AI</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-sm text-slate-500 font-medium tracking-tight">by Credex</span>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-slate-400">
              Pricing data verified weekly. Helping startups build efficient AI stacks.
            </p>
            <p className="text-xs text-slate-600">
              &copy; {new Date().getFullYear()} SpendWise AI by Credex · credex.rocks
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">
            <span className="hover:text-emerald-400 cursor-pointer transition-colors">Privacy</span>
            <span className="w-1 h-1 rounded-full bg-slate-800"></span>
            <span className="hover:text-emerald-400 cursor-pointer transition-colors">Terms</span>
            <span className="w-1 h-1 rounded-full bg-slate-800"></span>
            <span className="hover:text-emerald-400 cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
