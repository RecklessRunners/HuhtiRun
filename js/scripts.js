$(function(){
	// Etunollat
	function pad(number,length) {
		var str = ''+number;
		while (str.length < length) {
			str = '0' + str;
		}
		return str;
	}
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
	
	// TODO: Siirrä oliomuotoon.
	
	function lataaLintu(){
		var taulu = [];
		for(i=0;i<9;i++){
			var img = new Image();			
			img.src="img/lintu"+i+".png";
			taulu.push(img);
		}
		return taulu;
	}

	function lataaUkko(){
		var taulu = [];
		for(i=0;i<3;i++){
			var img = new Image();			
			img.src="img/ukko"+i+".png";
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
	
	// Q: Tarvetta?
	
	var images = [
		lataaKuva("blank"),
		lataaKuva("brown"),
		lataaKuva("left"),
		lataaKuva("right"),
		lataaKuva("risteys")
	];
	
	var tieSuoraan = lataaTieSuoraan();
	
	var hengissa = true;
	
	var lintu = lataaLintu();
	var iLintu=0; // Linnun animaatio - framen n:o
	var lintuX = 0; // Linnun sijainti X
	var lintuY = 128; // Linnun sijainti Y
	var lintuK = 1.25; // Linnun kallistuskulma (px)
	//var iLintuMax=8;
	
	var ukko = lataaUkko();
	var iUkko=0;
	var ukkoX = 384;
	var ukkoY = 192;

	var vihu = lataaVihu();
	var iVihu=1;
	var vihuX = 384; 
	var vihuSiirtyma = 256;
	
	var pisteet = 0;

	// 2D-taulukko [5x3], jossa on referenssit kuviin
	var maasto = new Array(5);
	for (var i=0; i<maasto.length; i++){ // X-suuntaan
		maasto[i] = new Array(4);
		
		// Generoi maasto eli lataa kuvat:
		// Tehdään suora tie:

		for(var j=0; j<maasto[i].length; j++){ // Y-suuntaan
			if(i == 2){
				// Keskelle tie.
				maasto[i][j] = tieSuoraan[0]; //Satunnainen tie.
			}else{
				maasto[i][j] = lataaKuva("brown"); //Satunnainen ei-tie.
				// Tai mahdollisesti tyhjä paikka.
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
		pisteet += .5;
		if(Math.ceil(Math.random()*16)==16){
			vihuSiirtyma -= Math.floor(4/256*vihuSiirtyma);
		}
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
		
		// Pelaajan ohjauskomennot
		$("*").keydown(function(e) {
			switch(e.keyCode){
				// Vasemmalle
				case 37:
				case 65:
					ukkoLiikkuuX = -7.5;
				break;
				// Oikealle
				case 39:	
				case 68:
					ukkoLiikkuuX = 7.5;
				break;
			}
		}).keyup(function(e){
			ukkoLiikkuuX = 0;
		});
		
		// Pelaajan X-sijainnin varmistus
		if(ukkoX<352 || ukkoX > 432){
			ukkoX=384;
			vihuSiirtyma -= 96;
			pisteet += 25; // Uhkarohkeuspisteet
		}
		ukkoX += ukkoLiikkuuX;
		
		
		// Maaston liikuttaminen
		siirtoY+=4;
		if (siirtoY>192){
			siirtoY=0;
			var maasto = new Array(5);
			for (var i=maasto.length; i<=0; i--){ // X-suuntaan
				console.log("fuck");
				maasto[i] = new Array(3);
				
				// Generoi maasto eli lataa kuvat:
				// Tehdään suora tie:

				for(var j=maasto[i].length; j<=0; j--){ // Y-suuntaan
					console.log(i + "x"+j); // Miksei tule konsoliin mitään?
					if(i == 2){
						// Keskelle tie.
						maasto[i][j] = tieSuoraan[0]; //Satunnainen tie.
					}else{
						maasto[i][j] = lataaKuva("brown"); //Satunnainen ei-tie.
						// Tai mahdollisesti tyhjä paikka.
					}
				}
			}
		}
		
		// Linnun liikerata
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
		}

		if(hengissa){
			game().fillStyle = "#000";
			game().font = "24px sans-serif";
			game().fillText((Math.floor(pisteet/50)*50)+" m",33,33);
			game().fillStyle = "#FFF";
			game().fillText((Math.floor(pisteet/50)*50)+" m",32,32);
		}
		
		// Kun vihu saa pelaajan kiinni
		if(vihuSiirtyma<96){
			
			// Ajasta uuden pelin alkaminen
			if(hengissa){
				hengissa=false;
				setTimeout(function(){
					vihuSiirtyma=256;
					hengissa=true;
				},5000);
			}
		
			// Muuta Canvas harmaasävyiseksi ja tummenna sitä hieman
			var imgd = game().getImageData(0, 0, $("canvas").width(), $("canvas").height());
			var pix = imgd.data;
			for (var i = 0, n = pix.length; i < n; i += 4) {
				var grayscale = pix[i] * .3 + pix[i+1] * .59 + pix[i+2] * .11;
				var sat = Math.random()*64-32;
				pix[i] = grayscale - sat - 32;
				pix[i+1] = grayscale - sat - 32;
				pix[i+2] = grayscale - sat - 32;
			}
			game().putImageData(imgd, 0, 0);
			
			// Aseta vihu pelaajan alle
			vihuSiirtyma=95;
			
			// Kirjoita tekstit
			game().fillStyle = "#000";
			game().font = "bold 64px sans-serif";
			game().fillText("Henki pois :-(",65,129);
			game().fillStyle = "#FFF";
			game().fillText("Henki pois :-(",64,128);
			
			game().fillStyle = "#000";
			game().font = "16px sans-serif";
			game().fillText("Yritä keskittyä seuraavalla pelikerralla hieman paremmin",65,193);
			game().fillStyle = "#FFF";
			game().fillText("Yritä keskittyä seuraavalla pelikerralla hieman paremmin",64,192);
		}
	}
	
	function piirraMaasto(siirtoY){
		for (var i=0; i<maasto.length; i++){
			for (var j=0; j<maasto[i].length; j++){
				game().drawImage(maasto[i][j], i*192, (j-1)*192 + siirtoY);
			}
		}
	}
	
	// TODO: Siirrä oliomuotoon.
	
	function piirraLintu(i,x,y){
		game().drawImage(lintu[i],x,y);
	}
	
	function piirraVihu(i,x,y){
		game().drawImage(vihu[i],x,y);
	}
	
	function piirraUkko(i,x,y){
		game().drawImage(ukko[i],x,y);
	}
});