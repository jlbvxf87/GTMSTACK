# GTMSTACK Backend Contract

This contract keeps the business model clean:

```text
Operator Store
-> GTMSTACK Commerce Layer
-> Licensed Infrastructure Partner
```

The operator is a brand partner and acquisition channel. The operator is not the pharmacy, distributor, prescriber, compounder, dispensing entity, or fulfillment entity.

## Core Roles

| Role | Owns | Must Not Own |
| --- | --- | --- |
| Operator | Brand, audience, content, education, acquisition, customer relationship | Prescribing, compounding, dispensing, regulated fulfillment, inventory |
| GTMSTACK | Storefronts, checkout, AI, automations, tracking, subscriptions, events, support flows | Medical approval, pharmacy operations, clinical judgment |
| Licensed Partner | Provider review, prescription approval where required, dispensing, fulfillment, compliance, inventory | Operator branding and audience relationship |
| Customer | Checkout, intake, support history, subscription state | Internal partner/vendor controls |

## V1 Tables

Keep V1 small:

```text
users
organizations
storefronts
products
orders
subscriptions
customers
leads
ai_agents
conversations
events
```

## V1 Rules

- `organizations` represent operator-owned brand entities, not pharmacies.
- `storefronts` represent branded acquisition surfaces, not regulated fulfillment entities.
- `products` should include a `lane` concept before regulated products are introduced.
- `orders` should track customer purchase state, not imply pharmacy fulfillment.
- `events` should be the source for provisioning, email, follow-up, dashboard updates, and support escalation.
- AI records must preserve approved scripts, guardrails, and escalation reasons.

## Product Lanes

```text
wellness_supplement
clinical_telehealth
research_only
```

V1 should prioritize `wellness_supplement`.

`clinical_telehealth` requires intake, provider review, prescription rules, vendor routing, consents, and audit logs.

`research_only` should not be the first launch lane because implied human use, claims, payment processing, and fulfillment legality create high risk.

## Regulated Extension Tables

Only add these after basic commerce works:

```text
vendor_accounts
provider_reviews
prescription_requirements
state_rules
consents
audit_logs
fulfillment_events
```

## Required Event Names

```text
owner.created
storefront.created
lead.created
checkout.completed
order.created
subscription.renewed
ai.conversation.started
support.escalated
vendor.fulfillment_requested
vendor.fulfillment_updated
provider.review_requested
provider.review_completed
consent.accepted
```

## Hard AI Rule

AI cannot diagnose, prescribe, or make medical claims.

AI can:

- Answer approved FAQs
- Explain product education copy
- Qualify leads
- Help with support questions
- Suggest follow-up
- Coach the operator on next actions

AI must escalate:

- Medical questions
- Adverse event language
- Prescription questions
- Claims outside approved scripts
- Refund, chargeback, or legal threats
