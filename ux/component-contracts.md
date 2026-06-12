# Component Contracts — TWA Weather Data Marketplace
_One section per screen: components, props, states, data dependencies (entities/fields, framework-neutral), actions → backend operations, a11y notes. Authoritative reference for the HTML mockups (Step 6) and the API-contract derivation at ux-approve. Entity field names are the canonical domain vocabulary (product-spec § Glossary)._

## Shared entities (referenced throughout)
- **Organization**: `id, name, business_type, size, contact_name, contact_email, status(pending|active|suspended|expired), plan_id, created_at`
- **Member (User)**: `id, org_id, name, email, role(super_admin|org_admin|org_user), status(pending|active|deactivated), last_active_at`
- **Plan**: `id, name, allowed_categories[], max_users, max_downloads, description`
- **Subscription**: `org_id, plan_id, status(active|renewing|expired|grace), renews_at, usage{users, downloads, api_calls}`
- **Dataset**: `id, name, description, category, region, time_range, tags[], lifecycle(draft|published|deprecated|archived), latest_version, versions[], retention_policy, visibility`
- **DatasetVersion**: `version, created_at, size, format, checksum, is_current`
- **Entitlement (derived)**: `dataset_id, entitled(bool), reason(in_plan|not_in_plan|limit_reached|expired)`
- **DownloadRecord**: `id, dataset_id, version, size, downloaded_at, source(portal|api)`
- **ApiKey**: `scope(platform|org), masked, last4, created_at, last_used_at, usage_count, status(active|revoked)`
- **ApprovalRequest**: `id, type(org_application|plan_change), org, requested(tier|details), submitted_at, status`
- **IngestionRecord**: `id, dataset, version, status(succeeded|failed), pushed_at, size, error?`
- **Notification**: `id, type, text, created_at, read(bool), deep_link`

---

## Auth & onboarding

### ApplyWizard (`#/apply`)
- **Components:** `StepRail`, `FormStep×5`, `ReviewSummary`, `WizardFooter(Back/Continue/Submit)`.
- **Data in:** plan tiers (names only) for step 4. **Data out:** Organization application + requested tier.
- **Action → op:** `POST /auth/apply` (create application). 
- **States:** per-step validation, submit loading, success→pending, error banner.
- **a11y:** step rail is an ordered list with `aria-current`; each step a labeled `<fieldset>`; errors `aria-describedby`.

### AuthCard (`#/signin`, `#/reset-request`, `#/reset-confirm`, `#/set-password`, `#/accept-invite`, `#/verify-email`, `#/apply/pending`, `#/expired`)
- **Components:** `AuthCard`, `Field`, `RulesChecklist` (password), `Throttle` (resend cooldown).
- **Actions → ops:** `POST /auth/login`, `POST /auth/password/reset-request`, `POST /auth/password/reset-confirm`, `POST /auth/password/set`, `POST /auth/invite/accept`, `POST /auth/verify-email`, `GET /auth/application/:id` (pending status).
- **a11y:** single `<h1>` per card; inputs labeled; error region `role="alert"`.

---

## Dashboards

### DashboardOrgUser (`#/dashboard`, role=user)
- **Components:** `KpiTile×2` (My downloads, Available datasets), `RecentDownloadsTable`.
- **Data in:** `GET /metrics/me`, `GET /downloads?scope=me&limit=5`.
- **Tile props:** `label, value(mono), delta, sparkline[], asOf, drillTo`.
- **States:** skeleton, empty ("No activity yet"), error+retry.

### DashboardOrgAdmin (`#/dashboard`, role=admin)
- **Components:** `OnboardingBanner` (until checklist done), `KpiTile×3` (Org usage, Members, Subscription), `RecentActivity`.
- **Data in:** `GET /metrics/org`, `GET /subscriptions/me`.
- **Drill-through:** Org usage→Reports, Members→Members, Subscription→Subscription.

