# Cup-drop recording

`cup-drop.wav` is the user-confirmed cup sound isolated from the supplied `Golf.m4a` voice memo, approximately 12.40–13.38 seconds into the original recording.

Converted to mono 22.05 kHz PCM WAV. The edit removes low microphone rumble and upper hiss, applies short edge fades, and normalizes the peak without clipping. The full voice memo is not bundled.

The game fetches and decodes the clip when sound is enabled, and caches it for subsequent holes. The cup recording plays without a victory ping. If the recording cannot load, the synthesized cup sound remains available as a fallback.

# Driver-hit recording

`driver-hit.wav` isolates the second impact in the supplied `hit.m4a` voice memo, approximately 7.57–8.17 seconds into the recording. It uses mono 22.05 kHz PCM, gentle rumble/hiss filtering, edge fades, and peak normalization without clipping.

The clip loads and caches when sound is enabled and plays for driver, iron, and wedge shots. Shot strength adjusts its volume and playback rate. Putter and ball-collision sounds retain their existing profiles. Each club’s synthesized strike remains available if the recording cannot load.

# Water-splash recording

`water-splash.wav` isolates the first splash in the supplied `water.m4a` voice memo, approximately 2.54–3.40 seconds into the recording. It uses mono 22.05 kHz PCM, removes the DC offset, normalizes the peak without clipping, and applies short edge fades. The full voice memo is not bundled.

The clip loads and caches when sound is enabled. It plays once when a grounded ball enters water, including another player's ball bumped into water. Airborne shots that clear water and out-of-bounds shots do not trigger it. The water penalty and return to the previous lie are unchanged; the splash replaces the water penalty beep.

# Bunker-shot recording

`bunker-hit.wav` isolates the club striking the ball from sand in the supplied `bunker.m4a` voice memo, approximately 3.80–4.15 seconds into the recording. It uses mono 22.05 kHz PCM, DC offset removal, peak normalization, and short edge fades. The full voice memo is not bundled.

The clip loads and caches when sound is enabled and replaces the club impact sound for shots originating in a bunker. Shot strength adjusts volume and playback rate. The existing club sound remains available if the recording cannot load.

# Bunker-landing recording

`bunker-land.wav` isolates the sand landing in the supplied `sand.m4a` voice memo, approximately 4.90–5.40 seconds into the recording. It uses mono 22.05 kHz PCM, DC offset removal, peak normalization without clipping, and short edge fades. The full voice memo is not bundled. This replaces the synthesized landing effect; `bunker-hit.wav` remains the separate sound for hitting out of sand.

The clip loads and caches when sound is enabled. It plays when a ball lands or rolls into a bunker, including a bumped ball. It does not repeat while rolling within sand or play for an airborne shot that clears the bunker. Landing back in sand after an airborne shot produces a new cue. Bunker distance adjustments remain unchanged.

# Shrubs / tree-impact recording

`tree-impact.wav` isolates the rustle in the supplied `shrubs.m4a` voice memo, approximately 3.02–4.30 seconds into the recording. It uses mono 22.05 kHz PCM, DC offset removal, peak normalization without clipping, and short edge fades. The full voice memo is not bundled. This replaces the synthesized tree-impact effect.

The clip loads and caches when sound is enabled. Tree contact cues are timed by the ball simulation using the tree footprints and a rounded canopy up to 60 loft units high. Low flying, landing, and rolling balls can trigger it, including bumped balls. Shots that clear the canopy are silent. The cue plays on entry rather than repeating while a ball stays inside a tree. Tree contact does not add a stroke penalty or change ball motion.
