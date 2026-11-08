import { dramaattinen, loppuAani, pisteytysAani } from "../assets.js";
import { soitaAani, varise } from "../audio.js";
import { s, canvas } from "../state.js";
import { alustaMaasto } from "../terrain.js";

// Kuolema ja pisteytys: vihu saa pelaajan kiinni
export function kasitteleKuolema(){
	if(s.elvytysRuutu){
		s.pelaajaNopeus=0;
	}else{
		s.pelaajaNopeus=1;
	}
	s.suojakilpi=0;

	if(s.hengissa){
		s.bonusKerroin = 1;
		soitaAani(dramaattinen[0]);
		s.hengissa=false;
		s.tila=0;
		if(s.pisteet > 9){
			s.pisteytetaan=false;
			s.veriSiirtyma=0;
			varise(1000);
			s.suojakilpi=0;
			s.pisteytys=s.pisteet;
			s.inaktiivinenMenu=true;
			s.elvytysRuutu=true;
		}
		setTimeout(function(){
			s.inaktiivinenMenu=false;
			s.tavoiteData[0]=Math.max(s.tavoiteData[0],s.rahat);
			s.tavoiteData[2]=Math.max(s.tavoiteData[2],s.pelikerrat);
			s.pisteytetaan=true;
			if(!s.hengissa){
				pisteytysAani[0].currentTime=0;
				soitaAani(pisteytysAani[0]);
				s.tila=0;
			}
		},3000);
	}else{
		if(s.pisteytetaan){
			if(s.pisteytys>3.75){
				s.pisteytys -= s.pisteytys / 10;
				varise(50);
			}else{
				pisteytysAani[0].pause();
				soitaAani(loppuAani[0]);
				s.pisteytetaan=false;
				s.inaktiivinenMenu=true;
				setTimeout(function(){
					s.inaktiivinenMenu=false;
					if(s.elvytysRuutu && !s.hengissa){
						alustaMaasto();
						s.alkupotkaisu=0;
					}
					s.elvytysRuutu=false;
					s.tummuus=0.5;
					s.veriSiirtyma=canvas.height;
					
					if(s.pisteet>9){				
						// Parhaat pisteet
						s.parhaatPisteet.push(s.pisteet);
						s.parhaatPisteet.sort(function(a,b){return b-a});
						s.parhaatPisteet.splice(10,1);
						
						localStorage.parhaatPisteet = JSON.stringify(s.tavoiteData);
						
						// Parhaat matkat
						s.parhaatMatkat.push(s.matka);
						s.parhaatMatkat.sort(function(a,b){return b-a});
						s.parhaatMatkat.splice(10,1);
						
						localStorage.parhaatMatkat=JSON.stringify(s.parhaatMatkat);

						s.tavoiteData[3]=parseFloat(s.tavoiteData[3])+1; // Laske kaikkien pelattujen pelien määrä
						localStorage.tavoiteData=JSON.stringify(s.tavoiteData);

						s.rahat += s.pisteet;
						s.matkaYht += s.matka;

						// Pelitietojen tallennus
						localStorage.rahat			= s.rahat;
						localStorage.matkaYht		= s.matkaYht;
						localStorage.tavoiteData	= JSON.stringify(s.tavoiteData);
						localStorage.omatKentat		= JSON.stringify(s.omatKentat);
						localStorage.tutoriaali		= JSON.stringify(s.tutoriaaliData);
					}
				},3000);
			}
		}
	}
}
