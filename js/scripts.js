// 20.fi/9621


$(function(){

	// Poistumisvahvistus
	window.onbeforeunload = function (e) {
		if(hengissa){
			e = e || window.event;
			if (e) {
				e.returnValue = "Pelisi jää kesken";
			}
			return "Pelisi jää kesken";
		}
	};

	store={"close":function(){}};

	// Etunollat
	function pad(number,length) {
		var str = ''+number;
		while (str.length < length) {
			str = '0' + str;
		}
		return str;
	}
	
	// Kaiken ydin
	function game(){
		var canvas = $("canvas")[0];
		if(canvas.getContext && navigator.userAgent.indexOf("Firefox") != -1){
			return canvas.getContext('2d');
		}else{
			document.location="pages/unsupported.html";
			return false;
		}
	}

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
	var tieSuoraan = lataaKuvat('upcoming/tiesuoraan',7);
	var tieVasemmalle = lataaKuvat('upcoming/kaannosv',3);
	var tieOikealle = lataaKuvat('upcoming/kaannoso',4);
	var taustaKuva = lataaKuvat('upcoming/tausta',8);
	var tieVaakaan = lataaKuvat('upcoming/tievaaka',3);
	var tieOikeaYlos = lataaKuvat('upcoming/kaannosoy',3);
	var tieVasenYlos = lataaKuvat('upcoming/kaannosvy',3);
	var varjo = lataaKuvat('varjo',0);
	
	// Äänet
	var hyppyAani = lataaAanet("jump",0);
	var dramaattinen = lataaAanet("over",0);
	var tausta = lataaAanet("bg",0);
	var auts = lataaAanet("ouch",0);
	var korkeaAani = lataaAanet("angels",0);
	var maksuAani = lataaAanet("coin",0);
	var klikkiAani = lataaAanet("click",0);
	var skratsaus = lataaAanet("scratch",0);
	var huuto = lataaAanet("scream",0);
	
	tausta[0].loop=true;
	tausta[0].play();

	korkeaAani[0].loop=true;
	korkeaAani[0].volume=0;
	korkeaAani[0].play();

	var tila = 0;

	var suojakilpi = 4000;
	var suojakilpiTeho = 0.1;
	var hengissa = true;
	var ukkoToleranssi = 40;
	var pelikerrat=0;
	
	var tummuus = 1;
	var biomiLaskuri=0;
	
	// Biomit
	// Arvotaan tietyn tyyppistä tietä ja maastoa, kun ollaan aavikolla, ruohikossa, merellä jne.
	var biomi = 3;
	var biomiKuvat = [ // Taustakuvan numerot, kullekin biomille
		[0,0,0,3,3,4,5,5], // Aavikko
		[1,2], // Ruoho
		[6], // Meri,
		[7,8] // Luola
	];
	var biomiTieSuoraanKuvat = [
		[0,1,4],
		[2,3,5],
		[6],
		[7]
	];
	var biomiTieVaakaanKuvat = [
		[0],
		[1],
		[2],
		[3]
	];
	var biomiTieVYKuvat = [
		[1],
		[0],
		[2],
		[3]
	];
	var biomiTieOYKuvat = [
		[0],
		[1],
		[2],
		[3]
	];
	var biomiTieVasKuvat = [
		[0],
		[1],
		[2],
		[3]
	];
	var biomiTieOikKuvat = [
		[2],
		[0,1],
		[3],
		[4]
	];
    
	var lintu = lataaKuvat('lintu', 8);
	var iLintu=0; // Linnun animaatio - framen n:o
	var lintuX = 0; // Linnun sijainti X
	var lintuY = 128; // Linnun sijainti Y
	var lintuK = 1.25; // Linnun kallistuskulma (px)

	var inaktiivinenMenu = false;
	var tavoiteX = 0;	
	var hyppy = false;
	
	// Lataa pelitiedot selaimesta
	if(localStorage.length != 0){
		var parhaatPisteet = parseInt(localStorage.parhaatPisteet);
		var kolikot = parseInt(localStorage.kolikot);
		var buusti = parseInt(localStorage.buusti);
		var suojakilpi = parseInt(localStorage.kilpi)*1000;
		var suojakilpiTeho = parseInt(localStorage.suojakilpiTeho);
	}else{
		var parhaatPisteet = 0;
		var kolikot = 0;
		var buusti = 0;
		var suojakilpi = 4000;
		var suojakilpiTeho = 0.1;
	}

	var klikkiPos = [0,0];
	
	var ukko = lataaKuvat('ukko', 2);
	var iUkko=0;
	var ukkoX = 384;
	var ukkoY = 192;
	var pelaajaNopeus = 9;

	var vihu = lataaKuvat('vihu', 4);
	var iVihu = 1;
	var vihuX = [];

	// Vihun perässä seuraaminen
    for (var i=1; i < 5; i++){
		vihuX.push(ukkoX);
    }

	var vihuSiirtyma = 95;
	
	var matka = 0;
    var tieMinMax = [0, 960];
    
    var tauko = false;

	// 2D-taulukko [5x4], jossa on referenssit kuviin
	function alustaMaasto(){
		biomi=Math.floor(Math.random()*biomiKuvat.length);
		maasto = new Array(5);
		maastomuoto = new Array(maasto.length); //Tarvitaan lopetusehtoon
		tie = 2; //Missä on ylimmänrivin tie matkalla ylöspäin.
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
	}

	alustaMaasto();

    function jatkaTieOikeaan(ind){
        //Arvotaan, kuinka kauas mennään oikeaan, eli arvotaan indeksi, jossa käännytään ylös
        ylos = Math.floor( Math.random()*(5-1-ind) ) + ind +1 ;

        maasto[ind][0] = tieOikealle[biomiTieOikKuvat[biomi][Math.floor(Math.random()*biomiTieOikKuvat[biomi].length)]];
        maastomuoto[ind][0] = 1;
        //Täytetään välit suorilla
        for (var i=ind+1; i<ylos; i++){
            maasto[i][0] = tieVaakaan[biomiTieVaakaanKuvat[biomi][Math.floor(Math.random()*biomiTieVaakaanKuvat[biomi].length)]];
            maastomuoto[i][0] = 1; //Tie
        }
        maasto[ylos][0] = tieOikeaYlos[biomiTieOYKuvat[biomi][Math.floor(Math.random()*biomiTieOYKuvat[biomi].length)]]; 
        maastomuoto[ylos][0]=1; 

        //Täytetään muut taustalla
        var iTausta = [0, 1, 2, 3, 4];
        iTausta.splice(ind, ylos-ind+1);
        for ( var i in iTausta ){
          maasto[iTausta[i]][0] = taustaKuva[biomiKuvat[biomi][Math.floor(Math.random()*biomiKuvat[biomi].length)]];
          maastomuoto[iTausta[i]][0] = 0; //Kuolema
        }
        return ylos;
    }

    function jatkaTieVasempaan(ind){
        //Arvotaan, kuinka kauas mennään vasempaan, eli arvotaan indeksi, jossa käännytään ylös
        ylos = Math.floor( Math.random()*(ind-1) );

        maasto[ind][0] = tieVasemmalle[biomiTieVasKuvat[biomi][Math.floor(Math.random()*biomiTieVasKuvat[biomi].length)]];
        maastomuoto[ind][0]=1; //Tie
        //Täytetään välit suorilla
        for (var i=ylos+1; i<ind; i++){
            maasto[i][0] = tieVaakaan[biomiTieVaakaanKuvat[biomi][Math.floor(Math.random()*biomiTieVaakaanKuvat[biomi].length)]];
            maastomuoto[i][0]=1;
        }
        maasto[ylos][0] = tieVasenYlos[biomiTieVYKuvat[biomi][Math.floor(Math.random()*biomiTieVYKuvat[biomi].length)]]; 
        maastomuoto[ylos][0]=1; 


        //Täytetään muut taustalla
        var iTausta = [0, 1, 2, 3, 4];
        iTausta.splice(ylos, ind-ylos+1);
        for ( var i in iTausta ){
          maasto[iTausta[i]][0] = taustaKuva[biomiKuvat[biomi][Math.floor(Math.random()*biomiKuvat[biomi].length)]];
          maastomuoto[iTausta[i]][0]=0;  //Kuolema
        }

        return ylos;
    }

    function jatkaTieYlos(ind){

        maasto[ind][0] = tieSuoraan[biomiTieSuoraanKuvat[biomi][Math.floor(Math.random()*biomiTieSuoraanKuvat[biomi].length)]];
        maastomuoto[ind][0]=1;

        
        //Täytetään muut taustalla
        var iTausta = [0, 1, 2, 3, 4];
        iTausta.splice(ind, 1);
        for ( var i in iTausta ){
          maasto[iTausta[i]][0] = taustaKuva[biomiKuvat[biomi][Math.floor(Math.random()*biomiKuvat[biomi].length)]];
          maastomuoto[iTausta[i]][0]=0;
        }


        return ind;
    }


	var ukkoLiikkuuX = 0;
	var siirtoY = 0;	
	setInterval(paivita,50);

	function kirjoita(teksti,x,y,lihavoitu,fonttikoko=16){
		game().fillStyle = "#000";
		if(lihavoitu){
			game().font = "bold "+fonttikoko+"px sans-serif";
		}else{
			game().font = fonttikoko+"px sans-serif";
		}
		game().fillText(teksti,x+1,y+1);
		if(inaktiivinenMenu){
			game().fillStyle = "#C0C0C0";
		}else{
			game().fillStyle = "#FFF";
		}
		game().fillText(teksti,x,y);
	}
	
	//Hoitaa kaiken päivityksen 
	function paivita(){
		// Siirrä ukkoa
		if(tavoiteX != ukkoX){
			var posErotus = ((Math.max(ukkoX,tavoiteX)-Math.min(ukkoX,tavoiteX)))/4;
			if(tavoiteX < ukkoX){
				ukkoX-=posErotus;
			}else{
				ukkoX+=posErotus;
			}
		}

		// Muuta biomia
		if(biomiLaskuri >= 10){
			var uusiBiomi = Math.floor(Math.random()*biomiKuvat.length);
			while(uusiBiomi==biomi){
				uusiBiomi = Math.floor(Math.random()*biomiKuvat.length);
			}
			console.log("Biomi muuttuu "+biomi+" --> "+uusiBiomi);
			biomi=uusiBiomi;
			biomiLaskuri=0;
		}
		// Pienennä musiikin äänenvoimakkuutta, kun vihollinen on lähempänä, menuissa, ym.
		if(tauko){
			aanenVoimakkuus=0.1;
		}else{
			aanenVoimakkuus=Math.max(0,Math.min(1,1/176*(vihuSiirtyma-80)));
		}
		if(hengissa){
			korkeaAani[0].volume=Math.max(0,.6-aanenVoimakkuus);
			tausta[0].volume=aanenVoimakkuus;
		}else{
			korkeaAani[0].volume=0;
			tausta[0].volume=.2;
		}

		if(suojakilpi>0 && hengissa){
			suojakilpi-=50;
			suojakilpi=Math.max(suojakilpi,0);
		}
		if(Math.ceil(Math.random()*16)==16){
			vihuSiirtyma -= Math.floor(3/512*vihuSiirtyma);
		}

		// Siirtää vihollista hitaasti taaksepäin
		vihuSiirtyma = Math.min(384,vihuSiirtyma+.375);
		if(vihuSiirtyma>256){
			vihuSiirtyma-=1.5;
		}
		
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
			var randomiNopeus = 20 + Math.round(Math.random()*20);
			switch(e.keyCode){
				// Vasemmalle
				case 37:
				case 65:
					ukkoLiikkuuX = randomiNopeus*-1;
				break;
				// Oikealle
				case 39:	
				case 68:
					ukkoLiikkuuX = randomiNopeus;
				break;
				// Aseta peli tauolle kun painaa Esc
				case 27:
					if(tauko){
						tauko=false;
					}else{
						tauko=true;
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
            // console.log("Koord " + tieMinMax );
            // console.log("Paikkaa " +  tieKoordinaatit );
        }
		if(suojakilpi>2000){
			var puolivali = Math.floor((0.5*(tieMinMax[0] + tieMinMax[1]))/192)*192;
			if(ukkoX != puolivali){
				if(ukkoX<puolivali){
					ukkoX+=(Math.max(ukkoX,puolivali)-Math.min(ukkoX,puolivali))/4;
				}else{
					ukkoX-=(Math.max(ukkoX,puolivali)-Math.min(ukkoX,puolivali))/4;
				}
			}
		}
		if((suojakilpi>0 && suojakilpi<=2000) || (matka<=5)){
			var puolivali = Math.floor((0.5*(tieMinMax[0] + tieMinMax[1]))/192)*192;
			game().strokeStyle="red";
			game().lineWidth=2;
			game().beginPath();
			game().moveTo(puolivali+96,96);
			game().lineTo(puolivali+96,192);
			game().stroke();
		}
        
        //Ukko ja tie. 
		if((ukkoX<(tieMinMax[0]-ukkoToleranssi) || ukkoX > tieMinMax[1]+ukkoToleranssi-120) && !tauko){
			var puolivali = Math.floor((0.5*(tieMinMax[0] + tieMinMax[1]))/192)*192;
			suojakilpiTeho -= Math.random()/10;
			suojakilpiTeho  = Math.max(0.1,suojakilpiTeho);
			if(suojakilpi <= 0){
				tavoiteX=puolivali;
				vihuSiirtyma -= 64 + Math.round(Math.random()*48);
				suojakilpi+=2000;
				navigator.vibrate(500);
				auts[0].play();
			}
		}

		if(hengissa){
			ukkoX += ukkoLiikkuuX;
			matka += Math.abs(ukkoLiikkuuX)/250;
		}
		
		// Maaston liikuttaminen
		if(tauko){
			game().textAlign="center";
			var keskiosa = {"x":$("canvas").width()/2,"y":$("canvas").height()/2};
			kirjoita("Tauolla",keskiosa.x,keskiosa.y,true,48);
			game().textAlign="start";
		}else{
			if(biomi==3){
				siirtoY+=pelaajaNopeus*.8;
			}else{
				siirtoY+=pelaajaNopeus;
			}
		}

		if (siirtoY>192){
			siirtoY=0;
			biomiLaskuri+=1;
			console.log("Biomia on ollut "+biomiLaskuri+" blokkia");
		if(hengissa && !tauko){
			matka += 1;
		}

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
			if(matka >= 50 && matka >= pyorista50 && matka <= pyorista50+5){
				game().fillStyle = "#000";
				game().font = "64px sans-serif";
				game().fillText(pyorista50+" m",385,129);
				game().fillStyle = "#FFF";
				game().fillText(pyorista50+" m",384,128);
			}
			game().fillStyle = "#000";
			game().font = "bold 24px sans-serif";
			game().fillText(pad(Math.round(matka),6),48,48);
			game().fillStyle = "#FFF";
			game().fillText(pad(Math.round(matka),6),49,49);
			game().fillStyle = "#000";
			game().font = "bold 12px sans-serif";
			game().fillText("Paras: "+pad(Math.round(parhaatPisteet),6),48,64);
			game().fillStyle = "#FFF";
			game().fillText("Paras: "+pad(Math.round(parhaatPisteet),6),49,65);
		}
		
		// Varjo
		//game().fillStyle="rgba(0,0,0,.2)";

		if(vihuSiirtyma<192 && hengissa){
			game().textAlign="center";
			game().font = "bold 32px sans-serif";
			game().fillStyle="#000";
			var keskiosa = {"x":$("canvas").width()/2,"y":$("canvas").height()/2};
			game().fillText("Olet hengenvaarassa!",keskiosa.x,keskiosa.y);
			game().fillStyle="#FF0000";
			game().fillText("Olet hengenvaarassa!",keskiosa.x+1,keskiosa.y+1);
			game().textAlign="start";
		}

		if(biomi==3){
			tummuus += .005;
			tummuus = Math.min(tummuus,.7);
			game().fillStyle="rgba(0,0,0,"+Math.min(tummuus,.7)+")";
			game().fillRect(0,0,960,576);
		}else{
			tummuus -= .02;
			if(tummuus>0){
				game().fillStyle="rgba(0,0,0,"+Math.min(tummuus,.7)+")";
				game().fillRect(0,0,960,576);
			}
			tummuus = Math.max(tummuus,0);
		}

		pelaajaNopeus=10+Math.round(5/250*matka); // Peli vaikenee, mitä pitemmälle pääsee
		
		// Kun vihu saa pelaajan kiinni
		if(vihuSiirtyma<96){
			// Pysäytä maaston liikkuminen
			pelaajaNopeus=0;
		
			if(hengissa){
				// Kuolemismenu
				navigator.vibrate(1000);
				hengissa=false;
				suojakilpi=0;
				dramaattinen[0].play();
				inaktiivinenMenu=true;
				setTimeout(function(){
					inaktiivinenMenu=false;
					if(matka >= 10){
						kolikot=parseInt(kolikot)+parseInt(matka);
					}
					// Pelitietojen tallennus
					parhaatPisteet = Math.max(parhaatPisteet,matka);
					localStorage.parhaatPisteet=parhaatPisteet;
					localStorage.kolikot=kolikot;
					localStorage.buusti=buusti;
					localStorage.kilpi=suojakilpi/1000;
					localStorage.kilpiTeho=suojakilpiTeho;
				},1000);
			}

			kolikot=localStorage.kolikot;
		
			// Muuta Canvas harmaasävyiseksi ja tummenna sitä hieman
			var imgd = game().getImageData(0, 0, $("canvas").width(), $("canvas").height());
			var pix = imgd.data;
			for (var i = 0, n = pix.length; i < n; i += 4) {
				var grayscale = pix[i] * .3 + pix[i+1] * .59 + pix[i+2] * .11;
				pix[i] = grayscale+48;
				pix[i+1] = grayscale-48;
				pix[i+2] = grayscale-48;
			}
			game().putImageData(imgd, 0, 0);
			
			// Aseta vihu pelaajan alle
			vihuSiirtyma=95;
			
			// Kirjoita ruudun tekstit
			switch(tila){
				case 0:
					if(matka>=10){
						kirjoita(pad(Math.round(matka),6),64,128,true,64);
						kirjoita("Elvytä",320,256,true,24);
						if(kolikot>=100*Math.pow(2,pelikerrat)+50){
							kirjoita("Jatka peliä, hinta "+(100*Math.pow(2,pelikerrat)+50)+" €",320,280,false);
						}else{
							kirjoita("Tarvitset vielä "+Math.round((100*Math.pow(2,pelikerrat))+50-kolikot)+" €",320,280,false);
						}
					}else{
						kirjoita("HuhtiRun",64,128,true,64);
					}
			
					kirjoita("Uusi peli",64+(Math.random()*4),256+(Math.random()*4),true,24);
					kirjoita("Oletko valmis seikkailuun?",64+(Math.random()*4),280+(Math.random()*4),false);
					kirjoita("Kauppa",576,256,true,24);
					kirjoita("Osta buustia, suojakilpi ym.",576,280,false);

					kirjoita("Tavoitteet",64,384,true,24);
					kirjoita("Tarkastele tavoitteitasi",64,408,false);

					kirjoita("Asetukset",320,384,true,24);
					kirjoita("Säädä pelin asetuksia",320,408,false);

					kirjoita("Ekstrat",576,384,true,24);
					kirjoita("Ohjeet, tekijät ym.",576,408,false);

					kirjoita("Tililläsi on nyt "+Math.round(kolikot)+" €",64,160,true);

					game().textAlign="end";
					kirjoita("Pelin resetointi",$("canvas").width()-64,512,false);
					game().textAlign="start";
				break;
				case 1:
					kirjoita("Kauppa",64,128,true,64);
					game().textAlign="end";
					kirjoita("Tililläsi on "+Math.round(kolikot)+" €",$("canvas").width()-64,128,true);
					game().textAlign="start";

					game().save(); // Tallentaa canvasin asetukset
					game().rotate(Math.PI/8);
					kirjoita("Osta 200 m, saat 50 m kaupan päälle!",448,-128,false,22);
					game().restore(); // Palauttaa canvasin asetukset

					kirjoita("Buusti (=etumatka pelin alussa)",64,192,false);
					kirjoita(Math.floor(buusti)+" m",384,192,false);
					kirjoita("Osta +25 m (200 €)",512,192,false);

					kirjoita("Suojakilpi (=kuolemattomuus)",64,224,false);
					kirjoita(Math.floor(suojakilpi/1000*2/25*20)+" m",384,224,false);
					kirjoita("Osta +25 m (100 €)",512,224,false);

					kirjoita("Suojakilven teho",64,256,false);
					kirjoita(Math.floor(suojakilpiTeho*100)+"%",384,256,false);
					kirjoita("Osta +10% (50 €)",512,256,false);

					kirjoita("← Takaisin",64,512,true);
				break;
				case 2:case 3:case 4:
					kirjoita("Tulossa pian!",64,128,true,64);
					kirjoita("← Takaisin",64,512,true);
				break;
			}
		}
		if(hengissa){
			var oikeaReuna = $("canvas").width()-12;
			game().fillStyle="#000";
			game().fillRect(oikeaReuna-12,12,12,24);
			game().fillRect(oikeaReuna-30,12,12,24);
			game().fillStyle="#FFF";
			game().fillRect(oikeaReuna-13,13,12,24);
			game().fillRect(oikeaReuna-31,13,12,24);
		}else{
			// Versionumeron ja copyrightin printtaus
			game().textAlign="end";
			kirjoita("rev. 1.1.1 (a)",$("canvas").width()-8,$("canvas").height()-8,false,8);
			game().textAlign="start";
			kirjoita("© 2013 Huhdin koulu",8,$("canvas").height()-8,false,8);
		}
	}

	$("canvas").mousedown(function(e){
		var x = Math.floor(e.pageX-$("canvas").offset().left);
		var y = Math.floor(e.pageY-$("canvas").offset().top);
		var randomiNopeus = 10 + Math.round(Math.random()*10);
		if(hengissa){
			klikkiPos=[x,y];
			navigator.vibrate(100);
			if(x>$("canvas").width()-48 && y<64){
				if(tauko){
					tauko=false;
				}else{
					tauko=true;
				}
			}
		}else{
			if(tila==0){
				navigator.vibrate(100);
					if(y<448){
						if(y>320){ // Alarivi
							if(x>=0 && x<256){ // Siirry tavoitemenuun
								tila=2;
								klikkiAani[0].play();
							}
							if(x>=256 && x<512){ // Siirry asetuksiin
								tila=3;
								klikkiAani[0].play();
							}
							if(x>=512){ // Siirry ekstroihin
								tila=4;
								klikkiAani[0].play();
							}
						}else{ // Ylärivi
							if(x>=0 && x<256){ // Aloita uusi peli
								if(! inaktiivinenMenu){
									inaktiivinenMenu=true;
									klikkiAani[0].play();
									pelaajaNopeus=0;
									setTimeout(function(){
										tummuus=1;
										alustaMaasto();
										vihuSiirtyma=512;
										pelaajaNopeus=10;
										huuto[0].play();
										hengissa=true;
										matka=0;
										tausta[0].volume=1;
										suojakilpi+=2000;
										inaktiivinenMenu=false;
										pelikerrat=0;
										navigator.vibrate(1000);
										if(buusti>0 && hengissa){
											matka+=parseInt(buusti);
											buusti=0;
										}
									},1000);
								}
							}
							if(x>=256 && x<512){ // Elvytä itsesi
								if(matka>=10){
									if(! inaktiivinenMenu && osta(100*Math.pow(2,pelikerrat)+50)){
										inaktiivinenMenu=true;
										pelaajaNopeus=0;
										setTimeout(function(){
											tummuus=1;
											vihuSiirtyma=256;
											hengissa=true;
											pelaajaNopeus=10;
											tausta[0].volume=1;
											suojakilpi+=2000;
											inaktiivinenMenu=false;
											pelikerrat+=1;
											navigator.vibrate(1000);
											if(buusti>0 && hengissa){
												matka+=parseInt(buusti);
												buusti=0;
											}
										},1000);
									}
								}
							}
							if(x>=512){
								tila=1; // Mene kauppaan
								klikkiAani[0].play();
							}
						}
					}else{
						if(x>=$("canvas").width()/4*3){
							switch(new Date().getDay()){
								case 0:
									viikonpaiva="sunnuntai";
								break;
								case 1:
									viikonpaiva="maanantai";
								break;
								case 2:
									viikonpaiva="tiistai";
								break;
								case 3:
									viikonpaiva="keskiviikko";
								break;
								case 4:
									viikonpaiva="torstai";
								break;
								case 5:
									viikonpaiva="perjantai";
								break;
								case 6:
									viikonpaiva="lauantai";
								break;
							}
							if(confirm("Haluatko varmasti palauttaa pelin alkutilaansa?\n\nTämä poistaa kaikki ostamasi tavarat, palauttaa tilin saldon ja parhaat pisteesi.\n\nToiminto on peruuttamaton.")){
								if(prompt("Vahvista toimenpide kirjoittamalla kokonaan pienin kirjaimin, mikä viikonpäivä on tänään.")==viikonpaiva){
									alert("Tiedot poistetaan!");
									parhaatPisteet=0;
									localStorage.parhaatPisteet=0;
									kolikot=0;
									localStorage.kolikot=0;
									buusti=0;
									localStorage.buusti=0;
									suojakilpi=0;
									localStorage.kilpi=0;
									suojakilpiTeho=0;
									localStorage.suojakilpiTeho=0;
									location.reload(true);
								}else{
									alert("Väärin. Tietoja ei ole poistettu.");
								}
							}
						}
					}
				}else if(tila==1){ // Kaupassa
					if(y<448){
						if(x>448 && x<448+256){
							if(y>192-16 && y<192+16){
								if(osta(200)){
									buusti+=25;
									if(buusti%200==0){
										buusti+=50;
									}
								}
							}
							if(y>224-16 && y<224+16){
								if(osta(100)){
									suojakilpi+=25*500;
								}
							}
							if(y>256-16 && y<256+16){
								if(osta>=100){
									alert("Et voi ostaa suojausta yli 100%");
								}else{
									if(osta(50)){
										suojakilpiTeho += .1;
									}
								}
							}
						}
					}else{
						tila=0; // Siirry takaisin menuun
						klikkiAani[0].play();
					}
				}else if(tila==2 || tila==3 || tila==4){ // Tavoitemenu
					if(y<448){
						// // // // //
					}else{
						tila=0; // Siirry takaisin menuun
						klikkiAani[0].play();
					}
				}
			}
	}).mousemove(function(e){
		var x = Math.floor(e.pageX-$("canvas").offset().left);
		var y = Math.floor(e.pageY-$("canvas").offset().top);
		if(hengissa){
			tavoiteX=x-96;
		}
	});
	
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
		if(suojakilpi>0){
			if(suojakilpi<=2000){
				if(suojakilpi%100){
					game().globalAlpha=.5;
				}
			}else{
				game().globalAlpha=.5;
			}
		}
		game().drawImage(ukko[i],x,y);
		game().globalAlpha=1;
	}
	// Ostotoiminto kauppaa varten
	function osta(hinta){
		if(hinta <= kolikot){
			kolikot-=hinta;
			localStorage.kolikot=kolikot;
			maksuAani[0].play();
			return true;
		}else{
			dramaattinen[0].play();
			alert("Rahasi eivät riitä :-(\nTarvitset "+Math.floor(hinta-kolikot)+" € lisää rahaa ostaaksesi tämän");
			return false;
		}
	}
});
