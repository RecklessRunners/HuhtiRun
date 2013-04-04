// 20.fi/9621


$(function(){




	// Poistumisvarmistus
	window.onbeforeunload = function (e) {
		e = e || window.event;
		if (e) {
			e.returnValue = 'Sure?';
		}
		return 'Sure?';
	};

	// Etunollat -- onko enää tarpeen?
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

	// TODO: Siirrä oliomuotoon.

    function lataaKuvat(nimi, nmax){
        var taulu = [];
        for(var i=0;i<=nmax;i++){
            var img = new Image();
            img.src="img/"+nimi+i+".png";
            taulu.push(img);
        }
        return taulu;
    }
    function lataaAanet(nimi, nmax){
        var taulu = [];
        for(var i=0;i<=nmax;i++){
            var snd = new Audio();
            snd.src="snd/"+nimi+i+".wav";
			snd.load();
            taulu.push(snd);
        }
        return taulu;
    }

	// Kuvat
	var tieSuoraan = lataaKuvat('tiesuoraan', 5 );
	var tieVasemmalle = lataaKuvat('kaannosv',1 );
	var tieOikealle = lataaKuvat('kaannoso',1 );
	var taustaKuva = lataaKuvat('tausta', 9);
	var tieVaakaan = lataaKuvat('tievaaka', 1);
	var tieOikeaYlos = lataaKuvat('kaannosoy', 0);
	var tieVasenYlos = lataaKuvat('kaannosvy', 0);
	var varjo = lataaKuvat('varjo',0);
	
	// Äänet
	var hyppyAani = lataaAanet("jump",0);
	var dramaattinen = lataaAanet("dead",0);
	var tausta = lataaAanet("back",0);
	var auts = lataaAanet("ouch",0);
	
	tausta[0].loop=true;
	tausta[0].play();

	var hengissa = true;
	var ukkoToleranssi = 40; 
    
	var lintu = lataaKuvat('lintu', 8);
	var iLintu=0; // Linnun animaatio - framen n:o
	var lintuX = 0; // Linnun sijainti X
	var lintuY = 128; // Linnun sijainti Y
	var lintuK = 1.25; // Linnun kallistuskulma (px)
	//var iLintuMax=8;
	
	var hyppy = false;
	
	if(localStorage.length != 0){
		parhaatPisteet = localStorage.parhaatPisteet;
	}else{
		parhaatPisteet = 0;
	}
	
	var ukko = lataaKuvat('ukko', 2);
	var iUkko=0;
	var ukkoX = 384;
	var ukkoY = 192;
	var pelaajaNopeus = 9;

	var vihu = lataaKuvat('vihu', 4);
	var iVihu=1;
	var vihuX = []; 
    for (var i=1; i < 5; i++){
            vihuX.push( ukkoX );
    }
	var vihuSiirtyma = 256;
	
	var matka = 0;
    var tieMinMax = [0, 960];
    
    var paussilla = false;

	// 2D-taulukko [5x4], jossa on referenssit kuviin
	var maasto = new Array(5);
    var maastomuoto = new Array( maasto.length ); //Tarvitaan lopetusehtoon
    var tie = 2; //Missä on ylimmänrivin tie matkalla ylöspäin.
	for (var i=0; i<maasto.length; i++){ // X-suuntaan
		maasto[i] = new Array(4);
		maastomuoto[i] = new Array( maasto[i].length );
		// Generoi maasto eli lataa kuvat:
		// Tehdään suora tie:

		for(var j=0; j<maasto[i].length; j++){ // Y-suuntaan
			if(i == 2){
				// Keskelle tie.
				maasto[i][j] = tieSuoraan[0]; //Satunnainen tie.
                maastomuoto[i][j] = 1; //TIE
			}else{
				maasto[i][j] = taustaKuva[0]; //Satunnainen ei-tie.
                maastomuoto[i][j] = 0; //Kuolema 

			}
		}
	}


    function jatkaTieOikeaan(ind){

        //Arvotaan, kuinka kauas mennään oikeaan, eli arvotaan indeksi, jossa käännytään ylös
        ylos = Math.floor( Math.random()*(5-1-ind) ) + ind +1 ;

        maasto[ind][0] = tieOikealle[Math.floor(Math.random()*tieOikealle.length)];
        maastomuoto[ind][0] = 1;
        //Täytetään välit suorilla
        for (var i=ind+1; i<ylos; i++){
            maasto[i][0] = tieVaakaan[Math.floor(Math.random()*tieVaakaan.length)];
            maastomuoto[i][0] = 1; //Tie
        }
        maasto[ylos][0] = tieOikeaYlos[Math.floor(Math.random()*tieOikeaYlos.length)]; 
        maastomuoto[ylos][0]=1; 


        //Täytetään muut taustalla
        var iTausta = [0, 1, 2, 3, 4];
        iTausta.splice(ind, ylos-ind+1);
        for ( var i in iTausta ){
          maasto[iTausta[i]][0] = taustaKuva[Math.floor(Math.random()*taustaKuva.length)]; 
          maastomuoto[iTausta[i]][0] = 0; //Kuolema
        }


        return ylos;
    }


    function jatkaTieVasempaan(ind){

        //Arvotaan, kuinka kauas mennään vasempaan, eli arvotaan indeksi, jossa käännytään ylös
        ylos = Math.floor( Math.random()*(ind-1) );

        maasto[ind][0] = tieVasemmalle[Math.floor(Math.random()*tieVasemmalle.length)];
        maastomuoto[ind][0]=1; //Tie
        //Täytetään välit suorilla
        for (var i=ylos+1; i<ind; i++){
            maasto[i][0] = tieVaakaan[Math.floor(Math.random()*tieVaakaan.length)];
            maastomuoto[i][0]=1;
        }
        maasto[ylos][0] = tieVasenYlos[Math.floor(Math.random()*tieVasenYlos.length)]; 
        maastomuoto[ylos][0]=1; 


        //Täytetään muut taustalla
        var iTausta = [0, 1, 2, 3, 4];
        iTausta.splice(ylos, ind-ylos+1);
        for ( var i in iTausta ){
          maasto[iTausta[i]][0] = taustaKuva[Math.floor(Math.random()*taustaKuva.length)]; 
          maastomuoto[iTausta[i]][0]=0;  //Kuolema
        }

        return ylos;
    }

    function jatkaTieYlos(ind){

        maasto[ind][0] = tieSuoraan[Math.floor(Math.random()*tieSuoraan.length)];
        maastomuoto[ind][0]=1;

        
        //Täytetään muut taustalla
        var iTausta = [0, 1, 2, 3, 4];
        iTausta.splice(ind, 1);
        for ( var i in iTausta ){
          maasto[iTausta[i]][0] = taustaKuva[Math.floor(Math.random()*taustaKuva.length)]; 
          maastomuoto[iTausta[i]][0]=0;
        }


        return ind;
    }


	var ukkoLiikkuuX = 0;
	var siirtoY = 0;	
	setInterval(paivita,50);
	
	//Hoitaa kaiken päivityksen 
	function paivita(){
		if(hengissa){
			matka += .075;
		}
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
		
        vihuX.push( ukkoX );

		
		//Piirrä oliota ja asioita. 
		piirraMaasto(siirtoY);
		piirraVihu(iVihu,vihuX.shift(), ukkoY+vihuSiirtyma);
		piirraUkko(iUkko,ukkoX,ukkoY);
		piirraLintu(iLintu,lintuX,lintuY);
		//piirraVarjo();
		
		// Pelaajan ohjauskomennot
		$("*").keydown(function(e) {
			switch(e.keyCode){
				// Vasemmalle
				case 37:
				case 65:
					ukkoLiikkuuX = -20;
				break;
				// Oikealle
				case 39:	
				case 68:
					ukkoLiikkuuX = 20;
				break;
				// Aseta peli tauolle kun painaa Esc
				case 27:
					if(paussilla){
						paussilla=false;
					}else{
						paussilla=true;
					}
				break;
			}
		}).keyup(function(e){
			ukkoLiikkuuX = 0;
		});
		

        //
		// Onko pelaaja tiellä. 	
        //
        
        //Missä tie
        if (siirtoY>142){ //Tien tutkiminen: Voi joutua muuttamaan lukua
            var tieKoordinaatit =[];
            var min = 1152;
            var max = 0;
            for (var i=0; i<maasto.length; i++){ // X-suuntaan
                tieKoordinaatit.push(maastomuoto[i][1]);
            }
            min = tieKoordinaatit.indexOf(1);
            max = tieKoordinaatit.lastIndexOf(1);

            tieMinMax = [192*min, 192*(max+1)];
            console.log("Koord " + tieMinMax );

            console.log("Paikkaa " +  tieKoordinaatit );

        }
        
        //Ukko ja tie. 
		if(ukkoX<(tieMinMax[0]-ukkoToleranssi) || ukkoX > tieMinMax[1]+ukkoToleranssi){
			ukkoX=0.5*( tieMinMax[0] + tieMinMax[1] );
			vihuSiirtyma -= 96;
            auts[0].play();
		}
		ukkoX += ukkoLiikkuuX;
		
		
		// Maaston liikuttaminen
		if(paussilla){
			game().fillStyle = "#FFF";
			game().font = "32px sans-serif";
			game().fillText("Paussilla",64,64);	
		}else{
			siirtoY+=pelaajaNopeus;
		}
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


			// Päivitys funtsittu, eli ok. 
			// 1. Suoraan / käännös oikealle / käännös vasemmalle
			// 	i=0 => Ei vasemmalle
			// 	i=4 => Ei oikealle
			// 2. Tee välisuorat
			// 3. Päivitä maasto / maastomuoto

            // If on nopein:
            // http://stackoverflow.com/questions/6665997/switch-statement-for-greater-than-less-than/12259830#12259830
            //
            var Suunta = Math.random();

            if (tie == 0){
                //Vasen reuna: ylös tai oikealle
                if (Suunta < 0.5){ //Oikealle
                    tie = jatkaTieOikeaan(tie);
                }else{ //Ylös
                    tie = jatkaTieYlos(tie); 
                    
                }
            }else
            if (tie==4){
                //Oikea reuna; ylös tai vasemmalle
                if (Suunta < 0.5){ //Vasemmalle
                    tie = jatkaTieVasempaan(tie);
                }else{ //Ylös
                    tie = jatkaTieYlos(tie);
                }
            }else{
            //Tie on oikean ja vasemman reunan välissä
                if (Suunta < 0.4){
                    //Vasemmalle
                    tie = jatkaTieVasempaan(tie);
                }else
                if (Suunta < 0.8){ //Oikealle
                    tie = jatkaTieOikeaan(tie); 
                }else{ //Ylos
                    tie = jatkaTieYlos(tie);
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

		// Kirjoita matka näytölle 50 metrin välein
		if(hengissa){
			var pyorista50 = Math.floor(matka/50)*50;
			var pyorista5 = Math.floor(matka/5)*5;
			if(matka >= 50 && matka >= pyorista50 && matka <= pyorista50+10){
				game().fillStyle = "#000";
				game().font = "64px sans-serif";
				game().fillText(pyorista50+" m",385,129);
				game().fillStyle = "#FFF";
				game().fillText(pyorista50+" m",384,128);
			}
			game().fillStyle = "#000";
			game().font = "bold 24px sans-serif";
			game().fillText(pyorista5+" m",48,48);
			game().fillStyle = "#FFF";
			game().fillText(pyorista5+" m",49,49);
		}
		
		// Varjo
		game().fillStyle="rgba(0,0,0,.2)";
		
		// Kun vihu saa pelaajan kiinni
		if(vihuSiirtyma<96){
			// Pysäytä maaston liikkuminen
			pelaajaNopeus = 0;
			tausta[0].volume=.375;
		
			// Ajasta uuden pelin alkaminen
			if(hengissa){
				hengissa=false;
				dramaattinen[0].play();
				setTimeout(function(){
					vihuSiirtyma=256;
					hengissa=true;
					pelaajaNopeus=9;
					matka=0;
					tausta[0].volume=1;
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
			game().fillText("Uuh, ihanaa!",65,129);
			game().fillStyle = "#FFF";
			game().fillText("Uuh, ihanaa!",64,128);

			parhaatPisteet = Math.max(parhaatPisteet,matka);
			localStorage.parhaatPisteet=parhaatPisteet;
			
			game().fillStyle = "#000";
			game().font = "bold 16px sans-serif";
			var alateksti = "Juoksit " + Math.round(matka) + " metriä! Paras tulos tällä koneella on " + Math.round(parhaatPisteet) + " m.";
			
			game().fillText(alateksti,65,193);
			game().fillStyle = "#FFF";
			game().fillText(alateksti,64,192);
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
	
	function piirraVarjo(){
		//game().drawImage(varjoKuva[0],ukkoX,ukkoY+128);
	}
	
	function piirraVihu(i,x,y){
		game().drawImage(vihu[i],x,y);
	}
	
	function piirraUkko(i,x,y){
		game().drawImage(ukko[i],x,y);
	}
});
