import { defineConfig } from "vite";

// Suhteellinen base, jotta peli toimii myös GitHub Pagesin alikansiossa.
// Staattiset tiedostot (img/, snd/, pages/, sw.js, manifest) ovat kansiossa public/ ja kopioituvat sellaisenaan.
export default defineConfig({
	base: "./",
	server: { port: 8765 }
});