### DashboardSuper (`#/super/dashboard`)
- **Components:** `KpiTile×3` (Tenants, Datasets, Ingestion activity), `RecentApplicationsMiniQueue`, `RecentIngestionsTable`.
- **Data in:** `GET /metrics/platform`, `GET /approvals?limit=5`, `GET /ingestion?limit=5`.

### OnboardingChecklist (`#/onboarding`, role=admin)
- **Components:** `ChecklistStep×3` (Verify org profile, Invite members, Review entitlements) each `{title, status(todo|done), cta}`.
- **Data in:** `GET /organizations/me` (profile completeness), member count, subscription. **Action:** marks complete client-side; deep-links to the relevant screens.

---

## Catalog & datasets

### Catalog (`#/catalog`)
- **Components:** `NlSearchBar`, `InterpretedFilterChips`, `FilterRail` (category, region, time range, version status), `ViewToggle(table|grid)`, `DatasetTable`/`DatasetGrid`, `SortMenu`, `Pagination`.
- **NlSearchBar props:** `placeholder(prompt-hint), examples[], onSubmit`.
- **InterpretedFilterChips props:** `chips[{field,value,editable}], aiMarker, onEdit, onClear, fallbackNote?`.
- **Data in:** `GET /datasets?filters…&page&sort`; `POST /search` (NL→filter: body `{query}` → `{filters, confidence}`).
- **Table columns:** Name · Category · Region · Latest version (mono) · Updated · Entitlement badge · ⋯(kebab: View, Download if entitled).
- **States:** skeleton rows, empty (fresh-org sell / no-results), error+retry, partial-permission (download locked rows).
- **a11y:** search labeled; chips are removable buttons with text; table `aria-sort`; results count announced.

### DatasetDetail (`#/catalog/dataset/:id`)
- **Components:** `Breadcrumbs`, `LifecycleBadge`, `EntitlementBadge`, `MetadataTable`, `VersionTimeline` (current=★), `DownloadPanel` (version picker + Download), `ApiAccessPanel` (org-key snippet, copy), `GovernanceActions` (super only), `RequestUpgradeButton` (if not entitled).
- **Data in:** `GET /datasets/:id` (+ versions, entitlement). **Actions → ops:** `GET /datasets/:id/versions/:v/download` (entitled), `POST /subscriptions/change-request` (upgrade), governance ops (super, see Governance).
- **States:** skeleton; entitled vs not-entitled (download disabled + reason); expired (locked); error+retry.
- **a11y:** version timeline as ordered list; download button states announced; snippet has copy-confirmation.

---

## Members (Org Admin)

### MembersList (`#/members`)
- **Components:** `PageHeader(Invite)`, `Filters(role,status)`, `MembersTable`, `Pagination`.
- **Columns:** Name · Email (mono) · Role · Status badge · Last active · ⋯(Edit role, Deactivate/Reactivate, Resend/Revoke invite).
- **Data in:** `GET /members?filters`. 
- **States:** empty ("invite your team"), skeleton, error, read-only (suspended org).

### Member dialogs (distinct)
- **InviteMemberDrawer** → `POST /members/invite` `{name,email,role,message,expiry}`.
- **EditRoleDrawer** → `PATCH /members/:id` `{role}` (last-admin guard).
- **DeactivateMemberDialog** / **ConfirmDeactivate** → `PATCH /members/:id` `{status:deactivated}`.
- **ResendInvite** → `POST /members/:id/resend`. **RevokeInvite** → `DELETE /members/:id` (pending only).
- **a11y:** drawers focus-trapped, labeled; confirm dialogs `role="alertdialog"`.

---

## Subscription & plans

### Subscription (`#/subscription`, role=admin)
- **Components:** `PlanCard`, `EntitlementUsage` (bars: users, downloads; allowed categories list), `RenewalNotice` (grace/expiry), `RequestChangeDrawer`.
- **Data in:** `GET /subscriptions/me`. **Action → op:** `POST /subscriptions/change-request` `{target_tier,reason}`.
- **States:** active, renewing-soon, expired/grace (locked + renew CTA), pending-change badge.

