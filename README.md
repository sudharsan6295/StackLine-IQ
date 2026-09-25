# AI Tools Hub

The enterprise registry for AI tools: discover the best-in-category AI tool
for every business function, at every stage of the product lifecycle, with
sourced pricing and free-tier details kept current in version control.

## Stack

- **Next.js 16 (App Router)**, React 19, TypeScript strict, fully static
  (SSG) — every route is prerendered at build time, no server runtime
  required, deployable straight to Vercel's or Cloudflare's CDN edge.
- **Tailwind CSS v4** (CSS-first `@theme`) + **shadcn/ui** on **Radix UI**
  primitives.
- **Framer Motion** for the handful of deliberate animations (the live stat
  count-up, respecting `prefers-reduced-motion`).
- **Zustand** (with `persist`) for client state: shortlist and compare
  selections, kept in `localStorage`.
- **Fuse.js** for client-side fuzzy search (tool name, best-for line,
  function/phase names).
- **TanStack Query/Table** are installed for future data-heavy views (not
  yet wired to a live endpoint — all current data is static/local).
- **Recharts** for the Stack Builder's cost chart.
- **@xyflow/react (React Flow)** for the interactive architecture canvas —
  node-graph rendering, pan/zoom, and edge routing for the function ×
  lifecycle relationship diagram.
- **Zod** for the data schema and build-time validation.
- **Vitest** + **Testing Library** for unit/component tests, **Playwright**
  for end-to-end tests (desktop + mobile viewport projects).
- **ESLint**, **Prettier** (with the Tailwind class-sorting plugin).

## Architecture & folder structure

```
src/
  app/                    Routes (App Router). Every page is statically
                           generated via generateStaticParams.
    page.tsx               Homepage: hero, live stats, a compact lifecycle
                           preview diagram, the function×phase matrix, and
                           the filterable/searchable tool registry.
    architecture/           The full interactive architecture: a React
                           Flow canvas of all 7 phases + 14 functions with
                           real connections (lifecycle sequence, feedback
                           loop, phase↔function membership, cross-function
                           relationships), click-to-explore detail panel,
                           plus a fully static/accessible directory of the
                           same content below it.
    functions/[id]/        One static page per business function: its tools
                           grouped by phase, plus an interactive Pilot →
                           Scale → Optimize adoption roadmap.
    tools/[id]/             One static page per tool: full pricing detail,
                           SoftwareApplication JSON-LD, source link.
    stack-builder/          Interactive: pick functions + team size + budget
                           → recommended stack + Recharts cost estimate.
    governance/             Static: data privacy, access control, human
                           approval, and cost-control guidance.
    sitemap.ts, robots.ts   Next.js metadata routes, generated from the same
                           data every page reads — nothing to keep in sync
                           by hand.
    error.tsx, not-found.tsx  Error boundary and 404 empty state.
  components/              UI components. `ui/` is shadcn-generated
                           primitives; `architecture/` is the React Flow
                           canvas (PhaseNode, FunctionNode, DetailPanel,
                           the accessible FunctionDirectory fallback);
                           everything else is hand-built for this app
                           (ToolCard, FunctionPhaseMatrix, RegistryExplorer,
                           CompareBar, RoadmapTimeline, ArchitectureDiagram
                           the homepage's compact preview...).
  data/
    functions.json           The 14 business functions, each with a
                           `subtypes[]` breakdown (e.g. Sales → Prospecting
                           & lead enrichment, Conversation intelligence...).
    phases.json               The 7 lifecycle phases.
    function-connections.json  Curated, directed cross-function
                           relationships (`{from, to, relationship}`) — the
                           "how functions hand off to each other" graph
                           the architecture page visualizes.
    tools/<function>.json     One file per function — the tool records
                           whose *primary* home is that function (a tool
                           can still list additional functions/phases it
                           also serves; see "Data model" below).
  lib/
    schema.ts                Zod schemas — the single source of truth for
                           what a valid tool/function/phase record looks
                           like.
    data.ts                  Loads + validates all JSON at build time,
                           exposes typed lookups (getToolsForFunction, the
                           matrix counts, etc).
    filter-tools.ts, search.ts, use-url-filters.ts
                              Pure filtering logic, Fuse.js search index,
                           and the hook that keeps filter state in the URL
                           query string so any filtered view is a shareable
                           link.
    store.ts                 Zustand shortlist/compare store.
    roadmap.ts, stack-builder.ts
                              Pure functions generating the adoption
                           roadmap content and the stack-builder cost
                           estimate — no component owns this logic.
scripts/
  validate-data.ts          Schema + cross-reference validation for every
                           file in data/tools/*.json. Runs on `npm run
                           validate:data`, and automatically before every
                           build via the `prebuild` npm hook — a bad PR to
                           the data can't reach a deploy.
e2e/                        Playwright specs.
src/**/__tests__/           Vitest + Testing Library specs, colocated with
                           the code they test.
```

