# @gtmstack/ai

Anthropic Claude as the primary brain. Structured tool use for actions. Prompts versioned as code.

## Hard rules

- AI **drafts**, humans **review** anything that touches a patient relationship or a financial decision.
- The AI never has direct write access to patient records or refund decisions. Those go through approve / edit / reject flows.
- AI cannot diagnose, prescribe, or make medical claims — approved scripts only.
- If Claude is unreachable, the system continues without AI augmentation rather than failing user actions.

## Layout

```
src/
  client.ts            # createClaude() — wraps prompt caching, retries, structured outputs
  prompts/
    brand-voice.ts     # operator brand voice generation
    support-draft.ts   # customer support reply drafts
    provider-draft.ts  # provider message reply drafts
    conversion-suggestions.ts
  tools/               # structured tool definitions for tool use
evals/
  run.ts               # eval harness
  brand-voice.eval.ts
  support-draft.eval.ts
```
