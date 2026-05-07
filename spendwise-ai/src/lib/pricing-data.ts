import type { PlanInfo, ToolCategory, ToolId, ToolInfo } from "@/types";

export const PRICING_VERIFIED_DATE = "2026-05-06";

export const TOOLS: Record<ToolId, ToolInfo> = {
  cursor: {
    id: "cursor",
    name: "Cursor",
    category: "coding",
    pricingUrl: "https://cursor.com/pricing",
    plans: [
      {
        id: "hobby",
        name: "Hobby",
        monthlyPricePerSeat: 0,
        features: ["Limited Agent requests", "Limited Tab completions", "No credit card required"],
        bestFor: "individuals trying Cursor",
      },
      {
        id: "pro",
        name: "Pro",
        monthlyPricePerSeat: 20,
        features: ["Extended Agent limits", "Frontier model access", "Cloud agents"],
        bestFor: "individual developers",
      },
      {
        id: "business",
        name: "Business (Teams)",
        monthlyPricePerSeat: 40,
        features: ["Centralized team billing", "Usage analytics", "SAML/OIDC SSO", "Role-based access control"],
        bestFor: "teams that need admin controls",
      },
    ],
  },
  github_copilot: {
    id: "github_copilot",
    name: "GitHub Copilot",
    category: "coding",
    pricingUrl: "https://github.com/features/copilot",
    plans: [
      {
        id: "individual",
        name: "Individual (Copilot Pro)",
        monthlyPricePerSeat: 10,
        annualPricePerSeat: 100,
        features: ["Copilot chat", "Inline suggestions", "Premium requests"],
        bestFor: "individual developers",
      },
      {
        id: "business",
        name: "Business",
        monthlyPricePerSeat: 19,
        features: ["Organization policy controls", "User management", "Business privacy controls"],
        bestFor: "engineering teams",
      },
      {
        id: "enterprise",
        name: "Enterprise",
        monthlyPricePerSeat: 39,
        features: ["Enterprise controls", "GitHub Enterprise Cloud integration", "Additional premium requests"],
        bestFor: "enterprise engineering organizations",
      },
    ],
  },
  claude: {
    id: "claude",
    name: "Claude",
    category: "writing",
    pricingUrl: "https://anthropic.com/pricing",
    plans: [
      {
        id: "free",
        name: "Free",
        monthlyPricePerSeat: 0,
        features: ["Limited Claude access", "Web, iOS, Android, and desktop chat"],
        bestFor: "light individual use",
      },
      {
        id: "pro",
        name: "Pro",
        monthlyPricePerSeat: 20,
        annualPricePerSeat: 200,
        features: ["More usage", "Claude Code", "Projects", "Research"],
        bestFor: "everyday productivity",
      },
      {
        id: "max",
        name: "Max",
        monthlyPricePerSeat: 100,
        features: ["5x or 20x more usage than Pro", "Higher output limits", "Priority access"],
        bestFor: "heavy individual users",
      },
      {
        id: "team",
        name: "Team Standard",
        monthlyPricePerSeat: 25,
        annualPricePerSeat: 240,
        features: ["Minimum 5 seats", "Central billing", "SSO", "No model training by default"],
        bestFor: "teams of 5 to 150",
      },
      {
        id: "enterprise",
        name: "Enterprise (estimated)",
        monthlyPricePerSeat: 20,
        features: ["Estimated seat floor; usage billed at API rates", "SCIM", "Audit logs", "Custom data retention"],
        bestFor: "large businesses; actual pricing requires sales quote",
      },
    ],
  },
  chatgpt: {
    id: "chatgpt",
    name: "ChatGPT",
    category: "general",
    pricingUrl: "https://openai.com/chatgpt/pricing",
    plans: [
      {
        id: "free",
        name: "Free",
        monthlyPricePerSeat: 0,
        features: ["Limited messages and uploads", "Limited image generation", "Limited Codex access"],
        bestFor: "light individual use",
      },
      {
        id: "plus",
        name: "Plus",
        monthlyPricePerSeat: 20,
        features: ["Expanded messages and uploads", "Advanced reasoning", "Projects, tasks, and custom GPTs"],
        bestFor: "individual power users",
      },
      {
        id: "pro",
        name: "Pro",
        monthlyPricePerSeat: 200,
        features: ["Maximum usage", "Pro reasoning", "Maximum Codex tasks", "Maximum deep research"],
        bestFor: "heavy individual users",
      },
      {
        id: "team",
        name: "Team",
        monthlyPricePerSeat: 30,
        features: ["Minimum 2 users", "Collaborative workspace", "Admin controls", "Business data protections"],
        bestFor: "small teams and startups",
      },
      {
        id: "enterprise",
        name: "Enterprise (estimated)",
        monthlyPricePerSeat: 60,
        features: ["Estimated placeholder for custom pricing", "Enterprise security", "User analytics", "Role-based controls"],
        bestFor: "large organizations; actual pricing requires sales quote",
      },
    ],
  },
  anthropic_api: {
    id: "anthropic_api",
    name: "Anthropic API",
    category: "api",
    pricingUrl: "https://anthropic.com/pricing",
    plans: [
      {
        id: "api_direct",
        name: "API Direct",
        monthlyPricePerSeat: 0,
        features: ["Token-based metered billing", "No flat monthly seat fee"],
        bestFor: "Usage-based pricing, no flat fee",
      },
    ],
  },
  openai_api: {
    id: "openai_api",
    name: "OpenAI API",
    category: "api",
    pricingUrl: "https://openai.com/api/pricing",
    plans: [
      {
        id: "api_direct",
        name: "API Direct",
        monthlyPricePerSeat: 0,
        features: ["Token-based metered billing", "Model-dependent rates", "No fixed seat fee"],
        bestFor: "Usage-based pricing, no flat fee",
      },
    ],
  },
  gemini: {
    id: "gemini",
    name: "Gemini",
    category: "general",
    pricingUrl: "https://ai.google.dev/pricing",
    plans: [
      {
        id: "free",
        name: "Free",
        monthlyPricePerSeat: 0,
        features: ["Gemini API free tier", "Free input and output tokens on eligible models", "Google AI Studio access"],
        bestFor: "developers and small projects getting started",
      },
      {
        id: "gemini_advanced",
        name: "Gemini Advanced (Google One AI Premium)",
        monthlyPricePerSeat: 19.99,
        features: ["Google One AI Premium subscription", "Advanced Gemini access", "Individual subscription"],
        bestFor: "individual users who want advanced Gemini features",
      },
      {
        id: "api",
        name: "API",
        monthlyPricePerSeat: 0,
        features: ["Usage-based metered billing", "Free and paid API tiers", "No flat monthly seat fee"],
        bestFor: "Usage-based pricing, no flat fee",
      },
    ],
  },
  windsurf: {
    id: "windsurf",
    name: "Windsurf",
    category: "coding",
    pricingUrl: "https://windsurf.com/pricing",
    plans: [
      {
        id: "free",
        name: "Free",
        monthlyPricePerSeat: 0,
        features: ["Light usage allowance", "Unlimited Tab"],
        bestFor: "individuals trying Windsurf",
      },
      {
        id: "pro",
        name: "Pro",
        monthlyPricePerSeat: 20,
        features: ["Standard usage allowance", "Premium model support", "Extra usage at API price"],
        bestFor: "individual developers",
      },
      {
        id: "teams",
        name: "Teams",
        monthlyPricePerSeat: 40,
        features: ["Centralized billing", "Admin dashboard with analytics", "Team controls"],
        bestFor: "teams that need shared billing and administration",
      },
    ],
  },
};

