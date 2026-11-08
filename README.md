# HuhtiRun

**HuhtiRun** on vapaan lähdekoodin (= *open source*) jäljitelmä suositusta Temple Run -pelistä.

**Pelaa:** https://recklessrunners.github.io/HuhtiRun/

## Pelin idea
HuhtiRunissa juostaan pakoon hullaantunutta apinaa keräten matkalla pisteitä ja bonuksia. Pelin tavoitteena on juosta kuolematta mahdollisimman pitkälle. Pelissä on monia erilaisia kenttiä, joita voi ostaa pelin sisäisellä valuutalla.

## Kehitystiimi
Pelin on kehittänyt tiimi nimeltänsä *The Reckless Runners*. Tiimi koostuu osasta urjalalaisen Huhdin koulun lukuvuoden 2012 - 2013 9. lk oppilaista. Yhdeksännen luokan jälkeen on oppilaiden tiet eronneet toisistaan ja peliä kehitetään etänä.

Toivomme saavamme lisää kehittäjiä peliin. Sinun ei tarvitse olla edellisen koulumme oppilas tai ylipäätään tuntea meitä. Pelin kehittämiseen liittyviä ohjeita löydät [wikistämme](/wiki).

## Koodin rakenne
Peli on jaettu ES-moduuleihin (`js/`). Kaikki moduulien välillä jaettu muuttuva tieto on `state.js`:n `s`-oliossa (esim. `s.rahat`, `s.tila`, `s.hengissa`).

| Tiedosto | Sisältö |
|---|---|
| `main.js` | käynnistys: lataa tallennuksen, asettaa äänet, syötteen ja pelisilmukan |
| `state.js` | jaettu tila `s`, `canvas` ja `ctx` |
| `game.js` | `paivita()`: pelin logiikka ja piirto yhdellä askeleella, pelin aikainen klikkaus |
| `loop.js` | kiinteäaskelinen `requestAnimationFrame`-silmukka (50 ms) |
| `input.js` | näppäimistö ja osoitin (hiiri/kosketus), välittää klikkaukset oikealle ruudulle |
| `screens/*.js` | yksi tiedosto per ruutu: valikko, kentät, tavoitteet, tilastot, tekijät, asetukset, kuolema ja HUD (piirto + klikkaus) |
| `assets.js` | kuvien ja äänten lataus |
| `audio.js`, `save.js`, `shop.js`, `terrain.js`, `sprites.js` | ääni, tallennus, kauppa, maasto, hahmojen piirto |
| `data.js` | staattinen data: kentät, tavoitteet, tekijät, latausviestit |
| `modals.js`, `util.js` | `<dialog>`-ikkunat ja apufunktiot |

## Kehittäminen
Peli on pelkkää HTML:ää, CSS:ää ja JavaScriptiä, eikä sen ajamiseen tarvita käännösvaihetta. Tarvitset vain [Node.js](https://nodejs.org/):n.

```
npm start      # käynnistää kehityspalvelimen osoitteeseen http://localhost:8765
npm install    # asentaa kehitystyökalut (ESLint)
npm run lint   # tarkistaa koodin
```

Peli toimii nykyaikaisissa selaimissa (Chrome, Firefox, Edge, Safari). Se on asennettava web-sovellus (`manifest.webmanifest`) ja toimii offline-tilassa `sw.js`-service workerin ansiosta. Kun lisäät tai poistat JavaScript-moduuleja, päivitä `ESILADATTAVAT`-lista ja kasvata `VERSIO`-vakiota `sw.js`:ssä.
