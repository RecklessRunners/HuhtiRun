import { s } from "./state";
import { formatThousands } from "./util";
import { GOAL_ADDICT_TOTAL_DISTANCE, GOAL_ATHLETE_DISTANCE, GOAL_ELITE_DISTANCE, GOAL_IMMORTAL_REVIVES, GOAL_RICH_MONEY, GOAL_RUNNER_DISTANCE, LOADING_SLOGAN_COUNT } from "./constants/gameplay";
import { GOAL_DATA_MAX_MONEY, GOAL_DATA_MAX_REVIVES } from "./constants/ids";

// Pelin staattinen data: kentät eli biomit, tutoriaali, latausviestit ja tekijälista

export const biomiVarit = [ // Alapalkissa käytettävä väri
	"d38f46",
	"1d5911",
	"0c7ee2",
	"292a2d",
	"286a22",
	"0e0d2b"
];
export const biomiKuvat = [ // Taustakuvan numerot, kullekin biomille (esimerkiksi aavikolle arvotaan summamutikassa jokin ensimmäisen rivin taustakuvista)
	[0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,3,4,4,4,5],
	[1,2],
	[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,11,12], // 
	[7,8],
	[9,9,9,10],
	[13,13,13,13,13,14,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,15,18,18,18,18]
];
export const biomiTieSuoraanKuvat = [
	[0,0,0,0,0,0,1,4],
	[2,2,2,2,2,2,3,5],
	[6],
	[7,7,7,8],
	[9,10],
	[11]
];
export const biomiTieVaakaanKuvat = [
	[0],
	[1],
	[2],
	[3,3,3,4],
	[5],
	[6]
];
export const biomiTieVYKuvat = [
	[1],
	[0],
	[2],
	[3],
	[4],
	[5]
];
export const biomiTieOYKuvat = [
	[0],
	[1],
	[2],
	[3],
	[4],
	[5]
];
export const biomiTieVasKuvat = [
	[0],
	[1],
	[2],
	[3],
	[4,4,4,4,5,6],
	[7]
];
export const biomiTieOikKuvat = [
	[2],
	[0,1],
	[3],
	[4],
	[5,5,5,5,6,7],
	[8]
];

export const tutoriaali = [
	"Hyppää ansan yli",
	"Osta kenttä"
];

export const biomiTyypit = [
	"Aavikko",
	"Niitty",
	"Meri",
	"Luola",
	"Metsä",
	"Avaruus"
];


// Arvotaan lataustekstejä
export const ohjausTavat = ["Hiiri/kosketusnäyttö","Näppäimistö"]; // Pelin ohjaamistavat

export const latausSloganit = [
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
export const latausSloganitArvottu = [];
for(let i=0;i<LOADING_SLOGAN_COUNT;i++){
	const satunnainenSloganId = Math.floor(Math.random()*latausSloganit.length);
	latausSloganitArvottu.push(latausSloganit[satunnainenSloganId]);
	latausSloganit.splice(satunnainenSloganId,1);
}

export const tekijat = {
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

// Tavoitteet

export const tavoitteet = [
	{
		nimi:"Lenkkeilijä",
		kuvaus:"Juokse "+formatThousands(GOAL_RUNNER_DISTANCE)+" metriä yhden pelin aikana!",
		vaatimus:function(){return 1/GOAL_RUNNER_DISTANCE*s.parhaatMatkat[0];}
	},
	{
		nimi:"Urheilija",
		kuvaus:"Juokse "+formatThousands(GOAL_ATHLETE_DISTANCE)+" metriä yhden pelin aikana!",
		vaatimus:function(){return 1/GOAL_ATHLETE_DISTANCE*s.parhaatMatkat[0];}
	},
	{
		nimi:"Huippu-urheilija",
		kuvaus:"Juokse "+formatThousands(GOAL_ELITE_DISTANCE)+" metriä yhden pelin aikana!",
		vaatimus:function(){return 1/GOAL_ELITE_DISTANCE*s.parhaatMatkat[0];}
	},
	{
		nimi:"Addikti",
		kuvaus:"Juokse "+formatThousands(GOAL_ADDICT_TOTAL_DISTANCE)+" metriä koko aikana.",
		vaatimus:function(){return 1/GOAL_ADDICT_TOTAL_DISTANCE*s.matkaYht;}
	},
	{
		nimi:"Kuolematon",
		kuvaus:"Elvytä itsesi viidesti yhden pelin aikana.",
		vaatimus:function(){return 1/GOAL_IMMORTAL_REVIVES*s.tavoiteData[GOAL_DATA_MAX_REVIVES];}
	},
	{
		nimi:"Rikas",
		kuvaus:"Hanki "+formatThousands(GOAL_RICH_MONEY)+" (HR) vähintään kerran.",
		vaatimus:function(){return 1/GOAL_RICH_MONEY*s.tavoiteData[GOAL_DATA_MAX_MONEY];}
	},
	{
		nimi:"Mestari",
		kuvaus:"Helppo. Kerää kaikki muut tavoitteet.",
		vaatimus:function(){return s.kokonaisSuoritus;}
	}
];
