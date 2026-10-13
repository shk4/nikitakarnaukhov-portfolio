from pathlib import Path
from PIL import Image, ImageFilter, ImageChops
import json, math, subprocess, sys

ROOT = Path(__file__).resolve().parent
OUT = Path(sys.argv[sys.argv.index('--output') + 1]) if '--output' in sys.argv else ROOT
OUT.mkdir(parents=True, exist_ok=True)
W, H, FPS, DURATION = 2560, 1200, 30, 12
SPEED, SOURCE_DURATION = 1.5, 18
PAD = 64
layout = json.loads((ROOT / 'mosaic-layout.json').read_text())
cards = layout['cards']
assets = {}
for card in cards:
    key = card['sourceId']
    if key in assets:
        continue
    src = Image.open(ROOT / 'mosaic-assets' / (key.replace(':', '-') + '.png')).convert('RGBA')
    p = PAD * 2
    alpha = Image.new('L', (src.width + p * 2, src.height + p * 2))
    alpha.paste(src.getchannel('A'), (p, p + 36))
    alpha = alpha.filter(ImageFilter.GaussianBlur(40)).point(lambda n: round(n * .10))
    im = Image.new('RGBA', alpha.size, (20, 33, 46, 0))
    im.putalpha(alpha)
    im.alpha_composite(src, (p, p))
    assets[key] = im

rest_layers = {k: v.resize((round(v.width / 2), round(v.height / 2)), Image.Resampling.LANCZOS) for k, v in assets.items()}
background = Image.new('RGBA', (W, H), (48, 51, 50, 255))
still_cache = {}

def clamp(n):
    return max(0., min(1., n))

def motion(slot, t):
    delay = (slot // 2) * .32 + (slot % 2) * .55
    t = (t * SPEED) % SOURCE_DURATION
    current, progress = 0, -1.
    for wave in range(3):
        dt = t - (1.2 + wave * 6 + delay)
        if 0 <= dt < .95:
            current, progress = wave, dt / .95
            break
        if dt >= .95:
            current = (wave + 1) % 3
    if progress < 0:
        return [(current, 1., 0., 1.)]
    p = clamp(progress / .43)
    q = clamp((progress - .39) / .61)
    ease = 1 - (1 - q) ** 3
    return [(current, 1 - p, -38 * p, 1 - .018 * p),
            ((current + 1) % 3, q, 45 * (1 - ease), .975 + .025 * ease)]

def render(t):
    states = [motion(slot, t) for slot in range(8)]
    stationary = all(len(s) == 1 for s in states)
    key = tuple(s[0][0] for s in states)
    if stationary and key in still_cache:
        return still_cache[key]
    frame = background.copy()
    for slot, layers in enumerate(states):
        for variant, opacity, dy, scale in layers:
            if opacity <= 0:
                continue
            card = cards[slot * 3 + variant]
            src = assets[card['sourceId']]
            im = rest_layers[card['sourceId']] if abs(scale - 1) < 1e-9 else src.resize(
                (round(src.width * scale / 2), round(src.height * scale / 2)), Image.Resampling.LANCZOS)
            if opacity < 1:
                im = im.copy()
                im.putalpha(im.getchannel('A').point([round(n * opacity) for n in range(256)]))
            x = round(card['x'] + card['width'] / 2 - im.width / 2)
            y = round(card['y'] + card['height'] / 2 + dy - im.height / 2)
            frame.alpha_composite(im, (x, y))
    rgb = frame.convert('RGB')
    if stationary:
        still_cache[key] = rgb
    return rgb

def samples():
    times = [0, 1.0, 2.35 / SPEED, 4.0 / SPEED, 8.3 / SPEED, 10.0 / SPEED, 14.4 / SPEED, DURATION - 1 / FPS]
    for t in times:
        render(t).save(OUT / f'mosaic-check-{t:05.2f}.png')
    if not (OUT / 'live-mosaic-poster.png').exists():
        render(0).save(OUT / 'live-mosaic-poster.png')
    seam = ImageChops.difference(render(0), render(DURATION)).getbbox()
    last = ImageChops.difference(render(0), render(DURATION - 1 / FPS)).getbbox()
    print(json.dumps({'loop_boundary_equal': seam is None, 'last_frame_equal': last is None, 'source_windows': len(assets)}), flush=True)

if __name__ == '__main__':
    samples()
    if '--samples' in sys.argv:
        sys.exit(0)
    cmd = ['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
           '-s', f'{W}x{H}', '-r', str(FPS), '-i', 'pipe:0', '-an',
           '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p',
           '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-threads', '4',
           '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
           '-movflags', '+faststart', str(OUT / 'live-mosaic-2k.mp4')]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for frame in range(FPS * DURATION):
        proc.stdin.write(render(frame / FPS).tobytes())
        if frame % 90 == 0:
            print(f'Rendered {frame}/{FPS * DURATION}', flush=True)
    proc.stdin.close()
    if proc.wait():
        raise SystemExit('Encoding failed')
    print(json.dumps({'complete': True, 'bytes': (OUT / 'live-mosaic-2k.mp4').stat().st_size}), flush=True)
