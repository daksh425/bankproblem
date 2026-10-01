export const PAGE_SIZE = 12;

export function slicePage<T>(items: T[], page: number, size = PAGE_SIZE) {
  const last = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(Math.max(1, page), last);
  const start = (current - 1) * size;
  return {
    items: items.slice(start, start + size),
    current,
    last,
    start,
    end: Math.min(start + size, items.length),
    total: items.length,
  };
}
