import { klikkiAani } from "../assets.js";
import { soitaAani } from "../audio.js";
import { ohjausTavat } from "../data.js";
import { s, canvas } from "../state.js";
import { kirjoita } from "../util.js";

// Asetukset (tila 5)
export function piirraAsetukset(){
	kirjoita("Asetukset",64,128-s.veriSiirtymaNyt,true,48,"#FFF","'Raleway'");
	kirjoita("Säädä pelikokemuksesi mieleiseksesi",64,152-s.veriSiirtymaNyt/2,true,16,"#FFF","'Source Sans Pro'");

	kirjoita("Värinä (sitä tukevissa laitteissa)",64,192,false);
	if(s.asetukset.varina){
		kirjoita("Päällä",512,192,false);
	}else{
		kirjoita("Pois",512,192,false);
	}

	kirjoita("Äänet ja musiikki",64,224,false);
	if(s.asetukset.aani){
		kirjoita("Päällä",512,224,false);
	}else{
		kirjoita("Pois",512,224,false);
	}

	kirjoita("Pelin ohjaaminen",64,256,false);
	kirjoita(ohjausTavat[s.asetukset.ohjausTapa],512,256,false);

	kirjoita("« Paluu",64,512,true,24,"rgba(255,255,255,0.5)","'Source Sans Pro'");
}

// Klikkaus asetuksissa (tila 5)
export function kasitteleAsetustenKlikkaus(){
	if(s.y>448){ // Takaisin valikkoon
		s.veriSiirtyma=canvas.height;
		s.tila=0;
		soitaAani(klikkiAani[0]);
	}
	if(s.x > 480){
		if(s.y >= 192-16 && s.y < 192+16){
			soitaAani(klikkiAani[0]);
			if(s.asetukset.varina){
				s.asetukset.varina=false;
			}else{
				s.asetukset.varina=true;
			}
			localStorage.asetukset=JSON.stringify(s.asetukset);
		}
		if(s.y >= 224-16 && s.y < 224+16){
			soitaAani(klikkiAani[0]);
			if(s.asetukset.aani){
				s.asetukset.aani=false;
			}else{
				s.asetukset.aani=true;
			}
			localStorage.asetukset=JSON.stringify(s.asetukset);
			location.reload();
		}
		if(s.y >= 256-16 && s.y < 256+16){
			soitaAani(klikkiAani[0]);
			s.asetukset.ohjausTapa += 1;
			if(s.asetukset.ohjausTapa >= ohjausTavat.length){
				s.asetukset.ohjausTapa = 0;
			}
			localStorage.asetukset=JSON.stringify(s.asetukset);
		}
	}
}
