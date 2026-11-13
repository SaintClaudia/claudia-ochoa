const SITE_ORIGIN = "https://claudiaochoa.co";

export const PORTFOLIO_RESOURCES = [
  {
    id: "profile",
    category: "profile",
    title: "Creative & Product Design Leadership",
    url: `${SITE_ORIGIN}/about.html`,
    summary:
      "Claudia Ochoa is a creative and product design leader with more than 20 years of experience connecting emerging technology, business strategy, brand, and customer experience.",
    details:
      "Her leadership starts with the problem rather than the technology. She connects customer needs, business value, brand, and delivery so AI has a clear role, measurable purpose, and human experience around it. Her published working principles are to create clear direction and shared ownership: frame the human and business problem first, build a direction leaders and delivery partners can use, make trade-offs and risks visible, and hold the experience vision through delivery while giving specialists room to shape the solution. Her MBA from Purdue Global strengthens the business side of that work; JD studies at Purdue Global Law School are expanding the legal fluency she brings to emerging-technology decisions.",
    tags: ["AI leadership", "product design", "human-centered AI", "business strategy", "brand", "collaboration", "shared ownership", "delivery partnership", "MBA", "legal fluency"],
  },
  {
    "id": "ask-read",
    "category": "ai-leadership",
    "title": "Ask Read — Football Intelligence",
    "url": "https://claudiaochoa.co/work/ask-read.html",
    "summary": "Ask Read is a football intelligence concept for quarterbacks, connecting opponent film, evidence-backed briefings, and weekly preparation.",
    "details": "The concept uses computer vision to analyze game film and surface patterns, tendencies, and opportunities. It connects opponent study, personal development, and questions for the film room. The published design emphasizes evidence, evaluation, and clear communication; it does not establish shipped adoption or measured performance outcomes.",
    "tags": [
        "Ask Read",
        "football",
        "computer vision",
        "AI",
        "film study",
        "quarterback",
        "product design",
        "evidence",
        "evaluation"
    ]
},
  {
    "id": "chasing-birdies",
    "category": "experience-strategy",
    "title": "Chasing Birdies — Golf Simulation",
    "url": "https://claudiaochoa.co/work/chasing-birdies.html",
    "summary": "Chasing Birdies is a golf simulation concept featuring Brock Purdy and a 16-player roster of football stars and legends.",
    "details": "The portfolio presents a golf concept spanning character design, a football-inspired roster, course presentation, and game interaction. It brings the competitive spirit of football onto iconic fairways. Treat the work as a concept and prototype, not an officially licensed or commercially released game.",
    "tags": [
        "Chasing Birdies",
        "golf",
        "simulation",
        "game design",
        "characters",
        "prototype",
        "Brock Purdy"
    ]
},
  {
    "id": "brock-purdy-13",
    "category": "experience-strategy",
    "title": "Brock Purdy 13 — Fragrance Collection",
    "url": "https://claudiaochoa.co/work/brock-purdy-13.html",
    "summary": "Brock Purdy 13 is a fragrance and grooming concept with brand identity, packaging, and art direction built around his signature number.",
    "details": "The concept expresses discipline, confidence, and balance through a signature mark, bottle design, and golden-hour art direction. An eau de parfum anchors the grooming collection. This is a portfolio design concept; the page does not establish an official endorsement, a retail launch, or sales results.",
    "tags": [
        "Brock Purdy 13",
        "fragrance",
        "grooming",
        "brand identity",
        "packaging",
        "art direction",
        "signature mark"
    ]
},
  {
    id: "resume",
    category: "profile",
    title: "Résumé",
    url: `${SITE_ORIGIN}/output/pdf/Claudia_Ochoa_Resume.pdf`,
    summary:
      "Claudia Ochoa's two-page professional résumé, focused on creative and product design leadership.",
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

  // Current project names and published evidence determine relevance.
  if (resource.id === "profile" && /collaborat|leadership|career|work with/.test(phrase)) score += 12;
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
