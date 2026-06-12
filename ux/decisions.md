# UX Decision Log — TWA Weather Data Marketplace

## Step 1 — Theme + design system (locked)
- **Preset:** `professional`, deviated to a cool **scientific-instrument** palette (deep-teal primary `oklch(52% 0.11 215)`, cool-slate neutrals, sparing amber premium accent, 8-hue data-viz ramp). Rationale: differentiate from generic navy/indigo SaaS; tie to atmospheric-data domain (design-brief §7).
- **Type:** Geist (display) / Inter (body) / Geist Mono (IDs, versions, keys, metrics — tabular). Precision over warmth.
- **Density:** balanced; compact tables/queues, spacious onboarding/empty.
- **Radius:** controls 6 / cards 8 / large 12 / badges 4. No pill (except avatar/toggle).
- **Dark mode:** YES for v1 (system-aware + manual toggle) — data tools benefit.
- **Reduced-motion:** mandatory fallback. **RTL:** N for v1. **Icon set:** Lucide. **Illustration:** minimal line-based.

## Step 2 — App-shell + IA (locked)
- **Shell:** top bar (logo · global search · role switcher · 🔔 bell · avatar menu) + role-aware left sidebar (primary nav only) + main with breadcrumbs on 3+ level routes. Marketing/auth use top-bar-only shell.
- **Account / Settings / Sign-out:** top-right avatar menu ONLY (layout-lint rule 1).
- **Settings:** one screen, role-gated sections (Profile · Password · Appearance · Notifications · API key — org-scoped under Settings for Org Admin). Never in left nav.
- **Developer/API area:** Super Admin gets a "Developer" left-nav section (ingestion + platform key + API docs); Org gets org-key management under Settings + an "API access" reference. Personal-level controls stay in Settings.
- **Role switcher:** first-class review affordance (≥2 human personas). Sidebar re-rendered wholesale from `NAV_BY_ROLE[role]` (`replaceChildren`) on every switch — never accumulate. Route-gating + landing reset on switch. Mockup-only; generates no ticket; not in product-spec § Features.

## Interaction patterns (locked — feature tickets must not drift)
- Create/edit (member, plan, dataset metadata) → **right drawer/sheet**.
- Destructive (delete, revoke, suspend, archive) → **center `<dialog>`** with explicit confirm.
- Quick view (notification, key reveal, column menu) → **popover**.
- Loading: **skeleton** for list/detail/dashboard; spinner only inside async buttons.
- NL search: single input + prompt-hint + **editable interpreted-filter chips**; keyword fallback on low confidence/error.

## Layout waivers
_None._
