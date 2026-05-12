# @gtmstack/jobs

Inngest functions. All long-running, retry-required, or scheduled work goes through Inngest — never raw cron.

Examples: welcome sequences, Stripe → order reconciliation, AI conversation summaries, retention sequences, data retention enforcement, 1099 generation.

Apps mount the Inngest handler at `/api/inngest`. Job definitions are imported from this package.
