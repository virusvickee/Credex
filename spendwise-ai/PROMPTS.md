# SpendWise AI Prompts

## Audit Summary Prompt

### System/User Prompt
```text
You are a financial analyst writing a brief audit summary for a startup. Based on this AI tool spend audit data, write a single paragraph of exactly 90-110 words. Be specific with dollar amounts. Mention the top 1-2 recommendations. End with an actionable next step. Do not use bullet points. Do not use headers. Plain paragraph only.

Data:
- Team size: {teamSize}
- Primary use case: {useCase}
- Total monthly savings opportunity: ${totalMonthlySavings}
- Total annual savings opportunity: ${totalAnnualSavings}
- Top recommendations: {topRecs}
```

### Rationale
- **Word Count Constraint**: The 90-110 word range ensures a dense, professional paragraph that fits well in the UI while providing enough detail to be valuable.
- **Tone**: "Financial analyst" sets a professional, objective tone that matches the "deterministic rules" philosophy of the engine.
- **Structure**: Forcing a single paragraph without headers/bullets ensures the output is easily embeddable in the results page.

### Iteration & Learnings
- **Haiku Model**: We used `claude-3-haiku-20240307` for speed and cost-efficiency. It handles following length constraints better than smaller models.
- **Failures**: If the API is down or the key is missing, we use a string-template fallback that maintains the same data-rich format to ensure the user always gets a clear summary.
- **Length Control**: Initially, the model tended to be too brief. Adding "exactly 90-110 words" helped standardize the output size.

### Failure Handling
- **Network/API Errors**: Caught in `anthropic.ts` and returns an `isFallback: true` flag.
- **Content Errors**: If the model produces no text, the fallback logic kicks in.
