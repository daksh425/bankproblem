# BankProblem — Indian banking problems

Live at **https://bankproblem.online**

Static content site built with Astro. Eight topical silos, Markdown articles with
enforced sourcing, two calculators, and the trust pages AdSense and YMYL ranking
both require.

```bash
npm run dev      # http://localhost:4321
npm run build    # static output into dist/
npm run preview  # serve the built site
```

---

## Setup checklist

Work through this before you publish anything publicly.

| # | Task | Where |
| --- | --- | --- |
| 1 | **Replace the placeholder author.** The site promises named authors; `[Your name]` must not ship. | `src/content/authors/editor.md` |
| 2 | Set the brand name, domain and contact email. | `src/config.ts` |
| 3 | Update the sitemap URL. | `public/robots.txt` |
| 4 | Fill in legal entity name and registered address. | `src/pages/privacy.astro` |
| 5 | **Verify every cited circular is still current.** See the warning below. | `src/content/problems/*.mdx` |
| 6 | Add your Search Console token, then GA4 id. | `src/config.ts` |
| 7 | Apply for AdSense once you have ~20 real articles. Add the publisher id and per-slot ids. | `src/config.ts`, `AdSlot` usages |

### ⚠️ Verify the circulars before you publish

The five seed articles cite real RBI instruments, but they were written from a
model's knowledge and **RBI circulars get amended and superseded**. Open each
source URL and confirm the rule still says what the page says before this goes
live. The whole credibility of the site rests on this, and the editorial policy
page commits you to it in writing.

Circulars relied on by the seed content:

- Limiting Liability of Customers in Unauthorised Electronic Banking Transactions (6 Jul 2017)
- Harmonisation of Turn Around Time and customer compensation for failed transactions (20 Sep 2019)
- Master Direction — Credit Card and Debit Card Issuance and Conduct (21 Apr 2022)
- Framework for compensation for delayed updation of credit information (26 Oct 2023)
- Reserve Bank — Integrated Ombudsman Scheme (12 Nov 2021)

---

## Publishing

Two content types, because a daily cadence and a rigorous evergreen page cannot
share the same bar.

| | `post` | `guide` |
| --- | --- | --- |
| What it is | the daily blog entry | an evergreen rule page |
| `sources` required | no | **yes, build fails without one** |
| `answer` required | no | **yes** |
| Typical cadence | most days | one or two a month |

Scaffold either one:

```bash
npm run new -- "Bank froze my account without notice" accounts
npm run new -- "Cheque bounce charges: what banks may actually levy" accounts --guide
```

That writes `src/content/problems/<slug>.mdx` with the right frontmatter, dated
today, and prints the URL. Categories: `credit-score`, `cards`, `loans`,
`fraud`, `payments`, `accounts`, `nri`, `disputes`.

**Every post should link into two or three guides.** Posts age; guides
accumulate ranking authority, and internal links are how that transfers. A
hundred posts pointing at twenty guides beats a hundred and twenty free-floating
articles by a wide margin.

### Covers

Leave `cover` out of the frontmatter and a branded SVG is generated from the
title, with a colour deterministically picked from the slug — so publishing is
never blocked on making artwork, and a post's cover never changes between
builds. Supply `cover: ./something.jpg` when you have a real image.

The one gap: social previews. An auto-generated cover is inline SVG, which
Facebook, WhatsApp and LinkedIn will not render as an `og:image`. Posts with a
real `cover` are fine. If social sharing matters, either supply covers on the
posts you promote or add a satori-based OG endpoint later.

### Frontmatter reference

| Field | Notes |
| --- | --- |
| `description` | 60–165 characters. The build enforces the cap so meta descriptions never truncate in search. |
| `answer` | 1–2 sentences, rendered above the fold. This is what an AI Overview lifts. |
| `sources` | Primary sources with issuer and date. Renders as `citation` in the BlogPosting schema. |
| `reviewed` | Last time a human opened the circular and confirmed it. Refresh every six months. |
| `related` | Slugs of sibling pages. Drives the "You may also like" grid. |
| `faqs` | Accordion plus `FAQPage` JSON-LD. |
| `steps` | Optional. Present means `HowTo` JSON-LD too. |
| `cta` | Defaults to true. Set false to hide the mid-article CTA block. |
| `draft` | Keeps a page out of the production build. |

In the body, `import Callout from '@/components/Callout.astro'` gives you
`type="rule" | "warn" | "alert" | "ok"` boxes with a citation footer. Drop
`<Cta />` anywhere to place an extra CTA block.

## Architecture

```
src/
  config.ts              brand, domain, ad ids, the 8 categories — change once, applies everywhere
  content.config.ts      post/guide schema; guides are refused without sources
  content/problems/      posts and guides (.mdx)
  content/authors/       bylines, rendered as Person schema on author pages
  lib/cover.ts           deterministic cover palettes, title wrapping, read time
  lib/paginate.ts        page slicing shared by blog and category routes
  layouts/Base.astro     <head>, Organization + WebSite JSON-LD, theme script, ad/analytics loaders
  layouts/Problem.astro  post shell + BlogPosting/FAQPage/HowTo/BreadcrumbList JSON-LD
  components/            Cover, PostCard, Share, Cta, Chips, Pager, Toc, Callout, AdSlot, Faq, Sources
  pages/blog/[...page]           paginated feed, 12 per page
  pages/[category].astro         silo hub, page 1
  pages/[category]/page/[n]      silo hub, pages 2+
  pages/[category]/[slug].astro  the posts themselves
  pages/tools/           two calculators, zero dependencies
  styles/global.css      the whole design system; tokens at the top
```

Adding a ninth category means adding one object to `CATEGORIES` in
`src/config.ts`. Nav, footer, hub page, breadcrumbs and homepage grid all follow.

---

## Deploying free on Cloudflare Pages

1. `git init && git add -A && git commit -m "initial"`, push to GitHub.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → connect the repo.
3. Build command `npm run build`, output directory `dist`.
4. Add your domain under Custom domains.

Total running cost is the domain, roughly ₹900/year. Nothing else here needs
paid hosting.

---

## What is deliberately not here

- **No cookie banner.** Add one before you turn on AdSense personalised ads if you take EEA/UK traffic. For India-only traffic under the DPDP Act, get the notice reviewed.
- **No comments.** They are a moderation burden and a spam vector on finance sites.
- **No newsletter.** Add it once something is worth sending.
- **No generic SIP/EMI calculator.** Groww takes 2.5M monthly visits on "sip calculator" alone and runs 216 calculator pages pulling 8.6M. That fight is not winnable. The two tools here answer questions tied to an actual banking problem, which is where the gap is.
