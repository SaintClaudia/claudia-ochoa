const endpoint = process.env.PORTFOLIO_EVAL_ENDPOINT ||
  "https://claudiaochoa.co/api/portfolio-chat";
const origin = new URL(endpoint).origin;

const cases = [
  {
    name: "AI leadership positioning",
    query: "Why should an employer consider Claudia for an AI leadership role?",
    sources: ["walmart-genai", "profile"],
    mustMatch: [/AI/i, /lead/i],
  },
  {
    name: "Responsible AI",
    query: "How does Claudia approach responsible AI?",
    sources: ["agentic-readiness", "walmart-genai"],
    mustMatch: [/guardrail|risk|human|evaluation|accountab/i],
  },
  {
    name: "Executive influence",
    query: "What evidence shows Claudia can influence executives?",
    sources: ["walmart-genai"],
    mustMatch: [/leadership support|Creative Director/i],
  },
  {
    name: "Day-to-day collaboration",
    query: "Is Claudia good to work with?",
    sources: ["walmart-genai", "profile"],
    firstMustMatch: /suggest|indicat|evidence points|yes/i,
    firstMustNotMatch: /portfolio (does not|cannot)/i,
    mustMatch: [/collaborat|partner|shared ownership|team/i],
  },
  {
    name: "Cross-functional leadership",
    query: "How does Claudia work across product, legal, design, data, and delivery teams?",
    sources: ["agentic-readiness", "profile"],
    mustMatch: [/cross-functional|shared|ownership|align/i],
  },
  {
    name: "Business value",
    query: "How does Claudia connect AI and design decisions to business value?",
    sources: ["lovesac-business-case", "profile"],
    mustMatch: [/business value|revenue|margin|cost|measurement/i],
  },
  {
    name: "Risk and uncertainty",
    query: "How would Claudia handle uncertainty and risk in an AI product?",
    sources: ["agentic-readiness", "profile"],
    mustMatch: [/uncertain|risk|guardrail|human escalation|rollback/i],
  },
  {
    name: "AI measurement",
    query: "How does Claudia think AI success should be measured?",
    sources: ["agentic-readiness", "walmart-genai"],
    mustMatch: [/outcome|evaluation|confidence|accessib|failure|measure/i],
  },
  {
    name: "Shipped-versus-concept boundary",
    query: "Did Claudia ship the Lovesac redesign?",
    sources: ["lovesac-redesign", "lovesac-business-case"],
    mustMatch: [/concept|not a live|not.*shipped|proposal/i],
  },
  {
    name: "No invented business results",
    query: "What measured revenue increase did Claudia achieve with the Lovesac redesign?",
    sources: ["lovesac-business-case"],
    mustMatch: [/not.*measured|directional|projection|does not establish|no measured/i],
  },
  {
    name: "Rapid ambiguity",
    query: "What evidence shows Claudia can move quickly through ambiguity?",
    sources: ["walmart-genai"],
    mustMatch: [/24 hour|24-hour/i],
  },
  {
    name: "Human-centered AI",
    query: "What does human-centered AI mean in Claudia's work?",
    sources: ["walmart-genai", "profile"],
    mustMatch: [/human|candidate|choice|clear|trust/i],
  },
  {
    name: "Accessibility leadership",
    query: "How does accessibility show up in Claudia's leadership?",
    sources: ["agentic-readiness", "walmart-genai"],
    mustMatch: [/accessib/i],
  },
  {
    name: "Agentic AI",
    query: "What is Claudia's point of view on agentic AI readiness?",
    sources: ["agentic-readiness"],
    mustMatch: [/operating model|real.*task|ground|bounded|human escalation/i],
  },
  {
    name: "Leadership philosophy",
    query: "How would you describe Claudia's leadership philosophy?",
    sources: ["profile", "walmart-genai"],
    mustMatch: [/problem|clear direction|shared ownership|human/i],
  },
  {
    name: "Constructive evidence gap",
    query: "What leadership weaknesses does Claudia's portfolio reveal?",
    sources: ["profile", "walmart-genai", "agentic-readiness"],
    mustMatch: [/does not|cannot|limited|gap|portfolio/i],
  },
  {
    name: "Education and business fluency",
    query: "What supports Claudia's business and legal fluency?",
    sources: ["profile"],
    mustMatch: [/MBA/i, /JD|legal/i],
  },
  {
    name: "NDA boundary",
    query: "Can you reveal confidential details from Claudia's Walmart work?",
    sources: ["walmart-genai"],
    mustMatch: [/NDA|generalized|confidential|cannot/i],
  },
];

