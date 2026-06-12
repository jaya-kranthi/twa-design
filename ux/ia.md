# Information Architecture — TWA Weather Data Marketplace
_Page/screen map + route hierarchy + navigation pattern. Source for mockups, access-matrix, and the ticket inventory. Personas: Super Admin · Org Admin · Org User (machine actors have no pages)._

## Navigation pattern
- **Authenticated:** shared app-shell — top bar (logo · global search · role switcher · 🔔 bell · avatar menu) + **role-aware left sidebar** (primary nav only, re-rendered wholesale per persona) + main region with breadcrumbs on 3+ level routes.
- **Public / auth:** top-bar-only shell (logo · "Sign in" / "Apply for access"). No sidebar.
- **Account · Settings · Sign-out:** top-right avatar menu only — never the left sidebar.

## A. Public + Auth views (top-bar-only shell, no persona)
Each is a **distinct view** (per product-spec § Auth distinct views) — never collapsed.

| Route | Screen | Notes |
|---|---|---|
| `#/landing` | Marketing landing | Value prop + "Apply for access" + "Sign in". Public. |
| `#/apply` | Apply / Request access (multi-step) | Steps: 1 Org details (name, business type, size) · 2 Contact · 3 Intended use · 4 Requested plan tier · 5 Review & submit. |
| `#/apply/pending` | Application-pending status | "Submitted — pending TWA review"; resend confirmation. |
| `#/signin` | Sign in | Email + password; links to reset + apply. |
| `#/verify-email` | Email verification | Resend (throttled) + verified success. |
| `#/reset-request` | Password reset — request | Email entry. |
| `#/reset-confirm` | Password reset — confirm | New password + rules. |
| `#/set-password` | First-login / set password | On approval (admin) or invite accept; temp-password → new password. |
| `#/accept-invite` | Accept invite | Shows org + role; → set-password. |
| `#/expired` | Expired/used link · expired session | Generic recovery (re-request / sign in). |

## B. Org User (left nav, re-rendered for `user`)
Sidebar: **Dashboard · Catalog · My downloads · Reports · (Notifications via bell)**

| Route | Screen |
|---|---|
| `#/dashboard` | Org User dashboard — tiles: My downloads, Available datasets (drill-through). |
| `#/catalog` | Catalog — NL search + filter rail + table/grid toggle + sort + pagination. |
| `#/catalog/dataset/:id` | Dataset detail — metadata, version history (current marked), entitlement badge, **Download** + **API access instructions** panel (org-key snippet). |
| `#/downloads` | My download history — table + export. |
| `#/reports` | Reports — basic role-scoped report + export. |
| `#/notifications` | Notifications (full page) — list, filters, mark-all-read. |
| `#/settings/profile` · `#/settings/password` · `#/settings/appearance` · `#/settings/notifications` | Settings (avatar menu) — role-gated sections. |

## C. Org Admin (left nav, re-rendered for `admin` — superset of User core + management)
Sidebar: **Dashboard · Catalog · Members · Subscription · Reports · (Notifications via bell)**

| Route | Screen |
|---|---|
| `#/dashboard` | Org Admin dashboard — tiles: Org usage, Members, Subscription (drill-through). |
| `#/onboarding` | Onboarding checklist (first-run) — verify org profile → invite members → review entitlements. Dismissible; reachable from dashboard banner until complete. |
| `#/catalog`, `#/catalog/dataset/:id` | Catalog + detail (same as User). |
| `#/downloads` | Org download/usage history. |
| `#/members` | Members — list (filter role/status, sort), **Invite** drawer, **Edit role** drawer, **Deactivate** + **Confirm deactivate** dialog, resend/revoke pending invite. |
| `#/subscription` | Subscription — current plan, entitlement/limit usage bars, renewal/expiry, **Request plan change** drawer. |
| `#/reports` | Org usage report — downloads/API calls vs limits + export. |
| `#/notifications` | Notifications (full page). |
| `#/settings/profile` · `password` · `appearance` · `notifications` · `#/settings/org` · `#/settings/api-key` | Settings — adds **Org profile** + **Org API key** (generate→reveal-once→masked→rotate→revoke + usage). |

## D. Super Admin (left nav, re-rendered for `super`)
Sidebar: **Platform overview · Tenants · Approvals · Plans · Catalog · Governance · Developer ▸ (Ingestion · Platform key) · Reports**

| Route | Screen |
|---|---|
| `#/super/dashboard` | Platform overview — tiles: Tenants (active/pending/suspended), Datasets (published/total + recent ingestions), Ingestion activity (succeeded/failed). |
| `#/super/tenants` | Tenants — orgs list (status filter), row → detail. |
| `#/super/tenants/:id` | Tenant detail — org profile, plan, members (read), usage, **Suspend / Reactivate** dialog. |
| `#/super/approvals` | Approval queue — tabs: **Org applications** (approve → **assign plan**, or reject-with-note) · **Plan-change requests** (approve/reject). |
| `#/super/plans` | Plans — plan-tier list; **Create / Edit plan** drawer (entitlements: allowed categories, max users, max downloads, etc.). |
| `#/catalog`, `#/catalog/dataset/:id` | Catalog + detail — shared catalog; detail exposes **governance actions** for Super Admin. |
| `#/super/governance` | Dataset governance & lifecycle — datasets list with lifecycle status; transitions (Draft→Published→Deprecated→Archived), retention policy, visibility. |
| `#/super/ingestion` | Ingestion history (Developer) — pushes succeeded/failed, validation errors, payload/version info. |
| `#/super/api-key` | Platform API key (Developer) — Super Admin ingestion key lifecycle + usage. |
| `#/super/reports` | Platform reports — platform-wide metrics + export. |
| `#/notifications` | Notifications + (approvals deep-link). |
| `#/settings/profile` · `password` · `appearance` · `notifications` | Settings. |

## E. System views (all personas)
| Route | Screen |
|---|---|
| `#/403` | Not authorized (cross-tenant / above-role) — safe bounce. |
| `#/404` | Not found. |
| Suspended-org lock | Suspended-org members see a locked state overlay (nav disabled except Settings/sign-out). |

## Sidebar source-of-truth (`NAV_BY_ROLE`)
- **user:** Dashboard, Catalog, My downloads, Reports
- **admin:** Dashboard, Catalog, Members, Subscription, Reports
- **super:** Platform overview, Tenants, Approvals, Plans, Catalog, Governance, Developer (Ingestion, Platform key), Reports

Notifications is always the top-bar bell (+ a full page reachable from it) — not a sidebar item. Settings is always the avatar menu.
