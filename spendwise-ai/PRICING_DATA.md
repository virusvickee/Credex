# Pricing Data Sources

All prices verified against official vendor pricing pages. Last verified: 2026-05-07.

## Cursor
- **Hobby**: $0/month
- **Pro**: $20/user/month
- **Business**: $40/user/month
- **Verified**: 2026-05-07
- **Source**: [https://cursor.com/pricing](https://cursor.com/pricing)

## GitHub Copilot
- **Individual**: $10/user/month (or $100/year)
- **Business**: $19/user/month
- **Enterprise**: $39/user/month
- **Verified**: 2026-05-07
- **Source**: [https://github.com/features/copilot](https://github.com/features/copilot)

## Claude (Anthropic)
- **Free**: $0
- **Pro**: $20/user/month
- **Max**: $100/user/month
- **Team**: $30/user/month (minimum 5 seats)
- **Enterprise**: Custom pricing
- **Verified**: 2026-05-07
- **Source**: [https://anthropic.com/pricing](https://anthropic.com/pricing)

## ChatGPT (OpenAI)
- **Free**: $0
- **Plus**: $20/user/month
- **Pro**: $200/user/month
- **Team**: $30/user/month (minimum 2 seats)
- **Enterprise**: Custom pricing
- **Verified**: 2026-05-07
- **Source**: [https://openai.com/chatgpt/pricing](https://openai.com/chatgpt/pricing)

## Anthropic API
- Usage-based pricing, no flat monthly fee
- **Verified**: 2026-05-07
- **Source**: [https://anthropic.com/pricing](https://anthropic.com/pricing)

## OpenAI API
- Usage-based pricing, no flat monthly fee
- **Verified**: 2026-05-07
- **Source**: [https://openai.com/api/pricing](https://openai.com/api/pricing)

## Gemini (Google)
- **Free**: $0 (Gemini 1.5 Flash free tier)
- **Google One AI Premium**: $19.99/month
- **API**: Usage-based
- **Verified**: 2026-05-07
- **Source**: [https://ai.google.dev/pricing](https://ai.google.dev/pricing)

## Windsurf
- **Free**: $0
- **Pro**: $15/user/month
- **Teams**: $35/user/month
- **Verified**: 2026-05-07
- **Source**: [https://windsurf.com/pricing](https://windsurf.com/pricing)

### Data Management Note
Pricing data is hardcoded in `src/lib/pricing-data.ts` to ensure the audit engine remains deterministic and fast. For production at scale, we recommend moving this to a managed CMS or a weekly sync script to account for the rapid changes in the AI tool market.
