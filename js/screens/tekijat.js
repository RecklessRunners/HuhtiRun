import { klikkiAani, ukko } from "../assets.js";
import { soitaAani } from "../audio.js";
import { tekijat } from "../data.js";
import { s, canvas, ctx } from "../state.js";
import { kirjoita } from "../util.js";

// Tietoja ja tekijät (tila 4)
export function piirraTekijat(){
	kirjoita("Tietoja pelistä",64,128-s.veriSiirtymaNyt,true,48,"#FFF","'Raleway'");
	kirjoita("Saanemme esitellä pelimme tekijät",64,152-s.veriSiirtymaNyt/2,true,16,"#FFF","'Source Sans Pro'");
	
	ctx.translate(512+64,192-64);
	ctx.drawImage(ukko[0],0,0,288,288);
	ctx.translate(-512-64,-192+64);
	
	s.tekijaLaskuri = 0;
	s.tekijaSkrolli -= 1.25;
	
	// Tekijöiden skrollaava osa
	Object.entries(tekijat).forEach(function([tekijaKat,tekijaKatJasenet]){
		// Tekijöiden kategoriat
		s.tekijaLaskuri++;
		const tekijaKatY = 192+s.tekijaLaskuri*24+s.tekijaSkrolli;
		if(tekijaKatY<256){
			ctx.globalAlpha=1-Math.max(0,Math.min(1,1/16*(192-tekijaKatY)));
		}else{
			ctx.globalAlpha=1-Math.max(0,Math.min(1,1/16*(tekijaKatY-416)));
		}
		kirjoita(tekijaKat,64,tekijaKatY,true,20,"#FFF","'Source Sans Pro'");
		
		// Tekijöiden nimet
		ctx.globalAlpha=1;
		let tekijaKatJasenY;
		let v;
		tekijaKatJasenet.forEach(function(v){
			s.tekijaLaskuri++;
			tekijaKatJasenY = 192+s.tekijaLaskuri*24+s.tekijaSkrolli-24;
			if(tekijaKatJasenY<256){
				ctx.globalAlpha=1-Math.max(0,Math.min(1,1/16*(192-tekijaKatJasenY)));
			}else{
				ctx.globalAlpha=1-Math.max(0,Math.min(1,1/16*(tekijaKatJasenY-416)));
			}
			kirjoita(v,256,tekijaKatJasenY,false,20,"#FFF","'Source Sans Pro'");
		});

		// Kun luettelo on käyty läpi, aloita alusta
		if(tekijaKatJasenet.length + tekijat.length - 3 >= s.tekijaLaskuri && tekijaKatJasenY < 128){
			s.tekijaSkrolli=512;
			s.tekijaLaskuri=0;
		}
		
		ctx.globalAlpha=1;
	});
	
	ctx.textAlign="end";
	kirjoita("Versio n:o",canvas.width-64,512,true);
	let versioPituus = 20;
	if(s.y>canvas.height-128 && s.x>canvas.width/3*2){
		versioPituus=40;
	}
	kirjoita(s.versioId.substr(0,versioPituus) || "Ei tiedossa",canvas.width-64,512+24,false,16,"#FFF","Courier New");
	ctx.textAlign="start";
	
	kirjoita("« Paluu",64,512,true,24,"rgba(255,255,255,0.5)","'Source Sans Pro'");
}

// Klikkaus tekijäruudussa (tila 4)
export function kasitteleTekijoidenKlikkaus(){
	if(s.y>448){ // Takaisin valikkoon
		s.veriSiirtyma=canvas.height;
		s.tila=0;
		soitaAani(klikkiAani[0]);
	}
}
