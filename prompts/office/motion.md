# Motion standard

Every variant has motion graphics: clients call plain variants basic, however good the layout. Motion must say
something: show this client's object, explain how the business works, or carry the visitor to the next idea.
Decoration that could sit on any site doesn't count, nor does a lone reveal.

The tone in `PITCH.md` sets how much: playful is loud and bouncy, professional precise and calm. Motion serves the
buyer's path: it never delays the core, the price or the action.

## What every variant must have
1. **An opening that never blocks.** Playful: the client's object or logo animates into the hero in 2-3 seconds and
   doubles as the preloader. Professional: at most a one-second reveal of the hero. Either way: skippable, once per
   session, landing exactly on its place in the hero and leaving it clean ("The hero" in `taste.md`).
2. **One signature scroll set-piece, 2-4 screens of pinning.** Scrolling drives a real sequence: something assembles,
   opens, travels, transforms or changes state. It sits where it explains the product, never between the visitor and
   the price or action. When the product suits it, the set-piece is the hero itself ("It moves" under "The hero" in
   `taste.md`): 1–3 screens, with `scrub.js` for a frame sequence, or GSAP ScrollTrigger and three.js for a 3D or
   layered product.
3. **Motion with a job in every section:** at least one drawn or animated element carrying that section's meaning.
   Playful: characters, stickers, bounce. Professional: counters, diagrams, product turns, precise reveals. In the hero
   it's the main visual itself, not an extra.
4. **A designed join between every two sections** ("Transitions" in section 3 of the playbook), carried by the client's
   object wherever it can.
5. **Something alive at rest:** the hero's main visual and key sections keep moving gently without scrolling (a slow
   loop, drifting layers, a cursor reaction), with no visible restart.
6. **A response to every touch:** hover and press states on everything clickable; animated results in the business tool.
7. **Moving page changes:** a short wipe, the View Transitions API, or the object carrying you across. Inner pages get
   their own motion graphics.

## Motion graphics to choose from
Drawn in SVG, canvas or WebGL. Pick what fits the client; never the same set in two variants.
- **Kinetic type:** headlines split into lines, words or letters that mask up, swap or stretch with scroll speed.
- **Line drawing:** illustrations, routes, stitches, diagrams and underlines draw themselves on scroll.
- **Shape morphing:** one form becomes another, such as the logo becoming the product.
- **Motion on a path:** the client's object travels a curve across the page and between sections.
- **Layered depth:** cut-outs of real photos move apart on scroll. Good when photos are few.
- **Particles and generative art** from the client's material: petals, bubbles, steam, sparks, grain.
- **Masks and reveals:** photos open through the client's shape, not a plain rectangle.
- **Animated information:** counters from real numbers, charts that draw, step diagrams that play, maps tracing a route.
- **Pinned sequences:** stacked cards, horizontal rails, flipping panels, 3D scenes, frame sequences.
- **Small icons that act:** icons drawn for this client, animating their meaning on hover.

## Where to start, by design family
Starting points only; the concept in `PITCH.md` wins.
- **One beautiful object:** it turns, opens or comes apart in 3D, parts named as they separate.
- **Packs and jars:** packs fly, stack and burst into their ingredients; the screen changes colour per flavour.
- **Solves a problem:** an animated diagram plays how the problem happens and how the product answers it.
- **Body and movement:** a 3D or line-drawn body moves on scroll, joints and muscles named as they work.
- **A place to visit:** the room opens as you enter, light moves from day to night, a route traces to the door.
- **Work worth showing:** work arrives through the client's own shapes; projects hand over with shared-element moves.
- **Trust and expertise:** real numbers count, charts and process diagrams draw themselves. Precise and calm.
- **Learning and community:** a learner's path draws itself through the method, progress unlocking each stage.
- **Origin and craft:** the making process plays as a line drawing, from source to finished piece.

## How to make it
- **No generated video is needed:** all of this can be made in code from the client's logo, photos and cut-outs. Use a
  good client film. AI video from a free tool is fine, never Higgsfield or a paid tool, and no hero depends on it.
- **Libraries** are in `PROJECT/variants/_shared/vendor/`. Copy only what you use into `site/js/vendor/`, no build step:
  - GSAP with ScrollTrigger for timelines and pinning, SplitText for kinetic type, DrawSVGPlugin for line drawing,
    MorphSVGPlugin for shape morphing, MotionPathPlugin for paths and Flip for shared-element moves.
  - Lenis for smooth scrolling, connected to ScrollTrigger so they share one clock.
  - three.js for 3D, with `gl-guard.js` and a still behind the canvas.
  - ogl for light WebGL backgrounds and shaders.
  - React Bits components, via `node KIT/tools/web/reactbits.cjs list` and `get <Name> --out site/js/reactbits`.
    They are React, so port the one you pick to plain JS: keep its shader, canvas or GSAP code, turn the effect into
    an `init(el, options)` that returns a cleanup, and keep the license header. Recolour and retime it for this client,
    so it reads as theirs, not as a stock effect.
- **Kit effects** (`scrub.js`, `prologue.js`, `stair.js`, `hotspots.js`, `film-control.js`) are ready-made; use them
  where they suit the concept.
- **Build motion with each section,** opening and set-piece first. Motion left to the end gets dropped, and nothing here
  extends your time limit.
- **Study how the reference moves:** read its live source for easing, duration and hand-overs. Take the ideas, not its
  files.

## Keep it good
- **Hierarchy:** one big thing moves at a time; copy stays still while people read it.
- **One motion language:** the same easing family and timing across a variant.
- **Smooth:** animate only `transform`, `opacity` and `clip-path`, never height, top or margin. Pause loops and canvases
  off screen; at most one WebGL canvas per page.
- **Light:** the first screen appears within 3 seconds. Compress every image; use SVG where it can replace one.
- **Phones:** keep the idea in lighter versions: shorter moves instead of long pinning, no heavy canvases.
- **Reduced motion:** every sequence ends in its finished state, nothing hidden; the page is complete without motion.
- **Recipes and numbers:** for an effect the concept already chose, find it in `prompts/techniques/INDEX.md` and open only
  that recipe (1-3 per variant, never the whole library). Timings, type sizes and bug fixes: `craft-numbers.md`. No
  signature effect in two variants. This file and `taste.md` win any conflict.
- **Professional tone, older audiences, serious topics:** the same craft, slower, fewer loops, no bounce, no sound.
