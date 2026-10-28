"""Hero film for a website: a timed animatic from storyboard keyframes, or the final film stitched from AI clips.

  python film.py animatic --frames <dir of 01_*.jpg ...> --holds 3,4,3,2 --out <site>/assets/film
  python film.py stitch   --segments <dir of seg-01.mp4 ...> --holds 3,4,3,2 --out <site>/assets/film [--poster f.jpg --still f.jpg]

Writes roast-style web encodes: <name>-1920.mp4, <name>-1280.mp4, <name>-1920.webm (24fps, no audio), plus
poster.webp (first keyframe) and still.webp (last keyframe, for reduced motion). Use --name to change "film".

Lessons baked in (each one broke playback before):
- JPEG keyframes are full-range; Chrome refused full-range VP9/H.264 (PIPELINE_ERROR_DECODE). Everything is
  converted to TV-range yuv420p.
- zoompan crops on whole pixels and judders at 1080p; the animatic push-in runs on a 4x frame.
- Image-to-video models render 5-10s clips. Each clip is time-fitted (not trimmed) to its slot so it still ends
  on its keyframe, and the repeated first frame of each following clip is dropped. Result: exactly sum(holds).
"""
import argparse
import glob
import os
import subprocess
import sys

FPS = 24
FIT = 'scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos,crop=1920:1080,setsar=1'
TV = 'scale=out_range=tv,format=yuv420p'
FADE = .4


def ff(*args):
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *args], check=True)


def duration(f):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f],
                                capture_output=True, text=True, check=True).stdout)


def encode(master, out, name, poster, still):
    os.makedirs(out, exist_ok=True)
    h264 = ['-an', '-c:v', 'libx264', '-preset', 'slow', '-profile:v', 'high', '-color_range', 'tv', '-movflags', '+faststart', '-r', str(FPS)]
    ff('-i', master, '-vf', TV, *h264, '-crf', '20', os.path.join(out, f'{name}-1920.mp4'))
    ff('-i', master, '-vf', f'scale=1280:-2:flags=lanczos,{TV}', *h264, '-crf', '22', os.path.join(out, f'{name}-1280.mp4'))
    ff('-i', master, '-vf', TV, '-an', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '33', '-row-mt', '1', '-color_range', 'tv', '-r', str(FPS), os.path.join(out, f'{name}-1920.webm'))
    if poster:
        ff('-i', poster, '-vf', FIT, '-q:v', '82', os.path.join(out, 'poster.webp'))
    if still:
        ff('-i', still, '-vf', FIT, '-q:v', '82', os.path.join(out, 'still.webp'))
    for f in sorted(os.listdir(out)):
        print(f'  {f:22} {os.path.getsize(os.path.join(out, f)) / 1e6:6.2f} MB')


def animatic(frames, holds, out, name):
    files = sorted(glob.glob(os.path.join(frames, '*.jpg')) + glob.glob(os.path.join(frames, '*.png')))
    if len(files) != len(holds):
        sys.exit(f'{len(files)} keyframes in {frames} but {len(holds)} holds')
    args, chains = [], []
    for i, (f, hold) in enumerate(zip(files, holds)):
        args += ['-loop', '1', '-t', f'{hold + (FADE if i < len(files) - 1 else 0)}', '-i', f]
        chains.append(f"[{i}:v]{FIT},fps={FPS},scale=7680:4320:flags=lanczos,zoompan=z='1+0.0005*on'"
                      f":x='(iw-iw/zoom)*0.5':y='(ih-ih/zoom)*0.5':d=1:s=1920x1080:fps={FPS},{TV}[v{i}]")
    t, prev = 0, 'v0'
    for i in range(1, len(files)):
        t += holds[i - 1]
        nxt = f'x{i}' if i < len(files) - 1 else 'out'
        chains.append(f'[{prev}][v{i}]xfade=transition=fade:duration={FADE}:offset={t}[{nxt}]')
        prev = nxt
    master = os.path.join(out, '_master.mp4')
    os.makedirs(out, exist_ok=True)
    ff(*args, '-filter_complex', ';'.join(chains), '-map', f'[{prev}]', '-t', str(sum(holds)), '-c:v', 'libx264', '-crf', '14', master)
    encode(master, out, name, files[0], files[-1])
    os.remove(master)


def stitch(segments, holds, out, name, poster, still):
    segs = sorted(glob.glob(os.path.join(segments, 'seg-*.mp4')))
    if len(segs) != len(holds):
        sys.exit(f'{len(segs)} segments in {segments} but {len(holds)} holds')
    args, chains = [], []
    for i, (s, dur) in enumerate(zip(segs, holds)):
        args += ['-i', s]
        src, skip = duration(s), (0 if i == 0 else 1 / FPS)
        print(f'  {os.path.basename(s)}: {src:.2f}s -> {dur}s ({src / dur:.2f}x)')
        chains.append(f'[{i}:v]{FIT},setpts={(dur + skip) / src:.6f}*PTS,fps={FPS},trim=start={skip}:duration={dur},setpts=PTS-STARTPTS,{TV}[s{i}]')
    chains.append(''.join(f'[s{i}]' for i in range(len(segs))) + f'concat=n={len(segs)}:v=1:a=0[out]')
    master = os.path.join(out, '_master.mp4')
    os.makedirs(out, exist_ok=True)
    ff(*args, '-filter_complex', ';'.join(chains), '-map', '[out]', '-c:v', 'libx264', '-crf', '14', master)
    encode(master, out, name, poster, still)
    os.remove(master)


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('cmd', choices=['animatic', 'stitch'])
    ap.add_argument('--frames')
    ap.add_argument('--segments')
    ap.add_argument('--holds', default='3,4,3,2', help='seconds per keyframe / segment')
    ap.add_argument('--out', required=True)
    ap.add_argument('--name', default='film')
    ap.add_argument('--poster')
    ap.add_argument('--still')
    a = ap.parse_args()
    holds = [float(h) for h in a.holds.split(',')]
    if a.cmd == 'animatic':
        animatic(a.frames, holds, a.out, a.name)
    else:
        stitch(a.segments, holds, a.out, a.name, a.poster, a.still)
