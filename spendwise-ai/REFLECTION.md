# Reflection

## Question 1: Hardest bug you hit

The hardest bug was related to TypeScript type errors when integrating the Zustand `persist` middleware with a complex store. Specifically, I encountered: `Type 'StateCreator<FormStore>' is not assignable to parameter of type...`. 

I initially suspected incorrect import paths or a version mismatch with `zustand`. However, after systematically trying different generic parameter combinations, I realized that when using `persist` in strict mode, you must explicitly provide the middleware types in the `create` function. 

The fix involved changing the store definition to: `create<FormStore>()(persist((set, get) => ({ ... }), { name: '...' }))`. The double-calling syntax `create<T>()(...)` was the key. This taught me that TypeScript's interaction with higher-order functions in middleware can be quite brittle, and the official documentation often omits these strict-mode nuances. It took about an hour of trial and error in `src/store/formStore.ts` (lines 45-65) to get it perfectly type-safe.

## Question 2: Decision you reversed

Early in the project, I planned to use an LLM (Claude) to perform the actual audit calculations. I spent half a day on prompt engineering, trying to get the model to reliably calculate monthly savings from a list of tools.

I reversed this decision when I noticed the "LLM math problem": even with few-shot prompting, the model would occasionally hallucinate $5-$10 differences in the totals or suggest "downgrading" to a plan that was actually more expensive due to seat minimums. 

I decided to move all logic into a deterministic rule engine (`src/lib/audit-engine.ts`). This allowed me to write unit tests for every scenario. The result is a system that users can trust with financial data. We kept the AI only for the executive summary, where its strength in synthesis and tone is a net positive without the risk of math errors.

## Question 3: What you'd build in week 2

If I had another week, I would focus on three features:
1. **PDF Report Export**: Many startup managers need a formal document to present at board meetings or finance reviews. Generating a branded PDF would make the product much more "corporate-ready."
2. **Benchmark API**: I would aggregate anonymized data to tell users: "Your $45/seat/month spend is 20% higher than similar Series A dev teams." This "fear of being an outlier" is a powerful conversion trigger.
3. **Renewal Reminders**: Since most savings come from annual renewals, I'd add a feature to upload renewal dates and get automated "Audit Reminders" 30 days before the contract locks in.

## Question 4: How you used AI tools

I used Claude 3.5 Sonnet extensively for scaffolding and boilerplate. For example, the shadcn/ui component configurations and the initial Zod schema shapes in the API routes were generated using AI to save time on repetitive typing.

However, I did **not** trust AI for:
- **Pricing Numbers**: I manually visited every pricing page (Cursor, GitHub, Anthropic, etc.) to verify the exact numbers because AI training data is often outdated.
- **Audit Logic**: The priority of the 6 rules was a product decision I made manually to ensure the most impactful savings (like API vs Subscription) are surfaced first.

One specific instance where AI was wrong: it suggested using `getServerSideProps` for the results page. Since this is a Next.js 14 project using the App Router, that was outdated advice. I caught it immediately because App Router uses async server components and standard `fetch()` with caching headers.

## Question 5: Self-ratings

- **Discipline: 8/10** — I maintained a consistent 4-6 hour daily cadence. The code reflects a systematic build order (Types -> Engine -> Tests -> UI -> API).
- **Code quality: 9/10** — The project has 0 TypeScript errors in strict mode, uses modern Next.js patterns, and has a clean separation between the deterministic engine and the UI.
- **Design sense: 8/10** — The dark theme is highly polished and uses professional design tokens (vibrant emerald accents, glassmorphism). The mobile experience for tool input is the only area I'd refine further.
- **Problem solving: 9/10** — Reversing the AI-audit decision early saved the project from reliability issues. The Zustand middleware fix shows deep technical persistence.
- **Entrepreneurial thinking: 7/10** — I identified a clear pain point (AI subscription bleed). The lead capture strategy is focused on high-savings teams, which is the right business move.