## Data model & keeping it current

Tool data lives in typed, validated JSON specifically so **content updates
don't require touching application code** — adding a tool, or correcting a
price, is a small JSON diff reviewable in a pull request.

Every tool record (`src/lib/schema.ts`'s `toolSchema`) carries: `id`,
`name`, `bestFor`, `description`, `functions[]`, `phases[]`, `pricingModel`
(`free`/`freemium`/`paid`/`enterprise`), `badge` (the UI label), `freeTier`
(availability + limits), `paidTier` (starting price + billing unit, or
`isCustomPricing: true` when a vendor doesn't publish pricing), `topPick`,
`enterpriseReady`, `officialUrl`, `sourceUrl`, and `lastChecked` (an
ISO date). `npm run validate:data` fails the build on any schema violation,
any reference to an unknown function/phase id, or an internally
inconsistent record (e.g. a `Free` badge on a tool that isn't actually
`pricingModel: "free"`) — and warns (without failing) on any tool whose
`lastChecked` date is more than 120 days old, as a prompt to re-verify.

**Both the business functions and lifecycle phases are a fixed, curated
list** (`src/data/functions.json` / `phases.json`) rather than open-ended,
since the whole product's information architecture (the matrix, the filter
UI, the stack builder, the architecture canvas) is built around a stable
set of 14 functions × 7 phases. Adding a genuinely new function or phase is
a deliberate content decision, not a routine PR — it means adding the entry
to that file (with its `subtypes[]`) _and_ at least one tool file
referencing it. `function-connections.json` is validated the same way:
`npm run validate:data` fails on a connection referencing an unknown
function id, a self-referencing connection, or a duplicate pair.

## Research sources & methodology

No tool list was provided — all 57 tool records were researched directly
from vendors' official pricing pages (fetched live) and, where a page
blocked automated fetching or a vendor doesn't publish self-serve pricing,
corroborated against multiple independent secondary sources (analyst
write-ups, procurement-data aggregators like Vendr). Every record's
`sourceUrl` points at the vendor's own pricing page even when it had to be
corroborated rather than fetched directly, and `paidTier.notes` says so
explicitly wherever a price is a reported/market estimate rather than an
official published figure (e.g. Gong, Harvey, Ada, Glean — vendors with no
public price list). **No price was invented.** `lastChecked` is the date
that research pass was done (2026-09-25 for the initial data set).

Coverage as of the initial pass: all 14 functions have real, sourced tool
records, though not all reach the ideal 6–10-per-function range yet —
Software Development, Product & Ideation, Marketing, and Customer Support
were researched most deeply (6–8 tools each); the other 10 functions
(including Design & Creative and IT & Security, added in a follow-up pass
to round out coverage) currently have 3 tools each. Extending any
function's coverage is exactly the "small JSON diff PR" the data model was
built for — add a record to that function's file in `src/data/tools/`,
following the existing schema, and `npm run validate:data` will confirm
it's well-formed.

The `function-connections.json` relationships (which function hands off to
which, and why) are an original design judgment, not scraped from any
source — a reasonable first cut at how these functions actually interact
in a typical enterprise, meant to be corrected/extended by whoever actually
runs these functions rather than treated as authoritative.

## Development

```bash
npm install
npm run dev            # http://localhost:3000
```

```bash
npm run validate:data  # schema + cross-reference check on src/data/**
npm run lint            # ESLint
npm run typecheck       # tsc --noEmit
npm run format           # Prettier --write
npm run test              # Vitest unit/component tests
npm run test:e2e          # Playwright end-to-end tests (builds + starts the app)
npm run build              # production build (also runs validate:data first)
```

## Environment variables

See `.env.example`. `NEXT_PUBLIC_SITE_URL` should be set to the real
deployed domain (used in metadata, the sitemap, and JSON-LD).
`NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is optional and opt-in — with it unset, no
analytics script loads at all and the CSP doesn't allow-list one.

## Deployment

Zero-config on Vercel (Next.js is auto-detected; every route is static).
Security headers (CSP, `X-Frame-Options`, `Referrer-Policy`, etc.) are set
in `next.config.ts` and apply automatically on Vercel. `.github/workflows/
ci.yml` runs format/lint/typecheck/data-validation/unit tests on every PR,
end-to-end tests in a second job, and a production build in a third — all
three must pass before merging is sensible.
