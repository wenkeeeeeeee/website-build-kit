# Technique library

One effect per recipe: what it does, the code (plain HTML/CSS/JS, GSAP, Lenis, three.js), and its phone and
reduced-motion behaviour. Find the row, open that file; nobody reads it all.

Adapted from MotionSites (github.com/Motionsites-AI/claude-skill, MIT, © 2026 MotionSites; licence text in the kit at
`licenses/motionsites.LICENSE`). Each recipe's first line names the section it came from.

## Rules
1. Open a recipe only for an effect the variant's concept already chose. The library doesn't pick the concept.
2. Open only the rows you need: 1-3 files per variant.
3. Don't use the same signature effect in two variants.
4. Your own brief or the kit's playbook (`website-playbook.md`, `office/motion.md`, `office/taste.md`) wins on any conflict.
5. Recipe code is a starting point. Restyle and retime it to the variant, and fill it with the client's real material.

## Shared setup (every recipe assumes this)
- **Tokens.** Recipes use only CSS custom properties. Set per variant: `--font-display`, `--font-body`, `--font-mono`,
  `--bg`, `--ink`, `--muted`, `--accent`, `--accent-ink` (text on accent), `--surface`, `--line`. A few recipes add a
  role token with a fallback (`--on-media`, `--shadow`, `--shine`, `--ring-deep`, `--blend-light`, `--header-h`).
- **Easing.** `--ease-out: cubic-bezier(.16,1,.3,1); --ease-in-out: cubic-bezier(.65,0,.35,1);` In GSAP, `expo.out`
  and `power2.inOut` match them. Bounce and springs only for a playful tone.
- **Libraries.** GSAP (+ ScrollTrigger, SplitText and other plugins), Lenis, three.js (`three.module.js` +
  `three.core.js`, addons). Serve local copies, not a CDN: from npm, or a local copy in `js/vendor/` (kit builds; three.js
  in `js/vendor/three/`, addons in `js/vendor/three/addons/`). Recipe code uses the `js/vendor/` paths.
- **Numbers and claims** show as `[placeholder]` wired to content data. Only real client numbers.
- **Video.** At most 3 per page, one playing at a time, only the first preloaded, under 4 MB of film on a home page.
  Never loop or rewind a short clip; a loop over 5s needs a pause button.
- **Blur entrances** are ported as mask or rise. Blur variants are held until the owner decides.
- **Kit tools** some recipes name. Without the kit, do the same job yourself:
  - `serve.py`: local server with no caching and byte ranges (video seek and loop work). Otherwise any static server
    with range support; never `file://`.
  - `film.py`: encodes a film to 1280 mp4, 1920 webm + mp4, a poster and a last-frame still. Otherwise ffmpeg (24fps,
    no audio, TV-range yuv420p).
  - `frames.py` + `scrub.js`: a frame sequence drawn to a canvas as you scroll (a "video moves with scroll" hero).
    Otherwise export webp frames with ffmpeg and draw the frame for scroll progress on a sticky canvas.
  - `film-control.js`: pause button, off-screen pause, no autoplay under reduced motion. Otherwise write those three.
  - `gl-guard.js`: frees WebGL contexts when a page hides and checks WebGL support. Otherwise check support yourself,
    handle `webglcontextlost` and dispose the renderer on `pagehide`.
  - `check-pages.cjs`: screenshots pages at real sizes and flags overflow, tall sections and failed media. Otherwise
    take the screenshots with Playwright.

**Cost** on a mid-range phone: light = CSS or a little JS; medium = per-frame work, filters or extra media;
heavy = WebGL, several videos or big media.

## Recipes

