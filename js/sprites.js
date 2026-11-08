import { hyppyKuva, ukko, varjo, vihu } from "./assets.js";
import { s, canvas, ctx, ukkoY } from "./state.js";

export function piirraVarjo(){
	if(s.hyppy && s.hengissa){
		ctx.drawImage(varjo[0],s.ukkoX+48,ukkoY+96);
	}
}

export function piirraHyppyNappi(){
	if(s.hengissa){
		if(s.hyppy){
			ctx.drawImage(hyppyKuva[0],64,canvas.height-64,64,32);
		}else{
			ctx.drawImage(hyppyKuva[0],64,canvas.height-96);
		}
	}
}

export function piirraVihu(i,piirtoX,piirtoY){
	if(s.hengissa || s.elvytysRuutu){
		const translaatio = {
			"x" : piirtoX + vihu[i].width / 2,
			"y" : piirtoY + vihu[i].height / 2
		};
		ctx.save();
		ctx.translate(translaatio.x,translaatio.y);
		ctx.rotate(s.vihuAsteluku);
		ctx.drawImage(vihu[i],-96,-96);
		ctx.restore();
	}
}

export function piirraUkko(i,piirtoX,piirtoY){
	if(s.hengissa){
		if(s.suojakilpi>0){
			if(s.suojakilpi<=5 && s.pelaaNo % 1){
				ctx.globalAlpha=1;
			}else{
				ctx.globalAlpha=0.25;
			}
		}
		const translaatio = {
			"x" : piirtoX + ukko[i].width / 2,
			"y" : piirtoY + ukko[i].height / 2
		};
		ctx.save();
		ctx.translate(translaatio.x,translaatio.y);
		ctx.rotate(s.asteluku);
		if(s.hyppy){
			ctx.drawImage(ukko[i],-96-24,-96-24,240,240);
		}else{
			ctx.drawImage(ukko[i],-96,-96);
		}
		ctx.restore();
	}
	ctx.globalAlpha=1;
}

