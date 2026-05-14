# GTMStack — Deployment runbook

The full path from `localhost` to a public URL anyone can click. Follow top-to-bottom; nothing here assumes you've done DevOps before.

Estimated time: **45–90 minutes** for everything. **15 minutes** for the first app alone.

---

## Phase 0 — What you already have

You should be able to check off all of these before starting:

- [ ] GTMSTACK repo on GitHub: `git@github.com:jlbvxf87/GTMSTACK.git` ✓
- [ ] Supabase Cloud project (`jsvgiazjdbvhaqgfcwsc.supabase.co`) ✓
- [ ] Anthropic API key (`sk-ant-api03-...`) ✓
- [ ] `.env.local` at the repo root with everything filled in ✓
- [ ] All eight doctrine sprints landed ✓
- [ ] `pnpm -r typecheck` is green ✓

If any of those is missing, fix it before continuing.

---

## Phase 1 — Vercel account

1. Go to **https://vercel.com**.
2. Click **Sign Up**.
3. Choose **Continue with GitHub**. Use the same GitHub account that owns the GTMSTACK repo.
4. Approve Vercel's request to access your GitHub.
5. Pick **Hobby (Free)** when prompted. You don't need Pro yet.

You're now logged in at `vercel.com/<your-username>`. There's a "+ New Project" button — that's where you'll come back four times.

---

## Phase 2 — Deploy `apps/marketing` first

The order matters because the other apps link to marketing. We do this one fully end-to-end before touching the others.

### 2.1 Create the project

1. Vercel dashboard → **+ Add New… → Project**.
2. Find **GTMSTACK** in the list. Click **Import**.
3. **Configure Project** screen — this is where the monorepo settings go.

### 2.2 Configure build settings

| Field | Value |
|---|---|
| Project Name | `gtmstack-marketing` |
| Framework Preset | **Next.js** (auto-detected) |
| Root Directory | Click **Edit** → set to `apps/marketing` |
| Build Command | Leave default. Vercel's pnpm monorepo detection handles it. |
| Output Directory | Leave default (`.next`) |
| Install Command | Leave default. |

If the build fails on the first deploy with an error about `pnpm-lock.yaml` not found, override:
- **Build Command**: `cd ../.. && pnpm install --frozen-lockfile && pnpm --filter @gtmstack/marketing build`
- **Install Command**: leave blank

### 2.3 Set environment variables

Click **Environment Variables** and paste each row below as a separate variable. Apply to **Production, Preview, Development** (all three checkboxes).

Open your local `.env.local` to copy the values verbatim:

```
NEXT_PUBLIC_SUPABASE_CORE_URL          = <copy from .env.local>
NEXT_PUBLIC_SUPABASE_CORE_ANON_KEY     = <copy from .env.local>
SUPABASE_CORE_SERVICE_ROLE_KEY         = <copy from .env.local>
ANTHROPIC_API_KEY                      = <copy from .env.local>
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY     = <copy from .env.local>
NEXT_PUBLIC_OPERATOR_URL               = http://localhost:3001     ← placeholder; we'll fix it after operator deploys
NEXT_PUBLIC_APP_URL                    = http://localhost:3000     ← placeholder; we'll fix it after we know our URL
```

Stripe variables — set these only if you have a real Stripe account. **Leave blank to keep the checkout in mock mode.**

```
STRIPE_PLATFORM_SECRET_KEY             = sk_test_... (or sk_live_...)
STRIPE_WEBHOOK_SECRET                  = whsec_... (set after Phase 6)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY     = pk_test_... (or pk_live_...)
```

### 2.4 Deploy

Click **Deploy**. First build takes ~2–4 minutes.

When it's done you'll see "🎉 Your project has been deployed". Click **Visit** — the marketing landing should render at something like `https://gtmstack-marketing.vercel.app`.

**Copy that URL.** You'll need it in Phase 3.

### 2.5 Fix the placeholder

Once you have the URL:
1. Project settings → Environment Variables.
2. Edit `NEXT_PUBLIC_APP_URL` → set to the URL Vercel just gave you (e.g. `https://gtmstack-marketing.vercel.app`).
3. **Deployments** tab → click the most recent deployment → **Redeploy** (⋯ menu).

---

## Phase 3 — Deploy `apps/operator`

Same pattern, different root directory.

1. Vercel → **+ Add New… → Project** → **Import** the GTMSTACK repo *again*. (Yes, the same repo. Vercel allows multiple projects per repo.)
2. Configure:

| Field | Value |
|---|---|
| Project Name | `gtmstack-operator` |
| Framework Preset | Next.js |
| Root Directory | `apps/operator` |

3. Environment variables (apply to all three environments):

