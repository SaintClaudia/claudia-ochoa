import test from "node:test";
import assert from "node:assert/strict";
import {
  getPortfolioResource,
  listPortfolioResources,
  searchPortfolio,
} from "../src/portfolio-knowledge.js";

test("prioritizes the Walmart evidence for enterprise GenAI leadership", () => {
  const [result] = searchPortfolio("enterprise GenAI leadership and Creative Director");
  assert.equal(result.id, "walmart-genai");
  assert.match(result.url, /^https:\/\/claudiaochoa\.co\//);
});

test("prioritizes the operating-model evidence for agentic guardrails", () => {
  const [result] = searchPortfolio("agentic guardrails evaluation and human escalation");
  assert.equal(result.id, "agentic-readiness");
});

test("maps employer language to the strongest published evidence", () => {
  assert.equal(searchPortfolio("How does Claudia lead responsible AI work?")[0].id, "agentic-readiness");
  const executiveResults = searchPortfolio("What evidence shows executive influence?");
  assert.equal(executiveResults[0].id, "walmart-genai");
  assert.deepEqual(executiveResults.map((result) => result.id), ["walmart-genai"]);
  assert.equal(searchPortfolio("How does she connect AI to business value?")[0].id, "lovesac-business-case");
});

test("lists and retrieves only the curated public resources", () => {
  const aiResources = listPortfolioResources("ai-leadership");
  assert.ok(aiResources.length >= 2);
  assert.ok(aiResources.every((resource) => resource.category === "ai-leadership"));
  assert.equal(getPortfolioResource("resume")?.category, "profile");
  assert.equal(getPortfolioResource("private-record"), null);
});
