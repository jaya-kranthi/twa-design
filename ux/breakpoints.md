# Breakpoints — TWA Weather Data Marketplace
_Mobile-responsive 375–1920px (product-spec NFR). Web only._

| Token | Width | Layout behaviour |
|---|---|---|
| `xs` | 375 | Single column. Sidebar → hamburger drawer. Top bar collapses search to an icon. Catalog = card list (table → stacked cards). Filters in a bottom sheet. KPI tiles 1-up. Tables become stacked key/value cards. |
| `sm` | 640 | 2-up KPI tiles. Catalog cards 1–2 col. |
| `md` | 768 | Sidebar still drawer; content 2-col where useful. KPI tiles 2-up. Catalog table appears (horizontal scroll allowed). Drawers full-width sheets. |
| `lg` | 1024 | **Sidebar becomes persistent** (app-shell threshold). Catalog filter rail visible. KPI tiles 3–4-up. Tables full. Drawers = right sheet (480px). |
| `xl` | 1280 | Comfortable max content width (1200px) centered; wider tables, side-by-side detail panels. |
| `2xl` | 1440–1920 | Content caps at ~1320px; extra space as gutters. No stretched line lengths. |

## Per-screen divergence notes
- **Catalog:** table view (≥768) ↔ card view (default <768); filter rail (≥1024) ↔ bottom-sheet filters (<1024). Grid/table toggle persists in localStorage.
- **Dashboard:** tile grid reflows 4→3→2→1.
- **Dataset detail:** two-column (metadata + actions rail) ≥1024; stacked <1024 with sticky download bar at bottom on mobile.
- **Approvals / Members / Tenants tables:** horizontal scroll <1024 with first column pinned; row kebab → full-width action sheet on mobile.
- **Drawers/sheets:** right sheet ≥1024 → full-screen sheet <1024.
- **Onboarding checklist:** single centered column at all sizes (spacious).
