import { klikkiAani, kolikkoKuva, lataus } from "../assets.js";
import { soitaAani, varise } from "../audio.js";
import { biomiTyypit, biomiVarit } from "../data.js";
import { osta } from "../shop.js";
import { s, canvas, ctx } from "../state.js";
import { alustaMaasto } from "../terrain.js";
import { getAngle, kirjoita, tuhaterotin } from "../util.js";

// Valikoiden tausta ja otsikko
export function piirraValikonTausta(){
	s.tummuus=Math.max(0.25,s.tummuus-0.001);
	
	ctx.beginPath();
	ctx.strokeStyle="rgba(0,0,0,0.2)";
	ctx.moveTo(0,s.veriSiirtymaNyt-96);
	ctx.lineTo(canvas.width,s.veriSiirtymaNyt-96);
	ctx.stroke();
	ctx.closePath();
	
	ctx.beginPath();
	ctx.strokeStyle="rgba(255,255,255,0.2)";
	ctx.moveTo(0,s.veriSiirtymaNyt-95);
	ctx.lineTo(canvas.width,s.veriSiirtymaNyt-95);
	ctx.stroke();
	ctx.closePath();
	
	ctx.fillStyle="#"+biomiVarit[s.biomi];
	ctx.fillRect(0,s.veriSiirtymaNyt,960,576);
	
	/*if(tummuus>0 && tila==0){
		ctx.fillStyle="rgba(0,0,0,"+Math.min(tummuus,.7)+")";
		ctx.fillRect(0,veriSiirtymaNyt-96,960,128);
	}*/
	
	if(s.tila==0 || s.elvytysRuutu){
		ctx.fillStyle="#"+biomiVarit[s.biomi];
	}else{
		ctx.fillStyle="rgba(0,0,0,0.25)";
	}
	ctx.globalAlpha=0.7;
	ctx.fillRect(0,s.veriSiirtymaNyt-96,960,576);
	ctx.globalAlpha=1;
	
	// Aseta vihu pelaajan alle
	s.vihuSiirtyma=95;
	
	// Kirjoita otsikko
	ctx.textAlign="center";
		kirjoita("HuhtiRun",canvas.width/2,s.veriSiirtymaNyt-336-128,true,64,"#FFF","'Fondamento'");
		kirjoita("TM",canvas.width*0.675,80+s.veriSiirtymaNyt-512-64,true,16);
	ctx.textAlign="start";
}

