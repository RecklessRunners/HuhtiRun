import { alustaAani } from "./audio";
import { paivita } from "./game";
import { alustaSyote } from "./input";
import { kaynnistaSilmukka } from "./loop";
import { lataaTallennus } from "./save";
import { s } from "./state";
import { alustaMaasto } from "./terrain";

console.log("*************************\n* HuhtiRun              *\n*************************");

// Poistumisvahvistus
// (Selaimet eivät enää näytä omaa viestiä, vain yleisen vahvistuksen)
window.addEventListener("beforeunload", function (e) {
	if(s.hengissa){
		e.preventDefault();
		e.returnValue = "";
	}
});

// Estää pelin pelaamisen selaimilla, joilta puuttuu canvas-tuki
if(!document.createElement("canvas").getContext){
	document.location="pages/unsupported.html";
}

// Versionumerointi
// (toimii vain jos .git on palvelimen tarjoama, esim. kehityspalvelin; muuten näytetään "Ei tiedossa")
fetch(".git/refs/heads/master")
	.then(function(vastaus){ return vastaus.ok ? vastaus.text() : ""; })
	.then(function(resp){
		if(resp){
			s.versioId = resp;
			console.log("Versio "+resp);
		}
	})
	.catch(function(){});

// Pelitallennus ladataan (tai luodaan) ja taustaäänet asetetaan ennen kuin peli alkaa
lataaTallennus();
alustaAani();

s.veriSiirtymaNyt = s.veriSiirtyma;

alustaMaasto();

// Syötteen kuuntelijat sidotaan vain kerran
alustaSyote();

// Pelisilmukka alkaa
kaynnistaSilmukka(paivita);
