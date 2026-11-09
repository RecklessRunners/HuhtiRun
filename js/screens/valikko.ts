import { klikkiAani, kolikkoKuva, lataus } from "../assets";
import { soitaAani, varise } from "../audio";
import { biomiTyypit, biomiVarit } from "../data";
import { osta } from "../shop";
import { s, canvas, ctx } from "../state";
import { alustaMaasto } from "../terrain";
import { getAngle, kirjoita, tuhaterotin } from "../util";
import { DARKNESS_MENU_FADE, DARKNESS_MENU_MIN, ENEMY_CAUGHT_DISTANCE, ENEMY_REVIVE_DISTANCE, LEVEL_PRICE, MIN_COUNTED_SCORE, SCORE_COUNTDOWN_END, SHIELD_ON_RUN_START, VIBRATE_CLICK, VIBRATE_LONG } from "../constants/gameplay";
import { CANVAS_HEIGHT, CANVAS_WIDTH, START_LANE_X } from "../constants/geometry";
import { GOAL_DATA_MAX_REVIVES, SCREEN_CREDITS, SCREEN_GOALS, SCREEN_LEVELS, SCREEN_MENU, SCREEN_SETTINGS, SCREEN_STATS } from "../constants/ids";
import { ARROW_MARGIN, ARROW_Y, ARROW_ZONE_BOTTOM, ARROW_ZONE_TOP, ARROW_ZONE_WIDTH, BUTTON_GLOW_GROWTH, BUTTON_GROWTH, BUTTON_LIFT, BUTTON_RADIUS, BUTTON_REACH, BUTTON_SHADOW_RADIUS, BUTTON_SPIN_DIVISOR, CREDITS_SCROLL_START, DOT_CENTER_ADJUST, DOT_ROW_Y, DOT_SPACING, FONT_BODY, FONT_DISPLAY, FONT_DOT, FONT_HEADING, FONT_LABEL, FONT_LIST, FONT_PRICE, FONT_SCORE, FONT_TITLE, MENU_BUTTON_LABEL_OFFSET, MENU_LABEL_ALPHA, MENU_LABEL_OFFSET, MENU_SLOTS, MENU_SLOT_CREDITS, MENU_SLOT_GOALS, MENU_SLOT_PLAY, MENU_SLOT_SETTINGS, MENU_SLOT_STATS, MENU_ZONE_HALF_WIDTH, MENU_ZONE_TOP, MONEY_ICON_POS, MONEY_ICON_SIZE, MONEY_TEXT_X, MONEY_TEXT_Y, PANEL_ALPHA, PANEL_EDGE, PANEL_HIGHLIGHT, PLAY_ICON_HALF, PRICE_LABEL_OFFSET, PRICE_LABEL_X, RAY_COUNT, RAY_HALF_WIDTH, RAY_SPACING, RAY_SPEED_DIVISOR, RESULT_CAPTION_Y, RESULT_SCORE_Y, RESULT_TITLE_Y, REVIVE_BUTTON_Y, REVIVE_COUNT_Y, REVIVE_PANEL_OFFSET, TITLE_OFFSET, TM_OFFSET, TM_X_FRACTION } from "../constants/ui";

