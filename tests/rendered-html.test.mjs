import assert from "node:assert/strict";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("renders development preview metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.match(await response.text(), developmentPreviewMeta);
});

test("defers Figma embeds and preserves two-column case metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `case-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/cases/email-builder-settings", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /class="case-meta-columns"/);
  assert.equal(html.match(/class="case-meta-stack"/g)?.length, 2);
  assert.equal(html.match(/class="case-meta-item"/g)?.length, 5);
  assert.match(html, /Показать макеты из Figma/);
  assert.doesNotMatch(html, /<iframe\b/i);
  assert.doesNotMatch(html, /Систематизация типовых элементов и настроек/);
  assert.match(html, /class="case-lede"/);
  assert.match(html, /notion-semantic-callout__heading">Проблема<\/h4>/);
  assert.match(html, /notion-semantic-callout__heading">Что изменилось<\/h4>/);
  assert.doesNotMatch(html, /✦/);
  assert.doesNotMatch(html, /Главный вывод\s*:/i);
  assert.match(html, /\/media\/settings-system\.png/);
  assert.match(html, /\/media\/settings-visual-noise\.png/);
  assert.match(html, /\/media\/settings-button-sizes\.png/);
  assert.match(html, /\/media\/settings-nested-elements\.png/);
  assert.match(html, /\/media\/settings-validation\.png/);
  assert.equal(
    html.match(/class="notion-figure notion-figure--wide"/g)?.length,
    2,
  );
  assert.match(
    html,
    /class="notion-figure notion-figure--wide"[\s\S]{0,300}settings-system\.png/,
  );
  assert.match(
    html,
    /class="notion-figure notion-figure--wide"[\s\S]{0,300}settings-validation\.png/,
  );
  assert.doesNotMatch(
    html,
    /class="notion-figure notion-figure--wide"[\s\S]{0,300}settings-button-sizes\.png/,
  );
  assert.doesNotMatch(
    html,
    /\/486673bd-5d08-4f52-8638-4140e80709b9\/image\.png/,
  );
});
