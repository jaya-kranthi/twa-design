# UX Risks + Mitigations — TWA Weather Data Marketplace

| Risk | Area | Mitigation |
|---|---|---|
| Catalog density overwhelms less-technical Org Admins | a11y / cognitive load | Table is default for analysts but a card-grid toggle + strong empty/first-run guidance keeps it approachable; progressive disclosure of advanced filters. |
| NL search read as authoritative AI | AI trust | Always render interpreted filters as editable chips; discreet "Interpreted by AI" marker; deterministic results; keyword fallback note. Never a chat framing. |
| Entitlement gating feels like a dark-pattern paywall | trust | Honest "not in your plan" states, calm "Request upgrade" (approval-routed), no aggressive red, no blocked-content teasing beyond metadata the user may already browse. |
| Mobile data tables unusable | mobile | Tables → stacked key/value cards <768; first column pinned with horizontal scroll 768–1024; filters in bottom sheet; sticky download bar on dataset detail. |
| Reveal-once API key lost | error prevention | Explicit "copy now — shown once" copy + copy button + post-reveal reminder; masked view always shows last4 + usage; rotate path documented. |
| Long-running export / large download blocks UI | latency | Async export with progress + "we'll notify when ready"; resumable/large-file handling per NFR; skeletons not spinners. |
| Persona-nav accumulation bug (mockup) | nav integrity | Sidebar driven by `NAV_BY_ROLE` + full `replaceChildren` on switch; lint verifies A→B→A returns identical item set. |
| Suspended-org / expired-subscription confusion | status clarity | Explicit lock states with reason + the one allowed action (renew/contact); nav visibly disabled, not silently broken. |
| Color-only status indicators fail a11y | a11y | Every status badge = dot/icon + text; data-viz hues paired with labels/patterns; AA contrast verified light + dark. |
| Dark mode contrast regressions | a11y | Both themes token-driven and AA-verified; focus ring visible in both. |
| i18n / RTL deferred but content hardcoded | future-proofing | Copy centralized in copy-deck; no RTL in v1 (logged in decisions); avoid baked-in text directionality assumptions. |
