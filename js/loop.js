// Pelisilmukka: logiikka etenee kiinteällä 50 ms askeleella (kuten ennen setIntervalin kanssa),
// mutta piirto ajoitetaan selaimen kuvataajuuteen requestAnimationFramella.
// Kun välilehti on taustalla, requestAnimationFrame pysähtyy, joten peli ei juokse "tyhjää".
const PAIVITYS_VALI = 50;
const MAX_ASKELIA_KERRALLA = 5; // Estää "kiinniottokierteen" pitkän tauon jälkeen
let edellinenAika = null;
let kertyma = 0;
let paivitaAskel = null;
function pelisilmukka(aika){
	requestAnimationFrame(pelisilmukka); // Ajastetaan ensin, jotta poikkeus ei pysäytä silmukkaa
	if(edellinenAika === null){
		edellinenAika = aika;
	}
	kertyma += aika - edellinenAika;
	edellinenAika = aika;
	let askelia = 0;
	while(kertyma >= PAIVITYS_VALI && askelia < MAX_ASKELIA_KERRALLA){
		paivitaAskel();
		kertyma -= PAIVITYS_VALI;
		askelia++;
	}
	if(askelia == MAX_ASKELIA_KERRALLA){
		kertyma = 0;
	}
}

// Käynnistää pelisilmukan; paivita on pelin logiikka ja piirto yhdessä askeleessa
export function kaynnistaSilmukka(paivita){
	paivitaAskel = paivita;
	requestAnimationFrame(pelisilmukka);
}