```
NEXT_PUBLIC_SUPABASE_CORE_URL          = <same as marketing>
NEXT_PUBLIC_SUPABASE_CORE_ANON_KEY     = <same>
SUPABASE_CORE_SERVICE_ROLE_KEY         = <same>
ANTHROPIC_API_KEY                      = <same>
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY     = <same>
NEXT_PUBLIC_APP_URL                    = <marketing URL from Phase 2>
STRIPE_PLATFORM_SECRET_KEY             = <same as marketing or blank>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY     = <same or blank>
INNGEST_EVENT_KEY                      = <leave blank for now — mock mode>
INNGEST_SIGNING_KEY                    = <leave blank>
POSTHOG_KEY                            = <leave blank for now>
```

4. **Deploy**.
5. After it's live, **copy the operator URL** (`https://gtmstack-operator.vercel.app`).

### 3.1 Wire marketing → operator

Go back to the **marketing** project → Environment Variables → edit `NEXT_PUBLIC_OPERATOR_URL` → paste the operator URL. Redeploy marketing.

Now visit your marketing URL and click any "Launch Your Business" button — it should send you to the operator app's `/signup` route. That's the first cross-app link working in production.

---

## Phase 4 — Deploy `apps/storefront`

1. **+ Add New… → Project** → import GTMSTACK.
2. Configure:

| Field | Value |
|---|---|
| Project Name | `gtmstack-storefront` |
| Root Directory | `apps/storefront` |

3. Environment variables:

```
NEXT_PUBLIC_SUPABASE_CORE_URL          = <same>
NEXT_PUBLIC_SUPABASE_CORE_ANON_KEY     = <same>
SUPABASE_CORE_SERVICE_ROLE_KEY         = <same>
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY     = <same>
NEXT_PUBLIC_OPERATOR_URL               = <operator URL from Phase 3>
NEXT_PUBLIC_APP_URL                    = <marketing URL>
```

4. **Deploy**.
5. Live URL goes to `https://gtmstack-storefront.vercel.app`.

In dev you hit storefronts via `localhost:3002/?operator=prime-wellness`. On Vercel without custom DNS, the query-param fallback works the same: `https://gtmstack-storefront.vercel.app/?operator=prime-wellness`.

Wildcard subdomains (`primewellness.gtmstack.shop`) only work with a custom domain on Vercel Pro — that's Phase 7.

---

## Phase 5 — Deploy `apps/provider`

1. **+ Add New… → Project** → import GTMSTACK.
2. Configure:

| Field | Value |
|---|---|
| Project Name | `gtmstack-provider` |
| Root Directory | `apps/provider` |

3. Environment variables:

```
NEXT_PUBLIC_SUPABASE_CORE_URL          = <same>
NEXT_PUBLIC_SUPABASE_CORE_ANON_KEY     = <same>
SUPABASE_CORE_SERVICE_ROLE_KEY         = <same>
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY     = <same>
INNGEST_EVENT_KEY                      = <leave blank>
```

4. **Deploy**.
5. Live URL: `https://gtmstack-provider.vercel.app`.

Provider portal needs you to be both signed in AND have a row in `public.providers`. You already inserted that row locally; the same database backs both local and Vercel, so signing in on the deployed provider portal should land you straight in the queue.

---

## Phase 6 — End-to-end smoke test

Open each URL and confirm:

| Test | URL | Pass criteria |
|---|---|---|
| Landing renders | `https://gtmstack-marketing.vercel.app` | Hero image, all sections, CTAs |
| Brand voice demo | Click "Try it" anchor | Picks preset → click Generate → phone preview renders |
| Marketing → operator link | Click "Launch Your Business" | Lands on `gtmstack-operator.vercel.app/signup` |
| Operator login | `…operator.vercel.app/login` | Sign in with `jaronlbaston87@gmail.com` |
| Operator dashboard | After login | MRR / active subs / events render (likely zeros) |
| Operator analytics | `/dashboard/analytics` | 30-day chart cards render (empty state if no data) |
| Storefront resolves | `…storefront.vercel.app/?operator=prime-wellness` | Prime Wellness brand voice + products show |
| Provider login | `…provider.vercel.app/login` | Sign in → land on `/queue` with the seed intake row |

If anything errors with a 500, Vercel project → **Logs** tab shows the runtime error. Most likely cause is a missing env var.

---

## Phase 7 — (Optional) Custom domains

**Skip this for now** unless you've already bought a domain.

### 7.1 Buy `gtmstack.com` + `gtmstack.shop`

Recommended registrars: Cloudflare ($9/yr), Namecheap, or Porkbun. Cloudflare is easiest because DNS lives in the same dashboard.

### 7.2 Point the domain at Vercel

For each app project:

