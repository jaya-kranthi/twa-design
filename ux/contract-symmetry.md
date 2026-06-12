# Contract Symmetry — TWA Weather Data Marketplace
_Verifies api-contract.openapi.yaml ↔ ux/component-contracts.md. Generated at ux-approve._

## Result: ✅ SYMMETRIC

- **OpenAPI:** 3.1.0 · 42 paths · 52 operations · 57 schemas · 3 security schemes (cognitoJwt, orgApiKey, platformApiKey). All `$ref`s resolve; no stubs.
- Every "Actions → ops" entry in `component-contracts.md` maps to an operation in the contract:

| component-contracts area | endpoints |
|---|---|
| Auth & onboarding | `/auth/apply`, `/auth/login`, `/auth/password/*`, `/auth/invite/accept`, `/auth/verify-email`, `/auth/application/{id}` |
| Dashboards / metrics | `/metrics/{me,org,platform}` |
| Catalog + NL search | `/datasets`, `/datasets/{id}`, `/search`, `/datasets/{id}/versions/{version}/download` |
| Members | `/members`, `/members/invite`, `/members/{id}` (PATCH/DELETE), `/members/{id}/resend` |
| Subscription / plans | `/subscriptions/me`, `/subscriptions/change-request[/{id}/{approve,reject}]`, `/plans`, `/plans/{id}` |
| Tenants / approvals / governance | `/organizations[/{id}][/approve,/reject]`, `/approvals`, `/datasets/{id}/lifecycle`, `/datasets/{id}` (governance) |
| Ingestion | `/ingestion` (GET portal, POST platform-key) |
| API keys | `/apikeys` (GET/POST/DELETE), `/apikeys/rotate` |
| Reports / downloads | `/reports`, `/reports/export`, `/downloads` |
| Notifications | `/notifications`, `/notifications/read`, `/notifications/prefs` |

- **Security mapping:** human screens → `cognitoJwt`; dataset download → `cognitoJwt` OR `orgApiKey`; ingestion push → `platformApiKey`. Matches product-spec § 7 + access-matrix.
- **Authz:** per-endpoint role/tenant gating sourced from `access-matrix.md` (FE + BE enforce the same capability set).

No mismatches to resolve.