// Valikoiden tausta ja otsikko
export function piirraValikonTausta(){
	s.tummuus=Math.max(DARKNESS_MENU_MIN,s.tummuus-DARKNESS_MENU_FADE);
	
	ctx.beginPath();
	ctx.strokeStyle="rgba(0,0,0,0.2)";
	ctx.moveTo(0,s.veriSiirtymaNyt-PANEL_EDGE);
	ctx.lineTo(canvas.width,s.veriSiirtymaNyt-PANEL_EDGE);
	ctx.stroke();
	ctx.closePath();
	
	ctx.beginPath();
	ctx.strokeStyle="rgba(255,255,255,0.2)";
	ctx.moveTo(0,s.veriSiirtymaNyt-PANEL_HIGHLIGHT);
	ctx.lineTo(canvas.width,s.veriSiirtymaNyt-PANEL_HIGHLIGHT);
	ctx.stroke();
	ctx.closePath();
	
	ctx.fillStyle="#"+biomiVarit[s.biomi];
	ctx.fillRect(0,s.veriSiirtymaNyt,CANVAS_WIDTH,CANVAS_HEIGHT);
	
	/*if(tummuus>0 && tila==0){
		ctx.fillStyle="rgba(0,0,0,"+Math.min(tummuus,.7)+")";
		ctx.fillRect(0,veriSiirtymaNyt-96,960,128);
	}*/
	
	if(s.tila==SCREEN_MENU || s.elvytysRuutu){
		ctx.fillStyle="#"+biomiVarit[s.biomi];
	}else{
		ctx.fillStyle="rgba(0,0,0,0.25)";
	}
	ctx.globalAlpha=PANEL_ALPHA;
	ctx.fillRect(0,s.veriSiirtymaNyt-PANEL_EDGE,CANVAS_WIDTH,CANVAS_HEIGHT);
	ctx.globalAlpha=1;
	
	// Aseta vihu pelaajan alle
	s.vihuSiirtyma=ENEMY_CAUGHT_DISTANCE;
	
	// Kirjoita otsikko
	ctx.textAlign="center";
		kirjoita("HuhtiRun",canvas.width/2,s.veriSiirtymaNyt-TITLE_OFFSET,true,FONT_DISPLAY,"#FFF","'Fondamento'");
		kirjoita("TM",canvas.width*TM_X_FRACTION,s.veriSiirtymaNyt-TM_OFFSET,true,FONT_BODY);
	ctx.textAlign="start";
}