| App | Domain | Vercel project |
|---|---|---|
| Marketing | `gtmstack.com` + `www.gtmstack.com` | gtmstack-marketing |
| Operator | `app.gtmstack.com` | gtmstack-operator |
| Provider | `providers.gtmstack.com` | gtmstack-provider |
| Storefront | `*.gtmstack.shop` (needs Pro) | gtmstack-storefront |

For each one:
1. Vercel project → Settings → **Domains**.
2. Type the domain → **Add**.
3. Vercel shows you DNS records to add. For Cloudflare: copy each `CNAME` / `A` record into Cloudflare DNS.
4. Wait 1–5 minutes for DNS propagation.

### 7.3 Update env vars to use the new domains

After all custom domains are wired:

- Marketing project: `NEXT_PUBLIC_OPERATOR_URL` → `https://app.gtmstack.com`, `NEXT_PUBLIC_APP_URL` → `https://gtmstack.com`
- Operator project: `NEXT_PUBLIC_APP_URL` → `https://gtmstack.com`
- Storefront project: `NEXT_PUBLIC_OPERATOR_URL` → `https://app.gtmstack.com`

Redeploy each project after editing.

### 7.4 Wildcard subdomain for storefront

This is the **only** step that requires Vercel Pro ($20/mo for the storefront project — you don't need it on the others).

1. Upgrade the storefront project to Pro.
2. Settings → Domains → add `*.gtmstack.shop`.
3. In Cloudflare: add a wildcard CNAME `*.gtmstack.shop → cname.vercel-dns.com`.

Once that resolves, `primewellness.gtmstack.shop` → renders the Prime Wellness storefront via the Host header resolver in `apps/storefront/lib/operator-resolver.ts`.

---

## Phase 8 — (When you take real money) Stripe webhook

You can skip this until you actually charge a real card. While `STRIPE_PLATFORM_SECRET_KEY` is blank, mock mode handles everything — no webhook needed.

### 8.1 Wire it up

1. Stripe dashboard → **Developers → Webhooks → + Add endpoint**.
2. Endpoint URL: `https://gtmstack.com/api/webhooks/stripe` (or your `.vercel.app` URL).
3. Events to send: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`.
4. **Save**. Stripe shows a signing secret starting with `whsec_…`. Copy it.
5. Marketing project → env vars → `STRIPE_WEBHOOK_SECRET = whsec_…`. Redeploy.

### 8.2 Test it

Stripe dashboard → Webhooks → click your endpoint → **Send test webhook** → choose `checkout.session.completed`. Check:
- Vercel marketing project → Logs → see the webhook log line.
- Supabase → `public.events` table → see a new row.

If both fire, you're done.

---

## Phase 9 — (Optional) Inngest for retention jobs

Skip until you have customers + want to send welcome emails.

1. Sign up at **inngest.com** (free tier covers ~50k events/mo).
2. New app → **Connect endpoint** → URL: `https://app.gtmstack.com/api/inngest`.
3. Inngest discovers the five functions (welcome-series, thirty-day-checkin, refill-nudge, win-back, intake-pending-reminder).
4. Inngest dashboard → Settings → copy `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY`.
5. Set both on the **operator** Vercel project. Redeploy.

After that, `order.created` events trigger actual function runs. The functions still log to console for now (no real email is sent) until you wire Resend in a future sprint.

---

## Troubleshooting

**"Module not found: @gtmstack/ui" during build**
Vercel didn't run `pnpm install` at the workspace root. Override the Install Command on the failing project to `pnpm install --frozen-lockfile` (no `--filter`). Or override Build Command to `cd ../.. && pnpm install --frozen-lockfile && pnpm --filter <package-name> build`.

**500 on the deployed site**
Vercel project → **Logs** tab → look for the stack trace. 99% of the time it's a missing env var. Cross-check against the lists in Phases 2–5.

**"This site can't be reached" when clicking cross-app CTAs**
You haven't updated the `NEXT_PUBLIC_OPERATOR_URL` placeholder on the marketing project. Phase 2.5 / Phase 3.1.

**Operator signup works locally but fails on Vercel**
The pinned `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` env var must be set to the **same value** on every project. If you have different values across projects, server actions encrypted on one host won't decrypt on another.

**Storefront shows the Prime Wellness fallback instead of the operator brand**
Either the operator hasn't completed onboarding (so no storefront row exists) or the Host header doesn't match. In dev use `?operator=<slug>`. In prod the wildcard subdomain has to be wired (Phase 7.4) for the Host header to work.

---

## What "done" looks like

You can text a friend any of these links and they'll see what you built:

- `https://gtmstack.com` — pitch site, brand voice demo, pricing
- `https://app.gtmstack.com/signup` — they can sign up as an operator
- `https://primewellness.gtmstack.shop` — the demo storefront (after Phase 7.4)
- `https://providers.gtmstack.com/login` — provider portal (after a real provider is onboarded)

At that point this stops being a private build and starts being a real product running on the internet.
