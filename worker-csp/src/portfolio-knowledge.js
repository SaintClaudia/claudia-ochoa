const SITE_ORIGIN = "https://claudiaochoa.co";

export const PORTFOLIO_RESOURCES = [
{
  "id": "the-otherside",
  "category": "experience-strategy",
  "title": "The Otherside \u2014 Community App",
  "url": "https://claudiaochoa.co/work/the-otherside.html",
  "summary": "A community app concept helping independent music fans find friends through shared interests and small local gatherings.",
  "details": "Evolved from Claudia\u2019s Connect idea for people relocating to work onsite during return to office, explored when she started at Walmart. This new concept serves the independent-minded audience of Nebulae. The prototype includes fictional gatherings, filtering, plan details and local saving. It is not a launched Walmart product or a live social network.",
  "tags": [
    "The Otherside",
    "community",
    "friendship",
    "relocation",
    "independent music",
    "gatherings",
    "Connect",
    "product design"
  ]
},
{
  "id": "nebulae",
  "category": "experience-strategy",
  "title": "Nebulae \u2014 Independent Music",
  "url": "https://claudiaochoa.co/work/nebulae.html",
  "summary": "Independent music discovery concept centered on subculture, curated radio, labels and self-releasing artists.",
  "details": "A concept revisiting Claudia\u2019s original independent music service idea. Sacred Gateway and Reeper Riffs introduce discovery through named stations. The prototype supports saving stations locally; it is not a licensed streaming catalog and does not claim current label partnerships or launch outcomes.",
  "tags": [
    "Nebulae",
    "independent music",
    "radio",
    "labels",
    "artists",
    "music discovery",
    "subculture"
  ]
},
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
