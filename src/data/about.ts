/**
 * About section content. PLACEHOLDER, see the note in `site.ts`.
 * Decoupled from the component so copy edits never touch markup.
 */
import { site } from './site.ts';

export const about = {
  paragraphs: [
    'I work on systems that put a language model in front of someone who is going to act on the answer. Most of my time goes to the parts that are not the model: what gets retrieved, how the output is checked, and what happens when it is wrong.',
    'Three years before that were data pipelines in agriculture. The useful thing I took from it was watching a model meet a field it had never been shown, which is where the habit of splitting data by field instead of at random came from, and the habit of writing down what a system cannot do.',
    'I am still better at the software half than the ML half. The write-ups above try to be honest about which parts of each project are measured and which are still claims.',
  ],

  facts: [
    { label: 'Based in', value: 'São Paulo, Brazil (GMT-3)' },
    { label: 'Experience', value: '5 years in software, 2 in ML' },
    { label: 'Work authorisation', value: 'Brazilian and Portuguese citizen, no sponsorship needed in the EU' },
    { label: 'Languages', value: 'Portuguese (native), English (professional)' },
    { label: 'Email', value: site.email },
  ],

  /**
   * Heading for the compact stack line. The technologies themselves come from
   * `skills.ts`; each one also appears inside the record of the project that
   * used it, which is where it carries context.
   */
  stackLabel: 'Stack',
} as const;
