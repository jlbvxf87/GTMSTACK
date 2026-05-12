# @gtmstack/database-core

Supabase client and typed queries for the **core** project (operators, brands, products, orders, subscriptions, AI ops, analytics, customers).

App code never instantiates a Supabase client directly. It imports from here.

## Layout

```
src/
  index.ts            # createServerClient, createBrowserClient, createServiceClient
  types.ts            # generated via `pnpm gen:types`
  queries/
    operators.ts
    brands.ts
    products.ts
    orders.ts
    subscriptions.ts
    ...
```

## Rules

- Every query co-located here, never inlined in app code.
- RLS is the second line of defense, not the first — every server action checks operator auth context before calling a query.
- Never read PHI here. PHI lives in `@gtmstack/database-clinical`.
