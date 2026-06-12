# Access Matrix — TWA Weather Data Marketplace
_Page × human-persona × capability. Derived from product-spec § 3 (feature entry points + permissions) and § 7 RBAC matrix. Machine actors (Ingestion client, Org API consumer) excluded — they have no pages. Single source for FE per-persona rendering/authz **and** BE per-endpoint authz ACs._

Legend: `—` no access (not in nav) · `view` read-only · mutation subset listed · conditions inline.

| Route / Screen | Org User | Org Admin | Super Admin |
|---|---|---|---|
| `#/dashboard` (org) | view (own metrics) | view (org metrics) | — (uses `#/super/dashboard`) |
| `#/super/dashboard` | — | — | view (platform) |
| `#/onboarding` | — | view, complete (own org, first-run) | — |
| `#/catalog` | view, search | view, search | view, search |
| `#/catalog/dataset/:id` | view; download *(if entitled)*; copy API instructions | view; download *(if entitled)* | view; **govern** (lifecycle, retention, visibility) |
| `#/downloads` | view (own) | view (org) | — |
| `#/members` | — | view, create (invite), edit (role), deactivate, resend/revoke invite *(own org; last-admin guard)* | — |
| `#/subscription` | — | view; request plan change | — (manages via Plans/Approvals) |
| `#/super/plans` | — | — | view, create, edit, delete *(no org currently on it)* |
| `#/super/tenants` | — | — | view |
| `#/super/tenants/:id` | — | — | view; suspend, reactivate; assign/change plan |
| `#/super/approvals` | — | — | view; approve (→assign plan), reject (with note) — orgs + plan-change requests |
| `#/super/governance` | — | — | view; transition lifecycle; set retention/visibility |
| `#/super/ingestion` | — | — | view (ingestion history + errors) |
| `#/super/api-key` (platform key) | — | — | view, generate, rotate, revoke (Super Admin key) |
| `#/settings/api-key` (org key) | — | view, generate, rotate, revoke (org key) | — |
| `#/reports` (org) | view, export (own scope) | view, export (org scope) | — |
| `#/super/reports` | — | — | view, export (platform scope) |
| `#/notifications` | view, mark-read (own) | view, mark-read (own) | view, mark-read; approvals deep-link |
| `#/settings/profile`·`password`·`appearance`·`notifications` | view, edit (self) | view, edit (self) | view, edit (self) |
| `#/settings/org` (org profile) | — | view, edit (own org) | — |
| `#/403` `#/404` `#/expired` | view | view | view |

## RBAC consistency check (each cell ≤ global role permission, product-spec § 7)
- Org User: catalog browse/search ✅, download within entitlement ✅, no ingest/members/plans/keys-mint ✅ — every cell ≤ global. **PASS**
- Org Admin: own-org members ✅, request (not define) plans ✅, org key only ✅, no ingest, no cross-tenant ✅ — every cell ≤ global. **PASS**
- Super Admin: platform-wide ✅, ingest via platform key ✅, govern catalog ✅ — every cell ≤ global. **PASS**

No cell exceeds the persona's global role permission. **No mismatches.**

## Cross-cutting rules
- **Tenant isolation:** all org-scoped data (members, downloads, subscription, org key, reports) is filtered to the caller's `org_id`; any cross-org access → `#/403`.
- **Suspended org:** members of a suspended org see a locked state — nav disabled except Settings + sign-out; catalog/download/API blocked.
- **Expired subscription (grace passed):** download + org-API locked (read-only org); catalog still browsable; Org Admin can still reach Subscription to request renewal.
- **Role switcher (mockup only):** simulates these three personas for review; not a shipped capability.
