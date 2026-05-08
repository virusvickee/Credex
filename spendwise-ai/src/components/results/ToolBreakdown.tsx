import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { AuditRecommendation } from "@/types";

const TOOL_LOGOS: Record<string, string> = {
  cursor: '/logos/cursor.png',
  github_copilot: '/logos/github-copilot.png',
  claude: '/logos/claude.png',
  chatgpt: '/logos/chatgpt.svg',
  anthropic_api: '/logos/anthropic.png',
  openai_api: '/logos/openai.svg',
  gemini: '/logos/gemini.svg',
  windsurf: '/logos/windsurf.png',
};

interface ToolBreakdownProps {
  recommendations: AuditRecommendation[];
}

export function ToolBreakdown({ recommendations }: ToolBreakdownProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#666666] mb-4">
        TOOL-BY-TOOL BREAKDOWN
      </h2>

      <div className="space-y-3">
        {recommendations.map((rec) => {
          const actionColors = {
            downgrade: "border-[#f5a623]/30 bg-[#f5a623]/10 text-[#f5a623]",
            switch: "border-[#ff4444]/30 bg-[#ff4444]/10 text-[#ff4444]",
            keep: "border-[#00e5a0]/30 bg-[#00e5a0]/10 text-[#00e5a0]",
            optimize: "border-[#a78bfa]/30 bg-[#a78bfa]/10 text-[#a78bfa]",
          };

          const hasIssue = rec.recommendedAction !== 'keep';

          return (
            <div key={rec.toolId} className="border border-[#1a1a1a] rounded-lg bg-[#0a0a0a] p-5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 relative grayscale">
                    <Image
                      src={TOOL_LOGOS[rec.toolId] || '/logos/cursor.png'}
                      alt={rec.toolName}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-medium text-[#ededed]">{rec.toolName}</h3>
                    <p className="text-[12px] text-[#666666]">on {rec.currentPlan}</p>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full border-0 ${actionColors[rec.recommendedAction]}`}
                >
                  {rec.recommendedAction.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[11px] text-[#555555] tracking-[0.06em] uppercase">CURRENT</p>
                  <p className="text-[20px] font-semibold text-[#ededed]">
                    ${rec.currentMonthlySpend.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-[#555555] tracking-[0.06em] uppercase">PROJECTED</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-[20px] font-semibold text-[#00e5a0]">
                      ${rec.projectedMonthlySpend.toLocaleString()}
                    </p>
                    {hasIssue && (
                      <span className="text-[12px] text-[#00e5a0] font-medium">
                        save ${rec.monthlySavings.toLocaleString()}/mo
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-[13px] text-[#555555] mt-6 pt-6 border-t border-[#111111] leading-relaxed">
                {rec.reasoning}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
