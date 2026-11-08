import { huuto, klikkiAani, medikit, tausta } from "../assets.js";
import { soitaAani, varise } from "../audio.js";
import { naytaIlmoitus } from "../modals.js";
import { osta } from "../shop.js";
import { s, canvas, ctx } from "../state.js";
import { alustaMaasto } from "../terrain.js";
import { kirjoita } from "../util.js";

// Kenttävalinta (tila 1)
export function piirraKenttavalinta(){
	kirjoita("Valmiina . . .",64,128-s.veriSiirtymaNyt,true,48,"#FFF","'Raleway'");
	kirjoita("Halutessasi voit ostaa power-upeja ennen peliä",64,152-s.veriSiirtymaNyt/2,true,16,"#FFF","'Source Sans Pro'");
	
	ctx.textAlign="center";
	ctx.drawImage(medikit[0],canvas.width/4-96+32,192+s.veriSiirtymaNyt/9+48);
	kirjoita("Elvytys",canvas.width/4,192+s.veriSiirtymaNyt/9,true,20,"#FFF","'Raleway'");
	kirjoita((100*Math.pow(2,s.elvytysjuomat)-1)+" (HR)",canvas.width/4,192+s.veriSiirtymaNyt/9+18,true,12,"silver");
	kirjoita("Mahdollistaa henkiin",canvas.width/4,396+s.veriSiirtymaNyt/9);
	kirjoita("heräämisen kuollessasi",canvas.width/4,420+s.veriSiirtymaNyt/9);
	let elvytysteksti;
	if(s.elvytysjuomat==0){
		elvytysteksti = "EI ELVYTYSKERTOJA";
	}
	if(s.elvytysjuomat==1){
		elvytysteksti = s.elvytysjuomat+" ELVYTYSKERTA";
	}
	if(s.elvytysjuomat > 1){
		elvytysteksti = s.elvytysjuomat+" ELVYTYSKERTAA";
	}
	kirjoita(elvytysteksti,canvas.width/4,444+s.veriSiirtymaNyt/9,true,12,"silver");

	kirjoita("Bonusta enemmän",canvas.width/4*2,192+s.veriSiirtymaNyt/6,true,20,"#FFF","'Raleway'");
	kirjoita("TULOSSA MYÖHEMMIN",canvas.width/4*2,192+s.veriSiirtymaNyt/6+18,true,12,"silver");
	kirjoita("Saat enemmän pisteitä",canvas.width/4*2,396+s.veriSiirtymaNyt/6);
	kirjoita("bonusmittarin täyttyessä",canvas.width/4*2,420+s.veriSiirtymaNyt/6);
	kirjoita("0/5 PÄIVITETTY",canvas.width/4*2,444+s.veriSiirtymaNyt/6,true,12,"silver");

	kirjoita("Alkupotkaisu",canvas.width/4*3,192+s.veriSiirtymaNyt/3,true,20,"#FFF","'Raleway'");
	kirjoita(Math.floor(199+50*(s.alkupotkaisu/25))+" (HR)",canvas.width/4*3,192+s.veriSiirtymaNyt/3+18,true,12,"silver");
	kirjoita("Hanki itsellesi "+(25+s.alkupotkaisu)+" m",canvas.width/4*3,396+s.veriSiirtymaNyt/3);
	kirjoita("etumatkaa pelin alkaessa",canvas.width/4*3,420+s.veriSiirtymaNyt/3);
	kirjoita(s.alkupotkaisu+" METRIÄ",canvas.width/4*3,444+s.veriSiirtymaNyt/3,true,12,"silver");

	ctx.textAlign="end";
		kirjoita("Aloita peli »",canvas.width-64,512,true,24,"#47A94B","'Source Sans Pro'");
	ctx.textAlign="start";
	s.veriSiirtyma=0;
	kirjoita("« Paluu",64,512,true,24,"rgba(255,255,255,0.5)","'Source Sans Pro'");
}

// Klikkaus kenttävalinnassa ja kaupassa (tila 1)
export function kasitteleKentanKlikkaus(){
	varise(100);
	if(s.y>448){
		if(s.x>=48 && s.x<256){ // Siirry takaisin
			s.tila=0;
			s.veriSiirtyma=canvas.height;
			soitaAani(klikkiAani[0]);
		}
		if(s.x>=512){ 
			s.veriSiirtyma=canvas.height;
			if(! s.inaktiivinenMenu){ // Aloita uusi peli
				s.lentavatObjektit = [];
				s.striikki=0;
				s.tila=0;
				soitaAani(klikkiAani[0]);
				alustaMaasto();
				s.vihuSiirtyma=512;
				s.pelaajaNopeus=10;
				soitaAani(huuto[0]);
				s.hengissa=true;
				s.pisteet=0;
				s.matka=0;
				s.bonuspisteet=0;
				tausta[0].volume=1;
				s.suojakilpi+=3;
				s.pelikerrat=0;
				varise(1000);
			}
		}
	}else{
		if(s.y>192){
			if(s.x >= canvas.width/4-96 && s.x < canvas.width/4+96){
				if(osta(100*Math.pow(2,s.elvytysjuomat)-1,"Elvytys",true)){
					s.elvytysjuomat+=1;
					localStorage.elvytysjuomat=s.elvytysjuomat;
				}
			}
			if(s.x >= canvas.width/4*2-96 && s.x < canvas.width/4*2+96){
				naytaIlmoitus("Tulossa myöhemmin!");
			}
			if(s.x >= canvas.width/4*3-96 && s.x < canvas.width/4*3+96){
				if(osta(199+50*(s.alkupotkaisu/25),"Alkupotkaisu 25 m",true)){
					s.alkupotkaisu+=25;
				}
			}
		}
	}
}
