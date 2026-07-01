/**
 * Shared helpers for the blog. Kept here (not inline) so the section card and
 * the post page agree on reading time and date formatting.
 */

/** Approximate reading time in whole minutes (~200 words per minute), min 1. */
export const readingTime = (body = ''): number =>
  Math.max(1, Math.round(body.trim().split(/\s+/).filter(Boolean).length / 200));

/** Shared, locale-stable date label for post metadata (e.g. "Jun 24, 2026"). */
export const formatDate = (date: Date): string =>
  date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
