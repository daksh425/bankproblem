import { getCollection, type CollectionEntry } from 'astro:content';

const isPublished = (p: CollectionEntry<'problems'>) =>
  import.meta.env.DEV || !p.data.draft;

/** All publishable problems, newest update first. */
export async function getProblems() {
  const all = await getCollection('problems', isPublished);
  return all.sort((a, b) => b.data.updated.getTime() - a.data.updated.getTime());
}

export async function getProblemsByCategory(category: string) {
  const all = await getProblems();
  return all.filter((p) => p.data.category === category);
}

/** { 'cards': 12, ... } — used for hub counts and the content-gap report. */
export async function getCategoryCounts() {
  const all = await getProblems();
  return all.reduce<Record<string, number>>((acc, p) => {
    acc[p.data.category] = (acc[p.data.category] ?? 0) + 1;
    return acc;
  }, {});
}