### Plans (`#/super/plans`, role=super)
- **Components:** `PlanTable`/`PlanCards`, `CreatePlanDrawer`, `EditPlanDrawer`, `DeletePlanDialog`.
- **Columns:** Tier · Categories · Max users · Max downloads · Orgs on plan · ⋯.
- **Ops:** `GET /plans`, `POST /plans`, `PATCH /plans/:id`, `DELETE /plans/:id` (blocked if orgs assigned).

---

## Super Admin governance

### Tenants (`#/super/tenants`, `:id`)
- **Components:** `TenantsTable`, `TenantDetail` (profile, plan, members read-only, usage), `SuspendOrgDialog`, `ReactivateOrgDialog`, `ChangePlanDrawer`.
- **Ops:** `GET /organizations`, `GET /organizations/:id`, `PATCH /organizations/:id` `{status}`, `PATCH /organizations/:id` `{plan_id}`.

### Approvals (`#/super/approvals`)
- **Components:** `Tabs(applications|plan-changes)`, `ApprovalQueueTable`, `ApproveApplicationDrawer` (assign tier), `RejectDialog`, `ApprovePlanChangeDrawer`/`RejectDialog`.
- **Ops:** `GET /approvals?type=`, `POST /organizations/:id/approve` `{plan_id}`, `POST /organizations/:id/reject` `{note}`, `POST /subscriptions/change-request/:id/approve|reject`.
- **States:** empty ("caught up"), skeleton, submitting-disabled.

### Governance (`#/super/governance`)
- **Components:** `GovernanceTable` (lifecycle, versions, retention, visibility), `TransitionDialog` (allowed transitions only), `RetentionDrawer`, `ArchiveDialog` (warns if in use).
- **Ops:** `GET /datasets?governance=true`, `PATCH /datasets/:id/lifecycle` `{status}`, `PATCH /datasets/:id` `{retention,visibility}`.

### IngestionHistory (`#/super/ingestion`)
- **Components:** `IngestionTable` (status, pushed_at, size), `ErrorPopover`.
- **Ops:** `GET /ingestion` (read-only; the push itself is `POST /ingestion` via platform key, machine actor — not a portal screen).

---

## API keys, reports, notifications, settings

### ApiKeyManager (org: `#/settings/api-key` · platform: `#/super/api-key`)
- **Components:** `EmptyGenerate`, `RevealOncePanel` (full key + copy), `MaskedKeyCard` (last4, usage, last used), `RotateDialog`, `RevokeDialog`.
- **Ops:** `POST /apikeys` (scope), `POST /apikeys/rotate`, `DELETE /apikeys` (revoke), `GET /apikeys` (masked + usage).
- **a11y:** reveal panel warns "shown once"; copy gives confirmation; key is selectable text.

### Reports (`#/reports`, `#/super/reports`)
- **Components:** `ReportSelector`, `Chart`, `DataTable`, `AsOfStamp`, `ExportButton`.
- **Ops:** `GET /reports?scope`, `GET /reports/export?format=csv` (async for large).

### Notifications (`#/notifications` + bell `NotificationsPopover`)
- **Components:** `NotificationsPopover` (top 5 + "View all"), `NotificationsPage` (filters, list, Mark all read).
- **Ops:** `GET /notifications`, `POST /notifications/read` (mark read/all).
- **Super:** approval notifications deep-link to `#/super/approvals`.

### Settings (`#/settings/*`)
- **Components:** `SettingsNav` (Profile, Password, Appearance, Notifications, [Org, Org API key for admin]), section panels.
- **Ops:** `GET/PATCH /users/me`, `POST /auth/password/change`, `GET/PATCH /organizations/me` (admin), notification prefs `GET/PATCH /notifications/prefs`.
- **a11y:** settings nav is a labeled list with `aria-current`; appearance changes respect reduced-motion + persist.

---

## Cross-cutting component states (every interactive component)
hover · focus-visible (token ring) · active · disabled · loading · selected · error. Tables: empty/loading(skeleton)/error(retry). Forms: per-field inline error + submit-disabled-until-valid. All overlays focus-trapped + Esc-dismiss. No color-only signals.