// Päävalikko (tila 0)
export function piirraPaavalikko(){
	s.tauko=false;
	if((s.elvytysRuutu || s.pisteytetaan) && s.pisteet > 9){
		ctx.textAlign="center";
		if(s.pisteytys>3.75){
			kirjoita(Math.round(s.pisteytys),canvas.width/2,256+48,true,96,"#FFF","'Raleway'");
			s.tarkkuusLisa=0;
			if(s.pisteytetaan){
				s.tarkkuusLisa=4;
			}
			//kirjoita(rahat+Math.round(pisteet-pisteytys)+tarkkuusLisa,canvas.width/2,288,true);
		}else{
			kirjoita("Sinulla on nyt",canvas.width/2,192,true);
			const kaikkiRahat = s.rahat + s.pisteet;
			kirjoita(kaikkiRahat,canvas.width/2,256+48,true,96,"#FFF","'Raleway'");
			
			ctx.fillStyle = "rgba(255,255,255,0.05)";
			
			for(let i=0;i<6;i++){
				ctx.beginPath();
				ctx.moveTo(canvas.width/2,canvas.height/2);
									
				let pos = getAngle(canvas.width/2, canvas.height/2, 60*i+(s.pelaaNo/2.5)-15,canvas.width);
				ctx.lineTo(pos.x, pos.y);
			
				pos = getAngle(canvas.width/2, canvas.height/2, 60*i+(s.pelaaNo/2.5)+15,canvas.width);
				ctx.lineTo(pos.x, pos.y);
				
				ctx.lineTo(canvas.width/2,canvas.height/2);
				
				ctx.fill();
				ctx.closePath();
			}
		}
		if(!s.pisteytetaan && s.elvytysRuutu && s.pisteytys > 3.75){
			kirjoita("Kuolema",canvas.width/2,64,true,32);
			kirjoita("Keräsit pisteitä yhteensä",canvas.width/2,192,true);
		}
		if(s.elvytysjuomat>0 && s.pisteytys>3.75){
			ctx.textAlign="center";
				kirjoita("Elvytä",canvas.width/2,512,true,32,"#47A94B","'Source Sans Pro'");
				kirjoita(s.elvytysjuomat+" elvytyskertaa jäljellä",canvas.width/2,536,true,16,"#47A94B");
			ctx.textAlign="start";
		}else{
			ctx.textAlign="center";
				kirjoita("Elvytä",canvas.width/2,512,true,32,"silver","'Source Sans Pro'");
				kirjoita(s.elvytysjuomat+" elvytyskertaa jäljellä",canvas.width/2,536,true,16,"silver");
			ctx.textAlign="start";		
		}
	}else{
		// Piirrä alamenun vaihtoehdot
		ctx.globalAlpha=0.75;
		ctx.textAlign="center";
			kirjoita("Tavoitteet",canvas.width/6*1,s.veriSiirtymaNyt-64,true,16,"#FFF","'Source Sans Pro'");
			kirjoita("Tilastot",canvas.width/6*2,s.veriSiirtymaNyt-64,true,16,"#FFF","'Source Sans Pro'");
			kirjoita("Asetukset",canvas.width/6*4,s.veriSiirtymaNyt-64,true,16,"#FFF","'Source Sans Pro'");
			kirjoita("Tietoa pelistä",canvas.width/6*5,s.veriSiirtymaNyt-64,true,16,"#FFF","'Source Sans Pro'");
		ctx.textAlign="start";
		ctx.globalAlpha=1;

		// Piirrä kentänvalitsimet
		ctx.textAlign="center";
		kirjoita("<",64,256,true,48,"#E0E0E0","'Source Sans Pro'");
		kirjoita(">",canvas.width-64,256,true,48,"#E0E0E0","'Source Sans Pro'");

		for(let biomiI=0;biomiI<biomiTyypit.length;biomiI++){
			let palloX = (canvas.width/2)+(biomiI*16)-(biomiTyypit.length*16/2)+5.5;
			if(biomiI==s.biomi){
				kirjoita("●",palloX,160,true,11);
			}else{
				kirjoita("○",palloX,160,true,11);
			}
		}
		//kirjoita(biomiTyypit[biomi],canvas.width/2,384,true,14,"#FFF","Source Sans Pro");
		ctx.textAlign="start";
	}
	if(!s.elvytysRuutu){
		const etaisyys96 = Math.max(0,Math.min(96,96-(Math.abs(canvas.width/2-s.x)+Math.abs(s.veriSiirtymaNyt-96-s.y))));				
		const napinSkaalaus = 1+Math.min(0.375,Math.max(0,0.375/96*etaisyys96));
		
		// Nappula
		ctx.moveTo(canvas.width/2,s.veriSiirtymaNyt-64-16);
		ctx.save();
		ctx.translate(canvas.width/2,s.veriSiirtymaNyt-64-16);
		ctx.scale(napinSkaalaus,napinSkaalaus);
		ctx.arc(0,0,32,s.pelaaNo/5,s.pelaaNo/5+((Math.PI*2)/lataus.kaikki*lataus.ladatut),false);
		ctx.translate(-canvas.width/2,-s.veriSiirtymaNyt+64+16);
		ctx.restore();
		
		ctx.fillStyle="#7FAF1B";
		ctx.fill();
		
		// Nappulan varjo
		ctx.moveTo(canvas.width/2,s.veriSiirtymaNyt-64-16);
		s.grd = ctx.createRadialGradient(canvas.width/2,s.veriSiirtymaNyt-64-16,32,canvas.width/2,s.veriSiirtymaNyt-64-16,36);
		s.grd.addColorStop(0,"rgba(0,0,0,0)");
		s.grd.addColorStop(0.5,"rgba(0,0,0,0.1)");
		s.grd.addColorStop(1,"rgba(0,0,0,0)");
		
		ctx.arc(canvas.width/2,s.veriSiirtymaNyt-64-16,36,0,Math.PI*2,false);
		
		ctx.fillStyle="rgba(0,0,0,0.01)";
		ctx.fill();

		// Nappulan heijastus
		ctx.moveTo(canvas.width/2,s.veriSiirtymaNyt-64-16);
		s.grd = ctx.createRadialGradient(canvas.width/2,s.veriSiirtymaNyt-64-16,0,canvas.width/2,s.veriSiirtymaNyt-64-16,32+(8/96*etaisyys96));
		s.grd.addColorStop(0,"rgba(255,255,255,0.25)");
		s.grd.addColorStop(0.5,"rgba(255,255,255,0.125)");
		s.grd.addColorStop(0.95,"rgba(0,0,0,0.1)");
		s.grd.addColorStop(1,"rgba(0,0,0,0.25)");
		
		ctx.save();
		ctx.translate(canvas.width/2,512);
		ctx.scale(napinSkaalaus,napinSkaalaus);
		ctx.arc(canvas.width/2,512,32,0,Math.PI*2,false);
		
		ctx.translate(-canvas.width/2,-512);
		ctx.restore();
		
		ctx.fillStyle=s.grd;
		ctx.fill();
		
		// Play-kuvake
		ctx.moveTo(canvas.width/2,s.veriSiirtymaNyt-64-16);
		ctx.beginPath();
		ctx.moveTo(canvas.width/2+16+1,s.veriSiirtymaNyt-64+1-16);
		ctx.lineTo(canvas.width/2-16+1,s.veriSiirtymaNyt-64-16+1-16);
		ctx.lineTo(canvas.width/2-16+1,s.veriSiirtymaNyt-64+16+1-16);
		ctx.lineTo(canvas.width/2+16+1,s.veriSiirtymaNyt-64+1-16);
		ctx.fillStyle="rgba(0,0,0,0.5)";
		ctx.fill();
		ctx.closePath();
	
		ctx.beginPath();
		ctx.moveTo(canvas.width/2+16,s.veriSiirtymaNyt-64-16);
		ctx.lineTo(canvas.width/2-16,s.veriSiirtymaNyt-64-16-16);
		ctx.lineTo(canvas.width/2-16,s.veriSiirtymaNyt-64+16-16);
		ctx.lineTo(canvas.width/2+16,s.veriSiirtymaNyt-64-16);
		ctx.fillStyle="#FFF";
		ctx.fill();
		ctx.closePath();
		
		ctx.globalAlpha=0.75;
		ctx.textAlign="center";
		if(lataus.ladatut >= lataus.kaikki){
			if(s.omatKentat[s.biomi]){
				kirjoita("Uusi peli",canvas.width/2,s.veriSiirtymaNyt-20,true,18,"#FFF","'Source Sans Pro'");
			}else{
				kirjoita("Osta kenttä",canvas.width/2,s.veriSiirtymaNyt-20,true,18,"#FFF","'Source Sans Pro'");
				kirjoita(300*s.biomi-1,canvas.width/2+16,s.veriSiirtymaNyt-64+22,false,14,"#FFF","'Source Sans Pro'");
			}
		}else{
			kirjoita("Ladataan "+Math.round(100/lataus.kaikki*lataus.ladatut)+"%",canvas.width/2,s.veriSiirtymaNyt-20,true,18,"#FFF","'Source Sans Pro'");
		}
		ctx.textAlign="start";
		ctx.globalAlpha=1;
	}
}

