import { klikkiAani, ukko } from "../assets";
import { soitaAani } from "../audio";
import { tekijat } from "../data";
import { s, canvas, ctx } from "../state";
import { kirjoita } from "../util";
import { SCREEN_MENU } from "../constants/ids";
import { CREDITS_END_OFFSET, CREDITS_END_Y, CREDITS_FADE_IN_Y, CREDITS_FADE_LENGTH, CREDITS_FADE_OUT_Y, CREDITS_IMAGE_SIZE, CREDITS_IMAGE_X, CREDITS_IMAGE_Y, CREDITS_LINE_HEIGHT, CREDITS_LIST_TOP, CREDITS_NAME_X, CREDITS_RESTART_SCROLL, CREDITS_SCROLL_SPEED, FONT_BODY, FONT_LIST, FONT_SUBTITLE, FONT_TITLE, FOOTER_LINE_HEIGHT, FOOTER_Y, MENU_ZONE_TOP, NAV_ZONES, PAGE_MARGIN, PAGE_SUBTITLE_Y, PAGE_TITLE_Y, VERSION_FULL_LENGTH, VERSION_SHORT_LENGTH, VERSION_ZONE_HEIGHT } from "../constants/ui";

// Tietoja ja tekijät (tila 4)
export function piirraTekijat(){
	kirjoita("Tietoja pelistä",PAGE_MARGIN,PAGE_TITLE_Y-s.veriSiirtymaNyt,true,FONT_TITLE,"#FFF","'Raleway'");
	kirjoita("Saanemme esitellä pelimme tekijät",PAGE_MARGIN,PAGE_SUBTITLE_Y-s.veriSiirtymaNyt/2,true,FONT_BODY,"#FFF","'Source Sans Pro'");
	
	ctx.translate(CREDITS_IMAGE_X,CREDITS_IMAGE_Y);
	ctx.drawImage(ukko[0],0,0,CREDITS_IMAGE_SIZE,CREDITS_IMAGE_SIZE);
	ctx.translate(-CREDITS_IMAGE_X,-CREDITS_IMAGE_Y);
	
	s.tekijaLaskuri = 0;
	s.tekijaSkrolli -= CREDITS_SCROLL_SPEED;
	
	// Tekijöiden skrollaava osa
	Object.entries(tekijat).forEach(function([tekijaKat,tekijaKatJasenet]){
		// Tekijöiden kategoriat
		s.tekijaLaskuri++;
		const tekijaKatY = CREDITS_LIST_TOP+s.tekijaLaskuri*CREDITS_LINE_HEIGHT+s.tekijaSkrolli;
		if(tekijaKatY<CREDITS_FADE_IN_Y){
			ctx.globalAlpha=1-Math.max(0,Math.min(1,1/CREDITS_FADE_LENGTH*(CREDITS_LIST_TOP-tekijaKatY)));
		}else{
			ctx.globalAlpha=1-Math.max(0,Math.min(1,1/CREDITS_FADE_LENGTH*(tekijaKatY-CREDITS_FADE_OUT_Y)));
		}
		kirjoita(tekijaKat,PAGE_MARGIN,tekijaKatY,true,FONT_LIST,"#FFF","'Source Sans Pro'");
		
		// Tekijöiden nimet
		ctx.globalAlpha=1;
		let tekijaKatJasenY;
		let v;
		tekijaKatJasenet.forEach(function(v){
			s.tekijaLaskuri++;
			tekijaKatJasenY = CREDITS_LIST_TOP+s.tekijaLaskuri*CREDITS_LINE_HEIGHT+s.tekijaSkrolli-CREDITS_LINE_HEIGHT;
			if(tekijaKatJasenY<CREDITS_FADE_IN_Y){
				ctx.globalAlpha=1-Math.max(0,Math.min(1,1/CREDITS_FADE_LENGTH*(CREDITS_LIST_TOP-tekijaKatJasenY)));
			}else{
				ctx.globalAlpha=1-Math.max(0,Math.min(1,1/CREDITS_FADE_LENGTH*(tekijaKatJasenY-CREDITS_FADE_OUT_Y)));
			}
			kirjoita(v,CREDITS_NAME_X,tekijaKatJasenY,false,FONT_LIST,"#FFF","'Source Sans Pro'");
		});

		// Kun luettelo on käyty läpi, aloita alusta
		if(tekijaKatJasenet.length + tekijat.length - CREDITS_END_OFFSET >= s.tekijaLaskuri && tekijaKatJasenY < CREDITS_END_Y){
			s.tekijaSkrolli=CREDITS_RESTART_SCROLL;
			s.tekijaLaskuri=0;
		}
		
		ctx.globalAlpha=1;
	});
	
	ctx.textAlign="end";
	kirjoita("Versio n:o",canvas.width-PAGE_MARGIN,FOOTER_Y,true);
	let versioPituus = VERSION_SHORT_LENGTH;
	if(s.y>canvas.height-VERSION_ZONE_HEIGHT && s.x>canvas.width/NAV_ZONES*(NAV_ZONES-1)){
		versioPituus=VERSION_FULL_LENGTH;
	}
	kirjoita(s.versioId.substr(0,versioPituus) || "Ei tiedossa",canvas.width-PAGE_MARGIN,FOOTER_Y+FOOTER_LINE_HEIGHT,false,FONT_BODY,"#FFF","Courier New");
	ctx.textAlign="start";
	
	kirjoita("« Paluu",PAGE_MARGIN,FOOTER_Y,true,FONT_SUBTITLE,"rgba(255,255,255,0.5)","'Source Sans Pro'");
}

// Klikkaus tekijäruudussa (tila 4)
export function kasitteleTekijoidenKlikkaus(){
	if(s.y>MENU_ZONE_TOP){ // Takaisin valikkoon
		s.veriSiirtyma=canvas.height;
		s.tila=SCREEN_MENU;
		soitaAani(klikkiAani[0]);
	}
}
