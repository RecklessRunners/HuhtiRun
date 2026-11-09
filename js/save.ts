import { s } from "./state";
import { CONTROL_MOUSE } from "./constants/ids";

// Nykyisen pelitallennuksen versionumero
// TÄRKEÄ! MUUTA AINA YHTÄ ISOMMAKSI, KUN PELITALLENNUSMUOTOON TULEE MUUTOKSIA!
const pelitallennusVersio = 8;

// Lataa pelitiedot localStoragesta tai luo uudet, ja päivittää vanhat tallennukset nykyiseen muotoon
export function lataaTallennus(){

	// Tarkistetaan onko selaimeen tallennettu pelitietoja
	if(parseInt(localStorage.pelitallennusVersio) >= pelitallennusVersio || isNaN(parseInt(localStorage.pelitallennusVersio))){
		if(! isNaN(localStorage.rahat)){
			// Ladataan tallennetut pelitiedot
			console.log("Ladataan tallennettuja pelitietoja...");
			s.parhaatPisteet	= JSON.parse(localStorage.parhaatPisteet);
			s.parhaatMatkat	= JSON.parse(localStorage.parhaatMatkat);
			s.rahat			= parseInt(localStorage.rahat);
			s.matkaYht		= parseInt(localStorage.matkaYht);
			s.tavoiteData		= JSON.parse(localStorage.tavoiteData);
			s.omatKentat		= JSON.parse(localStorage.omatKentat);
			s.asetukset		= JSON.parse(localStorage.asetukset);
			s.elvytysjuomat	= parseInt(localStorage.elvytysjuomat);
			s.biomi			= parseInt(localStorage.valittuKentta);
			s.tutoriaaliData	= JSON.parse(localStorage.tutoriaali);
			console.log("Pelitietojen lataaminen onnistui!");
		}else{
			// Luodaan uudet pelitiedot mikäli puuttuvat
			console.log("Luodaan uusia pelitietoja...");
			localStorage.parhaatPisteet			= JSON.stringify(s.parhaatPisteet);
			localStorage.parhaatMatkat			= JSON.stringify(s.parhaatMatkat);
			localStorage.rahat					= s.rahat;
			localStorage.matkaYht				= s.matkaYht;
			localStorage.tavoiteData			= JSON.stringify(s.tavoiteData);
			localStorage.omatKentat				= JSON.stringify(s.omatKentat);
			localStorage.asetukset				= JSON.stringify(s.asetukset);
			localStorage.elvytysjuomat			= s.elvytysjuomat;
			localStorage.valittuKentta			= s.biomi;
			localStorage.tutoriaali				= JSON.stringify(s.tutoriaaliData);

			localStorage.pelitallennusVersio	= pelitallennusVersio;
			console.log("Uudet pelitiedot on nyt luotu! Sivu päivitetään . . .");
			location.reload();
		}
	}

	// Muunnetaan vanhan tyyppinen pelitallennus uuteen
	// Tämä mahdollistaa sen, että pelitietoja ei tarvitse poistaa jos/kun tallennusmuotoon tulee muutoksia
	while(parseInt(localStorage.pelitallennusVersio) < pelitallennusVersio || isNaN(parseInt(localStorage.pelitallennusVersio))){
		let uusiVersio;
		console.log("Päivitetään pelitallennus...");
		switch(localStorage.pelitallennusVersio){
			case "0":
			case "undefined":
				// Mahdollista useampien pisteiden tallennus
				s.parhaatPisteet=[localStorage.parhaatPisteet,0,0,0,0];
				localStorage.parhaatPisteet=JSON.stringify(s.parhaatPisteet);
				uusiVersio = 1;
			break;
			case "1":
				// Mahdollista äänen päälle/pois laittaminen
				(s.asetukset as Record<string, unknown>)["aani"] = 1;
				localStorage.asetukset = JSON.stringify(s.asetukset);
				uusiVersio = 2;
			break;
			case "2":
				// Lisää Hall Of Fame -listalle 5 uutta paikkaa
				s.parhaatPisteet.push(0);
				s.parhaatPisteet.push(0);
				s.parhaatPisteet.push(0);
				s.parhaatPisteet.push(0);
				s.parhaatPisteet.push(0);
				localStorage.parhaatPisteet=JSON.stringify(s.parhaatPisteet);
				uusiVersio = 3;
			break;
			case "3":
				// Mahdollista elvytysjuomien käyttö
				localStorage.elvytysjuomat = 0;
				uusiVersio = 4 ;
			break;
			case "4":
				// Mahdollista pelitavan muuttaminen
				s.asetukset["ohjausTapa"] = CONTROL_MOUSE;
				localStorage.asetukset = JSON.stringify(s.asetukset);
				uusiVersio =  5;
			break;
			case "5":
				// Valittu biomi tallentuu, jotta se on valmiina seuraavalla pelin käynnistyskerralla
				s.biomi=0;
				localStorage.valittuKentta = s.biomi;
				uusiVersio = 6;
			break;
			case "6":
				// Tutoriaali
				localStorage.tutoriaali = JSON.stringify(s.tutoriaaliData);
				uusiVersio = 7;
			break;
			case "7":
				// Parhaat matkat
				localStorage.parhaatMatkat = JSON.stringify(s.parhaatMatkat);
				uusiVersio = 8;
			break;
		}
		localStorage.pelitallennusVersio=uusiVersio;
		console.log("Pelitallennus päivitetty versioon "+uusiVersio+" onnistuneesti.");
	}
}
