import assert from "node:assert/strict";
import test from "node:test";

import {
  createPortfolioWebMcpTool,
  registerPortfolioWebMcp,
} from "../../js/portfolio-webmcp.js";

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

test("defines one bounded, read-only WebMCP portfolio tool", () => {
  const tool = createPortfolioWebMcpTool(async () => jsonResponse({}));

  assert.equal(tool.name, "ask_portfolio");
  assert.equal(tool.inputSchema.properties.query.minLength, 2);
  assert.equal(tool.inputSchema.properties.query.maxLength, 500);
  assert.deepEqual(tool.inputSchema.required, ["query"]);
  assert.equal(tool.inputSchema.additionalProperties, false);
  assert.deepEqual(tool.annotations, {
    readOnlyHint: true,
    untrustedContentHint: true,
    consequentialHint: false,
  });
});

test("returns the grounded answer and canonical sources", async () => {
  const controller = new AbortController();
  let request;
  const tool = createPortfolioWebMcpTool(async (url, init) => {
    request = { url, init };
    return jsonResponse({
      answer: "Published evidence supports the assessment.",
      sources: [{ title: "Agentic Readiness", url: "https://claudiaochoa.co/work/lovesac-case-study-5.html" }],
      disclosure: "Verify the cited work.",
    });
  });

  const result = await tool.execute({ query: "  responsible AI leadership  " }, { signal: controller.signal });

  assert.equal(request.url, "/api/portfolio-chat");
  assert.equal(request.init.method, "POST");
  assert.equal(request.init.signal, controller.signal);
  assert.deepEqual(JSON.parse(request.init.body), { query: "responsible AI leadership" });
  assert.equal(result.answer, "Published evidence supports the assessment.");
  assert.equal(result.sources[0].url, "https://claudiaochoa.co/work/lovesac-case-study-5.html");
  assert.equal(result.disclosure, "Verify the cited work.");
});

test("rejects invalid input before making a request", async () => {
  let calls = 0;
  const tool = createPortfolioWebMcpTool(async () => {
    calls += 1;
    return jsonResponse({});
  });

  await assert.rejects(() => tool.execute({ query: " " }), /between 2 and 500/);
  await assert.rejects(() => tool.execute({ query: "x".repeat(501) }), /between 2 and 500/);
  assert.equal(calls, 0);
});

test("registers only when the browser exposes WebMCP", async () => {
  let registeredTool;
  const supported = await registerPortfolioWebMcp({
    async registerTool(tool) {
      registeredTool = tool;
    },
  }, async () => jsonResponse({}));

  assert.equal(supported, true);
  assert.equal(registeredTool.name, "ask_portfolio");
  assert.equal(await registerPortfolioWebMcp(null, async () => jsonResponse({})), false);
});
