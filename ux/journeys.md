# Journeys — TWA Weather Data Marketplace
_One end-to-end journey per human persona + cross-persona handoff chains. Every step names its screen + the navigation that reaches it. At least one failure path each._

## J1 — Org User: discover → consume (bread-and-butter loop)
1. **Sign in** (`#/signin`) → lands on **Dashboard** (`#/dashboard`), "Available datasets" tile.
2. Click tile or sidebar **Catalog** (`#/catalog`).
3. Type NL query *"rainfall data for the Caribbean in 2023"* → interpreted-filter chips appear (category=Precipitation, region=Caribbean, time=2023) over results.
4. Open a dataset (`#/catalog/dataset/:id`) → read metadata + version history; entitlement badge = **Entitled**.
5. Click **Download** (current version) → file delivered; toast "Download started"; recorded in **My downloads** (`#/downloads`).
6. *Alt:* copy **API access instructions** (org-key snippet) to pull programmatically.
- **Failure path:** entitlement badge = **Not in your plan** → Download disabled, calm "Request upgrade" affordance → notifies Org Admin (see J4). Or query returns nothing → "No datasets match — broaden your search" empty state with suggested filters.

## J2 — Org Admin: onboard org → manage team → govern spend
1. **Approval email** → **Set password** (`#/set-password`) → **Dashboard** with **Onboarding banner**.
2. **Onboarding checklist** (`#/onboarding`): verify org profile (`#/settings/org`) → invite members → review entitlements (`#/subscription`).
3. **Members** (`#/members`) → **Invite** drawer (name + email + role + message + expiry) → pending invite row appears.
4. **Subscription** (`#/subscription`): see plan + usage bars; approaching a limit → **Request plan change** drawer (target tier + reason) → request submitted (see J4).
5. Generate the **org API key** (`#/settings/api-key`): generate → reveal-once → copy → masked; share with team.
- **Failure path:** invite to an email already a member → inline "already a member"; re-invite a pending invite → idempotent resend (not duplicate). Downgrade that would exceed new limits → blocked with explanation.

## J3 — Super Admin: govern platform (approvals · plans · datasets · ingestion)
1. **Sign in** → **Platform overview** (`#/super/dashboard`); "Ingestion activity" + "Tenants" tiles.
2. **Approvals** (`#/super/approvals`) → Org-applications tab → open an application → **Approve** → **Assign plan** (select tier) → entitlements auto-provision; org notified (see J4). Or **Reject** with note.
3. **Plans** (`#/super/plans`) → **Create/Edit plan** drawer (categories, max users, max downloads).
4. **Governance** (`#/super/governance`) → transition a dataset Draft→Published (now catalog-visible/entitleable); later Deprecated→Archived with retention.
5. **Ingestion history** (`#/super/ingestion`) → spot a **failed** push → read validation error.
6. **Platform API key** (`#/super/api-key`) → rotate the ingestion key when needed.
- **Failure path:** archive a dataset orgs actively use → warning dialog + graceful entitlement handling. Ingestion validation failure surfaces here with an actionable message (the push client also gets the error).

## J4 — CROSS-PERSONA: org application → approval → first access (unbroken chain)
1. **Applicant** submits **Apply** (`#/apply`, requests a tier) → **Application-pending** (`#/apply/pending`).
2. → **Super Admin** sees it in **Approvals queue** (`#/super/approvals`) **and** a 🔔 notification.
3. Super Admin **Approves + assigns plan** → org provisioned; **email + in-app notification** to the new **Org Admin** (approved, with sign-in link).
4. Org Admin **Set password** (`#/set-password`) → **Dashboard** → **Onboarding** → invites an **Org User**.
5. Org User accepts invite (`#/accept-invite` → `#/set-password`) → **Catalog** → downloads within entitlement (J1).
- **Where each actor sees the outcome:** applicant sees status on `#/apply/pending` + approval email; Super Admin sees the request in the queue + bell; Org Admin/User get in-app + email notifications. **No dead ends.**

## J5 — CROSS-PERSONA: plan-change request → approval → updated entitlements
1. **Org Admin** submits **Request plan change** (`#/subscription`) → request created; "Pending review" badge on Subscription.
2. → **Super Admin** Approvals queue → **Plan-change requests** tab + 🔔.
3. Super Admin **Approve** → entitlements re-provision; **Org Admin notified** (in-app + email); Subscription reflects the new plan + limits.
4. *(Reject)* → Org Admin notified with the Super Admin's note; plan unchanged.
- **Unbroken:** requester (Subscription badge + notification) ↔ approver (queue) ↔ outcome surface (Subscription + notification). No "approves somewhere" gap — the queue screen and the notification surface both exist.

## J6 — CROSS-PERSONA: ingestion failure → Super Admin awareness
1. **Ingestion client** (machine) pushes a bad-schema dataset via the platform key → rejected.
2. → **Super Admin** sees it in **Ingestion history** (`#/super/ingestion`, status=Failed + reason) **and** a 🔔 "Ingestion failed" notification.
3. Super Admin reads the validation error; the curing happens in the push script (out of portal), re-push creates a new version on success → appears Published-able in Governance.
