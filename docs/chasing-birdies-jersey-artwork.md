# Customization jersey correction

The alternate slot now uses `images/birdies-wardrobe-faithful-alternate.webp`,
edited with built-in imagegen from the three-stripe atlas and the user's supplied
black/red/gold Purdy jersey screenshot. Scarlet and white continue to use the
previous atlas. The new atlas retains the same dimensions and crop coordinates
and is exported to WebP at quality 95 without resizing.

## Alternate reference prompt

Use case: precise-object-edit. Image 1 is the EDIT TARGET: square 1254x1254 wardrobe sprite atlas. Image 2 is a DESIGN REFERENCE for the black alternate football jersey only. Change ONLY the black jersey in row 2 column 3 of image 1 (cell x627..940, y315..626). Match the FRONT jersey shown on right of reference image 2: charcoal black fabric, exactly THREE SCARLET RED horizontal stripes on each sleeve (NO WHITE stripes); large red number '13' in the distinctive ornate western/saloon serif numeral style shown in reference with thick metallic gold outline/drop shadow; small gold cursive 'Faithful' script centered above chest numerals; matching red and gold shoulder '13' numerals; NFL shield at base of black V collar. Reproduce reference numeral shapes closely, including the curved ornamental 3. Keep the target atlas jersey front-facing, empty/armless garment product rendering, same scale and position, same lighting and dark green background, entirely inside its current cell. Do NOT add a back view, person, arms, extra jersey, or screenshot UI. Preserve every other cell including the scarlet and white jerseys with their THREE sleeve stripes unchanged. Preserve exact square atlas layout, object positions, crop coordinates, 1254x1254 composition. Only replace black jersey design. No white numerals or white sleeve bands on black jersey.

## Previous three-stripe correction

The customization thumbnails use `images/birdies-wardrobe-three-stripe-jerseys.webp`.
The 1254 × 1254 atlas retains the existing crop coordinates. Only its second-row
jersey cells are consumed by the page. The original atlas is retained.

Created with the built-in imagegen tool on October 20, 2026, using
`images/birdies-wardrobe-armless-jerseys.png` as the edit target. Exported to WebP
at quality 95 without resizing. The larger game-day portrait already has three
sleeve stripes and did not require an edit.

## Prompt

Use case: precise-object-edit. Edit target: the attached square 1254x1254 wardrobe sprite atlas used by an existing website. Make one precise correction: in the second row, the first three cells show scarlet, white, and black number 13 football jerseys. Change BOTH sleeves on EACH of these THREE jerseys from TWO horizontal stripes to exactly THREE clean, parallel horizontal stripes. Scarlet jersey: three WHITE sleeve stripes. White jersey: three SCARLET RED sleeve stripes. Black alternate jersey: three WHITE sleeve stripes with its existing fine red trim. Match realistic sewn 49ers three-stripe sleeve spacing, follow the folds and sleeve angle. Keep jerseys armless, empty display garment renders. Preserve the exact 4-column by 4-row atlas arrangement, each garment position, size, number 13 typography, colorways, chest and shoulder details, texture, shading, dark green background, helmet, all first-row golf shirts, hats, glove, sunglasses and empty cells. Do not add arms, humans, text, fourth stripe, graphics, borders, or extra objects. The three sleeve stripes must be clearly distinct and equally weighted, with three visible stripes on all SIX visible jersey sleeves. All changes confined to sleeve stripe regions in second-row first three cells. Output a square image with the same composition.
