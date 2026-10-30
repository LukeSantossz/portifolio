/**
 * About section content.
 * Decoupled from the component so copy edits never touch markup
 * (matches the src/data/*.ts pattern used across the site).
 *
 * Copy here is synced with CONTENT-SOURCE.md. The order is field, then where
 * the field was learned, then how the work is actually done. It deliberately
 * recaps no project: the Work index sits directly above this section and the
 * stack renders directly beside it, so repeating either here read as padding.
 */
import { site } from './site.ts';

export const about = {
  paragraphs: [
    "I came to AI through agriculture. In 2024, at CIAg, the Jacto Group's agro-innovation center, I led a small team building an LLM assistant that answered faculty and students from agronomic documents. It worked well enough to be convincing, and that bothered me: when it was wrong, it sounded exactly as sure as when it was right.",
    "I learned what that kind of mistake costs when I moved to after-sales at Jacto. For about twenty months I worked on wrong-part returns, where every wrong answer came back as a returned part and a freight bill. I wrote the returns manual the dealer network adopted, and together with the team we brought the rate down to zero by mid-2026.",
    "When I went back to building with models, that experience decided where I spent my time. At PM Accelerator, I made an AI advisor refuse a question before calling the model whenever it had no data to answer it. As a volunteer researcher on a FAPESP-funded project, from March to June 2026, I calibrated the domain gate of a soil-fertility RAG agent from 120 labeled questions. Today at Unipac I work on an internal platform where AI agents generate whole applications, and I wrote the security gate each one has to pass before a developer approves it.",
    "That gate is also where my curiosity widened. After an agent fired 2,179 identical tool calls in a single response, I added layers of guardrails and started reading about AI security engineering as a field of its own, which led me to a cybersecurity course this year. AR and digital twins pull me the other way, back to machines and fields. I want to know what checking an answer looks like when the model reasons about a physical system. I haven't built anything there yet.",
    "That's the work I want to keep doing: building AI systems people can actually rely on.",
  ],

  facts: [
    {
      label: 'Based in',
      value: 'Brazil (GMT-3) · remote-ready, any time zone · open to relocation',
    },
    {
      label: 'Education',
      value: 'Technology degree (CST) in Big Data for Agribusiness, Fatec Shunji Nishimura (expected Nov 2026)',
    },
    {
      label: 'Focus',
      value: 'LLM agents · RAG · AI guardrails & evaluation',
    },
    {
      label: 'Languages',
      value: 'Portuguese (native) · English (professional working proficiency)',
    },
    { label: 'Email', value: site.email },
  ],

  /**
   * Heading for the compact stack line. The technologies themselves come from
   * `skills.ts`; each one also appears inside the record of the project that
   * used it, which is where it carries context.
   */
  stackLabel: 'Stack',
} as const;
