# supabase/

Two separate Supabase projects. **Never combine.**

```
core/migrations/       # operators, brands, products, orders, subscriptions, AI ops, analytics
clinical/migrations/   # patient intakes, provider reviews, medical history, prescription records
```

Workflow:

```bash
# core
supabase link --project-ref $SUPABASE_CORE_PROJECT_ID --workdir supabase/core
supabase db push --workdir supabase/core

# clinical
supabase link --project-ref $SUPABASE_CLINICAL_PROJECT_ID --workdir supabase/clinical
supabase db push --workdir supabase/clinical
```

Cross-project references are by opaque IDs only (`patient_id` in core is meaningless to core — it can only be resolved by `apps/provider` calling into `@gtmstack/database-clinical`).