// Päävalikko (tila 0)
export function piirraPaavalikko(){
	s.tauko=false;
	if((s.elvytysRuutu || s.pisteytetaan) && s.pisteet > MIN_COUNTED_SCORE){
		ctx.textAlign="center";
		if(s.pisteytys>SCORE_COUNTDOWN_END){
			kirjoita(Math.round(s.pisteytys),canvas.width/2,RESULT_SCORE_Y,true,FONT_SCORE,"#FFF","'Raleway'");
			s.tarkkuusLisa=0;
			if(s.pisteytetaan){
				s.tarkkuusLisa=4;
			}
			//kirjoita(rahat+Math.round(pisteet-pisteytys)+tarkkuusLisa,canvas.width/2,288,true);
		}else{
			kirjoita("Sinulla on nyt",canvas.width/2,RESULT_CAPTION_Y,true);
			const kaikkiRahat = s.rahat + s.pisteet;
			kirjoita(kaikkiRahat,canvas.width/2,RESULT_SCORE_Y,true,FONT_SCORE,"#FFF","'Raleway'");
			
			ctx.fillStyle = "rgba(255,255,255,0.05)";
			
			for(let i=0;i<RAY_COUNT;i++){
				ctx.beginPath();
				ctx.moveTo(canvas.width/2,canvas.height/2);
									
				let pos = getAngle(canvas.width/2, canvas.height/2, RAY_SPACING*i+(s.pelaaNo/RAY_SPEED_DIVISOR)-RAY_HALF_WIDTH,canvas.width);
				ctx.lineTo(pos.x, pos.y);
			
				pos = getAngle(canvas.width/2, canvas.height/2, RAY_SPACING*i+(s.pelaaNo/RAY_SPEED_DIVISOR)+RAY_HALF_WIDTH,canvas.width);
				ctx.lineTo(pos.x, pos.y);
				
				ctx.lineTo(canvas.width/2,canvas.height/2);
				
				ctx.fill();
				ctx.closePath();
			}
		}
		if(!s.pisteytetaan && s.elvytysRuutu && s.pisteytys > SCORE_COUNTDOWN_END){
			kirjoita("Kuolema",canvas.width/2,RESULT_TITLE_Y,true,FONT_HEADING);
			kirjoita("Keräsit pisteitä yhteensä",canvas.width/2,RESULT_CAPTION_Y,true);
		}
		if(s.elvytysjuomat>0 && s.pisteytys>SCORE_COUNTDOWN_END){
			ctx.textAlign="center";
				kirjoita("Elvytä",canvas.width/2,REVIVE_BUTTON_Y,true,FONT_HEADING,"#47A94B","'Source Sans Pro'");
				kirjoita(s.elvytysjuomat+" elvytyskertaa jäljellä",canvas.width/2,REVIVE_COUNT_Y,true,FONT_BODY,"#47A94B");
			ctx.textAlign="start";
		}else{
			ctx.textAlign="center";
				kirjoita("Elvytä",canvas.width/2,REVIVE_BUTTON_Y,true,FONT_HEADING,"silver","'Source Sans Pro'");
				kirjoita(s.elvytysjuomat+" elvytyskertaa jäljellä",canvas.width/2,REVIVE_COUNT_Y,true,FONT_BODY,"silver");
			ctx.textAlign="start";		
		}
	}else{
		// Piirrä alamenun vaihtoehdot
		ctx.globalAlpha=MENU_LABEL_ALPHA;
		ctx.textAlign="center";
			kirjoita("Tavoitteet",canvas.width/MENU_SLOTS*MENU_SLOT_GOALS,s.veriSiirtymaNyt-MENU_LABEL_OFFSET,true,FONT_BODY,"#FFF","'Source Sans Pro'");
			kirjoita("Tilastot",canvas.width/MENU_SLOTS*MENU_SLOT_STATS,s.veriSiirtymaNyt-MENU_LABEL_OFFSET,true,FONT_BODY,"#FFF","'Source Sans Pro'");
			kirjoita("Asetukset",canvas.width/MENU_SLOTS*MENU_SLOT_SETTINGS,s.veriSiirtymaNyt-MENU_LABEL_OFFSET,true,FONT_BODY,"#FFF","'Source Sans Pro'");
			kirjoita("Tietoa pelistä",canvas.width/MENU_SLOTS*MENU_SLOT_CREDITS,s.veriSiirtymaNyt-MENU_LABEL_OFFSET,true,FONT_BODY,"#FFF","'Source Sans Pro'");
		ctx.textAlign="start";
		ctx.globalAlpha=1;

		// Piirrä kentänvalitsimet
		ctx.textAlign="center";
		kirjoita("<",ARROW_MARGIN,ARROW_Y,true,FONT_TITLE,"#E0E0E0","'Source Sans Pro'");
		kirjoita(">",canvas.width-ARROW_MARGIN,ARROW_Y,true,FONT_TITLE,"#E0E0E0","'Source Sans Pro'");

		for(let biomiI=0;biomiI<biomiTyypit.length;biomiI++){
			const palloX = (canvas.width/2)+(biomiI*DOT_SPACING)-(biomiTyypit.length*DOT_SPACING/2)+DOT_CENTER_ADJUST;
			if(biomiI==s.biomi){
				kirjoita("●",palloX,DOT_ROW_Y,true,FONT_DOT);
			}else{
				kirjoita("○",palloX,DOT_ROW_Y,true,FONT_DOT);
			}
		}
		//kirjoita(biomiTyypit[biomi],canvas.width/2,384,true,14,"#FFF","Source Sans Pro");
		ctx.textAlign="start";
	}
	if(!s.elvytysRuutu){
		const etaisyys96 = Math.max(0,Math.min(BUTTON_REACH,BUTTON_REACH-(Math.abs(canvas.width/2-s.x)+Math.abs(s.veriSiirtymaNyt-PANEL_EDGE-s.y))));				
		const napinSkaalaus = 1+Math.min(BUTTON_GROWTH,Math.max(0,BUTTON_GROWTH/BUTTON_REACH*etaisyys96));
		
		// Nappula
		ctx.moveTo(canvas.width/2,s.veriSiirtymaNyt-MENU_LABEL_OFFSET-BUTTON_LIFT);
		ctx.save();
		ctx.translate(canvas.width/2,s.veriSiirtymaNyt-MENU_LABEL_OFFSET-BUTTON_LIFT);
		ctx.scale(napinSkaalaus,napinSkaalaus);
		ctx.arc(0,0,BUTTON_RADIUS,s.pelaaNo/BUTTON_SPIN_DIVISOR,s.pelaaNo/BUTTON_SPIN_DIVISOR+((Math.PI*2)/lataus.kaikki*lataus.ladatut),false);
		ctx.translate(-canvas.width/2,-s.veriSiirtymaNyt+MENU_LABEL_OFFSET+BUTTON_LIFT);
		ctx.restore();
		
		ctx.fillStyle="#7FAF1B";
		ctx.fill();
		
		// Nappulan varjo
		ctx.moveTo(canvas.width/2,s.veriSiirtymaNyt-MENU_LABEL_OFFSET-BUTTON_LIFT);
		s.grd = ctx.createRadialGradient(canvas.width/2,s.veriSiirtymaNyt-MENU_LABEL_OFFSET-BUTTON_LIFT,BUTTON_RADIUS,canvas.width/2,s.veriSiirtymaNyt-MENU_LABEL_OFFSET-BUTTON_LIFT,BUTTON_SHADOW_RADIUS);
		s.grd.addColorStop(0,"rgba(0,0,0,0)");
		s.grd.addColorStop(0.5,"rgba(0,0,0,0.1)");
		s.grd.addColorStop(1,"rgba(0,0,0,0)");
		
		ctx.arc(canvas.width/2,s.veriSiirtymaNyt-MENU_LABEL_OFFSET-BUTTON_LIFT,BUTTON_SHADOW_RADIUS,0,Math.PI*2,false);
		
		ctx.fillStyle="rgba(0,0,0,0.01)";
		ctx.fill();

		// Nappulan heijastus
		ctx.moveTo(canvas.width/2,s.veriSiirtymaNyt-MENU_LABEL_OFFSET-BUTTON_LIFT);
		s.grd = ctx.createRadialGradient(canvas.width/2,s.veriSiirtymaNyt-MENU_LABEL_OFFSET-BUTTON_LIFT,0,canvas.width/2,s.veriSiirtymaNyt-MENU_LABEL_OFFSET-BUTTON_LIFT,BUTTON_RADIUS+(BUTTON_GLOW_GROWTH/BUTTON_REACH*etaisyys96));
		s.grd.addColorStop(0,"rgba(255,255,255,0.25)");
		s.grd.addColorStop(0.5,"rgba(255,255,255,0.125)");
		s.grd.addColorStop(0.95,"rgba(0,0,0,0.1)");
		s.grd.addColorStop(1,"rgba(0,0,0,0.25)");
		
		ctx.save();
		ctx.translate(canvas.width/2,REVIVE_BUTTON_Y);
		ctx.scale(napinSkaalaus,napinSkaalaus);
		ctx.arc(canvas.width/2,REVIVE_BUTTON_Y,BUTTON_RADIUS,0,Math.PI*2,false);
		
		ctx.translate(-canvas.width/2,-REVIVE_BUTTON_Y);
		ctx.restore();
		
		ctx.fillStyle=s.grd;
		ctx.fill();
		
		// Play-kuvake
		ctx.moveTo(canvas.width/2,s.veriSiirtymaNyt-MENU_LABEL_OFFSET-BUTTON_LIFT);
		ctx.beginPath();
		ctx.moveTo(canvas.width/2+PLAY_ICON_HALF+1,s.veriSiirtymaNyt-MENU_LABEL_OFFSET+1-BUTTON_LIFT);
		ctx.lineTo(canvas.width/2-PLAY_ICON_HALF+1,s.veriSiirtymaNyt-MENU_LABEL_OFFSET-BUTTON_LIFT+1-PLAY_ICON_HALF);
		ctx.lineTo(canvas.width/2-PLAY_ICON_HALF+1,s.veriSiirtymaNyt-MENU_LABEL_OFFSET+PLAY_ICON_HALF+1-BUTTON_LIFT);
		ctx.lineTo(canvas.width/2+PLAY_ICON_HALF+1,s.veriSiirtymaNyt-MENU_LABEL_OFFSET+1-BUTTON_LIFT);
		ctx.fillStyle="rgba(0,0,0,0.5)";
		ctx.fill();
		ctx.closePath();
	
		ctx.beginPath();
		ctx.moveTo(canvas.width/2+PLAY_ICON_HALF,s.veriSiirtymaNyt-MENU_LABEL_OFFSET-BUTTON_LIFT);
		ctx.lineTo(canvas.width/2-PLAY_ICON_HALF,s.veriSiirtymaNyt-MENU_LABEL_OFFSET-BUTTON_LIFT-PLAY_ICON_HALF);
		ctx.lineTo(canvas.width/2-PLAY_ICON_HALF,s.veriSiirtymaNyt-MENU_LABEL_OFFSET+PLAY_ICON_HALF-BUTTON_LIFT);
		ctx.lineTo(canvas.width/2+PLAY_ICON_HALF,s.veriSiirtymaNyt-MENU_LABEL_OFFSET-BUTTON_LIFT);
		ctx.fillStyle="#FFF";
		ctx.fill();
		ctx.closePath();
		
		ctx.globalAlpha=MENU_LABEL_ALPHA;
		ctx.textAlign="center";
		if(lataus.ladatut >= lataus.kaikki){
			if(s.omatKentat[s.biomi]){
				kirjoita("Uusi peli",canvas.width/2,s.veriSiirtymaNyt-MENU_BUTTON_LABEL_OFFSET,true,FONT_LABEL,"#FFF","'Source Sans Pro'");
			}else{
				kirjoita("Osta kenttä",canvas.width/2,s.veriSiirtymaNyt-MENU_BUTTON_LABEL_OFFSET,true,FONT_LABEL,"#FFF","'Source Sans Pro'");
				kirjoita(LEVEL_PRICE*s.biomi-1,canvas.width/2+PRICE_LABEL_X,s.veriSiirtymaNyt-MENU_LABEL_OFFSET+PRICE_LABEL_OFFSET,false,FONT_PRICE,"#FFF","'Source Sans Pro'");
			}
		}else{
			kirjoita("Ladataan "+Math.round(100/lataus.kaikki*lataus.ladatut)+"%",canvas.width/2,s.veriSiirtymaNyt-MENU_BUTTON_LABEL_OFFSET,true,FONT_LABEL,"#FFF","'Source Sans Pro'");
		}
		ctx.textAlign="start";
		ctx.globalAlpha=1;
	}
}

