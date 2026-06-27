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
    // Curated headline metric for the case-study showcase (the giant hero number).
    metric: z.string(), // e.g. "0.19°C", "3rd / 1,300+"
    metricLabel: z.string().optional(), // short context under the metric
    // Depth case-study framework (six moves). problem (context), decision and
    // result are the spine; constraints + alternatives are what prove judgement.
    problem: z.string(), // 1. Context
    constraints: z.string().optional(), // 2. Constraints
    approach: z.string(), // 3. Central decision
    alternatives: z.string().optional(), // 4. Alternatives considered and rejected
    result: z.string(), // 5. Result (the always-visible punchline)
    retrospective: z.string().optional(), // 6. Retrospective: known limits / trade-offs
    // Forward-looking "what's next" line, mirrored from each repo's roadmap.
    roadmap: z.string().optional(),
    // Banner image/logo for the card. Drop a file in public/images/projects/
    // and reference it as "/images/projects/<file>". When empty, the card
    // renders a generated gradient placeholder with the project monogram.
    image: z.string().optional(),
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
