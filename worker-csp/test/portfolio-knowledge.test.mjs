import test from "node:test";
import assert from "node:assert/strict";
import { getPortfolioResource, listPortfolioResources, searchPortfolio } from "../src/portfolio-knowledge.js";

test("finds each current project by its subject", () => {
  assert.equal(searchPortfolio("independent music radio labels")[0].id, "nebulae");
});

test("archived work is excluded from agent discovery and direct retrieval", () => {
  const current = new Set(["profile", "resume", "nebulae"]);
  assert.deepEqual(new Set(listPortfolioResources().map(({id}) => id)), current);
  for (const id of ["ask-read", "chasing-birdies", "walmart-genai", "agentic-readiness", "lovesac-business-case", "lovesac-redesign", "lovesac-research", "lovesac-content"]) {
    assert.equal(getPortfolioResource(id), null);
  }
  assert.ok(searchPortfolio("Walmart Lovesac Home Depot").every(({id}) => current.has(id)));
});

test("retrieves current evidence without implying concept launch outcomes", () => {
  assert.equal(getPortfolioResource("resume")?.category, "profile");
  assert.equal(getPortfolioResource("private-record"), null);
  assert.deepEqual(listPortfolioResources("ai-leadership").map(({id}) => id), []);
  for (const id of ["nebulae"]) assert.match(getPortfolioResource(id).details, /concept/);
});
