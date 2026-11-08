import { lataus } from "../assets.js";
import { latausSloganitArvottu } from "../data.js";
import { s, canvas, ctx } from "../state.js";
import { kirjoita } from "../util.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../constants/geometry.js";
import { FONT_BODY, FONT_CAPTION, FONT_DISPLAY, FONT_MICRO, FONT_SUBTITLE, FONT_TITLE, PAUSE_BAR_HEIGHT, PAUSE_BAR_SPACING, PAUSE_BAR_WIDTH, PAUSE_ICON_MARGIN, PAUSE_ICON_TOP, VERSION_LABEL_ALPHA, VERSION_LABEL_LENGTH, VERSION_LABEL_MARGIN } from "../constants/ui.js";

// Pelin aikainen HUD, versio, latausruudut ja sivun otsikko
export function piirraHud(){
	if(s.hengissa){
		const oikeaReuna = canvas.width-PAUSE_ICON_MARGIN;
		ctx.fillStyle="#000";
		ctx.fillRect(oikeaReuna-PAUSE_BAR_WIDTH,PAUSE_ICON_TOP,PAUSE_BAR_WIDTH,PAUSE_BAR_HEIGHT);
		ctx.fillRect(oikeaReuna-PAUSE_BAR_WIDTH-PAUSE_BAR_SPACING,PAUSE_ICON_TOP,PAUSE_BAR_WIDTH,PAUSE_BAR_HEIGHT);
		ctx.fillStyle="#FFF";
		ctx.fillRect(oikeaReuna-PAUSE_BAR_WIDTH-1,PAUSE_ICON_TOP+1,PAUSE_BAR_WIDTH,PAUSE_BAR_HEIGHT);
		ctx.fillRect(oikeaReuna-PAUSE_BAR_WIDTH-PAUSE_BAR_SPACING-1,PAUSE_ICON_TOP+1,PAUSE_BAR_WIDTH,PAUSE_BAR_HEIGHT);
	}
	if(!s.hengissa || s.tauko){
		ctx.globalAlpha=VERSION_LABEL_ALPHA;
		kirjoita(s.versioId.substring(0,VERSION_LABEL_LENGTH),VERSION_LABEL_MARGIN,canvas.height-VERSION_LABEL_MARGIN,false,FONT_MICRO,"#FFF","Courier New");
		ctx.globalAlpha=1;
	}
	if(false){
		ctx.fillStyle="#400000";
		ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
		ctx.textAlign="center";
		
		ctx.beginPath();
		ctx.moveTo(0,224);
		ctx.lineTo(canvas.width,224);
		ctx.lineWidth = 2;
		ctx.strokeStyle="#FFF";
		ctx.stroke();
		ctx.closePath();
		
		kirjoita("V I R H E   L A T A U K S E S S A",canvas.width/2,256,true,FONT_CAPTION);
		kirjoita(lataus.virheTiedosto,canvas.width/2,384,true,FONT_CAPTION,"#808080");
		ctx.textAlign="start";
		document.title="Latausvirhe!";
	}else{
		// Latausruutu
		if(false){
			ctx.fillStyle="#4D7B28";
			ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

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
				kirjoita("HuhtiRun",canvas.width/2,112+192,true,FONT_DISPLAY,"#FFF","'Fondamento'");
				kirjoita("TM",canvas.width*0.675,80+192,true,FONT_BODY);
			ctx.textAlign="start";

			const latausprosentti=Math.floor(100/lataus.kaikki*lataus.ladatut);
			if(lataus.hidas){
				ctx.beginPath();
				ctx.fillStyle="#DC7612";
				ctx.fillRect(0,0,960,96);
				ctx.fill();
				ctx.closePath();
				kirjoita("!",64,64,true,FONT_TITLE,"#FFF","'Source Sans Pro'");
				kirjoita("Lataaminen tuntuu vievän normaalia kauemmin!",96,48,true,FONT_SUBTITLE,"#FFF","'Source Sans Pro'");
				kirjoita("Jos peli ei lataudu, tarkista verkkoyhteytesi. Päivitä sivu tarvittaessa.",96,64,true,FONT_BODY,"#FFF","'Source Sans Pro'");
			}
			ctx.textAlign="center";
				kirjoita(latausSloganitArvottu[Math.floor(0.05*latausprosentti)],canvas.width/2,384+36,true,FONT_BODY,"#FFF","'Source Sans Pro'");
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
