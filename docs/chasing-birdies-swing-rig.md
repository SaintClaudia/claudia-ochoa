# Chasing Birdies swing rig foundation

Local review: http://127.0.0.1:4173/work/chasing-birdies-rig-debug.html

Existing scene review: http://127.0.0.1:4173/work/chasing-birdies.html#birdies-swing

## Diagnosis

The original presentation switches between six independently generated raster poses. The club, hands, glove, and anatomy are painted into each image. There is no shared skeleton or club geometry to constrain, so individual retouches cannot establish persistent hand identity or equipment dimensions. The ball flight and course inset are authored presentation paths.

The foundation is separate from that artwork. The portfolio presentation always uses the golfer artwork, including legacy `swing=rig` URLs. The original rig-review URL opens the portfolio; the technical mannequin is available only on the separate rig-debug page. No course, lighting, water masks, interface, or course camera was redesigned. The procedural player's projection is an approximation of the photograph's perspective, anchored to the existing ball position.

## Architecture

Vanilla JavaScript modules and Canvas 2D, with no packages or rendering engine. The model is metre-based 3D geometry projected into the existing 2D scene.

- `birdies-swing-rig.mjs`: immutable dimensions, authored pelvis/shoulder/club targets, two-bone arm and leg IK, grip reach constraints, persistent hand attachments, joint bounds, collision proxies, and pose auditing.
- `birdies-swing-rig-view.mjs`: procedural mannequin, clothes, glove, and equipment, all driven by the same rig. Depth-sorted triangles are an inspection renderer, not a skinned production character.
- `birdies-swing-rig-preview.mjs`: playback, scrubber, seven checkpoints, camera inspection, and skeleton overlay.
- `birdies-swing-rig-scene.mjs`: retained experimental course adapter, no longer loaded by the portfolio scene.

Grip and shaft share one orthonormal club transform. The head is a fixed ellipsoid attached to that transform. Its calculated volume is 460 cc; the shaft-axis overall length is 45.5 inches and grip is 10.5 inches. This is a dimensioned equipment proxy, not a manufacturer's driver CAD model. The visual shaft tapers from 12 mm to 8 mm diameter. Loft metadata is reserved for a later clubface model; the present ellipsoid does not model a lofted striking surface.

The left hand is permanently gloved and attached at 95 mm from the grip butt. The bare right hand attaches at 195 mm. Both wrists and fingers derive from these same local transforms. They cannot exchange identities or independently move off the club. IK adjusts the complete grip/club target within the shared reach region, never stretching a bone. Address and impact targets use the same ball coordinate, with an exact proxy-face contact at impact.

Elbow bend directions are parallel-transported through the trajectory to avoid pole singularity flips. A constrained elbow-circle solution keeps forearms outside a central torso proxy. Cubic, shape-preserving target interpolation and spherical club-axis interpolation avoid image frame jumps and zero-length direction interpolation. Playback gives the backswing more time than the downswing. The pelvis starts returning before the shoulders; the trail heel rises around its toe and the finish favors the lead side.

## Validation

Run:

```sh
node --test eval/birdies-swing-rig.test.mjs
```

Five tests validate equipment dimensions, all seven named positions, 4,001 trajectory samples, club-to-ball contact, and unreachable IK rejection. Trajectory checks cover bone lengths, rigid distances between club parts, hand attachment and ordering, glove identity, elbow/knee angle bounds, torso collision proxies, and sudden elbow/club displacement. The collision proxies cover the shaft and central torso/forearm relationship; they are not complete mesh collision detection.

Seven checkpoints were also inspected in the browser: address, mid-backswing, top, downswing, impact, early follow-through, and finish. Structural tests pass; they do not establish athlete-quality motion or photographic realism.

## Visual limits and next step

This completes a reusable rig foundation, not the visually convincing final athlete. The procedural mannequin is visibly faceted, finger and shoulder deformation are simplified, and head/neck gaze and garment continuity need a skinned asset. The authored swing is continuous and constrained but has no motion-capture provenance. Shoulder/wrist twist limits, complete body collisions, center-of-mass balance, ground forces, shaft flex, actual shot physics, and accurate facial likeness are not simulated. Lead pressure is an authored presentation value rather than measured force.

Further individual raster edits cannot solve those limits. The next useful step is one consistently rigged character with named left/right bones, glove bound only to the left-hand mesh, a club socket, and a continuous authored or captured swing clip. Retain the model dimensions and attachment tests when attaching that asset. A lightweight browser rendering choice can be evaluated then; no new engine is required for this foundation.

The driver requested for rig inspection is not appropriate equipment for an ordinary 106-yard coastal par 3 shot. The existing scene and scripted result are preserved for review; future playable club selection should use a wedge and its actual dimensions for this hole.

Reference context: [USGA club specifications](https://www.usga.org/equipment-standards/equipment-rules-2019/equipment-rules/part-2-rule-2.html), and [professional swing sequencing research](https://pmc.ncbi.nlm.nih.gov/articles/PMC9816382/). These inform dimensions and general sequencing; the implementation is not a reconstruction of a measured athlete's motion.
