# Chasing Birdies continuous swing film

Created November 5, 2026 for the portfolio story, not the playable game.
Replaces the six independently generated raster poses and scroll-driven sprite
swapping with one continuous generated shot of Brock Purdy on the coastal tee.

## Assets and provenance

- `media/birdies-swing-film.mp4`: 1920 × 1080 H.264, silent, 6.79 seconds, about
  4.2 MB, fast-start MP4. The source render was trimmed from 1.3 seconds through
  8.1 seconds and encoded with libx264 CRF 20; two-pixel side padding preserves
  the source proportions. No motion interpolation or synthetic intermediate
  frames were added during export.
- `images/birdies-swing-film-poster.jpg`: the first selected video frame.
- Starting frame: built-in image generation composited a new reference-based
  likeness into the existing coastal setting with black 49ers golf attire.
- Video: Runway connection, Kling O3 Pro, 10-second source, 1080p, no audio.
  Task: `edd9a042-ad32-4195-82e8-71f37d350dce`.
- This is generated concept footage, not a recording of Brock Purdy or a
  reconstruction of a measured swing. Course distance and wind are concept UI.
  The old scripted landing marker and ball-flight result are not overlaid on it.

Official likeness and proportion references:

- https://www.49ers.com/team/players-roster/brock-purdy/
- https://www.49ers.com/photos/san-francisco-49ers-golf-course-kittle-purdy-warner-mccaffrey
- https://www.49ers.com/news/masters-brock-purdy-kyle-juszczyk-jerry-rice-hit-the-golf-course-off-the-field

The source photographs are reference inputs, not published site assets.

## Playback

The film loads near the viewport and plays when at least 55% visible. It pauses
offscreen or in a hidden tab, keeps a deliberate user pause, and holds the finish
until Replay is selected. Reduced-motion visitors see the poster and can
deliberately start playback. Native video controls provide the no-JavaScript
fallback. On phones, controls and course details sit below the complete video
frame. Desktop retains the course-overview inset.

## Review

The address, backswing, transition, impact, and finish were inspected through
sampled frames, including 0.1-second samples around the swing. Browser checks
cover desktop/mobile fit, playback, pause/replay, and a simulated reduced-motion
preference.
The asset is illustrative; inspection does not establish biomechanical or
ball-flight accuracy.

## Video prompt

One continuous locked-camera shot of Brock Purdy performing exactly one realistic right-handed pitching-wedge golf swing, starting from this exact reference frame. Preserve his recognizable face, short brown hair, natural athletic build, black 49ers golf polo, tan trousers and white shoes throughout. The additional headshot is a facial-identity reference only; keep the golf clothing and coastal scene from the starting frame. For the first 1.5 seconds he settles quietly at address, eyes on the ball. He makes a controlled backswing with connected shoulder and hip rotation, then a faster downswing and crisp contact with the white ball. Both hands stay on one consistent club grip: white glove on his LEFT hand above his bare RIGHT hand, wrists moving naturally together. The wedge keeps one straight shaft and the same small metal head. His weight transfers to his lead left leg, his trail right heel lifts naturally, and he rotates into a balanced finish, watching the shot toward the green. Hold that finish for the remaining seconds with subtle breathing. His face and physique remain the same person during every phase. Preserve the course layout, ocean, pond, green and flag. Gentle ocean and flag motion. Realistic daylight, fabric and skin, high-quality sports-game cinematic. Fixed camera and constant lens; one full-body shot with the complete club swing inside frame. No cuts or camera orbit, no text or interface, no extra people, no repeated swings.
