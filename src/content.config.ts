import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Two content types in one collection:
 *
 *   post  — the daily blog. Fast to write. Sources optional.
 *   guide — the evergreen rule pages (RBI timelines, liability caps, escalation).
 *           Sources are MANDATORY. These are the YMYL pages that have to survive
 *           scrutiny, and they are what the daily posts link into.
 *
 * Posting daily is only sustainable if the bar is not identical for both. Keep
 * the guides rigorous and let the posts move.
 */

const sourceSchema = z.object({
  label: z.string(),
  url: z.string().url(),
  issuer: z.string().default('RBI'),
  dated: z.coerce.date().optional(),
});

const problems = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/problems' }),
  schema: ({ image }) =>
    z
      .object({
        type: z.enum(['post', 'guide']).default('post'),

        title: z.string().max(110),
        seoTitle: z.string().max(65).optional(),
        description: z.string().min(60).max(165),

        category: z.enum([
          'credit-score', 'cards', 'loans', 'fraud',
          'payments', 'accounts', 'nri', 'disputes',
        ]),

        /** The exact query a real person types. */
        question: z.string().optional(),
        /**
         * The direct answer in 1-2 sentences, shown above the fold.
         * Required on guides; optional on posts.
         */
        answer: z.string().min(40).max(400).optional(),

        published: z.coerce.date(),
        updated: z.coerce.date().optional(),
        reviewed: z.coerce.date().optional(),

        author: reference('authors'),
        reviewer: reference('authors').optional(),

        /** Required on guides. Optional on posts, but always worth having. */
        sources: z.array(sourceSchema).default([]),

        faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
        steps: z.array(z.object({ name: z.string(), text: z.string() })).optional(),
        related: z.array(z.string()).default([]),

        affiliate: z.boolean().default(false),
        /** Shows the mid-article CTA block. */
        cta: z.boolean().default(true),

        volume: z.number().optional(),
        tags: z.array(z.string()).default([]),

        /**
         * Optional. Leave it out and a branded cover is generated from the
         * title, so publishing is never blocked on making artwork.
         */
        cover: image().optional(),
        coverAlt: z.string().optional(),

        draft: z.boolean().default(false),
      })
      .superRefine((data, ctx) => {
        if (data.type !== 'guide') return;
        if (data.sources.length === 0) {
          ctx.addIssue({
            code: 'custom',
            path: ['sources'],
            message: 'A guide must cite at least one primary source. Use type: post if this is a blog entry.',
          });
        }
        if (!data.answer) {
          ctx.addIssue({
            code: 'custom',
            path: ['answer'],
            message: 'A guide must carry a short answer. If you cannot state it in two sentences, it is not ready.',
          });
        }
      })
      .transform((data) => ({ ...data, updated: data.updated ?? data.published })),
});

const authors = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/authors' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      credentials: z.array(z.string()).default([]),
      bio: z.string(),
      links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
      email: z.string().email().optional(),
      avatar: image().optional(),
    }),
});

export const collections = { problems, authors };
