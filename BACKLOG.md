# Backlog

- [x] [Spike] Audit remaining references to the retired `--clay-deep` and `--espresso` CSS variable names and rename them properly. Completed September 8, 2026: renamed the case-study.css palette to functional names (`--cream`→`--bg`, `--sand`→`--bg-alt`, `--espresso`→`--text-bright`, `--paper`→`--surface`) and removed the duplicate `--clay`/`--clay-deep`/`--invert-ink` aliases in favor of `--ink-soft`/`--text-bright`/`--bg` directly, across case-study.css and every page that loads it. The lovesac-prototype.css system (its own real `--clay`/`--canvas` palette, used only by lovesac-redesign.html and lovesac-support.html) was left untouched.
- [x] Optimize the interactive Lovesac redesign's performance after the agentic-readiness workstream. Completed September 4, 2026: responsive AVIF/WebP hero delivery and deferred menu/below-fold backgrounds improved local Lighthouse 13.4.1 from a repeated 78–83 mobile range to 99 mobile, with desktop at 100.

## Current redesign follow-up

- [x] Review the six active pages' macOS/Chrome accessibility structure and
  keyboard behavior; fix reading-order, mockup focus, jump-target naming,
  heading, link-name, and Contact response-focus issues. See
  [the review record](docs/accessibility-review-2026-11-10.md) for checks and limits.
- [ ] Complete the audible VoiceOver pass on all six pages: continuous reading,
  heading/link rotor navigation, live status announcements, and any repeated
  “empty” announcements. The available connection exposes accessibility content
  and keyboard focus but does not reliably expose VoiceOver speech or its overlay.
