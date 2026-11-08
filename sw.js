"use strict";

// Service worker: mahdollistaa pelin pelaamisen ilman verkkoyhteyttä.
// Kasvata VERSIO, kun haluat pakottaa välimuistin tyhjennyksen.
const VERSIO = "huhtirun-v1";
const ESILADATTAVAT = [
	"./",
	"index.html",
	"css/styles.css",
	"js/scripts.js",
	"manifest.webmanifest",
	"img/favicon.png",
	"img/icon-192.png"
];

self.addEventListener("install", function(e){
	e.waitUntil(
		caches.open(VERSIO).then(function(cache){ return cache.addAll(ESILADATTAVAT); })
			.then(function(){ return self.skipWaiting(); })
	);
});

self.addEventListener("activate", function(e){
	e.waitUntil(
		caches.keys().then(function(nimet){
			return Promise.all(nimet.filter(function(n){ return n != VERSIO; }).map(function(n){ return caches.delete(n); }));
		}).then(function(){ return self.clients.claim(); })
	);
});

// Selain pyytää äänet Range-pyynnöillä, joten välimuistista tarjottu vastaus on pilkottava 206-vastaukseksi
async function pilkoAlue(vastaus, rangeOtsake){
	const osat = /bytes=(\d*)-(\d*)/.exec(rangeOtsake);
	const blob = await vastaus.blob();
	const koko = blob.size;
	let alku = osat[1] === "" ? Math.max(0, koko - parseInt(osat[2], 10)) : parseInt(osat[1], 10);
	let loppu = osat[1] === "" || osat[2] === "" ? koko - 1 : Math.min(parseInt(osat[2], 10), koko - 1);
	return new Response(blob.slice(alku, loppu + 1), {
		status: 206,
		headers: {
			"Content-Type": vastaus.headers.get("Content-Type") || "application/octet-stream",
			"Content-Range": "bytes " + alku + "-" + loppu + "/" + koko,
			"Content-Length": String(loppu - alku + 1)
		}
	});
}

// Kuvat ja äänet muuttuvat harvoin: välimuisti ensin
async function valimuistiEnsin(pyynto){
	const cache = await caches.open(VERSIO);
	const rangeOtsake = pyynto.headers.get("Range");
	let vastaus = await cache.match(pyynto.url);
	if(!vastaus){
		// Haetaan aina koko tiedosto (ilman Range-otsaketta), jotta se voidaan tallentaa
		vastaus = await fetch(pyynto.url);
		if(vastaus.status === 200){
			cache.put(pyynto.url, vastaus.clone());
		}
	}
	if(rangeOtsake && vastaus.status === 200){
		return pilkoAlue(vastaus, rangeOtsake);
	}
	return vastaus;
}

// Koodi ja sivut: verkko ensin, jotta muutokset näkyvät heti; välimuisti jos verkkoa ei ole
async function verkkoEnsin(pyynto){
	const cache = await caches.open(VERSIO);
	try{
		const vastaus = await fetch(pyynto);
		if(vastaus.status === 200){
			cache.put(pyynto, vastaus.clone());
		}
		return vastaus;
	}catch(virhe){
		const tallessa = await cache.match(pyynto, {ignoreSearch: true});
		if(tallessa){
			return tallessa;
		}
		if(pyynto.mode === "navigate"){
			return cache.match("index.html");
		}
		throw virhe;
	}
}

self.addEventListener("fetch", function(e){
	const pyynto = e.request;
	const url = new URL(pyynto.url);
	if(pyynto.method !== "GET" || url.origin !== self.location.origin){
		return; // Muut (esim. Google Fonts) menevät suoraan verkkoon
	}
	if(/\/(img|snd)\//.test(url.pathname)){
		e.respondWith(valimuistiEnsin(pyynto));
	}else{
		e.respondWith(verkkoEnsin(pyynto));
	}
});
