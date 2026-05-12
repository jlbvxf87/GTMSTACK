# @gtmstack/payments

Two payment rails, one router.

- **Stripe Connect** — standard wellness commerce. Every operator is a connected account. Platform fees, payouts, and 1099s are clean.
- **CarePlug Pay** — high-risk categories (peptides, hormones, controlled substances). Routes around Stripe processor risk.

`src/router.ts` decides per product based on category, operator state, and patient state.

Subscription is the default purchase model. Single purchase exists in the data model but is subtly de-emphasized in UI.
