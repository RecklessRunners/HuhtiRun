import { klikkiAani } from "../assets.js";
import { soitaAani } from "../audio.js";
import { s, canvas, ctx } from "../state.js";
import { kirjoita, pad } from "../util.js";

// Tilastot ja ennätykset (tila 3)
export function piirraTilastot(){
	kirjoita("Tilastot",64,128-s.veriSiirtymaNyt,true,48,"#FFF","'Raleway'");
	kirjoita("Vielä on parantamisen varaa . . .",64,152-s.veriSiirtymaNyt/2,true,16,"#FFF","'Source Sans Pro'");

	kirjoita("YHTEENLASKETTU MATKA",64,176,true,12,"#FFF","'Raleway'");
	kirjoita(pad(s.matkaYht,8),64,208,true,32,"#FFF","'Raleway'");
	kirjoita("m",256,208,true,16,"#FFF","'Raleway'");

	kirjoita("PELATUT PELIT",64,256,true,12,"#FFF","'Raleway'");
	kirjoita(pad(s.tavoiteData[3],8),64,288,true,32,"#FFF","'Raleway'");

	kirjoita("KESKIMÄÄRÄINEN MATKA/PELI",64,336,true,12,"#FFF","'Raleway'");
	kirjoita(pad(Math.round(s.matkaYht/s.tavoiteData[3]),8),64,368,true,32,"#FFF","'Raleway'");
	kirjoita("m",256,368,true,16,"#FFF","'Raleway'");

	const sijoitusVarit = ["gold","silver","#A38051"];
	
	// Parhaat pisteet
	kirjoita("PARHAAT PISTEET",384,176,true,12);
	for(let i=0;i<3;i++){
		if(i<3){
			ctx.beginPath();
			ctx.arc(391, 208+(32*i)-9, 12, 0, 2 * Math.PI, false);
			ctx.fillStyle = "rgba(0,0,0,.5)";
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.arc(390, 208+(32*i)-10, 12, 0, 2 * Math.PI, false);
			ctx.fillStyle = sijoitusVarit[i];
			ctx.fill();
			ctx.closePath();
		}

		kirjoita(i+1,384,208+(32*i)-6,true,16);
		kirjoita(s.parhaatPisteet[i],424,208+(32*i),false,32,sijoitusVarit[i],"'Source Sans Pro'");
	}
	
	// Parhaat matkat
	kirjoita("PISIMMÄT MATKAT",384,304,true,12);
	for(let i=0;i<3;i++){
		if(i<3){
			ctx.beginPath();
			ctx.arc(391, 336+(32*i)-9, 12, 0, 2 * Math.PI, false);
			ctx.fillStyle = "rgba(0,0,0,.5)";
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.arc(390, 336+(32*i)-10, 12, 0, 2 * Math.PI, false);
			ctx.fillStyle = sijoitusVarit[i];
			ctx.fill();
			ctx.closePath();
		}

		kirjoita(i+1,384,336+(32*i)-6,true,16);
		kirjoita(s.parhaatMatkat[i],424,336+(32*i),false,32,sijoitusVarit[i],"'Source Sans Pro'");
	}

	kirjoita("« Paluu",64,512,true,24,"rgba(255,255,255,0.5)","'Source Sans Pro'");
	ctx.textAlign="end";
		kirjoita("HUOM! ALLE 10 METRIN JUOKSUJA EI TILASTOIDA",canvas.width-64,512,true,12);
	ctx.textAlign="start";
}

// Klikkaus tilastoissa (tila 3)
export function kasitteleTilastojenKlikkaus(){
	if(s.y>448){ // Takaisin valikkoon
		s.veriSiirtyma=canvas.height;
		s.tila=0;
		soitaAani(klikkiAani[0]);
	}
}
