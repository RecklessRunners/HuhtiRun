import { ENEMY_CAUGHT_DISTANCE, INITIAL_MAX_BONUS, INITIAL_PLAYER_SPEED, INITIAL_SHIELD, MAX_RECORDS, ROAD_EDGE_TOLERANCE } from "./constants/gameplay";
import { CANVAS_WIDTH, START_LANE_X } from "./constants/geometry";
import { BIOME_DESERT, CONTROL_MOUSE, GOAL_DATA_SIZE, SCREEN_MENU } from "./constants/ids";
// Pelin jaettu muuttuva tila. ES-moduulien tuonteja ei voi sijoittaa uudelleen,
// joten kaikki moduulien välillä jaettu tieto on tämän olion kenttinä (s.rahat, s.tila, ...).

export const canvas = document.querySelector("canvas");
export const ctx = canvas.getContext ? canvas.getContext("2d") : null;


export const s = {
	grd: undefined,
	aanenVoimakkuus: undefined,
	alkupotkaisu: 0, // Kertoo vastaavalla tavalla, mutta sen sijaan matkan jonka verran hahmolla on alkupotkaisua jäljellä
	asetukset: {
		varina 		: true,
		aani		: true,
		ohjausTapa	: CONTROL_MOUSE
	},
	asteluku: 0, // Ukon kääntyminen radiaaneissa
	biomi: BIOME_DESERT, // Nykyinen biomi
	bonusKerroin: 1,
	elvytysRuutu: false, // Onko hahmo elvytettävissä
	elvytysjuomat: 0, // Montako kertaa hahmo kyetään elvyttämään
	hengissa: false, // Kertoo onko hahmo hengissä vai ei
	hiiriAlasX: 0, // X-sijainti, jossa hiiri painettiin alas
	hyppy: false, // Hyppääkö peliukko (ts. onko peliukko ilmassa)
	inaktiivinenMenu: false, // Onko valikon painikkeet painettavissa
	kokonaisSuoritus: 0, // Kaikkien tavoitteiden suoritusprosenttien k.a.
	kolikot: [], // Ei käytössä
	latauspalkkiX: 0,
	lentavatObjektit: [
		// [kuva,x,y,liikkumisnopeusX,liikkumisnopeusY,adaptiivinenLiike,asento,pyoriminen,adaptiivinenPyoriminen]
	],
	maasto: undefined,
	maastomuoto: undefined,
	matkaYht: 0, // Matka jonka pelihahmo koko elinaikanansa on taittanut
	maxBonuspisteet: INITIAL_MAX_BONUS, // Bonusmittari tulee täyteen kun hahmo on juossut tämän verran metrejä vahingoittumatta
	oliRisteys: false, // Oliko edellinen palikka risteyspalikka
	omatKentat: [true,false,false,false,false], // Ostetut kentät
	parhaatMatkat: new Array(MAX_RECORDS).fill(0), // Matkaennätykset
	parhaatPisteet: new Array(MAX_RECORDS).fill(0), // Piste-ennätykset
	pelaaNo: 0, // Tämä luku suurenee jatkuvasti. Mahdollistaa automatisoitujen siniaaltojen luomista.
	pelikerrat: 0, // Kertoo monesko elvytyskerta, nollautuu kun aloitetaan uusi peli
	pelitallennusVersio: undefined,
	pisteytetaan: false, // Juoksevatko numerot elvytysruudussa
	rahat: 0, // Koko omaisuus
	striikki: 0, // Kuinka monta metriä on päästy täysin vahingoittumatta
	suojakilpi: INITIAL_SHIELD, // Kertoo kuinka monen "peliruudun" ajan peliukkelilla on suojakilpeä jäljellä
	tarkkuusLisa: undefined,
	tavoiteData: new Array(GOAL_DATA_SIZE).fill(0), // Sisältää tavoitteisiin liittyvää raakadataa
	tavoiteNo: 0, // Tavoitteen numero, jota katsotaan Tavoitteet-sivulla
	tavoiteX: 0, // X-koordinaatti, johon pelihahmo pyrkii pääsemään
	tekijaLaskuri: undefined,
	tie: undefined,
	tieMuutos: 0, // ?
	tila: SCREEN_MENU, // Missä valikossa ollaan
	tummuus: 1, // Näytön tummuus, joka esimerkiksi luolakentässä on korkeampi
	tutoriaaliData: [
		false, // Hyppääminen
		false // Kentän ostaminen
	],
	ukkoToleranssi: ROAD_EDGE_TOLERANCE, // Tällä voit säätää, kuinka paljon peliukkeli saa mennä tien ohi ennen kuin vahingoittuu (px)
	vihuAsteluku: 0, // Vihun kääntyminen radiaaneissa
	x: 0, // Hiiren nykyinen posiitio
	y: 0,
	ylos: undefined,
	versioId: "", // Muuttuu automaattisesti kommitin id:n mukaan
	klikkiPos: [0,0],
	iUkko: 0,
	ukkoX: START_LANE_X,
	pelaajaNopeus: INITIAL_PLAYER_SPEED,
	veriSiirtyma: canvas.height,
	veriSiirtymaNyt: undefined,
	iVihu: 1,
	vihuTavoiteX: START_LANE_X,
	vihuX: START_LANE_X,
	tekijaSkrolli: undefined,
	vihuSiirtyma: ENEMY_CAUGHT_DISTANCE,
	pisteet: 0,
	matka: 0,
	pisteytys: 0,
	bonuspisteet: 0,
	tieMinMax: [0, CANVAS_WIDTH],
	tauko: false,
	ukkoLiikkuuX: 0,
	siirtoY: 0,
};
