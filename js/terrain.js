import { taustaKuva, tieOikeaYlos, tieOikealle, tieRisteys, tieSuoraan, tieVaakaan, tieVasemmalle, tieVasenYlos } from "./assets.js";
import { biomiKuvat, biomiTieOYKuvat, biomiTieOikKuvat, biomiTieSuoraanKuvat, biomiTieVYKuvat, biomiTieVaakaanKuvat, biomiTieVasKuvat, biomiVarit } from "./data.js";
import { s, ctx } from "./state.js";

// 2D-taulukko [5x4], jossa on referenssit kuviin
export function alustaMaasto(){
	s.maasto = new Array(5);
	s.maastomuoto = new Array(s.maasto.length); //Tarvitaan lopetusehtoon
	s.tie = 2; //Missä on ylimmänrivin tie matkalla ylöspäin.
	for (let i=0; i<s.maasto.length; i++){ // X-suuntaan
		s.maasto[i] = new Array(4);
		s.maastomuoto[i] = new Array( s.maasto[i].length );
		// Generoi maasto eli lataa kuvat:
		// Tehdään suora tie:

		for(let j=0; j<s.maasto[i].length; j++){ // Y-suuntaan
			if(i == 2){
				// Keskelle tie.
				s.maasto[i][j] = tieSuoraan[biomiTieSuoraanKuvat[s.biomi][0]]; //Satunnainen tie.
	        	s.maastomuoto[i][j] = 1; //TIE
			}else{
				s.maasto[i][j] = taustaKuva[biomiKuvat[s.biomi][0]]; //Satunnainen ei-tie.
	            s.maastomuoto[i][j] = 0; //Kuolema 
			}
		}
	}
}


export function jatkaTieOikeaan(ind){
		//Arvotaan, kuinka kauas mennään oikeaan, eli arvotaan indeksi, jossa käännytään ylös
		s.ylos = Math.floor( Math.random()*(5-1-ind) ) + ind +1 ;

		s.maasto[ind][0] = tieOikealle[biomiTieOikKuvat[s.biomi][Math.floor(Math.random()*biomiTieOikKuvat[s.biomi].length)]];
		s.maastomuoto[ind][0] = 1;
		//Täytetään välit suorilla
		for (let i=ind+1; i<s.ylos; i++){
			s.maasto[i][0] = tieVaakaan[biomiTieVaakaanKuvat[s.biomi][Math.floor(Math.random()*biomiTieVaakaanKuvat[s.biomi].length)]];
			s.maastomuoto[i][0] = 1; //Tie
		}
		s.maasto[s.ylos][0] = tieOikeaYlos[biomiTieOYKuvat[s.biomi][Math.floor(Math.random()*biomiTieOYKuvat[s.biomi].length)]]; 
		s.maastomuoto[s.ylos][0]=1; 

		//Täytetään muut taustalla
		const iTausta = [0, 1, 2, 3, 4];
		iTausta.splice(ind, s.ylos-ind+1);
		for (let i in iTausta ){
		  s.maasto[iTausta[i]][0] = taustaKuva[biomiKuvat[s.biomi][Math.floor(Math.random()*biomiKuvat[s.biomi].length)]];
		  s.maastomuoto[iTausta[i]][0] = 0; //Kuolema
		}
		return s.ylos;
	}