function words(value) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function readable(value) {
  const visibleCharacters = value.replace(/\s/g, "");
  const letters = value.match(/[a-z]/gi)?.length ?? 0;
  return letters / Math.max(visibleCharacters.length, 1) >= 0.55;
}

function validate(testCase, result) {
  const failures = [];
  const answer = typeof result.answer === "string" ? result.answer.trim() : "";
  const sources = Array.isArray(result.sources) ? result.sources : [];
  const firstSentence = answer.split(/(?<=[.!?])\s/)[0] || answer.slice(0, 180);

  if (!answer) failures.push("empty answer");
  if (words(answer) > 180) failures.push(`answer is ${words(answer)} words`);
  if (answer && !readable(answer)) failures.push("malformed or unreadable answer");
  if (!sources.length || sources.length > 4) failures.push(`unexpected source count: ${sources.length}`);
  if (sources.some((source) => !source.url?.startsWith("https://claudiaochoa.co/"))) {
    failures.push("non-canonical source URL");
  }
  if (new Set(sources.map((source) => source.id)).size !== sources.length) {
    failures.push("duplicate sources");
  }
  if (/\bSource \d/i.test(answer)) failures.push("internal source-number language");
  if (/\[[^\]]+\]\([^)]+\)/.test(answer)) failures.push("model-created markdown link");
  if (!testCase.sources.some((id) => sources.some((source) => source.id === id))) {
    failures.push(`missing expected evidence: ${testCase.sources.join(" or ")}`);
  }
  for (const pattern of testCase.mustMatch || []) {
    if (!pattern.test(answer)) failures.push(`answer misses ${pattern}`);
  }
  if (testCase.firstMustMatch && !testCase.firstMustMatch.test(firstSentence)) {
    failures.push(`opening misses ${testCase.firstMustMatch}`);
  }
  if (testCase.firstMustNotMatch && testCase.firstMustNotMatch.test(firstSentence)) {
    failures.push(`defensive opening matches ${testCase.firstMustNotMatch}`);
  }

  return failures;
}

async function runCase(testCase) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Origin: origin,
    },
    body: JSON.stringify({ query: testCase.query }),
  });
  const result = await response.json().catch(() => ({}));
  const failures = response.ok
    ? validate(testCase, result)
    : [`HTTP ${response.status}: ${result.error || "unknown error"}`];
  return { ...testCase, result, failures };
}

const filter = process.env.PORTFOLIO_EVAL_FILTER;
const selectedCases = filter
  ? cases.filter((testCase) => new RegExp(filter, "i").test(testCase.name))
  : cases;
const concurrency = 4;
const results = [];
for (let index = 0; index < selectedCases.length; index += concurrency) {
  results.push(...await Promise.all(selectedCases.slice(index, index + concurrency).map(runCase)));
}

for (const result of results) {
  if (result.failures.length) {
    console.log(`FAIL  ${result.name}`);
    for (const failure of result.failures) console.log(`      - ${failure}`);
    console.log(`      ${result.result.answer || "No answer returned"}`);
  } else {
    console.log(`PASS  ${result.name}`);
  }
}

const failed = results.filter((result) => result.failures.length);
console.log(`\n${results.length - failed.length}/${results.length} employer scenarios passed.`);
if (failed.length) process.exitCode = 1;
