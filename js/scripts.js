
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

	function lataaUkko(){
		var taulu = [];
		for(i=0;i<3;i++){
			var img = new Image();			
			img.src="img/stick"+i+".png";
			taulu.push(img);
		}
		return taulu;
	}

	function lataaVihu(){
		var taulu = [];
		for(i=0;i<5;i++){
			var img = new Image();			
			img.src="img/vihu"+i+".png";
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


	var ukko = lataaUkko();
	var iUkko=0;
	var ukkoX = 384;
	var ukkoY = 192;

	
	var vihu = lataaVihu();
	var iVihu=1;
	var vihuX = 384; 
	var vihuSiirtyma = 256;

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
	
	
	var ukkoLiikkuuX = 0;
	var siirtoY = 0;	
	setInterval(paivita,25);
	
	//Hoitaa kaiken päivityksen 
	function paivita(){
		// Pelin lopetustestaus

		// Siirtää vihollista hitaasti taaksepäin
		vihuSiirtyma = Math.min(256,vihuSiirtyma+.375);
		
		iUkko+=1;
		if(iUkko>=ukko.length){
			iUkko=0;
		}
		iVihu+=1;
		if(iVihu>=vihu.length){
			iVihu=0;
		}
		
		
		//Piirrä oliota ja asioita. 
		piirraMaasto(siirtoY);
		
		piirraVihu(iVihu,vihuX,ukkoY+vihuSiirtyma);
		piirraUkko(iUkko,ukkoX,ukkoY);
		vihuX = ukkoX; 
		piirraLintu(iLintu,lintuX,lintuY);
		//
		//Aloita päivittäminen:
		
		// Ukko
		$("*").keydown(function(e) {
			switch(e.keyCode){
				//Vasen
				case 37:
				case 65:
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
		
		//Ukon paikan tarkistus. . . 
		if(ukkoX<352 || ukkoX > 432){
			ukkoX=384;
			vihuSiirtyma -= 128; 
		}
		ukkoX += ukkoLiikkuuX;
		
		
		//Maasto
		siirtoY+=4;
		if (siirtoY>192){
			siirtoY=0;
		}
		
		//Lintu
		iLintu++;
		if (iLintu >= lintu.length){
			iLintu = 0;
		}
		lintuX += 8;
		lintuY += lintuK+16*Math.sin(lintuX*.1);
		if(lintuX>$("canvas").width()+512){
			lintuX=-512;
			lintuY=(Math.random()*($("canvas").height()/2))+$("canvas").height()/4;
			lintuK=(Math.random()-.5)*6;
			//console.log(lintuK);
		}

		//Maaston päivitys:

				if(vihuSiirtyma < 128){
			//alert("Hävisit pelin! :(");
			vihuSiirtyma=0;
			game().font = 'bold 64px sans-serif';
			game().fillText("Hävisit pelin!",256,128);
		}
	}
	
	function piirraMaasto(siirtoY){
		for (var i=0; i<maasto.length; i++){
			for (var j=0; j<maasto[i].length; j++){
				game().drawImage(maasto[i][j], i*192, (j-1)*192 + siirtoY);
			}
		}
	}
	
	
	function piirraLintu(i,x,y){
		//Linnun piirtäminen. Muut viholliset menee samalla tavalla.
		game().drawImage(lintu[i],x,y);
	}
	
	function piirraVihu(i,x,y){
		game().drawImage(vihu[i],x,y);
	}
	
	function piirraUkko(i,x,y){
		//Pelihahmo samalla tavalla
		game().drawImage(ukko[i],x,y);
	}
	

});