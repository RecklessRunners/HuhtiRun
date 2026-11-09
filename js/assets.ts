import { SLOW_LOAD_TIMEOUT } from "./constants/gameplay";
// Kuvien ja äänten lataus. Latauksen tila on yhdessä oliossa, jota muut moduulit voivat lukea.
export const lataus = {
	kaikki: 0,            // Ladattavien tiedostojen määrä
	ladatut: 0,           // Valmiiksi latautuneet
	virhe: false,         // Tapahtuiko virhe kuvaa ladattaessa
	virheTiedosto: "",    // Viimeisin virheellinen kuvatiedosto
	hidas: false,         // Onko lataus hidas (ei edistystä 10 s aikana)
	hidasAjastin: setTimeout(function(){},1)
};

function lataaKuvat(nimi: string, nmax: number){
	const taulu: HTMLImageElement[] = [];
	for (let i=0;i<=nmax;i++){
		const img = new Image();
		img.onload=function(){
			lataus.ladatut++;
			// Jos yksikään kuva ei lataudu kymmenen sekunnin sisällä, ilmoita käyttäjälle hitaasta latautumisesta
			clearTimeout(lataus.hidasAjastin);
			lataus.hidasAjastin = setTimeout(function(){
				lataus.hidas=true;
			},SLOW_LOAD_TIMEOUT);
		};
		img.onerror=function(){
			lataus.virhe=true;
			lataus.virheTiedosto="img/"+nimi+i+".png";
		};
		img.src="img/"+nimi+i+".png";
		lataus.kaikki++;
		taulu.push(img);
	}
	return taulu;
}

function lataaAanet(nimi: string, nmax: number){
	const taulu = [];
	for(let i=0;i<=nmax;i++){
		const snd = new Audio();
		snd.preload="auto";
		// Lasketaan kukin ääni ladatuksi vain kerran (canplaythrough voi laueta uudelleen)
		// ja myös virhetilanteessa, ettei lataus jää jumiin
		(function(snd, tiedosto){
			let laskettu = false;
			const valmis = function(){
				if(!laskettu){
					laskettu = true;
					lataus.ladatut++;
				}
			};
			snd.addEventListener("canplaythrough", valmis);
			snd.addEventListener("error", function(){
				console.warn("Äänen lataus epäonnistui: "+tiedosto);
				valmis();
			});
		})(snd, "snd/"+nimi+i+".wav");
		snd.src="snd/"+nimi+i+".wav";
		snd.load();
		lataus.kaikki++;
		taulu.push(snd);
	}
	return taulu;
}


// Kuvat ja grafiikka
export const ukko = lataaKuvat("ukko/", 2);
export const vihu = lataaKuvat("vihu/", 3);

export const tieRisteys = lataaKuvat("maasto/risteys",5);
export const tieSuoraan = lataaKuvat("maasto/tiesuoraan",11);
export const tieVasemmalle = lataaKuvat("maasto/kaannosv",7);
export const tieOikealle = lataaKuvat("maasto/kaannoso",8);
export const taustaKuva = lataaKuvat("maasto/tausta",18);
export const tieVaakaan = lataaKuvat("maasto/tievaaka",6);
export const tieOikeaYlos = lataaKuvat("maasto/kaannosoy",5);
export const tieVasenYlos = lataaKuvat("maasto/kaannosvy",5);
export const kyltti = lataaKuvat("maasto/kyltti",0);

export const lentavaObjekti = lataaKuvat("maasto/objekti",4);

export const varjo = lataaKuvat("varjo",0);
export const kolikkoKuva = lataaKuvat("kolikko",0);

export const mitalit = lataaKuvat("mitalit/",6);
export const mitalinauha = lataaKuvat("mitalit/mitalinauha",0);

export const medikit = lataaKuvat("medikit",0);

export const hyppyKuva = lataaKuvat("hyppy",0);

export const kimalle = lataaKuvat("mitalit/kimalle",0);

// Äänet ja musiikki
export const ambientti = lataaAanet("ambient",0);
export const menuMusiikki = lataaAanet("lobby",0);
export const hyppyAani = lataaAanet("jump",0);
export const tausta = lataaAanet("bg",0);
export const dramaattinen = lataaAanet("over",0);
export const auts = lataaAanet("crack",0);
export const korkeaAani = lataaAanet("angels",0);
export const maksuAani = lataaAanet("coin",0);
export const klikkiAani = lataaAanet("select",0);
export const huuto = lataaAanet("scream",0);
export const loppuAani = lataaAanet("end",0);
export const pisteytysAani = lataaAanet("coins",0);
export const bonusAani = lataaAanet("bonus",0);