export const TOOL_LIST: ToolInfo[] = Object.values(TOOLS);

export function getToolById(id: ToolId): ToolInfo {
  return TOOLS[id];
}

export function getPlanById(toolId: ToolId, planId: string): PlanInfo | undefined {
  return TOOLS[toolId].plans.find((plan) => plan.id === planId);
}

export type PricingBenchmark = {
  name: string;
  category: ToolCategory;
  recommendedMonthlySeatCost: number;
  lowerCostAlternative: string;
};

export const pricingBenchmarks: PricingBenchmark[] = [
  { name: "GitHub Copilot", category: "coding", recommendedMonthlySeatCost: getPlanById("github_copilot", "business")?.monthlyPricePerSeat ?? 19, lowerCostAlternative: "Cursor Pro or pooled Copilot Business seats" },
  { name: "Cursor", category: "coding", recommendedMonthlySeatCost: getPlanById("cursor", "pro")?.monthlyPricePerSeat ?? 20, lowerCostAlternative: "GitHub Copilot Business" },
  { name: "ChatGPT", category: "writing", recommendedMonthlySeatCost: getPlanById("chatgpt", "team")?.monthlyPricePerSeat ?? 30, lowerCostAlternative: "ChatGPT Team with seat governance" },
  { name: "Claude", category: "writing", recommendedMonthlySeatCost: getPlanById("claude", "team")?.monthlyPricePerSeat ?? 25, lowerCostAlternative: "Claude Team with shared usage rules" },
  { name: "Anthropic API", category: "other", recommendedMonthlySeatCost: 0, lowerCostAlternative: "Usage-based Anthropic API billing" },
  { name: "OpenAI API", category: "other", recommendedMonthlySeatCost: 0, lowerCostAlternative: "Usage-based OpenAI API billing" },
  { name: "Gemini", category: "search", recommendedMonthlySeatCost: getPlanById("gemini", "gemini_advanced")?.monthlyPricePerSeat ?? 19.99, lowerCostAlternative: "Gemini API usage-based tier" },
  { name: "Windsurf", category: "coding", recommendedMonthlySeatCost: getPlanById("windsurf", "pro")?.monthlyPricePerSeat ?? 20, lowerCostAlternative: "Cursor Pro or GitHub Copilot Business" },
];

export const categoryFallbacks: Record<ToolCategory, PricingBenchmark> = {
  coding: { name: "Coding assistant", category: "coding", recommendedMonthlySeatCost: 20, lowerCostAlternative: "Consolidated coding assistant seats" },
  design: { name: "Design AI", category: "design", recommendedMonthlySeatCost: 20, lowerCostAlternative: "Design suite add-on review" },
  writing: { name: "Writing assistant", category: "writing", recommendedMonthlySeatCost: 25, lowerCostAlternative: "Team workspace with usage policy" },
  meeting: { name: "Meeting assistant", category: "meeting", recommendedMonthlySeatCost: 20, lowerCostAlternative: "Recorder seat rotation" },
  search: { name: "AI search", category: "search", recommendedMonthlySeatCost: 19.99, lowerCostAlternative: "Shared research seats" },
  other: { name: "AI subscription", category: "other", recommendedMonthlySeatCost: 20, lowerCostAlternative: "Annual contract review" },
};
