import { huuto, klikkiAani, medikit, tausta } from "../assets";
import { soitaAani, varise } from "../audio";
import { naytaIlmoitus } from "../modals";
import { osta } from "../shop";
import { s, canvas, ctx } from "../state";
import { alustaMaasto } from "../terrain";
import { kirjoita } from "../util";
import { ENEMY_START_DISTANCE, KICKSTART_BASE_PRICE, KICKSTART_PRICE_STEP, KICKSTART_STEP, PLAYER_BASE_SPEED, REVIVE_BASE_PRICE, SHIELD_ON_RUN_START, VIBRATE_CLICK, VIBRATE_LONG } from "../constants/gameplay";
import { SCREEN_MENU } from "../constants/ids";
import { BACK_ZONE_LEFT, BACK_ZONE_RIGHT, FONT_BODY, FONT_CAPTION, FONT_LIST, FONT_SUBTITLE, FONT_TITLE, FOOTER_Y, MEDKIT_OFFSET_X, MEDKIT_OFFSET_Y, MENU_ZONE_TOP, PAGE_MARGIN, PAGE_SUBTITLE_Y, PAGE_TITLE_Y, SHOP_DESC_Y1, SHOP_DESC_Y2, SHOP_ITEM_HALF_WIDTH, SHOP_ITEM_Y, SHOP_PRICE_OFFSET, SHOP_SLIDE_BONUS, SHOP_SLIDE_KICKSTART, SHOP_SLIDE_REVIVE, SHOP_SLOTS, SHOP_SLOT_BONUS, SHOP_SLOT_KICKSTART, SHOP_SLOT_REVIVE, SHOP_STATUS_Y, SHOP_ZONE_TOP, START_ZONE_LEFT } from "../constants/ui";

// Kenttävalinta (tila 1)
export function piirraKenttavalinta(){
	kirjoita("Valmiina . . .",PAGE_MARGIN,PAGE_TITLE_Y-s.veriSiirtymaNyt,true,FONT_TITLE,"#FFF","'Raleway'");
	kirjoita("Halutessasi voit ostaa power-upeja ennen peliä",PAGE_MARGIN,PAGE_SUBTITLE_Y-s.veriSiirtymaNyt/2,true,FONT_BODY,"#FFF","'Source Sans Pro'");
	
	ctx.textAlign="center";
	ctx.drawImage(medikit[0],canvas.width/SHOP_SLOTS*SHOP_SLOT_REVIVE-MEDKIT_OFFSET_X,SHOP_ITEM_Y+s.veriSiirtymaNyt/SHOP_SLIDE_REVIVE+MEDKIT_OFFSET_Y);
	kirjoita("Elvytys",canvas.width/SHOP_SLOTS*SHOP_SLOT_REVIVE,SHOP_ITEM_Y+s.veriSiirtymaNyt/SHOP_SLIDE_REVIVE,true,FONT_LIST,"#FFF","'Raleway'");
	kirjoita((REVIVE_BASE_PRICE*Math.pow(2,s.elvytysjuomat)-1)+" (HR)",canvas.width/SHOP_SLOTS*SHOP_SLOT_REVIVE,SHOP_ITEM_Y+s.veriSiirtymaNyt/SHOP_SLIDE_REVIVE+SHOP_PRICE_OFFSET,true,FONT_CAPTION,"silver");
	kirjoita("Mahdollistaa henkiin",canvas.width/SHOP_SLOTS*SHOP_SLOT_REVIVE,SHOP_DESC_Y1+s.veriSiirtymaNyt/SHOP_SLIDE_REVIVE);
	kirjoita("heräämisen kuollessasi",canvas.width/SHOP_SLOTS*SHOP_SLOT_REVIVE,SHOP_DESC_Y2+s.veriSiirtymaNyt/SHOP_SLIDE_REVIVE);
	let elvytysteksti = "";
	if(s.elvytysjuomat==0){
		elvytysteksti = "EI ELVYTYSKERTOJA";
	}
	if(s.elvytysjuomat==1){
		elvytysteksti = s.elvytysjuomat+" ELVYTYSKERTA";
	}
	if(s.elvytysjuomat > 1){
		elvytysteksti = s.elvytysjuomat+" ELVYTYSKERTAA";
	}
	kirjoita(elvytysteksti,canvas.width/SHOP_SLOTS*SHOP_SLOT_REVIVE,SHOP_STATUS_Y+s.veriSiirtymaNyt/SHOP_SLIDE_REVIVE,true,FONT_CAPTION,"silver");

	kirjoita("Bonusta enemmän",canvas.width/SHOP_SLOTS*SHOP_SLOT_BONUS,SHOP_ITEM_Y+s.veriSiirtymaNyt/SHOP_SLIDE_BONUS,true,FONT_LIST,"#FFF","'Raleway'");
	kirjoita("TULOSSA MYÖHEMMIN",canvas.width/SHOP_SLOTS*SHOP_SLOT_BONUS,SHOP_ITEM_Y+s.veriSiirtymaNyt/SHOP_SLIDE_BONUS+SHOP_PRICE_OFFSET,true,FONT_CAPTION,"silver");
	kirjoita("Saat enemmän pisteitä",canvas.width/SHOP_SLOTS*SHOP_SLOT_BONUS,SHOP_DESC_Y1+s.veriSiirtymaNyt/SHOP_SLIDE_BONUS);
	kirjoita("bonusmittarin täyttyessä",canvas.width/SHOP_SLOTS*SHOP_SLOT_BONUS,SHOP_DESC_Y2+s.veriSiirtymaNyt/SHOP_SLIDE_BONUS);
	kirjoita("0/5 PÄIVITETTY",canvas.width/SHOP_SLOTS*SHOP_SLOT_BONUS,SHOP_STATUS_Y+s.veriSiirtymaNyt/SHOP_SLIDE_BONUS,true,FONT_CAPTION,"silver");

	kirjoita("Alkupotkaisu",canvas.width/SHOP_SLOTS*SHOP_SLOT_KICKSTART,SHOP_ITEM_Y+s.veriSiirtymaNyt/SHOP_SLIDE_KICKSTART,true,FONT_LIST,"#FFF","'Raleway'");
	kirjoita(Math.floor(KICKSTART_BASE_PRICE+KICKSTART_PRICE_STEP*(s.alkupotkaisu/KICKSTART_STEP))+" (HR)",canvas.width/SHOP_SLOTS*SHOP_SLOT_KICKSTART,SHOP_ITEM_Y+s.veriSiirtymaNyt/SHOP_SLIDE_KICKSTART+SHOP_PRICE_OFFSET,true,FONT_CAPTION,"silver");
	kirjoita("Hanki itsellesi "+(KICKSTART_STEP+s.alkupotkaisu)+" m",canvas.width/SHOP_SLOTS*SHOP_SLOT_KICKSTART,SHOP_DESC_Y1+s.veriSiirtymaNyt/SHOP_SLIDE_KICKSTART);
	kirjoita("etumatkaa pelin alkaessa",canvas.width/SHOP_SLOTS*SHOP_SLOT_KICKSTART,SHOP_DESC_Y2+s.veriSiirtymaNyt/SHOP_SLIDE_KICKSTART);
	kirjoita(s.alkupotkaisu+" METRIÄ",canvas.width/SHOP_SLOTS*SHOP_SLOT_KICKSTART,SHOP_STATUS_Y+s.veriSiirtymaNyt/SHOP_SLIDE_KICKSTART,true,FONT_CAPTION,"silver");

	ctx.textAlign="end";
		kirjoita("Aloita peli »",canvas.width-PAGE_MARGIN,FOOTER_Y,true,FONT_SUBTITLE,"#47A94B","'Source Sans Pro'");
	ctx.textAlign="start";
	s.veriSiirtyma=0;
	kirjoita("« Paluu",PAGE_MARGIN,FOOTER_Y,true,FONT_SUBTITLE,"rgba(255,255,255,0.5)","'Source Sans Pro'");
}

