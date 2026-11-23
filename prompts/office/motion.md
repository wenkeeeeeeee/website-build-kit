# Motion: how to build it

What motion must achieve is in "Motion" in `taste.md`. This file is the toolbox. Everything runs in static HTML, CSS and
plain JS, no build step.

## Libraries
In `PROJECT/variants/_shared/vendor/` (or `tools/node_modules/` in a skill build). Copy only what you use into
`site/js/vendor/`.
- **GSAP with every plugin** (all free): ScrollTrigger for timelines and pinning, SplitText for masked line, word and
  letter reveals, Flip for shared-element moves, DrawSVG, MorphSVG, MotionPath, Observer, Inertia.
- **Lenis** for smooth scrolling, on the same clock as ScrollTrigger.
- **three.js** for 3D (GLTFLoader, DRACO, RGBELoader for HDRI lighting) and **ogl** for light WebGL shaders: image
  reveals, hover ripples, images bending with scroll speed. Load `gl-guard.js` first, keep a still behind the canvas,
  pause off screen, one canvas per page where you can.
- **CSS:** scroll-driven animations and the View Transitions API (`@view-transition { navigation: auto; }`) for page
  changes.

## Ready-made code
- **Kit effects** in `tools/web/`: `scrub.js` (scroll-scrubbed frame sequences from `frames.py`), `film-control.js`,
  `stair.js`, `hotspots.js`, `prologue.js`.
- **Recipes** in `prompts/techniques/INDEX.md`: open only the ones your idea needs.
- **Code sources** in "Code and components" in `reference-library.md`: Codrops demos are plain JS already; React
  components (React Bits via `tools/web/reactbits.cjs list` and `get <Name> --out site/js/reactbits`, Aceternity,
  21st.dev) get ported: keep the shader, canvas or GSAP code, wrap it as `init(el, options)` returning a cleanup, keep
  its licence header, and rebuild it with the client's photos, words, fonts and colours so it reads as theirs.
- **Study how a reference moves:** read its live source for easing, duration and hand-overs. Take timing, never its
  layout, images or files.

## Keep it good
- **Build motion with each section,** opening and signature moment first: motion left to the end gets dropped.
- **One motion language** per variant: one easing family, one timing scale. One big thing moves at a time; copy stays
  still while it's read.
- **Smooth:** animate `transform`, `opacity`, `clip-path` and shader uniforms, never height, top or margin.
  Scroll-linked motion eases toward its target; triggered reveals stagger over 0.6-1s on a long ease-out such as
  `cubic-bezier(.16,1,.3,1)`.
- **Light:** the first screen within 3 seconds. Compress images and models (`gltf-transform`), lazy-load below the fold.
- **Phones:** the same idea, lighter: shorter moves, smaller or no canvases, a still or short film where WebGL is heavy.
- **Reduced motion:** every sequence ends in its finished state; the page is complete without motion.
- **Pinned scenes never start or end empty;** keep the last state visible.
- Timings, type sizes and known bugs: `craft-numbers.md`.
