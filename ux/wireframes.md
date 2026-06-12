# Wireframes — TWA Weather Data Marketplace
_Low-fi per-screen structure: regions, primary actions, container patterns. Every CRUD resource enumerates its dialogs distinctly (each = its own ticket downstream)._

## Shell (every authenticated screen composes into this)
- **Top bar:** logo (left) · global search (center) · **role switcher** (Viewing as ▾) · 🔔 bell (badge) · avatar menu ▾ (Profile · Settings · Appearance · Sign out).
- **Sidebar (left, ≥1024):** role-aware primary nav, active item highlighted; Developer is a grouped section (Super only).
- **Main:** breadcrumbs (deep routes) → page header (title + primary action) → content.

---

## A. Auth / public (top-bar-only shell)
- **Landing** — hero (value prop, "Apply for access" primary, "Sign in" secondary) · 3 value tiles (Curated datasets · Versioned & governed · API access) · footer.
- **Apply (multi-step)** — left step rail (1 Org · 2 Contact · 3 Intended use · 4 Plan tier · 5 Review) + form panel; sticky Back/Next; Review summarizes; Submit → pending.
- **Application-pending** — centered status card (icon, "Pending TWA review", what's next, resend confirmation).
- **Sign in** — centered card: email, password, "Forgot password?", Sign in, "Apply for access".
- **Email verification** — card: "Verify your email", resend (throttled), success state.
- **Password reset — request** — card: email + Send link.
- **Password reset — confirm** — card: new password + confirm + rules checklist.
- **Set password (first login / invite)** — card: shows org + role context; new password + rules; → dashboard.
- **Accept invite** — card: "You've been invited to <Org> as <Role>" → Accept → set-password.
- **Expired** — card: "This link expired" + re-request / sign-in.

---

## B. Org User
- **Dashboard** — page header "Welcome, <name>" · KPI tiles: **My downloads** (count + spark + as-of), **Available datasets** (count, → Catalog) · "Recent downloads" mini-table.
- **Catalog** — header (title + grid/table toggle + sort) · **NL search bar** (prompt-hint) → **interpreted-filter chips row** (editable) · **filter rail** (category, region, time range, version status) · **results** (table: Name · Category · Region · Latest version · Updated · Entitlement · ⋯; or card grid) · pagination.
- **Dataset detail** — breadcrumb (Catalog ▸ <name> ▸ <version>) · header (name + lifecycle badge + entitlement badge) · two-col: left = description + metadata table + **version history** (timeline, current = ★) ; right rail = **Download** (current version, disabled if not entitled) + version picker + **API access instructions** (org-key curl/Python snippet, copy) + "Request upgrade" (if not entitled).
- **My downloads** — table (Dataset · Version · Size · Downloaded at · Source: portal/API) · filter/sort · **Export** (CSV).
- **Reports** — report selector + chart/table + "data as of" + **Export**.
- **Notifications (page)** — filter (All/Unread/Type) · list (icon, text, time, deep-link) · **Mark all read**.

## Settings (all roles; sections role-gated)
- **Profile** — name, email (read-only), avatar; Save.
- **Password** — current, new, confirm, rules; Save.
- **Appearance** — theme (Light/Dark/System), density (Comfortable/Compact); applies live.
- **Notifications prefs** — per-event email/in-app toggles.
- **Org profile** _(Org Admin)_ — org name, business type, contact; Save.
- **Org API key** _(Org Admin)_ — see API-key dialogs below.

---

## C. Org Admin (adds to User)
- **Dashboard** — tiles: **Org usage** (downloads/API vs limit, bar), **Members** (active vs max), **Subscription** (plan + days to renewal) · onboarding banner until checklist complete.
- **Onboarding checklist** — centered: 3 steps (Verify org profile · Invite members · Review entitlements) each with status + CTA; "All set" on complete.
- **Members** — header (title + **Invite** primary) · filters (role, status) · table (Name · Email · Role · Status · Last active · ⋯) · pagination.
  - **Invite member** (drawer) — name · email · role (Org Admin/Org User) · optional message · expiry.
  - **Edit member role** (drawer) — role select; last-admin guard note.
  - **Deactivate member** (dialog) — confirm; "Reactivate" for deactivated rows.
  - **Confirm deactivate member** (dialog) — explicit confirm copy.
  - **Resend invite** / **Revoke invite** (row actions on pending) — toast.
- **Subscription** — current plan card (tier + price-tier label, no payment) · **entitlement usage** (max users, max downloads, allowed categories — bars/lists) · renewal/expiry + grace note · **Request plan change** (drawer: target tier + reason).
- **Org usage report** — downloads/API calls vs limits over period + **Export**.

---

## D. Super Admin
- **Platform overview** — tiles: **Tenants** (active/pending/suspended), **Datasets** (published/total + recent ingestions), **Ingestion activity** (succeeded/failed) · "Recent applications" mini-queue · "Recent ingestions" mini-table.
- **Tenants** — filters (status) · table (Org · Plan · Members · Status · Created · ⋯) · row → detail.
  - **Tenant detail** — org profile · plan · members (read-only table) · usage · actions: **Suspend** / **Reactivate**, **Change plan**.
  - **Suspend org** (dialog) / **Reactivate org** (dialog) — confirm + reason.
- **Approvals** — tabs: **Org applications** | **Plan-change requests** · queue table (Requester/Org · Requested · Submitted · ⋯).
  - **Approve application** (drawer) — review details → **Assign plan** (tier select) → approve.
  - **Reject application** (dialog) — reject + note.
  - **Approve plan-change** / **Reject plan-change** (drawer/dialog) — approve applies entitlements; reject with note.
- **Plans** — plan cards/table (Tier · Categories · Max users · Max downloads · Orgs on plan · ⋯).
  - **Create plan** (drawer) — name · allowed categories · max users · max downloads · description.
  - **Edit plan** (drawer) — same fields.
  - **Delete plan** (dialog) — confirm; disabled if any org on it.
- **Catalog / Dataset detail** — same as User, plus governance actions on detail for Super.
- **Governance** — datasets list (Name · Lifecycle · Versions · Retention · Visibility · ⋯).
  - **Transition lifecycle** (dialog) — Draft→Published→Deprecated→Archived (allowed transitions shown).
  - **Set retention / visibility** (drawer).
  - **Archive dataset** (dialog) — warns if orgs actively use it.
- **Ingestion history** — table (Dataset · Version · Status · Pushed at · Size · Error) · filter (status) · row → error detail popover.
- **Platform API key** — Super Admin ingestion key: see API-key dialogs.
- **Platform reports** — platform metrics + **Export**.

## API key dialogs (org key + platform key — same pattern, distinct screens)
- **Generate key** (action → reveal-once panel) — show full key ONCE + copy + "store it safely".
- **Masked key view** — `twa_****…last4` + created/last-used + usage count.
- **Rotate key** (dialog) — confirm; old key invalidated, new revealed once.
- **Revoke key** (dialog) — confirm; key → 401 thereafter.

## System
- **403 / 404 / Expired** — illustration + headline + recover CTA.
- **Suspended-org lock** — full-screen lock card; nav disabled except Settings/sign-out.
