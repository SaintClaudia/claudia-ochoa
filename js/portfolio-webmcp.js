const MIN_QUERY_LENGTH = 2;
const MAX_QUERY_LENGTH = 500;

function validateQuery(value) {
  const query = typeof value === 'string' ? value.trim() : '';
  if (query.length < MIN_QUERY_LENGTH || query.length > MAX_QUERY_LENGTH) {
    throw new TypeError(`query must be between ${MIN_QUERY_LENGTH} and ${MAX_QUERY_LENGTH} characters`);
  }
  return query;
}

export function createPortfolioWebMcpTool(fetchImpl = globalThis.fetch) {
  if (typeof fetchImpl !== 'function') throw new TypeError('fetch is required');

  return {
    name: 'ask_portfolio',
    title: 'Ask Claudia Ochoa\'s portfolio',
    description: 'Answer a question about Claudia Ochoa\'s AI, product-design, experience-strategy, or leadership work using only her published portfolio. Returns a concise answer with canonical source links.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          minLength: MIN_QUERY_LENGTH,
          maxLength: MAX_QUERY_LENGTH,
          description: 'A specific question about Claudia Ochoa\'s experience, work, leadership approach, or suitability for a role.',
        },
      },
      required: ['query'],
      additionalProperties: false,
    },
    annotations: {
      readOnlyHint: true,
      untrustedContentHint: true,
      consequentialHint: false,
    },
    async execute({ query } = {}, options = {}) {
      const response = await fetchImpl('/api/portfolio-chat', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: validateQuery(query) }),
        signal: options.signal,
      });
      const contentType = response.headers.get('content-type') || '';
      const result = contentType.includes('application/json') ? await response.json() : null;

      if (!response.ok || !result) {
        throw new Error(result?.error || 'The portfolio guide is temporarily unavailable.');
      }

      return {
        answer: result.answer,
        sources: Array.isArray(result.sources) ? result.sources : [],
        disclosure: result.disclosure || 'AI-generated from the published portfolio; verify details in the cited work.',
      };
    },
  };
}

export async function registerPortfolioWebMcp(modelContext, fetchImpl = globalThis.fetch) {
  if (!modelContext || typeof modelContext.registerTool !== 'function') return false;
  await modelContext.registerTool(createPortfolioWebMcpTool(fetchImpl));
  return true;
}

// Progressive enhancement: browsers without WebMCP never enter this branch.
// Registration is intentionally top-level-only and is not delegated to frames.
if (typeof document !== 'undefined' && document.modelContext) {
  registerPortfolioWebMcp(document.modelContext).catch((error) => {
    console.warn('Portfolio WebMCP tool registration failed.', error);
  });
}
