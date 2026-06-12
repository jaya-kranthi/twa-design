# Design Brief — TWA Weather Data Marketplace
_Internal design-positioning input (ux-discovery, silent). Drives theme-picker, ui-ux-pro-max, design-system, IA placement, and per-screen passes. Not shown to the customer._

Derived from `product-spec.md` (§ Personas, § Features, § Design Positioning) + `architecture.md` (AI detection).

## 1. Audience archetype + emotional need

| Persona | Archetype | Context of use | Primary emotional need |
|---|---|---|---|
| **Org User** _(LEAD — bread-and-butter loop)_ | Technical analyst / data scientist / GIS or risk modeller at a subscribing org. High data literacy, lives in tables, filters, and APIs. | At a desk, hunting for the right dataset + version to pull into a model or report. | **Clarity** — instantly see what exists, what they're entitled to, and how to get it (download or API). |
| **Org Admin** | Procurement-minded team lead / ops owner. Mixes light technical comfort with budget/governance concern. | Managing seats, the org API key, and the subscription; occasional dataset access. | **Control + trust** — confident the org's plan, members, and spend are in order. |
| **Super Admin (TWA)** | Platform operator / data steward. Deep domain + governance authority. | Running the marketplace: approvals, plans, dataset lifecycle, ingestion health. | **Authority + assurance** — oversight of every tenant, dataset, and request without clutter. |

**Lead persona:** Org User. The aesthetic anchors on a calm, precise, catalog-first data experience; Admin and Super Admin inherit the same visual language with added management depth (denser tables, queues, governance controls) — not a different look.

## 2. Empathy snapshot (lead persona — Org User)

- **Says:** "Is there rainfall data for the Caribbean in 2023? Which version is current? Can I actually download it on our plan?"
- **Thinks:** "I need to trust this data's provenance before I model on it. Don't make me guess what I'm entitled to."
- **Does:** Searches/filters the catalog, compares dataset versions, checks metadata, downloads or copies API instructions.
- **Feels:** Impatient with chrome and marketing fluff; reassured by precise metadata, clear version history, and honest entitlement states (not dark-pattern upsell walls).

## 3. Journey emotional arc — the biggest lever

| Phase | User goal | Target emotion | Design implication |
|---|---|---|---|
| First run (post-approval) | Understand what the marketplace offers + take a first action | Reassured, oriented | Spacious guided home / empty states that *sell* the catalog; soft surfaces, generous whitespace, a single clear CTA. |
| Discovery (core loop) | Find the right dataset fast | Capable, in-flow | Dense, legible catalog + search; minimal chrome; instant filter feedback; calm neutral canvas so data is the figure. |
| Dataset detail | Trust provenance + check entitlement | Confident, informed | Strong metadata legibility, version timeline, explicit entitlement badge; the "download / API" action is the hero. |
| NL search "key moment" | Ask in plain English, get filters | Delighted-but-trusting | Show the *interpreted filters* transparently (chips), one-tap refine; a discreet AI identity marker — never AI-as-authority. |
| Entitlement limit / locked | Hit a wall gracefully | Respected, not punished | Honest "not in your plan / limit reached" states with a calm upgrade-request affordance, no aggressive red. |
| Admin / Super governance | Approve, govern, manage | Assured, efficient | Confident accent on primary actions; queues and status machines read like an instrument panel, not an alert storm. |

## 4. Positioning + differentiation

- **Market position:** Enterprise-trusted, premium scientific data product. TWA sells proprietary satellite-derived datasets to organizations — the UI must read as credible and authoritative, the way a trusted data vendor's console does.
- **Visual differentiation intent:** A clean, data-rich **"scientific instrument marketplace"** — catalog-first, metadata-legible, entitlement-clear. Deliberately *unlike* (a) a generic indigo/navy B2B SaaS dashboard, and (b) a consumer app-store. Think the quiet precision of a research/observability console (Linear/Stripe-grade polish) tuned for atmospheric data.

## 5. Tone of voice

Precise, credible, calm. **Adjectives:** data-forward, confident, plain-spoken, uncluttered. Never playful, never jargon-as-decoration, never hype. Errors and limits are honest and actionable, not cute.

## 6. AI-UX posture

**Product has ONE AI surface: NL catalog search** (Bedrock-backed NL→filter translation; no generation, no vector search). Posture: **transparent translator, never authority.**

| AI surface | Patterns (`ai-ux-patterns`) |
|---|---|
| NL search bar (catalog) | **inputs** (prompt-hint placeholder showing what to ask, examples), **identifiers** (discreet "interpreted by AI" marker on the resolved filters), **trust-builders** (always render the structured filters it produced so the user sees + can edit them), **governors** (one-tap "refine"/clear, graceful fallback to keyword search on low confidence or error). No streaming chat, no agent, no autonomy. |

The AI is a convenience layer over deterministic catalog filters — the design must make that legible: the interpreted filters are editable chips, results are normal catalog results, and a low-confidence/error path silently degrades to keyword search.

## 7. Design implications (hand-off table — downstream skills read this first)

| Dimension | Direction | Why |
|---|---|---|
| **Palette mood** | Cool, atmospheric, restrained-to-medium saturation. Primary = deep **teal/cyan** (evokes atmosphere, ocean, satellite imagery); neutral base = precise cool **slate**. Premium signal accent = warm **amber/sand** used sparingly for highlights/premium entitlements. Plus a categorical data-viz ramp for charts/regions. | Differentiates from generic navy/indigo SaaS; ties to the weather/satellite domain; amber adds "premium asset" warmth against the cool canvas. |
| **Typography** | Grotesque-precise. Display/heading: **Geist** (or Inter Tight) — engineered, neutral-confident. Body: **Inter**. **Monospace (Geist Mono / JetBrains Mono)** for dataset IDs, version tags, API keys, and metrics — tabular figures throughout. | Precision over warmth; mono signals "data/technical" and keeps IDs/metrics scannable. (assumed pairing) |
| **Density** | Balanced overall; **compact** for catalog/tables/queues; **spacious** for onboarding/empty/first-run. | Lead persona lives in dense data; first-run must reassure and sell. |
| **Radius / shape** | Medium-small (8px cards/inputs, 6px controls, 4px on data tables/badges). Crisp, not pill. | Reads precise and instrument-like, not consumer-soft. |
| **Motion** | Subtle: 150–200ms ease on hover/route/expand; skeleton loaders for lists/dashboards; no decorative motion, no bounce. Respect reduced-motion. | Calm, capable; motion communicates state, never decorates. |
| **Anti-pattern to avoid (this project)** | No generic navy-dashboard + purple→blue gradients, no card-in-card nesting, no untinted pure black, no AI-as-chatbot framing for NL search, no aggressive red upsell walls on entitlement limits. | These are the exact "looks like every other SaaS / AI app" tells the differentiation intent rejects. |

_Every non-spec choice above marked `(assumed)` is a sensible production default surfaced to the customer later via ux-builder's batched confirmation and the mockups — never asserted as fact._
