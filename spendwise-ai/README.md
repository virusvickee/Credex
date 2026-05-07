# SpendWise AI — Free AI Spend Audit for Startups

## What is this?
SpendWise AI is a free web app that helps startup founders and engineering managers find out if they're overpaying for AI tools like Cursor, Claude, ChatGPT, and GitHub Copilot. Input your tools, plans, and team size — get an instant audit with specific savings recommendations. No login required.

## Live URL
https://spendwise-ai-credex.vercel.app

## Screenshots
*(Add these after deployment)*
1. Landing page with form
2. Audit results page
3. Lead capture modal

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Install & Run Locally
```bash
git clone https://github.com/virusvickee/Credex.git
cd Credex/spendwise-ai
npm install
cp .env.example .env.local
# Fill in your keys in .env.local
npm run dev
```
Open http://localhost:3000

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_BASE_URL=
```

### Run Tests
```bash
npm run test
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel --prod
```

## Decisions (5 trade-offs we made)

### 1. Deterministic audit engine over AI
We used hardcoded rules for the audit logic instead of prompting an LLM. Reason: finance-literate users need to trust and verify the reasoning. AI-generated math introduces hallucination risk for dollar amounts. AI is used only for the summary paragraph where creativity adds value.

### 2. Next.js App Router over Pages Router
App Router gives us server components for the results page (better SEO, faster initial load) and simple API routes co-located with the UI. Trade-off: steeper learning curve and some ecosystem libraries not yet fully compatible.

### 3. Supabase over PlanetScale/Neon
Supabase gives us a Postgres database + REST API + Row Level Security in one free tier. Trade-off: vendor lock-in on the client SDK, but acceptable for this stage.

### 4. Resend over SendGrid/Mailgun
Resend has a cleaner API, better DX, and generous free tier (3,000 emails/month). Trade-off: newer service with smaller community vs SendGrid's established track record.

### 5. In-memory rate limiting over Redis
For this stage, a simple Map-based rate limiter works fine and requires zero infrastructure. Trade-off: resets on server restart and doesn't work across multiple instances. At scale, we'd switch to Upstash Redis.
