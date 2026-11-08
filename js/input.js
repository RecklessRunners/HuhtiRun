import { hyppyAani, lataus, maksuAani } from "./assets.js";
import { soitaAani } from "./audio.js";
import { kasittelePelinKlikkaus } from "./game.js";
import { kasitteleAsetustenKlikkaus } from "./screens/asetukset.js";
import { kasitteleKentanKlikkaus } from "./screens/kentat.js";
import { kasitteleTavoitteidenKlikkaus } from "./screens/tavoitteet.js";
import { kasitteleTekijoidenKlikkaus } from "./screens/tekijat.js";
import { kasitteleTilastojenKlikkaus } from "./screens/tilastot.js";
import { kasitteleValikonKlikkaus } from "./screens/valikko.js";
import { s, canvas } from "./state.js";

export function alustaSyote(){
	// Pelaajan ohjauskomennot (sidotaan vain kerran, ei joka päivityksellä)
	document.addEventListener("keyup", function(e){
		if(e.key==" "){
			if(!s.hyppy){
				soitaAani(hyppyAani[0]);
				s.hyppy=true;
				setTimeout(function(){
					s.hyppy=false;
				},500);
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
	document.addEventListener("keydown", function(e){	if(s.asetukset.ohjausTapa=="1"){
			if(s.ukkoLiikkuuX==0){
				if(e.key=="ArrowRight"){
					if(!s.tauko && s.hengissa){
						s.ukkoLiikkuuX=36; // Oikealle
						console.log("oik");
					}
				}
				if(e.key=="ArrowLeft"){
					if(!s.tauko && s.hengissa){
						s.ukkoLiikkuuX=-36; // Vasemmalle
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
				if(s.tila==0){
					kasitteleValikonKlikkaus();
			}else if(s.tila==1){
				kasitteleKentanKlikkaus();
			}else if(s.tila==2){ // Tavoitemenu
				kasitteleTavoitteidenKlikkaus();
			}else if(s.tila==3){ // Tilastomenu
				kasitteleTilastojenKlikkaus();
			}else if(s.tila==4){ // Tietoja-menu
				kasitteleTekijoidenKlikkaus();
			}else if(s.tila==5){ // Asetukset-menu
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
			ukkoX=384;
		}*/
	});
	canvas.addEventListener("pointermove", function(e){
		paivitaOsoitin(e);
		osoitinLiikkuu();
	});
	function osoitinLiikkuu(){
		if(lataus.ladatut<lataus.kaikki){

		}else{
			if(s.asetukset.ohjausTapa=="0"){
				if(s.y<canvas.height*.8){
					if(s.hengissa && !s.tauko && s.suojakilpi <= 0){
						s.tavoiteX=s.x-96;
					}else{
						const puolivali = Math.floor(((s.tieMinMax[0]+s.tieMinMax[1])/2)/192)*192;
						s.tavoiteX=puolivali;
					}
				}else{
					if(s.hengissa){
						if(!s.hyppy){
							soitaAani(hyppyAani[0]);
							s.hyppy=true;
							setTimeout(function(){
								s.hyppy=false;
							},500);
						}
					}
				}
			}
		}
	}
	canvas.addEventListener("dblclick", function(){	if(s.hengissa && s.bonuspisteet >= s.maxBonuspisteet){
			s.pisteet+=20;
			s.bonuspisteet=0;
			soitaAani(maksuAani[0]);
		}
	});
}
