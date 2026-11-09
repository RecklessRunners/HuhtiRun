import { kimalle, klikkiAani, mitalinauha, mitalit } from "../assets";
import { soitaAani } from "../audio";
import { tavoitteet } from "../data";
import { s, canvas, ctx } from "../state";
import { getAngle, kirjoita } from "../util";
import { SCREEN_MENU } from "../constants/ids";
import { ARROW_MARGIN, ARROW_Y, DOT_CENTER_ADJUST, DOT_SPACING, FONT_BODY, FONT_DOT, FONT_HEADING, FONT_LABEL, FONT_SUBTITLE, FONT_TITLE, FOOTER_Y, GOAL_CHECK_Y, GOAL_DESC_Y, GOAL_DOT_ROW_Y, GOAL_GLOW_RADIUS, GOAL_GLOW_RANGE, GOAL_NAME_Y, GOAL_RING_RADIUS, GOAL_RING_RANGE, GOAL_RING_X, GOAL_RING_Y, GOAL_STATUS_X, GOAL_STATUS_Y, GOAL_STATUS_Y2, GOAL_TEXT_X, MEDAL_IMAGE_SIZE, MEDAL_IMAGE_X, MEDAL_IMAGE_Y, MENU_ZONE_TOP, NAV_ZONES, PAGE_MARGIN, PAGE_SUBTITLE_Y, PAGE_TITLE_Y, RAY_COUNT, RAY_HALF_WIDTH, RAY_SPACING, RIBBON_X, RIBBON_Y, RING_LINE_WIDTH, RING_START_ANGLE, RING_TEXT_OFFSET, RING_UNIT_OFFSET, SPARKLE_SIZE_MIN, SPARKLE_SIZE_RANGE, SPARKLE_THRESHOLD } from "../constants/ui";

