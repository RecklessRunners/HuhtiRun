import { ambientti, korkeaAani, menuMusiikki, tausta } from "./assets";
import { s } from "./state";

export function varise(aika){
	if(s.asetukset.varina && navigator.vibrate){
		navigator.vibrate(aika);
		return true;
	}else{
		return false;
	}
}

export function soitaAani(aaniFilu){
	if(s.asetukset.aani){
		// play() palauttaa lupauksen, joka hylätään jos selain estää automaattisen toiston
		const lupaus = aaniFilu.play();
		if(lupaus && lupaus.catch){
			lupaus.catch(function(){});
		}
	}
}

// Asettaa taustaäänet silmukkaan ja käynnistää ne
export function alustaAani(){
	tausta[0].loop=true;
	tausta[0].volume=0;
	soitaAani(tausta[0]);

	menuMusiikki[0].loop=true;
	menuMusiikki[0].volume=0;
	soitaAani(menuMusiikki[0]);

	korkeaAani[0].loop=true;
	korkeaAani[0].volume=0;
	soitaAani(korkeaAani[0]);

	ambientti[0].loop=true;
	soitaAani(ambientti[0]);

	// Selaimet estävät äänen toiston ennen käyttäjän ensimmäistä toimintoa,
	// joten käynnistetään taustaäänet uudelleen ensimmäisellä klikkauksella tai näppäinpainalluksella
	function kaynnistaTaustaaanet(){
		document.removeEventListener("pointerdown", kaynnistaTaustaaanet);
		document.removeEventListener("keydown", kaynnistaTaustaaanet);
		[tausta[0], menuMusiikki[0], korkeaAani[0], ambientti[0]].forEach(soitaAani);
	}
	document.addEventListener("pointerdown", kaynnistaTaustaaanet);
	document.addEventListener("keydown", kaynnistaTaustaaanet);
}
