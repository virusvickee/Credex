import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ToolId, UseCase, ToolInput } from '@/types';
import { TOOLS, getPlanById } from '@/lib/pricing-data';

interface FormState {
  teamSize: number;
  useCase: UseCase;
  tools: ToolInput[];
  setTeamSize: (n: number) => void;
  setUseCase: (u: UseCase) => void;
  addTool: (toolId: ToolId) => void;
  removeTool: (toolId: ToolId) => void;
  updateTool: (toolId: ToolId, updates: Partial<ToolInput>) => void;
  resetForm: () => void;
  hasToolById: (toolId: ToolId) => boolean;
}

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      teamSize: 1,
      useCase: 'mixed',
      tools: [],

      setTeamSize: (n: number) => set({ teamSize: n }),
      
      setUseCase: (u: UseCase) => set({ useCase: u }),

      addTool: (toolId: ToolId) => {
        const { tools, teamSize } = get();
        if (tools.some(t => t.toolId === toolId)) return;

        const toolInfo = TOOLS[toolId];
        const defaultPlan = toolInfo.plans[0];
        
        const newTool: ToolInput = {
          toolId,
          planId: defaultPlan.id,
          seats: teamSize,
          monthlySpend: defaultPlan.monthlyPricePerSeat * teamSize,
        };

        set({ tools: [...tools, newTool] });
      },

      removeTool: (toolId: ToolId) => {
        set({ tools: get().tools.filter(t => t.toolId !== toolId) });
      },

      updateTool: (toolId: ToolId, updates: Partial<ToolInput>) => {
        set({
          tools: get().tools.map(t => 
            t.toolId === toolId ? { ...t, ...updates } : t
          )
        });
      },

      resetForm: () => set({ teamSize: 1, useCase: 'mixed', tools: [] }),

      hasToolById: (toolId: ToolId) => {
        return get().tools.some(t => t.toolId === toolId);
      },
    }),
    {
      name: 'spendwise-form',
    }
  )
);
