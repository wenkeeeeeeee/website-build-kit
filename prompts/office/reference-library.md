# Reference library

Where to look. Open an entry before using it: a note here doesn't prove it suits the client. No client names or
client-site links in this file.

## The bar
- **The design lab:** https://zerilab-design-lab.vercel.app/ : heroes the user loves, explored with no rules, each made
  of a real business's material. Open it for the level, never for a format: its formats (toy overworld map, HUD loadout,
  skill tree, foil card pack, infinite zoom, 3D diorama, race HUD, heat-map body scan) are taken.
- **Approved heroes:** `WebsiteProjects/_approved/` on the build machine, if present: heroes the user approved, with
  their brief. Open them for the level and reuse their code, never their idea or look.
- **Category sites:** real small businesses at the level to beat. Open two from the client's category (or the nearest)
  and judge every hero beside them. Most rest on art-directed photos or film, one signature moment and quiet craft.

| Category | Sites |
|---|---|
| Café, bakery, restaurant | https://www.deltacafes.com/en , https://impastofornoantico.com/ , https://delice.ca/ , https://www.thunder-buns.com/ , https://pizza-amici.nl/ , https://latabledejoakim.fr/ |
| Bar, venue, drinks | https://bar-topas.ch/ , https://www.therechabite.com.au/ , https://santionispirits.com/ , https://stonegroovespirits.com/ |
| Food products | https://agrumeafarm.it/en , https://fixchocolatier.com/ |
| Hotel and travel | https://terrenohotel.com/en , https://tengilemalamala.com/ , https://white-desert.com/ |
| Property, architecture, building | https://belgradearbor.rs/en , https://www.lpas.com/ , https://sobha-privy-collection.com/ , https://lenvalproperties.com/ , https://mejuma-tuscany.com/ |
| Fragrance, beauty, fashion | https://omrbeauty.com/ , https://nymphaicosmetics.com/ , https://almadalabel.com/ |
| Events, florist | https://monarque-evenements.com/ , https://ohlesfleurs.com/ |

More: Awwwards Sites of the Day in the client's category (`site:awwwards.com/sites <category>`; open the live site,
Awwwards blocks browsers).

## Craft references
Sites worth borrowing a technique from: how they stage, transition, set type or pace the scroll. Never their layout,
images or colours. Any reference from anywhere also counts: a game, packaging, a film title sequence, a magazine.
| URL | What it does |
|---|---|
| https://lusion.co/ | 3D objects fill the frame, a line sweeps through the type on scroll |
| https://activetheory.net/ | A dark 3D world where one object carries you between projects |
| https://igloo.inc/ | One 3D object in a landscape, breaking apart and reforming on scroll |
| https://www.brightbiotech.co.uk/ | A plant becomes a bottle in 3D renders, full-screen colour |
| https://21tsi.com/ | Huge cinematic bodies, bold colour, giant type |
| https://landonorris.com/ | Cursor reveals a second helmet over the portrait, a signature draws itself, photo collage |
| https://www.endurosat.com/space-service/ | One object holds a dark stage while chapters change, a price slider |
| https://dontboardme.com/ | A toy on the intro, a funny voice in every label |
| https://www.cartier.com/en-us/roadster-universe.html | An intro film, then a 3D product on a precious stage (liked by the user) |
| https://www.gentlemonster.com/ | Exhibition rooms, each product the star (liked by the user) |
| https://www.tagheuer.com/ | The watch turns and comes apart on scroll (liked by the user) |
| https://partakefoods.com/ | Full shop mechanics with sticker labels and a cart drawer (liked by the user) |

## Rejected
Don't use these or anything like them.
| URL | Why |
|---|---|
| https://www.trevorblountpilates.com/ | Cream and serif, thin decorative lines, empty frames |
| https://lahuella.club/ | Loud colour and giant type, but only blocks sliding past |
| https://cascaidhealth.com/ | Listed on Awwwards, yet a calm serif layout: a listing proves nothing |
| https://www.motionclinic.com.ar/ | One hero effect, then dark text and doctor photos |
| https://foodnia.co.jp/ | Banned by the user, ideas included: colour-flood shapes and pinned one-line scenes |

## Code and components
Code for effects and section parts. Not references: they lend code, never the idea. Check each licence.
- https://tympanus.net/codrops/ : award-level effects with plain-JS source (WebGL image effects, scroll, type,
  transitions). The first place to look.
- https://gsap.com/resources/ and https://codepen.io/GreenSock : GSAP demos.
- https://threejs.org/examples/ : three.js loaders, materials, post-processing.
- https://reactbits.dev/ (`tools/web/reactbits.cjs`), https://ui.aceternity.com/ , https://21st.dev/ (search by
  section type in a real browser; copy from the component page): React components to port.
- Free fonts with character: https://fonts.google.com/ , https://www.fontshare.com/ .

## 3D and media
- **Models:** the client's own files first; https://sketchfab.com/ (CC licences, credit), https://polyhaven.com/ (HDRIs,
  textures, models, CC0), https://ambientcg.com/ . Image-to-3D from the client's photo with a free tier (Tripo, Meshy),
  then cleaned in Blender. Shrink with `npx gltf-transform optimize`.
- **Images and video:** the client's own first. Generated only from free tools, never Higgsfield; never passed off as the
  client's work. Upscale and cut out with free tools or `tools/web/cutout.py`.
