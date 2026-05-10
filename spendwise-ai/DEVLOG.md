# Development Log

## Day 1 — 2026-05-01
**Hours worked:** 4
**What I did:**
Set up the Next.js 14 project with TypeScript strict mode, Tailwind, and shadcn/ui. Spent more time than expected debugging the shadcn CLI — the old shadcn-ui@latest package is deprecated and the new CLI has different syntax. Set up Supabase project, created audits and leads tables with RLS policies. Added all environment variables.

**What I learned:**
shadcn now uses a different init command. Toast component was removed from the registry and needs to be added manually (or use Sonner). Supabase RLS policies need to be set correctly or all queries silently fail.

**Blockers / what I'm stuck on:**
Supabase anon key vs service role key confusion — anon key for client, service role only on server. Took 30 mins to figure out why client queries failed.

**Plan for tomorrow:**
Define all TypeScript types, add pricing data for all 8 tools, start audit engine.

## Day 2 — 2026-05-02
**Hours worked:** 5
**What I did:**
Defined all TypeScript types in types/index.ts — ToolId, FormData, AuditResult, AuditRecommendation. Added verified pricing data for all 8 tools with official URLs. Started audit engine — implemented checkPlanSize() and checkDuplicates() rules.

**What I learned:**
Pricing pages are inconsistent — Gemini calls their plan "Google One AI Premium" not "Gemini Advanced". Had to verify each number against the actual pricing page. GitHub Copilot individual plan is $10/mo OR $100/year — need to handle both in the engine.

**Blockers / what I'm stuck on:**
Not sure how to handle usage-based tools (Anthropic API, OpenAI API) in the audit engine since they have no fixed per-seat price. Decided to treat them as single-seat with $0 base price and flag them only if they have a duplicate subscription.

**Plan for tomorrow:**
Finish all 6 audit engine rules, write 10 tests.

## Day 3 — 2026-05-03
**Hours worked:** 6
**What I did:**
Completed all 6 audit engine rules: checkPlanSize, checkUseCaseFit, checkDuplicates, checkApiVsSubscription, checkSeatMismatch, and keep fallback. Wrote 10 Vitest tests — all passing. Built the full form UI with Zustand persistence, tool selector grid, and ToolRows with auto-calculate toggle.

**What I learned:**
First-match-wins rule ordering matters a lot. Initially had checkSeatMismatch run before checkDuplicates — this caused API tools to trigger seat mismatch warnings because their listed price is $0. Fixed by running duplicate check first.

**Blockers / what I'm stuck on:**
Zustand persist middleware types are tricky with TypeScript strict mode. Had to add explicit type annotations to the store to avoid implicit any errors.

**Plan for tomorrow:**
Build all 4 API routes, test with PowerShell.

## Day 4 — 2026-05-04
**Hours worked:** 5
**What I did:**
Built all 4 API routes: POST /api/audit, GET /api/audit/[id], POST /api/lead, POST /api/summary. Implemented Zod validation, rate limiting, honeypot, and disposable email blocking. Tested all routes with PowerShell Invoke-RestMethod. Verified Supabase rows and received confirmation email.

**What I learned:**
PowerShell uses backtick for line continuation, not backslash. Spent 20 mins confused by this. Also learned that Resend free tier only sends to verified emails — need to verify my email address first before testing.

**Blockers / what I'm stuck on:**
Rate limiting with in-memory Map resets on every hot reload in dev. Hard to test properly. Worked around by temporarily setting limit to 1 for testing.

**Plan for tomorrow:**
Build audit results page UI — SavingsHero, ToolBreakdown, AIsummary, ShareBar, LeadCaptureModal.

## Day 5 — 2026-05-05
**Hours worked:** 6
**What I did:**
Built complete audit results page with all components. SavingsHero has animated count-up using useEffect. ToolBreakdown shows per-tool cards with action badges. LeadCaptureModal opens via Radix Dialog for a premium feel. ShareBar has Twitter (X) and LinkedIn share buttons with proper og: meta tags on the page.

**What I learned:**
Next.js server components cannot use useState or useEffect — had to carefully separate server and client components. The results page itself is a server component (for SEO) but SavingsHero, ShareBar, and LeadCaptureModal are client components.

**Blockers / what I'm stuck on:**
OG image generation needs a separate API route. Skipped for now, will add as bonus if time permits.

**Plan for tomorrow:**
Write all documentation files, deploy to Vercel.

## Day 6 — 2026-05-09
**Hours worked:** 3
**What I did:**
Deployed to Vercel successfully. Fixed port mismatch 
issue where NEXT_PUBLIC_BASE_URL was hardcoded to 
localhost:3000 but dev server was on localhost:3004. 
Updated environment variables on Vercel dashboard. 
Verified full end-to-end flow on production — form, 
audit, results page, AI summary, email capture all 
working. Added screenshots to README. CI is green.

**What I learned:**
Vercel requires NEXT_PUBLIC_ variables to be set 
at build time. Had to redeploy after adding env vars. 
Also learned that share URL must use 
window.location.origin not hardcoded localhost.

**Blockers:**
None — all systems working on production.

**Plan for tomorrow:**
Final submission. Run full checklist one more time.

## Day 7 — 2026-05-10
**Hours worked:** 4
**What I did:**
Final end-to-end testing on production URL. 
Verified all 8 tools work correctly. Ran full 
audit flow — form to results page. Confirmed 
Anthropic API generating real summaries. 
Email capture working via Resend. Share URL 
generates correct Vercel domain. 
All 10 unit tests passing. CI green on GitHub.
Lighthouse scores checked. Submitting today.

**What I learned:**
Building a full-stack product in 7 days is 
intense but possible with clear architecture 
from day 1. The deterministic audit engine 
was the right call — AI for dollar amounts 
would have been unreliable.

**Blockers:**
None — ready to submit.

**Plan for tomorrow:**
Waiting for Round 2 feedback.

