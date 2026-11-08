import { dramaattinen, maksuAani } from "./assets.js";
import { soitaAani } from "./audio.js";
import { openModal } from "./modals.js";
import { s } from "./state.js";

// Ostotoiminto kauppaa varten
export function osta(hinta,asia,kysy){
	asia = asia || "Tämä tuote";
	kysy = kysy || true;
	/*if(kysy){
		kysy=confirm(asia+" maksaa "+hinta+" (HR)\n\nOsta?");
	}*/
	if(hinta <= s.rahat){
		if(kysy){
			s.rahat-=hinta;
			localStorage.rahat=s.rahat;
			soitaAani(maksuAani[0]);
			return true;
		}else{
			return false;
		}
	}else{
		soitaAani(dramaattinen[0]);
		openModal("noMoney");
		document.getElementById("lisaaRahaaArvo").textContent = hinta-s.rahat;
		document.getElementById("lisaaRahaaTuote").textContent = asia;
		return false;
	}
}
