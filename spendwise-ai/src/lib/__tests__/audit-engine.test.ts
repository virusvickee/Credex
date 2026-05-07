import { describe, it, expect } from "vitest";
import { runAudit } from "../audit-engine";
import { FormData } from "@/types";

describe("audit-engine", () => {
  it("1. Team plan with 2 seats -> triggers downgrade recommendation", () => {
    const formData: FormData = {
      teamSize: 2,
      useCase: "mixed",
      tools: [
        { toolId: "chatgpt", planId: "team", seats: 2, monthlySpend: 60 }
      ]
    };
    const result = runAudit(formData);
    expect(result.recommendations[0].recommendedAction).toBe("downgrade");
    expect(result.recommendations[0].reasoning).toContain("Team plan requires minimum");
  });

  it("2. Cursor + GitHub Copilot together -> Copilot flagged as redundant", () => {
    const formData: FormData = {
      teamSize: 5,
      useCase: "coding",
      tools: [
        { toolId: "cursor", planId: "pro", seats: 5, monthlySpend: 100 },
        { toolId: "github_copilot", planId: "business", seats: 5, monthlySpend: 95 }
      ]
    };
    const result = runAudit(formData);
    const copilot = result.recommendations.find(r => r.toolId === "github_copilot");
    expect(copilot?.recommendedAction).toBe("switch");
    expect(copilot?.reasoning).toContain("Cursor subsumes GitHub Copilot functionality");
    
    const cursor = result.recommendations.find(r => r.toolId === "cursor");
    expect(cursor?.recommendedAction).toBe("keep");
  });

  it("3. ChatGPT + Claude same tier -> more expensive one flagged", () => {
    const formData: FormData = {
      teamSize: 1,
      useCase: "mixed",
      tools: [
        { toolId: "chatgpt", planId: "plus", seats: 1, monthlySpend: 20 },
        { toolId: "claude", planId: "pro", seats: 1, monthlySpend: 20 }
      ]
    };
    const result = runAudit(formData);
    // Our logic flags claude when spend is equal
    const claude = result.recommendations.find(r => r.toolId === "claude");
    expect(claude?.recommendedAction).toBe("switch");
    expect(claude?.reasoning).toContain("Overlapping general-purpose LLM subscriptions");
  });

  it("4. Writing use case + Cursor -> suggests switching to Claude", () => {
    const formData: FormData = {
      teamSize: 1,
      useCase: "writing",
      tools: [
        { toolId: "cursor", planId: "pro", seats: 1, monthlySpend: 20 }
      ]
    };
    const result = runAudit(formData);
    expect(result.recommendations[0].recommendedAction).toBe("switch");
    expect(result.recommendations[0].recommendedTool).toBe("claude");
    expect(result.recommendations[0].reasoning).toContain("Cursor is optimized for coding");
  });

  it("5. Coding use case + ChatGPT Plus -> suggests switching to Cursor", () => {
    const formData: FormData = {
      teamSize: 1,
      useCase: "coding",
      tools: [
        { toolId: "chatgpt", planId: "plus", seats: 1, monthlySpend: 20 }
      ]
    };
    const result = runAudit(formData);
    expect(result.recommendations[0].recommendedAction).toBe("switch");
    expect(result.recommendations[0].recommendedTool).toBe("cursor");
    expect(result.recommendations[0].reasoning).toContain("Cursor's IDE-native experience outperforms ChatGPT");
  });

  it("6. Optimal spend -> recommendedAction is 'keep', savings = 0", () => {
    const formData: FormData = {
      teamSize: 1,
      useCase: "coding",
      tools: [
        { toolId: "cursor", planId: "pro", seats: 1, monthlySpend: 20 }
      ]
    };
    const result = runAudit(formData);
    expect(result.recommendations[0].recommendedAction).toBe("keep");
    expect(result.recommendations[0].monthlySavings).toBe(0);
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.isOptimal).toBe(true);
  });

  it("7. totalMonthlySavings calculated correctly across multiple tools", () => {
    const formData: FormData = {
      teamSize: 2,
      useCase: "coding",
      tools: [
        { toolId: "chatgpt", planId: "team", seats: 2, monthlySpend: 60 }, // downgrade saves $20
        { toolId: "cursor", planId: "pro", seats: 2, monthlySpend: 40 }, // keep
        { toolId: "github_copilot", planId: "business", seats: 2, monthlySpend: 38 } // switch duplicate saves $38
      ]
    };
    const result = runAudit(formData);
    const chatgpt = result.recommendations.find(r => r.toolId === "chatgpt");
    expect(chatgpt?.monthlySavings).toBe(20);
    
    const copilot = result.recommendations.find(r => r.toolId === "github_copilot");
    expect(copilot?.monthlySavings).toBe(38);

    expect(result.totalMonthlySavings).toBe(58);
  });

  it("8. isHighSavings = true when savings > $500/mo", () => {
    const formData: FormData = {
      teamSize: 50,
      useCase: "coding",
      tools: [
        { toolId: "cursor", planId: "pro", seats: 50, monthlySpend: 1000 },
        { toolId: "github_copilot", planId: "business", seats: 50, monthlySpend: 950 } // duplicate, saves $950
      ]
    };
    const result = runAudit(formData);
    expect(result.isHighSavings).toBe(true);
  });

  it("9. Anthropic API + Claude Pro (low API spend) -> Claude Pro flagged", () => {
    const formData: FormData = {
      teamSize: 1,
      useCase: "writing",
      tools: [
        { toolId: "claude", planId: "pro", seats: 1, monthlySpend: 20 },
        { toolId: "anthropic_api", planId: "api_direct", seats: 1, monthlySpend: 5 }
      ]
    };
    const result = runAudit(formData);
    const claude = result.recommendations.find(r => r.toolId === "claude");
    expect(claude?.recommendedAction).toBe("switch");
    expect(claude?.reasoning).toContain("Your API spend suggests light usage");
  });

  it("10. Seat mismatch > 15% -> triggers optimize recommendation", () => {
    const formData: FormData = {
      teamSize: 10,
      useCase: "coding",
      tools: [
        { toolId: "cursor", planId: "pro", seats: 10, monthlySpend: 300 } // Should be 200, variance 50%
      ]
    };
    const result = runAudit(formData);
    expect(result.recommendations[0].recommendedAction).toBe("optimize");
    expect(result.recommendations[0].reasoning).toContain("differs from listed price");
  });
});
