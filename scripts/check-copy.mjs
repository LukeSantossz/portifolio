/**
 * Copy gate.
 *
 * AGENTS.md states the copy rules for this site and nothing checked them, so
 * the site drifted into two Englishes and one dead anchor. This script is the
 * check: it reads the files that hold public copy and fails the build on the
 * closed list of defects below. See docs/specs/0005-english-copy-consistency-pass.md.
 *
 * Run with `npm run check:copy`. Exits 1 and prints file:line for each hit.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

/** Directories whose files carry public copy, and the extensions that hold it. */
const SOURCES = [
  { dir: 'src/data', exts: ['.ts'] },
  { dir: 'src/content', exts: ['.md'] },
  { dir: 'src/components', exts: ['.astro'] },
  { dir: 'src/pages', exts: ['.astro'] },
  { dir: 'src/layouts', exts: ['.astro'] },
];

/**
 * British spellings, with their American form. The site declares lang="en",
 * formats dates en-US and targets US and international readers, so one dialect
 * is the rule and this is the direction.
 */
const BRITISH = {
  artefact: 'artifact',
  artefacts: 'artifacts',
  behaviour: 'behavior',
  behaviours: 'behaviors',
  centre: 'center',
  centres: 'centers',
  colour: 'color',
  defence: 'defense',
  fibre: 'fiber',
  judgement: 'judgment',
  labelled: 'labeled',
  labelling: 'labeling',
  licence: 'license',
  modelling: 'modeling',
  normalise: 'normalize',
  normalised: 'normalized',
  optimise: 'optimize',
  optimised: 'optimized',
  organisation: 'organization',
  organise: 'organize',
  programme: 'program',
  recognise: 'recognize',
  recognised: 'recognized',
  serialise: 'serialize',
  serialised: 'serialized',
  serialisation: 'serialization',
  specialise: 'specialize',
  specialised: 'specialized',
  standardisation: 'standardization',
  standardise: 'standardize',
  standardised: 'standardized',
  summarise: 'summarize',
  summarised: 'summarized',
  utilise: 'utilize',
  whilst: 'while',
};

/**
 * Line-level rules. `test` returns the offending text or null.
 * A word is only a hit when it stands alone: `aria-labelledby` is markup, not copy.
 */
const RULES = [
  {
    id: 'british-spelling',
    test(line) {
      for (const [british, american] of Object.entries(BRITISH)) {
        const word = new RegExp(`(?<![\w-])${british}(?![\w-])`, 'i');
        if (word.test(line)) return `"${british}" is British English, use "${american}"`;
      }
      return null;
    },
  },
  {
    id: 'resume-accent',
    test(line) {
      // Only the accented forms. `resume`, `resumePath` and `my_resume.pdf` are fine.
      // Scan every occurrence: one line can hold `site.resumePath` and the label.
      for (const hit of line.matchAll(/r[ée]sum[ée]/gi)) {
        if (/é/i.test(hit[0])) {
          return `"${hit[0]}" is the only accented loanword in the interface and the file it serves is my_resume.pdf, use "Resume"`;
        }
      }
      return null;
    },
  },
  {
    id: 'dash',
    test(line) {
      // AGENTS.md scopes the punctuation rule to public copy: a code comment
      // may use whatever reads best, so skip the line when it is one.
      if (/^\s*(\/\/|\*|\/\*|<!--|-->)/.test(line)) return null;
      const hit = line.match(/[\u2013\u2014]|&mdash;|&ndash;/);
      return hit
        ? `"${hit[0]}" is an em or en dash, use a comma, a colon, parentheses or a new sentence`
        : null;
    },
  },
];

/** Every file under `dir` with one of `exts`, depth first. */
function walk(dir, exts, found = []) {
  let entries;
  try {
    entries = readdirSync(join(ROOT, dir));
  } catch {
    return found;
  }
  for (const entry of entries) {
    const path = join(dir, entry);
    if (statSync(join(ROOT, path)).isDirectory()) walk(path, exts, found);
    else if (exts.some((ext) => entry.endsWith(ext))) found.push(path);
  }
  return found;
}

const files = SOURCES.flatMap(({ dir, exts }) => walk(dir, exts));
const failures = [];

for (const file of files) {
  const lines = readFileSync(join(ROOT, file), 'utf8').split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const rule of RULES) {
      const message = rule.test(line);
      if (message) failures.push(`${file}:${index + 1}  [${rule.id}] ${message}`);
    }
  });
}

/**
 * Anchors into the landing page. The editorial restructure renamed sections and
 * left a link to #projects behind, which is a 404 a reader cannot see coming.
 */
const sectionIds = new Set();
for (const file of [...walk('src/components/sections', ['.astro']), 'src/pages/index.astro']) {
  const source = readFileSync(join(ROOT, file), 'utf8');
  for (const match of source.matchAll(/\bid=["']([a-z][\w-]*)["']/g)) sectionIds.add(match[1]);
}

for (const file of walk('src/content', ['.md'])) {
  const lines = readFileSync(join(ROOT, file), 'utf8').split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const match of line.matchAll(/\]\(\/#([\w-]+)\)/g)) {
      if (!sectionIds.has(match[1])) {
        failures.push(
          `${file}:${index + 1}  [dead-anchor] "/#${match[1]}" is not a section on the landing page`,
        );
      }
    }
  });
}

/**
 * Required frontmatter on every project record.
 *
 * SPEC-0001 added `kind` and `evaluation` after the review pass, on the finding
 * that every reviewer asked how a result was measured and whether the work was
 * professional, personal or research. Neither question is answerable from the
 * six existing moves, and an optional field that no record sets renders nothing
 * at all: the "How it was measured" move was dead until this check existed.
 */
const REQUIRED_FRONTMATTER = {
  kind: 'professional, personal or research: a solo project and a production system are different signals',
  evaluation: 'the dataset, the split and the baseline the headline number is measured against',
};

for (const file of walk('src/content/projects', ['.md'])) {
  const source = readFileSync(join(ROOT, file), 'utf8');
  for (const [field, why] of Object.entries(REQUIRED_FRONTMATTER)) {
    if (!new RegExp(`^${field}:`, 'm').test(source)) {
      failures.push(`${file}:1  [missing-frontmatter] "${field}" is not set, and it is ${why}`);
    }
  }
}

if (failures.length > 0) {
  console.error(`check-copy: ${failures.length} problem(s) in ${files.length} files\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  console.error('\nRules: docs/specs/0005-english-copy-consistency-pass.md');
  process.exit(1);
}

console.log(`check-copy: ${files.length} files clean`);
