# State Matrix — TWA Weather Data Marketplace
_Rows = screens, columns = states. Each cell = visual, or `n/a`. `partial-permission` sourced from access-matrix.md. Gates the ux sign-off._

| Screen | empty | loading | error | success | disabled / read-only | partial-permission |
|---|---|---|---|---|---|---|
| Apply (multi-step) | n/a | submit spinner | inline field + summary banner | → `#/apply/pending` | step nav disabled until valid | n/a |
| Application-pending | "Pending TWA review" status card | n/a | resend error toast | "Resend confirmation sent" | resend throttled (cooldown) | n/a |
| Sign in | n/a | button spinner | inline "invalid credentials" | → dashboard | submit disabled until valid | n/a |
| Set password / Accept invite | n/a | spinner | rules error inline | → dashboard | submit disabled until rules met | expired/used link → `#/expired` |
| Org User dashboard | "No activity yet" tiles | skeleton tiles | tile error + retry | tiles populated | n/a | n/a |
| Org Admin dashboard | "No activity yet" + onboarding banner | skeleton tiles | tile error + retry | tiles + drill-through | n/a | n/a |
| Platform dashboard | "No tenants yet" | skeleton tiles | tile error + retry | tiles | n/a | n/a |
| Onboarding checklist | n/a (always has steps) | n/a | step action error toast | step ✓ ticks; "All set" on complete | completed steps locked ✓ | admin-only |
| Catalog | "No datasets match — broaden search" / fresh-org sell state | skeleton rows/cards | search/server error + retry | result list | n/a | datasets visible but **download locked if not entitled** |
| Dataset detail | n/a | skeleton detail | load error + retry | metadata + versions | not-entitled = download disabled + "not in your plan"; expired = locked | Super sees govern actions; User/Admin do not |
| Download history | "No downloads yet" | skeleton rows | error + retry | rows + export | export disabled when empty | own vs org scope |
| Members | "No members yet — invite your team" | skeleton rows | error + retry | rows | suspended-org = read-only; last-admin row actions guarded | admin-only |
| Subscription | n/a | skeleton | error + retry | plan + usage bars | expired = locked w/ renew CTA | admin-only; user has no access |
| Plans (super) | "No plans defined — create one" | skeleton | error + retry | plan cards/table | plan in use = delete disabled | super-only |
| Tenants (super) | "No organizations yet" | skeleton rows | error + retry | rows | suspended rows tinted | super-only |
| Tenant detail (super) | n/a | skeleton | error + retry | org panels | suspend disabled if already suspended | super-only |
| Approval queue (super) | "You're all caught up" | skeleton rows | error + retry | queue rows | approve/reject disabled while submitting | super-only |
| Governance (super) | "No datasets yet" | skeleton rows | error + retry | lifecycle list | archived = transitions limited | super-only |
| Ingestion history (super) | "No datasets ingested yet" | skeleton rows | error + retry | rows (incl failed) | n/a | super-only |
| API key (org / platform) | "No API key yet — generate one" | spinner on generate | generate/rotate error toast | reveal-once panel → masked | revoked = use returns 401 (shown) | org key=admin; platform key=super |
| Reports | "No data to report yet" | skeleton chart | error + retry | report + export | export disabled when empty | scope per role |
| Notifications | "You're all caught up" | skeleton list | error + retry | list + mark-all-read | n/a | own scope; super sees approvals |
| Settings (all sections) | n/a | spinner on save | inline + toast error | "Saved" toast | fields locked while saving | org/api-key sections gated by role |
| 403 / 404 / expired | dedicated illustration + recover CTA | n/a | n/a | n/a | n/a | n/a |
| Suspended-org lock | full-screen lock card | n/a | n/a | n/a | nav disabled except Settings/sign-out | affects all roles in that org |

Every screen in `ia.md` has a row. No screen is title-only.
