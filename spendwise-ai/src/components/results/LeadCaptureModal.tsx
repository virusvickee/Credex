"use client";

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface LeadCaptureModalProps {
  auditId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function LeadCaptureModal({ auditId, isOpen, onClose }: LeadCaptureModalProps) {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditId, email, companyName, role }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Consultation requested!");
        onClose();
      } else {
        throw new Error(result.error || "Failed to submit request");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border border-[#1a1a1a] sm:max-w-[440px] rounded-xl p-8 outline-none">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-[22px] font-semibold tracking-[-0.02em] text-[#ededed]">
            Talk to Credex
          </DialogTitle>
          <DialogDescription className="text-[14px] text-[#666666] leading-relaxed">
            High-savings teams can book a deeper vendor and renewal review. We&apos;ll help you negotiate your next contract.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#666666] block">
              Work Email
            </Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="founder@company.com" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#000000] border border-[#1a1a1a] rounded-md px-3 py-2 text-[14px] text-[#ededed] focus:border-[#333333] focus:outline-none placeholder:text-[#444444] h-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company" className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#666666] block">
                Company
              </Label>
              <Input 
                id="company" 
                placeholder="Acme Inc" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="bg-[#000000] border border-[#1a1a1a] rounded-md px-3 py-2 text-[14px] text-[#ededed] focus:border-[#333333] focus:outline-none placeholder:text-[#444444] h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#666666] block">
                Your Role
              </Label>
              <Input 
                id="role" 
                placeholder="CTO" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-[#000000] border border-[#1a1a1a] rounded-md px-3 py-2 text-[14px] text-[#ededed] focus:border-[#333333] focus:outline-none placeholder:text-[#444444] h-10"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-6 rounded-md bg-[#00e5a0] text-[#000000] text-[14px] font-semibold hover:bg-[#00c988] active:scale-[0.99] transition-all duration-150 cursor-pointer uppercase tracking-wider"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ANALYZING...
                </>
              ) : (
                "Request Consultation"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
