import { klikkiAani } from "../assets.js";
import { soitaAani } from "../audio.js";
import { s, canvas, ctx } from "../state.js";
import { kirjoita, pad } from "../util.js";
import { GOAL_DATA_GAMES_PLAYED, SCREEN_MENU } from "../constants/ids.js";
import { FONT_BODY, FONT_CAPTION, FONT_HEADING, FONT_SUBTITLE, FONT_TITLE, FOOTER_Y, MEDAL_RADIUS, MEDAL_X, MEDAL_Y_OFFSET, MENU_ZONE_TOP, PAGE_MARGIN, PAGE_SUBTITLE_Y, PAGE_TITLE_Y, PODIUM_PLACES, RANK_TEXT_OFFSET, RECORDS_DISTANCES_HEADER_Y, RECORDS_DISTANCES_Y, RECORDS_LEFT_X, RECORDS_ROW_HEIGHT, RECORDS_SCORES_HEADER_Y, RECORDS_SCORES_Y, RECORDS_TEXT_X, STATS_DIGITS, STATS_LABEL_AVERAGE_Y, STATS_LABEL_DISTANCE_Y, STATS_LABEL_GAMES_Y, STATS_UNIT_X, STATS_VALUE_AVERAGE_Y, STATS_VALUE_DISTANCE_Y, STATS_VALUE_GAMES_Y } from "../constants/ui.js";

// Tilastot ja ennätykset (tila 3)
export function piirraTilastot(){
	kirjoita("Tilastot",PAGE_MARGIN,PAGE_TITLE_Y-s.veriSiirtymaNyt,true,FONT_TITLE,"#FFF","'Raleway'");
	kirjoita("Vielä on parantamisen varaa . . .",PAGE_MARGIN,PAGE_SUBTITLE_Y-s.veriSiirtymaNyt/2,true,FONT_BODY,"#FFF","'Source Sans Pro'");

	kirjoita("YHTEENLASKETTU MATKA",PAGE_MARGIN,STATS_LABEL_DISTANCE_Y,true,FONT_CAPTION,"#FFF","'Raleway'");
	kirjoita(pad(s.matkaYht,STATS_DIGITS),PAGE_MARGIN,STATS_VALUE_DISTANCE_Y,true,FONT_HEADING,"#FFF","'Raleway'");
	kirjoita("m",STATS_UNIT_X,STATS_VALUE_DISTANCE_Y,true,FONT_BODY,"#FFF","'Raleway'");

	kirjoita("PELATUT PELIT",PAGE_MARGIN,STATS_LABEL_GAMES_Y,true,FONT_CAPTION,"#FFF","'Raleway'");
	kirjoita(pad(s.tavoiteData[GOAL_DATA_GAMES_PLAYED],STATS_DIGITS),PAGE_MARGIN,STATS_VALUE_GAMES_Y,true,FONT_HEADING,"#FFF","'Raleway'");

	kirjoita("KESKIMÄÄRÄINEN MATKA/PELI",PAGE_MARGIN,STATS_LABEL_AVERAGE_Y,true,FONT_CAPTION,"#FFF","'Raleway'");
	kirjoita(pad(Math.round(s.matkaYht/s.tavoiteData[GOAL_DATA_GAMES_PLAYED]),STATS_DIGITS),PAGE_MARGIN,STATS_VALUE_AVERAGE_Y,true,FONT_HEADING,"#FFF","'Raleway'");
	kirjoita("m",STATS_UNIT_X,STATS_VALUE_AVERAGE_Y,true,FONT_BODY,"#FFF","'Raleway'");

	const sijoitusVarit = ["gold","silver","#A38051"];
	
	// Parhaat pisteet
	kirjoita("PARHAAT PISTEET",RECORDS_LEFT_X,RECORDS_SCORES_HEADER_Y,true,FONT_CAPTION);
	for(let i=0;i<PODIUM_PLACES;i++){
		if(i<PODIUM_PLACES){
			ctx.beginPath();
			ctx.arc(MEDAL_X+1, RECORDS_SCORES_Y+(RECORDS_ROW_HEIGHT*i)-(MEDAL_Y_OFFSET-1), MEDAL_RADIUS, 0, 2 * Math.PI, false);
			ctx.fillStyle = "rgba(0,0,0,.5)";
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.arc(MEDAL_X, RECORDS_SCORES_Y+(RECORDS_ROW_HEIGHT*i)-MEDAL_Y_OFFSET, MEDAL_RADIUS, 0, 2 * Math.PI, false);
			ctx.fillStyle = sijoitusVarit[i];
			ctx.fill();
			ctx.closePath();
		}

		kirjoita(i+1,RECORDS_LEFT_X,RECORDS_SCORES_Y+(RECORDS_ROW_HEIGHT*i)-RANK_TEXT_OFFSET,true,FONT_BODY);
		kirjoita(s.parhaatPisteet[i],RECORDS_TEXT_X,RECORDS_SCORES_Y+(RECORDS_ROW_HEIGHT*i),false,FONT_HEADING,sijoitusVarit[i],"'Source Sans Pro'");
	}
	
	// Parhaat matkat
	kirjoita("PISIMMÄT MATKAT",RECORDS_LEFT_X,RECORDS_DISTANCES_HEADER_Y,true,FONT_CAPTION);
	for(let i=0;i<PODIUM_PLACES;i++){
		if(i<PODIUM_PLACES){
			ctx.beginPath();
			ctx.arc(MEDAL_X+1, RECORDS_DISTANCES_Y+(RECORDS_ROW_HEIGHT*i)-(MEDAL_Y_OFFSET-1), MEDAL_RADIUS, 0, 2 * Math.PI, false);
			ctx.fillStyle = "rgba(0,0,0,.5)";
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.arc(MEDAL_X, RECORDS_DISTANCES_Y+(RECORDS_ROW_HEIGHT*i)-MEDAL_Y_OFFSET, MEDAL_RADIUS, 0, 2 * Math.PI, false);
			ctx.fillStyle = sijoitusVarit[i];
			ctx.fill();
			ctx.closePath();
		}

		kirjoita(i+1,RECORDS_LEFT_X,RECORDS_DISTANCES_Y+(RECORDS_ROW_HEIGHT*i)-RANK_TEXT_OFFSET,true,FONT_BODY);
		kirjoita(s.parhaatMatkat[i],RECORDS_TEXT_X,RECORDS_DISTANCES_Y+(RECORDS_ROW_HEIGHT*i),false,FONT_HEADING,sijoitusVarit[i],"'Source Sans Pro'");
	}

	kirjoita("« Paluu",PAGE_MARGIN,FOOTER_Y,true,FONT_SUBTITLE,"rgba(255,255,255,0.5)","'Source Sans Pro'");
	ctx.textAlign="end";
		kirjoita("HUOM! ALLE 10 METRIN JUOKSUJA EI TILASTOIDA",canvas.width-PAGE_MARGIN,FOOTER_Y,true,FONT_CAPTION);
	ctx.textAlign="start";
}

// Klikkaus tilastoissa (tila 3)
export function kasitteleTilastojenKlikkaus(){
	if(s.y>MENU_ZONE_TOP){ // Takaisin valikkoon
		s.veriSiirtyma=canvas.height;
		s.tila=SCREEN_MENU;
		soitaAani(klikkiAani[0]);
	}
}
