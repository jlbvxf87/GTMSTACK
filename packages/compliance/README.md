# @gtmstack/compliance

Three responsibilities:

1. **State rules** — `state-rules.ts` maps US states to product availability rules. Determines what an operator in TX can sell to a customer in CA.
2. **Audit logging** — `audit.ts` writes audit rows for PHI access and high-impact operator actions. Used inside `@gtmstack/database-clinical` accessors.
3. **Encryption helpers** — `encryption.ts` wraps the KMS for clinical data at rest. Mirrors patterns from CarePlug.

Data retention and deletion policies are enforced by scheduled Inngest jobs in `@gtmstack/jobs` that call into this package.
