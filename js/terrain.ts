import { taustaKuva, tieOikeaYlos, tieOikealle, tieRisteys, tieSuoraan, tieVaakaan, tieVasemmalle, tieVasenYlos } from "./assets";
import { biomiKuvat, biomiTieOYKuvat, biomiTieOikKuvat, biomiTieSuoraanKuvat, biomiTieVYKuvat, biomiTieVaakaanKuvat, biomiTieVasKuvat, biomiVarit } from "./data";
import { s, ctx } from "./state";
import { CANVAS_HEIGHT, CANVAS_WIDTH, LAST_COLUMN, ROAD_START_COLUMN, TERRAIN_COLUMNS, TERRAIN_ROWS, TILE_SIZE } from "./constants/geometry";

// Terrain column indices [0..TERRAIN_COLUMNS-1] as a fresh array (callers splice it)
function columnIndices(){
	return Array.from({length: TERRAIN_COLUMNS}, function(_, i){ return i; });
}

// 2D-taulukko [5x4], jossa on referenssit kuviin
export function alustaMaasto(){
	s.maasto = new Array(TERRAIN_COLUMNS);
	s.maastomuoto = new Array(s.maasto.length); //Tarvitaan lopetusehtoon
	s.tie = ROAD_START_COLUMN; //Missä on ylimmänrivin tie matkalla ylöspäin.
	for (let i=0; i<s.maasto.length; i++){ // X-suuntaan
		s.maasto[i] = new Array(TERRAIN_ROWS);
		s.maastomuoto[i] = new Array( s.maasto[i].length );
		// Generoi maasto eli lataa kuvat:
		// Tehdään suora tie:

		for(let j=0; j<s.maasto[i].length; j++){ // Y-suuntaan
			if(i == ROAD_START_COLUMN){
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


export function jatkaTieOikeaan(ind: number){
		//Arvotaan, kuinka kauas mennään oikeaan, eli arvotaan indeksi, jossa käännytään ylös
		s.ylos = Math.floor( Math.random()*(TERRAIN_COLUMNS-1-ind) ) + ind +1 ;

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
		const iTausta = columnIndices();
		iTausta.splice(ind, s.ylos-ind+1);
		for (const i in iTausta ){
		  s.maasto[iTausta[i]][0] = taustaKuva[biomiKuvat[s.biomi][Math.floor(Math.random()*biomiKuvat[s.biomi].length)]];
		  s.maastomuoto[iTausta[i]][0] = 0; //Kuolema
		}
		return s.ylos;
	}

export function jatkaTieRisteykseen(ind: number){
	// Täytetään maastografiikka
	for (let i=0; i<TERRAIN_COLUMNS; i++){
		s.maasto[i][0] = taustaKuva[biomiKuvat[s.biomi][Math.floor(Math.random()*biomiKuvat[s.biomi].length)]];
	}

		// Arvo, kuinka kauas mennään oikeaan/vasempaan, eli arvotaan indeksi, jossa käännytään ylös
		s.ylos = Math.floor(Math.random()*TERRAIN_COLUMNS);

	// Estä uuden indeksin olemasta sama kuin nykyinen
	while(s.ylos == ind){ 
		s.ylos = Math.floor(Math.random()*TERRAIN_COLUMNS);
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
		for (let i=LAST_COLUMN; i>s.ylos; i--){
			s.maasto[i][0] = tieVaakaan[biomiTieVaakaanKuvat[s.biomi][Math.floor(Math.random()*biomiTieVaakaanKuvat[s.biomi].length)]];
			s.maastomuoto[i][0] = 1;
		}
	}

	// Aseta risteyksen kuva oikeaan kohtaan
		s.maasto[ind][0] = tieRisteys[s.biomi];

		return s.ylos;
	}

export function jatkaTieVasempaan(ind: number){
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
		const iTausta = columnIndices();
		iTausta.splice(s.ylos, ind-s.ylos+1);
		for (const i in iTausta ){
		  s.maasto[iTausta[i]][0] = taustaKuva[biomiKuvat[s.biomi][Math.floor(Math.random()*biomiKuvat[s.biomi].length)]];
		  s.maastomuoto[iTausta[i]][0]=0;  //Kuolema
		}

		return s.ylos;
	}

export function jatkaTieYlos(ind: number){
	s.maasto[ind][0] = tieSuoraan[biomiTieSuoraanKuvat[s.biomi][Math.floor(Math.random()*biomiTieSuoraanKuvat[s.biomi].length)]];
	s.maastomuoto[ind][0]=1;

	const iTausta = columnIndices();
	iTausta.splice(ind,1);
	for(const i in iTausta){
		s.maasto[iTausta[i]][0] = taustaKuva[biomiKuvat[s.biomi][Math.floor(Math.random()*biomiKuvat[s.biomi].length)]];
		s.maastomuoto[iTausta[i]][0]=0;
	}

	return ind;
	}


export function piirraMaasto(siirtoY: number){
	ctx.fillStyle="#"+biomiVarit[s.biomi];
	ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	
	for (let i=0; i<s.maasto.length; i++){
		for (let j=0; j<s.maasto[i].length; j++){
			try{
				ctx.drawImage(s.maasto[i][j], i*TILE_SIZE, (j-1)*TILE_SIZE + siirtoY);
			}catch(e){
				// Do nothing
			}
		}
	}
}
