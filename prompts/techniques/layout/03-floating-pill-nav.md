Adapted from MotionSites layout-and-ui.md #3 (MIT).

# Floating pill navigation

Navigation as a floating object, not a bar. Kept forms: (a) **balanced three-part header**: logo disc left, links in a
centred solid pill with the main action *inside* it, an invisible spacer right so the pill is truly centred; (c) **solid
pill with a three-dot active marker**; (d) **bottom dock** near the bottom of the hero; (e) **editorial text nav** with
comma-separated links. No glass or frosted versions.

**Needs:** nothing beyond the client's logo and page list.

## Values
- Header grid `1fr auto 1fr` keeps the centre column centred whatever the sides hold. `top:16px`, side padding 32 → 64px.
- Pill `padding 6px`; links `8px 12px`, 14px, 500. The action inside uses the variant's primary button style with an arrow.
- Solid pill (c): height `clamp(44px, 5.2vw, 48px)`, `max-width 430px`, shadow `0 4px 14px` of `--shadow`. Links at
  opacity .5, hover .75, active 1; active marker = three 3px dots 5px apart, 5px from the bottom. A round logo disc
  holds the mark at 72% (the original logo, never redrawn).
- Bottom dock (d): `bottom: 5vh`, centred, `padding 6px`, 12px semibold links, a bordered action with a chevron; it
  enters after the hero copy and must not cover the hero subject.
- Editorial (e): 23px text links separated by commas at 40% opacity, hover .6, an underlined contact link
  (`text-underline-offset: 2px`).
- Centre with the individual `translate` property, so entrance keyframes on `transform` don't break it.
- With `position: sticky` instead of `fixed`, the body needs `overflow-x: clip`, not `hidden`.

## Code
```html
<header class="topbar">
  <a class="logo-disc" href="./" aria-label="Home"><img src="images/logo.svg" alt=""></a>
  <nav class="nav-pill" aria-label="Primary">
    <a href="./" aria-current="page">Home</a><a href="#menu">Menu</a><a href="#visit">Visit</a>
    <a class="nav-cta" href="#order">Order <span aria-hidden="true">↗</span></a>
  </nav>
  <span class="topbar-spacer" aria-hidden="true"></span>
</header>
```
```css
.topbar{position:fixed;top:16px;left:0;right:0;z-index:50;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;
  padding:0 clamp(16px,4vw,64px)}
.logo-disc{justify-self:start;width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:var(--surface)}
.logo-disc img{width:72%;height:auto}
.nav-pill{display:flex;align-items:center;gap:2px;padding:6px;border-radius:999px;background:var(--surface);
  box-shadow:0 4px 14px var(--shadow,rgb(0 0 0/.12))}
.nav-pill a{padding:8px 12px;border-radius:999px;font:500 14px/1 var(--font-body);color:var(--ink);text-decoration:none;
  transition:background-color .25s var(--ease-out),color .25s var(--ease-out)}
.nav-pill a:hover{background:color-mix(in srgb,var(--ink) 8%,transparent)}
.nav-pill .nav-cta{margin-left:4px;padding:8px 14px;background:var(--accent);color:var(--accent-ink);white-space:nowrap}
.nav-pill .nav-cta:active{transform:scale(.97)}
.topbar-spacer{justify-self:end;width:48px;height:48px}
@media (max-width:767px){.nav-pill a:not(.nav-cta){display:none}}   /* links move to the mobile menu; the action stays */

/* (c) three-dot active marker on a solid pill */
.nav-solid{display:flex;align-items:center;justify-content:space-around;height:clamp(44px,5.2vw,48px);max-width:430px;flex:1;
  padding:4px 8px;border-radius:999px;background:var(--surface);box-shadow:0 4px 14px var(--shadow,rgb(0 0 0/.16))}
.nav-solid a{position:relative;padding:10px 12px;color:var(--ink);opacity:.5;text-decoration:none;
  font:500 clamp(13px,1.4vw,15px)/1 var(--font-body);letter-spacing:-.01em;transition:opacity .2s var(--ease-out)}
.nav-solid a:hover{opacity:.75}
.nav-solid a[aria-current=page]{opacity:1}
.nav-solid a[aria-current=page]::after{content:"";position:absolute;left:50%;bottom:5px;width:3px;height:3px;border-radius:50%;
  background:currentColor;translate:-50% 0;box-shadow:-5px 0 0 currentColor,5px 0 0 currentColor}

/* (d) bottom dock */
.dock{position:absolute;left:50%;bottom:5vh;translate:-50% 0;z-index:30;display:flex;align-items:center;gap:4px;padding:6px;
  border-radius:999px;background:var(--surface);border:1px solid var(--line);box-shadow:0 12px 40px var(--shadow,rgb(0 0 0/.08));
  animation:dock-in .7s var(--ease-out) .5s both}
@keyframes dock-in{from{opacity:0;transform:translateY(16px)}}
.dock a{padding:8px 14px;font:600 12px/1 var(--font-body);color:var(--muted);text-decoration:none;transition:color .2s var(--ease-out)}
.dock a:hover{color:var(--ink)}
.dock .dock-cta{background:var(--bg);color:var(--ink);border:1px solid var(--line);border-radius:999px}

/* (e) editorial text nav */
.nav-text{display:flex;font:400 23px/1.2 var(--font-body);color:var(--ink)}
.nav-text a{color:inherit;text-decoration:none;transition:opacity .2s var(--ease-out)}
.nav-text a:hover{opacity:.6}
.nav-text .sep{opacity:.4;white-space:pre}
.cta-underline{font-size:23px;color:inherit;text-decoration:underline;text-underline-offset:2px}

@media (prefers-reduced-motion:reduce){.dock{animation:none}}
```
Give every link and the action hover, pressed and `:focus-visible` states.

**Phone:** links move into the mobile menu (layout/05-mobile-menu.md); the main action stays visible in the header. The
dock becomes a bottom bar with the action, or is dropped.

**Reduced motion:** the dock appears in place with no entrance; hovers change only colour and opacity.
