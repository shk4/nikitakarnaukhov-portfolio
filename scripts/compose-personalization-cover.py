"""Replace only the monitor's right panel in the original two-panel cover."""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
photo = Image.open(ROOT / 'public/media/visual-covers/email-personalization-narrow-4k.webp').convert('RGB')
screen = Image.open(ROOT / 'design-sources/personalization/screen.png').convert('RGB')
drawer = Image.open(ROOT / 'design-sources/personalization/drawer.png').convert('RGB')
assert photo.size == (3840, 2560)
assert screen.size == (4800, 2700)
assert drawer.size == (1560, 12318)

# Native panel width is 520px. Keep its UI proportions at the old shot's width;
# use a taller viewport of the SAME drawer instead of vertically stretching it.
panel = drawer.crop((0, 0, 1560, 3312))
# The Name chip is a sibling overlay in the original Figma screen. Preserve it.
panel.paste(screen.crop((1131*3, 264*3, 1213*3, 288*3)), (52*3, 132*3))

# Existing on-screen panel boundary, measured in the 1920px cover.
corners = np.array([(960, 282), (1329, 301), (1329, 1075), (950, 1090)], dtype=float) * 2
source = np.array([(0, 0), (1560, 0), (1560, 3312), (0, 3312)], dtype=float)
rows, targets = [], []
for (x, y), (u, v) in zip(corners, source):
    rows.extend([[x, y, 1, 0, 0, 0, -u*x, -u*y], [0, 0, 0, x, y, 1, -v*x, -v*y]])
    targets.extend([u, v])
matrix = np.linalg.solve(np.array(rows), np.array(targets))
cover = photo.copy()
display = panel.transform(cover.size, Image.Transform.PERSPECTIVE, matrix, Image.Resampling.BICUBIC)
mask = Image.new('L', cover.size, 0)
ImageDraw.Draw(mask).polygon([tuple(p) for p in corners], fill=255)
cover.paste(display, (0, 0), mask)

# Assert the monitor, email, two floating panels and background are untouched.
outside = np.asarray(mask) == 0
assert np.array_equal(np.asarray(cover)[outside], np.asarray(photo)[outside])

for width, suffix in [(3840, '4k'), (1920, '1920'), (960, '960')]:
    output = ROOT / f'public/media/visual-covers/email-personalization-monitor-figma-{suffix}.webp'
    cover.resize((width, width * 2 // 3), Image.Resampling.LANCZOS).save(output, lossless=True, method=6)
    print(f'{output.name}: {output.stat().st_size} bytes')
