# @gtmstack/analytics

PostHog wrappers. `events.ts` defines canonical product event names (string-typed) so consumers don't drift.

PostHog identifies users by operator id on operator/admin apps, by customer id on storefront, and is **not loaded at all** in the provider app (PHI surface).
