# Personalization cover: original Figma UI

Source: https://www.figma.com/design/6jAmqiCtPa6upvvg3kEjjX?node-id=219-298654

`screen.png` is an unmodified 3× export of frame `219:298654` (4800 × 2700 pixels).

Verified in Figma:
- Original screen: 1600 × 900.
- Product panel `219:298655`: x=1079, y=132, width=520, visible height=768.
- Panel width / whole screen width: 32.5%.
- Panel container and master drawer: radius 0, no effects/shadow; white master drawer background.
- Header: 132 pixels high. All controls, fonts, colors, strokes, spacing and radii are preserved by exporting the complete frame.

The cover restores `public/media/visual-covers/email-personalization-narrow-4k.webp`: the monitor, email, photo background and two floating panels are retained. Only the existing on-screen Product panel is replaced.

`drawer.png` is the original master drawer `219:298657` at 3× (1560 × 12318). A temporary export clone was removed immediately after export; the Figma original was not edited. The Name chip is copied from its exact location in `screen.png`, because it is a sibling overlay in Figma.

The drawer uses a 520 × 1104 viewport to match the old panel's tall, narrow footprint without stretching its controls vertically. One perspective transform applies to the complete panel. No UI color grading, extra shadow or invented content is applied. Pixels outside the replacement polygon are asserted unchanged from the original monitor cover. The output uses lossless compression.

Regenerate with `python scripts/compose-personalization-cover.py` (Pillow and NumPy). Outputs are lossless WebP at 3840, 1920 and 960 pixels wide.
