import { s } from "./state.js";

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
for(let i=0;i<5;i++){
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
		kuvaus:"Juokse 250 metriä yhden pelin aikana!",
		vaatimus:function(){return 1/250*s.parhaatMatkat[0];}
	},
	{
		nimi:"Urheilija",
		kuvaus:"Juokse 500 metriä yhden pelin aikana!",
		vaatimus:function(){return 1/500*s.parhaatMatkat[0];}
	},
	{
		nimi:"Huippu-urheilija",
		kuvaus:"Juokse 750 metriä yhden pelin aikana!",
		vaatimus:function(){return 1/750*s.parhaatMatkat[0];}
	},
	{
		nimi:"Addikti",
		kuvaus:"Juokse 20 000 metriä koko aikana.",
		vaatimus:function(){return 1/20000*s.matkaYht;}
	},
	{
		nimi:"Kuolematon",
		kuvaus:"Elvytä itsesi viidesti yhden pelin aikana.",
		vaatimus:function(){return 1/5*s.tavoiteData[2];}
	},
	{
		nimi:"Rikas",
		kuvaus:"Hanki 20 000 (HR) vähintään kerran.",
		vaatimus:function(){return 1/20000*s.tavoiteData[0];}
	},
	{
		nimi:"Mestari",
		kuvaus:"Helppo. Kerää kaikki muut tavoitteet.",
		vaatimus:function(){return s.kokonaisSuoritus;}
	}
];