// Rahatilanne vasemmassa yläkulmassa (tilat 0 ja 1)
export function piirraRahat(){
	if(!s.elvytysRuutu){
		// Näytä rahatilanne vasemmassa yläkulmassa
		ctx.drawImage(kolikkoKuva[0],24,24,24,24);
		kirjoita(Math.round(tuhaterotin(s.rahat)),64,42,false,20,"#FFF","'Raleway'");
	}
}

// Klikkaus päävalikossa (tila 0)
export function kasitteleValikonKlikkaus(){
	varise(100);
	if(s.y>146 && s.y<288){
		if(!s.elvytysRuutu){
			if(s.x<128){
				if(s.biomi>0){
					s.biomi=Math.max(0,s.biomi-1);
				}else{
					s.biomi=biomiTyypit.length-1;
				}
			}
			if(s.x>canvas.width-128){
				if(s.biomi<biomiTyypit.length-1){
					s.biomi=Math.min(biomiTyypit.length-1,s.biomi+1);
				}else{
					s.biomi=0;
				}
			}
			soitaAani(klikkiAani[0]);
			alustaMaasto();
			s.ukkoX=384;
			localStorage.valittuKentta = s.biomi;
		}
	}
	if(s.y>448){
		if(s.elvytysRuutu){
			if(s.pisteytys>3.75 && s.elvytysjuomat>0){
				s.striikki=0;
				s.elvytysjuomat -= 1;
				localStorage.elvytysjuomat = s.elvytysjuomat;
				s.veriSiirtyma = canvas.height - 128;
				s.vihuSiirtyma = 256;
				s.hengissa = true;
				s.suojakilpi += 3;
				s.pelikerrat += 1;
				s.tavoiteData[2] = Math.max(s.tavoiteData[2],s.pelikerrat);
				varise(1000);
			}
		}else{
			if(s.x>=canvas.width/6*1-80 && s.x<canvas.width/6*1+80){ // Siirry Tavoitteet-sivulle
				s.veriSiirtyma=0;
				s.tavoiteNo=0;
				s.tila=2;
				soitaAani(klikkiAani[0]);
			}
			if(s.x>=canvas.width/6*2-80 && s.x<canvas.width/6*2+80){ // Siirry Tilastot-sivulle
				s.veriSiirtyma=0;
				s.tila=3;
				soitaAani(klikkiAani[0]);
			}
			if(s.x>=canvas.width/6*3-80 && s.x<canvas.width/6*3+80){
				soitaAani(klikkiAani[0]);
				if(s.omatKentat[s.biomi]){
					s.tila=1;
				}else{
					if(osta(300*s.biomi-1,biomiTyypit[s.biomi],true)){
						s.omatKentat[s.biomi]=true;
						localStorage.omatKentat=JSON.stringify(s.omatKentat);
						s.tila=1;
					}
				}
			}
			if(s.x>=canvas.width/6*4-80 && s.x<canvas.width/6*4+80){ // Siirry Asetukset-sivulle
				s.veriSiirtyma=0;
				s.tila=5;
				soitaAani(klikkiAani[0]);
			}
			if(s.x>=canvas.width/6*5-80 && s.x<canvas.width/6*5+80){ // Siirry Tietoja-sivulle
				s.veriSiirtyma=0;
				s.tekijaSkrolli = 192;
				s.tila=4;
				soitaAani(klikkiAani[0]);
			}
		}
	}
}
