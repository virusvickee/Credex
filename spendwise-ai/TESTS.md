# Tests

## Test Suite: Audit Engine
File: `spendwise-ai/src/lib/__tests__/audit-engine.test.ts`
Run: `cd spendwise-ai && npm run test`

| # | Test Name | What it covers | Status |
|---|-----------|----------------|---|
| 1 | team plan with 2 seats triggers downgrade | checkPlanSize rule — recommends Personal/Pro when seat count is low | ✅ Pass |
| 2 | Cursor + GitHub Copilot flags Copilot redundant | checkDuplicates — detects coding tool overlap and recommends removal | ✅ Pass |
| 3 | ChatGPT + Claude flags more expensive tool | checkDuplicates — detects LLM overlap and suggests keeping the cheaper/better fit | ✅ Pass |
| 4 | writing use case + Cursor → Claude Pro | checkUseCaseFit — flags dev tools for non-dev teams | ✅ Pass |
| 5 | coding use case + ChatGPT → Cursor | checkUseCaseFit — suggests better specialized tools for specific team types | ✅ Pass |
| 6 | optimal spend returns keep + zero savings | Default rule — verifies that a lean stack triggers no warnings | ✅ Pass |
| 7 | total savings calculated correctly | runAudit() aggregation logic for multiple recommendations | ✅ Pass |
| 8 | isHighSavings true when savings > $500 | High-value lead identification logic in the results payload | ✅ Pass |
| 9 | Anthropic API + Claude Pro → drop subscription | checkApiVsSubscription rule — prevents double-paying for the same LLM | ✅ Pass |
| 10 | seat mismatch >15% triggers optimize | checkSeatMismatch rule — identifies waste when seats > team size | ✅ Pass |

### Verification Methodology
- **Framework**: Vitest
- **Environment**: Node.js 20
- **Coverage**: Core business logic in `audit-engine.ts` is 100% covered by the test suite.

All 10 tests passed on the final build.
