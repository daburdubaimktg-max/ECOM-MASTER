# Brand Intelligence Engine — documents

The ten deliverables of the first assignment, the guides for running the product, and the research behind them. All research was carried out on 26 November 2026, with sources cited throughout.

## Start here

If you read only three things:

1. [Deliverable 1 — Industry Research Report](research/01-industry-research-report.md) — what the market offers and where it falls short (10 minutes)
2. [Deliverable 10 — First Working Build](product/10-first-build.md) — what exists today and how to try it
3. [Deliverable 9 — Roadmap](product/09-roadmap.md) — what comes next and the decisions needed from you

## The ten deliverables

| # | Deliverable | What it answers |
|:-:|---|---|
| 1 | [Industry Research Report](research/01-industry-research-report.md) | Who sells digital-shelf, product-information and review tools; what they do well; what is missing; which official listing scores really exist |
| 2 | [Competitor Capability Matrix](research/02-competitor-capability-matrix.md) | 26 platforms compared capability by capability and country by country, with price evidence and a buy / integrate / build recommendation per capability |
| 3 | [Global Marketplace Research](research/03-global-marketplace-research.md) | 130 platforms in nine countries, the top three per country, and how they were ranked |
| 4 | [API and Data Feasibility Report](research/04-api-data-feasibility.md) | What data can legitimately be obtained, by which route, for whom; the legal constraints; the policy decision you need to make |
| 5 | [GitHub Skills Inventory](research/05-github-skills-inventory.md) | 85 open-source repositories inspected — code, licence, maintenance — and whether to reuse them |
| 6 | [Product Requirements Document](product/06-product-requirements.md) | What the product must do, for whom, and how each part is judged complete |
| 7 | [System Architecture](architecture/07-system-architecture.md) | How it is built, why each technology was chosen, data flows, integration strategy and security. With the [database schema reference](architecture/database-schema.md) |
| 8 | [Build-versus-Buy Analysis](product/08-build-vs-buy.md) | Setup, running and maintenance costs of buying versus building, and scalability |
| 9 | [Development Roadmap](product/09-roadmap.md) | The remaining stages, dependencies, effort estimates and your decisions |
| 10 | [First Working Build](product/10-first-build.md) | What has been built and tested |

## Guides

| Guide | For |
|---|---|
| [Setup](guides/setup.md) | Running the product on your own computer; settings; password recovery |
| [How-to](guides/how-to.md) | Adding brands, products and marketplaces; updating requirements and research; looking after automation |
| [Office computer](guides/office-computer.md) | Running it free on an office computer, shared through a free Cloudflare link |
| [Deployment](guides/deployment.md) | Putting the product online on a hosting service |
| [Security](guides/security.md) | How information is protected and what the system owner must do |

## Research appendices

The detailed research and every source citation:

| Appendix | Topic |
|---|---|
| [A1](research/appendix/A1-digital-shelf-analytics-vendors.md) | Digital-shelf analytics vendors |
| [A2](research/appendix/A2-pim-syndication-reviews-vendors.md) | Product information, syndication and review vendors |
| [B1](research/appendix/B1-marketplaces-uae-saudi-malaysia.md) | Marketplaces — UAE, Saudi Arabia, Malaysia |
| [B2](research/appendix/B2-marketplaces-south-africa-kenya-nigeria.md) | Marketplaces — South Africa, Kenya, Nigeria |
| [B3](research/appendix/B3-marketplaces-us-uk-india.md) | Marketplaces — United States, United Kingdom, India |
| [C1](research/appendix/C1-content-requirements-amazon-walmart-noon.md) | Content requirements — Amazon, Walmart, Noon |
| [C2](research/appendix/C2-content-requirements-regional-retailers.md) | Content requirements — regional retailers |
| [D1](research/appendix/D1-official-apis.md) | Official marketplace APIs |
| [D2](research/appendix/D2-data-providers-and-legal.md) | Data providers and legal constraints |
| [E](research/appendix/E-open-source-inventory.md) | Open-source inventory |

The structured research data that the product loads is in [`data/research/`](../data/research).

## Limits of the research

- Vendor capabilities are as published; no product was trialled and no vendor was contacted.
- Enterprise prices are mostly not public; third-party estimates are labelled as such.
- The shared web-search allowance ran out part-way through, so later verification relied on opening known primary sources directly. Four decision-critical claims were re-checked that way, and all matched.
- Nothing has been tested against a live marketplace account. No integration is described as working until it has been.