| File | What it does | Needs | Phone | Cost |
|---|---|---|---|---|
| video/01-background-video-layer.md | Full-bleed hero film: fade-in, off-screen pause, serving rules | A film, a poster, a separate still | Plays the 1280 source; refocus with object-position | medium |
| video/03-video-framing.md | Places the film's subject: oversize, offset, lower band, focal crop, bleed | A film (oversize and bleed need a source 1.2x display size) | Below 1024px the film is its own block above the copy | light |
| video/04-edge-blend-scrims.md | Eased fades melt a film into the page colour and protect the copy | Nothing (any film or photo behind copy) | Portrait scrim switches on by aspect ratio | light |
| video/05-progressive-bottom-blur.md | Blur band at the media's bottom so bottom-set titles stay readable | A film or photo behind bottom-set copy | One blur layer only | medium |
| video/06-cursor-scrubbed-video.md | Mouse movement scrubs a turntable or opening clip (single or split pair) | A turntable or opening clip of the real product | Scrolling through the hero scrubs it | medium |
| video/09-video-scene-switcher.md | Named buttons crossfade up to 3 scene films; text colour adapts | 2-3 long films of real places, posters | Only the active scene loads; others on tap | heavy |
| surfaces/03-metal-and-halo-buttons.md | Machined metal CTA with a light sweep, or a glowing halo pill on a dark hero | Nothing | Press state, optional sweep on tap | light |
| surfaces/04-text-roll-button.md | Label rolls to a fresh copy and the arrow chip turns | Nothing | Roll runs on press | light |
| surfaces/05-sliding-fill-buttons.md | Colour panel wipes across the button and the label inverts | Nothing | Wipe runs on press | light |
| surfaces/06-gradient-border-ring.md | Ring spins round the one main CTA, or appears on hover | Nothing | Spin as is; hover ring always on or on press | light |
| surfaces/07-media-card-hover.md | Corner icon opens into a labelled pill; the photo zooms a little | Client photos per card | Pill shown open, no zoom | light |
| surfaces/08-texture-overlays.md | Grain, noise inside type, halftone or dot grid against a flat digital look | Nothing | Grain kept; SVG text filters off at 1024px and below | light |
| type/01-rise-entrance.md | Hero load reveal: elements rise in reading order, media settles | Nothing (settle needs a source 1.2x display size) | Same, shorter rises | light |
| type/02-entrance-vocabulary.md | Fail-safe load reveal with a set of moves; the page is never blank | Nothing | Same, shorter timeline | light |
| type/04-split-text.md | Headlines build by line, word or letter out of a mask | Nothing | Same; hero stagger under about 1s | light |
| type/07-scramble-text.md | Text decodes from random glyphs on entrance and hover (tech and data brands) | A monospace face that suits the client | Entrance plays; press state, not hover | light |
| type/08-typewriter.md | Typed headline, caret with no reflow, reply pills open WhatsApp or the form | Real reply options and contact details | Same; pills wrap, 44px tall | light |
| type/09-rotating-word.md | One word cycles once through real options, then lands | 3-5 real options from the client's offer | Same; check the longest word at 360px | light |
| type/11-giant-type.md | Giant type as architecture: behind a cut-out, edge-to-edge, watermark, scattered | Ghost word: one clean cut-out; others: nothing | Recheck word and subject overlap at 375px | light |
| type/12-type-word-assembly.md | A giant word built from SVG blocks sliding up (never the client's logo) | Nothing (a short word with straight strokes) | Scales with width; shorter word if needed | light |
| type/13-count-up.md | Real numbers count up when seen; optional counter opening that never blocks | Real client numbers | Count-up as is; counter under 2s or dropped | light |
| depth/01-depth-carousel.md | Products move through centre, side and back slots; ground washes to each colour | 3-6 matching cut-outs, one colour each | Swipe; smaller slots | medium |
| depth/02-magnetic-hover.md | Subject or CTA drifts toward the cursor and floats back | Nothing (best on a cut-out) | Leans toward the finger on press | light |
| depth/03-pointer-parallax-layers.md | Layered cut-outs drift by depth with the pointer | Layered cut-outs over a backdrop | Layers part with scroll instead | light |
| depth/04-spotlight-reveal.md | A soft circle following the cursor reveals a second aligned image | Two aligned images | Smaller spot sweeps with scroll; tap or drag moves it | medium |
| depth/05-object-image-trail.md | The client's photos or cut-outs trail the cursor over a closing block | 4-8 client photos or cut-outs | Tap throws a burst of three | medium |
| depth/06-exclusion-blend-ui.md | Fixed light UI and cursor invert over dark and light sections | Nothing (object icon for the cursor optional) | Overlay works; custom cursor off | light |
| scroll/01-staggered-reveal.md | Blocks rise in, staggered, when seen; optional cut-outs slide into corners | Nothing (four clean cut-outs for corners) | Works; smaller corner objects | light |
| scroll/03-panel-slide-over-gallery.md | Panel slides over a sticky hero; scattered tall photos grow; action pill at the end | 8-12 sharp tall photos, a hero still or film | Two columns, full-width pill | medium |
| scroll/04-pinned-heading-parallax-columns.md | Heading pinned about 2 screens while photo columns drift at different speeds | 6+ sharp square photos | No pin; two-up stack, half-speed drift | medium |
| scroll/05-stacking-cards.md | Cards pin one after another; those beneath scale down | 3-5 items with real photos and facts | Kept; shorter slots, 3 cards | medium |
| scroll/06-opposing-marquee-rows.md | Two photo rows slide in opposite directions on scroll | 8-16 landscape photos | Works; lower speed | medium |
| layout/01-hero-compositions.md | Where copy sits over a full-bleed hero visual (layouts A, B, C, E, H) | One full-bleed visual of the subject with a calm area | Copy stacks low, clear of the subject | light |
| layout/03-floating-pill-nav.md | Header as a floating solid pill, dot pill, bottom dock or text nav | Nothing | Links move to the menu; main action stays in the bar | light |
| layout/04-capsule-menu.md | A burger square wipes open into a capsule of 2-4 links | Nothing | Hidden below 640px; mobile menu takes over | light |
| layout/05-mobile-menu.md | Burger to X, plus staggered overlay, side drawer or bottom sheet | Nothing | This is the phone pattern | light |
| layout/06-trust-cluster.md | Overlapping photos tucked into a pill with one real claim | 3 real customer photos or partner logos, one real claim | One line, claim about 30 characters | light |
| layout/07-chip-group.md | Multi-select chips with a check; a summary fills the quote or WhatsApp message | The client's real list of services or options | Chips wrap at 44px | light |
| layout/09-grid-to-snap-rail.md | 3-4 comparison cards: grid on desktop, snapping swipe rail on phone | 3-4 real offers with prices | Snap rail, next card peeking | light |
| layout/10-infinite-marquee.md | Seamless logo, photo or giant-text strip with edge fade | Real logos, 6+ photos, or one phrase in the client's words | Runs as is; shorter photo strip | light |
| layout/11-looping-card-slider.md | Card carousel that loops both ways, with buttons | 4-6 real cards (branches, reviews, projects) | Narrower cards; swipe, or use the snap rail | light |
| 3d/01-model-hero-rig.md | Real GLB product, centred, drag to turn with inertia, idle sway, still fallback | GLB of the real product (3-5 MB max), a still render or photo | Horizontal drag turns, vertical swipe scrolls; pin 1 screen at most | heavy |

## Held, not ported
Source sections that clash with our rules or fit poorly. The owner decides later. ("Glass" and "tell" mean a look that
reads as AI-made.)

- video-and-media.md #2 Seamless loop with fades: loops a short clip through a dip to black.
- video-and-media.md #3 (part G) footer reuse of the hero clip: same film twice, an extra video.
- video-and-media.md #7 Scroll-scrubbed video with runtime frame cache: heavy; `frames.py` + `scrub.js` do this.
- video-and-media.md #8 Boomerang loop: plays a clip back and forth.
- surfaces-and-buttons.md #1 Liquid-glass surface: glass.
- surfaces-and-buttons.md #2 Frosted glass UI over video: glass cards, text on glass over video.
- surfaces-and-buttons.md #3 (parts) frosted ghost button, jewel-gradient pill, metal badge with sparkle: glass, a fixed jewel palette, a badge with no job.
- surfaces-and-buttons.md #7 (part) frosted veil over cards: glass, italic-serif title.
- type-and-text-motion.md #1 (parts) glass hero and split hero timelines: glass cards; copy one side, picture the other.
- type-and-text-motion.md #2 (parts) blur-sharpen accent word, sparkle star: blur on an italic accent; a sparkle tell.
- type-and-text-motion.md #3 Word-by-word blur-in: without blur it repeats type/04.
- type-and-text-motion.md #5 Serif-italic accent word: a tell.
- type-and-text-motion.md #6 Gradient text: a tell.
- type-and-text-motion.md #8 (part) blurred depth-of-field lead-in line: held with the blur variants.
- type-and-text-motion.md #10 Scroll word-opacity reveal: leaves text half-faded by scroll position.
- type-and-text-motion.md #11 (parts) metallic or gradient wordmark fill; name-as-hero wordmark: gradient text; a name isn't the subject.
- type-and-text-motion.md #12 SVG wordmark assembly as a logo: ported only as a giant type word, never the client's logo.
- depth-and-interaction.md #6 (part) glyph that changes at random on scroll: decoration with no job.
- depth-and-interaction.md #7 Orbit rings with avatars: heavy, poor fit, placeholder counts.
- depth-and-interaction.md #8 Sand-dissolve transition: heavy SVG filter on bitmaps, poor fit.
- scroll.md #2 Sticky cinematic stage: heavy, poor fit.
- scroll.md #7 3D tilted text crawl: copy moves while read and sits half-faded.
- layout-and-ui.md #1 (layout D) Swiss corner: big stats lead the hero.
- layout-and-ui.md #1 (layout F) framed hero card: the hero in a box.
- layout-and-ui.md #1 (layout G) split glass panel: glass; copy one side, picture the other.
- layout-and-ui.md #2 Viewport-locked hero: clashes with the one-screen and phone rules.
- layout-and-ui.md #3 (part b) frosted white pill nav: glass.
- layout-and-ui.md #6 (part) glass chip with italic-serif names: glass, italic tell.
- layout-and-ui.md #8 Fake product UI mockup: invents product screens.
- 3d-and-webgl.md #1 copy-left, stage-right layout: banned split hero. The rig is ported, subject centred.
- 3d-and-webgl.md #2 fbm shader backdrop: heavy, poor fit.
