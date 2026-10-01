/**
 * Deterministic cover art. A post with no `cover` in its frontmatter still gets
 * a branded hero, so publishing daily is never blocked on making an image.
 */

const PALETTES = [
  // Jewel tones, warm-leaning. They have to sit on cream without clashing,
  // so every one is deep enough to carry white text and none is a pastel.
  { from: '#14604a', to: '#22886a', ink: '#f3fbf6', dot: '#79d8b2' },
  { from: '#124c5c', to: '#1c7d91', ink: '#eff9fc', dot: '#6fcbe0' },
  { from: '#9c4418', to: '#c86a22', ink: '#fff4ea', dot: '#f5b878' },
  { from: '#5a2340', to: '#8a3a60', ink: '#fdeff6', dot: '#e295bb' },
  { from: '#80550d', to: '#ad7a1c', ink: '#fff8e8', dot: '#f0c76a' },
  { from: '#20334f', to: '#365a85', ink: '#eef4fc', dot: '#8ab0e0' },
] as const;

export function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function paletteFor(seed: string) {
  return PALETTES[hash(seed) % PALETTES.length];
}

/** Greedy wrap by approximate glyph width, since SVG has no text flow. */
export function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = w;
      if (lines.length === maxLines - 1) break;
    } else {
      line = next;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  const used = lines.join(' ').split(/\s+/).length;
  if (used < words.length && lines.length) {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/[.,;:]?$/, '') + '…';
  }
  return lines;
}

/** Minutes to read, at 220 wpm, floored at 1. */
export function readTime(body: string | undefined): number {
  if (!body) return 1;
  const text = body
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_>[\]()|-]/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
