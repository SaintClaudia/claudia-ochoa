import test from "node:test";
import assert from "node:assert/strict";
import { handlePortfolioChat } from "../src/portfolio-chat.js";

function request(body, headers = {}) {
  return new Request("https://claudiaochoa.co/api/portfolio-chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://claudiaochoa.co",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

test("returns an AI answer with deterministic portfolio citations", async () => {
  let modelRequest;
  const env = {
    AI: {
      run: async (_model, request) => {
        modelRequest = request;
        return { response: "Claudia leads AI by grounding decisions in human needs and accountable delivery." };
      },
    },
  };
  const response = await handlePortfolioChat(request({ query: "How does Claudia lead AI?" }), env);
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.match(payload.answer, /grounding decisions/);
  assert.ok(payload.sources.length > 0);
  assert.ok(payload.sources.every((source) => source.url.startsWith("https://claudiaochoa.co/")));
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.match(modelRequest.messages[0].content, /give the evidence-based assessment first/);
  assert.match(modelRequest.messages[0].content, /never present an inference as a verified fact/);
});

test("rejects cross-origin browser requests", async () => {
  const response = await handlePortfolioChat(
    request({ query: "Tell me about the work" }, { Origin: "https://example.com" }),
    {},
  );
  assert.equal(response.status, 403);
});

test("falls back to cited retrieval if the model is unavailable", async () => {
  const originalConsoleError = console.error;
  console.error = () => {};
  const response = await handlePortfolioChat(request({ query: "agentic evaluation" }), {
    AI: { run: async () => { throw new Error("transient"); } },
  }).finally(() => {
    console.error = originalConsoleError;
  });
  const payload = await response.json();
  assert.equal(response.status, 200);
  assert.match(payload.answer, /AI-readiness/);
  assert.equal(payload.sources[0].id, "agentic-readiness");
});

test("retries malformed model output before returning it to an employer", async () => {
  let calls = 0;
  const response = await handlePortfolioChat(request({ query: "Can Claudia move quickly?" }), {
    AI: {
      run: async () => {
        calls += 1;
        return calls === 1
          ? { response: "\" (s, \" (s, \" (s" }
          : { response: "Claudia's Walmart work suggests she can move quickly: she developed the end-to-end GenAI experience concept in 24 hours." };
      },
    },
  });
  const payload = await response.json();
  assert.equal(calls, 2);
  assert.match(payload.answer, /24 hours/);
  assert.doesNotMatch(payload.answer, /\" \(s/);
});
