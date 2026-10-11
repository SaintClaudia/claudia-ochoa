# Cup-drop recording

`cup-drop.wav` is the user-confirmed cup sound isolated from the supplied `Golf.m4a` voice memo, approximately 12.40–13.38 seconds into the original recording.

Converted to mono 22.05 kHz PCM WAV. The edit removes low microphone rumble and upper hiss, applies short edge fades, and normalizes the peak without clipping. The full voice memo is not bundled.

The game fetches and decodes the clip when sound is enabled, and caches it for subsequent holes. The cup recording plays without a victory ping. If the recording cannot load, the synthesized cup sound remains available as a fallback.

# Driver-hit recording

`driver-hit.wav` isolates the second impact in the supplied `hit.m4a` voice memo, approximately 7.57–8.17 seconds into the recording. It uses mono 22.05 kHz PCM, gentle rumble/hiss filtering, edge fades, and peak normalization without clipping.

The clip loads and caches when sound is enabled and plays for driver, iron, and wedge shots. Shot strength adjusts its volume and playback rate. Putter and ball-collision sounds retain their existing profiles. Each club’s synthesized strike remains available if the recording cannot load.
