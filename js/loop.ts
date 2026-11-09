import { MAX_CATCHUP_STEPS, UPDATE_INTERVAL } from "./constants/gameplay";
// Pelisilmukka: logiikka etenee kiinteällä 50 ms askeleella (kuten ennen setIntervalin kanssa),
// mutta piirto ajoitetaan selaimen kuvataajuuteen requestAnimationFramella.
// Kun välilehti on taustalla, requestAnimationFrame pysähtyy, joten peli ei juokse "tyhjää".
let edellinenAika: number | null = null;
let kertyma = 0;
let paivitaAskel: (() => void) | null = null;
function pelisilmukka(aika: number){
	requestAnimationFrame(pelisilmukka); // Ajastetaan ensin, jotta poikkeus ei pysäytä silmukkaa
	if(edellinenAika === null){
		edellinenAika = aika;
	}
	kertyma += aika - edellinenAika;
	edellinenAika = aika;
	let askelia = 0;
	while(kertyma >= UPDATE_INTERVAL && askelia < MAX_CATCHUP_STEPS){
		if(paivitaAskel) paivitaAskel();
		kertyma -= UPDATE_INTERVAL;
		askelia++;
	}
	if(askelia == MAX_CATCHUP_STEPS){
		kertyma = 0;
	}
}

// Käynnistää pelisilmukan; paivita on pelin logiikka ja piirto yhdessä askeleessa
export function kaynnistaSilmukka(paivita: () => void){
	paivitaAskel = paivita;
	requestAnimationFrame(pelisilmukka);
}
