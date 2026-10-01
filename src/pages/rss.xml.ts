import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '@/config';
import { getProblems } from '@/lib/content';

export async function GET(context: APIContext) {
  const problems = await getProblems();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: problems.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.updated,
      link: `/${p.data.category}/${p.id}`,
    })),
    customData: `<language>en-in</language>`,
  });
}