export function jatkaTieRisteykseen(ind){
	// Täytetään maastografiikka
	for (let i=0; i<5; i++){
		s.maasto[i][0] = taustaKuva[biomiKuvat[s.biomi][Math.floor(Math.random()*biomiKuvat[s.biomi].length)]];
	}

		// Arvo, kuinka kauas mennään oikeaan/vasempaan, eli arvotaan indeksi, jossa käännytään ylös
		s.ylos = Math.floor(Math.random()*5);

	// Estä uuden indeksin olemasta sama kuin nykyinen
	while(s.ylos == ind){ 
		s.ylos = Math.floor(Math.random()*5);
	}

	// Täytä välit tiellä
	if(s.ylos>ind){ // Risteys oikea
			s.maasto[s.ylos][0] = tieOikeaYlos[biomiTieOYKuvat[s.biomi][Math.floor(Math.random()*biomiTieOYKuvat[s.biomi].length)]];
		s.maastomuoto[s.ylos][0] = 1;
		for (let i=0; i<s.ylos; i++){
			s.maasto[i][0] = tieVaakaan[biomiTieVaakaanKuvat[s.biomi][Math.floor(Math.random()*biomiTieVaakaanKuvat[s.biomi].length)]];
			s.maastomuoto[i][0] = 1;
		}
	}else{ // Risteys vasen
		s.maasto[s.ylos][0] = tieVasenYlos[biomiTieVYKuvat[s.biomi][Math.floor(Math.random()*biomiTieVYKuvat[s.biomi].length)]];
		s.maastomuoto[s.ylos][0] = 1;
		for (let i=4; i>s.ylos; i--){
			s.maasto[i][0] = tieVaakaan[biomiTieVaakaanKuvat[s.biomi][Math.floor(Math.random()*biomiTieVaakaanKuvat[s.biomi].length)]];
			s.maastomuoto[i][0] = 1;
		}
	}

	// Aseta risteyksen kuva oikeaan kohtaan
		s.maasto[ind][0] = tieRisteys[s.biomi];

		return s.ylos;
	}

export function jatkaTieVasempaan(ind){
		//Arvotaan, kuinka kauas mennään vasempaan, eli arvotaan indeksi, jossa vasemmalta käännytään ylös
		s.ylos = Math.floor(Math.random()*(ind-1)); // Kuten järkikin sanoo, uusi arvottu indeksi (X-posiitio) on siis aina pienempi kuin nykyinen indeksi

		s.maasto[ind][0] = tieVasemmalle[biomiTieVasKuvat[s.biomi][Math.floor(Math.random()*biomiTieVasKuvat[s.biomi].length)]];
		s.maastomuoto[ind][0]=1; //Tie
		//Täytetään välit suorilla
		for (let i=s.ylos+1; i<ind; i++){
			s.maasto[i][0] = tieVaakaan[biomiTieVaakaanKuvat[s.biomi][Math.floor(Math.random()*biomiTieVaakaanKuvat[s.biomi].length)]];
			s.maastomuoto[i][0]=1;
		}
		s.maasto[s.ylos][0] = tieVasenYlos[biomiTieVYKuvat[s.biomi][Math.floor(Math.random()*biomiTieVYKuvat[s.biomi].length)]]; 
		s.maastomuoto[s.ylos][0]=1; 


		//Täytetään muut taustalla
		const iTausta = [0, 1, 2, 3, 4];
		iTausta.splice(s.ylos, ind-s.ylos+1);
		for (let i in iTausta ){
		  s.maasto[iTausta[i]][0] = taustaKuva[biomiKuvat[s.biomi][Math.floor(Math.random()*biomiKuvat[s.biomi].length)]];
		  s.maastomuoto[iTausta[i]][0]=0;  //Kuolema
		}

		return s.ylos;
	}

export function jatkaTieYlos(ind){
	s.maasto[ind][0] = tieSuoraan[biomiTieSuoraanKuvat[s.biomi][Math.floor(Math.random()*biomiTieSuoraanKuvat[s.biomi].length)]];
	s.maastomuoto[ind][0]=1;

	const iTausta = [0, 1, 2, 3, 4];
	iTausta.splice(ind,1);
	for(const i in iTausta){
		s.maasto[iTausta[i]][0] = taustaKuva[biomiKuvat[s.biomi][Math.floor(Math.random()*biomiKuvat[s.biomi].length)]];
		s.maastomuoto[iTausta[i]][0]=0;
	}

	return ind;
	}


export function piirraMaasto(siirtoY){
	ctx.fillStyle="#"+biomiVarit[s.biomi];
	ctx.fillRect(0,0,960,576);
	
	for (let i=0; i<s.maasto.length; i++){
		for (let j=0; j<s.maasto[i].length; j++){
			try{
				ctx.drawImage(s.maasto[i][j], i*192, (j-1)*192 + siirtoY);
			}catch(e){
				// Do nothing
			}
		}
	}
}
