import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, ArrowDownRight, Check, AlertTriangle } from "lucide-react";
import type { AuditRecommendation } from "@/types";

interface ToolBreakdownProps {
  recommendations: AuditRecommendation[];
}

export function ToolBreakdown({ recommendations }: ToolBreakdownProps) {
  return (
    <Card className="bg-slate-900/30 border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm">
      <CardHeader className="bg-slate-900/50 border-b border-slate-800 py-6">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-emerald-400" />
          <CardTitle className="text-xl text-white font-bold tracking-tight">Tool Breakdown</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-800/50">
          {recommendations.map((rec) => {
            const hasIssue = rec.recommendedAction !== 'keep';
            
            return (
              <div key={rec.toolId} className="p-6 md:p-8 space-y-6 hover:bg-slate-800/20 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl">
                      {rec.toolId === 'cursor' && '🚀'}
                      {rec.toolId === 'github_copilot' && '🐙'}
                      {rec.toolId === 'claude' && '🤖'}
                      {rec.toolId === 'chatgpt' && '💬'}
                      {rec.toolId === 'anthropic_api' && '🏗️'}
                      {rec.toolId === 'openai_api' && '⚙️'}
                      {rec.toolId === 'gemini' && '✨'}
                      {rec.toolId === 'windsurf' && '🏄'}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{rec.toolName}</h3>
                      <p className="text-sm text-slate-500 font-medium">Currently on {rec.currentPlan}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-slate-500 mb-1 uppercase tracking-widest font-bold">Current Spend</p>
                    <p className="text-2xl font-black text-white">${rec.currentMonthlySpend.toLocaleString()}<span className="text-xs text-slate-600 font-medium">/mo</span></p>
                  </div>
                </div>

                {hasIssue ? (
                  <div className={`rounded-2xl p-5 border flex gap-4 items-start ${
                    rec.recommendedAction === 'downgrade' ? 'bg-orange-500/5 border-orange-500/20 text-orange-400' :
                    rec.recommendedAction === 'switch' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' :
                    'bg-slate-900 border-slate-800 text-slate-200'
                  }`}>
                    <div className="mt-1">
                      {rec.recommendedAction === 'downgrade' ? <AlertTriangle className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold uppercase tracking-wider">
                        Recommended Action: {rec.recommendedAction}
                      </p>
                      <p className="text-slate-200 leading-relaxed font-medium">{rec.reasoning}</p>
                      <div className="flex items-center gap-2 pt-2">
                        <Badge variant="outline" className="bg-slate-950/50 border-white/10 text-white font-bold">
                          Projected: ${rec.projectedMonthlySpend.toLocaleString()}/mo
                        </Badge>
                        <Badge variant="outline" className="bg-emerald-500/20 border-emerald-500/30 text-emerald-400 font-black">
                          Saves ${rec.monthlySavings.toLocaleString()}/mo
                        </Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl p-4 bg-emerald-500/5 border border-emerald-500/10 flex gap-3 items-center text-emerald-400/60">
                    <Check className="h-4 w-4" />
                    <p className="text-sm font-medium">This tool is well-optimized. No action needed.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
