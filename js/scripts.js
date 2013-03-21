// 20.fi/9621


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
		for(i=0;i<6;i++){
			var img = new Image();			
			img.src="img/tiesuoraan"+i+".png";
			taulu.push(img);
		}
		return taulu;
	}
	
	function lataaMutkat(){
		var taulu = [];
		for(i=0;i<2;i++){
			var img = new Image();			
			img.src="img/kaannosv"+i+".png";
			taulu.push(img);
		}
		return taulu;
	}

	function lataaTausta(){
		var taulu = [];
		for(i=0;i<4;i++){
			var img = new Image();			
			img.src="img/tausta"+i+".png";
			taulu.push(img);
		}
		return taulu;
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
	
	
	var tieSuoraan = lataaTieSuoraan();
	var tieMutkat = lataaMutkat();
	var taustaKuva = lataaTausta();
	
	var hengissa = true;
	
	var biomi = 0; // Biomi on maaston tyyppi (0 = peltotie, 1 = asfaltti, ...)
	
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
	var pelaajaNopeus = 6;

	var vihu = lataaVihu();
	var iVihu=1;
	var vihuX = 384; 
	var vihuSiirtyma = 256;
	
	var matka = 0;

	// 2D-taulukko [5x4], jossa on referenssit kuviin
	var maasto = new Array(5);
    var maastomuoto = new Array( maasto.length );
	for (var i=0; i<maasto.length; i++){ // X-suuntaan
		maasto[i] = new Array(4);
		maastomuoto[i] = new Array( maasto[i].length );
		// Generoi maasto eli lataa kuvat:
		// Tehdään suora tie:

		for(var j=0; j<maasto[i].length; j++){ // Y-suuntaan
			if(i == 2){
				// Keskelle tie.
				maasto[i][j] = tieSuoraan[0]; //Satunnainen tie.
                maastomuoto[i][j] = 'suoraan';
			}else{
				maasto[i][j] = taustaKuva[0]; //Satunnainen ei-tie.
                maastomuoto[i][j] = 'tausta'

			}
		}
	}
	
	var ukkoLiikkuuX = 0;
	var siirtoY = 0;	
	setInterval(paivita,25);
	
	//Hoitaa kaiken päivityksen 
	function paivita(){
		matka += .375;
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
			matka += 25; // Uhkarohkeusmatka
		}
		ukkoX += ukkoLiikkuuX;
		
		
		// Maaston liikuttaminen
		siirtoY+=pelaajaNopeus;
		if (siirtoY>192){
			siirtoY=0;

			// Maaston päivitys
			
			// Kopioidaan ylemmät rivit alempaan
			for (var j=maasto[0].length-1; j>0; j--){
				for (var i=0; i < maasto.length; i++){
					//console.log("J I : " + j +" " +i  );
					maasto[i][j]=maasto[i][j-1]; 
					maastomuoto[i][j]=maastomuoto[i][j-1];
				}
			}

            // Päivitetään ylin rivi.
			for (var i=0; i < maasto.length; i++){
				// Markovin ketju
				switch(Math.round(Math.random()*15)){
					case 1:
						biomi = Math.round(Math.random());
					break;
					case 2:
					case 3:
					case 4:
					case 5:
					case 6:
					case 7:
					case 8:
					case 9:
					case 10:
					case 11:
					case 12:
						switch(biomi){
							case 0:
								maasto[i][0] = tieSuoraan[0]; // Peltotie suoraan
								break;
							case 1:
								maasto[i][0] = tieSuoraan[2]; // Asfaltti suoraan
							break;
						}
					break;
					case 13:
						switch(biomi){
							case 0:
								maasto[i][0] = tieSuoraan[1]; // Kaatunut puu, peltotie
								break;
							case 1:
								maasto[i][0] = tieSuoraan[5]; // Kivi tien reunassa, asfaltti
							break;
						}
					break;
					case 14:
						switch(biomi){
							case 0:
								maasto[i][0] = tieSuoraan[4]; // Rotko keskellä peltotietä
								break;
							case 1:
								maasto[i][0] = tieSuoraan[3]; // Asfaltti suoraan
							break;
						}
					break;
					case 15:
						switch(biomi){
							case 0:
								maasto[i][0] = tieMutkat[0]; // Rotko keskellä peltotietä
								break;
							case 1:
								maasto[i][0] = tieMutkat[1]; // Asfaltti suoraan
							break;
						}
					break;
				}
				//maasto[i][0] = tieSuoraan[Math.floor(Math.random()*tieSuoraan.length)];
			}
			// Päivitys funtsittu, eli ok. 
			// 1. Suoraan / käännös oikealle / käännös vasemmalle
			// 	i=0 => Ei vasemmalle
			// 	i=4 => Ei oikealle
			// 2. Tee välisuorat
			// 3. Päivitä maasto / maastomuoto
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

		// Kirjoita matka näytölle 250 metrin välein
		if(hengissa){
			var pyorista250 = Math.floor(matka/250)*250;
			if(matka >= 250 && matka >= pyorista250 && matka <= pyorista250+50){
				game().fillStyle = "#000";
				game().font = "64px sans-serif";
				game().fillText(pyorista250+" m",385,129);
				game().fillStyle = "#FFF";
				game().fillText(pyorista250+" m",384,128);
			}
		}
		
		// Kun vihu saa pelaajan kiinni
		if(vihuSiirtyma<96){
			// Pysäytä maaston liikkuminen
			pelaajaNopeus = 0;
		
			// Ajasta uuden pelin alkaminen
			if(hengissa){
				hengissa=false;
				setTimeout(function(){
					vihuSiirtyma=256;
					hengissa=true;
					pelaajaNopeus=6;
				},5000);
			}
		
			// Muuta Canvas harmaasävyiseksi ja tummenna sitä hieman
			var imgd = game().getImageData(0, 0, $("canvas").width(), $("canvas").height());
			var pix = imgd.data;
			for (var i = 0, n = pix.length; i < n; i += 4) {
				var grayscale = pix[i] * .3 + pix[i+1] * .59 + pix[i+2] * .11;
				var sat = Math.random()*64-32;
				pix[i] = grayscale - sat;
				pix[i+1] = grayscale - sat;
				pix[i+2] = grayscale - sat;
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
