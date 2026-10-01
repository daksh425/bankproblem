/**
 * Single source of truth for the site's identity.
 * Change the brand + domain here and it propagates everywhere.
 */

export const SITE = {
  // --- live domain ---
  name: 'BankProblem',
  domain: 'bankproblem.online',
  url: 'https://bankproblem.online',
  // -------------------
  tagline: 'Indian banking problems, solved properly',
  description:
    'Clear, sourced answers to the banking problems Indians actually face — card rejections, failed transfers, credit report disputes, unauthorised transactions and RBI escalation.',
  locale: 'en_IN',
  lang: 'en-IN',
  country: 'IN',
  currency: 'INR',
  /** Google AdSense publisher id, e.g. 'ca-pub-0000000000000000'. Empty = no ad markup rendered. */
  adsenseClient: '',
  /** Google Search Console HTML-tag verification token (the content= value only). */
  searchConsoleToken: '',
  /** GA4 measurement id, e.g. 'G-XXXXXXXXXX'. Empty = no analytics script. */
  ga4Id: '',
  email: 'editor@bankproblem.online',
} as const;

export type CategorySlug =
  | 'credit-score'
  | 'cards'
  | 'loans'
  | 'fraud'
  | 'accounts'
  | 'payments'
  | 'nri'
  | 'disputes';

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Used in <title> and H1 on the hub page. */
  heading: string;
  blurb: string;
  /**
   * commercial = reader is in-market, affiliate/lead revenue is realistic.
   * support    = little direct revenue, earns its place via internal links + AdSense.
   * Drives how many articles each silo gets. See CONTENT-PLAN.md.
   */
  intent: 'commercial' | 'support';
}

/** The eight silos. Order here is the order everywhere on the site. */
export const CATEGORIES: Category[] = [
  {
    slug: 'credit-score',
    name: 'Credit Score',
    heading: 'Credit score & credit report problems',
    blurb:
      'Score drops you cannot explain, disputes with the bureaus, settled accounts that will not clear, and what a lender actually sees.',
    intent: 'commercial',
  },
  {
    slug: 'cards',
    name: 'Cards',
    heading: 'Credit & debit card problems',
    blurb:
      'Applications rejected, limits cut, charges you did not agree to, and closures the bank will not complete.',
    intent: 'commercial',
  },
  {
    slug: 'loans',
    name: 'Loans',
    heading: 'Loan problems',
    blurb:
      'Rejections despite a good score, foreclosure charges, NOC and lien release, and EMI failures.',
    intent: 'commercial',
  },
  {
    slug: 'fraud',
    name: 'Fraud',
    heading: 'Unauthorised transactions & fraud',
    blurb:
      'Money gone from your account. What RBI makes the bank pay back, how fast you have to report it, and what to do when they refuse.',
    intent: 'support',
  },
  {
    slug: 'payments',
    name: 'Payments',
    heading: 'Payment & transfer failures',
    blurb:
      'UPI, IMPS, NEFT and ATM transactions that failed, reversed late, or went to the wrong person.',
    intent: 'support',
  },
  {
    slug: 'accounts',
    name: 'Accounts',
    heading: 'Account & KYC problems',
    blurb:
      'Frozen and dormant accounts, re-KYC that will not complete, minimum balance penalties, and closing an account cleanly.',
    intent: 'support',
  },
  {
    slug: 'nri',
    name: 'NRI',
    heading: 'NRI banking',
    blurb:
      'NRE and NRO accounts, repatriation limits, FEMA residency, and what happens to a resident account after you move.',
    intent: 'commercial',
  },
  {
    slug: 'disputes',
    name: 'Escalation',
    heading: 'Complaints & RBI Ombudsman',
    blurb:
      'The escalation ladder that actually works: bank nodal officer, RBI Ombudsman under RB-IOS, and consumer court.',
    intent: 'support',
  },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c])
) as Record<CategorySlug, Category>;

export const NAV = [
  { href: '/blog', label: 'Blog' },
  ...CATEGORIES.map((c) => ({ href: `/${c.slug}`, label: c.name })),
  { href: '/tools', label: 'Tools' },
];
