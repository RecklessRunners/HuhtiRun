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

	function tuhaterotin(num){
		return num;
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
			img.onload=function(){
				ladatutTiedostot++;
			};
			img.onerror=function(){
				virheLadatessa=true;
				virheTiedosto="img/"+nimi+i+".png";
			};
			img.src="img/"+nimi+i+".png";
			kaikkiTiedostot++;
			taulu.push(img);
		}
		return taulu;
	}
	function lataaAanet(nimi, nmax){
		var taulu = [];
		for(var i=0;i<=nmax;i++){
			var snd = new Audio();
			/*snd.canplaythrough=function(){
				ladatutTiedostot++;
			};*/
			snd.src="snd/"+nimi+i+".wav";
			snd.load();
			//kaikkiTiedostot++;
			taulu.push(snd);
		}
		return taulu;
	}
	
	var kaikkiTiedostot = 0;
	var ladatutTiedostot = 0;
	var virheTiedosto = "";
	var virheLadatessa = false;

	// Kuvat
	//var latain = lataaKuvat("lataa",0);

	var ukko = [
		lataaKuvat("ukko/0a",2),	// 0a
		lataaKuvat("ukko/45a",2),	// 45a
		lataaKuvat("ukko/90a",2),	// 90a
		lataaKuvat("ukko/-45a",2),	//-45a
		lataaKuvat("ukko/-90a",2)	//-90a
	];

	var tieSuoraan = lataaKuvat('upcoming/tiesuoraan',10);
	var tieVasemmalle = lataaKuvat('upcoming/kaannosv',4);
	var tieOikealle = lataaKuvat('upcoming/kaannoso',6);
	var taustaKuva = lataaKuvat('upcoming/tausta',10);
	var tieVaakaan = lataaKuvat('upcoming/tievaaka',5);
	var tieOikeaYlos = lataaKuvat('upcoming/kaannosoy',4);
	var tieVasenYlos = lataaKuvat('upcoming/kaannosvy',4);
	var varjo = lataaKuvat('varjo',0);
	var kolikkoKuva = lataaKuvat('kolikko',0);
	var veri = lataaKuvat('veri',0);
	//var futisKentta = lataaKuvat('futis/bg',0);
	var placeholder = lataaKuvat('mitalit/placeholder',0);
	var mitalit = lataaKuvat('mitalit/',4);
	var mitalinauha = lataaKuvat('mitalit/mitalinauha',0);
	var palkki = lataaKuvat('palkki',0);
	var kiilto = lataaKuvat('kiilto',0);
	var hyppyKuva = lataaKuvat('hyppy',0);
	
	// Äänet
	var hyppyAani = lataaAanet("jump",0);
	var dramaattinen = lataaAanet("over",0);
	var tausta = lataaAanet("bg",0);
	var auts = lataaAanet("ouch",0);
	var korkeaAani = lataaAanet("angels",0);
	var maksuAani = lataaAanet("coin",0);
	var klikkiAani = lataaAanet("select",0);
	var skratsaus = lataaAanet("scratch",0);
	var huuto = lataaAanet("scream",0);
	var kilina = lataaAanet("gain",0);
	var menuMusiikki = lataaAanet("menu",0);

	tausta[0].loop=true;
	tausta[0].play();

	menuMusiikki[0].loop=true;
	menuMusiikki[0].play();

	korkeaAani[0].loop=true;
	korkeaAani[0].volume=0;
	korkeaAani[0].play();

	var tila = 0;

	var versioId = ""; // Muuttuu automaattisesti
	$.ajax({url:".git/refs/heads/master",success:function(resp){versioId=resp;}});

	var suojakilpi = 4000;
	var suojakilpiTeho = 0.1;
	var hengissa = true;
	var ukkoToleranssi = 40;
	var pelikerrat=0;

	var maxBonusMatka = 50;

	var asteluku = 0;

	var tutoriaali = [false,false,false,false];
	var tutoriaaliSisalto = ["Hyppää kaatuneen puun yli","Juokse vähintään 50 metriä","Osta toinen kenttä","Elvytä itsesi"];
	
	var tummuus = 1;
	var biomiLaskuri=0;
	var elvytettavissa = false;
	var kokonaisSuoritus = 0;

	// Kaupasta ostetut kentät
	var omatKentat = [true,false,false,false];

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
			kuvaus:"Hanki 20 000     vähintään kerran",
			vaatimus:function(){return 1/20000*tavoiteData[0];}
		}
	];
	var tavoiteNo = 0; // Tavoitteen numero, jota katsotaan Tavoitteet-sivulla

	//alert(localStorage.length);
	
	// Biomit
	// Arvotaan tietyn tyyppistä tietä ja maastoa, kun ollaan aavikolla, ruohikossa, merellä jne.
	var biomi = 0;
	var biomiTyypit = [
		"Aavikko",
		"Niitty",
		"Meri",
		"Luola",
		"Metsä"
	];
	var biomiKuvaukset = [
		"Juokse kuumassa auringossa\nvaroen tielle kaatuneita puita",
		"Juokse niityllä kukkia\nihastellen sekä varoen tiellä\nolevia kiviä",
		"Juokse laiturilla varoen\nlaiturilta tippumista",
		"Luolassa on pimeää ja vaarallista, mutta toisaalta voit löytää sieltä arvokkaita jalokiviä",
		"Lenkkeile luonnon helmassa lintujen laulua kunnellen"
	];
	var biomiKuvat = [ // Taustakuvan numerot, kullekin biomille
		[0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,3,4,4,4,5], // Aavikko
		[1,2], // Niitty
		[6], // Meri
		[7,8], // Luola
		[9,10] // Metsä
	];
	var biomiTieSuoraanKuvat = [
		[0,1,4],
		[2,3,5],
		[6],
		[7,7,7,8],
		[9,10]
	];
	var biomiTieVaakaanKuvat = [
		[0],
		[1],
		[2],
		[3,3,3,4],
		[5]
	];
	var biomiTieVYKuvat = [
		[1],
		[0],
		[2],
		[3],
		[4]
	];
	var biomiTieOYKuvat = [
		[0],
		[1],
		[2],
		[3],
		[4]
	];
	var biomiTieVasKuvat = [
		[0],
		[1],
		[2],
		[3],
		[4]
	];
	var biomiTieOikKuvat = [
		[2],
		[0,1],
		[3],
		[4],
		[5,6]
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
		/* Tarpeellinen? */
		var parhaatPisteet = 0;
		var rahat = 0;
		var buusti = 0;
		var suojakilpi = 0;
		var kokoMatka = 0;
		var tavoiteData = [0,false,0,0,0,0,0,0,0,0,0];
		/* ???????????????? */

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
		var suojakilpi = parseInt(localStorage.kilpi);
		var kokoMatka = parseInt(localStorage.kokoMatka);
		var tavoiteData = JSON.parse(localStorage.tavoiteData);
		var omatKentat = JSON.parse(localStorage.omatKentat);
	}

	var klikkiPos = [0,0];
	
	var iUkko=0;
	var ukkoX = 384;
	var ukkoY = 192;
	var pelaajaNopeus = 9;
	var veriSiirtyma = 320;
	var veriSiirtymaNyt = 320;

	var vihu = lataaKuvat('vihu', 4);
	var iVihu = 1;
	var vihuX = [];

	// Vihun perässä seuraaminen
    for (var i=1; i < 5; i++){
		vihuX.push(ukkoX);
    }

	var vihuSiirtyma = 95;
	
	var matka = 0;
	var pisteytys = 0;
	var bonusMatka = 0;
	var pisteet = 0;
    var tieMinMax = [0, 960];
    
    var tauko = false;

	var tehty = "✔ Suoritettu";

	// 2D-taulukko [5x4], jossa on referenssit kuviin
	function alustaMaasto(){
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
					maasto[i][j] = tieSuoraan[biomiTieSuoraanKuvat[biomi][0]]; //Satunnainen tie.
		        	maastomuoto[i][j] = 1; //TIE
				}else{
					maasto[i][j] = taustaKuva[biomiKuvat[biomi][0]]; //Satunnainen ei-tie.
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

	function kirjoita(teksti,x,y,lihavoitu,fonttikoko=16,vari="#FFF",fontti="sans-serif"){
		game().fillStyle = "#000";
		if(lihavoitu){
			game().font = "bold "+fonttikoko+"px "+fontti+",sans-serif";
		}else{
			game().font = fonttikoko+"px "+fontti+",sans-serif";
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
		var veriSiirtymaV = Math.abs((Math.max(veriSiirtymaNyt,veriSiirtyma)-Math.min(veriSiirtymaNyt,veriSiirtyma))/2.5);
		if(veriSiirtyma != veriSiirtymaNyt){
			if(veriSiirtyma<veriSiirtymaNyt){
				veriSiirtymaNyt -= veriSiirtymaV;
			}else{
				veriSiirtymaNyt += veriSiirtymaV;
			}
		}

		// Laske tavoitteiden suoritusprosentti
		kokonaisSuoritus=0;
		$.each(tavoitteet,function(i,v){
			kokonaisSuoritus+=Math.min(v.vaatimus(),1);
		});
		kokonaisSuoritus = kokonaisSuoritus/tavoitteet.length;
		pelaaNo+=.5;
		if(pelaaNo>1000){
			pelaaNo=0;
		}
		
		var liikkuuY = true;

		// Siirrä ukkoa
		if(tavoiteX == ukkoX){
			liikkuuY=true;
		}else{
			var posErotus = ((Math.max(ukkoX,tavoiteX)-Math.min(ukkoX,tavoiteX)))/5;

			if(tavoiteX > ukkoX){
				ukkoX+=posErotus;
				if(posErotus < 8){
					asteluku=0;
				}
				if(posErotus >= 8 && posErotus < 16){
					asteluku=1;
				}
				if(posErotus >= 16){
					asteluku=2;
				}
			}else{
				ukkoX-=posErotus;
				if(posErotus < 8){
					asteluku=0;
				}
				if(posErotus >= 8 && posErotus < 16){
					asteluku=3;
				}
				if(posErotus >= 16){
					asteluku=4;
				}
			}
			liikkuuY=false;
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
			menuMusiikki[0].volume=Math.max(0,menuMusiikki[0].volume-0.01);
		}else{
			korkeaAani[0].volume=0;
			tausta[0].volume=0;
			menuMusiikki[0].volume=1;
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
		if(iUkko>=ukko[asteluku].length){
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
		if(suojakilpi>2){
			var puolivali = Math.floor(tieMinMax[0]/192)*192;
			tavoiteX=puolivali;
		}
		/*if(((suojakilpi>0 && suojakilpi<=2000) || (matka<=5))&& hengissa){
			var puolivali = Math.floor((0.5*(tieMinMax[0] + tieMinMax[1]))/192)*192;
		}*/
        
        //Ukko ja tie. 
		if((ukkoX<(tieMinMax[0]-ukkoToleranssi) || ukkoX > tieMinMax[1]+ukkoToleranssi-120) && !tauko){
			var puolivali = Math.floor(tieMinMax[0]/192)*192;
			if(suojakilpi <= 0 && !hyppy){
				tavoiteX=puolivali;
				vihuSiirtyma -= 64 + Math.round(Math.random()*48);
				suojakilpi+=2;
				if(hengissa){
					navigator.vibrate(500);
					bonusMatka = Math.round(bonusMatka/2);
					auts[0].play();
				}
				console.log(maasto);
			}
		}

		if(hengissa){
			ukkoX += ukkoLiikkuuX;
			matka += Math.abs(ukkoLiikkuuX)/250;
		}

		// Tunnista tietyyppi (kuolee mikäli kompastuu puuhun, tippuu kuiluun ym.)
		// Suoraan menevät tiet
		
			if(maasto[Math.round(ukkoX/192)][1]==tieSuoraan[1] || maasto[Math.round(ukkoX/192)][1]==tieSuoraan[4] || maasto[Math.round(ukkoX/192)][1]==tieSuoraan[8]){
				if(hyppy){
					tutoriaali[0] = true;
				}else{
					if(!hengissa && siirtoY>144){
						hyppy=true;
						setTimeout(function(){hyppy=false;},750);
					}
					if(suojakilpi<=0 && siirtoY>144){
						vihuSiirtyma=95;
					}
				}
			}

		// Vaakaan menevät tiet
		// xxxxxxxxxxxxxxxxxxxxxxxx
		if(!hyppy && suojakilpi<=0){
			if(maasto[Math.round(ukkoX/192)][1]==tieVaakaan[4]){
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
				bonusMatka += 1;
				if(suojakilpi>0){
					suojakilpi-=1;
				}
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
			if(hengissa){
				lintuX=-512;
			}
			lintuY=(Math.random()*($("canvas").height()/2))+$("canvas").height()/4;
			lintuK=(Math.random()-.5)*6;
		}

		// Kirjoita matka näytölle 50 metrin välein
		if(hengissa){
			var pyorista50 = Math.floor(matka/50)*50;
			if(matka >= 50 && matka >= pyorista50 && matka <= pyorista50+5){
				kirjoita(pyorista50,384,128);
			}
			kirjoita(pad(Math.round(matka),6),32,48,true,24); // Kirjoita nykyiset pisteet

			if(bonusMatka<maxBonusMatka){
				//kirjoita(Math.min(100,Math.round(100/maxBonusMatka*bonusMatka))+"% bonus",32,64,true,12);

				// Piirrä bonuspalkki vasempaan reunaan
				game().beginPath();
				game().rect(32,128,24,256);
				game().fillStyle = "rgba(0,0,0,.5)";
				game().fill();
				game().strokeStyle="rgba(0,0,0,.25)";
				game().stroke();

				game().beginPath();
				var pylvasK = Math.min(256,Math.round(256/maxBonusMatka*bonusMatka));
				game().rect(32,256-pylvasK+128,24,pylvasK);
				game().fillStyle = "gold";
				game().fill();
			}else{
				bonusMatka=maxBonusMatka;
				if(matka%2){
					kirjoita("Kaksoisnapsauta saadaksesi bonuksen!",96,192,true,12,"gold");
				}

				// Piirrä bonuspalkki vasempaan reunaan
				game().beginPath();
				game().rect(32,128,24,256);
				game().fillStyle = "#47A94B";
				game().fill();
			}
			// Piirrä heijastus/kiilto
			game().beginPath();
			game().rect(32,128,12,256);
			game().fillStyle = "rgba(255,255,255,.1)";
			game().fill();
		}
		
		// Varjo
		//game().fillStyle="rgba(0,0,0,.2)";

		if(vihuSiirtyma<192 && hengissa){
			game().textAlign="center";
			var keskiosa = {"x":$("canvas").width()/2,"y":$("canvas").height()/2};
			kirjoita("♥",keskiosa.x,keskiosa.y,true,Math.ceil(Math.random()*32)+64,"red");
			kirjoita("Olet hengenvaarassa",keskiosa.x,keskiosa.y+32,true,16,"red");
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

		pelaajaNopeus=10+Math.round(0.01*matka); // Peli vaikenee, mitä pitemmälle pääsee
		
		// Kun vihu saa pelaajan kiinni, mene päävalikkoon
		if(vihuSiirtyma<96){
			pelaajaNopeus=10;
			suojakilpi=0;
		
			if(hengissa){
				tila=0;
				veriSiirtyma=320;
				navigator.vibrate(1000);
				hengissa=false;
				suojakilpi=0;
				pisteytys=matka;
				dramaattinen[0].play();
				inaktiivinenMenu=true;
				//kolikot=[];
				if(matka >= 5){
					rahat += matka;
					kokoMatka += matka;
					elvytettavissa=true;
					tavoiteData[3]=parseFloat(tavoiteData[3])+1;
				}
				setTimeout(function(){
					inaktiivinenMenu=false;
					tavoiteData[0]=Math.max(tavoiteData[0],rahat);
					tavoiteData[2]=Math.max(tavoiteData[2],pelikerrat);

					// Pelitietojen tallennus
					parhaatPisteet = Math.max(parhaatPisteet,matka);
					localStorage.parhaatPisteet=parhaatPisteet;
					localStorage.rahat=rahat;
					localStorage.buusti=buusti;
					localStorage.kilpi=suojakilpi;
					localStorage.kilpiTeho=suojakilpiTeho;
					localStorage.kokoMatka=kokoMatka;
					localStorage.tavoiteData=JSON.stringify(tavoiteData);
					localStorage.omatKentat=JSON.stringify(omatKentat);
					console.log(tavoiteData);
					setTimeout(function(){
						if(!inaktiivinenMenu){
							elvytettavissa=false;
						}
					},2000);
				},1000);
			}else{
				pisteytys -= pisteytys / 5;
			}

			tummuus=0.25;
		
			game().fillStyle="rgba(128,0,0,.9)";
			game().fillRect(0,352+veriSiirtymaNyt-192,960,576);

			for(i=0;i<20;i++){
				game().drawImage(veri[0],96*i,352+veriSiirtymaNyt-96-192,96,96);
				game().drawImage(palkki[0],96*i,96,96,96);
			}

			game().fillStyle="rgba(0,0,0,.25)";
			game().fillRect(0,0,960,96);
			
			// Aseta vihu pelaajan alle
			vihuSiirtyma=95;
			
			if(tila==0){
				if(elvytettavissa && matka >= 5 && rahat >= 100 * Math.pow(2,pelikerrat)){
					game().textAlign="center";
					if(pisteytys>5){
						kirjoita(Math.round(pisteytys),$("canvas").width()/2,256,true,64);
					}else{
						game().drawImage(kolikkoKuva[0],256+16,192,64,64);
						kirjoita(rahat,$("canvas").width()/2,256,true,64);
					}
					game().textAlign="start";
					kirjoita("Ohita",64,512,false);
					kirjoita("Elvytä ➧",640,512,true,32);
					kirjoita(100*Math.pow(2,pelikerrat),670,536,false);
					game().drawImage(kolikkoKuva[0],640,520,24,24);
				}else{
					// Piirrä alamenun vaihtoehdot
					kirjoita("Tavoitteet",64,512,false);
					kirjoita("Pelitilastot",192,512,false);
					kirjoita("Tietoja",320,512,false);

					// Piirrä kentänvalitsimet
					game().textAlign="center";
					if(biomi>0){
						kirjoita("<",64,256,true,48);
					}
					if(biomi<biomiTyypit.length-1){
						kirjoita(">",$("canvas").width()-64,256,true,48);
					}
					for(biomiI=0;biomiI<biomiTyypit.length;biomiI++){
						var palloX = ($("canvas").width()/2)+(biomiI*16)-(biomiTyypit.length*16/2)+5;
						if(biomiI==biomi){
							kirjoita("●",palloX,416,true,10);
						}else{
							kirjoita("○",palloX,416,true,10);
						}
					}
					kirjoita(biomiTyypit[biomi],$("canvas").width()/2,384,true,14,"#FFF","Source Sans Pro");
					game().textAlign="start";
				}
				if(omatKentat[biomi]){
					if(!elvytettavissa){
						game().textAlign="end";
							kirjoita("Jatka ➧",$("canvas").width()-64+(Math.sin(pelaaNo)*4),520,true,32,"#47A94B");
						game().textAlign="start";
					}
				}else{
					game().textAlign="end";
						kirjoita("Osta kenttä ➧",$("canvas").width()-64+(Math.sin(pelaaNo)*4),512,true,32,"#47A94B");
					game().textAlign="start";
					kirjoita(100*Math.pow(2,biomi),670,536,false);
					game().drawImage(kolikkoKuva[0],640,520,24,24);
				}
				game().textAlign="center";
				kirjoita("Jännittävä seikkailupeli eri maastoissa",$("canvas").width()/2,144,true,16,"#FFF","Source Sans Pro");
				game().textAlign="start";
			}
			if(tila==0 || tila==1){
				if(!elvytettavissa){
					// Näytä rahatilanne vasemmassa yläkulmassa
					game().drawImage(kolikkoKuva[0],24,24,24,24);
					kirjoita(Math.round(tuhaterotin(rahat)),64,40,true);
				}

				// Kirjoita otsikko
				game().textAlign="center";
				kirjoita("HuhtiRun",$("canvas").width()/2,112,true,64,"#FFF","'Fondamento'");
				kirjoita("TM",$("canvas").width()*0.675,80,true,16);
				game().textAlign="start";
			}
			if(tila==1){
				game().textAlign="center";
				kirjoita("Halutessasi voit ostaa power-upeja ennen peliä",$("canvas").width()/2,144,true,12,"gold");

				game().drawImage(kiilto[0],$("canvas").width()/4-96,192+veriSiirtymaNyt/9);
				kirjoita("Bonusta nopeammin",$("canvas").width()/4,192+veriSiirtymaNyt/9,true);
				kirjoita("Bonusmittari täyttyy",$("canvas").width()/4,396+veriSiirtymaNyt/9);
				kirjoita("lyhemmältä matkalta",$("canvas").width()/4,420+veriSiirtymaNyt/9);
				kirjoita("0/5 PÄIVITETTY",$("canvas").width()/4,444+veriSiirtymaNyt/9,true,12,"gray");

				game().drawImage(kiilto[0],$("canvas").width()/4*2-96,192+veriSiirtymaNyt/6);
				kirjoita("Bonusta enemmän",$("canvas").width()/4*2,192+veriSiirtymaNyt/6,true);
				kirjoita("Saat enemmän pisteitä",$("canvas").width()/4*2,396+veriSiirtymaNyt/6);
				kirjoita("bonusmittarin täyttyessä",$("canvas").width()/4*2,420+veriSiirtymaNyt/6);
				kirjoita("0/5 PÄIVITETTY",$("canvas").width()/4*2,444+veriSiirtymaNyt/6,true,12,"gray");

				game().drawImage(kiilto[0],$("canvas").width()/4*3-96,192+veriSiirtymaNyt/3);
				kirjoita("Alkupotkaisu",$("canvas").width()/4*3,192+veriSiirtymaNyt/3,true);
				kirjoita("Hanki itsellesi hieman",$("canvas").width()/4*3,396+veriSiirtymaNyt/3);
				kirjoita("etumatkaa pelin alkaessa",$("canvas").width()/4*3,420+veriSiirtymaNyt/3);
				kirjoita("0 METRIÄ",$("canvas").width()/4*3,444+veriSiirtymaNyt/3,true,12,"gray");

				game().textAlign="end";
				kirjoita("Aloita peli ➧",$("canvas").width()-64+(Math.sin(pelaaNo)*4),520,true,32,"#47A94B");
				game().textAlign="start";
				veriSiirtyma=0;
				kirjoita("← Takaisin",64,512,false);
			}
			if(tila==2){
				kirjoita(tavoitteet[tavoiteNo].nimi,256,192,true,24);
				kirjoita(tavoitteet[tavoiteNo].kuvaus,256,224,false,20);
				if(tavoitteet[tavoiteNo].vaatimus()>=1){
					var mitaliSin = (Math.sin(pelaaNo/10)*10)-(Math.PI/2); // Mitali nauhoineen heiluu siniaallon mukaan
					kirjoita(tehty,256,288,true,20,"#47A94B");
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
			}
			if(tila==3){
				kirjoita("Tilastot",64,128,true,64);

				kirjoita("ENNÄTYSMATKA",64,160,true,12);
				kirjoita(pad(parhaatPisteet,8),64,192,true,32);
				kirjoita("m",256,192,false,24);

				kirjoita("YHTEENLASKETTU MATKA",64,224,true,12);
				kirjoita(pad(kokoMatka,8),64,256,true,32);
				kirjoita("m",256,256,false,24);

				kirjoita("PELATUT PELIT",64,288,true,12);
				kirjoita(pad(tavoiteData[3],8),64,320,true,32);

				kirjoita("KESKIMÄÄRÄINEN MATKA/PELI",64,352,true,12);
				kirjoita(pad(Math.round(kokoMatka/tavoiteData[3]),8),64,384,true,32);
				kirjoita("m",256,384,false,24);

				kirjoita("← Takaisin",64,512,false);
			}
			if(tila==4){
				kirjoita("Tietoja",64,128,true,64);
				kirjoita("Tekijät >",64,192);
				kirjoita("Pelin versionumero:",64,360,true);
				kirjoita(versioId,64,384,false,16,"#FFF","Courier New");
				kirjoita("← Takaisin",64,512,false);
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
			game().globalAlpha=0.5;
			kirjoita(versioId.substring(0,8),8,$("canvas").height()-8,false,10,"#FFF","Courier New");
			game().globalAlpha=1;
		}
		if(virheLadatessa){
			game().fillStyle="#400000";
			game().fillRect(0,0,960,576);
			game().textAlign="center";
			game().beginPath();
			game().moveTo(0,224);
			game().lineTo($("canvas").width(),224);
			game().lineWidth = 2;
			game().strokeStyle="#FFF";
			game().stroke();
			kirjoita("V I R H E   L A T A U K S E S S A",$("canvas").width()/2,256,true,12);
			kirjoita(virheTiedosto,$("canvas").width()/2,384,true,12,"#808080");
			game().textAlign="start";
		}else{
			if(ladatutTiedostot<kaikkiTiedostot){
				game().fillStyle="#000";
				game().fillRect(0,0,960,576);
				game().textAlign="center";
				game().beginPath();
				game().moveTo(0,224);
				game().lineTo($("canvas").width(),224);
				game().lineWidth = 2;
				game().strokeStyle="#202020";
				game().stroke();
				game().beginPath();
				game().moveTo(0,224);
				game().lineTo($("canvas").width()/kaikkiTiedostot*ladatutTiedostot,224);
				game().lineWidth = 2;
				game().strokeStyle="#FFF";
				game().stroke();
				kirjoita("L A D A T A A N   H U H T I R U N I A",$("canvas").width()/2,256,true,12);
				kirjoita(ladatutTiedostot+"/"+kaikkiTiedostot,$("canvas").width()/2,384,true,12,"#808080");
				game().textAlign="start";
			}
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
			console.log("Tila "+tila+", posiitio ["+x+","+y+"]");
			if(tila==0){
				navigator.vibrate(100);
				if(y>192 && y<288){
					if(x<128){
						biomi=Math.max(0,biomi-1);
						klikkiAani[0].play();
						alustaMaasto();
						ukkoX=384;
					}
					if(x>$("canvas").width()-128){
						biomi=Math.min(biomiTyypit.length-1,biomi+1);
						klikkiAani[0].play();
						alustaMaasto();
						ukkoX=384;
					}
				}
				if(y>448){
					if(x>=48 && x<176){ // Siirry tavoitteet-sivulle
						tavoiteNo=0;
						tila=2;
						klikkiAani[0].play();
					}
					if(x>=176 && x<272){ // Siirry pelitilastoihin
						tila=3;
						klikkiAani[0].play();
					}
					if(x>=272 && x<384){ // Siirry tietoja-sivulle
						tila=4;
						klikkiAani[0].play();
					}
					if(x>=608){ 
						if(elvytettavissa && rahat >= 100*Math.pow(2,pelikerrat)){ // Elvytä ja jatka peliä
							//tavoiteData[1]=true;
							if(! inaktiivinenMenu){
								if(osta(100*Math.pow(2,pelikerrat))){
									inaktiivinenMenu=true;
									pelaajaNopeus=0;
									setTimeout(function(){
										veriSiirtyma=320;
										vihuSiirtyma=256;
										hengissa=true;
										pelaajaNopeus=10;
										tausta[0].volume=1;
										suojakilpi+=3;
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
							}
						}else{
							klikkiAani[0].play();
							if(omatKentat[biomi]){
								tila=1;
							}else{
								if(osta(100*Math.pow(2,biomi))){
									omatKentat[biomi]=true;
									localStorage.omatKentat=JSON.stringify(omatKentat);
									tila=1;
								}
							}
						}
					}
				}
		}else if(tila==1){
			navigator.vibrate(100);
			if(y>448){
				if(x>=48 && x<256){ // Siirry takaisin
					tila=0;
					veriSiirtyma=320;
					klikkiAani[0].play();
				}
				if(x>=608){ 
					veriSiirtyma=320;
					if(! inaktiivinenMenu){ // Aloita uusi peli
						klikkiAani[0].play();
						alustaMaasto();
						vihuSiirtyma=512;
						pelaajaNopeus=10;
						huuto[0].play();
						hengissa=true;
						matka=0;
						bonusMatka=0;
						tausta[0].volume=1;
						suojakilpi=3;
						pelikerrat=0;
						navigator.vibrate(1000);
						if(!omatKentat[biomi]){
							if(osta(100*Math.pow(2,biomi))){
								omatKentat[biomi]=true;
							}else{
								vihuSiirtyma=95;
								hengissa=false;
							}
						}
						matka+=parseInt(buusti);
						buusti=0;
					}
				}
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
		}else if(tila==3){ // Tilastomenu
			if(y>448){ // Takaisin valikkoon
				tila=0;
				klikkiAani[0].play();
			}
		}else if(tila==4){ // Tietoja-menu
			if(y>448){ // Takaisin valikkoon
				tila=0;
				klikkiAani[0].play();
			}else{
				document.location="pages/authors.html";
			}
		}
		}
	}).mousemove(function(e){
		var x = Math.floor(e.pageX-$("canvas").offset().left);
		var y = Math.floor(e.pageY-$("canvas").offset().top);
		if(y<$("canvas").height()*.8){
			if(hengissa && !tauko){
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
	}).dblclick(function(){
		if(hengissa && bonusMatka >= maxBonusMatka){
			matka+=50;
			bonusMatka=0;
			maksuAani[0].play();
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
			if(suojakilpi<=5){
				game().globalAlpha=Math.random();
			}else{
				game().globalAlpha=0.25;
			}
		}
		if(hyppy){
			game().drawImage(ukko[asteluku][i],x-24,y-24,240,240);
		}else{
			try{
				game().drawImage(ukko[asteluku][i],x,y);
			}catch(e){
				console.log("Kuvan piirto feilas. Asteluku: "+asteluku+" I: "+i);
			}
		}
		/*game().save();
		game().translate(ukkoX+96, ukkoY+96);
		game().rotate(Math.PI * 0.001);
		game().translate(-(ukkoX+96), -(ukkoY+96));
		game().drawImage(ukko[0][i],x,y);
		game().reset();*/
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
			alert("Voi ei, rahasi ei riitä tähän ostokseen!\nTarvitset "+Math.floor(hinta-rahat)+" (HR) lisää ostaaksesi tämän.");
			return false;
		}
	}
});