// Tavoitteet (tila 2)
export function piirraTavoitteet(){
	kirjoita(tavoitteet[s.tavoiteNo].nimi,GOAL_TEXT_X,GOAL_NAME_Y,true,FONT_SUBTITLE,"#FFF","'Raleway'");
	kirjoita(tavoitteet[s.tavoiteNo].kuvaus,GOAL_TEXT_X,GOAL_DESC_Y,false,FONT_LABEL,"#FFF","'Source Sans Pro'");
	
	if(tavoitteet[s.tavoiteNo].vaatimus()>=1){
	
		s.grd = ctx.createRadialGradient(GOAL_RING_X,GOAL_RING_Y,0,GOAL_RING_X,GOAL_RING_Y,GOAL_GLOW_RADIUS/GOAL_GLOW_RANGE*(GOAL_GLOW_RANGE-s.veriSiirtymaNyt));
		
		s.grd.addColorStop(0,"rgba(255,255,255,0.1)");
		s.grd.addColorStop(0.5,"rgba(255,255,255,0.1)");
		s.grd.addColorStop(1,"transparent");
	
		ctx.fillStyle = s.grd;
	
		for(let i=0;i<RAY_COUNT;i++){
			ctx.beginPath();
			ctx.moveTo(GOAL_RING_X,GOAL_RING_Y);
							
			let pos = getAngle(GOAL_RING_X, GOAL_RING_Y, RAY_SPACING*i+(s.pelaaNo)-RAY_HALF_WIDTH,GOAL_GLOW_RADIUS/GOAL_GLOW_RANGE*(GOAL_GLOW_RANGE-s.veriSiirtymaNyt));
			ctx.lineTo(pos.x, pos.y);
	
			pos = getAngle(GOAL_RING_X, GOAL_RING_Y, RAY_SPACING*i+(s.pelaaNo)+RAY_HALF_WIDTH,GOAL_GLOW_RADIUS/GOAL_GLOW_RANGE*(GOAL_GLOW_RANGE-s.veriSiirtymaNyt));
			ctx.lineTo(pos.x, pos.y);
		
			ctx.fill();
			ctx.closePath();
		}
		
		kirjoita("☑",GOAL_TEXT_X,GOAL_CHECK_Y,false,FONT_HEADING,"#47A94B");
		kirjoita("Suoritettu",GOAL_STATUS_X,GOAL_STATUS_Y,true,FONT_LABEL,"#47A94B","'Source Sans Pro'");
		kirjoita("Onneksi olkoon!",GOAL_STATUS_X,GOAL_STATUS_Y2,false,FONT_LABEL,"#47A94B","'Source Sans Pro'");
		ctx.drawImage(mitalinauha[0],RIBBON_X,RIBBON_Y);
		ctx.drawImage(mitalit[s.tavoiteNo],MEDAL_IMAGE_X,MEDAL_IMAGE_Y);
		if(Math.random()>SPARKLE_THRESHOLD){
			const kimalleKoko = SPARKLE_SIZE_MIN+Math.random()*SPARKLE_SIZE_RANGE;
			ctx.drawImage(kimalle[0],MEDAL_IMAGE_X+Math.random()*MEDAL_IMAGE_SIZE-(kimalleKoko/2),MEDAL_IMAGE_Y+Math.random()*MEDAL_IMAGE_SIZE-(kimalleKoko/2),kimalleKoko,kimalleKoko);
		}
		/*ctx.drawImage(mitalinauha[0],-64,-32);
		ctx.drawImage(mitalit[tavoiteNo],64,176);*/
	}else{
		const aloitusPiste = RING_START_ANGLE;
		
		ctx.beginPath();
		ctx.arc(GOAL_RING_X+1,GOAL_RING_Y+1,GOAL_RING_RADIUS,aloitusPiste,aloitusPiste+((360/1*tavoitteet[s.tavoiteNo].vaatimus())*(Math.PI/180)/GOAL_RING_RANGE*(GOAL_RING_RANGE-s.veriSiirtymaNyt)),false);
		ctx.lineWidth = RING_LINE_WIDTH;
		ctx.strokeStyle = "#000";
		ctx.stroke();
		ctx.closePath();
		
		ctx.beginPath();
		ctx.arc(GOAL_RING_X,GOAL_RING_Y,GOAL_RING_RADIUS,aloitusPiste,aloitusPiste+((360/1*tavoitteet[s.tavoiteNo].vaatimus())*(Math.PI/180)/GOAL_RING_RANGE*(GOAL_RING_RANGE-s.veriSiirtymaNyt)),false);
		ctx.lineWidth = RING_LINE_WIDTH;
		ctx.strokeStyle = "gold";
		ctx.stroke();
		ctx.closePath();
		
		ctx.textAlign="center";
			kirjoita(Math.floor(tavoitteet[s.tavoiteNo].vaatimus()*100/GOAL_RING_RANGE*(GOAL_RING_RANGE-s.veriSiirtymaNyt)),GOAL_RING_X,GOAL_RING_Y+RING_TEXT_OFFSET,true,FONT_HEADING,"gold","'Raleway'");
			kirjoita("%",GOAL_RING_X,GOAL_RING_Y+RING_UNIT_OFFSET,true,FONT_BODY,"gold");
		ctx.textAlign="start";
		kirjoita("☐",GOAL_TEXT_X,GOAL_CHECK_Y,false,FONT_HEADING,"silver");
		kirjoita("Jaksaa, jaksaa!",GOAL_STATUS_X,GOAL_STATUS_Y,true,FONT_LABEL,"silver","'Source Sans Pro'");
		kirjoita(Math.floor(tavoitteet[s.tavoiteNo].vaatimus()*100) + " % suoritettu",GOAL_STATUS_X,GOAL_STATUS_Y2,false,FONT_LABEL,"silver","'Source Sans Pro'");
	}
	
	/*ctx.fillStyle = "rgba(0,0,0,0.25)";
	ctx.fillRect(48,80,272,88);*/
	
	kirjoita("Tavoitteet",PAGE_MARGIN,PAGE_TITLE_Y-s.veriSiirtymaNyt,true,FONT_TITLE,"#FFF","'Raleway'");
	kirjoita("Näitä sinun pitää kerätä!",PAGE_MARGIN,PAGE_SUBTITLE_Y-s.veriSiirtymaNyt/2,true,FONT_BODY,"#FFF","'Source Sans Pro'");

	for(let tavoiteI=0;tavoiteI<tavoitteet.length;tavoiteI++){
		const palloX = (canvas.width/2)+(tavoiteI*DOT_SPACING)-(tavoitteet.length*DOT_SPACING/2)+DOT_CENTER_ADJUST;
		let palloVari = "silver";
		if(tavoitteet[tavoiteI].vaatimus()>=1){
			palloVari="#47A94B";
		}
		if(tavoiteI==s.tavoiteNo){
			kirjoita("●",palloX,GOAL_DOT_ROW_Y,true,FONT_DOT,palloVari);
		}else{
			kirjoita("○",palloX,GOAL_DOT_ROW_Y,true,FONT_DOT,palloVari);
		}
	}	

	// Piirrä tavoitteen valitsimet
	ctx.textAlign="center";
		kirjoita("<",ARROW_MARGIN,ARROW_Y,true,FONT_TITLE,"#E0E0E0","'Source Sans Pro'");
		kirjoita(">",canvas.width-ARROW_MARGIN,ARROW_Y,true,FONT_TITLE,"#E0E0E0","'Source Sans Pro'");
	ctx.textAlign="start";
	kirjoita("« Paluu",PAGE_MARGIN,FOOTER_Y,true,FONT_SUBTITLE,"rgba(255,255,255,0.5)","'Source Sans Pro'");
}

// Klikkaus tavoitteissa (tila 2)
export function kasitteleTavoitteidenKlikkaus(){
	soitaAani(klikkiAani[0]);
	if(s.x<canvas.width/NAV_ZONES){ // Edellinen
		s.tavoiteNo -= 1;
		if(s.tavoiteNo == -1){
			s.tavoiteNo = tavoitteet.length-1;
		}
	}
	if(s.x>canvas.width/NAV_ZONES*(NAV_ZONES-1)){ // Seuraava
		s.tavoiteNo += 1;
		if(s.tavoiteNo>tavoitteet.length-1){
			s.tavoiteNo=0;
		}
	}
	if(s.y>MENU_ZONE_TOP){ // Paluu valikkoon
		s.veriSiirtyma=canvas.height;
		s.tila=SCREEN_MENU;
	}
}
