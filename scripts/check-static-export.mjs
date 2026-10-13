import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'dist/client');
const walk = dir => readdirSync(dir).flatMap(name => {
  const file = join(dir, name);
  return statSync(file).isDirectory() ? walk(file) : [file];
});
const files = walk(output);
const manifest = JSON.parse(readFileSync(join(root, 'dist/server/vinext-prerender.json'), 'utf8'));
assert(manifest.routes.every(route => route.status === 'rendered'), 'Some routes did not render');
for (const item of manifest.routes) {
  const route = item.path ?? item.route;
  const name = route === '/' ? 'index' : route.slice(1);
  assert(existsSync(join(output, name + '.html')), 'Missing HTML: ' + route);
  if (route !== '/404') assert(existsSync(join(output, name + '.rsc')), 'Missing navigation payload: ' + route);
}
const missing = new Set();
function checkReference(ref) {
  if (!ref.startsWith('/') || ref.startsWith('//')) return;
  const path = decodeURIComponent(new URL(ref.replaceAll('&amp;', '&'), 'https://example.test').pathname).slice(1);
  if (!path) return;
  const candidates = [path, path + '.html', path + '/index.html'];
  if (!candidates.some(name => existsSync(join(output, name)) && statSync(join(output, name)).isFile())) missing.add(path);
}
for (const file of files.filter(file => file.endsWith('.html'))) {
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(/\b(?:src|href|poster)="([^"]+)"/g)) checkReference(match[1]);
  for (const match of html.matchAll(/\bsrcSet="([^"]+)"/gi)) {
    for (const entry of match[1].split(',')) checkReference(entry.trim().split(/\s+/)[0]);
  }
}
for (const file of files.filter(file => file.endsWith('.css'))) {
  for (const match of readFileSync(file, 'utf8').matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
    if (match[1].startsWith('/')) checkReference(match[1]);
    else if (!match[1].startsWith('data:')) assert(existsSync(resolve(dirname(file), match[1])), 'Missing CSS asset: ' + match[1]);
  }
}
assert.deepEqual([...missing], [], 'Missing local references');
for (const item of JSON.parse(readFileSync(join(root, 'media-source/manifest.json'), 'utf8'))) {
  const relative = item.output.replace(/^public\//, '');
  const hash = createHash('sha256').update(readFileSync(join(output, relative))).digest('hex');
  assert.equal(hash, item.sha256, 'Media mismatch: ' + relative);
}
const personalization = readFileSync(join(output, 'cases/email-personalization.html'), 'utf8');
for (const slug of ['email-builder-settings', 'email-personalization', 'image-gallery', 'campaigns-redesign', 'design-system']) {
  const html = readFileSync(join(output, 'cases/' + slug + '.html'), 'utf8');
  assert(html.includes('real-cover--' + slug), 'Real-layout cover missing: ' + slug);
  assert(html.includes('real-cover__detail'), 'Enlarged detail missing: ' + slug);
}
assert(personalization.includes('/media/figma-shots/shot-03.webp'), 'Personalization detail is missing');
assert(personalization.includes('data-reading-mode="detailed"'), 'Detailed view must be the default');
console.log(`OK: ${manifest.routes.length} routes; local images, fonts, navigation payloads and restored media verified.`);
