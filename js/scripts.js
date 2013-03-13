// 0 = Tyhjä
// 1 = Tie eteenpäin
// 2 = Mutka, vasen
// 3 = Mutka, oikea
// 4 = Risteys
// 5 = Silta
// 6 = Alikulku
// 7 = Kuilu
// 8 = Varattu
// 9 = Varattu

var blocks = {
	"-1x0"	:	0,
	"-1x-1"	:	0,
	"-1x-2"	:	0,
	"-1x-3"	:	0,
	"-1x-4"	:	0,
	"-1x-5"	:	0,
	"-1x0"	:	0,
	"-1x1"	:	0,
	"-1x2"	:	1,
	"-1x3"	:	0,
	"-1x4"	:	0,
	"-1x5"	:	0,
	"0x-1"	:	0,
	"1x-1"	:	0,
	"2x-1"	:	1,
	"3x-1"	:	0,
	"4x-1"	:	0,
	"5x-1"	:	0,
	"0x0"	:	0,
	"1x0"	:	0,
	"2x0"	:	1,
	"3x0"	:	0,
	"4x0"	:	0,
	"5x0"	:	0,
	"0x1"	:	0,
	"1x1"	:	0,
	"2x1"	:	1,
	"3x1"	:	0,
	"4x1"	:	0,
	"5x1"	:	0,
	"0x2"	:	0,
	"1x2"	:	0,
	"2x2"	:	1,
	"3x2"	:	0,
	"4x2"	:	0,
	"5x2"	:	0,
	"0x3"	:	0,
	"1x3"	:	0,
	"2x3"	:	0,
	"3x3"	:	0,
	"4x3"	:	0,
	"5x3"	:	0
};

$(function(){
	function game(){
		var canvas = $("canvas")[0];
		if(canvas.getContext){
			return canvas.getContext('2d');
		}else{
			document.location="unsupported.html";
			return false;
		}
	}
	
	var ukko = new Image();
	ukko.src="img/stick.png";
	
	function lataaKuva(kuva){
		var img = new Image();
		img.src="img/"+kuva+".png";
		//img.onload=function(){
			return img;
		//}
	}
	
	
	function lataaTieSuoraan(){
		var taulu = [];

		for(i=0;i<1;i++){
			var img = new Image();			
			img.src="img/tiesuoraan"+i+".png";
			taulu.push(img);
		}
		
		//img.onload=function(){
		return taulu;
		//}
		
	}
	
	function lataaLintu(){
		var taulu = [];

		for(i=0;i<9;i++){
			var img = new Image();			
			img.src="img/Lint"+i+".png";
			taulu.push(img);
		}
		return taulu;
	}
	
	var images = [
		lataaKuva("blank"),
		lataaKuva("brown"),
		lataaKuva("left"),
		lataaKuva("right"),
		lataaKuva("risteys")
	];
	
	
	var tieSuoraan = lataaTieSuoraan();
	
	var lintu = lataaLintu();
	var iLintu=0;
	var lintuX = 0;
	var lintuY = 128;
	var lintuK = 1.25;
	//var iLintuMax=8;
	
	//2D-taulukko [5x4 vai 5x5], jossa on referenssit kuviin
	var maasto = new Array(5);
	for (var i=0; i<maasto.length; i++){ //X-suuntaan
		maasto[i] = new Array(4);
		
		//Generoi maasto eli lataa kuvat:
		//Tehdään suora tie:
		for (var j=0; j<maasto[i].length; j++){
			if ( i == 2 ){
				//Keskelle tie.
				maasto[i][j] = tieSuoraan[0]; //Satunnainen tie.
			}else{
				maasto[i][j] = lataaKuva("brown"); //Satunnainen ei-tie.
				//Tai mahdollisesti tyhjä paikka.
			}
		}
	}
	var ylinRivi = new Array( maasto.length );
	ylinRivi[0] = "tausta";
	ylinRivi[0] = "tausta";
	ylinRivi[2] = "tieylos";
	ylinRivi[0] = "tausta";
	ylinRivi[0] = "tausta";
	
	
	setInterval(paivita,30);
	
	var siirtoY = 0;
	var iUkko = 0;
	var ukkoX = 384;
	var ukkoY = 192;
	var ukkoLiikkuuX = 0;
	
	//Hoitaa kaiken päivityksen 
	function paivita(){
		//Piirrä oliota ja asioita. 
		piirraMaasto(siirtoY);
		piirraUkko(iUkko,ukkoX,ukkoY);
		piirraLintu(iLintu,lintuX,lintuY);
		//
		//Aloita päivittäminen:
		
		// Ukko
		$("*").keydown(function(e) {
			switch(e.keyCode){
				//Vasen
				case 37:
				case 60:
					ukkoLiikkuuX = -7.5;
				break;
				// oikea	
				case 39:	
				case 68:
					ukkoLiikkuuX = 7.5;
				break;
			}
		}).keyup(function(e){
			ukkoLiikkuuX = 0;
		});
		if(ukkoX<384 || ukkoX > 576){
			console.log("You died!");
		}
		ukkoX += ukkoLiikkuuX;
		
		//Maasto
		siirtoY++;
		if (siirtoY>192){
			siirtoY=0;
		}
		
		//Lintu
		iLintu++;
		if (iLintu >= lintu.length){
			iLintu = 0;
		}
		lintuX += 3;
		lintuY += lintuK+24*Math.sin(lintuX*4);
		if(lintuX>$("canvas").width()+256){
			lintuX=-256;
			lintuY=Math.random()*384;
			lintuK=(Math.random()-.5)*3;
			console.log(lintuK);
		}

		//Maaston päivitys:
		
	}
	
	function piirraMaasto(siirtoY){
		for (var i=0; i<maasto.length; i++){
			for (var j=0; j<maasto[i].length; j++){
				game().drawImage(maasto[i][j], i*192, (j-1)*192 + siirtoY);
			}
		}
	}
	
	
	function piirraLintu(iLintu,x,y){
		//Linnun piirtäminen. Muut viholliset menee samalla tavalla.
		game().drawImage(lintu[iLintu],x,y);
	}
	
	function piirraUkko(iUkko,x,y){
		//Pelihahmo samalla tavalla
		game().drawImage(ukko,x,y);
	}

});