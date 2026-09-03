import assert from "node:assert/strict";
import test from "node:test";

import { htmlToMarkdown, markdownRequested } from "../src/index.js";

test("negotiates Markdown only when it is explicitly preferred", () => {
  assert.equal(markdownRequested("text/markdown"), true);
  assert.equal(markdownRequested("text/markdown, text/html;q=0.9"), true);
  assert.equal(markdownRequested("text/*"), true);
  assert.equal(markdownRequested("text/html, text/markdown;q=0.5"), false);
  assert.equal(markdownRequested("text/markdown;q=0"), false);
  assert.equal(markdownRequested("*/*"), false);
  assert.equal(markdownRequested(null), false);
});

test("converts portfolio HTML into structured, agent-readable Markdown", () => {
  const html = `<!doctype html>
    <html>
      <head>
        <title>Claudia &amp; AI</title>
        <meta name="description" content="AI leadership portfolio">
        <link rel="canonical" href="/work/example.html">
        <script type="application/ld+json">{"@type":"Person","name":"Claudia Ochoa"}</script>
        <style>.hidden { display: none; }</style>
      </head>
      <body>
        <nav>Navigation noise</nav>
        <main>
          <h1>Human-centered AI</h1>
          <p>Designing <strong>responsible systems</strong> at scale.</p>
          <ul><li>Strategy</li><li>Governance</li></ul>
          <a href="/about.html">About Claudia</a>
          <img src="/images/example.webp" alt="AI workflow">
          <script>doNotInclude()</script>
        </main>
        <footer>Footer noise</footer>
      </body>
    </html>`;

  const markdown = htmlToMarkdown(html, "https://claudiaochoa.co/");

  assert.match(markdown, /title: "Claudia & AI"/);
  assert.match(markdown, /description: "AI leadership portfolio"/);
  assert.match(markdown, /url: "https:\/\/claudiaochoa\.co\/work\/example\.html"/);
  assert.match(markdown, /# Human-centered AI/);
  assert.match(markdown, /- Strategy/);
  assert.match(markdown, /\[About Claudia\]\(https:\/\/claudiaochoa\.co\/about\.html\)/);
  assert.match(markdown, /!\[AI workflow\]\(https:\/\/claudiaochoa\.co\/images\/example\.webp\)/);
  assert.match(markdown, /```json\n{"@type":"Person","name":"Claudia Ochoa"}\n```/);
  assert.doesNotMatch(markdown, /Navigation noise|Footer noise|doNotInclude|display: none/);
});
