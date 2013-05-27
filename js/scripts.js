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
	
	var canvas = $("canvas")[0];

	if(canvas.getContext && navigator.userAgent.indexOf("Firefox") == -1){
		document.location="pages/unsupported.html";
	}

	var ctx = canvas.getContext("2d");

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

	var ukko = [
		lataaKuvat("ukko/0a",2),	// 0a
		lataaKuvat("ukko/45a",2),	// 45a
		lataaKuvat("ukko/90a",2),	// 90a
		lataaKuvat("ukko/-45a",2),	//-45a
		lataaKuvat("ukko/-90a",2)	//-90a
	];

	var tieRisteys = lataaKuvat("maasto/risteys",4);
	var tieSuoraan = lataaKuvat("maasto/tiesuoraan",10);
	var tieVasemmalle = lataaKuvat("maasto/kaannosv",6);
	var tieOikealle = lataaKuvat("maasto/kaannoso",7);
	var taustaKuva = lataaKuvat("maasto/tausta",12);
	var tieVaakaan = lataaKuvat("maasto/tievaaka",5);
	var tieOikeaYlos = lataaKuvat("maasto/kaannosoy",4);
	var tieVasenYlos = lataaKuvat("maasto/kaannosvy",4);
	var varjo = lataaKuvat("varjo",0);
	var kolikkoKuva = lataaKuvat("kolikko",0);
	var veri = lataaKuvat("veri",0);
	var placeholder = lataaKuvat("mitalit/placeholder",0);
	var mitalit = lataaKuvat("mitalit/",4);
	var mitalinauha = lataaKuvat("mitalit/mitalinauha",0);
	var palkki = lataaKuvat("palkki",0);
	var kiilto = lataaKuvat("kiilto",0);
	var hyppyKuva = lataaKuvat("hyppy",0);
	var facebook = lataaKuvat("facebook",1);
	
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
	var loppuAani = lataaAanet("end",0);
	var pisteytysAani = lataaAanet("coins",0);

	tausta[0].loop=true;
	tausta[0].play();

	menuMusiikki[0].loop=true;
	menuMusiikki[0].play();

	korkeaAani[0].loop=true;
	korkeaAani[0].volume=0;
	korkeaAani[0].play();

	var tila = 0;

	var hiiriAlasX = 0;
	var x,y = 0;

	var versioId = ""; // Muuttuu automaattisesti
	$.ajax({url:".git/refs/heads/master",success:function(resp){versioId=resp;}});

	var suojakilpi = 4000;
	var suojakilpiTeho = 0.1;
	var hengissa = false;
	var ukkoToleranssi = 40;
	var pelikerrat=0;

	var maxBonusMatka = 50;
	var tieMuutos = 0;

	var pingPongNX = -16;
	var pingPongNY = -16;
	var pingPongX = 256;
	var pingPongY = 256;
	var pingPongVY = 64;
	var pingPongVTY = 128;

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
		[0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,3,4,4,4,5],
		[1,2],
		[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,11,12], // 2 % todennäköisyys olla muu kuin normaali meri
		[7,8],
		[9,9,9,10]
	];
	var biomiTieSuoraanKuvat = [
		[0,0,0,4],
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
		[4,4,4,4,5,6]
	];
	var biomiTieOikKuvat = [
		[2],
		[0,1],
		[3],
		[4],
		[5,5,5,5,6,7]
	];

	var inaktiivinenMenu = false;
	var tavoiteX = 0;	
	var hyppy = false;
	var kokoMatka = 0;

	var kolikot = [];

	var pisteytetaan=false;
	
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
	var veriSiirtyma = 384;
	var veriSiirtymaNyt = 384;

	var vihu = lataaKuvat("vihu", 4);
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

    function jatkaTieRisteykseen(ind){
		// Täytetään maastografiikka
		for (var i=0; i<5; i++){
			maasto[i][0] = taustaKuva[biomiKuvat[biomi][Math.floor(Math.random()*biomiKuvat[biomi].length)]];
		}

        // Arvo, kuinka kauas mennään oikeaan/vasempaan, eli arvotaan indeksi, jossa käännytään ylös
        ylos = Math.floor(Math.random()*5);

		// Estä uuden indeksin olemasta sama kuin nykyinen
		while(ylos == ind){ 
			ylos = Math.floor(Math.random()*5);
		}

		// Täytä välit tiellä
		if(ylos>ind){ // Risteys oikea
        	maasto[ylos][0] = tieOikeaYlos[biomiTieOYKuvat[biomi][Math.floor(Math.random()*biomiTieOYKuvat[biomi].length)]];
			for (var i=0; i<ylos; i++){
				maasto[i][0] = tieVaakaan[biomiTieVaakaanKuvat[biomi][Math.floor(Math.random()*biomiTieVaakaanKuvat[biomi].length)]];
				maastomuoto[i][0] = 1;
			}
		}else{ // Risteys vasen
			maasto[ylos][0] = tieVasenYlos[biomiTieVYKuvat[biomi][Math.floor(Math.random()*biomiTieVYKuvat[biomi].length)]];
			for (var i=4; i>ylos; i--){
				maasto[i][0] = tieVaakaan[biomiTieVaakaanKuvat[biomi][Math.floor(Math.random()*biomiTieVaakaanKuvat[biomi].length)]];
				maastomuoto[i][0] = 1;
			}
		}

		// Aseta risteyksen kuva oikeaan kohtaan
        maasto[ind][0] = tieRisteys[biomi];

        return ylos;
    }

    function jatkaTieVasempaan(ind){
        //Arvotaan, kuinka kauas mennään vasempaan, eli arvotaan indeksi, jossa vasemmalta käännytään ylös
        ylos = Math.floor(Math.random()*(ind-1)); // Kuten järkikin sanoo, uusi arvottu indeksi (X-posiitio) on siis aina pienempi kuin nykyinen indeksi

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

		var iTausta = [0, 1, 2, 3, 4];
		iTausta.splice(ind,1);
		for(var i in iTausta){
			maasto[iTausta[i]][0] = taustaKuva[biomiKuvat[biomi][Math.floor(Math.random()*biomiKuvat[biomi].length)]];
			maastomuoto[iTausta[i]][0]=0;
		}

		return ind;
    }

	var ukkoLiikkuuX = 0;
	var siirtoY = 0;	
	setInterval(paivita,50);

	function kirjoita(teksti,tekstiX,tekstiY,lihavoitu,fonttikoko,vari,fontti){
		
		tekstiX = tekstiX || 0;
		tekstiY = tekstiY || 0;
		lihavoitu = lihavoitu || false;
		fonttikoko = fonttikoko || 16;
		vari = vari || "#FFF";
		fontti = fontti || "sans-serif";
		
		ctx.fillStyle = "#000";
		if(lihavoitu){
			ctx.font = "bold "+fonttikoko+"px "+fontti+",sans-serif";
		}else{
			ctx.font = fonttikoko+"px "+fontti+",sans-serif";
		}
		ctx.fillText(teksti,tekstiX+1,tekstiY+1);
		if(inaktiivinenMenu){
			ctx.fillStyle = "#C0C0C0";
		}else{
			ctx.fillStyle = vari;
		}
		ctx.fillText(teksti,tekstiX,tekstiY);
	}
	
	//Hoitaa kaiken päivityksen 
	function paivita(){
		//ukkoToleranssi=24+Math.min(0,24-24/50*matka);

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
			menuMusiikki[0].volume=Math.max(0,menuMusiikki[0].volume-0.02);
		}else{
			korkeaAani[0].volume=0;
			if(!elvytettavissa){
				menuMusiikki[0].volume=Math.min(1,menuMusiikki[0].volume+0.02);
			}else{
				menuMusiikki[0].volume=Math.min(0.5,menuMusiikki[0].volume+0.02);
			}
			tausta[0].volume=Math.max(0,tausta[0].volume-0.02);
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
		piirraHyppyNappi();
		
		// Pelaajan ohjauskomennot
		$("html").keyup(function(e){
			//e.preventDefault();
			if(e.keyCode==32){
				if(!hyppy){
					hyppyAani[0].play();
					hyppy=true;
					setTimeout(function(){
						hyppy=false;
					},500);
				}
			}else if(e.keyCode==27){
				if(tauko){
					tauko=false;
				}else{
					tauko=true;
				}
			}
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
		if(suojakilpi>0){
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

			var ukonRuutu = Math.max(1,Math.min(4,Math.round(ukkoX/192)));
		
			if(maasto[ukonRuutu][1]==tieSuoraan[1] || maasto[ukonRuutu][1]==tieSuoraan[4] || maasto[ukonRuutu][1]==tieSuoraan[8]){
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
			ctx.textAlign="center";
			var keskiosa = {"x":$("canvas").width()/2,"y":$("canvas").height()/2};
			kirjoita("Tauolla",keskiosa.x,keskiosa.y,true,48);
			ctx.textAlign="start";
		}else{
			siirtoY+=pelaajaNopeus;
		}

		$.each(kolikot,function(i,v){
			var kolikkoY = (matka-v[1])*192+siirtoY-48;
			ctx.drawImage(kolikkoKuva[0],v[0],kolikkoY);
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
				tieMuutos += 1;
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
			if(tieMuutos>1){
				if (tie == 0){
					//Vasen reuna: ylös tai oikealle
					if(Suunta < 0.75){ //Oikealle
						tie = jatkaTieOikeaan(tie);
						tieMuutos=0;
					}else{ //Ylös
						tie = jatkaTieYlos(tie);
					}
				}else if (tie==4){
					//Oikea reuna; ylös tai vasemmalle
					if(Suunta < 0.75){ //Vasemmalle
						tie = jatkaTieVasempaan(tie);
						tieMuutos=0;
					}else{ //Ylös
						tie = jatkaTieYlos(tie);
					}
				}else{
					//Tie on oikean ja vasemman reunan välissä
					if (Suunta < 0.3){ // Vasemmalle
						tie = jatkaTieVasempaan(tie);
						tieMuutos=0;
					}else if(Suunta < 0.6){ // Oikealle
						tie = jatkaTieOikeaan(tie); 
						tieMuutos=0;
					}else if(Suunta < 0.75){ // Risteys
						tie = jatkaTieRisteykseen(tie);
						tieMuutos=0;
					}else{ // Ylös
						tie = jatkaTieYlos(tie);
					}
				}
			}else{
				tie = jatkaTieYlos(tie);
			}

		}

		// Kirjoita matka näytölle 50 metrin välein
		if(hengissa){
			var pyorista50 = Math.floor(matka/50)*50;
			if(matka >= 50 && matka >= pyorista50 && matka <= pyorista50+5){
				//kirjoita(pyorista50,384,128);
			}
			kirjoita(Math.round(matka),32,48,true,24); // Kirjoita nykyiset pisteet

			if(bonusMatka<maxBonusMatka){
				//kirjoita(Math.min(100,Math.round(100/maxBonusMatka*bonusMatka))+"% bonus",32,64,true,12);

				// Piirrä bonuspalkki vasempaan reunaan
				ctx.beginPath();
				ctx.strokeStyle="transparent";
				ctx.lineWidth = 0;
				ctx.rect(32,128,16,256);
				ctx.fillStyle = "rgba(0,0,0,.5)";
				ctx.fill();
				ctx.strokeStyle="rgba(0,0,0,.25)";
				ctx.stroke();

				ctx.beginPath();
				ctx.strokeStyle="transparent";
				ctx.lineWidth = 0;
				var pylvasK = Math.min(256,Math.round(256/maxBonusMatka*bonusMatka));
				ctx.rect(32,256-pylvasK+128,16,pylvasK);
				ctx.fillStyle = "gold";
				ctx.fill();
			}else{
				bonusMatka=maxBonusMatka;
				if(matka%2){
					kirjoita("Kaksoisnapsauta saadaksesi bonuksen!",96,192,true,12,"gold");
				}

				// Piirrä bonuspalkki vasempaan reunaan
				ctx.beginPath();
				ctx.strokeStyle="transparent";
				ctx.lineWidth = 0;
				ctx.rect(32,128,16,256);
				ctx.fillStyle = "#47A94B";
				ctx.fill();
			}
			// Piirrä heijastus/kiilto
			ctx.beginPath();
			ctx.strokeStyle="transparent";
			ctx.lineWidth = 0;
			ctx.rect(32,128,8,256);
			ctx.fillStyle = "rgba(255,255,255,.1)";
			ctx.fill();
		}
		
		// Varjo
		//ctx.fillStyle="rgba(0,0,0,.2)";

		if(vihuSiirtyma<192 && hengissa){
			ctx.textAlign="center";
			var keskiosa = {"x":$("canvas").width()/2,"y":$("canvas").height()/2};
			kirjoita("♥",keskiosa.x,keskiosa.y,true,Math.ceil(Math.random()*32)+64,"red");
			kirjoita("Olet hengenvaarassa",keskiosa.x,keskiosa.y+32,true,16,"red");
			ctx.textAlign="start";
		}

		if(biomi==3){
			tummuus += .005;
			tummuus = Math.min(tummuus,.7);
			ctx.fillStyle="rgba(0,0,0,"+Math.min(tummuus,.7)+")";
			ctx.fillRect(0,0,960,576);
		}else{
			tummuus -= .02;
			if(tummuus>0){
				ctx.fillStyle="rgba(0,0,0,"+Math.min(tummuus,.7)+")";
				ctx.fillRect(0,0,960,576);
			}
			tummuus = Math.max(tummuus,0);
		}

		pelaajaNopeus=10+Math.round(0.01*matka); // Peli vaikenee, mitä pitemmälle pääsee
		
		// Kun vihu saa pelaajan kiinni, mene päävalikkoon
		if(vihuSiirtyma<96){
			if(elvytettavissa){
				pelaajaNopeus=0;
			}else{
				pelaajaNopeus=7.5;
			}
			suojakilpi=0;
		
			if(hengissa){
				pisteytetaan=false;
				tila=0;
				veriSiirtyma=384;
				navigator.vibrate(1000);
				hengissa=false;
				suojakilpi=0;
				pisteytys=matka;
				dramaattinen[0].play();
				//kolikot=[];
				if(matka >= 5){
					rahat += matka;
					kokoMatka += matka;
					elvytettavissa=true;
					tavoiteData[3]=parseFloat(tavoiteData[3])+1;
				}
				setTimeout(function(){
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
					pisteytetaan=true;
					pisteytysAani[0].currentTime=0;
					pisteytysAani[0].play();
				},1500);
			}else{
				if(pisteytetaan){
					if(pisteytys>2.5){
						pisteytys -= pisteytys / 10;
					}else{
						pisteytysAani[0].pause();
						loppuAani[0].play();
						pisteytetaan=false;
						setTimeout(function(){
							
							elvytettavissa=false;
							alustaMaasto();
						},3000);
					}
				}
			}

			tummuus=0.25;
		
			ctx.fillStyle="rgba(128,0,0,.9)";
			ctx.fillRect(0,352+veriSiirtymaNyt-192,960,576);

			for(i=0;i<20;i++){
				ctx.drawImage(veri[0],96*i,352+veriSiirtymaNyt-96-192,96,96);
				ctx.drawImage(palkki[0],96*i,96,96,96);
			}

			ctx.fillStyle="rgba(0,0,0,.25)";
			ctx.fillRect(0,0,960,96);
			
			// Aseta vihu pelaajan alle
			vihuSiirtyma=95;
			
			if(tila==0){
				if((elvytettavissa || pisteytetaan) && matka >= 5){
					ctx.textAlign="center";
					if(pisteytys>2.5){
						kirjoita(Math.round(pisteytys),$("canvas").width()/2,256,true,64);
						ctx.drawImage(kolikkoKuva[0],416,256+8,24,24);
						kirjoita(Math.round(rahat-pisteytys),$("canvas").width()/2,288,true);
					}else{
						ctx.drawImage(kolikkoKuva[0],256,192+8,64,64);
						kirjoita(rahat,$("canvas").width()/2,256,true,64);
					}
					ctx.textAlign="start";
					kirjoita("Ohita",64,512,false);
					if(elvytettavissa){
						kirjoita("Elvytä ➧",640,512,true,32);
						kirjoita(100*Math.pow(2,pelikerrat),670,536,false);
						ctx.drawImage(kolikkoKuva[0],640,520,24,24);
					}
				}else{
					// Piirrä alamenun vaihtoehdot
					kirjoita("Tavoitteet",64,512,false);
					kirjoita("Tilastot",192,512,false);
					kirjoita("Tietoja",320,512,false);

					// Piirrä kentänvalitsimet
					ctx.textAlign="center";
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
					ctx.textAlign="start";
				}
				if(omatKentat[biomi]){
					if(!elvytettavissa){
						ctx.textAlign="end";
							kirjoita("Uusi peli ➧",$("canvas").width()-64,520,true,32,"#47A94B");
						ctx.textAlign="start";
					}
				}else{
					ctx.textAlign="end";
						kirjoita("Osta kenttä ➧",$("canvas").width()-64,512,true,32,"#47A94B");
					ctx.textAlign="start";
					kirjoita(100*Math.pow(2,biomi),670,536,false);
					ctx.drawImage(kolikkoKuva[0],640,520,24,24);
				}
				ctx.textAlign="center";
				kirjoita("Valitse mieleisesi kenttä ja juokse!",$("canvas").width()/2,144,true,16,"#FFF","'Source Sans Pro'");
				ctx.textAlign="end";
				ctx.drawImage(facebook[0],$("canvas").width()-146,0);
				ctx.drawImage(facebook[1],$("canvas").width()-100,24-(Math.sin(pelaaNo)*3));
				kirjoita("Tykkää meistä",$("canvas").width()-22,120,true,18,"#FFF","'Source Sans Pro'");
				ctx.textAlign="start";
			}
			if(tila==0 || tila==1){
				if(!elvytettavissa){
					// Näytä rahatilanne vasemmassa yläkulmassa
					ctx.drawImage(kolikkoKuva[0],24,24,24,24);
					kirjoita(Math.round(tuhaterotin(rahat)),64,40,true);
				}

				// Kirjoita otsikko
				ctx.textAlign="center";
				kirjoita("HuhtiRun",$("canvas").width()/2,112,true,64,"#FFF","'Fondamento'");
				kirjoita("TM",$("canvas").width()*0.675,80,true,16);
				ctx.textAlign="start";
			}
			if(tila==1){
				ctx.textAlign="center";
				kirjoita("Halutessasi voit ostaa power-upeja ennen peliä",$("canvas").width()/2,144,true,12,"gold");

				ctx.drawImage(kiilto[0],$("canvas").width()/4-96,192+veriSiirtymaNyt/9);
				kirjoita("Bonusta nopeammin",$("canvas").width()/4,192+veriSiirtymaNyt/9,true);
				kirjoita("Bonusmittari täyttyy",$("canvas").width()/4,396+veriSiirtymaNyt/9);
				kirjoita("lyhemmältä matkalta",$("canvas").width()/4,420+veriSiirtymaNyt/9);
				kirjoita("0/5 PÄIVITETTY",$("canvas").width()/4,444+veriSiirtymaNyt/9,true,12,"gray");

				ctx.drawImage(kiilto[0],$("canvas").width()/4*2-96,192+veriSiirtymaNyt/6);
				kirjoita("Bonusta enemmän",$("canvas").width()/4*2,192+veriSiirtymaNyt/6,true);
				kirjoita("Saat enemmän pisteitä",$("canvas").width()/4*2,396+veriSiirtymaNyt/6);
				kirjoita("bonusmittarin täyttyessä",$("canvas").width()/4*2,420+veriSiirtymaNyt/6);
				kirjoita("0/5 PÄIVITETTY",$("canvas").width()/4*2,444+veriSiirtymaNyt/6,true,12,"gray");

				ctx.drawImage(kiilto[0],$("canvas").width()/4*3-96,192+veriSiirtymaNyt/3);
				kirjoita("Alkupotkaisu",$("canvas").width()/4*3,192+veriSiirtymaNyt/3,true);
				kirjoita("Hanki itsellesi hieman",$("canvas").width()/4*3,396+veriSiirtymaNyt/3);
				kirjoita("etumatkaa pelin alkaessa",$("canvas").width()/4*3,420+veriSiirtymaNyt/3);
				kirjoita("0 METRIÄ",$("canvas").width()/4*3,444+veriSiirtymaNyt/3,true,12,"gray");

				ctx.textAlign="end";
				kirjoita("Aloita peli ➧",$("canvas").width()-64,520,true,32,"#47A94B");
				ctx.textAlign="start";
				veriSiirtyma=0;
				kirjoita("← Takaisin",64,512,false);
			}
			if(tila==2){
				kirjoita(tavoitteet[tavoiteNo].nimi,256,192,true,24);
				kirjoita(tavoitteet[tavoiteNo].kuvaus,256,224,false,20);
				if(tavoitteet[tavoiteNo].vaatimus()>=1){
					var mitaliSin = (Math.sin(pelaaNo/10)*10)-(Math.PI/2); // Mitali nauhoineen heiluu siniaallon mukaan
					kirjoita(tehty,256,288,true,20,"#47A94B");
					ctx.drawImage(mitalinauha[0],-64+(mitaliSin+(mitaliSin/4)/2),-32);
					ctx.drawImage(mitalit[tavoiteNo],64+mitaliSin/2,176);
					/*ctx.drawImage(mitalinauha[0],-64,-32);
					ctx.drawImage(mitalit[tavoiteNo],64,176);*/
				}else{
					kirjoita(Math.round(tavoitteet[tavoiteNo].vaatimus()*100) + " % suoritettu",256,288,false,20,"silver");
					ctx.drawImage(placeholder[0],64,176,128,128);
				}
				
				ctx.textAlign="end";
				kirjoita("Seuraava 〉",$("canvas").width()-64,512);
				kirjoita("Tavoitteista on suoritettu "+Math.round(kokonaisSuoritus*100)+" %",$("canvas").width()-64,128,true);
				ctx.textAlign="center";
				kirjoita("Takaisin valikkoon",$("canvas").width()/2,512);
				ctx.textAlign="start";
				kirjoita("〈 Edellinen",64,512);
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
			ctx.fillStyle="#000";
			ctx.fillRect(oikeaReuna-12,12,12,24);
			ctx.fillRect(oikeaReuna-30,12,12,24);
			ctx.fillStyle="#FFF";
			ctx.fillRect(oikeaReuna-13,13,12,24);
			ctx.fillRect(oikeaReuna-31,13,12,24);
		}else{
			ctx.globalAlpha=0.5;
			kirjoita(versioId.substring(0,8),8,$("canvas").height()-8,false,10,"#FFF","Courier New");
			ctx.globalAlpha=1;
		}
		if(virheLadatessa){
			ctx.fillStyle="#400000";
			ctx.fillRect(0,0,960,576);
			ctx.textAlign="center";
			ctx.beginPath();
			ctx.moveTo(0,224);
			ctx.lineTo($("canvas").width(),224);
			ctx.lineWidth = 2;
			ctx.strokeStyle="#FFF";
			ctx.stroke();
			kirjoita("V I R H E   L A T A U K S E S S A",$("canvas").width()/2,256,true,12);
			kirjoita(virheTiedosto,$("canvas").width()/2,384,true,12,"#808080");
			ctx.textAlign="start";
		}else{
			if(ladatutTiedostot<kaikkiTiedostot){
				ctx.fillStyle="#000";
				ctx.fillRect(0,0,960,576);
				ctx.textAlign="center";
				ctx.beginPath();
				ctx.moveTo(0,512);
				ctx.lineTo($("canvas").width(),512);
				ctx.lineWidth = 3;
				ctx.strokeStyle="#202020";
				ctx.stroke();

				ctx.moveTo(0,64);
				ctx.lineTo($("canvas").width(),64);
				ctx.lineWidth = 3;
				ctx.strokeStyle="#202020";
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(0,512);
				ctx.lineTo($("canvas").width()/kaikkiTiedostot*ladatutTiedostot,512);
				ctx.lineWidth = 3;
				ctx.strokeStyle="#808080";
				ctx.stroke();

				kirjoita("L A D A T A A N   " + Math.round(100/kaikkiTiedostot*ladatutTiedostot)+"   %",$("canvas").width()/2,512+24,true,12,"#808080");
				ctx.textAlign="start";

				/*kirjoita("O D O T T A E S S A S I   P E L I N   L A T A U T U M I S T A   V O I T   P E L A T A   P I N G - P O N G I A",$("canvas").width()/2,48,true,12,"#808080");
				kirjoita("L A D A T A A N   " + Math.round(100/kaikkiTiedostot*ladatutTiedostot)+"   %",$("canvas").width()/2,512+24,true,12,"#808080");
				ctx.textAlign="start";

				ctx.beginPath();
				ctx.moveTo(32,Math.round((y-48)/16)*16);
				ctx.lineTo(32,Math.round((y+48)/16)*16);
				ctx.lineWidth = 16;
				ctx.strokeStyle="#FFF";
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo($("canvas").width()-32,Math.round((pingPongVY-48)/2)*2);
				ctx.lineTo($("canvas").width()-32,Math.round((pingPongVY+48)/2)*2);
				ctx.lineWidth = 16;
				ctx.strokeStyle="#FFF";
				ctx.stroke();

				ctx.beginPath();
				ctx.rect(pingPongX,pingPongY,16,16);
				ctx.fillStyle = "#FFF";
				ctx.fill();

				pingPongX += pingPongNX;
				pingPongY += pingPongNY;
				pingPongX = Math.max(pingPongX,32);
				pingPongX = Math.min(pingPongX,$("canvas").width()-32);

				if(pingPongX <= 32 || pingPongX >= $("canvas").width()-32){
					pingPongX -= pingPongNX;
					pingPongNX = -pingPongNX;
				}
				if(pingPongY <= 64 || pingPongY >= 512){
					pingPongY -= pingPongNY;
					pingPongNY = -pingPongNY;
				}
				if(pingPongX>$("canvas").width()/2){
					pingPongVTY = pingPongY-48;
				}else{
					pingPongVTY = 256+Math.sin(pelaaNo)*100;
				}
				if(pingPongVTY != pingPongVY){
					if(pingPongVTY > pingPongVY){
						pingPongVY += Math.abs(pingPongVY-pingPongVTY)/8;
					}else{
						pingPongVY -= Math.abs(pingPongVY-pingPongVTY)/8;
					}
				}*/
			}
		}
	}

	$("canvas").mousedown(function(e){
		e.preventDefault();
		x = Math.floor(e.pageX-$("canvas").offset().left);
		y = Math.floor(e.pageY-$("canvas").offset().top);
		hiiriAlasX=x;
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
				if(y<146){
					if(x>$("canvas").width()-146){
						window.location="https://facebook.com/HuhtiRun";
					}
				}
				if(y>146 && y<288){
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
					if(x>=48 && x<176 && !elvytettavissa){ // Siirry tavoitteet-sivulle
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
										veriSiirtyma=384;
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
					veriSiirtyma=384;
					klikkiAani[0].play();
				}
				if(x>=608){ 
					veriSiirtyma=384;
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
						suojakilpi+=3;
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
		if(elvytettavissa){
			if(x>=48 && x<176 && y>448){
				tila=0;
				elvytettavissa=false;
			}
		}
	}).mouseup(function(e){
		e.preventDefault();
		x = Math.floor(e.pageX-$("canvas").offset().left);
		y = Math.floor(e.pageY-$("canvas").offset().top);
		var hiiriSiirtymaX = Math.abs(hiiriAlasX-x);
		if(hiiriSiirtymaX>256){
			if(x < hiiriAlasX){
				biomi=Math.min(biomiTyypit.length-1,biomi+1);
			}else{
				biomi=Math.max(0,biomi-1);
			}
			klikkiAani[0].play();
			alustaMaasto();
			ukkoX=384;
		}
	}).mousemove(function(e){
		x = Math.floor(e.pageX-$("canvas").offset().left);
		y = Math.floor(e.pageY-$("canvas").offset().top);
		if(ladatutTiedostot<kaikkiTiedostot){

		}else{
			if(y<$("canvas").height()*.8){
				if(hengissa && !tauko && suojakilpi<=2){
					tavoiteX=x-96;
				}
			}else{
				if(hengissa){
					if(!hyppy){
						hyppyAani[0].play();
						hyppy=true;
						setTimeout(function(){
							hyppy=false;
						},500);
					}
				}
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
				ctx.drawImage(maasto[i][j], i*192, (j-1)*192 + siirtoY);
			}
		}
	}
		
	function piirraVarjo(){
		if(hyppy && hengissa){
			ctx.drawImage(varjo[0],ukkoX+48,ukkoY+96);
		}
	}
	
	function piirraVihu(i,x,y){
		if(hengissa || elvytettavissa){
			ctx.drawImage(vihu[i],x,y);
		}
	}
	
	function piirraHyppyNappi(){
		if(hengissa){
			if(hyppy){
				ctx.drawImage(hyppyKuva[0],64,$("canvas").height()-64,64,32);
			}else{
				ctx.drawImage(hyppyKuva[0],64,$("canvas").height()-96);
			}
		}
	}
	
	function piirraUkko(i,x,y){
		if(hengissa || (!hengissa && !elvytettavissa)){
			if(suojakilpi>0){
				if(suojakilpi<=5){
					ctx.globalAlpha=Math.random();
				}else{
					ctx.globalAlpha=0.25;
				}
			}
			if(hyppy){
				ctx.drawImage(ukko[asteluku][i],x-24,y-24,240,240);
			}else{
				try{
					ctx.drawImage(ukko[asteluku][i],x,y);
				}catch(e){
					console.log("Kuvan piirto feilas. Asteluku: "+asteluku+" I: "+i);
				}
			}
		}
		ctx.globalAlpha=1;
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
