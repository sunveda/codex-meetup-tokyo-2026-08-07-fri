import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the bilingual Codex Meetup companion site", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Codexはエンジニアだけのものじゃない/);
  assert.match(html, /SunVeda Technologies/);
  assert.match(html, /LINE OPENCHAT|LINE OpenChat/);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview/);
});

test("ships the presentation visuals and current metadata", async () => {
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  assert.match(layout, /SunVeda Technologies/);
  assert.match(layout, /og\.png/);

  await Promise.all([
    access(new URL("../public/mercari-stage-augmented.png", import.meta.url)),
    access(new URL("../public/ai-genie-unlimited-wishes.png", import.meta.url)),
    access(new URL("../public/line-openchat-qr.jpeg", import.meta.url)),
    access(new URL("../public/og.png", import.meta.url)),
  ]);
  await assert.rejects(access(new URL("app/_sites-preview", root)));
});
