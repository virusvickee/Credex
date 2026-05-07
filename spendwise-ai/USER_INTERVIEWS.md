# User Interviews

I conducted 3 quick interviews with professionals in the startup ecosystem to validate the "AI subscription bleed" hypothesis.

---

**Interviewee:** R.K., Engineering Manager, Series A fintech (~30 people)
**Date:** 2026-05-04
**Duration:** 12 minutes

**Direct quotes:**
- "I approved Cursor for the team and then forgot about it — I don't even know if everyone is actually using it or if they went back to VS Code."
- "Wait, we have both ChatGPT Team and Claude Team. I think someone just kept buying things as they came out. I never realized the overlap."
- "I'd definitely want to run this before our next quarterly budget review. It's much easier than digging through 50 Stripe receipts."

**Most surprising:** He didn't know his company had both ChatGPT and Claude Team subscriptions running simultaneously until I asked him to list his tools.

**What it changed:** Added a "duplicate tool" warning prominently on the results page — this is clearly a massive source of waste that managers simply don't have time to track manually.

---

**Interviewee:** S.L., CTO & Co-founder, Seed-stage AI startup (~8 people)
**Date:** 2026-05-05
**Duration:** 15 minutes

**Direct quotes:**
- "We use the Anthropic API for our product, so why am I paying $20/month for individual Claude Pro seats for the devs? Can't they just use a wrapper?"
- "I thought GitHub Copilot was the only option. I didn't know Windsurf or Cursor Business offered better team pricing."
- "The $10 vs $20 difference doesn't sound like much until you multiply it by 10 devs over a year. That's a new laptop."

**Most surprising:** He was more annoyed by the *inefficiency* of the spend than the actual dollar amount. He felt like he was "being a bad manager" by not knowing the cheaper alternatives.

**What it changed:** Added "Projected Savings" badges to every tool breakdown row. The visual "win" of saving even $10/mo per user was a strong psychological hook.

---

**Interviewee:** M.V., Operations Lead, Growth-stage SaaS (~60 people)
**Date:** 2026-05-06
**Duration:** 10 minutes

**Direct quotes:**
- "We have a seat mismatch problem everywhere. People leave the company, and we forget to remove their AI seats."
- "I don't need a deep audit; I just need someone to tell me 'Stop paying for X and move to Y'."
- "If this could export to a CSV for my finance team, it would be a lifesaver."

**Most surprising:** Her biggest pain point wasn't the tool choice, but the **seat count drift**. 15% of their AI budget was being spent on seats for people who no longer worked there.

**What it changed:** Implemented the `checkSeatMismatch` rule in the audit engine. If seats > team size, we now flag it as a critical "Optimize" action.

---
