# @gtmstack/payments

Two payment rails, one router.

- **Stripe Connect** — standard wellness commerce. Operator is a Connected Account. Platform fee routes to GTMStack atomically via `application_fee_amount`.
- **CarePlug Pay** — high-risk categories (peptides, hormones, controlled substances). Routes around Stripe processor risk. Stub until partner credentials exist.

`src/router.ts` picks per product based on:
1. **Provider-review gating** — `Product.requiresProviderReview` short-circuits any charge to a review-pending decision.
2. **Plan gating** — clinical-tier products require an operator on the `clinical` plan.
3. **Processor selection** — wellness → Stripe Connect; clinical → CarePlug Pay.

Subscription is the default purchase model per doctrine.

## Layout

```
src/
  index.ts                       barrel exports
  types.ts                       PaymentAdapter, OperatorPlan, CheckoutIntent, PaymentEventSchema
  events.ts                      canonical event names (re-export)
  router.ts                      route(product, operator) → RouterDecision
  mock.ts                        in-app mock helpers for dev without Stripe keys
  adapters/
    stripe-connect.ts            full real implementation; mock-mode fallback
    careplug-pay.ts              stub conforming to PaymentAdapter
```

## Mock mode

If `STRIPE_PLATFORM_SECRET_KEY` is missing or starts with `sk_test_mock_`, every adapter call routes through `mock.ts` — synthesizes URLs that point back into the app's `/dev/checkout` page so the full purchase flow is testable end-to-end without any Stripe account. Production keys swap in with zero code changes.

## Adding a new processor

```
1. Create src/adapters/<name>.ts conforming to PaymentAdapter.
2. Add a router branch (or operator-level flag) selecting it.
3. Add env keys to .env.example and document them in CLAUDE.md.
```

No changes required to: route handlers, checkout flow, intake flow, UI components, Product type, event model.
