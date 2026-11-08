import { ctx } from "./state.js";

// Etunollat
export function pad(number,length) {
	let str = ''+number;
	while (str.length < length) {
		str = '0' + str;
	}
	return str;
}

export function tuhaterotin(num){
	return num;
}

export function kirjoita(teksti,x,y,lihavoitu,fonttikoko,vari,fontti){

	lihavoitu	= lihavoitu		|| false;
	fonttikoko	= fonttikoko	|| 16;
	vari		= vari			|| "#FFF";
	fontti		= fontti		|| "sans-serif";

	ctx.fillStyle = "rgba(0,0,0,.5)";
	if(lihavoitu){
		ctx.font = "bold "+fonttikoko+"px "+fontti+",sans-serif";
	}else{
		ctx.font = fonttikoko+"px "+fontti+",sans-serif";
	}
	ctx.fillText(teksti,x+1,y+1);

	ctx.fillStyle = vari;
	ctx.fillText(teksti,x,y);
}

export function getAngle(x, y, angle, h) {
	const radians = angle * (Math.PI / 180);
	return { x: x + h * Math.cos(radians), y: y + h * Math.sin(radians) }; // Muuntaa kulman X:ksi ja Y:ksi
}
