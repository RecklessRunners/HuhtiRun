import { klikkiAani } from "../assets.js";
import { soitaAani } from "../audio.js";
import { ohjausTavat } from "../data.js";
import { s, canvas } from "../state.js";
import { kirjoita } from "../util.js";
import { CONTROL_MOUSE, SCREEN_MENU } from "../constants/ids.js";
import { FONT_BODY, FONT_SUBTITLE, FONT_TITLE, FOOTER_Y, MENU_ZONE_TOP, PAGE_MARGIN, PAGE_SUBTITLE_Y, PAGE_TITLE_Y, SETTINGS_ROW_CONTROLS, SETTINGS_ROW_HALF_HEIGHT, SETTINGS_ROW_SOUND, SETTINGS_ROW_VIBRATION, SETTINGS_VALUE_X, SETTINGS_VALUE_ZONE_X } from "../constants/ui.js";

// Asetukset (tila 5)
export function piirraAsetukset(){
	kirjoita("Asetukset",PAGE_MARGIN,PAGE_TITLE_Y-s.veriSiirtymaNyt,true,FONT_TITLE,"#FFF","'Raleway'");
	kirjoita("Säädä pelikokemuksesi mieleiseksesi",PAGE_MARGIN,PAGE_SUBTITLE_Y-s.veriSiirtymaNyt/2,true,FONT_BODY,"#FFF","'Source Sans Pro'");

	kirjoita("Värinä (sitä tukevissa laitteissa)",PAGE_MARGIN,SETTINGS_ROW_VIBRATION,false);
	if(s.asetukset.varina){
		kirjoita("Päällä",SETTINGS_VALUE_X,SETTINGS_ROW_VIBRATION,false);
	}else{
		kirjoita("Pois",SETTINGS_VALUE_X,SETTINGS_ROW_VIBRATION,false);
	}

	kirjoita("Äänet ja musiikki",PAGE_MARGIN,SETTINGS_ROW_SOUND,false);
	if(s.asetukset.aani){
		kirjoita("Päällä",SETTINGS_VALUE_X,SETTINGS_ROW_SOUND,false);
	}else{
		kirjoita("Pois",SETTINGS_VALUE_X,SETTINGS_ROW_SOUND,false);
	}

	kirjoita("Pelin ohjaaminen",PAGE_MARGIN,SETTINGS_ROW_CONTROLS,false);
	kirjoita(ohjausTavat[s.asetukset.ohjausTapa],SETTINGS_VALUE_X,SETTINGS_ROW_CONTROLS,false);

	kirjoita("« Paluu",PAGE_MARGIN,FOOTER_Y,true,FONT_SUBTITLE,"rgba(255,255,255,0.5)","'Source Sans Pro'");
}

// Klikkaus asetuksissa (tila 5)
export function kasitteleAsetustenKlikkaus(){
	if(s.y>MENU_ZONE_TOP){ // Takaisin valikkoon
		s.veriSiirtyma=canvas.height;
		s.tila=SCREEN_MENU;
		soitaAani(klikkiAani[0]);
	}
	if(s.x > SETTINGS_VALUE_ZONE_X){
		if(s.y >= SETTINGS_ROW_VIBRATION-SETTINGS_ROW_HALF_HEIGHT && s.y < SETTINGS_ROW_VIBRATION+SETTINGS_ROW_HALF_HEIGHT){
			soitaAani(klikkiAani[0]);
			if(s.asetukset.varina){
				s.asetukset.varina=false;
			}else{
				s.asetukset.varina=true;
			}
			localStorage.asetukset=JSON.stringify(s.asetukset);
		}
		if(s.y >= SETTINGS_ROW_SOUND-SETTINGS_ROW_HALF_HEIGHT && s.y < SETTINGS_ROW_SOUND+SETTINGS_ROW_HALF_HEIGHT){
			soitaAani(klikkiAani[0]);
			if(s.asetukset.aani){
				s.asetukset.aani=false;
			}else{
				s.asetukset.aani=true;
			}
			localStorage.asetukset=JSON.stringify(s.asetukset);
			location.reload();
		}
		if(s.y >= SETTINGS_ROW_CONTROLS-SETTINGS_ROW_HALF_HEIGHT && s.y < SETTINGS_ROW_CONTROLS+SETTINGS_ROW_HALF_HEIGHT){
			soitaAani(klikkiAani[0]);
			s.asetukset.ohjausTapa += 1;
			if(s.asetukset.ohjausTapa >= ohjausTavat.length){
				s.asetukset.ohjausTapa = CONTROL_MOUSE;
			}
			localStorage.asetukset=JSON.stringify(s.asetukset);
		}
	}
}
