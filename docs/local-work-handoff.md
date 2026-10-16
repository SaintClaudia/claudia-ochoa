# Local work checkpoint — October 15, 2026

Keep this work local. Do not push or deploy without a new user instruction.

## Ask Read

The portfolio page at `work/ask-read.html` now includes the interactive Plays detail workspace, using `css/ask-read-plays.css` and `js/ask-read-plays.js`. Shared Ask Read typography was consolidated in the existing stylesheets.

The current view uses Shallow cross as its headline, a collapsed global navigation rail, an interactive compact field, and a right-hand assignment rail with a persistent Ask Read composer. The play-library rail, create/upload buttons, Notes feature, and redundant helper captions are hidden or removed. Conversation responses and practice results are examples, not live AI or analyzed film. File attachment controls and browser-dependent voice input are implemented.

Preview locally with `python3 -m http.server 4173 --bind 127.0.0.1`, then open `http://127.0.0.1:4173/work/ask-read.html#plays-prototype`.

## Favicon — done locally (not yet committed or deployed)

The gold bridge-in-circle mark replaced the heart site-wide. The background was removed by unmixing the gold from the dark field (shape and internal openings preserved; outside-the-ring tile corners dropped). Small sizes (16/32/48 and the SVG's embedded 64px image) get a slight alpha boost so the thin cables stay visible in tabs; 192px is unaltered. `apple-touch-icon.png` sits on the original near-black field because iOS fills transparency with black. All favicon links bumped to `?v=8` and the touch icon to `?v=7`. Source reference: `images/bridge-favicon-reference.png`.
