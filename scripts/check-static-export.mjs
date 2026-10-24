import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    assert(tag.includes('data-media-state="loading"'), 'Image is missing its initial skeleton: ' + tag);
    assert(/\bwidth="[1-9]\d*"/.test(tag) && /\bheight="[1-9]\d*"/.test(tag), 'Image dimensions must reserve space before loading: ' + tag);
  }
  for (const [tag] of html.matchAll(/<video\b[^>]*>/g)) {
    assert(tag.includes('preload="none"'), 'Video must retain lazy source loading');
    assert(!/\ssrc=/.test(tag), 'Video source must load only near the viewport');
    const poster = tag.match(/poster="([^"]+)"/)?.[1];
    assert(poster && html.includes(`src="${poster}"`), 'Video needs a skeleton-backed poster before its first frame');
  }
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
const personalization = readFileSync(join(output, 'cases/email-personalization.html'), 'utf8');
const settings = readFileSync(join(output, 'cases/email-builder-settings.html'), 'utf8');
assert(settings.includes('settings-islands__track'), 'Native islands animation is missing');
assert(!settings.includes('settings-islands-studio-web.mp4'), 'Obsolete video must not be loaded');
assert(!manifest.routes.some(item => /\/studies\//.test(item.path ?? item.route)), 'Archived experiments must not ship');
for (const name of ['amount', '0', '1', '2']) checkReference('/media/discount-system/dialog-' + name + '.png');
const columns = JSON.parse(readFileSync(join(root, 'app/island-columns.json'), 'utf8'));
let islandBytes = 0;
for (const column of columns) {
  const copies = [...settings.matchAll(/<img\b[^>]*>/g)].filter(([tag]) => tag.includes(`src="${column.src}"`));
  assert.equal(copies.length, 2, 'Each moving column needs identical copies for a seamless loop');
  islandBytes += statSync(join(output, column.src.slice(1))).size;
}
assert(islandBytes < 1024 * 1024, 'Native animation assets exceed the 1 MB budget');
assert.deepEqual([...missing], [], 'Missing dynamic media references');
for (const slug of ['email-builder-settings', 'email-personalization', 'image-gallery', 'campaigns-redesign', 'design-system']) {
  const html = readFileSync(join(output, 'cases/' + slug + '.html'), 'utf8');
  assert(html.includes('real-cover--' + slug), 'Real-layout cover missing: ' + slug);
  assert(html.includes('real-cover__detail'), 'Enlarged detail missing: ' + slug);
}
assert(personalization.includes('/media/covers/email-personalization-detail-'), 'Personalization detail is missing');
assert(personalization.includes('data-reading-mode="detailed"'), 'Detailed view must be the default');
console.log(`OK: ${manifest.routes.length} routes; local images, fonts, navigation payloads verified.`);
