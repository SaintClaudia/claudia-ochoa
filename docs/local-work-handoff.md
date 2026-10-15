# Local work checkpoint — October 15, 2026

Keep this work local. Do not push or deploy without a new user instruction.

## Ask Read

The portfolio page at `work/ask-read.html` now includes the interactive Plays detail workspace, using `css/ask-read-plays.css` and `js/ask-read-plays.js`. Shared Ask Read typography was consolidated in the existing stylesheets.

The current view uses Shallow cross as its headline, a collapsed global navigation rail, an interactive compact field, and a right-hand assignment rail with a persistent Ask Read composer. The play-library rail, create/upload buttons, Notes feature, and redundant helper captions are hidden or removed. Conversation responses and practice results are examples, not live AI or analyzed film. File attachment controls and browser-dependent voice input are implemented.

Preview locally with `python3 -m http.server 4173 --bind 127.0.0.1`, then open `http://127.0.0.1:4173/work/ask-read.html#plays-prototype`.

## Pending favicon work

The user switched context: the supplied gold bridge-in-circle mark is for **claudiaochoa.co across the entire portfolio**, replacing the heart favicon, not just Ask Read. Preserve the actual icon and make its background transparent, including internal openings. The user wants an unbounded mark that reads clearly in browser tabs.

The original reference is preserved at `images/bridge-favicon-reference.png`. No production favicon assets or favicon links have been changed. An initial generated background extraction was unsuitable because it altered the mark; do not use it as the final icon. Resume this work after the break and validate transparency and small-size legibility before replacing favicon assets.
