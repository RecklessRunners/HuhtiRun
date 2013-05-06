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
	var veri = lataaKuvat('veri',0);
	//var futisKentta = lataaKuvat('futis/bg',0);
	var placeholder = lataaKuvat('mitalit/placeholder',0);
	var mitalit = lataaKuvat('mitalit/',4);
	var mitalinauha = lataaKuvat('mitalit/mitalinauha',0);
	var hyppyKuva = lataaKuvat('hyppy',0);
	var kolikkoKuva = lataaKuvat('kolikko',0);
	
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
	var kilina = lataaAanet("gain",0);

	
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
	var elvytettavissa = false;
	var kokonaisSuoritus = 0;

	var pelaaNo = 0; // Ei deskriptiivinen nimi
	
	var tavoiteData = [0,false,0,0,0,0,0,0,0,0,0,0];
	var tavoitteet = [
		{
			nimi:"Noviisi",
			kuvaus:"Juokse 250 metriä yhden pelin aikana",
			vaatimus:function(){return 1/250*parhaatPisteet;}
		},
		{
			nimi:"Urheilija",
			kuvaus:"Juokse 500 metriä yhden pelin aikana",
			vaatimus:function(){return 1/500*parhaatPisteet;}
		},
		{
			nimi:"Huippu-urheilija",
			kuvaus:"Juokse 750 metriä yhden pelin aikana",
			vaatimus:function(){return 1/750*parhaatPisteet;}
		},
		{
			nimi:"Addikti",
			kuvaus:"Juokse 20 000 metriä koko aikana",
			vaatimus:function(){return 1/20000*kokoMatka;}
		},
		{
			nimi:"Kuolematon",
			kuvaus:"Elvytä itsesi viidesti yhden pelin aikana",
			vaatimus:function(){return 1/5*tavoiteData[2];}
		},
		{
			nimi:"Rikas",
			kuvaus:"Hanki 20 000 € vähintään kerran",
			vaatimus:function(){return 1/20000*tavoiteData[0];}
		}
	];
	var tavoiteNo = 0; // Tavoitteen numero, jota katsotaan Tavoitteet-sivulla

	//alert(localStorage.length);
	
	// Biomit
	// Arvotaan tietyn tyyppistä tietä ja maastoa, kun ollaan aavikolla, ruohikossa, merellä jne.
	var biomi = 3;
	var biomiKuvat = [ // Taustakuvan numerot, kullekin biomille
		[0,0,0,3,3,4,5,5], // Aavikko
		[1,2], // Ruoho
		[6], // Meri
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
	var kokoMatka = 0;

	var kolikot = [];
	
	// Lataa pelitiedot selaimesta
	if(localStorage.parhaatPisteet == null || localStorage.parhaatPisteet == undefined){
		var parhaatPisteet = 0;
		var rahat = 500;
		var buusti = 0;
		var suojakilpi = 4000;
		var kokoMatka = 0;
		var tavoiteData = [0,false,0,0,0,0,0,0,0,0,0];

		localStorage.parhaatPisteet=parhaatPisteet;
		localStorage.rahat=rahat;
		localStorage.buusti=buusti;
		localStorage.suojakilpi=suojakilpi;
		localStorage.kokoMatka=kokoMatka;
		localStorage.tavoiteData=tavoiteData;

		alert("Tervetuloa pelaamaan HuhtiRunia!");
	}else{
		var parhaatPisteet = parseInt(localStorage.parhaatPisteet);
		var rahat = parseInt(localStorage.rahat);
		var buusti = parseInt(localStorage.buusti);
		var suojakilpi = parseInt(localStorage.kilpi)*1000;
		var kokoMatka = parseInt(localStorage.kokoMatka);
		var tavoiteData = JSON.parse(localStorage.tavoiteData);
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
	var pisteet = 0;
    var tieMinMax = [0, 960];
    
    var tauko = false;

	var tehty = "✔ Suoritettu";

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

	function kirjoita(teksti,x,y,lihavoitu,fonttikoko=16,vari="#FFF"){
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
			game().fillStyle = vari;
		}
		game().fillText(teksti,x,y);
	}
	
	//Hoitaa kaiken päivityksen 
	function paivita(){

		// Laske tavoitteiden suoritusprosentti
		kokonaisSuoritus=0;
		$.each(tavoitteet,function(i,v){
			kokonaisSuoritus+=v.vaatimus();
		});
		kokonaisSuoritus = kokonaisSuoritus/tavoitteet.length;
		pelaaNo+=.5;
		if(pelaaNo>1000){
			pelaaNo=0;
		}

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
		if(biomiLaskuri >= 12){
			var uusiBiomi = 0;/*Math.floor(Math.random()*biomiKuvat.length);
			while(uusiBiomi==biomi){
				uusiBiomi = Math.floor(Math.random()*biomiKuvat.length);
			}*/
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
		piirraVarjo();
		piirraUkko(iUkko,ukkoX,ukkoY);
		piirraLintu(iLintu,lintuX,lintuY);
		piirraHyppyNappi();

		if(!hengissa){
			ukkoY=0;
			suojakilpi=3000;
		}else{
			ukkoY=192;
		}
		
		// Pelaajan ohjauskomennot
		$("html").keydown(function(e) {
			//
		}).keyup(function(e){
			//e.preventDefault();
			if(!hyppy){
				hyppyAani[0].play();
				hyppy=true;
				setTimeout(function(){
					hyppy=false;
				},500);
			}
			/*switch(e.keyCode){
				// Aseta peli tauolle kun painaa ESC
				case 32:
					console.log("Space");
					if(tauko){
						tauko=false;
					}else{
						tauko=true;
					}
				break;
			}*/
		});
		

        //
		// Onko pelaaja tiellä. 	
        //
        
        //Missä tie
        if (siirtoY>ukkoY-100){ //Tien tutkiminen: Voi joutua muuttamaan lukua
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
			tavoiteX=puolivali;
		}
		/*if(((suojakilpi>0 && suojakilpi<=2000) || (matka<=5))&& hengissa){
			var puolivali = Math.floor((0.5*(tieMinMax[0] + tieMinMax[1]))/192)*192;
		}*/
        
        //Ukko ja tie. 
		if((ukkoX<(tieMinMax[0]-ukkoToleranssi) || ukkoX > tieMinMax[1]+ukkoToleranssi-120) && !tauko){
			var puolivali = Math.floor((0.5*(tieMinMax[0] + tieMinMax[1]))/192)*192;
			suojakilpiTeho -= Math.random()/10;
			suojakilpiTeho  = Math.max(0.1,suojakilpiTeho);
			if(suojakilpi <= 0 && !hyppy){
				tavoiteX=puolivali;
				vihuSiirtyma -= 64 + Math.round(Math.random()*48);
				suojakilpi+=2000;
				navigator.vibrate(500);
				auts[0].play();
				console.log(maasto);
			}
		}

		if(hengissa){
			ukkoX += ukkoLiikkuuX;
			matka += Math.abs(ukkoLiikkuuX)/250;
		}

		// Tunnista tietyyppi (kuolee mikäli kompastuu puuhun ym.)
		if(!hyppy && suojakilpi<=0 && siirtoY>144){
			if(maasto[Math.round(ukkoX/192)][1]==tieSuoraan[1] || maasto[Math.round(ukkoX/192)][1]==tieSuoraan[4]){
				vihuSiirtyma=95;
			}
		}
		
		// Maaston liikuttaminen
		if(tauko){
			game().textAlign="center";
			var keskiosa = {"x":$("canvas").width()/2,"y":$("canvas").height()/2};
			kirjoita("Tauolla",keskiosa.x,keskiosa.y,true,48);
			game().textAlign="start";
		}else{
			siirtoY+=pelaajaNopeus;
		}

		$.each(kolikot,function(i,v){
			var kolikkoY = (matka-v[1])*192+siirtoY-48;
			game().drawImage(kolikkoKuva[0],v[0],kolikkoY);
			if(kolikkoY > ukkoY && kolikkoY < ukkoY+96 && ukkoX > v[0]-24-96 && ukkoX < v[0]+72){
				//kolikot.splice(i,1);
				kolikot[i][1]=$("canvas").height();
				pisteet+=1;
				kilina[0].play();
			}
			if(kolikkoY > $("canvas").height()){
				//kolikot.splice(i,1);
			}
		});

		if (siirtoY >= 192){
			siirtoY=0;
			biomiLaskuri+=1;
			console.log("Biomia on ollut "+biomiLaskuri+" blokkia");
			
			if(hengissa && !tauko){
				matka += 1;
				/*kolikot.push([tie*192+96-24,matka]);
				kolikot.push([tie*192+96-24,matka+0.2]);
				kolikot.push([tie*192+96-24,matka+0.4]);
				kolikot.push([tie*192+96-24,matka+0.6]);
				kolikot.push([tie*192+96-24,matka+0.8]);*/
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

		pelaajaNopeus=10+Math.round(5/300*matka); // Peli vaikenee, mitä pitemmälle pääsee
		
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
				tummuus=0;
				elvytettavissa=true;
				inaktiivinenMenu=true;
				kolikot=[];
				setTimeout(function(){
					inaktiivinenMenu=false;
					if(matka >= 10){
						rahat=parseInt(rahat)+parseInt(matka);
						kokoMatka+=parseInt(matka);
					}
					tavoiteData[0]=Math.max(tavoiteData[0],rahat);
					tavoiteData[2]=Math.max(tavoiteData[2],pelikerrat);
					// Pelitietojen tallennus
					parhaatPisteet = Math.max(parhaatPisteet,matka);
					localStorage.parhaatPisteet=parhaatPisteet;
					localStorage.rahat=rahat;
					localStorage.buusti=buusti;
					localStorage.kilpi=suojakilpi/1000;
					localStorage.kilpiTeho=suojakilpiTeho;
					localStorage.kokoMatka=kokoMatka;
					localStorage.tavoiteData=JSON.stringify(tavoiteData);
					console.log(tavoiteData);
					setTimeout(function(){
						elvytettavissa=false;
					},3000);
				},1000);
			}

			rahat=localStorage.rahat;
			tummuus=.4;
		

			game().fillStyle="rgba(128,0,0,.9)";
			game().fillRect(0,192,960,576);
			for(i=0;i<10;i++){
				game().drawImage(veri[0],96*i,96);
			}
			
			// Aseta vihu pelaajan alle
			vihuSiirtyma=95;
			
			// Kirjoita ruudun tekstit
			switch(tila){
				case 0:
					if(matka>=10){
						kirjoita("Elvytä",320,256,true,24);
						kirjoita(pad(Math.round(matka),6),64,128,true,64);
						if(elvytettavissa){
							if(rahat>=100*Math.pow(2,pelikerrat)+50){
								kirjoita("Hinta "+(100*Math.pow(2,pelikerrat)+50)+" €",320,280,false);
							}else{
								kirjoita("Rahaa ei ole riittävästi",320,280,false);
							}
						}else{
							kirjoita("Et ehtinyt elvyttää!",320,280,false);
						}
						game().textAlign="end";
						switch(biomi){
							case 0:
								kirjoita("Näitkö kangastuksia?",$("canvas").width()-64,128,false,24);
							break;
							case 1:
								kirjoita("Kukkiako lähdit keräämään?",$("canvas").width()-64,128,false,24);
							break;
							case 2:
								kirjoita("Mitä sä siellä vedessä teet?",$("canvas").width()-64,128,false,24);
							break;
							case 3:
								kirjoita("Muista hakku!",$("canvas").width()-64,128,false,24);
							break;
						}
						game().textAlign="start";
					}else{
						kirjoita("HuhtiRun",64,128,true,64);
					}
					kirjoita("Pelaa ➧",64,278+(Math.sin(pelaaNo)*4),true,48,"lime");
					kirjoita("Kauppa",576,256,true,24);
					kirjoita("Osta buustia, suojakilpi ym.",576,280,false);

					kirjoita("Tavoitteet",64,384,true,24);
					kirjoita(Math.round(kokonaisSuoritus*100)+" % suoritettu",64,408,false);

					kirjoita("Tilastot",320,384,true,24);
					kirjoita("Seuraa pelitilastojasi",320,408,false);

					kirjoita("Lisää · · ·",576,384,true,24);
					kirjoita("Asetukset, ohjeet, tekijät ym.",576,408,false);

					kirjoita("Tililläsi on nyt "+Math.round(rahat)+" €",64,160,true);

					game().textAlign="end";
					kirjoita("Pelin resetointi",$("canvas").width()-64,512,false);
					game().textAlign="start";
				break;
				case 1:
					kirjoita("Kauppa",64,128,true,64);
					game().textAlign="end";
					kirjoita("Tililläsi on "+Math.round(rahat)+" €",$("canvas").width()-64,128,true);
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

					/*kirjoita("Suojakilven teho",64,256,false);
					kirjoita(Math.floor(suojakilpiTeho*100)+"%",384,256,false);
					kirjoita("Osta +10% (50 €)",512,256,false);*/

					kirjoita("← Takaisin",64,512,true);
				break;
				case 2:
					kirjoita(tavoitteet[tavoiteNo].nimi,256,192,true,24);
					kirjoita(tavoitteet[tavoiteNo].kuvaus,256,224,false,20);
					if(tavoitteet[tavoiteNo].vaatimus()>=1){
						var mitaliSin = (Math.sin(pelaaNo/10)*10)-(Math.PI/2); // Mitali nauhoineen heiluu siniaallon mukaan
						kirjoita(tehty,256,288,true,20,"lime");
						game().drawImage(mitalinauha[0],-64+(mitaliSin+(mitaliSin/4)/2),-32);
						game().drawImage(mitalit[tavoiteNo],64+mitaliSin/2,176);
						/*game().drawImage(mitalinauha[0],-64,-32);
						game().drawImage(mitalit[tavoiteNo],64,176);*/
					}else{
						kirjoita(Math.round(tavoitteet[tavoiteNo].vaatimus()*100) + " % suoritettu",256,288,false,20,"silver");
						game().drawImage(placeholder[0],64,176,128,128);
					}
					
					game().textAlign="end";
					kirjoita("Seuraava 〉",$("canvas").width()-64,512,true);
					kirjoita("Tavoitteista on suoritettu "+Math.round(kokonaisSuoritus*100)+" %",$("canvas").width()-64,128,true);
					game().textAlign="center";
					kirjoita("Takaisin valikkoon",$("canvas").width()/2,512,true);
					game().textAlign="start";
					kirjoita("〈 Edellinen",64,512,true);
					kirjoita("Tavoitteet",64,128,true,64);
				break;
				case 3:
					kirjoita("Tilastot",64,128,true,64);

					kirjoita(pad(parhaatPisteet,8),64,192,true,32);
					kirjoita("m ennätysmatka",256,192,false,24);

					kirjoita(pad(kokoMatka,8),64,256,true,32);
					kirjoita("m yhteenlaskettu matka",256,256,false,24);

					kirjoita("← Takaisin",64,512,true);
				break;
				case 4:
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
			kirjoita("rev. 1.1.5 (a)",$("canvas").width()-8,$("canvas").height()-8,false,8);
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
								tavoiteNo=0;
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
								tavoiteData[1]=true;
								if(matka>=10){
									if(elvytettavissa){
										if(! inaktiivinenMenu && osta(100*Math.pow(2,pelikerrat)+50)){
											inaktiivinenMenu=true;
											pelaajaNopeus=0;
											setTimeout(function(){
												vihuSiirtyma=256;
												hengissa=true;
												pelaajaNopeus=10;
												tausta[0].volume=1;
												suojakilpi+=2000;
												inaktiivinenMenu=false;
												pelikerrat+=1;
												tavoiteData[2]=Math.max(tavoiteData[2],pelikerrat);
												navigator.vibrate(1000);
												if(buusti>0 && hengissa){
													matka+=parseInt(buusti);
													buusti=0;
												}
											},1000);
										}
									}else{
										alert("Jotta voit elvyttää itsesi, sinun tulee olla tarpeeksi nopea. Muutoin pelihahmosi menehtyy, etkä enää voi elvyttää sitä.");
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
									localStorage.clear();
									location.reload();
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
							/*if(y>256-16 && y<256+16){
								if(osta>=100){
									alert("Et voi ostaa suojausta yli 100%");
								}else{
									if(osta(50)){
										suojakilpiTeho += .1;
									}
								}
							}*/
						}
					}else{
						tila=0; // Siirry takaisin menuun
						klikkiAani[0].play();
					}
				}else if(tila==2){ // Tavoitemenu
					if(y>448){
						if(x<$("canvas").width()/3){ // Edellinen
							tavoiteNo = Math.max(0,tavoiteNo-1);
							klikkiAani[0].play();
						}
						if(x>$("canvas").width()/3 && x<$("canvas").width()/3*2){ // Siirry takaisin menuun
							tila=0;
							klikkiAani[0].play();
						}
						if(x>$("canvas").width()/3*2){ // Seuraava
							tavoiteNo = Math.min(tavoitteet.length-1,tavoiteNo+1);
							klikkiAani[0].play();
						}
					}
				}else if(tila==3 || tila==4){ // Tilastomenu
					if(y>448){ // Takaisin valikkoon
						tila=0;
						klikkiAani[0].play();
					}
				}
			}
	}).mousemove(function(e){
		var x = Math.floor(e.pageX-$("canvas").offset().left);
		var y = Math.floor(e.pageY-$("canvas").offset().top);
		if(y<$("canvas").height()*.8){
			if(hengissa && !tauko && !hyppy){
				tavoiteX=x-96;
			}
		}else{
			if(!hyppy && hengissa){
				hyppyAani[0].play();
				hyppy=true;
				setTimeout(function(){
					hyppy=false;
				},500);
			}
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
		if(hyppy){
			game().drawImage(varjo[0],ukkoX+48,ukkoY+96);
		}
	}
	
	function piirraVihu(i,x,y){
		game().drawImage(vihu[i],x,y);
	}
	
	function piirraHyppyNappi(){
		if(hengissa){
			if(hyppy){
				game().drawImage(hyppyKuva[0],64,$("canvas").height()-64,64,32);
			}else{
				game().drawImage(hyppyKuva[0],64,$("canvas").height()-96);
			}
		}
	}
	
	function piirraUkko(i,x,y){
		if(suojakilpi>0 && hengissa){
			if(suojakilpi<=2000){
				if(suojakilpi%100){
					game().globalAlpha=0.5;
				}
			}else{
				game().globalAlpha=0.5;
			}
		}
		if(hyppy){
			game().drawImage(ukko[i],x-24,y-24,240,240);
		}else{
			game().drawImage(ukko[i],x,y);
		}
		game().globalAlpha=1;
	}
	// Ostotoiminto kauppaa varten
	function osta(hinta){
		if(hinta <= rahat){
			rahat-=hinta;
			localStorage.rahat=rahat;
			maksuAani[0].play();
			return true;
		}else{
			dramaattinen[0].play();
			alert("Rahasi eivät riitä :-(\nTarvitset "+Math.floor(hinta-rahat)+" € lisää rahaa ostaaksesi tämän");
			return false;
		}
	}
});
