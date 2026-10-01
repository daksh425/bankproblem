# Going live

Roughly two hours of work, plus waiting. Cost is the domain, about ₹900/year.
Everything else here is free.

---

## Before anything else: two blockers

### 1. Replace the author (15 minutes)

`src/content/authors/editor.md` still says `[Your name]`. Every one of the 40
articles carries that byline.

The editorial policy page promises named, checkable authors, and on money topics
the byline is the single biggest trust signal Google reads. Shipping a bracketed
placeholder undermines the whole site.

Write a real name, a specific role, and a bio that says concretely why you can be
trusted on Indian banking. If you have a LinkedIn, put it in `links` — that is
what `sameAs` in the Person schema points at.

### 2. Verify the circulars (half a day, and worth it)

Seven articles are `type: guide` and each cites a real RBI instrument. I wrote
them from a model's knowledge of those circulars, and **circulars get amended and
superseded**.

Open each source URL in the frontmatter and confirm the rule still says what the
page says. The instruments relied on:

| Instrument | Used by |
| --- | --- |
| Limiting Liability in Unauthorised Electronic Banking Transactions (6 Jul 2017) | the whole fraud silo |
| Harmonisation of Turn Around Time for failed transactions (20 Sep 2019) | payments silo, compensation calculator |
| Master Direction — Credit Card and Debit Card (21 Apr 2022) | cards silo |
| Framework for delayed updation of credit information (26 Oct 2023) | credit-score silo |
| Foreclosure charges on floating rate term loans (5 Jun 2012) | loans silo |
| Penal charges on non-maintenance of minimum balance (20 Nov 2014) | accounts silo |
| Reserve Bank — Integrated Ombudsman Scheme (12 Nov 2021) | escalation silo |

Fix anything that has moved, then set `reviewed:` to today's date on those pages.

The 33 `post` articles make fewer hard claims, but skim them too. Where a post
states a number, it should match whatever the guide says.

---

## Step 1 — Domain ✅ done

`bankproblem.online`, already wired into `src/config.ts` and `public/robots.txt`.

## Step 2 — Set up the mailbox

`editor@bankproblem.online` appears on the contact, privacy and disclaimer pages,
and in the Organization schema. It has to actually receive mail before you launch.

Cheapest route: move the domain's nameservers to Cloudflare, then use **Cloudflare
Email Routing** (free) to forward `editor@bankproblem.online` to your personal
inbox. Takes about ten minutes and needs no mail hosting.

## Step 3 — Push to GitHub

```bash
git init
git add -A
git commit -m "Initial site"
gh repo create yourbrand --private --source=. --push
```

## Step 4 — Deploy on Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Pick the repo
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy

You get a `*.pages.dev` URL in a couple of minutes. Check it works.

6. **Custom domains** → add your domain → follow the DNS prompts

Cloudflare issues the SSL certificate automatically. Every `git push` to `main`
redeploys.

## Step 5 — Google Search Console

1. search.google.com/search-console → **Add property** → **URL prefix** → your domain
2. Choose **HTML tag** verification, copy the `content="..."` value
3. Paste it into `searchConsoleToken` in `src/config.ts`, push, wait for deploy
4. Verify
5. **Sitemaps** → submit `sitemap-index.xml`

Then request indexing manually for your five or six best pages. The rest will
follow.

**Expect nothing for six to eight weeks.** A new domain on YMYL finance topics is
the slowest possible combination. This is normal and not a sign anything is wrong.

## Step 6 — Analytics (optional, do it now anyway)

Create a GA4 property, put the `G-XXXXXXXXXX` id into `ga4Id` in `src/config.ts`.
Without it you will be guessing about what works.

---

## Monetisation — not yet

### AdSense

Apply when you have **20+ articles indexed** and some real traffic, realistically
two to three months after launch. Applying on day one with no traffic is the most
common way to get rejected, and reapplying after a rejection is harder than
waiting.

You already have what they check: original content, a privacy policy that names
Google's advertising cookies, a disclaimer, and a contact page.

When approved: put the publisher id into `adsenseClient`, create ad units, and
pass each unit's slot id to the `AdSlot` components. The slots are already placed
on every article, the blog feed and the tools — they render nothing until both the
client id and a slot id are set.

### Affiliate

This is where the money actually is — one approved credit card referral pays
₹1,500–3,500, which is 12,000 to 50,000 pageviews of AdSense at Indian rates.

Most Indian BFSI affiliate programmes require an established site with traffic, so
apply after AdSense, not before. The credit-score and cards silos are where this
belongs. Set `affiliate: true` on any article carrying a link and the disclosure
renders above the fold automatically.

**If you add a cookie banner** for EEA/UK traffic, do it before you turn on
personalised ads.

---

## After launch

**Keep publishing.** You have 40 articles dated across Oct–Nov 2026. They all
publish at build time, so edit the `published` dates if you want a different
sequence.

```bash
npm run new -- "Your next title" accounts
npm run new -- "An evergreen rule page" loans --guide
npm run check:content
```

**Link every new post into two or three guides.** Posts go stale; guides
accumulate authority, and internal links are how it transfers.

**Refresh the `reviewed:` dates** on the guides every six months, and immediately
when a circular changes. The editorial policy page commits you to this in writing.

**Watch Search Console** for which queries you actually surface on. After a couple
of months it will tell you which silo is working, and that is where the next 40
articles should go — not spread evenly across all eight.
