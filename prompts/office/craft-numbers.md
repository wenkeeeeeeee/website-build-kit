# Craft numbers

Starting values for type, motion, text over film and common bugs, for when a choice needs a number. Your tone and your
brief (kit: `motion.md`, `taste.md`) win on any conflict. Adapted from MotionSites `craft.md` (MIT, © 2026 MotionSites;
licence in the kit at `licenses/motionsites.LICENSE`), minus the parts that clash with our rules.

## Type
- **Scale contrast:** H1 is 5-6× the body size. Break headlines into 2-3 lines by hand (`white-space: nowrap` per line
  on desktop, free flow on phones).
- | | Display / H1 | Giant word | Body | Small labels |
  |---|---|---|---|---|
  | Size | 72-96px desktop, 36-48px phone (`clamp()`) | 14-28vw | 14-18px | 10-13px |
  | Line-height | 0.9-1.05 | 0.75-0.88 | 1.5-1.6 | 1-1.3 |
  | Tracking | -0.02 to -0.05em | -0.04 to -0.08em | 0 to -0.01em | +0.1 to +0.3em |
- At most two families. Only the weights you use, self-hosted, `font-display: swap`.
- `font-variant-numeric: tabular-nums` on any number that changes (prices, counters, timers).
- Card copy at most 32ch; a lede at most about 28rem.

## Motion values
- **Opening order:** header, headline, line, button, each 0.1-0.2s after the last. Base move: opacity plus a 20-30px
  rise over 0.6-1.1s. Total length follows the tone.
- **Direction:** header from above, content from below, side items sideways. Logos and fine print only fade.
- **Durations:** hovers 150-350ms, button text rolls 500ms, menus 280-500ms, panel wipes 400-700ms, carousels
  640-800ms, crossfades 1s, count-ups 1.5-2s, video fade-in 500ms on `loadeddata`.
- **Staggers:** 30ms per character, 50ms per nav link, 60-80ms per word or block, 100-150ms per card.
- **Lerp per frame:** 0.1 cursor effects, 0.12 pointer parallax and scroll-scrubbed video, 0.14 pinned scenes.
- **Release transforms** when an entrance ends (an `.is-in` class or `animation: none`), or hover transforms won't work.
- **Small hovers:** scale up to 1.05, `:active` scale 0.97. Link underlines grow from the left over 0.3s.

## Words on film
- No boxes behind words on film (no glass, navy, dark or frosted panels). Pick footage with an empty zone, fade the
  film's edge into the page colour, add a soft text-shadow: body `0 2px 18px rgba(0,0,0,.42)`, display
  `0 16px 38px rgba(0,0,0,.32)`, header `0 2px 16px rgba(0,0,0,.2)`. Never a flat 50% black wash.
- When you note a hero clip or photo, also note where its subject sits and where the empty zone is.

## Layout
- **Short laptops:** `@media (max-height: 850px)` and `(max-height: 720px)` rules so a one-screen hero fits at 1536×700.
- `height: 100vh; height: 100dvh;` and `padding-bottom: max(36px, env(safe-area-inset-bottom))` on phones.
- **Layer order:** media 0, fades and scrims 1, content 10, header 20, menu 50, grain 100.
- **Sheet join between sections:** next section gets a 40-60px top radius, `margin-top: -40px` to `-56px`,
  `position: relative; z-index: 10`.
- Grain: SVG noise at 0.04-0.15 opacity, `pointer-events: none`. Ties film and UI together and hides banding.
- Theme `::selection` (brand at about 30% opacity). Soft shadows, e.g. `0 4px 14px rgba(0,0,0,.16)`.

## Bugs to design against
| Bug | Fix |
|---|---|
| White flash on load | `html, body { background: … }` as the first CSS rule; media starts at opacity 0 and fades in on `loadeddata` |
| Page blank if a script fails | The resting state is visible; JS forces the final state after 2 frames if an entrance hasn't run |
| Layout jumps | Fixed-height lines for typed or rotating words; reserve every image and video aspect ratio |
| Scrubbed video stutters | Seek only when `!video.seeking`, and ease toward the target each frame |
| Animations fight | Cancel the previous `requestAnimationFrame`; lock repeat triggers for 650-1000ms |
| Hover effects on phones | Under `(hover: none)`, give a tap, scroll or self-running version that keeps the idea |
| Menu leaves the page scrolling | Lock scroll while open (stop Lenis too); close on link, Esc and resize |

When a check fails, fix it with a number (size, offset, timing), not an adjective.
