# Design Recommendations — TWA Weather Data Marketplace
_ui-ux-pro-max output. Inputs: ux/tokens.json + product-spec.md + ux/design-brief.md._

## Chosen UI style

**"Scientific data console"** — a precise, catalog-first data-product UI in the lineage of Linear / Stripe / Vercel dashboards, tuned for an atmospheric-data domain. Cool slate canvas, deep-teal primary, mono for technical metadata, dense-but-legible tables. Rejects the generic navy-indigo SaaS look and any consumer-app-store framing.

## Color palette (from tokens.json)

| Role | Light | Use |
|---|---|---|
| Primary / accent | deep teal `oklch(52% 0.11 215)` | Primary actions, active nav, links, focus ring. |
| Premium | warm amber `oklch(70% 0.14 70)` | Sparingly: premium plan badges, entitlement highlights, "current version" star. Never a primary CTA color. |
| Neutrals | cool slate (bg → fg ramp) | Canvas, surfaces, borders, text. Data is the figure; chrome recedes. |
| Success / Warn / Danger | green / amber / muted-red | Status badges, validation, lifecycle states. Danger is muted (no aggressive red upsell walls). |
| Data-viz ramp | 8 categorical hues | Charts, region/category coding, sparklines. |

**Contrast floor:** WCAG 2.2 **AA** (4.5:1 text, 3:1 large text/UI). `fg` on `bg`, `accent-fg` on `accent`, and all badge fg/bg pairs verified at AA. Mono metric text never below `body-sm` size on color.

## Typography

- **Display/Heading:** Geist (fallback Inter Tight) — grotesque-precise, tight tracking on large sizes.
- **Body:** Inter.
- **Mono:** Geist Mono / JetBrains Mono — dataset IDs, version tags (`v3`), API keys, numeric metrics; `tabular-nums` so columns align.
- Type scale is restrained (display 32px → caption 13px) to keep dense screens calm.

## Component pattern recommendations (per interaction type)

| Interaction | Pattern | Rationale |
|---|---|---|
| Primary navigation | Left sidebar (role-aware), top bar for search + bell + account | App-shell contract; primary destinations only on the left. |
| Edit a record (member, plan, dataset metadata) | **Right drawer/sheet** | Keeps list context; less jarring than a center modal for forms. |
| Confirm destructive (delete, revoke, suspend) | **Center `<dialog>`** with typed/explicit confirm | Modal = deliberate stop for irreversible actions. |
| Create (invite member, define plan) | Right drawer | Consistent with edit. |
| Quick view (notification, key reveal) | Popover / small modal | Lightweight, dismissible. |
| Catalog browse | Filter rail (left of results) + result list/grid toggle + sort | Data-dense discovery; filters always visible ≥1024px, collapsible below. |
| NL search | Single search input with prompt-hint + **interpreted-filter chips** rendered below | Transparent AI: shows what it understood, chips are editable. |
| Tables (members, datasets, queues, history) | Sticky header, sortable columns, row hover, row kebab actions, pagination, density toggle | Production table anatomy. |
| Dashboard | KPI tiles (value + delta + sparkline + "as of") + drill-through | Per spec § Metrics tiles. |
| Loading | **Skeleton** for lists/dashboards/detail; spinner only for in-button/async actions | Calm perceived performance. |
| Empty / first-run | Illustration/icon + headline + one CTA (sell the product) | Activation, not blank panels. |
| Status (org, dataset lifecycle, member, subscription) | Tinted badge with dot + tooltip on allowed transitions | Status-machine legibility. |
| Toast | Bottom-right, auto-dismiss, role into history | Action feedback. |

## Navigation pattern (§9 heuristics applied)

- Account / profile / **Settings** / sign-out → **top-right avatar menu**, never the left nav.
- Left sidebar = primary destinations only, re-rendered per persona from `NAV_BY_ROLE`.
- A **Developer / API** area is its own left-nav section (Super Admin: ingestion + platform key; Org: org key + API docs) — but personal/settings-level controls stay in Settings.
- Adaptive: sidebar ≥1024px → hamburger drawer below; never mixed patterns at one level.
- Breadcrumbs on 3+ level routes (e.g. Catalog → Dataset → Version).

## Accessibility floor

WCAG 2.2 AA: visible focus-visible ring on every interactive element, logical focus order, `<dialog>` focus-trap + restore, all icons have labels, hit targets ≥44px, reduced-motion fallback mandatory, no color-only status (always dot/icon + text), heading levels never skipped.

## Anti-slop guardrails (enforced in mockups)

No default-font-everything, no purple→blue gradients, no card-in-card nesting, no untinted pure black, no bounce easing, no decorative glows, no sub-44px targets, no Lorem ipsum (realistic domain sample data only), disciplined line length on prose.

## Icon + illustration set

**Lucide** icons (outline, consistent stroke) — matches the precise grotesque type. Spot illustrations for empty states kept minimal/line-based (no 3D blobs).
