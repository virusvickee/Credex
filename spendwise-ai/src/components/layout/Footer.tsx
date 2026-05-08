import React from 'react';

export const Footer = () => {
  return (
    <footer className="border-t border-[#111111] py-8 text-center bg-[#000000]">
      <div className="container max-w-[1200px] mx-auto px-4">
        <p className="text-[13px] text-[#444444]">
          SpendWise AI by Credex
        </p>
        
        <div className="flex items-center justify-center gap-4 text-[11px] text-[#333333] mt-4 tracking-[0.05em] uppercase font-medium">
          <span className="hover:text-[#666666] cursor-pointer transition-colors">Privacy</span>
          <span>·</span>
          <span className="hover:text-[#666666] cursor-pointer transition-colors">Terms</span>
          <span>·</span>
          <span className="hover:text-[#666666] cursor-pointer transition-colors">Contact</span>
        </div>
      </div>
    </footer>
  );
};
