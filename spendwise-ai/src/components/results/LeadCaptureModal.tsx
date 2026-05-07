"use client";

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail, Building2, UserCircle, ArrowRight } from "lucide-react";

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
        toast.success("Consultation requested! We'll be in touch.");
        onClose();
      } else {
        throw new Error(result.error || "Failed to submit request");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-950 border-slate-800 sm:max-w-[425px] rounded-3xl overflow-hidden p-0">
        <div className="bg-emerald-500/10 h-2 w-full"></div>
        <div className="p-8 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-white tracking-tight">Talk to Credex</DialogTitle>
            <DialogDescription className="text-slate-400 font-medium">
              High-savings teams can book a deeper vendor and renewal review. We'll help you negotiate your next contract.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-500">Work Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="founder@company.com" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-900 border-slate-800 pl-10 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-xs font-bold uppercase tracking-widest text-slate-500">Company</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input 
                    id="company" 
                    placeholder="Acme Inc" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-slate-900 border-slate-800 pl-10 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-xs font-bold uppercase tracking-widest text-slate-500">Your Role</Label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input 
                    id="role" 
                    placeholder="CTO" 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="bg-slate-900 border-slate-800 pl-10 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Request Consultation"}
                {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
