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
	function lataaLintu(){
		var taulu = [];

		for(i=0;i<9;i++){
			var img = new Image();			
			img.src="img/Lint"+i+".png";
			taulu.push(img);
		}
		
		//img.onload=function(){
		return taulu;
		//}
	}
	
	var images = [
		lataaKuva("blank"),
		lataaKuva("brown"),
		lataaKuva("left"),
		lataaKuva("right"),
		lataaKuva("risteys")
	];
	
	var lintu = lataaLintu();
	var iLintu=0;
	var iLintuMax=8;
	
	//2D-taulukko [5x4 vai 5x5], jossa on referenssit kuviin
	var maasto = new Array(5);
	for (var i=1; i<6; i++){
		maasto[i] = new Array(3);
		//Lataa kuvat:
		for (var j=1; j<5; j++){
			//console.log( i + " " + j );
			maasto[i][j] = lataaKuva("risteys");
		}
	}
	
	setInterval(piirra,1);
	
	var siirtoY = 0;
	
	
	function piirra(){
		game().clearRect(0,0,960,576);


		
		
		for (var i=1; i<6; i++){
			for (var j=1; j<5; j++){
				game().drawImage(maasto[i][j], (i-1)*192, (j-1)*192 + siirtoY);
			}
		}

		siirtoY++;
		if (siirtoY>192){
			siirtoY=0;
		}
		
/* 		siirto += 1;
		if(siirto>=192){
			siirto=0;
			var satunnaisluku = Math.ceil(Math.random()*8);
			blocks["0x-1"]=0;
			blocks["1x-1"]=0;
			blocks["3x-1"]=0;
			blocks["4x-1"]=0;
			switch(satunnaisluku){
				case 1:case 2:case 3:case 4:case 5:
					blocks["2x-1"]=1;
				break;
				case 6:
					blocks["2x-1"]=2;
					blocks["1x-1"]=1;
					blocks["0x-1"]=1;
				break;
				case 7:
					blocks["2x-1"]=3;
					blocks["3x-1"]=1;
					blocks["4x-1"]=1;
				break;
				case 8:
					blocks["2x-1"]=4;
					blocks["1x-1"]=1;
					blocks["0x-1"]=1;
					blocks["3x-1"]=1;
					blocks["4x-1"]=1;
				break;
			}
		}
		for(ia=-1;ia<4;ia++){
			for(ib=-1;ib<6;ib++){
				//console.log(ib+"x"+ia+" = "+blocks[ib+"x"+ia]);
				//game().drawImage(images[blocks[ib+"x"+ia]],ib*192,ia*192+siirto);
			}
		}
 */		

		//
		
		//
		//Linnun piirtäminen. Muut viholliset menee samalla tavalla.
		game().drawImage(lintu[iLintu],184,102);
		iLintu++;
		if (iLintu > iLintuMax){
			iLintu = 0;
		}

		//Pelihahmo samalla tavalla
		game().drawImage(ukko,384,192);
		
	}
});