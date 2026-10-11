# Swing artwork

The game now uses the revised [body-proportion swing assets](body-proportions.md). This document preserves the original generation prompts.

Generated with the built-in image_gen tool, using each original costume sheet as the character reference. Alpha preserved; converted to WebP at quality 88 for the game.

Assets in this directory:

- `purdy-swing.webp`
- `mccaffrey-swing.webp`
- `kittle-swing.webp`

Each sheet contains six columns (address, takeaway, top, impact, follow-through, finish) and two rows (uniform, golf attire). The game measures the address and impact clubhead anchors individually, mirrors the stance when aiming left, and launches the ball after the downswing. Putting uses a short address-to-impact movement; reduced motion omits the windup.

## Shared generation prompt

Use case: stylized-concept. Asset type: production golf swing animation sprite sheet for Chasing Birdies.
Input image: character and costume reference. Create a NEW transparent sprite sheet, 6 equal columns x 2 equal rows, landscape 1536x1024. Exactly 12 full-body cutout sprites. Same adult athlete, consistent scale and identity in every cell. Top row football uniform from reference, bottom row golf attire from reference. Same side-on three-quarter camera, golfer faces screen RIGHT, right-handed golfer, both hands grip one golf club. Clean realistic rendered arcade game art matching reference.
Columns left to right: 1 address (knees bent, hips hinged, looking down, both hands on club, clubhead resting at ball position on the RIGHT of feet); 2 halfway backswing; 3 top of backswing with club behind head; 4 impact, hands ahead, clubhead at EXACT same point as column 1; 5 follow-through arms extended; 6 complete finish, weight on lead foot, trailing heel lifted, club wrapped over left shoulder.
Crucial layout: each sprite centered in its own equal 256x512 cell, both feet baseline at 470px within each row; fixed body scale, body height about 350px so raised clubs fit; stance feet center x=112 within each cell; address and impact clubhead ground contact x=190 y=470 within each cell. Clubs must fit inside cells and never touch neighbors. Camera and feet anchor consistent across frames. No backgrounds, no ground, no balls, no shadows, no text, no labels, no grid, genuine alpha transparency. Show real coordinated leg, hip, shoulder, arm and club motion; no standing portrait poses.

## Character-specific prompt suffixes

- Brock Purdy #13. Golf outfit ivory Niners polo, red cap, tan trousers.
- Christian McCaffrey #23. Golf outfit scarlet Niners polo, khaki shorts, short blond hair.
- George Kittle #85. Golf outfit dark green Niners polo, red visor, khaki shorts, long blond hair, beard, arm tattoos.
