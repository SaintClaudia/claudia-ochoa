import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const nav = readFileSync(new URL("../../_lovesac-nav.html", import.meta.url), "utf8");
const redesign = readFileSync(new URL("../../work/lovesac-redesign.html", import.meta.url), "utf8");
const styles = readFileSync(new URL("../../css/lovesac-prototype.css", import.meta.url), "utf8");
const mobileNav = readFileSync(new URL("../../js/lovesac-mobile-nav.js", import.meta.url), "utf8");
const megaMenu = readFileSync(new URL("../../js/lovesac-mega-menu.js", import.meta.url), "utf8");

test("navigation imagery remains deferred until its menu opens", () => {
  assert.ok((nav.match(/data-bg=/g) || []).length >= 30, "navigation images are not deferred");
  assert.doesNotMatch(nav, /background-image:url\('\.\.\/images\/nav-/);
  assert.match(mobileNav, /loadBackgrounds\(target\)/);
  assert.match(megaMenu, /loadBackgrounds\(item\)/);
});

test("redesign uses a responsive, prioritized mobile hero", () => {
  assert.match(redesign, /lovesac-hero-mobile\.avif[^>]+media="\(max-width:600px\)"[^>]+fetchpriority="high"/);
  assert.match(redesign, /lovesac-hero\.webp[^>]+media="\(min-width:601px\)"[^>]+fetchpriority="high"/);
  assert.match(styles, /lovesac-hero-mobile\.avif/);
  assert.match(styles, /lovesac-hero-mobile\.webp/);
});

test("below-fold redesign imagery remains lazy", () => {
  assert.equal((redesign.match(/data-lazy-bg=/g) || []).length, 4);
  assert.match(redesign, /lovesac-credit-card\.webp[^>]+loading="lazy"[^>]+decoding="async"/);
  assert.match(redesign, /lovesac-lazy-backgrounds\.js\?v=1/);
});
