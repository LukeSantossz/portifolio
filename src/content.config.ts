import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Curated projects shown on the landing page.
 * Add a project by creating a new Markdown file in `src/content/projects/`.
 * Each card is rendered from the frontmatter below — the Markdown body is
 * optional and reserved for a future detailed case-study page.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    domain: z.string().optional(),
    // Case-study narrative (problem -> approach -> result).
    problem: z.string(),
    approach: z.string(),
    result: z.string(),
    stack: z.array(z.string()),
    // Accept a valid URL or an empty string (so unused links can stay in place).
    repoUrl: z.union([z.string().url(), z.literal('')]).optional(),
    demoUrl: z.union([z.string().url(), z.literal('')]).optional(),
    period: z.string().optional(),
    // Higher featured + lower order shows first.
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

export const collections = { projects };
