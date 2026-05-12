# @gtmstack/database-clinical

Supabase client and typed queries for the **clinical** project — patient intakes, provider reviews, medical history, prescription records, provider-patient messages.

This package is the **only** way app code reaches PHI. Every read goes through an audit-logged accessor.

## Non-negotiables

- Separate Supabase project from core. Cross-project references are opaque IDs only.
- Stricter RLS policies — every table.
- Audit log row on every PHI read (`compliance.phi_access_log`).
- Encryption at rest. `SUPABASE_CLINICAL_ENCRYPTION_KEY` is required.
- Auth context here is **provider only** (or service role from background jobs). Operator and customer contexts never reach this client.

See `docs/compliance/` for the full requirements.
