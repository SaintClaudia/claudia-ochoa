# Portfolio design system

The active portfolio shares `css/portfolio-foundation.css`. It contains design
values and font declarations, without global element resets. The homepage embeds
it through `build.py`; other portfolio pages receive it through the shared
navigation assets. Keep component behavior in component stylesheets.

## Typography

- Use `var(--site-font)` for the portfolio UI and editorial content. Its Inter
  variable font supports weights 100–900 in one self-hosted WOFF2 file.
- Use `var(--askread-font)` within Ask Read product interfaces. Outfit's supplied
  weights are 400, 500, and 600. Keep product typography out of editorial prose.
- Body text uses `--site-body-size` (1.25rem desktop, 1.125rem mobile) and
  `--site-body-leading` (1.65). Leads, captions, labels, and small UI text have
  their own tokens. Main case-study body paragraphs use the same body scale as
  About and Contact.
- Headings retain composition-specific fluid scales. Device simulations may
  use container-relative units so their interface scales with the device.
- Preload the above-the-fold Inter font only on active pages. Font faces use
  `font-display: swap`; declaring a face does not require preloading every font.

## Color and spacing

Use role-based `--site-*` tokens for repeated portfolio values. Light editorial
pages use the `--site-light-*` roles. The existing `--ink`, `--paper`, `--muted`,
`--line`, and `--accent` aliases support local story themes; keep these overrides
scoped to the corresponding page or section. Shared navigation uses explicit
site colors so it stays readable across those themes.

Ask Read has separate `--askread-*` surface, text, and accent tokens. Chasing
Birdies and Brock Purdy retain their own art direction. Do not replace project
colors with portfolio colors merely because they look similar. Translucent
colors and photographic gradients require review in their actual context.

Use `--site-gutter`, `--site-section-space`, and `--site-section-gap` for repeated
editorial alignment. Media frames use `--site-media-radius`; pills use
`--site-pill-radius`. About and Contact intentionally retain their shared
editorial gutter. Device frames and artwork can have specialized geometry.

## Images and motion

Supply meaningful alt text, or an empty alt for decorative images. Supply the
source image's intrinsic width and height so its aspect ratio is available
before loading. Use responsive CSS (`width:100%; height:auto`) for natural-ratio
content images; crop intentionally with `object-fit` only inside a defined
frame. Preserve existing responsive sources and lazy loading for below-fold
media. Do not combine lazy loading with high fetch priority.

Keep existing reduced-motion rules and native media controls. Validate motion,
focus, overflow, and readability at mobile and desktop sizes after layout edits.

## Build and verification

Run `python3 build.py`, `python3 build.py --check`, and
`python3 eval/design-system-check.py`. The build derives each `/css/` stylesheet's
query version from a SHA-256 content hash so pages cannot drift onto different
manual versions. Shared partials are normalized before comparison, keeping the
read-only check stable.

The dependency-free design check covers active-page CSS/JS/media references,
image dimensions and alt attributes, lazy/high-priority conflicts, shared
foundation inclusion, centralized active font declarations, and direct token
self-references. These checks complement browser review; they do not prove
pixel alignment, contrast compliance, performance scores, or screen-reader
usability. Archived content and the independent game/prototypes have separate
visual systems and are not included in this active-page check.

The November 2026 consolidation also passed a local tinycss2 syntax audit of
all stylesheets in `css/`, verified the Inter variable weight range, and checked
that active raster image dimensions preserve their source aspect ratios.
Browser preview was unavailable during that session, so rendered mobile/desktop
layout verification remains outstanding.

References: [MDN custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties)
and [MDN font loading and CSS performance](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/CSS).
