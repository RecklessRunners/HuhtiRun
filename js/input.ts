import { hyppyAani, lataus, maksuAani } from "./assets";
import { soitaAani } from "./audio";
import { kasittelePelinKlikkaus } from "./game";
import { kasitteleAsetustenKlikkaus } from "./screens/asetukset";
import { kasitteleKentanKlikkaus } from "./screens/kentat";
import { kasitteleTavoitteidenKlikkaus } from "./screens/tavoitteet";
import { kasitteleTekijoidenKlikkaus } from "./screens/tekijat";
import { kasitteleTilastojenKlikkaus } from "./screens/tilastot";
import { kasitteleValikonKlikkaus } from "./screens/valikko";
import { s, canvas } from "./state";
import { BONUS_POINTS, JUMP_DURATION, JUMP_ZONE_START, KEYBOARD_MOVE_STEP } from "./constants/gameplay";
import { HALF_TILE, TILE_SIZE } from "./constants/geometry";
import { CONTROL_KEYBOARD, CONTROL_MOUSE, SCREEN_CREDITS, SCREEN_GOALS, SCREEN_LEVELS, SCREEN_MENU, SCREEN_SETTINGS, SCREEN_STATS } from "./constants/ids";

export function alustaSyote(){
	// Pelaajan ohjauskomennot (sidotaan vain kerran, ei joka päivityksellä)
	document.addEventListener("keyup", function(e){
		if(e.key==" "){
			if(!s.hyppy){
				soitaAani(hyppyAani[0]);
				s.hyppy=true;
				setTimeout(function(){
					s.hyppy=false;
				},JUMP_DURATION);
			}
		}
		if(e.key=="Escape"){
			if(s.hengissa){
				if(s.tauko){
					s.tauko=false;
				}else{
					s.tauko=true;
				}
			}
		}
		s.ukkoLiikkuuX=0;
	});
	document.addEventListener("keydown", function(e){	if(s.asetukset.ohjausTapa == CONTROL_KEYBOARD){
			if(s.ukkoLiikkuuX==0){
				if(e.key=="ArrowRight"){
					if(!s.tauko && s.hengissa){
						s.ukkoLiikkuuX=KEYBOARD_MOVE_STEP; // Oikealle
						console.log("oik");
					}
				}
				if(e.key=="ArrowLeft"){
					if(!s.tauko && s.hengissa){
						s.ukkoLiikkuuX=-KEYBOARD_MOVE_STEP; // Vasemmalle
						console.log("vas");
					}
				}
			}
		}
	});

	window.addEventListener("blur", function(){
		if(s.hengissa){
			s.tauko=true;
		}
	});
	// Muuntaa osoittimen sijainnin canvasin omiin koordinaatteihin (canvas voi olla skaalattu CSS:llä)
	function paivitaOsoitin(e){
		const rect = canvas.getBoundingClientRect();
		s.x = Math.floor((e.clientX-rect.left)*canvas.width/rect.width);
		s.y = Math.floor((e.clientY-rect.top)*canvas.height/rect.height);
	}

	canvas.addEventListener("pointerdown", function(e){
		e.preventDefault();
		paivitaOsoitin(e);
		s.hiiriAlasX=s.x;
		const randomiNopeus = 10 + Math.round(Math.random()*10);
		if(s.hengissa){
			kasittelePelinKlikkaus();
		}else{
			if(lataus.ladatut >= lataus.kaikki){
				if(s.tila==SCREEN_MENU){
					kasitteleValikonKlikkaus();
			}else if(s.tila==SCREEN_LEVELS){
				kasitteleKentanKlikkaus();
			}else if(s.tila==SCREEN_GOALS){ // Tavoitemenu
				kasitteleTavoitteidenKlikkaus();
			}else if(s.tila==SCREEN_STATS){ // Tilastomenu
				kasitteleTilastojenKlikkaus();
			}else if(s.tila==SCREEN_CREDITS){ // Tietoja-menu
				kasitteleTekijoidenKlikkaus();
			}else if(s.tila==SCREEN_SETTINGS){ // Asetukset-menu
				kasitteleAsetustenKlikkaus();
			}
		}
		}
		// Kosketuksella ei ole hiiren "liikettä" ennen painallusta, joten käsitellään sijainti heti
		if(e.pointerType!="mouse"){
			osoitinLiikkuu();
		}
	});
	canvas.addEventListener("pointerup", function(e){
		e.preventDefault();
		paivitaOsoitin(e);
		/*var hiiriSiirtymaX = Math.abs(hiiriAlasX-x);
		if(hiiriSiirtymaX>256){
			if(x < hiiriAlasX){
				biomi=Math.min(biomiTyypit.length-1,biomi+1);
			}else{
				biomi=Math.max(0,biomi-1);
			}
			soitaAani(klikkiAani[0]);
			alustaMaasto();
			ukkoX=START_LANE_X;
		}*/
	});
	canvas.addEventListener("pointermove", function(e){
		paivitaOsoitin(e);
		osoitinLiikkuu();
	});
	function osoitinLiikkuu(){
		if(lataus.ladatut<lataus.kaikki){

		}else{
			if(s.asetukset.ohjausTapa == CONTROL_MOUSE){
				if(s.y<canvas.height*JUMP_ZONE_START){
					if(s.hengissa && !s.tauko && s.suojakilpi <= 0){
						s.tavoiteX=s.x-HALF_TILE;
					}else{
						const puolivali = Math.floor(((s.tieMinMax[0]+s.tieMinMax[1])/2)/TILE_SIZE)*TILE_SIZE;
						s.tavoiteX=puolivali;
					}
				}else{
					if(s.hengissa){
						if(!s.hyppy){
							soitaAani(hyppyAani[0]);
							s.hyppy=true;
							setTimeout(function(){
								s.hyppy=false;
							},JUMP_DURATION);
						}
					}
				}
			}
		}
	}
	canvas.addEventListener("dblclick", function(){	if(s.hengissa && s.bonuspisteet >= s.maxBonuspisteet){
			s.pisteet+=BONUS_POINTS;
			s.bonuspisteet=0;
			soitaAani(maksuAani[0]);
		}
	});
}
