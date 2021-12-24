$(function(){

	console.log("*************************\n* HuhtiRun              *\n*************************");

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

	// Estää pelin pelaamisen huonoilla ja bugisilla selaimilla
	if(navigator.userAgent.indexOf("Firefox") == -1){
		document.location="pages/unsupported.html";
	}
	
	var canvas = $("canvas")[0];
	var ctx = canvas.getContext("2d");

	hidasLataus=false;
	tunnistaHidasLatautuminen = setTimeout(function(){},1);

	function lataaKuvat(nimi, nmax){
		var taulu = [];
		for(var i=0;i<=nmax;i++){
			var img = new Image();
			img.onload=function(){
				ladatutTiedostot++;
				// Jos yksikään kuva ei lataudu kymmenen sekunnin sisällä, ilmoita käyttäjälle hitaasta latautumisesta
				clearTimeout(tunnistaHidasLatautuminen);
				tunnistaHidasLatautuminen = setTimeout(function(){
					hidasLataus=true;
				},10000);
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
			snd.oncanplaythrough=function(){
				ladatutTiedostot++;
			};
			snd.src="snd/"+nimi+i+".wav";
			snd.load();
			kaikkiTiedostot++;
			taulu.push(snd);
		}
		return taulu;
	}
	
	var kaikkiTiedostot = 0;
	var ladatutTiedostot = 0;
	var virheTiedosto = "";
	var virheLadatessa = false;

	// Kuvat ja grafiikka
	var ukko = lataaKuvat("ukko/", 2);
	var vihu = lataaKuvat("vihu/", 3);

	var tieRisteys = lataaKuvat("maasto/risteys",5);
	var tieSuoraan = lataaKuvat("maasto/tiesuoraan",11);
	var tieVasemmalle = lataaKuvat("maasto/kaannosv",7);
	var tieOikealle = lataaKuvat("maasto/kaannoso",8);
	var taustaKuva = lataaKuvat("maasto/tausta",18);
	var tieVaakaan = lataaKuvat("maasto/tievaaka",6);
	var tieOikeaYlos = lataaKuvat("maasto/kaannosoy",5);
	var tieVasenYlos = lataaKuvat("maasto/kaannosvy",5);
	var kyltti = lataaKuvat("maasto/kyltti",0);
	
	var lentavaObjekti = lataaKuvat("maasto/objekti",4);

	var varjo = lataaKuvat("varjo",0);
	var kolikkoKuva = lataaKuvat("kolikko",0);

	var mitalit = lataaKuvat("mitalit/",6);
	var mitalinauha = lataaKuvat("mitalit/mitalinauha",0);
	
	var medikit = lataaKuvat("medikit",0);

	var hyppyKuva = lataaKuvat("hyppy",0);
	var facebook = lataaKuvat("fb",0);

	var kimalle = lataaKuvat("mitalit/kimalle",0);
	
	// Äänet ja musiikki
	var ambientti = lataaAanet("ambient",0);
	var menuMusiikki = lataaAanet("lobby",0);
	var hyppyAani = lataaAanet("jump",0);
	var tausta = lataaAanet("bg",0);
	var dramaattinen = lataaAanet("over",0);
	var auts = lataaAanet("crack",0);
	var korkeaAani = lataaAanet("angels",0);
	var maksuAani = lataaAanet("coin",0);
	var klikkiAani = lataaAanet("select",0);
	var huuto = lataaAanet("scream",0);
	var loppuAani = lataaAanet("end",0);
	var pisteytysAani = lataaAanet("coins",0);
	var bonusAani = lataaAanet("bonus",0);

	// Versionumerointi
	var versioId = ""; // Muuttuu automaattisesti kommitin id:n mukaan
	$.ajax({url:".git/refs/heads/master",success:function(resp){versioId=resp;console.log("Versio "+resp);}});

	latauspalkkiX = 0;	

	tila = 0; // Missä valikossa ollaan

	hiiriAlasX = 0; // X-sijainti, jossa hiiri painettiin alas
	
	x = 0; // Hiiren nykyinen posiitio
	y = 0;

	suojakilpi = 2; // Kertoo kuinka monen "peliruudun" ajan peliukkelilla on suojakilpeä jäljellä
	alkupotkaisu = 0; // Kertoo vastaavalla tavalla, mutta sen sijaan matkan jonka verran hahmolla on alkupotkaisua jäljellä

	hengissa = false; // Kertoo onko hahmo hengissä vai ei

	ukkoToleranssi = 50; // Tällä voit säätää, kuinka paljon peliukkeli saa mennä tien ohi ennen kuin vahingoittuu (px)

	pelikerrat = 0; // Kertoo monesko elvytyskerta, nollautuu kun aloitetaan uusi peli

	maxBonuspisteet = 15; // Bonusmittari tulee täyteen kun hahmo on juossut tämän verran metrejä vahingoittumatta
	
	bonusKerroin = 1;

	tieMuutos = 0; // ?

	ohjausTavat = ["Hiiri/kosketusnäyttö","Näppäimistö"]; // Pelin ohjaamistavat

	asteluku = 0; // Ukon kääntyminen radiaaneissa
	vihuAsteluku = 0; // Vihun kääntyminen radiaaneissa
	
	striikki = 0; // Kuinka monta metriä on päästy täysin vahingoittumatta
	
	tummuus = 1; // Näytön tummuus, joka esimerkiksi luolakentässä on korkeampi

	elvytysRuutu = false; // Onko hahmo elvytettävissä

	kokonaisSuoritus = 0; // Kaikkien tavoitteiden suoritusprosenttien k.a.

	parhaatPisteet = [0,0,0,0,0,0,0,0,0,0]; // Piste-ennätykset
	
	parhaatMatkat = [0,0,0,0,0,0,0,0,0,0]; // Matkaennätykset
	
	pelaaNo = 0; // Tämä luku suurenee jatkuvasti. Mahdollistaa automatisoitujen siniaaltojen luomista.

	omatKentat = [true,false,false,false,false]; // Ostetut kentät
	
	oliRisteys = false; // Oliko edellinen palikka risteyspalikka

	// Tavoitteet
	tavoiteData = [0,0,0,0,0,0,0,0]; // Sisältää tavoitteisiin liittyvää raakadataa
	
	var tavoitteet = [
		{
			nimi:"Lenkkeilijä",
			kuvaus:"Juokse 250 metriä yhden pelin aikana!",
			vaatimus:function(){return 1/250*parhaatMatkat[0];}
		},
		{
			nimi:"Urheilija",
			kuvaus:"Juokse 500 metriä yhden pelin aikana!",
			vaatimus:function(){return 1/500*parhaatMatkat[0];}
		},
		{
			nimi:"Huippu-urheilija",
			kuvaus:"Juokse 750 metriä yhden pelin aikana!",
			vaatimus:function(){return 1/750*parhaatMatkat[0];}
		},
		{
			nimi:"Addikti",
			kuvaus:"Juokse 20 000 metriä koko aikana.",
			vaatimus:function(){return 1/20000*matkaYht;}
		},
		{
			nimi:"Kuolematon",
			kuvaus:"Elvytä itsesi viidesti yhden pelin aikana.",
			vaatimus:function(){return 1/5*tavoiteData[2];}
		},
		{
			nimi:"Rikas",
			kuvaus:"Hanki 20 000 (HR) vähintään kerran.",
			vaatimus:function(){return 1/20000*tavoiteData[0];}
		},
		{
			nimi:"Mestari",
			kuvaus:"Helppo. Kerää kaikki muut tavoitteet.",
			vaatimus:function(){return kokonaisSuoritus;}
		}
	];

	tavoiteNo = 0; // Tavoitteen numero, jota katsotaan Tavoitteet-sivulla
	


	inaktiivinenMenu = false; // Onko valikon painikkeet painettavissa

	tavoiteX = 0; // X-koordinaatti, johon pelihahmo pyrkii pääsemään

	hyppy = false; // Hyppääkö peliukko (ts. onko peliukko ilmassa)

	matkaYht = 0; // Matka jonka pelihahmo koko elinaikanansa on taittanut

	rahat = 0; // Koko omaisuus

	elvytysjuomat = 0; // Montako kertaa hahmo kyetään elvyttämään

	kolikot = []; // Ei käytössä

	pisteytetaan = false; // Juoksevatko numerot elvytysruudussa
	
	x,y = 0;
	
	lentavatObjektit = [
		// [kuva,x,y,liikkumisnopeusX,liikkumisnopeusY,adaptiivinenLiike,asento,pyoriminen,adaptiivinenPyoriminen]
	];
	
	tutoriaaliData = [
		false, // Hyppääminen
		false // Kentän ostaminen
	];
	
	tutoriaali = [
		"Hyppää ansan yli",
		"Osta kenttä"
	];

	asetukset = {
		varina 		: true,
		aani		: true,
		ohjausTapa	: 0
	};

	// Biomit eli kentät
	biomi = 0; // Nykyinen biomi
	biomiTyypit = [
		"Aavikko",
		"Niitty",
		"Meri",
		"Luola",
		"Metsä",
		"Avaruus"
	];
	var biomiVarit = [ // Alapalkissa käytettävä väri
		"d38f46",
		"1d5911",
		"0c7ee2",
		"292a2d",
		"286a22",
		"0e0d2b"
	];
	var biomiKuvat = [ // Taustakuvan numerot, kullekin biomille (esimerkiksi aavikolle arvotaan summamutikassa jokin ensimmäisen rivin taustakuvista)
		[0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,3,4,4,4,5],
		[1,2],
		[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,11,12], // 
		[7,8],
		[9,9,9,10],
		[13,13,13,13,13,14,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,15,18,18,18,18]
	];
	var biomiTieSuoraanKuvat = [
		[0,0,0,0,0,0,1,4],
		[2,2,2,2,2,2,3,5],
		[6],
		[7,7,7,8],
		[9,10],
		[11]
	];
	var biomiTieVaakaanKuvat = [
		[0],
		[1],
		[2],
		[3,3,3,4],
		[5],
		[6]
	];
	var biomiTieVYKuvat = [
		[1],
		[0],
		[2],
		[3],
		[4],
		[5]
	];
	var biomiTieOYKuvat = [
		[0],
		[1],
		[2],
		[3],
		[4],
		[5]
	];
	var biomiTieVasKuvat = [
		[0],
		[1],
		[2],
		[3],
		[4,4,4,4,5,6],
		[7]
	];
	var biomiTieOikKuvat = [
		[2],
		[0,1],
		[3],
		[4],
		[5,5,5,5,6,7],
		[8]
	];

	// Nykyisen pelitallennuksen versionumero
	// TÄRKEÄ! MUUTA AINA YHTÄ ISOMMAKSI, KUN PELITALLENNUSMUOTOON TULEE MUUTOKSIA!
	pelitallennusVersio = 8;

	// Tarkistetaan onko selaimeen tallennettu pelitietoja
	if(parseInt(localStorage.pelitallennusVersio) >= pelitallennusVersio || isNaN(parseInt(localStorage.pelitallennusVersio))){
		if(! isNaN(localStorage.rahat)){
			// Ladataan tallennetut pelitiedot
			console.log("Ladataan tallennettuja pelitietoja...");
			parhaatPisteet	= JSON.parse(localStorage.parhaatPisteet);
			parhaatMatkat	= JSON.parse(localStorage.parhaatMatkat);
			rahat			= parseInt(localStorage.rahat);
			matkaYht		= parseInt(localStorage.matkaYht);
			tavoiteData		= JSON.parse(localStorage.tavoiteData);
			omatKentat		= JSON.parse(localStorage.omatKentat);
			asetukset		= JSON.parse(localStorage.asetukset);
			elvytysjuomat	= parseInt(localStorage.elvytysjuomat);
			biomi			= parseInt(localStorage.valittuKentta);
			tutoriaaliData	= JSON.parse(localStorage.tutoriaali);
			console.log("Pelitietojen lataaminen onnistui!");
		}else{
			// Luodaan uudet pelitiedot mikäli puuttuvat
			console.log("Luodaan uusia pelitietoja...");
			localStorage.parhaatPisteet			= JSON.stringify(parhaatPisteet);
			localStorage.parhaatMatkat			= JSON.stringify(parhaatMatkat);
			localStorage.rahat					= rahat;
			localStorage.matkaYht				= matkaYht;
			localStorage.tavoiteData			= JSON.stringify(tavoiteData);
			localStorage.omatKentat				= JSON.stringify(omatKentat);
			localStorage.asetukset				= JSON.stringify(asetukset);
			localStorage.elvytysjuomat			= elvytysjuomat;
			localStorage.valittuKentta			= biomi;
			localStorage.tutoriaali				= JSON.stringify(tutoriaaliData);

			localStorage.pelitallennusVersio	= pelitallennusVersio;
			console.log("Uudet pelitiedot on nyt luotu! Sivu päivitetään . . .");
			location.reload();
		}
	}

	// Muunnetaan vanhan tyyppinen pelitallennus uuteen
	// Tämä mahdollistaa sen, että pelitietoja ei tarvitse poistaa jos/kun tallennusmuotoon tulee muutoksia
	while(parseInt(localStorage.pelitallennusVersio) < pelitallennusVersio || isNaN(parseInt(localStorage.pelitallennusVersio))){
		var uusiVersio;
		console.log("Päivitetään pelitallennus...");
		switch(localStorage.pelitallennusVersio){
			case "0":
			case "undefined":
				// Mahdollista useampien pisteiden tallennus
				parhaatPisteet=[localStorage.parhaatPisteet,0,0,0,0];
				localStorage.parhaatPisteet=JSON.stringify(parhaatPisteet);
				uusiVersio = 1;
			break;
			case "1":
				// Mahdollista äänen päälle/pois laittaminen
				asetukset["aani"] = 1;
				localStorage.asetukset = JSON.stringify(asetukset);
				uusiVersio = 2;
			break;
			case "2":
				// Lisää Hall Of Fame -listalle 5 uutta paikkaa
				parhaatPisteet.push(0);
				parhaatPisteet.push(0);
				parhaatPisteet.push(0);
				parhaatPisteet.push(0);
				parhaatPisteet.push(0);
				localStorage.parhaatPisteet=JSON.stringify(parhaatPisteet);
				uusiVersio = 3;
			break;
			case "3":
				// Mahdollista elvytysjuomien käyttö
				localStorage.elvytysjuomat = 0;
				uusiVersio = 4 ;
			break;
			case "4":
				// Mahdollista pelitavan muuttaminen
				asetukset["ohjausTapa"] = 0;
				localStorage.asetukset = JSON.stringify(asetukset);
				uusiVersio =  5;
			break;
			case "5":
				// Valittu biomi tallentuu, jotta se on valmiina seuraavalla pelin käynnistyskerralla
				biomi=0;
				localStorage.valittuKentta = biomi;
				uusiVersio = 6;
			break;
			case "6":
				// Tutoriaali
				localStorage.tutoriaali = JSON.stringify(tutoriaaliData);
				uusiVersio = 7;
			break;
			case "7":
				// Parhaat matkat
				localStorage.parhaatMatkat = JSON.stringify(parhaatMatkat);
				uusiVersio = 8;
			break;
		}
		localStorage.pelitallennusVersio=uusiVersio;
		console.log("Pelitallennus päivitetty versioon "+uusiVersio+" onnistuneesti.");
	}

	function varise(aika){
		if(asetukset.varina){
			navigator.vibrate(aika);
			return true;
		}else{
			return false;
		}
	}

	function soitaAani(aaniFilu){
		if(asetukset.aani){
			aaniFilu.play();
		}
	}

	// Kaikenmaailman muuttujia ja funktioita . . .
	tausta[0].loop=true;
	tausta[0].volume=0;
	soitaAani(tausta[0]);

	menuMusiikki[0].loop=true;
	menuMusiikki[0].volume=0;
	soitaAani(menuMusiikki[0]);

	korkeaAani[0].loop=true;
	korkeaAani[0].volume=0;
	soitaAani(korkeaAani[0]);

	ambientti[0].loop=true;
	soitaAani(ambientti[0]);

	var klikkiPos = [0,0];
	
	var iUkko=0;
	var ukkoX = 384;
	var ukkoY = 192;
	var pelaajaNopeus = 9;
	var veriSiirtyma=canvas.height;
	var veriSiirtymaNyt = veriSiirtyma;

	var iVihu = 1;
	var vihuTavoiteX = 384;
	var vihuX = 384;
	
	var tekijaSkrolli;

	var vihuSiirtyma = 95;
	
	var pisteet = 0;
	var matka = 0;
	var pisteytys = 0;
	var bonuspisteet = 0;
    var tieMinMax = [0, 960];
    
    var tauko = false;
    
    

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
			maastomuoto[ylos][0] = 1;
			for (var i=0; i<ylos; i++){
				maasto[i][0] = tieVaakaan[biomiTieVaakaanKuvat[biomi][Math.floor(Math.random()*biomiTieVaakaanKuvat[biomi].length)]];
				maastomuoto[i][0] = 1;
			}
		}else{ // Risteys vasen
			maasto[ylos][0] = tieVasenYlos[biomiTieVYKuvat[biomi][Math.floor(Math.random()*biomiTieVYKuvat[biomi].length)]];
			maastomuoto[ylos][0] = 1;
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

	// Arvotaan lataustekstejä
	latausSloganit = [
		"Kaadetaan puita metsässä",
		"Poimitaan kukkia niityltä",
		"Etsitään kangastuksia aavikolta",
		"Uidaan meressä",
		"Etsitään jalokiviä luolasta",
		"Rasvataan saranoita",
		"Keksitään lataustekstejä",
		"Ratsastetaan kamelilla",
		"Poimitaan marjoja metsästä",
		"Lasketaan rahoja",
		"Sidotaan kengännauhoja"
	];
	latausSloganitArvottu=[];
	for(i=0;i<5;i++){
		var satunnainenSloganId = Math.floor(Math.random()*latausSloganit.length);
		latausSloganitArvottu.push(latausSloganit[satunnainenSloganId]);
		latausSloganit.splice(satunnainenSloganId,1);
	}

	function kirjoita(teksti,x,y,lihavoitu,fonttikoko,vari,fontti){

		lihavoitu	= lihavoitu		|| false;
		fonttikoko	= fonttikoko	|| 16;
		vari		= vari			|| "#FFF";
		fontti		= fontti		|| "sans-serif";

		ctx.fillStyle = "rgba(0,0,0,.5)";
		if(lihavoitu){
			ctx.font = "bold "+fonttikoko+"px "+fontti+",sans-serif";
		}else{
			ctx.font = fonttikoko+"px "+fontti+",sans-serif";
		}
		ctx.fillText(teksti,x+1,y+1);

		ctx.fillStyle = vari;
		ctx.fillText(teksti,x,y);
	}
	
	function getAngle(x, y, angle, h) {
		var radians = angle * (Math.PI / 180);
		return { x: x + h * Math.cos(radians), y: y + h * Math.sin(radians) }; // Muuntaa kulman X:ksi ja Y:ksi
	}
	
	function tutoriaaliSuoritettu(tutId){
		if(tutoriaaliData[tutId] == false){
			tutoriaaliData[tutId] = true;
			tiedote("Tutoriaali","Tehtävä \""+tutoriaali[tutId]+"\" suoritettu.");
			localStorage.tutoriaali = JSON.stringify(tutoriaaliData);
		}
	}
	
	function tiedote(otsikko,teksti){
		tauko=true;
		//alert(otsikko+"\n\n"+teksti);
	}
	
	//Hoitaa kaiken päivityksen 
	function paivita(){		
		maxBonuspisteet = Math.round(10 + (10 * bonusKerroin));

		if(hengissa && !tauko){
			if(asetukset.ohjausTapa=="1"){
				tavoiteX += ukkoLiikkuuX;
				tavoiteX = Math.max(-96,tavoiteX);
				tavoiteX = Math.min(canvas.width-96,tavoiteX);
			}
		}

		var veriSiirtymaV = Math.abs((Math.max(veriSiirtymaNyt,veriSiirtyma)-Math.min(veriSiirtymaNyt,veriSiirtyma))/2);
		if(veriSiirtyma != veriSiirtymaNyt){
			if(veriSiirtyma<veriSiirtymaNyt){
				veriSiirtymaNyt -= veriSiirtymaV;
			}else{
				veriSiirtymaNyt += veriSiirtymaV;
			}
		}

		// Laske tavoitteiden suoritusprosentti
		if(!hengissa){
			kokonaisSuoritus=0;
			$.each(tavoitteet,function(i,v){
				kokonaisSuoritus+=Math.min(v.vaatimus(),1);
			});
			kokonaisSuoritus = kokonaisSuoritus/tavoitteet.length;
		}

		pelaaNo += 0.5;
		
		var liikkuuY = true;

		// Siirrä ukkoa
		if(tavoiteX != ukkoX){
			var posErotus;
		
			if(alkupotkaisu>0){
				posErotus = Math.abs(ukkoX-tavoiteX)/1.2;
			}else{
				posErotus = Math.abs(ukkoX-tavoiteX)/5;
			}

			asteluku = Math.min(Math.PI/2,Math.PI/2/32*posErotus);
			
			if(tavoiteX > ukkoX){
				ukkoX += posErotus;
			}else{
				ukkoX -= posErotus;
				asteluku = -asteluku;
			}
		}
		
		// Siirrä vihua
		if(vihuTavoiteX != vihuX){
			var vihuPosErotus;
		
			if(alkupotkaisu>0){
				vihuPosErotus = Math.min(Math.abs(vihuX-vihuTavoiteX)/1.25,pelaajaNopeus*4);
			}else{
				vihuPosErotus = Math.min(Math.abs(vihuX-vihuTavoiteX)/5,pelaajaNopeus*4);
			}

			vihuAsteluku = Math.min(Math.PI/2,Math.PI/2/32*vihuPosErotus);
			
			if(vihuTavoiteX > vihuX){
				vihuX += vihuPosErotus;
			}else{
				vihuX -= vihuPosErotus;
				vihuAsteluku = -vihuAsteluku;
			}
		}

		// Pienennä musiikin äänenvoimakkuutta, kun vihollinen on lähempänä, ollaan menuissa, ym.
		if(tauko){
			aanenVoimakkuus=0;
		}else{
			aanenVoimakkuus=Math.min(1,1/176*(vihuSiirtyma-80));
		}
		if(hengissa && !tauko){
			korkeaAani[0].volume=Math.max(0,.6-aanenVoimakkuus);
			tausta[0].volume=aanenVoimakkuus;
			menuMusiikki[0].volume=Math.max(0,menuMusiikki[0].volume-0.02);
		}else{
			korkeaAani[0].volume=0;
			if(!elvytysRuutu){
				if(ladatutTiedostot >= kaikkiTiedostot){
					menuMusiikki[0].volume=Math.min(1,menuMusiikki[0].volume+0.02);
					ambientti[0].volume=Math.max(0,ambientti[0].volume-0.02);
				}
			}else{
				menuMusiikki[0].volume=Math.min(0.5,menuMusiikki[0].volume+0.02);
			}
			tausta[0].volume=Math.max(0,tausta[0].volume-0.02);
		}

		// Siirtää vihollista hitaasti taaksepäin
		if(Math.ceil(Math.random()*16)==16 && !tauko){
			vihuSiirtyma -= Math.floor(3/512*vihuSiirtyma);
		}

		vihuSiirtyma = Math.min(384,vihuSiirtyma+.375);
		if(vihuSiirtyma>256 && !tauko){
			vihuSiirtyma-=1.5;
		}
		
		// Ukon sekä vihollisen animointi
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
		piirraVihu(iVihu,vihuX, ukkoY+vihuSiirtyma);
		piirraVarjo();
		piirraUkko(iUkko,ukkoX,ukkoY);
		piirraHyppyNappi();
		
		// Piirretään lentävät objektit
		if(biomi==5){
			$.each(lentavatObjektit,function(i,v){
				// [kuva,x,y,liikkumisnopeusX,liikkumisnopeusY,adaptiivinenLiike,asento,pyoriminen,adaptiivinenPyoriminen]
				if(v != undefined){
					if(!tauko){
						var adaptiivisuus = 10;
						if(v[5]){
							adaptiivisuus = pelaajaNopeus;
						}
						if(alkupotkaisu > 0 && hengissa){
							v[1] += v[3] * 5 / 10 * adaptiivisuus;
							v[2] += v[4] * 5 / 10 * adaptiivisuus;
						}else{
							v[1] += v[3] / 10 * adaptiivisuus;
							v[2] += v[4] / 10 * adaptiivisuus;
						}
						v[6] += v[7];
					}
					ctx.save();
					ctx.translate(v[1]+96,v[2]+96);
					ctx.rotate(v[6]);
					ctx.drawImage(v[0],0,0);
					//ctx.rotate(-v[4]);
					//ctx.translate(-(v[1]+96),-(v[2]+96));
					ctx.restore();
					if(v[2]>canvas.height+192){
						lentavatObjektit.splice(i,1)
					}
				}
			});
		}
		
		// Pelaajan ohjauskomennot
		$("html").keyup(function(e){
			//e.preventDefault();
			if(e.keyCode==32){
				if(!hyppy){
					soitaAani(hyppyAani[0]);
					hyppy=true;
					setTimeout(function(){
						hyppy=false;
					},500);
				}
			}
			if(e.keyCode==27){
				if(hengissa){
					if(tauko){
						tauko=false;
					}else{
						tauko=true;
					}
				}
			}
			ukkoLiikkuuX=0;
		}).keydown(function(e){
			if(asetukset.ohjausTapa=="1"){
				if(ukkoLiikkuuX==0){
					if(e.keyCode==39){
						if(!tauko && hengissa){
							ukkoLiikkuuX=36; // Oikealle
							console.log("oik");
						}
					}
					if(e.keyCode==37){
						if(!tauko && hengissa){
							ukkoLiikkuuX=-36; // Vasemmalle
							console.log("vas");
						}
					}
				}
			}
		});
        
        // Missä tie?
        if (siirtoY>ukkoY-100){ // Tien tutkiminen: Voi joutua muuttamaan lukua
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
		var puolivali = Math.floor((tieMinMax[0]+tieMinMax[1])/2/192)*192;
		if(suojakilpi>2){
			tavoiteX=puolivali;
		}

        //Ukko ja tie
		if((ukkoX<(tieMinMax[0]-ukkoToleranssi) || ukkoX > tieMinMax[1]+ukkoToleranssi-120) && !tauko){
			var puolivali = Math.floor((0.5*(tieMinMax[0] + tieMinMax[1]))/192)*192;
			if(suojakilpi <= 0 && !hyppy){
				ukkoX=puolivali;
				tavoiteX=puolivali;
				vihuSiirtyma -= 64 + Math.round(Math.random()*48);
				suojakilpi+=2;
				if(hengissa){
					striikki=0;
					varise(500);
					bonuspisteet = Math.max(0,bonuspisteet-(maxBonuspisteet/2));
					bonusKerroin = 1;
					soitaAani(auts[0]);
				}
			}
		}

		// Tunnista tietyyppi (kuolee mikäli kompastuu puuhun, tippuu kuiluun ym.)
		// Suoraan menevät tiet

			var ukonRuutu = Math.max(1,Math.min(4,Math.round(ukkoX/192)));
		
			if(maasto[ukonRuutu][1]==tieSuoraan[1] || maasto[ukonRuutu][1]==tieSuoraan[4] || maasto[ukonRuutu][1]==tieSuoraan[8]){
				if(hyppy){
					tutoriaaliSuoritettu(0);
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
			if(maasto[Math.round(ukkoX/192)][1]==tieVaakaan[4] && siirtoX>144){
				vihuSiirtyma=95;
			}
		}

		// Maaston liikuttaminen
		var striikkiJako = 1;
		if(!tauko){
			if(alkupotkaisu>0 && hengissa){
				siirtoY+=pelaajaNopeus*5/striikkiJako;
			}else{
				siirtoY+=pelaajaNopeus/striikkiJako;
			}
		}

		if (siirtoY >= 192){
			siirtoY=0;
			tieMuutos += 1;
			
			if(hengissa && !tauko){
				pisteet += 1;
				matka += 1;
				bonuspisteet += 1;
				striikki += 1;
				if(suojakilpi>0){
					suojakilpi-=1;
				}
				if(alkupotkaisu>4){
					alkupotkaisu-=1;
					suojakilpi=4;
				}else{
					alkupotkaisu=0;
				}
			}
			
			// Luodaan lentäviä objekteja
			if(Math.random()<0.15){
				if(biomi==5){
					var objektiNro = Math.floor(Math.random()*3);
					switch(objektiNro){
						case 0:
							if(lentavatObjektit.length<3){
								lentavatObjektit.push([
									lentavaObjekti[0], // Kuvatiedosto
									Math.random()*canvas.width-96, // Satunnainen aloitus X-piste
									-384, // Aloitus Y-piste
									0, // Satunnainen liikkumisnopeus (X)
									(1.5+Math.random())/10*pelaajaNopeus,  // Satunnainen liikkumisnopeus (Y)
									true, // Adaptiivinen nopeus (eli objekti menee suhteessa nopeampaa silloin kun hahmokin menee)
									Math.PI*2*Math.random(), // Pyörimisen aloituspiste
									(Math.random()*2-1)*(Math.PI/100), // Pyörimisen nopeus (0 = ei pyöri)
									false // Adaptiivinen pyörimisnopeus (eli objekti pyörii sitä nopeammin mitä nopeammin hahmo liikkuu)
								]);
							}
						break;
						case 1:
							for(i=0;i<5;i++){ // Luodaan 5 kappaletta
								lentavatObjektit.push([
									lentavaObjekti[Math.floor(Math.random()*3)+1], // Kuvatiedosto
									Math.random()*canvas.width-96, // Satunnainen aloitus X-piste
									-384, // Aloitus Y-piste
									0, // Satunnainen liikkumisnopeus (X)
									(3+Math.random()*2)/10*pelaajaNopeus,  // Satunnainen liikkumisnopeus (Y)
									true, // Adaptiivinen nopeus (eli objekti menee suhteessa nopeampaa silloin kun hahmokin menee)
									Math.PI*2*Math.random(), // Pyörimisen aloituspiste
									(Math.random()*2-1)*(Math.PI/50), // Pyörimisen nopeus (0 = ei pyöri)
									false // Adaptiivinen pyörimisnopeus (eli objekti pyörii sitä nopeammin mitä nopeammin hahmo liikkuu)
								]);
							}
						break;
						case 2:
							lentavatObjektit.push([
								lentavaObjekti[4], // Kuvatiedosto
								Math.random()*canvas.width-96, // Satunnainen aloitus X-piste
								-384, // Aloitus Y-piste
								-((1.5+Math.random())*pelaajaNopeus*2), // Satunnainen liikkumisnopeus (X)
								(1.5+Math.random())*pelaajaNopeus*2,  // Satunnainen liikkumisnopeus (Y)
								true, // Adaptiivinen nopeus (eli objekti menee suhteessa nopeampaa silloin kun hahmokin menee)
								Math.PI/4, // Pyörimisen aloituspiste
								Math.PI/200, // Pyörimisen nopeus (0 = ei pyöri)
								false // Adaptiivinen pyörimisnopeus (eli objekti pyörii sitä nopeammin mitä nopeammin hahmo liikkuu)
							]);
						break;
					}
				}
			}

			// Kopioidaan ylemmät rivilentavatt alempaan
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
			if(tieMuutos>2){ // Lukua muuttamalla voit säätää paljonko tulee ylöspäin tulevaa tietä aina mutkan jälkeen vähintään
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
					}else if(Suunta < 0.9){ // Risteys
						oliRisteys=tie;
						tie = jatkaTieRisteykseen(tie);
						tieMuutos=0;
					}else{ // Ylös
						tie = jatkaTieYlos(tie);
					}
				}
			}else{
				tie = jatkaTieYlos(tie);
			}
			
			// Luo kyltin risteyksen jälkeen mikäli ollaan metsäbiomissa
			if(tieMuutos>0 && biomi==4){
				if(oliRisteys != false){
					maasto[oliRisteys][0] = kyltti[0];
					oliRisteys=false;
				}
			}
			
			for(i=0;i<maastomuoto.length;i++){
				if(maastomuoto[i][2]==1){
					vihuTavoiteX=192*i; // Asetetaan X-sijainti, johon vihu pyrkii
				}
			}

		}

		if(hengissa){
			// Kirjoita nykyiset pisteet
			ctx.textAlign="center";
				kirjoita(Math.round(pisteet),canvas.width/5*2,48,true,32,"#FFF","'Raleway'");
				kirjoita("PISTEET",canvas.width/5*2,72,true,12,"silver","'Raleway'");
				kirjoita(Math.round(matka),canvas.width/5*3,48,true,32,"#FFF","'Raleway'");
				kirjoita("JUOSTU MATKA",canvas.width/5*3,72,true,12,"silver","'Raleway'");
			ctx.textAlign="start";

			// Piirrä bonuspalkin pohja vasempaan reunaan
			ctx.beginPath();
			ctx.rect(32,96,16,384);
			ctx.fillStyle = "rgba(0,0,0,.5)";
			ctx.fill();
			ctx.closePath();

			// Piirrä itse bonuspalkki
			ctx.beginPath();
			var pylvasK = Math.min(384,Math.round(384/(maxBonuspisteet*192)*((bonuspisteet-1)*192+siirtoY)));
			ctx.rect(32,Math.min(480,384-pylvasK+96),16,pylvasK);
			ctx.closePath();
			
			if(bonuspisteet > maxBonuspisteet-1){
				if(pelaaNo % 1){
					ctx.fillStyle = "lime";
				}else{
					ctx.fillStyle = "gold";
				}
			}else{
				ctx.fillStyle = "gold";
			}
			
			ctx.fill();
			
			kirjoita("+"+(20*bonusKerroin),64,160,true,32,"#FFF","'Raleway'");

			if(bonuspisteet > maxBonuspisteet){
				bonuspisteet = 0;
				bonusKerroin += 1;
				pisteet += 20 * bonusKerroin;
				soitaAani(bonusAani[0]);
			}
		}
		
		// Varjo
		//ctx.fillStyle="rgba(0,0,0,.2)";

		if(vihuSiirtyma<192 && hengissa){
			ctx.textAlign="center";
			var keskiosa = {"x":canvas.width/2,"y":canvas.height/2};
			var sydanKoko = Math.sin(pelaaNo*2) * 8 + 64;
			kirjoita("♥",keskiosa.x, keskiosa.y - sydanKoko/2, true, sydanKoko, "red", "'Raleway'");
			kirjoita("Olet hengenvaarassa",keskiosa.x,keskiosa.y+32,true,24,"red");
			ctx.textAlign="start";
		}

		if(biomi==3){
			tummuus += .005;
			tummuus = Math.min(tummuus,.7);
		}else{
			tummuus -= .02;
			tummuus = Math.max(tummuus,0);
		}

		if(tummuus>0){
			ctx.fillStyle="rgba(0,0,0,"+Math.min(tummuus,.7)+")";
			ctx.fillRect(0,0,960,576);
		}

		if(tauko){
			tummuus=0.5;
			ctx.textAlign="center";
				kirjoita("Tauolla",canvas.width/2,192,true,48,"#FFF","'Raleway'");
				kirjoita("Jatka peliä",canvas.width/2,256,true,24,"#C0C0C0","'Source Sans Pro'");
				kirjoita("Siirry valikkoon",canvas.width/2,256+48,true,24,"#C0C0C0","'Source Sans Pro'");
			ctx.textAlign="start";
		}

		pelaajaNopeus = 10 + Math.round(0.0075*pisteet); // Peli nopeutuu, mitä pitemmälle siinä päästään
		
		// Kun vihu saa pelaajan kiinni, mene päävalikkoon
		if(vihuSiirtyma<96){
			if(elvytysRuutu){
				pelaajaNopeus=0;
			}else{
				pelaajaNopeus=1;
			}
			suojakilpi=0;
		
			if(hengissa){
				bonusKerroin = 1;
				soitaAani(dramaattinen[0]);
				hengissa=false;
				tila=0;
				if(pisteet > 9){
					pisteytetaan=false;
					veriSiirtyma=0;
					varise(1000);
					suojakilpi=0;
					pisteytys=pisteet;
					inaktiivinenMenu=true;
					elvytysRuutu=true;
				}
				setTimeout(function(){
					inaktiivinenMenu=false;
					tavoiteData[0]=Math.max(tavoiteData[0],rahat);
					tavoiteData[2]=Math.max(tavoiteData[2],pelikerrat);
					pisteytetaan=true;
					if(!hengissa){
						pisteytysAani[0].currentTime=0;
						soitaAani(pisteytysAani[0]);
						tila=0;
					}
				},3000);
			}else{
				if(pisteytetaan){
					if(pisteytys>3.75){
						pisteytys -= pisteytys / 10;
						varise(50);
					}else{
						pisteytysAani[0].pause();
						soitaAani(loppuAani[0]);
						pisteytetaan=false;
						inaktiivinenMenu=true;
						setTimeout(function(){
							inaktiivinenMenu=false;
							if(elvytysRuutu && !hengissa){
								alustaMaasto();
								alkupotkaisu=0;
							}
							elvytysRuutu=false;
							tummuus=0.5;
							veriSiirtyma=canvas.height;
							
							if(pisteet>9){				
								// Parhaat pisteet
								parhaatPisteet.push(pisteet);
								parhaatPisteet.sort(function(a,b){return b-a});
								parhaatPisteet.splice(10,1);
								
								localStorage.parhaatPisteet = JSON.stringify(tavoiteData);
								
								// Parhaat matkat
								parhaatMatkat.push(matka);
								parhaatMatkat.sort(function(a,b){return b-a});
								parhaatMatkat.splice(10,1);
								
								localStorage.parhaatMatkat=JSON.stringify(parhaatMatkat);

								tavoiteData[3]=parseFloat(tavoiteData[3])+1; // Laske kaikkien pelattujen pelien määrä
								localStorage.tavoiteData=JSON.stringify(tavoiteData);

								rahat += pisteet;
								matkaYht += matka;

								// Pelitietojen tallennus
								localStorage.rahat			= rahat;
								localStorage.matkaYht		= matkaYht;
								localStorage.tavoiteData	= JSON.stringify(tavoiteData);
								localStorage.omatKentat		= JSON.stringify(omatKentat);
								localStorage.tutoriaali		= JSON.stringify(tutoriaaliData);
							}
							
							// Tykkää meistä Facebookissa -modal näytetään aina ensimmäisen pelikerran jälkeen
							// sekä lisäksi 4% todennäköisyydellä kunkin päättyneen pelin jälkeen
							if(parseFloat(tavoiteData[3])==1 || Math.random() <= 0.04){
								// Viivytetään modalin näyttöä 1,5 sekuntia
								setTimeout(function(){
									openModal("like");
								},1500);
							}
						},3000);
					}
				}
			}

			tummuus=Math.max(0.25,tummuus-0.001);
			
			ctx.beginPath();
			ctx.strokeStyle="rgba(0,0,0,0.2)";
			ctx.moveTo(0,veriSiirtymaNyt-96);
			ctx.lineTo(canvas.width,veriSiirtymaNyt-96);
			ctx.stroke();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.strokeStyle="rgba(255,255,255,0.2)";
			ctx.moveTo(0,veriSiirtymaNyt-95);
			ctx.lineTo(canvas.width,veriSiirtymaNyt-95);
			ctx.stroke();
			ctx.closePath();
			
			ctx.fillStyle="#"+biomiVarit[biomi];
			ctx.fillRect(0,veriSiirtymaNyt,960,576);
			
			/*if(tummuus>0 && tila==0){
				ctx.fillStyle="rgba(0,0,0,"+Math.min(tummuus,.7)+")";
				ctx.fillRect(0,veriSiirtymaNyt-96,960,128);
			}*/
			
			if(tila==0 || elvytysRuutu){
				ctx.fillStyle="#"+biomiVarit[biomi];
			}else{
				ctx.fillStyle="rgba(0,0,0,0.25)";
			}
			ctx.globalAlpha=0.7;
			ctx.fillRect(0,veriSiirtymaNyt-96,960,576);
			ctx.globalAlpha=1;
			
			// Aseta vihu pelaajan alle
			vihuSiirtyma=95;
			
			// Kirjoita otsikko
			ctx.textAlign="center";
				kirjoita("HuhtiRun",canvas.width/2,veriSiirtymaNyt-336-128,true,64,"#FFF","'Fondamento'");
				kirjoita("TM",canvas.width*0.675,80+veriSiirtymaNyt-512-64,true,16);
			ctx.textAlign="start";
				
			if(tila==0){
				tauko=false;
				if((elvytysRuutu || pisteytetaan) && pisteet > 9){
					ctx.textAlign="center";
					if(pisteytys>3.75){
						kirjoita(Math.round(pisteytys),canvas.width/2,256+48,true,96,"#FFF","'Raleway'");
						tarkkuusLisa=0;
						if(pisteytetaan){
							tarkkuusLisa=4;
						}
						//kirjoita(rahat+Math.round(pisteet-pisteytys)+tarkkuusLisa,canvas.width/2,288,true);
					}else{
						kirjoita("Sinulla on nyt",canvas.width/2,192,true);
						var kaikkiRahat = rahat + pisteet;
						kirjoita(kaikkiRahat,canvas.width/2,256+48,true,96,"#FFF","'Raleway'");
						
						ctx.fillStyle = "rgba(255,255,255,0.05)";
						
						for(i=0;i<6;i++){
							ctx.beginPath();
							ctx.moveTo(canvas.width/2,canvas.height/2);
												
							var pos = getAngle(canvas.width/2, canvas.height/2, 60*i+(pelaaNo/2.5)-15,canvas.width);
							ctx.lineTo(pos.x, pos.y);
						
							var pos = getAngle(canvas.width/2, canvas.height/2, 60*i+(pelaaNo/2.5)+15,canvas.width);
							ctx.lineTo(pos.x, pos.y);
							
							ctx.lineTo(canvas.width/2,canvas.height/2);
							
							ctx.fill();
							ctx.closePath();
						}
					}
					if(!pisteytetaan && elvytysRuutu && pisteytys > 3.75){
						kirjoita("Kuolema",canvas.width/2,64,true,32);
						kirjoita("Keräsit pisteitä yhteensä",canvas.width/2,192,true);
					}
					if(elvytysjuomat>0 && pisteytys>3.75){
						ctx.textAlign="center";
							kirjoita("Elvytä",canvas.width/2,512,true,32,"#47A94B","'Source Sans Pro'");
							kirjoita(elvytysjuomat+" elvytyskertaa jäljellä",canvas.width/2,536,true,16,"#47A94B");
						ctx.textAlign="start";
					}else{
						ctx.textAlign="center";
							kirjoita("Elvytä",canvas.width/2,512,true,32,"silver","'Source Sans Pro'");
							kirjoita(elvytysjuomat+" elvytyskertaa jäljellä",canvas.width/2,536,true,16,"silver");
						ctx.textAlign="start";		
					}
				}else{
					// Piirrä alamenun vaihtoehdot
					ctx.globalAlpha=0.75;
					ctx.textAlign="center";
						kirjoita("Tavoitteet",canvas.width/6*1,veriSiirtymaNyt-64,true,16,"#FFF","'Source Sans Pro'");
						kirjoita("Tilastot",canvas.width/6*2,veriSiirtymaNyt-64,true,16,"#FFF","'Source Sans Pro'");
						kirjoita("Asetukset",canvas.width/6*4,veriSiirtymaNyt-64,true,16,"#FFF","'Source Sans Pro'");
						kirjoita("Tietoa pelistä",canvas.width/6*5,veriSiirtymaNyt-64,true,16,"#FFF","'Source Sans Pro'");
					ctx.textAlign="start";
					ctx.globalAlpha=1;

					// Piirrä kentänvalitsimet
					ctx.textAlign="center";
					kirjoita("<",64,256,true,48,"#E0E0E0","'Source Sans Pro'");
					kirjoita(">",canvas.width-64,256,true,48,"#E0E0E0","'Source Sans Pro'");

					for(biomiI=0;biomiI<biomiTyypit.length;biomiI++){
						var palloX = (canvas.width/2)+(biomiI*16)-(biomiTyypit.length*16/2)+5.5;
						if(biomiI==biomi){
							kirjoita("●",palloX,160,true,11);
						}else{
							kirjoita("○",palloX,160,true,11);
						}
					}
					//kirjoita(biomiTyypit[biomi],canvas.width/2,384,true,14,"#FFF","Source Sans Pro");
					ctx.textAlign="start";
				}
				if(!elvytysRuutu){
					var etaisyys96 = Math.max(0,Math.min(96,96-(Math.abs(canvas.width/2-x)+Math.abs(veriSiirtymaNyt-96-y))));				
					var napinSkaalaus = 1+Math.min(0.375,Math.max(0,0.375/96*etaisyys96));
					
					// Nappula
					ctx.moveTo(canvas.width/2,veriSiirtymaNyt-64-16);
					ctx.save();
					ctx.translate(canvas.width/2,veriSiirtymaNyt-64-16);
					ctx.scale(napinSkaalaus,napinSkaalaus);
					ctx.arc(0,0,32,pelaaNo/5,pelaaNo/5+((Math.PI*2)/kaikkiTiedostot*ladatutTiedostot),false);
					ctx.translate(-canvas.width/2,-veriSiirtymaNyt+64+16);
					ctx.restore();
					
					ctx.fillStyle="#7FAF1B";
					ctx.fill();
					
					// Nappulan varjo
					ctx.moveTo(canvas.width/2,veriSiirtymaNyt-64-16);
					grd = ctx.createRadialGradient(canvas.width/2,veriSiirtymaNyt-64-16,32,canvas.width/2,veriSiirtymaNyt-64-16,36);
					grd.addColorStop(0,"rgba(0,0,0,0)");
					grd.addColorStop(0.5,"rgba(0,0,0,0.1)");
					grd.addColorStop(1,"rgba(0,0,0,0)");
					
					ctx.arc(canvas.width/2,veriSiirtymaNyt-64-16,36,0,Math.PI*2,false);
					
					ctx.fillStyle="rgba(0,0,0,0.01)";
					ctx.fill();

					// Nappulan heijastus
					ctx.moveTo(canvas.width/2,veriSiirtymaNyt-64-16);
					grd = ctx.createRadialGradient(canvas.width/2,veriSiirtymaNyt-64-16,0,canvas.width/2,veriSiirtymaNyt-64-16,32+(8/96*etaisyys96));
					grd.addColorStop(0,"rgba(255,255,255,0.25)");
					grd.addColorStop(0.5,"rgba(255,255,255,0.125)");
					grd.addColorStop(0.95,"rgba(0,0,0,0.1)");
					grd.addColorStop(1,"rgba(0,0,0,0.25)");
					
					ctx.save();
					ctx.translate(canvas.width/2,512);
					ctx.scale(napinSkaalaus,napinSkaalaus);
					ctx.arc(canvas.width/2,512,32,0,Math.PI*2,false);
					
					ctx.translate(-canvas.width/2,-512);
					ctx.restore();
					
					ctx.fillStyle=grd;
					ctx.fill();
					
					// Play-kuvake
					ctx.moveTo(canvas.width/2,veriSiirtymaNyt-64-16);
					ctx.beginPath();
					ctx.moveTo(canvas.width/2+16+1,veriSiirtymaNyt-64+1-16);
					ctx.lineTo(canvas.width/2-16+1,veriSiirtymaNyt-64-16+1-16);
					ctx.lineTo(canvas.width/2-16+1,veriSiirtymaNyt-64+16+1-16);
					ctx.lineTo(canvas.width/2+16+1,veriSiirtymaNyt-64+1-16);
					ctx.fillStyle="rgba(0,0,0,0.5)";
					ctx.fill();
					ctx.closePath();
				
					ctx.beginPath();
					ctx.moveTo(canvas.width/2+16,veriSiirtymaNyt-64-16);
					ctx.lineTo(canvas.width/2-16,veriSiirtymaNyt-64-16-16);
					ctx.lineTo(canvas.width/2-16,veriSiirtymaNyt-64+16-16);
					ctx.lineTo(canvas.width/2+16,veriSiirtymaNyt-64-16);
					ctx.fillStyle="#FFF";
					ctx.fill();
					ctx.closePath();
					
					ctx.globalAlpha=0.75;
					ctx.textAlign="center";
					if(ladatutTiedostot >= kaikkiTiedostot){
						if(omatKentat[biomi]){
							kirjoita("Uusi peli",canvas.width/2,veriSiirtymaNyt-20,true,18,"#FFF","'Source Sans Pro'");
						}else{
							kirjoita("Osta kenttä",canvas.width/2,veriSiirtymaNyt-20,true,18,"#FFF","'Source Sans Pro'");
							kirjoita(300*biomi-1,canvas.width/2+16,veriSiirtymaNyt-64+22,false,14,"#FFF","'Source Sans Pro'");
						}
					}else{
						kirjoita("Ladataan "+Math.round(100/kaikkiTiedostot*ladatutTiedostot)+"%",canvas.width/2,veriSiirtymaNyt-20,true,18,"#FFF","'Source Sans Pro'");
					}
					ctx.textAlign="start";
					ctx.globalAlpha=1;
				}
				
				ctx.drawImage(facebook[0],canvas.width-75,18-(Math.sin(pelaaNo/3)*6),42,36);
			}
			if(tila==0 || tila==1){
				if(!elvytysRuutu){
					// Näytä rahatilanne vasemmassa yläkulmassa
					ctx.drawImage(kolikkoKuva[0],24,24,24,24);
					kirjoita(Math.round(tuhaterotin(rahat)),64,42,false,20,"#FFF","'Raleway'");
				}
			}
			if(tila==1){
				kirjoita("Valmiina . . .",64,128-veriSiirtymaNyt,true,48,"#FFF","'Raleway'");
				kirjoita("Halutessasi voit ostaa power-upeja ennen peliä",64,152-veriSiirtymaNyt/2,true,16,"#FFF","'Source Sans Pro'");
				
				ctx.textAlign="center";
				ctx.drawImage(medikit[0],canvas.width/4-96+32,192+veriSiirtymaNyt/9+48);
				kirjoita("Elvytys",canvas.width/4,192+veriSiirtymaNyt/9,true,20,"#FFF","'Raleway'");
				kirjoita((100*Math.pow(2,elvytysjuomat)-1)+" (HR)",canvas.width/4,192+veriSiirtymaNyt/9+18,true,12,"silver");
				kirjoita("Mahdollistaa henkiin",canvas.width/4,396+veriSiirtymaNyt/9);
				kirjoita("heräämisen kuollessasi",canvas.width/4,420+veriSiirtymaNyt/9);
				if(elvytysjuomat==0){
					var elvytysteksti = "EI ELVYTYSKERTOJA";
				}
				if(elvytysjuomat==1){
					var elvytysteksti = elvytysjuomat+" ELVYTYSKERTA";
				}
				if(elvytysjuomat > 1){
					var elvytysteksti = elvytysjuomat+" ELVYTYSKERTAA";
				}
				kirjoita(elvytysteksti,canvas.width/4,444+veriSiirtymaNyt/9,true,12,"silver");

				kirjoita("Bonusta enemmän",canvas.width/4*2,192+veriSiirtymaNyt/6,true,20,"#FFF","'Raleway'");
				kirjoita("TULOSSA MYÖHEMMIN",canvas.width/4*2,192+veriSiirtymaNyt/6+18,true,12,"silver");
				kirjoita("Saat enemmän pisteitä",canvas.width/4*2,396+veriSiirtymaNyt/6);
				kirjoita("bonusmittarin täyttyessä",canvas.width/4*2,420+veriSiirtymaNyt/6);
				kirjoita("0/5 PÄIVITETTY",canvas.width/4*2,444+veriSiirtymaNyt/6,true,12,"silver");

				kirjoita("Alkupotkaisu",canvas.width/4*3,192+veriSiirtymaNyt/3,true,20,"#FFF","'Raleway'");
				kirjoita(Math.floor(199+50*(alkupotkaisu/25))+" (HR)",canvas.width/4*3,192+veriSiirtymaNyt/3+18,true,12,"silver");
				kirjoita("Hanki itsellesi "+(25+alkupotkaisu)+" m",canvas.width/4*3,396+veriSiirtymaNyt/3);
				kirjoita("etumatkaa pelin alkaessa",canvas.width/4*3,420+veriSiirtymaNyt/3);
				kirjoita(alkupotkaisu+" METRIÄ",canvas.width/4*3,444+veriSiirtymaNyt/3,true,12,"silver");

				ctx.textAlign="end";
					kirjoita("Aloita peli »",canvas.width-64,512,true,24,"#47A94B","'Source Sans Pro'");
				ctx.textAlign="start";
				veriSiirtyma=0;
				kirjoita("« Paluu",64,512,true,24,"rgba(255,255,255,0.5)","'Source Sans Pro'");
			}
			if(tila==2){
				kirjoita(tavoitteet[tavoiteNo].nimi,320,192+24,true,24,"#FFF","'Raleway'");
				kirjoita(tavoitteet[tavoiteNo].kuvaus,320,224+24,false,18,"#FFF","'Source Sans Pro'");
				
				if(tavoitteet[tavoiteNo].vaatimus()>=1){
				
					var grd = ctx.createRadialGradient(192,256,0,192,256,256/512*(512-veriSiirtymaNyt));
					
					grd.addColorStop(0,"rgba(255,255,255,0.1)");
					grd.addColorStop(0.5,"rgba(255,255,255,0.1)");
					grd.addColorStop(1,"transparent");
				
					ctx.fillStyle = grd;
				
					for(i=0;i<6;i++){
						ctx.beginPath();
						ctx.moveTo(192,256);
										
						var pos = getAngle(192, 256, 60*i+(pelaaNo)-15,256/512*(512-veriSiirtymaNyt));
						ctx.lineTo(pos.x, pos.y);
				
						var pos = getAngle(192, 256, 60*i+(pelaaNo)+15,256/512*(512-veriSiirtymaNyt));
						ctx.lineTo(pos.x, pos.y);
					
						ctx.fill();
						ctx.closePath();
					}
					
					kirjoita("☑",320,288+24,false,32,"#47A94B");
					kirjoita("Suoritettu",372,272+24,true,18,"#47A94B","'Source Sans Pro'");
					kirjoita("Onneksi olkoon!",372,292+24,false,18,"#47A94B","'Source Sans Pro'");
					ctx.drawImage(mitalinauha[0],64,-104);
					ctx.drawImage(mitalit[tavoiteNo],128,192);
					if(Math.random()>0.75){
						var kimalleKoko = 8+Math.random()*8;
						ctx.drawImage(kimalle[0],128+Math.random()*128-(kimalleKoko/2),192+Math.random()*128-(kimalleKoko/2),kimalleKoko,kimalleKoko);
					}
					/*ctx.drawImage(mitalinauha[0],-64,-32);
					ctx.drawImage(mitalit[tavoiteNo],64,176);*/
				}else{
					var aloitusPiste = 4.71238898;
					
					ctx.beginPath();
					ctx.arc(192+1,256+1,64,aloitusPiste,aloitusPiste+((360/1*tavoitteet[tavoiteNo].vaatimus())*(Math.PI/180)/384*(384-veriSiirtymaNyt)),false);
					ctx.lineWidth = 2;
					ctx.strokeStyle = "#000";
					ctx.stroke();
					ctx.closePath();
					
					ctx.beginPath();
					ctx.arc(192,256,64,aloitusPiste,aloitusPiste+((360/1*tavoitteet[tavoiteNo].vaatimus())*(Math.PI/180)/384*(384-veriSiirtymaNyt)),false);
					ctx.lineWidth = 2;
					ctx.strokeStyle = "gold";
					ctx.stroke();
					ctx.closePath();
					
					ctx.textAlign="center";
						kirjoita(Math.floor(tavoitteet[tavoiteNo].vaatimus()*100/384*(384-veriSiirtymaNyt)),192,256+8,true,32,"gold","'Raleway'");
						kirjoita("%",192,256+48,true,16,"gold");
					ctx.textAlign="start";
					kirjoita("☐",320,288+24,false,32,"silver");
					kirjoita("Jaksaa, jaksaa!",372,272+24,true,18,"silver","'Source Sans Pro'");
					kirjoita(Math.floor(tavoitteet[tavoiteNo].vaatimus()*100) + " % suoritettu",372,292+24,false,18,"silver","'Source Sans Pro'");
				}
				
				/*ctx.fillStyle = "rgba(0,0,0,0.25)";
				ctx.fillRect(48,80,272,88);*/
				
				kirjoita("Tavoitteet",64,128-veriSiirtymaNyt,true,48,"#FFF","'Raleway'");
				kirjoita("Näitä sinun pitää kerätä!",64,152-veriSiirtymaNyt/2,true,16,"#FFF","'Source Sans Pro'");

				for(tavoiteI=0;tavoiteI<tavoitteet.length;tavoiteI++){
					var palloX = (canvas.width/2)+(tavoiteI*16)-(tavoitteet.length*16/2)+5.5;
					var palloVari = "silver";
					if(tavoitteet[tavoiteI].vaatimus()>=1){
						palloVari="#47A94B";
					}
					if(tavoiteI==tavoiteNo){
						kirjoita("●",palloX,416,true,11,palloVari);
					}else{
						kirjoita("○",palloX,416,true,11,palloVari);
					}
				}	

				// Piirrä tavoitteen valitsimet
				ctx.textAlign="center";
					kirjoita("<",64,256,true,48,"#E0E0E0","'Source Sans Pro'");
					kirjoita(">",canvas.width-64,256,true,48,"#E0E0E0","'Source Sans Pro'");
				ctx.textAlign="start";
				kirjoita("« Paluu",64,512,true,24,"rgba(255,255,255,0.5)","'Source Sans Pro'");
			}
			if(tila==3){
				kirjoita("Tilastot",64,128-veriSiirtymaNyt,true,48,"#FFF","'Raleway'");
				kirjoita("Vielä on parantamisen varaa . . .",64,152-veriSiirtymaNyt/2,true,16,"#FFF","'Source Sans Pro'");

				kirjoita("YHTEENLASKETTU MATKA",64,176,true,12,"#FFF","'Raleway'");
				kirjoita(pad(matkaYht,8),64,208,true,32,"#FFF","'Raleway'");
				kirjoita("m",256,208,true,16,"#FFF","'Raleway'");

				kirjoita("PELATUT PELIT",64,256,true,12,"#FFF","'Raleway'");
				kirjoita(pad(tavoiteData[3],8),64,288,true,32,"#FFF","'Raleway'");

				kirjoita("KESKIMÄÄRÄINEN MATKA/PELI",64,336,true,12,"#FFF","'Raleway'");
				kirjoita(pad(Math.round(matkaYht/tavoiteData[3]),8),64,368,true,32,"#FFF","'Raleway'");
				kirjoita("m",256,368,true,16,"#FFF","'Raleway'");

				var sijoitusVarit = ["gold","silver","#A38051"];
				
				// Parhaat pisteet
				kirjoita("PARHAAT PISTEET",384,176,true,12);
				for(i=0;i<3;i++){
					if(i<3){
						ctx.beginPath();
						ctx.arc(391, 208+(32*i)-9, 12, 0, 2 * Math.PI, false);
						ctx.fillStyle = "rgba(0,0,0,.5)";
						ctx.fill();
						ctx.closePath();

						ctx.beginPath();
						ctx.arc(390, 208+(32*i)-10, 12, 0, 2 * Math.PI, false);
						ctx.fillStyle = sijoitusVarit[i];
						ctx.fill();
						ctx.closePath();
					}

					kirjoita(i+1,384,208+(32*i)-6,true,16);
					kirjoita(parhaatPisteet[i],424,208+(32*i),false,32,sijoitusVarit[i],"'Source Sans Pro'");
				}
				
				// Parhaat matkat
				kirjoita("PISIMMÄT MATKAT",384,304,true,12);
				for(i=0;i<3;i++){
					if(i<3){
						ctx.beginPath();
						ctx.arc(391, 336+(32*i)-9, 12, 0, 2 * Math.PI, false);
						ctx.fillStyle = "rgba(0,0,0,.5)";
						ctx.fill();
						ctx.closePath();

						ctx.beginPath();
						ctx.arc(390, 336+(32*i)-10, 12, 0, 2 * Math.PI, false);
						ctx.fillStyle = sijoitusVarit[i];
						ctx.fill();
						ctx.closePath();
					}

					kirjoita(i+1,384,336+(32*i)-6,true,16);
					kirjoita(parhaatMatkat[i],424,336+(32*i),false,32,sijoitusVarit[i],"'Source Sans Pro'");
				}

				kirjoita("« Paluu",64,512,true,24,"rgba(255,255,255,0.5)","'Source Sans Pro'");
				ctx.textAlign="end";
					kirjoita("HUOM! ALLE 10 METRIN JUOKSUJA EI TILASTOIDA",canvas.width-64,512,true,12);
				ctx.textAlign="start";
			}
			if(tila==4){
				var tekijat = {
					"HuhtiRun -pelin tekijät":[""],
					"Ohjelmointi" : [
						"Petja Touru",
						"Markku Leino"
					],
					"Grafiikka" : [
						"Ossi Parikka",
						"Petja Touru"
					],
					"Käsikirjoitus" : [
						"Lauri Pyhälä",
						"Ossi Parikka",
						"Mikko Hyyryläinen",
						"Petja Touru"
					],
					"Musiikki & äänet" : [
						"Freesound.org -sivuston käyttäjät:",
						"reactorplayer",
						"blacklizard77",
						"Dj Chronos",
						"notchfilter",
						"primeval_polypod",
						"Timbre",
						"flowerdove2168",
						"+ muutamia Public Domain -ääniä"
					],
					"Kiitos pelaamisesta!" : [
						"Tekijätiimimme kiittää sinua."
					],
				}
			
				kirjoita("Tietoja pelistä",64,128-veriSiirtymaNyt,true,48,"#FFF","'Raleway'");
				kirjoita("Saanemme esitellä pelimme tekijät",64,152-veriSiirtymaNyt/2,true,16,"#FFF","'Source Sans Pro'");
				
				ctx.translate(512+64,192-64);
				ctx.drawImage(ukko[0],0,0,288,288);
				ctx.translate(-512-64,-192+64);
				
				tekijaLaskuri = 0;
				tekijaSkrolli -= 1.25;
				
				// Tekijöiden skrollaava osa
				$.each(tekijat,function(tekijaKat,tekijaKatJasenet){
					// Tekijöiden kategoriat
					tekijaLaskuri++;
					var tekijaKatY = 192+tekijaLaskuri*24+tekijaSkrolli;
					if(tekijaKatY<256){
						ctx.globalAlpha=1-Math.max(0,Math.min(1,1/16*(192-tekijaKatY)));
					}else{
						ctx.globalAlpha=1-Math.max(0,Math.min(1,1/16*(tekijaKatY-416)));
					}
					kirjoita(tekijaKat,64,tekijaKatY,true,20,"#FFF","'Source Sans Pro'");
					
					// Tekijöiden nimet
					ctx.globalAlpha=1;
					var tekijaKatJasenY;
					var v;
					$.each(tekijaKatJasenet,function(tekija,v){
						tekijaLaskuri++;
						tekijaKatJasenY = 192+tekijaLaskuri*24+tekijaSkrolli-24;
						if(tekijaKatJasenY<256){
							ctx.globalAlpha=1-Math.max(0,Math.min(1,1/16*(192-tekijaKatJasenY)));
						}else{
							ctx.globalAlpha=1-Math.max(0,Math.min(1,1/16*(tekijaKatJasenY-416)));
						}
						kirjoita(v,256,tekijaKatJasenY,false,20,"#FFF","'Source Sans Pro'");
					});

					// Kun luettelo on käyty läpi, aloita alusta
					if(tekijaKatJasenet.length + tekijat.length - 3 >= tekijaLaskuri && tekijaKatJasenY < 128){
						tekijaSkrolli=512;
						tekijaLaskuri=0;
					}
					
					ctx.globalAlpha=1;
				});
				
				ctx.textAlign="end";
				kirjoita("Versio n:o",canvas.width-64,512,true);
				var versioPituus = 20;
				if(y>canvas.height-128 && x>canvas.width/3*2){
					versioPituus=40;
				}
				kirjoita(versioId.substr(0,versioPituus) || "Ei tiedossa",canvas.width-64,512+24,false,16,"#FFF","Courier New");
				ctx.textAlign="start";
				
				kirjoita("« Paluu",64,512,true,24,"rgba(255,255,255,0.5)","'Source Sans Pro'");
			}
			if(tila==5){
				kirjoita("Asetukset",64,128-veriSiirtymaNyt,true,48,"#FFF","'Raleway'");
				kirjoita("Säädä pelikokemuksesi mieleiseksesi",64,152-veriSiirtymaNyt/2,true,16,"#FFF","'Source Sans Pro'");

				kirjoita("Värinä (sitä tukevissa laitteissa)",64,192,false);
				if(asetukset.varina){
					kirjoita("Päällä",512,192,false);
				}else{
					kirjoita("Pois",512,192,false);
				}

				kirjoita("Äänet ja musiikki",64,224,false);
				if(asetukset.aani){
					kirjoita("Päällä",512,224,false);
				}else{
					kirjoita("Pois",512,224,false);
				}

				kirjoita("Pelin ohjaaminen",64,256,false);
				kirjoita(ohjausTavat[asetukset.ohjausTapa],512,256,false);

				kirjoita("« Paluu",64,512,true,24,"rgba(255,255,255,0.5)","'Source Sans Pro'");
			}
		}
		if(hengissa){
			var oikeaReuna = canvas.width-12;
			ctx.fillStyle="#000";
			ctx.fillRect(oikeaReuna-12,12,12,24);
			ctx.fillRect(oikeaReuna-30,12,12,24);
			ctx.fillStyle="#FFF";
			ctx.fillRect(oikeaReuna-13,13,12,24);
			ctx.fillRect(oikeaReuna-31,13,12,24);
		}
		if(!hengissa || tauko){
			ctx.globalAlpha=0.5;
			kirjoita(versioId.substring(0,5),8,canvas.height-8,false,10,"#FFF","Courier New");
			ctx.globalAlpha=1;
		}
		if(false){
			ctx.fillStyle="#400000";
			ctx.fillRect(0,0,960,576);
			ctx.textAlign="center";
			
			ctx.beginPath();
			ctx.moveTo(0,224);
			ctx.lineTo(canvas.width,224);
			ctx.lineWidth = 2;
			ctx.strokeStyle="#FFF";
			ctx.stroke();
			ctx.closePath();
			
			kirjoita("V I R H E   L A T A U K S E S S A",canvas.width/2,256,true,12);
			kirjoita(virheTiedosto,canvas.width/2,384,true,12,"#808080");
			ctx.textAlign="start";
			document.title="Latausvirhe!";
		}else{
			// Latausruutu
			if(false){
				ctx.fillStyle="#4D7B28";
				ctx.fillRect(0,0,960,576);

				ctx.beginPath();
				ctx.moveTo(256,384);
				ctx.lineTo(canvas.width-256,384);
				ctx.lineWidth = 16;
				ctx.strokeStyle="rgba(0,0,0,.5)";
				ctx.stroke();
				ctx.closePath();

				var latauspalkkiTavoiteX = (canvas.width - 512) / kaikkiTiedostot * ladatutTiedostot;
				latauspalkkiX += (latauspalkkiTavoiteX - latauspalkkiX) / 10;

				ctx.beginPath();
				ctx.moveTo(256,384);
				ctx.lineTo(latauspalkkiX+256,384);
				ctx.lineWidth = 16;
				ctx.strokeStyle="gold";
				ctx.stroke();
				ctx.closePath();

				ctx.textAlign="center";
					kirjoita("HuhtiRun",canvas.width/2,112+192,true,64,"#FFF","'Fondamento'");
					kirjoita("TM",canvas.width*0.675,80+192,true,16);
				ctx.textAlign="start";

				var latausprosentti=Math.floor(100/kaikkiTiedostot*ladatutTiedostot);
				if(hidasLataus){
					ctx.beginPath();
					ctx.fillStyle="#DC7612";
					ctx.fillRect(0,0,960,96);
					ctx.fill();
					ctx.closePath();
					kirjoita("!",64,64,true,48,"#FFF","'Source Sans Pro'");
					kirjoita("Lataaminen tuntuu vievän normaalia kauemmin!",96,48,true,24,"#FFF","'Source Sans Pro'");
					kirjoita("Jos peli ei lataudu, tarkista verkkoyhteytesi. Päivitä sivu tarvittaessa.",96,64,true,16,"#FFF","'Source Sans Pro'");
				}
				ctx.textAlign="center";
					kirjoita(latausSloganitArvottu[Math.floor(0.05*latausprosentti)],canvas.width/2,384+36,true,16,"#FFF","'Source Sans Pro'");
				ctx.textAlign="start";

				document.title="Ladataan "+latausprosentti+" %";
			}else{
				if(hengissa){
					document.title="HR - "+pisteet+" pst.";
				}else{
					document.title="HuhtiRun";
				}
			}
		}
	}
	$(window).blur(function(){
		if(hengissa){
			tauko=true;
		}
	});
	$("canvas").mousedown(function(e){
		e.preventDefault();
		x = Math.floor(e.pageX-$("canvas").offset().left);
		y = Math.floor(e.pageY-$("canvas").offset().top);
		hiiriAlasX=x;
		var randomiNopeus = 10 + Math.round(Math.random()*10);
		if(hengissa){
			if(!tauko){
				klikkiPos=[x,y];
				varise(100);
				if(x>canvas.width-48 && y<64){
					if(tauko){
						tauko=false;
					}else{
						tauko=true;
					}
				}
			}else{
				//yoloyolo
				if(x>384 && x<canvas.width-384){
					if(y>=256-24 && y<256+24){
						tauko=false;
					}
					if(y>=256+24 && y<256+48){
						if(confirm("Haluatko lopettaa pelin ja siirtyä valikkoon?")){
							tauko=false;
							vihuSiirtyma=95;
						}
					}
				}
			}
		}else{
			if(ladatutTiedostot >= kaikkiTiedostot){
				if(tila==0){
					varise(100);
					if(y<96){
						if(x>canvas.width-96){
							openModal("like");
						}
					}
					if(y>146 && y<288){
						if(!elvytysRuutu){
							if(x<128){
								if(biomi>0){
									biomi=Math.max(0,biomi-1);
								}else{
									biomi=biomiTyypit.length-1;
								}
							}
							if(x>canvas.width-128){
								if(biomi<biomiTyypit.length-1){
									biomi=Math.min(biomiTyypit.length-1,biomi+1);
								}else{
									biomi=0;
								}
							}
							soitaAani(klikkiAani[0]);
							alustaMaasto();
							ukkoX=384;
							localStorage.valittuKentta = biomi;
						}
					}
					if(y>448){
						if(elvytysRuutu){
							if(pisteytys>3.75 && elvytysjuomat>0){
								striikki=0;
								elvytysjuomat -= 1;
								localStorage.elvytysjuomat = elvytysjuomat;
								veriSiirtyma = canvas.height - 128;
								vihuSiirtyma = 256;
								hengissa = true;
								suojakilpi += 3;
								pelikerrat += 1;
								tavoiteData[2] = Math.max(tavoiteData[2],pelikerrat);
								varise(1000);
							}
						}else{
							if(x>=canvas.width/6*1-80 && x<canvas.width/6*1+80){ // Siirry Tavoitteet-sivulle
								veriSiirtyma=0;
								tavoiteNo=0;
								tila=2;
								soitaAani(klikkiAani[0]);
							}
							if(x>=canvas.width/6*2-80 && x<canvas.width/6*2+80){ // Siirry Tilastot-sivulle
								veriSiirtyma=0;
								tila=3;
								soitaAani(klikkiAani[0]);
							}
							if(x>=canvas.width/6*3-80 && x<canvas.width/6*3+80){
								soitaAani(klikkiAani[0]);
								if(omatKentat[biomi]){
									tila=1;
								}else{
									if(osta(300*biomi-1,biomiTyypit[biomi],true)){
										omatKentat[biomi]=true;
										localStorage.omatKentat=JSON.stringify(omatKentat);
										tila=1;
									}
								}
							}
							if(x>=canvas.width/6*4-80 && x<canvas.width/6*4+80){ // Siirry Asetukset-sivulle
								veriSiirtyma=0;
								tila=5;
								soitaAani(klikkiAani[0]);
							}
							if(x>=canvas.width/6*5-80 && x<canvas.width/6*5+80){ // Siirry Tietoja-sivulle
								veriSiirtyma=0;
								tekijaSkrolli = 192;
								tila=4;
								soitaAani(klikkiAani[0]);
							}
						}
					}
			}else if(tila==1){
				varise(100);
				if(y>448){
					if(x>=48 && x<256){ // Siirry takaisin
						tila=0;
						veriSiirtyma=canvas.height;
						soitaAani(klikkiAani[0]);
					}
					if(x>=512){ 
						veriSiirtyma=canvas.height;
						if(! inaktiivinenMenu){ // Aloita uusi peli
							lentavatObjektit = [];
							striikki=0;
							tila=0;
							soitaAani(klikkiAani[0]);
							alustaMaasto();
							vihuSiirtyma=512;
							pelaajaNopeus=10;
							soitaAani(huuto[0]);
							hengissa=true;
							pisteet=0;
							matka=0;
							bonuspisteet=0;
							tausta[0].volume=1;
							suojakilpi+=3;
							pelikerrat=0;
							varise(1000);
						}
					}
				}else{
					if(y>192){
						if(x >= canvas.width/4-96 && x < canvas.width/4+96){
							if(osta(100*Math.pow(2,elvytysjuomat)-1,"Elvytys",true)){
								elvytysjuomat+=1;
								localStorage.elvytysjuomat=elvytysjuomat;
							}
						}
						if(x >= canvas.width/4*2-96 && x < canvas.width/4*2+96){
							alert("Tulossa myöhemmin!");
						}
						if(x >= canvas.width/4*3-96 && x < canvas.width/4*3+96){
							if(osta(199+50*(alkupotkaisu/25),"Alkupotkaisu 25 m",true)){
								alkupotkaisu+=25;
							}
						}
					}
				}
			}else if(tila==2){ // Tavoitemenu
				soitaAani(klikkiAani[0]);
				if(x<canvas.width/3){ // Edellinen
					tavoiteNo -= 1;
					if(tavoiteNo == -1){
						tavoiteNo = tavoitteet.length-1;
					}
				}
				if(x>canvas.width/3*2){ // Seuraava
					tavoiteNo += 1;
					if(tavoiteNo>tavoitteet.length-1){
						tavoiteNo=0;
					}
				}
				if(y>448){ // Paluu valikkoon
					veriSiirtyma=canvas.height;
					tila=0;
				}
			}else if(tila==3){ // Tilastomenu
				if(y>448){ // Takaisin valikkoon
					veriSiirtyma=canvas.height;
					tila=0;
					soitaAani(klikkiAani[0]);
				}
			}else if(tila==4){ // Tietoja-menu
				if(y>448){ // Takaisin valikkoon
					veriSiirtyma=canvas.height;
					tila=0;
					soitaAani(klikkiAani[0]);
				}
			}else if(tila==5){ // Asetukset-menu
				if(y>448){ // Takaisin valikkoon
					veriSiirtyma=canvas.height;
					tila=0;
					soitaAani(klikkiAani[0]);
				}
				if(x > 480){
					if(y >= 192-16 && y < 192+16){
						soitaAani(klikkiAani[0]);
						if(asetukset.varina){
							asetukset.varina=false;
						}else{
							asetukset.varina=true;
						}
						localStorage.asetukset=JSON.stringify(asetukset);
					}
					if(y >= 224-16 && y < 224+16){
						soitaAani(klikkiAani[0]);
						if(asetukset.aani){
							asetukset.aani=false;
						}else{
							asetukset.aani=true;
						}
						localStorage.asetukset=JSON.stringify(asetukset);
						location.reload();
					}
					if(y >= 256-16 && y < 256+16){
						soitaAani(klikkiAani[0]);
						asetukset.ohjausTapa += 1;
						if(asetukset.ohjausTapa >= ohjausTavat.length){
							asetukset.ohjausTapa = 0;
						}
						localStorage.asetukset=JSON.stringify(asetukset);
					}
				}
			}
		}
		}
	}).mouseup(function(e){
		e.preventDefault();
		x = Math.floor(e.pageX-$("canvas").offset().left);
		y = Math.floor(e.pageY-$("canvas").offset().top);
		/*var hiiriSiirtymaX = Math.abs(hiiriAlasX-x);
		if(hiiriSiirtymaX>256){
			if(x < hiiriAlasX){
				biomi=Math.min(biomiTyypit.length-1,biomi+1);
			}else{
				biomi=Math.max(0,biomi-1);
			}
			soitaAani(klikkiAani[0]);
			alustaMaasto();
			ukkoX=384;
		}*/
	}).mousemove(function(e){
		x = Math.floor(e.pageX-$("canvas").offset().left);
		y = Math.floor(e.pageY-$("canvas").offset().top);
		if(ladatutTiedostot<kaikkiTiedostot){

		}else{
			if(asetukset.ohjausTapa=="0"){
				if(y<canvas.height*.8){
					if(hengissa && !tauko && suojakilpi <= 0){
						tavoiteX=x-96;
					}else{
						var puolivali = Math.floor(((tieMinMax[0]+tieMinMax[1])/2)/192)*192;
						tavoiteX=puolivali;
					}
				}else{
					if(hengissa){
						if(!hyppy){
							soitaAani(hyppyAani[0]);
							hyppy=true;
							setTimeout(function(){
								hyppy=false;
							},500);
						}
					}
				}
			}
		}
	}).dblclick(function(){
		if(hengissa && bonuspisteet >= maxBonuspisteet){
			pisteet+=20;
			bonuspisteet=0;
			soitaAani(maksuAani[0]);
		}
	});
	
	function piirraMaasto(siirtoY){
		ctx.fillStyle="#"+biomiVarit[biomi];
		ctx.fillRect(0,0,960,576);
		
		for (var i=0; i<maasto.length; i++){
			for (var j=0; j<maasto[i].length; j++){
				try{
					ctx.drawImage(maasto[i][j], i*192, (j-1)*192 + siirtoY);
				}catch(e){
					// Do nothing
				}
			}
		}
	}
	
	function piirraVarjo(){
		if(hyppy && hengissa){
			ctx.drawImage(varjo[0],ukkoX+48,ukkoY+96);
		}
	}
	
	function piirraHyppyNappi(){
		if(hengissa){
			if(hyppy){
				ctx.drawImage(hyppyKuva[0],64,canvas.height-64,64,32);
			}else{
				ctx.drawImage(hyppyKuva[0],64,canvas.height-96);
			}
		}
	}
	
	function piirraVihu(i,piirtoX,piirtoY){
		if(hengissa || elvytysRuutu){
			var translaatio = {
				"x" : piirtoX + vihu[i].width / 2,
				"y" : piirtoY + vihu[i].height / 2
			};
			ctx.save();
			ctx.translate(translaatio.x,translaatio.y);
			ctx.rotate(vihuAsteluku);
			ctx.drawImage(vihu[i],-96,-96);
			ctx.restore();
		}
	}
	
	function piirraUkko(i,piirtoX,piirtoY){
		if(hengissa){
			if(suojakilpi>0){
				if(suojakilpi<=5 && pelaaNo % 1){
					ctx.globalAlpha=1;
				}else{
					ctx.globalAlpha=0.25;
				}
			}
			var translaatio = {
				"x" : piirtoX + ukko[i].width / 2,
				"y" : piirtoY + ukko[i].height / 2
			};
			ctx.save();
			ctx.translate(translaatio.x,translaatio.y);
			ctx.rotate(asteluku);
			if(hyppy){
				ctx.drawImage(ukko[i],-96-24,-96-24,240,240);
			}else{
				ctx.drawImage(ukko[i],-96,-96);
			}
			ctx.restore();
		}
		ctx.globalAlpha=1;
	}
	
	// Ostotoiminto kauppaa varten
	function osta(hinta,asia,kysy){
		asia = asia || "Tämä tuote";
		kysy = kysy || true;
		/*if(kysy){
			kysy=confirm(asia+" maksaa "+hinta+" (HR)\n\nOsta?");
		}*/
		if(hinta <= rahat){
			if(kysy){
				rahat-=hinta;
				localStorage.rahat=rahat;
				soitaAani(maksuAani[0]);
				return true;
			}else{
				return false;
			}
		}else{
			soitaAani(dramaattinen[0]);
			openModal("noMoney");
			$("#lisaaRahaaArvo").html(hinta-rahat);
			$("#lisaaRahaaTuote").html(asia);
			return false;
		}
	}
});
