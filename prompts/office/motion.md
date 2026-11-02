# Motion standard

Clients call plain variants basic, even when the layout and content are good, so motion graphics are part of every
variant. Motion must also say something: show this client's object, explain how the business works, or carry the visitor
to the next idea. Decoration that could sit on any site doesn't count, and nor does a reveal on its own.

## What every variant must have
1. **An opening sequence, 2-4 seconds.** The client's object or logo animates into the hero and doubles as the preloader.
   It's skippable, shows once per session, and lands exactly on its place in the hero. It then leaves the hero clean, as
   "The hero" in `taste.md` says.
2. **A signature scroll set-piece, 3-5 screens of pinning.** Scrolling drives a real sequence: something assembles,
   opens, travels, transforms or changes state.
3. **A motion graphic in every section.** At least one drawn or animated element that carries meaning for that section.
   In the hero, that's the main visual itself, not an extra element.
4. **A designed join between every two sections.** Follow "Transitions" in section 3 of the playbook. The client's object
   carries the change wherever it can.
5. **Something alive at rest.** The hero's main visual and the key sections keep moving gently without scrolling: a slow
   loop, drifting layers or a reaction to the cursor, with no visible restart.
6. **A response to every touch.** Hover and press states on everything clickable, and animated results in the business
   tool.
7. **Moving page changes.** A wipe, or the object carrying you across, and inner pages get their own motion graphics.

## Motion graphics to choose from
Draw these in SVG, canvas or WebGL. Pick what fits the client, and don't use the same set in two variants.
- **Kinetic type:** headlines split into lines, words or letters that mask up, swap or stretch with scroll speed.
- **Line drawing:** illustrations, routes, stitches, diagrams and underlines draw themselves as you scroll.
- **Shape morphing:** one form becomes another, such as the logo becoming the product.
- **Motion on a path:** the client's object travels along a curve across the page and between sections.
- **Layered depth:** cut-outs of real photos move apart on scroll. Good when photos are few.
- **Particles and generative art:** made from the client's material, such as petals, bubbles, steam, sparks or grain.
- **Masks and reveals:** photos open through the client's shape, not a plain rectangle.
- **Animated information:** counters from real numbers, charts that draw, step diagrams that play, maps that trace a route.
- **Pinned sequences:** stacked cards, horizontal rails, panels that flip, 3D scenes, frame sequences.
- **Small icons that act:** icons drawn for this client, which animate their meaning on hover.

## Where to start, by design family
Starting points only. The concept in `PITCH.md` wins.
- **One beautiful object:** it turns, opens or comes apart in 3D, with parts named as they separate.
- **Packs and jars:** packs fly, stack and burst into their ingredients, and the screen changes colour per flavour.
- **Solves a problem:** an animated diagram plays how the problem happens and how the product answers it.
- **Body and movement:** a 3D or line-drawn body moves as you scroll, with joints and muscles named as they work.
- **A place to visit:** the room opens as you enter, light moves from day to night, a route traces to the door.
- **Work worth showing:** work arrives through the client's own shapes, and projects hand over with shared-element moves.
- **Trust and expertise:** real numbers count, charts and process diagrams draw themselves. Precise and calm.
- **Learning and community:** a learner's path draws itself through the method, with progress unlocking each stage.
- **Origin and craft:** the making process plays as a line drawing, from source to finished piece.

## How to make it
- **No generated video is needed.** AI video isn't normally available, so never plan around it. Everything here can be
  made in code from the client's logo, photos and cut-outs. If the client has a good film, use it.
- **Libraries** are in `PROJECT/variants/_shared/vendor/`. Copy only what you use into `site/js/vendor/`, with no build step:
  - GSAP with ScrollTrigger for timelines and pinning, SplitText for kinetic type, DrawSVGPlugin for line drawing,
    MorphSVGPlugin for shape morphing, MotionPathPlugin for paths and Flip for shared-element moves.
  - Lenis for smooth scrolling, connected to ScrollTrigger so they share one clock.
  - three.js for 3D, with `gl-guard.js` and a still behind the canvas.
- **Kit effects** (`scrub.js`, `prologue.js`, `stair.js`, `hotspots.js`, `film-control.js`) are ready-made. Use them where
  they suit the concept.
- **Build motion with each section,** starting with the opening and the set-piece. Motion left to the end gets dropped.
  Nothing here extends your time limit.
- **Study how the reference moves.** Read the live source for its easing, duration and hand-overs. Use the ideas, not its
  files.

## Keep it good
- **Hierarchy:** one big thing moves at a time, and copy stays still while people read it.
- **One motion language:** the same easing family and timing across a variant.
- **Smooth:** animate only `transform`, `opacity` and `clip-path`. Pause loops and canvases off screen, with no more than
  one WebGL canvas per page.
- **Light:** the first screen appears within 3 seconds. Compress every image, and use SVG where it can replace one.
- **Phones:** keep the idea with lighter versions. Replace long pinning with shorter moves and drop heavy canvases.
- **Reduced motion:** every sequence ends in its finished state, nothing hidden, and the page is complete without it.
- **Older audiences and serious topics:** the same craft, but slower and with fewer loops.
