import { kimalle, klikkiAani, mitalinauha, mitalit } from "../assets.js";
import { soitaAani } from "../audio.js";
import { tavoitteet } from "../data.js";
import { s, canvas, ctx } from "../state.js";
import { getAngle, kirjoita } from "../util.js";

// Tavoitteet (tila 2)
export function piirraTavoitteet(){
	kirjoita(tavoitteet[s.tavoiteNo].nimi,320,192+24,true,24,"#FFF","'Raleway'");
	kirjoita(tavoitteet[s.tavoiteNo].kuvaus,320,224+24,false,18,"#FFF","'Source Sans Pro'");
	
	if(tavoitteet[s.tavoiteNo].vaatimus()>=1){
	
		s.grd = ctx.createRadialGradient(192,256,0,192,256,256/512*(512-s.veriSiirtymaNyt));
		
		s.grd.addColorStop(0,"rgba(255,255,255,0.1)");
		s.grd.addColorStop(0.5,"rgba(255,255,255,0.1)");
		s.grd.addColorStop(1,"transparent");
	
		ctx.fillStyle = s.grd;
	
		for(let i=0;i<6;i++){
			ctx.beginPath();
			ctx.moveTo(192,256);
							
			let pos = getAngle(192, 256, 60*i+(s.pelaaNo)-15,256/512*(512-s.veriSiirtymaNyt));
			ctx.lineTo(pos.x, pos.y);
	
			pos = getAngle(192, 256, 60*i+(s.pelaaNo)+15,256/512*(512-s.veriSiirtymaNyt));
			ctx.lineTo(pos.x, pos.y);
		
			ctx.fill();
			ctx.closePath();
		}
		
		kirjoita("☑",320,288+24,false,32,"#47A94B");
		kirjoita("Suoritettu",372,272+24,true,18,"#47A94B","'Source Sans Pro'");
		kirjoita("Onneksi olkoon!",372,292+24,false,18,"#47A94B","'Source Sans Pro'");
		ctx.drawImage(mitalinauha[0],64,-104);
		ctx.drawImage(mitalit[s.tavoiteNo],128,192);
		if(Math.random()>0.75){
			const kimalleKoko = 8+Math.random()*8;
			ctx.drawImage(kimalle[0],128+Math.random()*128-(kimalleKoko/2),192+Math.random()*128-(kimalleKoko/2),kimalleKoko,kimalleKoko);
		}
		/*ctx.drawImage(mitalinauha[0],-64,-32);
		ctx.drawImage(mitalit[tavoiteNo],64,176);*/
	}else{
		const aloitusPiste = 4.71238898;
		
		ctx.beginPath();
		ctx.arc(192+1,256+1,64,aloitusPiste,aloitusPiste+((360/1*tavoitteet[s.tavoiteNo].vaatimus())*(Math.PI/180)/384*(384-s.veriSiirtymaNyt)),false);
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#000";
		ctx.stroke();
		ctx.closePath();
		
		ctx.beginPath();
		ctx.arc(192,256,64,aloitusPiste,aloitusPiste+((360/1*tavoitteet[s.tavoiteNo].vaatimus())*(Math.PI/180)/384*(384-s.veriSiirtymaNyt)),false);
		ctx.lineWidth = 2;
		ctx.strokeStyle = "gold";
		ctx.stroke();
		ctx.closePath();
		
		ctx.textAlign="center";
			kirjoita(Math.floor(tavoitteet[s.tavoiteNo].vaatimus()*100/384*(384-s.veriSiirtymaNyt)),192,256+8,true,32,"gold","'Raleway'");
			kirjoita("%",192,256+48,true,16,"gold");
		ctx.textAlign="start";
		kirjoita("☐",320,288+24,false,32,"silver");
		kirjoita("Jaksaa, jaksaa!",372,272+24,true,18,"silver","'Source Sans Pro'");
		kirjoita(Math.floor(tavoitteet[s.tavoiteNo].vaatimus()*100) + " % suoritettu",372,292+24,false,18,"silver","'Source Sans Pro'");
	}
	
	/*ctx.fillStyle = "rgba(0,0,0,0.25)";
	ctx.fillRect(48,80,272,88);*/
	
	kirjoita("Tavoitteet",64,128-s.veriSiirtymaNyt,true,48,"#FFF","'Raleway'");
	kirjoita("Näitä sinun pitää kerätä!",64,152-s.veriSiirtymaNyt/2,true,16,"#FFF","'Source Sans Pro'");

	for(let tavoiteI=0;tavoiteI<tavoitteet.length;tavoiteI++){
		let palloX = (canvas.width/2)+(tavoiteI*16)-(tavoitteet.length*16/2)+5.5;
		let palloVari = "silver";
		if(tavoitteet[tavoiteI].vaatimus()>=1){
			palloVari="#47A94B";
		}
		if(tavoiteI==s.tavoiteNo){
			kirjoita("●",palloX,416,true,11,palloVari);
		}else{
			kirjoita("○",palloX,416,true,11,palloVari);
		}
	}	

	// Piirrä tavoitteen valitsimet
	ctx.textAlign="center";
		kirjoita("<",64,256,true,48,"#E0E0E0","'Source Sans Pro'");
		kirjoita(">",canvas.width-64,256,true,48,"#E0E0E0","'Source Sans Pro'");
	ctx.textAlign="start";
	kirjoita("« Paluu",64,512,true,24,"rgba(255,255,255,0.5)","'Source Sans Pro'");
}

// Klikkaus tavoitteissa (tila 2)
export function kasitteleTavoitteidenKlikkaus(){
	soitaAani(klikkiAani[0]);
	if(s.x<canvas.width/3){ // Edellinen
		s.tavoiteNo -= 1;
		if(s.tavoiteNo == -1){
			s.tavoiteNo = tavoitteet.length-1;
		}
	}
	if(s.x>canvas.width/3*2){ // Seuraava
		s.tavoiteNo += 1;
		if(s.tavoiteNo>tavoitteet.length-1){
			s.tavoiteNo=0;
		}
	}
	if(s.y>448){ // Paluu valikkoon
		s.veriSiirtyma=canvas.height;
		s.tila=0;
	}
}
