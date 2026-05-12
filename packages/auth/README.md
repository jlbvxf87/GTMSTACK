# @gtmstack/auth

Three distinct auth contexts. Session state is never shared across them.

- `requireOperator()` — `apps/operator`, `apps/admin`. Backs onto core Supabase Auth.
- `requireCustomer()` — `apps/storefront`. Backs onto core Supabase Auth, separate user table.
- `requireProvider()` — `apps/provider`. Backs onto **clinical** Supabase Auth.

Every server action and protected route calls one of these first. RLS is the second layer of defense, not the first.
