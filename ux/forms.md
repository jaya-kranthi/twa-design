# Forms — TWA Weather Data Marketplace
_Per form: validation (client/server), error placement, submit enablement, success destination._

Conventions: labels always visible; required `*`; inline per-field errors below the field + a summary banner on submit failure; submit disabled until client-valid; server errors map back to fields where possible.

| Form | Fields + client validation | Server validation | Error placement | Submit enabled when | Success |
|---|---|---|---|---|---|
| **Apply** (multi-step) | Org name*(2–80), business type*(select), size*(select), contact name*, contact email*(email), intended use*(20–500), requested tier*(select) | org-name uniqueness, email format/dedupe | inline per step + review-step summary | each step valid; final on all valid | → `#/apply/pending` + toast |
| **Sign in** | email*(email), password*(non-empty) | credential check | inline "invalid credentials" (not field-specific, for security) | both non-empty | → dashboard |
| **Set / reset password** | new*(≥12, upper+lower+number+symbol), confirm*(match) | token validity, reuse policy | inline rules checklist + confirm-mismatch | rules met + match | → dashboard / sign-in |
| **Invite member** | name*, email*(email), role*(select), message(≤280), expiry*(select: 3/7/14 days) | email already-member, role hierarchy (no Super) | inline; "already a member" on email | name+email+role valid | drawer close + pending row + toast |
| **Edit member role** | role*(select) | last-admin guard | inline guard note | role changed | toast |
| **Request plan change** | target tier*(select ≠ current), reason(≤500) | downgrade-exceeds-limits check | inline + banner if downgrade blocked | tier selected | "Pending review" badge + toast |
| **Create / Edit plan** | name*(unique), allowed categories*(multi), max users*(int≥1), max downloads*(int≥1), description(≤500) | name uniqueness, numeric ranges | inline | all required valid | drawer close + row + toast |
| **Approve application** | assign tier*(select), (optional note) | plan exists | inline | tier selected | org provisioned + toast |
| **Reject application / plan-change** | note*(≥5) | — | inline | note non-empty | queue removes row + toast |
| **Org profile** | org name*, business type*, contact* | — | inline | dirty + valid | "Saved" toast |
| **Profile** | name*, avatar(optional) | — | inline | dirty + valid | "Saved" toast |
| **Notification prefs** | per-event toggles | — | n/a | autosave or Save | "Saved" toast |
| **Lifecycle transition** | target status*(allowed only), retention(when archiving) | transition legality | inline | valid transition | badge updates + toast |
| **Generate/Rotate/Revoke key** | confirm (rotate/revoke) | scope auth | dialog | confirmed | reveal-once / masked + toast |

## NL search (not a classic form)
Free-text input → on submit, call NL→filter; render interpreted chips (editable). Low confidence/error → keyword search + fallback note. No blocking validation; empty query is a no-op.
