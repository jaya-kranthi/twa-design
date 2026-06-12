# Copy Deck — TWA Weather Data Marketplace
_Microcopy per surface (design:ux-copy). Tone: precise, credible, calm, plain-spoken. Mono for IDs/versions. Drafted before mockups._

## Buttons (verbs, not "Submit")
| Context | Label |
|---|---|
| Apply flow advance | `Continue` / final `Submit application` |
| Sign in | `Sign in` |
| Invite member | `Send invite` |
| Edit role | `Save role` |
| Deactivate member | `Deactivate` |
| Generate key | `Generate key` · reveal panel `Copy key` · `Done` |
| Rotate / Revoke key | `Rotate key` / `Revoke key` |
| Download dataset | `Download` (+ version) |
| Request plan change | `Request change` |
| Approve / Reject app | `Approve & assign plan` / `Reject` |
| Create / Edit plan | `Create plan` / `Save plan` |
| Lifecycle transition | `Publish` / `Deprecate` / `Archive` |
| Export | `Export CSV` |
| Mark notifications | `Mark all read` |

## Empty states (sell + act)
| Screen | Headline | Body | CTA |
|---|---|---|---|
| Catalog (fresh org) | "Explore TWA's weather datasets" | "Curated, versioned satellite datasets — entitlement-gated to your plan." | `Browse catalog` |
| Catalog (no results) | "No datasets match" | "Try broadening your filters or rephrasing your search." | `Clear filters` |
| Members | "No members yet" | "Invite your team to give them catalog access within your plan." | `Send invite` |
| Downloads | "No downloads yet" | "Datasets you download appear here for easy re-access." | `Browse catalog` |
| Approvals | "You're all caught up" | "New org applications and plan-change requests will show here." | — |
| Ingestion | "No datasets ingested yet" | "Pushes from the ingestion client will appear here with status." | — |
| Plans | "No plans defined" | "Create a plan tier with quantified entitlements to assign to orgs." | `Create plan` |
| Notifications | "You're all caught up" | "Approvals, invites, and subscription alerts will appear here." | — |
| API key | "No API key yet" | "Generate a key to access datasets programmatically. Shown once." | `Generate key` |

## Errors (honest + actionable)
| Case | Message |
|---|---|
| Invalid credentials | "That email or password doesn't match. Try again or reset your password." |
| Email already a member | "This email already belongs to a member of your org." |
| Org already exists | "An organization with this name already applied. Ask your admin for an invite." |
| Not entitled (download) | "This dataset isn't included in your plan. Ask your org admin to request an upgrade." |
| Limit reached (downloads) | "You've reached your plan's download limit for this period." |
| Downgrade exceeds limits | "This plan allows fewer <users/downloads> than you currently use. Resolve before downgrading." |
| Ingestion validation fail | "Push rejected: <reason>. Fix the payload and re-push to create a new version." |
| Revoked key used | "This API key was revoked. Generate a new one in Settings." |
| Expired/used link | "This link has expired. Request a new one." |
| Cross-tenant (403) | "You don't have access to this resource." |
| Generic load error | "Couldn't load this right now." + `Retry` |

## Success toasts
- "Application submitted — we'll email you when it's reviewed."
- "Invite sent to <email>."
- "Member role updated."
- "Plan assigned — entitlements provisioned."
- "Plan-change request submitted."
- "Dataset published."
- "Download started."
- "API key generated — copy it now, it won't be shown again."
- "Settings saved."

## Confirmation dialogs
| Action | Title | Body | Confirm |
|---|---|---|---|
| Deactivate member | "Deactivate <name>?" | "They'll lose access immediately. You can reactivate later." | `Deactivate` |
| Revoke key | "Revoke this API key?" | "Any client using it will stop working immediately." | `Revoke key` |
| Suspend org | "Suspend <org>?" | "Members lose access until reactivated. Data is retained." | `Suspend` |
| Archive dataset | "Archive <dataset>?" | "Orgs currently using it will lose access per retention policy." | `Archive` |
| Delete plan | "Delete <plan>?" | "Only plans with no orgs assigned can be deleted." | `Delete plan` |

## AI / NL search
- Placeholder: "Search datasets — try: rainfall data for the Caribbean in 2023"
- Interpreted row label: "✦ Interpreted by AI:" + chips · "Edit filters" · "Clear"
- Fallback note: "Showing keyword results — AI interpretation was uncertain."
