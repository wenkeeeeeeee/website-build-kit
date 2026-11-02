# Motion standard

Clients have told us plain variants look basic, even when the layout and content are good. From now on, motion graphics
and animation are part of every variant. A visitor should feel the site was animated by a motion designer, not that a
page was given fade-ins.

Motion still has to say something. It shows this client's object, explains how the business works, or carries the
visitor to the next idea. Decoration that could sit on any site doesn't count, and nor does a reveal on its own.

## What every variant must have
1. **An opening sequence, 2-4 seconds.** The client's own object or logo animates into the hero, and the opening doubles
   as the preloader. It's skippable, it shows once per session, and it lands exactly on its place in the hero.
2. **A signature scroll set-piece, 3-5 screens of pinning.** Scrolling drives a real sequence: something assembles,
   opens, travels, transforms or changes state.
3. **A motion graphic in every section.** At least one drawn or animated element that carries meaning for that section.
   See the list below. A section with only fade-ins is unfinished.
4. **A designed join between every two sections.** Follow "Transitions" in section 3 of the playbook. The client's object
   carries the change wherever it can.
5. **Something alive at rest.** The first screen and the key sections keep moving gently without any scrolling: a slow
   loop, drifting layers or a reaction to the cursor. It must loop without a visible restart.
6. **A response to every touch.** Hover and press states on everything clickable, and animated results in the business
   tool, so choosing an option visibly changes something.
7. **Moving page changes.** A wipe, or the object carrying you across, and inner pages get their own motion graphics.

## Motion graphics to choose from
Draw these yourself in SVG, canvas or WebGL. Pick what fits the client, and don't use the same set in two variants.
- **Kinetic type:** headlines split into lines, words or letters that mask up, swap, stretch with scroll speed or get
  replaced by the client's object. Giant words move on scroll.
- **Line drawing:** illustrations, routes, stitches, diagrams and underlines draw themselves as you scroll.
- **Shape morphing:** one form becomes another, such as the logo becoming the product or a section divider changing shape.
- **Motion on a path:** the client's object travels along a curve across the page and between sections.
- **Layered depth:** cut-outs of real photos split into layers that move apart on scroll. Good when photos are few.
- **Particles and generative art:** made from the client's material, such as petals, bubbles, steam, sparks or grain.
  Cursor-reactive where it helps.
- **Masks and reveals:** photos open through the client's shape, not a plain rectangle.
- **Animated information:** counters from real numbers, charts that draw, step diagrams that play, maps that trace a route.
- **Pinned sequences:** stacked cards, horizontal rails, panels that flip, 3D scenes, frame sequences.
- **Small icons that act:** icons drawn for this client, which animate their meaning on hover.

## Where to start, by design family
These are starting points. The concept in `PITCH.md` wins.
- **One beautiful object:** it turns, opens or comes apart in 3D, with parts named as they separate.
- **Packs and jars:** packs fly, stack and burst into their ingredients, and the whole screen changes colour per flavour.
- **Solves a problem:** an animated diagram plays how the problem happens and how the product answers it, step by step.
- **A place to visit:** the room opens as you enter, the light moves from day to night, a route traces to the door.
- **Work worth showing:** work arrives through the client's own shapes, and projects hand over with shared-element moves.
- **Trust and expertise:** real numbers count, charts and process diagrams draw themselves. Motion stays precise and calm.
- **Learning and community:** a learner's path draws itself through the method, with progress unlocking each stage.
- **Origin and craft:** the making process plays as a line drawing, and the material travels from source to finished piece.

## How to make it
- **No generated video is needed.** AI video isn't normally available, so never plan a variant around it. Everything
  above can be made in code from the client's logo, photos and cut-outs. If the client has a good film, use it.
- **Libraries** are in `PROJECT/variants/_shared/vendor/`. Copy only what your variant uses into `site/js/vendor/`, with no
  build step:
  - GSAP with ScrollTrigger for timelines and pinning, SplitText for kinetic type, DrawSVGPlugin for line drawing,
    MorphSVGPlugin for shape morphing, MotionPathPlugin for paths and Flip for shared-element moves.
  - Lenis for smooth scrolling. Connect it to ScrollTrigger so they share one clock.
  - three.js for 3D, with `gl-guard.js` and a still behind the canvas.
- **Kit effects** (`scrub.js`, `prologue.js`, `stair.js`, `hotspots.js`, `film-control.js`) are ready-made. Use them where
  they suit the concept, and then add the rest.
- **Build motion as you build each section,** starting with the opening and the set-piece. Motion left to the end gets
  dropped when time runs out. Nothing here extends your time limit.
- **Study how the reference moves.** Read the live source, and take its easing, duration and how it hands over. Use the
  ideas, not its files.

## Keep it good
- **Hierarchy:** one big thing moves at a time, and copy stays readable and still while people read it.
- **One motion language:** the same easing family and timing across a variant.
- **Smooth:** animate only `transform`, `opacity` and `clip-path`. Pause loops and canvases off screen, and use no more
  than one WebGL canvas per page.
- **Light:** the first screen appears within 3 seconds. Compress every image, and use SVG wherever it can replace one.
- **Phones:** keep the idea with lighter versions. Replace long pinning with shorter moves and drop heavy canvases.
- **Reduced motion:** every sequence ends in its finished state, with nothing hidden, and the page is complete without it.
- **Older audiences and serious topics:** keep the same amount of craft, but slow it down and use fewer loops.
