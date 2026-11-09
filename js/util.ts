import { ctx } from "./state";
import { DEFAULT_FONT_SIZE } from "./constants/ui";

// Etunollat
// Groups the digits of a number in thousands with a space, e.g. 20000 -> "20 000"
export function formatThousands(num: number | string){
	return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function pad(number: number | string,length: number) {
	let str = ''+number;
	while (str.length < length) {
		str = '0' + str;
	}
	return str;
}

export function tuhaterotin(num: number){
	return num;
}

export function kirjoita(teksti: string|number,x: number,y: number,lihavoitu?: boolean,fonttikoko?: number,vari?: string,fontti?: string){

	lihavoitu	= lihavoitu		|| false;
	fonttikoko	= fonttikoko	|| DEFAULT_FONT_SIZE;
	vari		= vari			|| "#FFF";
	fontti		= fontti		|| "sans-serif";

	ctx.fillStyle = "rgba(0,0,0,.5)";
	if(lihavoitu){
		ctx.font = "bold "+fonttikoko+"px "+fontti+",sans-serif";
	}else{
		ctx.font = fonttikoko+"px "+fontti+",sans-serif";
	}
	ctx.fillText(String(teksti),x+1,y+1);

	ctx.fillStyle = vari;
	ctx.fillText(String(teksti),x,y);
}

export function getAngle(x: number, y: number, angle: number, h: number) {
	const radians = angle * (Math.PI / 180);
	return { x: x + h * Math.cos(radians), y: y + h * Math.sin(radians) }; // Muuntaa kulman X:ksi ja Y:ksi
}
