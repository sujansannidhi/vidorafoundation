/**
 * Runs the pure Open Paths tests (pureTests_ in Tests.gs) in Node, without
 * Google services. Every .gs file is also syntax-checked.
 *
 *   node ops/open-paths/test/local.test.mjs
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const dir = fileURLToPath(new URL('..', import.meta.url));
const files = readdirSync(dir).filter((f) => f.endsWith('.gs'));
let failed = 0;

for (const f of files) {
  try { new vm.Script(readFileSync(dir + f, 'utf8'), { filename: f }); }
  catch (e) { failed++; console.log(`FAIL syntax ${f}: ${e.message}`); }
}

// Pure files only, in one shared context, as Apps Script loads them.
const context = vm.createContext({ console, Math, JSON, Date, Number, String });
const src = ['EventsData.gs', 'Ids.gs', 'Rules.gs', 'Tests.gs', 'Store.gs']
  .map((f) => readFileSync(dir + f, 'utf8')).join('\n;\n')
  + '\n;globalThis.__run = (assert) => pureTests_(assert);';
vm.runInContext(src, context, { filename: 'open-paths' });

const results = [];
context.__run((cond, label) => results.push(`${cond ? 'PASS' : 'FAIL'} ${label}`));
for (const r of results) console.log(r);
failed += results.filter((r) => r.startsWith('FAIL')).length;
console.log(failed ? `\n${failed} failed` : `\nall ${results.length} tests passed, ${files.length} files parsed`);
process.exit(failed ? 1 : 0);
