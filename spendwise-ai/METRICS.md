# Metrics

## North Star Metric
**Qualified consultations booked per week**

**Why**: This is the metric that directly drives Credex revenue. DAU is a vanity metric here — users likely only perform an audit once per quarter. Email captures are a leading indicator, but the *consultation* is the moment value is exchanged and our platform trust is built. 
- **Target**: 10 consultations/week by month 3.

## 3 Input Metrics That Drive the North Star

### 1. Audit Completion Rate
- **Definition**: Users who click "Run My Audit" ÷ Users who added at least one tool.
- **Target**: >65%
- **Why it matters**: A drop here indicates the form is too complex or we haven't established enough trust to get the user through the "Audit Details" section.

### 2. Email Capture Rate
- **Definition**: Emails submitted ÷ Audits completed.
- **Target**: >20%
- **Why it matters**: No email = no pipeline. Below 15% means the results page (SavingsHero) isn't delivering enough "WOW" factor to justify the user providing their contact info.

### 3. High-Savings Audit Rate
- **Definition**: Audits showing >$500/mo savings ÷ Total audits.
- **Target**: >25%
- **Why it matters**: Our core value proposition is for high-savings teams. If this is too low, it means our GTM targeting is off, and we are attracting individual hobbyists instead of the Engineering Managers we need.

## What We'd Instrument First
1. **Event: `audit_completed`** (via PostHog) — tracking `savings_amount`, `tool_count`, and `use_case`.
2. **Event: `email_captured`** — tagged with `is_high_savings` to prioritize sales follow-up.
3. **Event: `consultation_cta_clicked`** — to measure the conversion efficiency of the `SavingsHero` CTA.
4. **Event: `share_link_copied`** — to measure the viral coefficient.
5. **Funnel**: `Landing` → `Tool Added` → `Audit Run` → `Email Captured` → `Consultation`.

## Pivot Trigger
If after 500 audits:
- **Email capture rate < 10%** → Redesign the results page; the "Executive Summary" isn't compelling enough.
- **High-savings rate < 10%** → We're attracting the wrong audience. Adjust GTM channels away from r/SideProject and toward r/ExperiencedDevs.
- **Consultation rate < 5%** (of high-savings teams) → The Credex CTA copy is weak or perceived as too "salesy."
- **Zero repeat visits (30d)** → Add a "Benchmark Mode" to give users a reason to return and compare their stack quarterly.
