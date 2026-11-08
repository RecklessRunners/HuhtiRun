import { hyppyKuva, ukko, varjo, vihu } from "./assets.js";
import { s, canvas, ctx } from "./state.js";
import { SHIELD_BLINK_LIMIT, SHIELD_FADED_ALPHA } from "./constants/gameplay.js";
import { HALF_TILE, JUMP_BUTTON_BOTTOM_OFFSET, JUMP_BUTTON_PRESSED_HEIGHT, JUMP_BUTTON_PRESSED_OFFSET, JUMP_BUTTON_SIZE, JUMP_BUTTON_X, JUMP_SPRITE_GROW, JUMP_SPRITE_SIZE, PLAYER_Y, SHADOW_OFFSET_X, SHADOW_OFFSET_Y } from "./constants/geometry.js";

export function piirraVarjo(){
	if(s.hyppy && s.hengissa){
		ctx.drawImage(varjo[0],s.ukkoX+SHADOW_OFFSET_X,PLAYER_Y+SHADOW_OFFSET_Y);
	}
}

export function piirraHyppyNappi(){
	if(s.hengissa){
		if(s.hyppy){
			ctx.drawImage(hyppyKuva[0],JUMP_BUTTON_X,canvas.height-JUMP_BUTTON_PRESSED_OFFSET,JUMP_BUTTON_SIZE,JUMP_BUTTON_PRESSED_HEIGHT);
		}else{
			ctx.drawImage(hyppyKuva[0],JUMP_BUTTON_X,canvas.height-JUMP_BUTTON_BOTTOM_OFFSET);
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
		ctx.drawImage(vihu[i],-HALF_TILE,-HALF_TILE);
		ctx.restore();
	}
}

export function piirraUkko(i,piirtoX,piirtoY){
	if(s.hengissa){
		if(s.suojakilpi>0){
			if(s.suojakilpi<=SHIELD_BLINK_LIMIT && s.pelaaNo % 1){
				ctx.globalAlpha=1;
			}else{
				ctx.globalAlpha=SHIELD_FADED_ALPHA;
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
			ctx.drawImage(ukko[i],-HALF_TILE-JUMP_SPRITE_GROW,-HALF_TILE-JUMP_SPRITE_GROW,JUMP_SPRITE_SIZE,JUMP_SPRITE_SIZE);
		}else{
			ctx.drawImage(ukko[i],-HALF_TILE,-HALF_TILE);
		}
		ctx.restore();
	}
	ctx.globalAlpha=1;
}

