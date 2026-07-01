/**
 * Shared helpers for the blog. Kept here (not inline) so the section, the index,
 * the card, and the post page all agree on fetching, reading time, and dates.
 */
import { getCollection } from 'astro:content';

/** Non-draft posts, newest first. Single source of truth for post ordering. */
export const getPosts = () =>
  getCollection('blog', ({ data }) => !data.draft).then((posts) =>
    posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()),
  );

/** Approximate reading time in whole minutes (~200 words per minute), min 1. */
export const readingTime = (body = ''): number =>
  Math.max(1, Math.round(body.trim().split(/\s+/).filter(Boolean).length / 200));

/**
 * Shared, locale-stable date label for post metadata (e.g. "Jun 24, 2026").
 * Formatted in UTC: `pubDate` is coerced from a `YYYY-MM-DD` string (parsed as
 * UTC midnight), so pinning the zone keeps the day stable across build machines.
 */
export const formatDate = (date: Date): string =>
  date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
