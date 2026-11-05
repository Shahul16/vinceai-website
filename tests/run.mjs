#!/usr/bin/env node
/**
 * Vince AI Ltd — build verification suite
 *
 * Zero dependencies, deterministic, runs in about a second. Every assertion
 * guards a defect that has actually reached production on this site before.
 *
 *   node tests/run.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, normalize, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = normalize(join(dirname(fileURLToPath(import.meta.url)), '..'));

/* ------------------------------------------------------------------ runner */
let passed = 0;
const failures = [];
let suite = '';

const describe = (name, fn) => { suite = name; console.log(`\n  ${name}`); fn(); };
const it = (name, fn) => {
  try { fn(); passed++; console.log(`    \x1b[32m✓\x1b[0m ${name}`); }
  catch (err) {
    failures.push({ suite, name, message: err.message });
    console.log(`    \x1b[31m✗\x1b[0m ${name}\n        ${err.message}`);
  }
};
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };
const equal = (a, b, msg) => assert(a === b, `${msg} — expected ${b}, got ${a}`);

/* ----------------------------------------------------------------- fixture */
const walk = (dir, acc = []) => {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('.') || entry === 'node_modules') continue;
    const full = join(dir, entry);
    statSync(full).isDirectory() ? walk(full, acc) : acc.push(full);
  }
  return acc;
};

const allFiles = walk(ROOT);
const rel = (f) => relative(ROOT, f).split('\\').join('/');
const fileSet = new Set(allFiles.map(rel));
const htmlFiles = allFiles.filter((f) => f.endsWith('.html'));
const pages = htmlFiles.map((f) => ({ path: rel(f), src: readFileSync(f, 'utf8') }));

const VOID = new Set(['area','base','br','col','embed','hr','img','input',
                      'link','meta','param','source','track','wbr']);

assert(pages.length > 0, 'no HTML pages found');

/* ------------------------------------------------------------------ tests */

describe('HTML structure', () => {
  for (const { path, src } of pages) {
    it(`${path} — tags balance`, () => {
      const stack = [];
      const re = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?(\/?)>/g;
      let m;
      while ((m = re.exec(src))) {
        const [, closing, tag, selfClose] = m;
        const name = tag.toLowerCase();
        if (VOID.has(name) || selfClose) continue;
        if (closing) {
          const open = stack.pop();
          assert(open === name, `</${name}> closes <${open}>`);
        } else stack.push(name);
      }
      equal(stack.length, 0, `unclosed tags: ${stack.join(', ')}`);
    });
  }
});

describe('Document head', () => {
  const required = [
    [/<!DOCTYPE html>/i, 'doctype'],
    [/<html lang="en-GB"/, 'lang="en-GB"'],
    [/<meta charset="utf-8">/i, 'charset'],
    [/name="viewport"/, 'viewport'],
    [/<title>[^<]{10,}<\/title>/, 'non-empty title'],
    [/rel="canonical"/, 'canonical'],
    [/property="og:image"/, 'og:image'],
    [/name="twitter:card" content="summary_large_image"/, 'large twitter card'],
  ];
  for (const { path, src } of pages) {
    it(`${path} — has required meta`, () => {
      for (const [re, label] of required) assert(re.test(src), `missing ${label}`);
    });
  }
});

describe('SEO', () => {
  for (const { path, src } of pages) {
    it(`${path} — description is 70-165 chars`, () => {
      const m = src.match(/name="description" content="([^"]+)"/);
      assert(m, 'no meta description');
      const n = m[1].length;
      assert(n >= 70 && n <= 165, `description is ${n} chars`);
    });
  }

  it('every description is unique', () => {
    const seen = new Map();
    for (const { path, src } of pages) {
      const d = src.match(/name="description" content="([^"]+)"/)[1];
      assert(!seen.has(d), `duplicate description on ${path} and ${seen.get(d)}`);
      seen.set(d, path);
    }
  });

  it('canonical host matches the served host', () => {
    for (const { path, src } of pages) {
      const href = src.match(/rel="canonical" href="([^"]+)"/)[1];
      assert(href.startsWith('https://vinceai.co.uk/'),
        `${path} canonical is ${href} (must be apex, not www)`);
    }
  });
});

