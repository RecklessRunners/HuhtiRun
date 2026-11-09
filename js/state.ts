import { ENEMY_CAUGHT_DISTANCE, INITIAL_MAX_BONUS, INITIAL_PLAYER_SPEED, INITIAL_SHIELD, MAX_RECORDS, ROAD_EDGE_TOLERANCE } from "./constants/gameplay";
import { CANVAS_WIDTH, ROAD_START_COLUMN, START_LANE_X } from "./constants/geometry";
import { BIOME_DESERT, CONTROL_MOUSE, GOAL_DATA_SIZE, SCREEN_MENU } from "./constants/ids";
// Pelin jaettu muuttuva tila. ES-moduulien tuonteja ei voi sijoittaa uudelleen,
// joten kaikki moduulien välillä jaettu tieto on tämän olion kenttinä (s.rahat, s.tila, ...).

const canvasElement = document.querySelector("canvas");
if(!canvasElement) throw new Error("Canvas element not found");
const context = canvasElement.getContext("2d");
if(!context) throw new Error("2D canvas context not available");
export const canvas: HTMLCanvasElement = canvasElement;
export const ctx: CanvasRenderingContext2D = context;

// [kuva,x,y,liikkumisnopeusX,liikkumisnopeusY,adaptiivinenLiike,asento,pyoriminen,adaptiivinenPyoriminen]
export type FlyingObject = [HTMLImageElement, number, number, number, number, boolean, number, number, boolean];

export interface GameState {
	grd: CanvasGradient;
	aanenVoimakkuus: number;
	alkupotkaisu: number;
	asetukset: { varina: boolean; aani: boolean; ohjausTapa: number };
	asteluku: number;
	biomi: number;
	bonusKerroin: number;
	elvytysRuutu: boolean;
	elvytysjuomat: number;
	hengissa: boolean;
	hiiriAlasX: number;
	hyppy: boolean;
	inaktiivinenMenu: boolean;
	kokonaisSuoritus: number;
	kolikot: unknown[];
	latauspalkkiX: number;
	lentavatObjektit: FlyingObject[];
	maasto: HTMLImageElement[][];
	maastomuoto: number[][];
	matkaYht: number;
	maxBonuspisteet: number;
	oliRisteys: number | false;
	omatKentat: boolean[];
	parhaatMatkat: number[];
	parhaatPisteet: number[];
	pelaaNo: number;
	pelikerrat: number;
	pisteytetaan: boolean;
	rahat: number;
	striikki: number;
	suojakilpi: number;
	tarkkuusLisa: number;
	tavoiteData: number[];
	tavoiteNo: number;
	tavoiteX: number;
	tekijaLaskuri: number;
	tie: number;
	tieMuutos: number;
	tila: number;
	tummuus: number;
	tutoriaaliData: boolean[];
	ukkoToleranssi: number;
	vihuAsteluku: number;
	x: number;
	y: number;
	ylos: number;
	versioId: string;
	klikkiPos: number[];
	iUkko: number;
	ukkoX: number;
	pelaajaNopeus: number;
	veriSiirtyma: number;
	veriSiirtymaNyt: number;
	iVihu: number;
	vihuTavoiteX: number;
	vihuX: number;
	tekijaSkrolli: number;
	vihuSiirtyma: number;
	pisteet: number;
	matka: number;
	pisteytys: number;
	bonuspisteet: number;
	tieMinMax: number[];
	tauko: boolean;
	ukkoLiikkuuX: number;
	siirtoY: number;
}


export const s: GameState = {
	grd: ctx.createLinearGradient(0,0,0,0),
	aanenVoimakkuus: 0,
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
	maasto: [],
	maastomuoto: [],
	matkaYht: 0, // Matka jonka pelihahmo koko elinaikanansa on taittanut
	maxBonuspisteet: INITIAL_MAX_BONUS, // Bonusmittari tulee täyteen kun hahmo on juossut tämän verran metrejä vahingoittumatta
	oliRisteys: false, // Oliko edellinen palikka risteyspalikka
	omatKentat: [true,false,false,false,false], // Ostetut kentät
	parhaatMatkat: new Array(MAX_RECORDS).fill(0), // Matkaennätykset
	parhaatPisteet: new Array(MAX_RECORDS).fill(0), // Piste-ennätykset
	pelaaNo: 0, // Tämä luku suurenee jatkuvasti. Mahdollistaa automatisoitujen siniaaltojen luomista.
	pelikerrat: 0, // Kertoo monesko elvytyskerta, nollautuu kun aloitetaan uusi peli
	pisteytetaan: false, // Juoksevatko numerot elvytysruudussa
	rahat: 0, // Koko omaisuus
	striikki: 0, // Kuinka monta metriä on päästy täysin vahingoittumatta
	suojakilpi: INITIAL_SHIELD, // Kertoo kuinka monen "peliruudun" ajan peliukkelilla on suojakilpeä jäljellä
	tarkkuusLisa: 0,
	tavoiteData: new Array(GOAL_DATA_SIZE).fill(0), // Sisältää tavoitteisiin liittyvää raakadataa
	tavoiteNo: 0, // Tavoitteen numero, jota katsotaan Tavoitteet-sivulla
	tavoiteX: 0, // X-koordinaatti, johon pelihahmo pyrkii pääsemään
	tekijaLaskuri: 0,
	tie: ROAD_START_COLUMN,
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
	ylos: 0,
	versioId: "", // Muuttuu automaattisesti kommitin id:n mukaan
	klikkiPos: [0,0],
	iUkko: 0,
	ukkoX: START_LANE_X,
	pelaajaNopeus: INITIAL_PLAYER_SPEED,
	veriSiirtyma: canvas.height,
	veriSiirtymaNyt: canvas.height,
	iVihu: 1,
	vihuTavoiteX: START_LANE_X,
	vihuX: START_LANE_X,
	tekijaSkrolli: 0,
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
