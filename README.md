# twa-design

The dedicated **design repo** for the TWA Weather Data Marketplace. This repo holds **only HTML mockups** (`mockups/`), deployed via GitHub Pages so customers can preview the UX for approval. All specs, contracts, architecture, and sign-offs live in Confluence (the source of truth).

## Project overview

TWA (Tropical Weather Analytics) is building a cloud-native, subscription-based **Weather Data Marketplace** that commercializes its proprietary satellite-derived weather datasets. The platform is two-sided: TWA (Super Admin) ingests, versions, publishes, and governs datasets and subscriptions; customer organizations (Org Admins + Org Users) discover and consume datasets within entitlement — via a searchable catalog with light natural-language search, downloads, and a shared org API key for programmatic access.

- **Full project state & specs:** [TWA Weather Data Marketplace — Confluence](https://minfyhelpdesk.atlassian.net/wiki/spaces/UED/pages/3810787329)
- **Product Specification:** [Confluence](https://minfyhelpdesk.atlassian.net/wiki/spaces/UED/pages/3808886785)

> Clone any project repo, then run `/minfyr:status` for the full live view.

**Project shape:** full-stack · **Flow:** ux-first

## Stage

| Stage | Status |
|-------|--------|
| Discovery | ✅ 2026-06-11 |
| UX approved | ✅ 2026-06-12 |
| Stack | ⬜ Pending |
| Tech spec | ⬜ Pending |
| Backlog generated | ⬜ Pending |
| Frontend / backend / infra scaffolded | ⬜ Pending |

**Live mockup preview:** https://jaya-kranthi.github.io/twa-design/

## Mockups

Static HTML mockups land in `mockups/` and auto-deploy to GitHub Pages on every push to `main`.

**One-time setup:** Settings → Pages → Source: **GitHub Actions**. After that, every commit to `mockups/` auto-deploys.

Pages URL once enabled: `https://jaya-kranthi.github.io/twa-design/`
