const baseUrl = (process.env.PORTFOLIO_EVAL_BASE_URL || "https://claudiaochoa.co").replace(/\/$/, "");
const expectedTools = [
  "get_portfolio_resource",
  "list_portfolio_resources",
  "search_portfolio",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function request(path, init = {}) {
  const response = await fetch(baseUrl + path, {
    ...init,
    signal: AbortSignal.timeout(30_000),
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`);
  return { response, body };
}

function parseMcpBody(body) {
  const dataLine = body.split(/\r?\n/).find((line) => line.startsWith("data:"));
  const serialized = dataLine ? dataLine.slice(5).trim() : body.trim();
  if (!serialized) throw new Error("MCP response did not contain a JSON-RPC message");
  return JSON.parse(serialized);
}

let requestId = 0;
async function mcp(method, params = {}) {
  requestId += 1;
  const { body } = await request("/mcp", {
    method: "POST",
    headers: {
      Accept: "application/json, text/event-stream",
      "Content-Type": "application/json",
      "MCP-Protocol-Version": "2025-06-18",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: requestId, method, params }),
  });
  const message = parseMcpBody(body);
  if (message.error) throw new Error(message.error.message || `MCP ${method} failed`);
  return message.result;
}

const checks = [
  {
    name: "Agent discovery guide",
    run: async () => {
      const { response, body } = await request("/llms.txt");
      assert(response.headers.get("content-type")?.includes("text/plain"), "llms.txt is not plain text");
      assert(/^# Claudia Ochoa/m.test(body), "llms.txt is missing its H1");
      assert(body.includes("[the public portfolio MCP endpoint](https://claudiaochoa.co/mcp)"), "MCP endpoint is not discoverable");
      assert(body.includes("https://claudiaochoa.co/work/walmart-genai.html"), "AI leadership source is missing");
    },
  },
  {
    name: "HTML advertises agent representations",
    run: async () => {
      const { response } = await request("/");
      const links = response.headers.get("link") || "";
      const signal = response.headers.get("content-signal") || "";
      assert(links.includes('rel="alternate"') && links.includes('type="text/markdown"'), "Markdown alternate is not advertised");
      assert(links.includes('rel="describedby"') && links.includes("/llms.txt"), "llms.txt is not advertised");
      assert(signal.includes("ai-train=no") && signal.includes("search=yes") && signal.includes("ai-input=yes"), "Content-Signal policy is incomplete");
    },
  },
  {
    name: "Homepage delivers the same-origin WebMCP pilot",
    run: async () => {
      const { response, body } = await request("/");
      const policy = response.headers.get("permissions-policy") || "";
      assert(policy.includes("tools=(self)"), "WebMCP is not restricted to the same origin");
      assert(body.includes('src="js/portfolio-webmcp.js?v=1"'), "homepage is missing the WebMCP module");

      const { body: module } = await request("/js/portfolio-webmcp.js?v=1");
      assert(module.includes("document.modelContext"), "WebMCP feature detection is missing");
      assert(module.includes("name: 'ask_portfolio'"), "ask_portfolio tool is missing");
      assert(module.includes("readOnlyHint: true"), "WebMCP tool is not marked read-only");
    },
  },
  {
    name: "Negotiated Markdown preserves evidence",
    run: async () => {
      const { response, body } = await request("/work/walmart-genai.html", {
        headers: { Accept: "text/markdown" },
      });
      assert(response.headers.get("content-type")?.includes("text/markdown"), "server did not return Markdown");
      assert(body.includes('url: "https://claudiaochoa.co/work/walmart-genai.html"'), "canonical URL is missing");
      assert(body.includes("24 hours") || body.includes("24-hour"), "key evidence was lost in conversion");
      assert(!body.includes("<script"), "browser script leaked into Markdown");
    },
  },
  {
    name: "MCP initializes with the advertised protocol",
    run: async () => {
      const result = await mcp("initialize", {
        protocolVersion: "2025-06-18",
        capabilities: {},
        clientInfo: { name: "portfolio-readiness-eval", version: "1.0.0" },
      });
      assert(result.protocolVersion === "2025-06-18", "unexpected MCP protocol version");
      assert(result.serverInfo?.name === "claudia-ochoa-portfolio", "unexpected MCP server identity");
      assert(result.capabilities?.tools, "MCP server did not advertise tools");
    },
  },
  {
    name: "MCP tools are discoverable and read-only",
    run: async () => {
      const result = await mcp("tools/list");
      const tools = result.tools || [];
      assert(JSON.stringify(tools.map((tool) => tool.name).sort()) === JSON.stringify(expectedTools), "tool inventory changed unexpectedly");
      assert(tools.every((tool) => tool.annotations?.readOnlyHint === true), "a tool is not marked read-only");
      assert(tools.every((tool) => tool.annotations?.destructiveHint === false), "a tool is marked destructive");
      assert(tools.every((tool) => tool.inputSchema?.type === "object"), "a tool is missing its input schema");
    },
  },
  {
    name: "Agent finds responsible-AI evidence",
    run: async () => {
      const result = await mcp("tools/call", {
        name: "search_portfolio",
        arguments: { query: "What evidence shows Claudia can lead responsible AI work?", limit: 3 },
      });
      const resources = result.structuredContent?.results || [];
      assert(resources[0]?.id === "agentic-readiness", "agentic-readiness was not the strongest result");
      assert(resources.every((resource) => resource.url.startsWith("https://claudiaochoa.co/")), "search returned a non-canonical source");
      assert(/guardrail|human escalation|rollback/i.test(resources[0]?.details || ""), "responsible-AI evidence is incomplete");
    },
  },
  {
    name: "Agent preserves the concept boundary",
    run: async () => {
      const result = await mcp("tools/call", {
        name: "get_portfolio_resource",
        arguments: { id: "lovesac-business-case" },
      });
      const resource = result.structuredContent || {};
      assert(resource.url === "https://claudiaochoa.co/work/lovesac-case-study-6.html", "business-case citation is incorrect");
      assert(/concept/i.test(resource.details || ""), "concept status is missing");
      assert(/directional rather than measured/i.test(resource.details || ""), "measurement boundary is missing");
    },
  },
  {
    name: "MCP exposes only public canonical resources",
    run: async () => {
      const result = await mcp("tools/call", {
        name: "list_portfolio_resources",
        arguments: {},
      });
      const resources = result.structuredContent?.resources || [];
      assert(resources.length >= 8, "resource inventory is unexpectedly small");
      assert(resources.every((resource) => resource.url.startsWith("https://claudiaochoa.co/")), "resource inventory contains a non-canonical URL");
      assert(!resources.some((resource) => /private|confidential/i.test(resource.id)), "resource inventory exposes a private identifier");
    },
  },
  {
    name: "MCP rejects unknown resources safely",
    run: async () => {
      const result = await mcp("tools/call", {
        name: "get_portfolio_resource",
        arguments: { id: "private-record" },
      });
      assert(result.isError === true, "unknown resource did not return a tool error");
      assert(/Unknown portfolio resource/.test(result.content?.[0]?.text || ""), "unknown-resource error is not actionable");
    },
  },
  {
    name: "MCP citations resolve as agent-readable Markdown",
    run: async () => {
      const result = await mcp("tools/call", {
        name: "search_portfolio",
        arguments: { query: "enterprise GenAI leadership and executive influence", limit: 2 },
      });
      const resources = result.structuredContent?.results || [];
      assert(resources.length > 0, "MCP search returned no citations");
      for (const resource of resources) {
        const url = new URL(resource.url);
        const { response, body } = await request(url.pathname, { headers: { Accept: "text/markdown" } });
        assert(response.headers.get("content-type")?.includes("text/markdown"), `${resource.id} did not negotiate Markdown`);
        assert(body.includes(`url: "${resource.url}"`), `${resource.id} Markdown lost its canonical URL`);
      }
    },
  },
];

const results = [];
for (const check of checks) {
  try {
    await check.run();
    results.push({ name: check.name, passed: true });
    console.log(`PASS  ${check.name}`);
  } catch (error) {
    results.push({ name: check.name, passed: false, error: error.message });
    console.log(`FAIL  ${check.name}`);
    console.log(`      - ${error.message}`);
  }
}

const failures = results.filter((result) => !result.passed);
console.log(`\n${results.length - failures.length}/${results.length} end-to-end readiness checks passed.`);
if (failures.length) process.exitCode = 1;
