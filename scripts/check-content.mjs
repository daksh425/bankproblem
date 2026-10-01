#!/usr/bin/env node
/** Reports every frontmatter problem at once, instead of one per failed build. */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIR = 'src/content/problems';
const files = (await readdir(DIR)).filter((f) => /\.mdx?$/.test(f));
let bad = 0;

for (const f of files) {
  const raw = await readFile(join(DIR, f), 'utf8');
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) { console.log(`✗ ${f}: no frontmatter`); bad++; continue; }
  const b = fm[1];
  const get = (k) => (b.match(new RegExp(`^${k}:\\s*"?(.*?)"?\\s*$`, 'm')) ?? [])[1];
  const issues = [];

  const desc = get('description');
  if (!desc) issues.push('description missing');
  else if (desc.length > 165) issues.push(`description ${desc.length} chars (max 165)`);
  else if (desc.length < 60) issues.push(`description ${desc.length} chars (min 60)`);

  const title = get('title');
  if (title && title.length > 110) issues.push(`title ${title.length} chars (max 110)`);
  const seo = get('seoTitle');
  if (seo && seo.length > 65) issues.push(`seoTitle ${seo.length} chars (max 65)`);

  const answer = get('answer');
  if (answer && answer.length > 400) issues.push(`answer ${answer.length} chars (max 400)`);

  if (get('type') === 'guide' && !/^sources:/m.test(b)) issues.push('guide with no sources');

  // related slugs must resolve to real files
  const rel = b.match(/^related:\n((?:\s+- .*\n)+)/m);
  if (rel) {
    for (const line of rel[1].trim().split('\n')) {
      const slug = line.replace(/^\s*-\s*/, '').trim();
      if (!files.some((x) => x.replace(/\.mdx?$/, '') === slug)) {
        issues.push(`related slug not found: ${slug}`);
      }
    }
  }

  if (issues.length) { bad++; console.log(`✗ ${f}\n    ${issues.join('\n    ')}`); }
}

console.log(bad ? `\n${bad} of ${files.length} files need attention.` : `✓ all ${files.length} files OK`);
process.exit(bad ? 1 : 0);
