#!/usr/bin/env node
/*
 * Replaces {{TOKEN}} occurrences in the four HTML files with values from
 * placeholders.json. Refuses to run if any value is empty so you don't
 * accidentally publish a page with literal "{{COMPANY_NAME}}".
 *
 *   node scripts/fill-placeholders.js          # writes in place
 *   node scripts/fill-placeholders.js --check  # exit 0 if all tokens are filled, 1 otherwise
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const PAGES = ['index.html', 'privacy.html', 'terms.html', 'refund.html'];

function loadPlaceholders() {
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'placeholders.json'), 'utf8'));
  delete raw._comment;
  return raw;
}

function findUnresolved(text) {
  const matches = text.match(/\{\{[A-Z_]+\}\}/g);
  return matches ? [...new Set(matches)] : [];
}

function main() {
  const check = process.argv.includes('--check');
  const values = loadPlaceholders();

  const empties = Object.entries(values)
    .filter(([, v]) => !v || String(v).trim() === '')
    .map(([k]) => k);

  if (empties.length > 0) {
    console.error('Missing values in placeholders.json:');
    for (const k of empties) console.error('  - ' + k);
    console.error('Fill these in and re-run.');
    process.exit(1);
  }

  let anyChanged = false;
  for (const page of PAGES) {
    const filePath = path.join(ROOT, page);
    const before = fs.readFileSync(filePath, 'utf8');
    let after = before;
    for (const [token, value] of Object.entries(values)) {
      after = after.split('{{' + token + '}}').join(String(value));
    }
    const leftover = findUnresolved(after);
    if (leftover.length > 0) {
      console.error('Unresolved tokens still present in ' + page + ': ' + leftover.join(', '));
      process.exit(1);
    }
    if (after !== before) {
      if (!check) fs.writeFileSync(filePath, after, 'utf8');
      console.log((check ? '[check] would update ' : '[write] ') + page);
      anyChanged = true;
    } else {
      console.log('[skip ] ' + page + ' (unchanged)');
    }
  }

  if (check && anyChanged) process.exit(1);
  console.log('Done.');
}

main();
