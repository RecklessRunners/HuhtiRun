import { dramaattinen, loppuAani, pisteytysAani } from "../assets.js";
import { soitaAani, varise } from "../audio.js";
import { s, canvas } from "../state.js";
import { alustaMaasto } from "../terrain.js";
import { DARKNESS_MENU, MAX_RECORDS, MIN_COUNTED_SCORE, SCORE_COUNTDOWN_DIVISOR, SCORE_COUNTDOWN_END, SCORING_DELAY, VIBRATE_LONG, VIBRATE_TICK } from "../constants/gameplay.js";
import { GOAL_DATA_GAMES_PLAYED, GOAL_DATA_MAX_MONEY, GOAL_DATA_MAX_REVIVES, SCREEN_MENU } from "../constants/ids.js";

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
		s.tila=SCREEN_MENU;
		if(s.pisteet > MIN_COUNTED_SCORE){
			s.pisteytetaan=false;
			s.veriSiirtyma=0;
			varise(VIBRATE_LONG);
			s.suojakilpi=0;
			s.pisteytys=s.pisteet;
			s.inaktiivinenMenu=true;
			s.elvytysRuutu=true;
		}
		setTimeout(function(){
			s.inaktiivinenMenu=false;
			s.tavoiteData[GOAL_DATA_MAX_MONEY]=Math.max(s.tavoiteData[GOAL_DATA_MAX_MONEY],s.rahat);
			s.tavoiteData[GOAL_DATA_MAX_REVIVES]=Math.max(s.tavoiteData[GOAL_DATA_MAX_REVIVES],s.pelikerrat);
			s.pisteytetaan=true;
			if(!s.hengissa){
				pisteytysAani[0].currentTime=0;
				soitaAani(pisteytysAani[0]);
				s.tila=SCREEN_MENU;
			}
		},SCORING_DELAY);
	}else{
		if(s.pisteytetaan){
			if(s.pisteytys>SCORE_COUNTDOWN_END){
				s.pisteytys -= s.pisteytys / SCORE_COUNTDOWN_DIVISOR;
				varise(VIBRATE_TICK);
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
					s.tummuus=DARKNESS_MENU;
					s.veriSiirtyma=canvas.height;
					
					if(s.pisteet>MIN_COUNTED_SCORE){				
						// Parhaat pisteet
						s.parhaatPisteet.push(s.pisteet);
						s.parhaatPisteet.sort(function(a,b){return b-a});
						s.parhaatPisteet.splice(MAX_RECORDS,1);
						
						localStorage.parhaatPisteet = JSON.stringify(s.tavoiteData);
						
						// Parhaat matkat
						s.parhaatMatkat.push(s.matka);
						s.parhaatMatkat.sort(function(a,b){return b-a});
						s.parhaatMatkat.splice(MAX_RECORDS,1);
						
						localStorage.parhaatMatkat=JSON.stringify(s.parhaatMatkat);

						s.tavoiteData[GOAL_DATA_GAMES_PLAYED]=parseFloat(s.tavoiteData[GOAL_DATA_GAMES_PLAYED])+1; // Laske kaikkien pelattujen pelien määrä
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
				},SCORING_DELAY);
			}
		}
	}
}
