#!/usr/bin/env node
/**
 * Scaffold a post or a guide.
 *
 *   npm run new -- "Bank froze my account without notice" accounts
 *   npm run new -- "UPI autopay mandate keeps failing" payments --guide
 */
import { writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const CATEGORIES = [
  'credit-score', 'cards', 'loans', 'fraud',
  'payments', 'accounts', 'nri', 'disputes',
];

const argv = process.argv.slice(2);
const isGuide = argv.includes('--guide');
const [title, category] = argv.filter((a) => !a.startsWith('--'));

if (!title || !category) {
  console.error('Usage: npm run new -- "Your title" <category> [--guide]');
  console.error('Categories: ' + CATEGORIES.join(', '));
  process.exit(1);
}
if (!CATEGORIES.includes(category)) {
  console.error(`Unknown category "${category}".`);
  console.error('Categories: ' + CATEGORIES.join(', '));
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^\p{L}\p{N}\s-]/gu, '')
  .trim()
  .split(/\s+/)
  .slice(0, 9)
  .join('-');

const today = new Date().toISOString().slice(0, 10);
const file = join('src', 'content', 'problems', `${slug}.mdx`);

try {
  await access(file);
  console.error(`${file} already exists.`);
  process.exit(1);
} catch {}

const guideBits = isGuide
  ? `question: "The exact phrase a real person would type into Google"
answer: "The direct answer in one or two sentences, 40-400 characters. It renders above the fold and is what an AI Overview will lift. If you cannot write it, you are not ready to publish."
reviewed: ${today}
sources:
  - label: "Name of the circular or master direction"
    url: "https://www.rbi.org.in/"
    issuer: "Reserve Bank of India"
    dated: ${today}
faqs:
  - q: "A question people actually ask next"
    a: "A short, direct answer."
`
  : '';

const body = isGuide
  ? `import Callout from '@/components/Callout.astro';

Open with the reader's situation, not a definition. They already know what a
bank is; they want to know what happens now.

## The rule

<Callout type="rule" title="State the rule in one sentence" cite="RBI circular ..." citeUrl="https://www.rbi.org.in/">
The specific entitlement, with the number and the deadline. This box is the
house style for anything the reader can hold a bank to.
</Callout>

## What to do

## When the bank says no

Thirty days after a written complaint, the RBI Ombudsman is free and open.
[How that works](/disputes/rbi-ombudsman-how-to-file).
`
  : `import Callout from '@/components/Callout.astro';

Open with the specific situation. Two or three sentences, then get to it.

## The first H2

Link into at least two guides. Posts age; guides accumulate authority, and the
internal links are how that transfers.

## The second H2

<Callout type="warn" title="Use callouts for the thing people get wrong">
One per post is usually enough.
</Callout>
`;

const content = `---
type: ${isGuide ? 'guide' : 'post'}
title: "${title.replace(/"/g, '\\"')}"
description: "A 60-165 character summary. This is the meta description, so write it for the search result, not for the page. The build fails if it is too long."
category: ${category}
published: ${today}
author: editor
${guideBits}related: []
---

${body}`;

await writeFile(file, content, 'utf8');
console.log(`\n  ${isGuide ? 'Guide' : 'Post'} created: ${file}`);
console.log(`  URL:  /${category}/${slug}\n`);
