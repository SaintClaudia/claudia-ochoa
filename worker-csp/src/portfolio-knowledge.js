const SITE_ORIGIN = "https://claudiaochoa.co";

export const PORTFOLIO_RESOURCES = [
  {
    id: "profile",
    category: "profile",
    title: "AI Experience & Product Design Leadership",
    url: `${SITE_ORIGIN}/about.html`,
    summary:
      "Claudia Ochoa is an AI experience and product design leader with more than 20 years of experience connecting emerging technology, business strategy, brand, and customer experience.",
    details:
      "Her leadership starts with the problem rather than the technology. She connects customer needs, business value, brand, and delivery so AI has a clear role, measurable purpose, and human experience around it. Her MBA from Purdue Global strengthens the business side of that work; JD studies at Purdue Global Law School are expanding the legal fluency she brings to emerging-technology decisions.",
    tags: ["AI leadership", "product design", "human-centered AI", "business strategy", "brand", "MBA", "legal fluency"],
  },
  {
    id: "walmart-genai",
    category: "ai-leadership",
    title: "Walmart GenAI Candidate Experience",
    url: `${SITE_ORIGIN}/work/walmart-genai.html`,
    summary:
      "A human-centered GenAI hiring experience designed end-to-end in 24 hours; the concept earned early leadership support and positioned Claudia as Creative Director for the initiative.",
    details:
      "The concept replaced a fragmented candidate journey with one conversational layer spanning application, scheduling, offer, and onboarding. Claudia framed AI as an orchestration and communication layer, not an opaque decision-maker. The work emphasized visible progress, plain language, designed human handoffs, privacy, accessibility, equity evaluation, and clear operating ownership. Details are generalized to honor the work's NDA. It was a concept that became a platform direction; a delivery partner integrated the direction into the broader hiring platform while Claudia held the experience vision through delivery.",
    tags: ["GenAI", "Walmart", "candidate experience", "Creative Director", "24 hours", "enterprise", "responsible AI", "delivery"],
  },
  {
    id: "agentic-readiness",
    category: "ai-leadership",
    title: "Agentic Readiness: Past the Score",
    url: `${SITE_ORIGIN}/work/lovesac-case-study-5.html`,
    summary:
      "An AI-readiness and development case study covering agentic task completion, evaluation, accessibility, security, guardrails, and human recovery beyond automated scores.",
    details:
      "The case argues that passing structural audits is only the floor. Agentic readiness requires testing real customer jobs, grounding answers in approved and current sources, bounded actions, privacy and security review, accessibility testing, clear uncertainty behavior, human escalation, ongoing evaluation, incident ownership, and rollback planning. It treats readiness as a cross-functional operating model across product, support, legal, security, accessibility, and data teams—not a badge.",
    tags: ["agentic AI", "evaluation", "guardrails", "grounding", "accessibility", "security", "human escalation", "operating model"],
  },
  {
    id: "lovesac-business-case",
    category: "experience-strategy",
    title: "Lovesac Redesign: The Business Case",
    url: `${SITE_ORIGIN}/work/lovesac-case-study-6.html`,
    summary:
      "A conceptual customer-experience redesign connecting research, product clarity, purchase confidence, accessibility, service recovery, and measurable business value.",
    details:
      "This is a concept redesign, not a live deployment, and projected outcomes are explicitly identified as directional rather than measured. The strategy simplifies discovery, makes a configurable product easier to understand, answers fit and post-purchase questions earlier, and makes accessibility foundational. The business case connects those decisions to conversion, margin protection, cost to serve, retention, and new growth channels, with a measurement plan for validation.",
    tags: ["experience strategy", "business value", "ecommerce", "measurement", "customer experience", "concept", "Lovesac"],
  },
  {
    id: "lovesac-redesign",
    category: "experience-strategy",
    title: "Lovesac Redesign: Experience Strategy",
    url: `${SITE_ORIGIN}/work/lovesac-case-study.html`,
    summary:
      "A conceptual redesign of Lovesac's existing site that brings value, transparency, customer expectations, and accessibility to the forefront.",
    details:
      "The project reframes a highly configurable product around confidence instead of complexity. It combines experience strategy, information architecture, clearer value communication, trust signals, accessible interaction patterns, and a premium visual direction. The published series separates research evidence, proposed solutions, and projected business outcomes.",
    tags: ["UX strategy", "information architecture", "accessibility", "trust", "customer expectations", "concept", "Lovesac"],
  },
  {
    id: "lovesac-research",
    category: "research",
    title: "Lovesac Redesign: Research",
    url: `${SITE_ORIGIN}/work/lovesac-case-study-3.html`,
    summary:
      "Public customer sentiment, competitive analysis, and usability findings used to test and refine the redesign direction.",
    details:
      "The research examines recurring friction such as assembly difficulty, support access, warranty ambiguity, and setup expectations. It is transparent about its limits: it uses public evidence and competitive review rather than internal analytics or a formal usability study.",
    tags: ["research", "customer sentiment", "competitive analysis", "usability", "evidence", "limitations"],
  },
  {
    id: "lovesac-content",
    category: "content-strategy",
    title: "Lovesac Redesign: Content Strategy",
    url: `${SITE_ORIGIN}/work/lovesac-case-study-4.html`,
    summary:
      "A content-versus-utility framework and product-language strategy for making a complex purchase easier to understand and act on.",
    details:
      "The case focuses on when content should explain, when an interface should help someone do, and how product language can build clarity and confidence without adding promotional noise.",
    tags: ["content strategy", "product language", "utility", "clarity", "customer confidence"],
  },
  {
    id: "resume",
    category: "profile",
    title: "Résumé",
    url: `${SITE_ORIGIN}/output/pdf/Claudia_Ochoa_Resume.pdf`,
    summary:
      "Claudia Ochoa's two-page professional résumé, focused on AI experience and product design leadership.",
    details:
      "Use the résumé for the formal career record and the case studies for evidence of leadership approach, decisions, and outcomes.",
    tags: ["resume", "résumé", "career", "experience", "AI leadership", "product design"],
  },
];

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "can", "did", "do", "does", "for", "from", "has", "have", "her", "how", "i", "in", "is", "it", "me", "my", "of", "on", "or", "she", "that", "the", "their", "this", "to", "was", "what", "when", "where", "which", "who", "why", "with", "would", "you",
]);