// Rahatilanne vasemmassa yläkulmassa (tilat 0 ja 1)
export function piirraRahat(){
	if(!s.elvytysRuutu){
		// Näytä rahatilanne vasemmassa yläkulmassa
		ctx.drawImage(kolikkoKuva[0],MONEY_ICON_POS,MONEY_ICON_POS,MONEY_ICON_SIZE,MONEY_ICON_SIZE);
		kirjoita(Math.round(tuhaterotin(s.rahat)),MONEY_TEXT_X,MONEY_TEXT_Y,false,FONT_LIST,"#FFF","'Raleway'");
	}
}

// Klikkaus päävalikossa (tila 0)
export function kasitteleValikonKlikkaus(){
	varise(VIBRATE_CLICK);
	if(s.y>ARROW_ZONE_TOP && s.y<ARROW_ZONE_BOTTOM){
		if(!s.elvytysRuutu){
			if(s.x<ARROW_ZONE_WIDTH){
				if(s.biomi>0){
					s.biomi=Math.max(0,s.biomi-1);
				}else{
					s.biomi=biomiTyypit.length-1;
				}
			}
			if(s.x>canvas.width-ARROW_ZONE_WIDTH){
				if(s.biomi<biomiTyypit.length-1){
					s.biomi=Math.min(biomiTyypit.length-1,s.biomi+1);
				}else{
					s.biomi=0;
				}
			}
			soitaAani(klikkiAani[0]);
			alustaMaasto();
			s.ukkoX=START_LANE_X;
			localStorage.valittuKentta = s.biomi;
		}
	}
	if(s.y>MENU_ZONE_TOP){
		if(s.elvytysRuutu){
			if(s.pisteytys>SCORE_COUNTDOWN_END && s.elvytysjuomat>0){
				s.striikki=0;
				s.elvytysjuomat -= 1;
				localStorage.elvytysjuomat = s.elvytysjuomat;
				s.veriSiirtyma = canvas.height - REVIVE_PANEL_OFFSET;
				s.vihuSiirtyma = ENEMY_REVIVE_DISTANCE;
				s.hengissa = true;
				s.suojakilpi += SHIELD_ON_RUN_START;
				s.pelikerrat += 1;
				s.tavoiteData[GOAL_DATA_MAX_REVIVES] = Math.max(s.tavoiteData[GOAL_DATA_MAX_REVIVES],s.pelikerrat);
				varise(VIBRATE_LONG);
			}
		}else{
			if(s.x>=canvas.width/MENU_SLOTS*MENU_SLOT_GOALS-MENU_ZONE_HALF_WIDTH && s.x<canvas.width/MENU_SLOTS*MENU_SLOT_GOALS+MENU_ZONE_HALF_WIDTH){ // Siirry Tavoitteet-sivulle
				s.veriSiirtyma=0;
				s.tavoiteNo=0;
				s.tila=SCREEN_GOALS;
				soitaAani(klikkiAani[0]);
			}
			if(s.x>=canvas.width/MENU_SLOTS*MENU_SLOT_STATS-MENU_ZONE_HALF_WIDTH && s.x<canvas.width/MENU_SLOTS*MENU_SLOT_STATS+MENU_ZONE_HALF_WIDTH){ // Siirry Tilastot-sivulle
				s.veriSiirtyma=0;
				s.tila=SCREEN_STATS;
				soitaAani(klikkiAani[0]);
			}
			if(s.x>=canvas.width/MENU_SLOTS*MENU_SLOT_PLAY-MENU_ZONE_HALF_WIDTH && s.x<canvas.width/MENU_SLOTS*MENU_SLOT_PLAY+MENU_ZONE_HALF_WIDTH){
				soitaAani(klikkiAani[0]);
				if(s.omatKentat[s.biomi]){
					s.tila=SCREEN_LEVELS;
				}else{
					if(osta(LEVEL_PRICE*s.biomi-1,biomiTyypit[s.biomi],true)){
						s.omatKentat[s.biomi]=true;
						localStorage.omatKentat=JSON.stringify(s.omatKentat);
						s.tila=SCREEN_LEVELS;
					}
				}
			}
			if(s.x>=canvas.width/MENU_SLOTS*MENU_SLOT_SETTINGS-MENU_ZONE_HALF_WIDTH && s.x<canvas.width/MENU_SLOTS*MENU_SLOT_SETTINGS+MENU_ZONE_HALF_WIDTH){ // Siirry Asetukset-sivulle
				s.veriSiirtyma=0;
				s.tila=SCREEN_SETTINGS;
				soitaAani(klikkiAani[0]);
			}
			if(s.x>=canvas.width/MENU_SLOTS*MENU_SLOT_CREDITS-MENU_ZONE_HALF_WIDTH && s.x<canvas.width/MENU_SLOTS*MENU_SLOT_CREDITS+MENU_ZONE_HALF_WIDTH){ // Siirry Tietoja-sivulle
				s.veriSiirtyma=0;
				s.tekijaSkrolli = CREDITS_SCROLL_START;
				s.tila=SCREEN_CREDITS;
				soitaAani(klikkiAani[0]);
			}
		}
	}
}