describe('Accessibility', () => {
  for (const { path, src } of pages) {
    it(`${path} — exactly one <h1>`, () => {
      equal((src.match(/<h1[\s>]/g) || []).length, 1, 'h1 count');
    });

    it(`${path} — every image has alt`, () => {
      for (const tag of src.match(/<img\b[^>]*>/g) || [])
        assert(/\salt=/.test(tag), `img without alt: ${tag.slice(0, 60)}`);
    });

    it(`${path} — heading levels never skip`, () => {
      const levels = [...src.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
      for (let i = 1; i < levels.length; i++)
        assert(levels[i] - levels[i - 1] <= 1,
          `h${levels[i - 1]} jumps to h${levels[i]}`);
    });

    it(`${path} — has a skip link`, () => {
      assert(/class="skip-link"/.test(src), 'no skip link');
    });
  }
});

describe('Links', () => {
  for (const { path, src } of pages) {
    const base = dirname(path) === '.' ? '' : dirname(path);

    it(`${path} — no dead href="#"`, () => {
      assert(!/href="#"/.test(src), 'found href="#" — use a <button> for controls');
    });

    it(`${path} — every local target resolves`, () => {
      for (const [, href] of src.matchAll(/(?:href|src)="([^"]+)"/g)) {
        if (/^(https?:|mailto:|tel:|#|data:)/.test(href)) continue;
        const target = href.split('#')[0].split('?')[0];
        if (!target) continue;
        const resolved = normalize(join(target.startsWith('/') ? '' : base,
                                        target.replace(/^\//, ''))).split('\\').join('/');
        assert(fileSet.has(resolved), `broken: ${href}`);
      }
    });

    it(`${path} — every anchor target exists`, () => {
      for (const [, href] of src.matchAll(/href="([^"]*#[^"]+)"/g)) {
        const [file, frag] = href.split('#');
        const targetPath = file
          ? normalize(join(base, file)).split('\\').join('/')
          : path;
        if (!targetPath.endsWith('.html') || !fileSet.has(targetPath)) continue;
        const doc = pages.find((p) => p.path === targetPath).src;
        assert(doc.includes(`id="${frag}"`), `#${frag} not found in ${targetPath}`);
      }
    });
  }
});

describe('Privacy and consent', () => {
  const js = readFileSync(join(ROOT, 'assets/js/main.js'), 'utf8');

  it('no analytics tag is hardcoded into any page', () => {
    for (const { path, src } of pages)
      assert(!/googletagmanager|google-analytics|gtag\(/.test(src),
        `${path} loads analytics directly — it would fire before consent`);
  });

  it('analytics only loads after consent is granted', () => {
    assert(/choice === 'granted'/.test(js), 'no granted-choice gate found');
    assert(/function loadAnalytics/.test(js), 'no loadAnalytics function');
  });

  it('the consent control is a button, not a link', () => {
    for (const { path, src } of pages)
      assert(!/<a[^>]*data-consent/.test(src), `${path} uses <a> for a consent control`);
  });

  it('the consent checkbox links to a real privacy policy', () => {
    const contact = pages.find((p) => p.path === 'contact.html').src;
    const consent = contact.match(/<div class="consent">[\s\S]*?<\/div>/)[0];
    assert(/href="privacy-policy\.html"/.test(consent),
      'privacy policy link inside the consent block is missing or dead');
  });
});

describe('Content integrity', () => {
  it('no internal setup notes are published', () => {
    const leaks = [/formsubmit/i, /activation link/i, /lorem ipsum/i,
                   /\bTODO\b/, /\bFIXME\b/, /XXX/];
    for (const { path, src } of pages)
      for (const re of leaks)
        assert(!re.test(src), `${path} contains ${re}`);
  });

  it('no placeholder or template markers survive', () => {
    for (const { path, src } of pages) {
      assert(!/\{\{|\}\}/.test(src), `${path} has an unrendered template marker`);
      assert(!/Your Name|Full Name, Company|example\.com/.test(src),
        `${path} has placeholder copy`);
    }
  });

  it('one call to action is used verbatim site-wide', () => {
    const variants = ['Discuss this service', 'Ask us a question', 'Learn more about us'];
    for (const { path, src } of pages)
      for (const v of variants)
        assert(!src.includes(`>${v}<`), `${path} uses a competing CTA: "${v}"`);
  });

  it('the registered company number is correct everywhere it appears', () => {
    for (const { path, src } of pages) {
      const hits = [...src.matchAll(/Company No\.?\s*([0-9]+)/gi)];
      for (const [, num] of hits)
        equal(num, '17307271', `${path} shows a wrong company number`);
    }
  });
});

describe('StoryBrand — grunt test', () => {
  const home = pages.find((p) => p.path === 'index.html').src;
  const strip = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  it('the h1 states an offer, not a slogan', () => {
    const h1 = strip(home.match(/<h1>([\s\S]*?)<\/h1>/)[1]);
    assert(h1.length > 12 && h1.length < 90, `h1 is ${h1.length} chars`);
    assert(!/^Technology and AI, built around your business/.test(h1),
      'h1 is the tagline — it must state what you do');
  });

  it('a direct call to action appears above the fold', () => {
    const hero = home.match(/<section class="hero">[\s\S]*?<\/section>/)[0];
    assert(/href="contact\.html"/.test(hero), 'no contact CTA in the hero');
  });

  it('the plan has three or four steps', () => {
    const steps = (home.match(/class="plan__step"/g) || []).length;
    assert(steps >= 3 && steps <= 4, `plan has ${steps} steps`);
  });

  it('stakes are stated', () => {
    assert(/class="stakes"/.test(home), 'no stakes section');
  });

  it('a transitional call to action exists', () => {
    assert(/class="capture[" ]/.test(home), 'no lead capture — visitors can only enquire or leave');
  });

  it('the homepage stays scannable', () => {
    const main = home.match(/<main[\s\S]*?<\/main>/)[0];
    const words = strip(main).split(' ').filter((w) => /[a-z]/i.test(w)).length;
    // The approved two-person delivery profiles and fit section add substantive homepage copy.
    assert(words < 875, `homepage <main> has ${words} words`);
  });
});

describe('Performance budget', () => {
  const budget = { 'assets/css/style.css': 40, 'assets/js/main.js': 20 };
  for (const [file, kb] of Object.entries(budget)) {
    it(`${file} stays under ${kb} KB`, () => {
      const actual = statSync(join(ROOT, file)).size / 1024;
      assert(actual < kb, `${actual.toFixed(1)} KB exceeds ${kb} KB`);
    });
  }

  it('no single shipped image exceeds 400 KB', () => {
    for (const f of allFiles.filter((f) => /assets\/img\/.*\.(png|jpe?g)$/.test(rel(f)))) {
      const kb = statSync(f).size / 1024;
      assert(kb < 400, `${rel(f)} is ${kb.toFixed(0)} KB`);
    }
  });

  it('total site payload stays under 2 MB', () => {
    const bytes = allFiles
      .filter((f) => !rel(f).startsWith('brand/') && !rel(f).startsWith('tests/'))
      .reduce((sum, f) => sum + statSync(f).size, 0);
    const mb = bytes / 1024 / 1024;
    assert(mb < 2, `payload is ${mb.toFixed(2)} MB`);
  });
});

describe('Config files', () => {
  it('sitemap.xml is well-formed and lists only real pages', () => {
    const xml = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8');
    const locs = [...xml.matchAll(/<loc>https:\/\/vinceai\.co\.uk\/([^<]*)<\/loc>/g)]
      .map((m) => m[1] || 'index.html');
    assert(locs.length > 0, 'no URLs in sitemap');
    for (const loc of locs) assert(fileSet.has(loc), `sitemap lists missing page: ${loc}`);
  });

  it('every indexable page is in the sitemap', () => {
    const xml = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8');
    for (const { path, src } of pages) {
      if (/name="robots" content="noindex/.test(src)) continue;
      const slug = path === 'index.html' ? '' : path;
      assert(xml.includes(`vinceai.co.uk/${slug}<`), `${path} missing from sitemap`);
    }
  });

  it('site.webmanifest is valid JSON', () => {
    JSON.parse(readFileSync(join(ROOT, 'site.webmanifest'), 'utf8'));
  });

  it('the homepage JSON-LD is valid', () => {
    const home = pages.find((p) => p.path === 'index.html').src;
    const m = home.match(/application\/ld\+json">([\s\S]*?)<\/script>/);
    assert(m, 'no JSON-LD on the homepage');
    const data = JSON.parse(m[1]);
    equal(data.identifier, '17307271', 'JSON-LD company number');
  });

  it('robots.txt points at the sitemap', () => {
    const robots = readFileSync(join(ROOT, 'robots.txt'), 'utf8');
    assert(/Sitemap:\s*https:\/\/vinceai\.co\.uk\/sitemap\.xml/.test(robots),
      'robots.txt sitemap line is missing or wrong');
  });
});

describe('Prose quality', () => {
  // Patterns from Wikipedia:Signs of AI writing (WP:AITELLS). The copy on this
  // site was drafted with AI assistance, so these guard against the house style
  // of a language model creeping back in on the next edit.
  const visible = (src) => src
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&mdash;/g, '—').replace(/&rsquo;/g, '’')
    .replace(/&ldquo;|&rdquo;/g, '“').replace(/&amp;/g, '&')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ');

  const VOCAB = ['delve','delves','underscore','underscores','tapestry','testament',
    'pivotal','meticulous','meticulously','intricate','intricacies','vibrant','boasts',
    'showcase','showcases','showcasing','seamless','seamlessly','leverage','leveraging',
    'unlock','empower','empowering','cutting-edge','state-of-the-art','world-class',
    'best-in-class','holistic','synergy','ever-evolving','fast-paced','robust',
    'bolstered','garner','garnered','interplay','crucial','enduring'];

  const PHRASES = [
    [/\bnot just\b[^.]{0,80}\bbut\b/i, 'negative parallelism ("not just X but Y")'],
    [/\bnot only\b[^.]{0,80}\bbut\b/i, 'negative parallelism ("not only X but Y")'],
    [/\bit'?s not\b[^.]{0,60}\bit'?s\b/i, 'negative parallelism ("it’s not X, it’s Y")'],
    [/\bit'?s (important|worth|crucial) to (note|remember)\b/i, 'didactic disclaimer'],
    [/\bplays? an? (key|crucial|vital|pivotal) role\b/i, 'significance puffery'],
    [/\bdespite (its|these|the)[^.]{0,60}challenges\b/i, '"despite challenges" formula'],
    [/\b(in conclusion|in summary)\b/i, 'section summary'],
    [/\bexperts? (argue|say|note|agree)\b|\bindustry reports\b/i, 'vague attribution'],
    [/\bcommitment to excellence\b|\bnestled\b|\bin the heart of\b/i, 'promotional filler'],
    [/\bas an AI\b|\bknowledge cutoff\b|\bI hope this helps\b/i, 'chatbot output leaked'],
  ];

  for (const { path, src } of pages) {
    const text = visible(src);

    it(`${path} — no AI-vocabulary words`, () => {
      const found = VOCAB.filter((w) => new RegExp(`\\b${w}\\b`, 'i').test(text));
      assert(found.length === 0, `found: ${found.join(', ')}`);
    });

    it(`${path} — no flagged constructions`, () => {
      for (const [re, label] of PHRASES) {
        const m = text.match(re);
        assert(!m, `${label} — "${m ? m[0] : ''}"`);
      }
    });

    it(`${path} — no spaced em dashes`, () => {
      const n = (text.match(/ — /g) || []).length;
      assert(n === 0, `${n} spaced em dash(es); use a comma, colon, or full stop`);
    });

    it(`${path} — typography is consistent`, () => {
      const straight = (text.match(/["']/g) || []).length;
      assert(straight === 0, `${straight} straight quote(s) among curly ones`);
    });
  }
});

/* ----------------------------------------------------------------- report */
console.log(`\n  ${passed} passed, ${failures.length} failed\n`);
if (failures.length) {
  console.log('  Failures:');
  for (const f of failures) console.log(`    ${f.suite} › ${f.name}\n      ${f.message}`);
  process.exit(1);
}