// Klikkaus kenttävalinnassa ja kaupassa (tila 1)
export function kasitteleKentanKlikkaus(){
	varise(VIBRATE_CLICK);
	if(s.y>MENU_ZONE_TOP){
		if(s.x>=BACK_ZONE_LEFT && s.x<BACK_ZONE_RIGHT){ // Siirry takaisin
			s.tila=SCREEN_MENU;
			s.veriSiirtyma=canvas.height;
			soitaAani(klikkiAani[0]);
		}
		if(s.x>=START_ZONE_LEFT){ 
			s.veriSiirtyma=canvas.height;
			if(! s.inaktiivinenMenu){ // Aloita uusi peli
				s.lentavatObjektit = [];
				s.striikki=0;
				s.tila=SCREEN_MENU;
				soitaAani(klikkiAani[0]);
				alustaMaasto();
				s.vihuSiirtyma=ENEMY_START_DISTANCE;
				s.pelaajaNopeus=PLAYER_BASE_SPEED;
				soitaAani(huuto[0]);
				s.hengissa=true;
				s.pisteet=0;
				s.matka=0;
				s.bonuspisteet=0;
				tausta[0].volume=1;
				s.suojakilpi+=SHIELD_ON_RUN_START;
				s.pelikerrat=0;
				varise(VIBRATE_LONG);
			}
		}
	}else{
		if(s.y>SHOP_ZONE_TOP){
			if(s.x >= canvas.width/SHOP_SLOTS*SHOP_SLOT_REVIVE-SHOP_ITEM_HALF_WIDTH && s.x < canvas.width/SHOP_SLOTS*SHOP_SLOT_REVIVE+SHOP_ITEM_HALF_WIDTH){
				if(osta(REVIVE_BASE_PRICE*Math.pow(2,s.elvytysjuomat)-1,"Elvytys",true)){
					s.elvytysjuomat+=1;
					localStorage.elvytysjuomat=s.elvytysjuomat;
				}
			}
			if(s.x >= canvas.width/SHOP_SLOTS*SHOP_SLOT_BONUS-SHOP_ITEM_HALF_WIDTH && s.x < canvas.width/SHOP_SLOTS*SHOP_SLOT_BONUS+SHOP_ITEM_HALF_WIDTH){
				naytaIlmoitus("Tulossa myöhemmin!");
			}
			if(s.x >= canvas.width/SHOP_SLOTS*SHOP_SLOT_KICKSTART-SHOP_ITEM_HALF_WIDTH && s.x < canvas.width/SHOP_SLOTS*SHOP_SLOT_KICKSTART+SHOP_ITEM_HALF_WIDTH){
				if(osta(KICKSTART_BASE_PRICE+KICKSTART_PRICE_STEP*(s.alkupotkaisu/KICKSTART_STEP),"Alkupotkaisu 25 m",true)){
					s.alkupotkaisu+=KICKSTART_STEP;
				}
			}
		}
	}
}
