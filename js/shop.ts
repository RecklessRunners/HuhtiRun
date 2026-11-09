import { dramaattinen, maksuAani } from "./assets";
import { soitaAani } from "./audio";
import { openModal } from "./modals";
import { s } from "./state";

// Ostotoiminto kauppaa varten
export function osta(hinta: number,asia?: string,kysy?: boolean){
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
		document.getElementById("lisaaRahaaArvo")!.textContent = String(hinta-s.rahat);
		document.getElementById("lisaaRahaaTuote")!.textContent = asia;
		return false;
	}
}