function normalize(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function queryTerms(query) {
  return [...new Set(normalize(query).split(/\s+/).filter((term) => term.length > 1 && !STOP_WORDS.has(term)))];
}

function scoreResource(resource, terms, phrase) {
  const title = normalize(resource.title);
  const tags = normalize(resource.tags.join(" "));
  const summary = normalize(resource.summary);
  const details = normalize(resource.details);
  let score = phrase && title.includes(phrase) ? 18 : 0;

  for (const term of terms) {
    if (title.includes(term)) score += 8;
    if (tags.includes(term)) score += 6;
    if (summary.includes(term)) score += 3;
    if (details.includes(term)) score += 1;
  }

  const intentBoosts = [
    {
      matches: ["responsible", "guardrail", "evaluation", "human escalation", "risk"],
      ids: { "agentic-readiness": 42, "walmart-genai": 8 },
    },
    {
      matches: ["executive", "influence", "buy in", "leadership support", "creative director"],
      ids: { "walmart-genai": 24 },
    },
    {
      matches: ["business value", "roi", "revenue", "margin", "cost to serve"],
      ids: { "lovesac-business-case": 22, profile: 6 },
    },
    {
      matches: ["good to work", "work with", "collaborat", "team", "stakeholder", "partner"],
      ids: { "walmart-genai": 30, profile: 22, "agentic-readiness": 12 },
    },
  ];
  for (const boost of intentBoosts) {
    if (boost.matches.some((match) => phrase.includes(match))) {
      score += boost.ids[resource.id] ?? 0;
    }
  }

  if (resource.category === "ai-leadership") score += 0.25;
  return score;
}

export function searchPortfolio(query, limit = 4) {
  const terms = queryTerms(query);
  const phrase = normalize(query);
  const cappedLimit = Math.max(1, Math.min(Number(limit) || 4, 8));
  const ranked = PORTFOLIO_RESOURCES
    .map((resource, index) => ({ resource, index, score: scoreResource(resource, terms, phrase) }))
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const strongestScore = ranked[0]?.score ?? 0;
  const relevanceFloor = strongestScore * 0.3;
  const matches = ranked.filter((item) => item.score > 0 && item.score >= relevanceFloor);
  return (matches.length ? matches : ranked).slice(0, cappedLimit).map(({ resource, score }) => ({ ...resource, score }));
}

export function getPortfolioResource(id) {
  return PORTFOLIO_RESOURCES.find((resource) => resource.id === id) ?? null;
}

export function listPortfolioResources(category) {
  return PORTFOLIO_RESOURCES.filter((resource) => !category || resource.category === category);
}

export function publicResource(resource, includeDetails = false) {
  const value = {
    id: resource.id,
    category: resource.category,
    title: resource.title,
    url: resource.url,
    summary: resource.summary,
  };
  if (includeDetails) value.details = resource.details;
  return value;
}
