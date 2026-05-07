export type ToolId =
  | "cursor"
  | "github_copilot"
  | "claude"
  | "chatgpt"
  | "anthropic_api"
  | "openai_api"
  | "gemini"
  | "windsurf";

export type PlanId = string;

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type ToolInput = {
  toolId: ToolId;
  planId: PlanId;
  seats: number;
  monthlySpend: number;
};

export type FormData = {
  teamSize: number;
  useCase: UseCase;
  tools: ToolInput[];
};

export type PlanInfo = {
  id: PlanId;
  name: string;
  monthlyPricePerSeat: number;
  annualPricePerSeat?: number;
  features: string[];
  bestFor: string;
};

export type ToolInfo = {
  id: ToolId;
  name: string;
  category: "coding" | "writing" | "general" | "api";
  plans: PlanInfo[];
  pricingUrl: string;
};

export type AuditRecommendation = {
  toolId: ToolId;
  toolName: string;
  currentPlan: string;
  currentMonthlySpend: number;
  recommendedAction: "downgrade" | "switch" | "keep" | "optimize";
  recommendedPlan?: string;
  recommendedTool?: ToolId;
  projectedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  reasoning: string;
  savingsConfidence: "high" | "medium" | "low";
};

export type AuditResult = {
  id: string;
  publicToken: string;
  createdAt: string;
  formData: FormData;
  recommendations: AuditRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isHighSavings: boolean;
  isOptimal: boolean;
  aiSummary?: string;
};

export type LeadData = {
  email: string;
  companyName?: string;
  role?: string;
  auditId: string;
};

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  success: boolean;
};

export type ToolCategory = "coding" | "design" | "writing" | "meeting" | "search" | "other";
export type BillingCycle = "monthly" | "annual";

export type AuditToolInput = {
  id: string;
  name: string;
  category: ToolCategory;
  seats: number;
  monthlyCost: number;
  billingCycle: BillingCycle;
  usageScore: number;
};

export type ToolRecommendation = {
  toolId: string;
  issue: string;
  recommendation: string;
  estimatedMonthlySavings: number;
};

export type LegacyAuditResult = {
  id: string;
  tools: AuditToolInput[];
  totalMonthlySpend: number;
  estimatedMonthlySavings: number;
  estimatedAnnualSavings: number;
  savingsRate: number;
  score: number;
  recommendations: ToolRecommendation[];
  summary?: string;
  createdAt: string;
};

export type LeadInput = {
  auditId: string;
  email: string;
  company?: string;
};
