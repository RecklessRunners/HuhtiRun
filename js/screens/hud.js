import { lataus } from "../assets.js";
import { latausSloganitArvottu } from "../data.js";
import { s, canvas, ctx } from "../state.js";
import { kirjoita } from "../util.js";

// Pelin aikainen HUD, versio, latausruudut ja sivun otsikko
export function piirraHud(){
	if(s.hengissa){
		const oikeaReuna = canvas.width-12;
		ctx.fillStyle="#000";
		ctx.fillRect(oikeaReuna-12,12,12,24);
		ctx.fillRect(oikeaReuna-30,12,12,24);
		ctx.fillStyle="#FFF";
		ctx.fillRect(oikeaReuna-13,13,12,24);
		ctx.fillRect(oikeaReuna-31,13,12,24);
	}
	if(!s.hengissa || s.tauko){
		ctx.globalAlpha=0.5;
		kirjoita(s.versioId.substring(0,5),8,canvas.height-8,false,10,"#FFF","Courier New");
		ctx.globalAlpha=1;
	}
	if(false){
		ctx.fillStyle="#400000";
		ctx.fillRect(0,0,960,576);
		ctx.textAlign="center";
		
		ctx.beginPath();
		ctx.moveTo(0,224);
		ctx.lineTo(canvas.width,224);
		ctx.lineWidth = 2;
		ctx.strokeStyle="#FFF";
		ctx.stroke();
		ctx.closePath();
		
		kirjoita("V I R H E   L A T A U K S E S S A",canvas.width/2,256,true,12);
		kirjoita(lataus.virheTiedosto,canvas.width/2,384,true,12,"#808080");
		ctx.textAlign="start";
		document.title="Latausvirhe!";
	}else{
		// Latausruutu
		if(false){
			ctx.fillStyle="#4D7B28";
			ctx.fillRect(0,0,960,576);

			ctx.beginPath();
			ctx.moveTo(256,384);
			ctx.lineTo(canvas.width-256,384);
			ctx.lineWidth = 16;
			ctx.strokeStyle="rgba(0,0,0,.5)";
			ctx.stroke();
			ctx.closePath();

			const latauspalkkiTavoiteX = (canvas.width - 512) / lataus.kaikki * lataus.ladatut;
			s.latauspalkkiX += (latauspalkkiTavoiteX - s.latauspalkkiX) / 10;

			ctx.beginPath();
			ctx.moveTo(256,384);
			ctx.lineTo(s.latauspalkkiX+256,384);
			ctx.lineWidth = 16;
			ctx.strokeStyle="gold";
			ctx.stroke();
			ctx.closePath();

			ctx.textAlign="center";
				kirjoita("HuhtiRun",canvas.width/2,112+192,true,64,"#FFF","'Fondamento'");
				kirjoita("TM",canvas.width*0.675,80+192,true,16);
			ctx.textAlign="start";

			const latausprosentti=Math.floor(100/lataus.kaikki*lataus.ladatut);
			if(lataus.hidas){
				ctx.beginPath();
				ctx.fillStyle="#DC7612";
				ctx.fillRect(0,0,960,96);
				ctx.fill();
				ctx.closePath();
				kirjoita("!",64,64,true,48,"#FFF","'Source Sans Pro'");
				kirjoita("Lataaminen tuntuu vievän normaalia kauemmin!",96,48,true,24,"#FFF","'Source Sans Pro'");
				kirjoita("Jos peli ei lataudu, tarkista verkkoyhteytesi. Päivitä sivu tarvittaessa.",96,64,true,16,"#FFF","'Source Sans Pro'");
			}
			ctx.textAlign="center";
				kirjoita(latausSloganitArvottu[Math.floor(0.05*latausprosentti)],canvas.width/2,384+36,true,16,"#FFF","'Source Sans Pro'");
			ctx.textAlign="start";

			document.title="Ladataan "+latausprosentti+" %";
		}else{
			if(s.hengissa){
				document.title="HR - "+s.pisteet+" pst.";
			}else{
				document.title="HuhtiRun";
			}
		}
	}
}
