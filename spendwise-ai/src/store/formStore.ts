"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuditToolInput } from "@/types";

type FormState = {
  tools: AuditToolInput[];
  setTools: (tools: AuditToolInput[]) => void;
  reset: () => void;
};

export const defaultTool: AuditToolInput = {
  id: "initial-tool",
  name: "ChatGPT",
  category: "writing",
  seats: 5,
  monthlyCost: 25,
  billingCycle: "monthly",
  usageScore: 60,
};

export const useFormStore = create<FormState>()(
  persist(
    (set) => ({
      tools: [defaultTool],
      setTools: (tools) => set({ tools }),
      reset: () => set({ tools: [defaultTool] }),
    }),
    { name: "spendwise-form" },
  ),
);
