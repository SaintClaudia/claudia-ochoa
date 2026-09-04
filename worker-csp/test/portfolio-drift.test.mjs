import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PORTFOLIO_RESOURCES } from "../src/portfolio-knowledge.js";

const repositoryRoot = fileURLToPath(new URL("../../", import.meta.url));
const llmsGuide = readFileSync(new URL("../../llms.txt", import.meta.url), "utf8");
const sitemap = readFileSync(new URL("../../sitemap.xml", import.meta.url), "utf8");
const homepage = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
const worker = readFileSync(new URL("../src/index.js", import.meta.url), "utf8");

test("curated agent resources remain unique, public, and locally resolvable", () => {
  const ids = PORTFOLIO_RESOURCES.map((resource) => resource.id);
  assert.equal(new Set(ids).size, ids.length, "resource IDs must be unique");

  for (const resource of PORTFOLIO_RESOURCES) {
    const url = new URL(resource.url);
    assert.equal(url.origin, "https://claudiaochoa.co", `${resource.id} is not canonical`);
    assert.ok(resource.summary.length >= 40, `${resource.id} has an incomplete summary`);
    assert.ok(resource.details.length >= 80, `${resource.id} has incomplete evidence details`);

    const localPath = fileURLToPath(new URL(`../..${url.pathname}`, import.meta.url));
    assert.ok(localPath.startsWith(repositoryRoot), `${resource.id} resolves outside the repository`);
    assert.ok(existsSync(localPath), `${resource.id} points to a missing file: ${url.pathname}`);
  }
});

test("llms.txt lists every curated source", () => {
  for (const resource of PORTFOLIO_RESOURCES) {
    assert.ok(llmsGuide.includes(resource.url), `llms.txt is missing ${resource.id}`);
  }
});

test("sitemap lists every curated HTML source", () => {
  for (const resource of PORTFOLIO_RESOURCES.filter(({ url }) => url.endsWith(".html"))) {
    assert.ok(sitemap.includes(`<loc>${resource.url}</loc>`), `sitemap.xml is missing ${resource.id}`);
  }
});

test("agentic score copy uses the current three-check result", () => {
  const research = readFileSync(new URL("../../work/lovesac-case-study-3.html", import.meta.url), "utf8");
  const readiness = readFileSync(new URL("../../work/lovesac-case-study-5.html", import.meta.url), "utf8");
  assert.match(research, /redesign 3 of 3/i);
  assert.match(readiness, /3 of 3 checks passed/i);
  assert.doesNotMatch(`${research}\n${readiness}`, /redesign (?:already )?(?:scores|passes) 2(?:\/| of )2/i);
});

test("homepage WebMCP pilot remains progressive and same-origin", () => {
  assert.match(homepage, /<script type="module" src="js\/portfolio-webmcp\.js\?v=1"><\/script>/);
  assert.match(worker, /tools=\(self\)/);
  assert.doesNotMatch(worker, /tools=\(\*\)/);
});
