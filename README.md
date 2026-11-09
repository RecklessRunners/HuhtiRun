# HuhtiRun

**HuhtiRun** is an open source imitation of the popular Temple Run game.

**Play:** https://recklessrunners.github.io/HuhtiRun/

## Game idea
In HuhtiRun you run away from a crazed monkey, collecting points and bonuses along the way. The goal is to run as far as possible without dying. The game has many different levels, which can be bought with in-game currency.

## Development team
The game was developed by a team called *The Reckless Runners*. The team consists of some of the 9th graders of the 2012 - 2013 school year at Huhti School in Urjala. After ninth grade the students went their separate ways, and the game is developed remotely.

## Code structure
The game is split into ES modules (`js/`). All mutable data shared between modules lives in the `s` object of `state.ts` (e.g. `s.rahat`, `s.tila`, `s.hengissa`).

| File | Contents |
|---|---|
| `main.ts` | startup: loads the save, sets up audio, input and the game loop |
| `state.ts` | shared state `s`, `canvas` and `ctx` |
| `game.ts` | `paivita()`: game logic and drawing for a single step, in-game clicks |
| `loop.ts` | fixed-step `requestAnimationFrame` loop (50 ms) |
| `input.ts` | keyboard and pointer (mouse/touch), forwards clicks to the right screen |
| `screens/*.ts` | one file per screen: menu, levels, goals, statistics, credits, settings, death and HUD (drawing + clicks) |
| `assets.ts` | loading images and sounds |
| `audio.ts`, `save.ts`, `shop.ts`, `terrain.ts`, `sprites.ts` | audio, saving, shop, terrain, character drawing |
| `data.ts` | static data: levels, goals, credits, loading messages |
| `constants/*.js` | all named constants (in English): `geometry` (canvas, tiles, sprites), `gameplay` (game tuning values, prices, probabilities), `audio`, `ui` (layout, font sizes, click areas) and `ids` (screens, levels, control schemes) |
| `modals.js`, `util.js` | `<dialog>` windows and helper functions |

## Development
The game is HTML, CSS and TypeScript, built with [Vite](https://vite.dev/). You need [Node.js](https://nodejs.org/).

```
npm install     # installs the dev tools (Vite, TypeScript, ESLint)
npm start       # starts the dev server at http://localhost:8765
npm run build   # produces a production build in dist/
npm run preview # previews the production build
npm run typecheck # type-checks the TypeScript code
npm run lint      # lints the code
```

The game works in modern browsers (Chrome, Firefox, Edge, Safari). It is an installable web app (`manifest.webmanifest`) and works offline thanks to the `sw.js` service worker. Static files (`img/`, `snd/`, `pages/`, `sw.js`, `manifest.webmanifest`) live in the `public/` folder. Code and styles are bundled by Vite, so the `ESILADATTAVAT` (precache) list in `sw.js` contains only images and shell files; bump the `VERSIO` constant when you want to clear the cache.
