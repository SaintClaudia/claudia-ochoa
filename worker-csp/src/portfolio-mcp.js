import { McpServer } from "@modelcontextprotocol/server";
import { createMcpHandler } from "agents/mcp/server";
import { z } from "zod";
import {
  getPortfolioResource,
  listPortfolioResources,
  publicResource,
  searchPortfolio,
} from "./portfolio-knowledge.js";

const TOOL_ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

function asToolResult(value) {
  return {
    content: [{ type: "text", text: JSON.stringify(value, null, 2) }],
    structuredContent: value,
  };
}

function createPortfolioServer() {
  const server = new McpServer({
    name: "claudia-ochoa-portfolio",
    version: "1.0.0",
  });

  server.registerTool(
    "search_portfolio",
    {
      title: "Search Claudia Ochoa's portfolio",
      description:
        "Search Claudia Ochoa's public portfolio for evidence about AI leadership, product design, experience strategy, responsible AI, research, and career background. Returns only published, citable sources. Prefer this tool before making claims about her work.",
      inputSchema: {
        query: z.string().min(2).max(500).describe("The employer or agent's question or search terms."),
        limit: z.number().int().min(1).max(8).optional().describe("Maximum number of sources to return. Defaults to 4."),
      },
      annotations: TOOL_ANNOTATIONS,
    },
    async ({ query, limit }) =>
      asToolResult({
        query,
        results: searchPortfolio(query, limit).map((resource) => publicResource(resource, true)),
      }),
  );

  server.registerTool(
    "get_portfolio_resource",
    {
      title: "Get a portfolio source",
      description:
        "Retrieve one authoritative portfolio resource by its stable ID, including the source URL and published evidence summary. This is read-only and never returns private or unpublished material.",
      inputSchema: {
        id: z.string().min(1).max(80).describe("A resource ID returned by search_portfolio or list_portfolio_resources."),
      },
      annotations: TOOL_ANNOTATIONS,
    },
    async ({ id }) => {
      const resource = getPortfolioResource(id);
      return resource
        ? asToolResult(publicResource(resource, true))
        : { isError: true, content: [{ type: "text", text: `Unknown portfolio resource: ${id}` }] };
    },
  );

  server.registerTool(
    "list_portfolio_resources",
    {
      title: "List portfolio sources",
      description:
        "List Claudia Ochoa's public, citable portfolio sources. Optionally filter by category. Use the returned IDs with get_portfolio_resource.",
      inputSchema: {
        category: z
          .enum(["profile", "ai-leadership", "experience-strategy", "research", "content-strategy"])
          .optional()
          .describe("Optional portfolio category."),
      },
      annotations: TOOL_ANNOTATIONS,
    },
    async ({ category }) =>
      asToolResult({
        resources: listPortfolioResources(category).map((resource) => publicResource(resource)),
      }),
  );

  return server;
}

export const portfolioMcpHandler = createMcpHandler(createPortfolioServer, {
  route: "/mcp",
  allowedHostnames: ["claudiaochoa.co", "localhost", "127.0.0.1"],
  allowedOriginHostnames: "*",
  // Keep stateless compatibility for MCP clients that have not yet adopted
  // the 2026-07-28 per-request envelope.
  legacy: "stateless",
  responseMode: "json",
});
