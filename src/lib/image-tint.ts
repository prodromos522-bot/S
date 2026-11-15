/**
 * The product catalogue currently shares a handful of generic stock photos
 * across many products (every "aromata" bottle reuses the same gold-bottle
 * render, etc.), so products end up looking visually identical in grids.
 *
 * Until each product has its own photo, we deterministically tint each
 * product's image with a CSS filter derived from its id. The white studio
 * background in these photos has no saturation, so hue-rotate leaves it
 * untouched — only the bottle/cap colors shift — which keeps the clean,
 * consistent look while making products visually distinguishable.
 */
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function productImageFilter(id: string): string {
  const h = hashString(id);
  const hue = h % 360;
  const saturate = 100 + (h % 35); // 100–135%
  const brightness = 96 + (h % 10); // 96–106%
  return `hue-rotate(${hue}deg) saturate(${saturate}%) brightness(${brightness}%)`;
}
