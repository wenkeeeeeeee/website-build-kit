"""Frame sequences for scroll-scrubbed heroes (scrub.js).

From a video:      python frames.py <film.mp4> --out <site>/assets/scrub/hero --count 120
From keyframes:    python frames.py <dir of 01.png 02.png ...> --out ... --count 120   (cross-dissolve + slow push-in)
Options: --width 1280 (desktop set)  --mobile 720 (second set in m/, 0 to skip)  --start/--end seconds  --q 72

Writes <out>/0001.webp ... and <out>/m/0001.webp, plus <out>/frames.json {count, w, h, mobile}.
Encodes come from ffmpeg in TV range so colours match the video encodes (see film.py).
"""
import argparse, json, os, shutil, subprocess, sys, tempfile
from pathlib import Path


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.exit(r.stderr[-2000:])
    return r.stdout


def probe(path):
    out = run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'format=duration:stream=width,height',
               '-of', 'json', str(path)])
    j = json.loads(out)
    s = j['streams'][0]
    return float(j['format']['duration']), s['width'], s['height']


def from_video(src, tmp, count, start, end):
    dur, _, _ = probe(src)
    end = end or dur
    span = end - start
    # sample `count` evenly spaced frames over [start, end)
    run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{start}', '-t', f'{span}', '-i', str(src),
         '-vf', f'fps={count / span:.6f}', '-frames:v', str(count), '-q:v', '2', str(tmp / '%04d.png')])


def from_keyframes(folder, tmp, count):
    from PIL import Image
    keys = sorted(p for p in folder.iterdir() if p.suffix.lower() in ('.png', '.jpg', '.jpeg', '.webp'))
    if len(keys) < 2:
        sys.exit('need at least two keyframes')
    ims = [Image.open(k).convert('RGB') for k in keys]
    W, H = ims[0].size
    ims = [im.resize((W, H), Image.LANCZOS) for im in ims]
    segs = len(ims) - 1
    for i in range(count):
        t = i / (count - 1) * segs
        a = min(int(t), segs - 1)
        f = t - a
        f = f * f * (3 - 2 * f)  # ease the dissolve
        frame = Image.blend(ims[a], ims[a + 1], f)
        z = 1 + 0.06 * (i / (count - 1))  # slow push-in, rendered from the full-size frame
        cw, ch = W / z, H / z
        frame = frame.resize((W, H), Image.LANCZOS, box=((W - cw) / 2, (H - ch) / 2, (W + cw) / 2, (H + ch) / 2))
        frame.save(tmp / f'{i + 1:04d}.png')


def encode(tmp, dest, width, q):
    dest.mkdir(parents=True, exist_ok=True)
    for f in dest.glob('*.webp'):
        f.unlink()
    run(['ffmpeg', '-v', 'error', '-y', '-i', str(tmp / '%04d.png'),
         '-vf', f'scale={width}:-2:flags=lanczos', '-c:v', 'libwebp', '-quality', str(q),
         '-compression_level', '6', str(dest / '%04d.webp')])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src')
    ap.add_argument('--out', required=True)
    ap.add_argument('--count', type=int, default=120)
    ap.add_argument('--width', type=int, default=1280)
    ap.add_argument('--mobile', type=int, default=720)
    ap.add_argument('--start', type=float, default=0)
    ap.add_argument('--end', type=float, default=0)
    ap.add_argument('--q', type=int, default=72)
    a = ap.parse_args()
    src, out = Path(a.src), Path(a.out)
    tmp = Path(tempfile.mkdtemp())
    try:
        if src.is_dir():
            from_keyframes(src, tmp, a.count)
        else:
            from_video(src, tmp, a.count, a.start, a.end)
        n = len(list(tmp.glob('*.png')))
        encode(tmp, out, a.width, a.q)
        if a.mobile:
            encode(tmp, out / 'm', a.mobile, a.q)
        from PIL import Image
        w, h = Image.open(out / '0001.webp').size
        (out / 'frames.json').write_text(json.dumps({'count': n, 'w': w, 'h': h, 'mobile': bool(a.mobile)}))
        size = sum(f.stat().st_size for f in out.rglob('*.webp')) / 1e6
        print(f'{n} frames {w}x{h} -> {out} ({size:.1f} MB total)')
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == '__main__':
    main()
