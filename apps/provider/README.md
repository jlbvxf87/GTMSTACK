# apps/provider

`providers.gtmstack.com` — clinical review interface for licensed providers. Patient intakes, provider reviews, medical history, prescription decisions, provider-patient messaging.

Auth context: **provider** (separate Supabase Auth on the clinical project). Reads/writes the clinical Supabase project only. Every PHI read is audit-logged via `@gtmstack/database-clinical`.

AI is **draft-only** here. Providers approve / edit / reject AI-drafted replies — Claude never writes patient records directly.
