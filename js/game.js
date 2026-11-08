import { ambientti, auts, bonusAani, korkeaAani, kyltti, lataus, lentavaObjekti, menuMusiikki, tausta, tieSuoraan, tieVaakaan, ukko, vihu } from "./assets.js";
import { soitaAani, varise } from "./audio.js";
import { tavoitteet, tutoriaali } from "./data.js";
import { vahvista } from "./modals.js";
import { piirraAsetukset } from "./screens/asetukset.js";
import { piirraHud } from "./screens/hud.js";
import { piirraKenttavalinta } from "./screens/kentat.js";
import { kasitteleKuolema } from "./screens/kuolema.js";
import { piirraTavoitteet } from "./screens/tavoitteet.js";
import { piirraTekijat } from "./screens/tekijat.js";
import { piirraTilastot } from "./screens/tilastot.js";
import { piirraPaavalikko, piirraRahat, piirraValikonTausta } from "./screens/valikko.js";
import { piirraHyppyNappi, piirraUkko, piirraVarjo, piirraVihu } from "./sprites.js";
import { s, canvas, ctx, ukkoY } from "./state.js";
import { jatkaTieOikeaan, jatkaTieRisteykseen, jatkaTieVasempaan, jatkaTieYlos, piirraMaasto } from "./terrain.js";
import { kirjoita } from "./util.js";

// Pelin tutoriaalitehtävän suoritus
export function tutoriaaliSuoritettu(tutId){
	if(s.tutoriaaliData[tutId] == false){
		s.tutoriaaliData[tutId] = true;
		tiedote("Tutoriaali","Tehtävä \""+tutoriaali[tutId]+"\" suoritettu.");
		localStorage.tutoriaali = JSON.stringify(s.tutoriaaliData);
	}
}

function tiedote(otsikko,teksti){
	s.tauko=true;
	//alert(otsikko+"\n\n"+teksti);
}

// Hoitaa kaiken päivityksen: pelin logiikan ja piirron yhdellä askeleella
export function paivita(){		
	s.maxBonuspisteet = Math.round(10 + (10 * s.bonusKerroin));

	if(s.hengissa && !s.tauko){
		if(s.asetukset.ohjausTapa=="1"){
			s.tavoiteX += s.ukkoLiikkuuX;
			s.tavoiteX = Math.max(-96,s.tavoiteX);
			s.tavoiteX = Math.min(canvas.width-96,s.tavoiteX);
		}
	}

	const veriSiirtymaV = Math.abs((Math.max(s.veriSiirtymaNyt,s.veriSiirtyma)-Math.min(s.veriSiirtymaNyt,s.veriSiirtyma))/2);
	if(s.veriSiirtyma != s.veriSiirtymaNyt){
		if(s.veriSiirtyma<s.veriSiirtymaNyt){
			s.veriSiirtymaNyt -= veriSiirtymaV;
		}else{
			s.veriSiirtymaNyt += veriSiirtymaV;
		}
	}

	// Laske tavoitteiden suoritusprosentti
	if(!s.hengissa){
		s.kokonaisSuoritus=0;
		tavoitteet.forEach(function(v){
			s.kokonaisSuoritus+=Math.min(v.vaatimus(),1);
		});
		s.kokonaisSuoritus = s.kokonaisSuoritus/tavoitteet.length;
	}

	s.pelaaNo += 0.5;
	
	const liikkuuY = true;

	// Siirrä ukkoa
	if(s.tavoiteX != s.ukkoX){
		let posErotus;
	
		if(s.alkupotkaisu>0){
			posErotus = Math.abs(s.ukkoX-s.tavoiteX)/1.2;
		}else{
			posErotus = Math.abs(s.ukkoX-s.tavoiteX)/5;
		}

		s.asteluku = Math.min(Math.PI/2,Math.PI/2/32*posErotus);
		
		if(s.tavoiteX > s.ukkoX){
			s.ukkoX += posErotus;
		}else{
			s.ukkoX -= posErotus;
			s.asteluku = -s.asteluku;
		}
	}
	
	// Siirrä vihua
	if(s.vihuTavoiteX != s.vihuX){
		let vihuPosErotus;
	
		if(s.alkupotkaisu>0){
			vihuPosErotus = Math.min(Math.abs(s.vihuX-s.vihuTavoiteX)/1.25,s.pelaajaNopeus*4);
		}else{
			vihuPosErotus = Math.min(Math.abs(s.vihuX-s.vihuTavoiteX)/5,s.pelaajaNopeus*4);
		}

		s.vihuAsteluku = Math.min(Math.PI/2,Math.PI/2/32*vihuPosErotus);
		
		if(s.vihuTavoiteX > s.vihuX){
			s.vihuX += vihuPosErotus;
		}else{
			s.vihuX -= vihuPosErotus;
			s.vihuAsteluku = -s.vihuAsteluku;
		}
	}

	// Pienennä musiikin äänenvoimakkuutta, kun vihollinen on lähempänä, ollaan menuissa, ym.
	if(s.tauko){
		s.aanenVoimakkuus=0;
	}else{
		s.aanenVoimakkuus=Math.min(1,1/176*(s.vihuSiirtyma-80));
	}
	if(s.hengissa && !s.tauko){
		korkeaAani[0].volume=Math.max(0,.6-s.aanenVoimakkuus);
		tausta[0].volume=s.aanenVoimakkuus;
		menuMusiikki[0].volume=Math.max(0,menuMusiikki[0].volume-0.02);
	}else{
		korkeaAani[0].volume=0;
		if(!s.elvytysRuutu){
			if(lataus.ladatut >= lataus.kaikki){
				menuMusiikki[0].volume=Math.min(1,menuMusiikki[0].volume+0.02);
				ambientti[0].volume=Math.max(0,ambientti[0].volume-0.02);
			}
		}else{
			menuMusiikki[0].volume=Math.min(0.5,menuMusiikki[0].volume+0.02);
		}
		tausta[0].volume=Math.max(0,tausta[0].volume-0.02);
	}

	// Siirtää vihollista hitaasti taaksepäin
	if(Math.ceil(Math.random()*16)==16 && !s.tauko){
		s.vihuSiirtyma -= Math.floor(3/512*s.vihuSiirtyma);
	}

	s.vihuSiirtyma = Math.min(384,s.vihuSiirtyma+.375);
	if(s.vihuSiirtyma>256 && !s.tauko){
		s.vihuSiirtyma-=1.5;
	}
	
	// Ukon sekä vihollisen animointi
	s.iUkko+=1;
	if(s.iUkko>=ukko.length){
		s.iUkko=0;
	}

	s.iVihu+=1;
	if(s.iVihu>=vihu.length){
		s.iVihu=0;
	}

	//Piirrä oliota ja asioita.
	piirraMaasto(s.siirtoY);
	piirraVihu(s.iVihu,s.vihuX, ukkoY+s.vihuSiirtyma);
	piirraVarjo();
	piirraUkko(s.iUkko,s.ukkoX,ukkoY);
	piirraHyppyNappi();
	
	// Piirretään lentävät objektit
	if(s.biomi==5){
		s.lentavatObjektit.forEach(function(v,i){
			// [kuva,x,y,liikkumisnopeusX,liikkumisnopeusY,adaptiivinenLiike,asento,pyoriminen,adaptiivinenPyoriminen]
			if(v != undefined){
				if(!s.tauko){
					let adaptiivisuus = 10;
					if(v[5]){
						adaptiivisuus = s.pelaajaNopeus;
					}
					if(s.alkupotkaisu > 0 && s.hengissa){
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
					s.lentavatObjektit.splice(i,1)
				}
			}
		});
	}
	
        
        // Missä tie?
        if (s.siirtoY>ukkoY-100){ // Tien tutkiminen: Voi joutua muuttamaan lukua
            const tieKoordinaatit =[];
            let min = 1152;
            let max = 0;
            for (let i=0; i<s.maasto.length; i++){ // X-suuntaan
                tieKoordinaatit.push(s.maastomuoto[i][1]);
            }
            min = tieKoordinaatit.indexOf(1);
            max = tieKoordinaatit.lastIndexOf(1);

            s.tieMinMax = [192*min, 192*(max+1)];
            // console.log("Koord " + tieMinMax );
            // console.log("Paikkaa " +  tieKoordinaatit );
        }
	let puolivali = Math.floor((s.tieMinMax[0]+s.tieMinMax[1])/2/192)*192;
	if(s.suojakilpi>2){
		s.tavoiteX=puolivali;
	}

        //Ukko ja tie
	if((s.ukkoX<(s.tieMinMax[0]-s.ukkoToleranssi) || s.ukkoX > s.tieMinMax[1]+s.ukkoToleranssi-120) && !s.tauko){
		puolivali = Math.floor((0.5*(s.tieMinMax[0] + s.tieMinMax[1]))/192)*192;
		if(s.suojakilpi <= 0 && !s.hyppy){
			s.ukkoX=puolivali;
			s.tavoiteX=puolivali;
			s.vihuSiirtyma -= 64 + Math.round(Math.random()*48);
			s.suojakilpi+=2;
			if(s.hengissa){
				s.striikki=0;
				varise(500);
				s.bonuspisteet = Math.max(0,s.bonuspisteet-(s.maxBonuspisteet/2));
				s.bonusKerroin = 1;
				soitaAani(auts[0]);
			}
		}
	}

	// Tunnista tietyyppi (kuolee mikäli kompastuu puuhun, tippuu kuiluun ym.)
	// Suoraan menevät tiet

		const ukonRuutu = Math.max(1,Math.min(4,Math.round(s.ukkoX/192)));
	
		if(s.maasto[ukonRuutu][1]==tieSuoraan[1] || s.maasto[ukonRuutu][1]==tieSuoraan[4] || s.maasto[ukonRuutu][1]==tieSuoraan[8]){
			if(s.hyppy){
				tutoriaaliSuoritettu(0);
			}else{
				if(!s.hengissa && s.siirtoY>144){
					s.hyppy=true;
					setTimeout(function(){s.hyppy=false;},750);
				}
				if(s.suojakilpi<=0 && s.siirtoY>144){
					s.vihuSiirtyma=95;
				}
			}
		}

	// Vaakaan menevät tiet
	// xxxxxxxxxxxxxxxxxxxxxxxx
	if(!s.hyppy && s.suojakilpi<=0){
		// TODO: siirtoX ei ole määritelty missään (heittää ReferenceErrorin), tarkoitus epäselvä
		// eslint-disable-next-line no-undef
		if(s.maasto[Math.round(s.ukkoX/192)][1]==tieVaakaan[4] && siirtoX>144){
			s.vihuSiirtyma=95;
		}
	}

	// Maaston liikuttaminen
	const striikkiJako = 1;
	if(!s.tauko){
		if(s.alkupotkaisu>0 && s.hengissa){
			s.siirtoY+=s.pelaajaNopeus*5/striikkiJako;
		}else{
			s.siirtoY+=s.pelaajaNopeus/striikkiJako;
		}
	}

	if (s.siirtoY >= 192){
		s.siirtoY=0;
		s.tieMuutos += 1;
		
		if(s.hengissa && !s.tauko){
			s.pisteet += 1;
			s.matka += 1;
			s.bonuspisteet += 1;
			s.striikki += 1;
			if(s.suojakilpi>0){
				s.suojakilpi-=1;
			}
			if(s.alkupotkaisu>4){
				s.alkupotkaisu-=1;
				s.suojakilpi=4;
			}else{
				s.alkupotkaisu=0;
			}
		}
		
		// Luodaan lentäviä objekteja
		if(Math.random()<0.15){
			if(s.biomi==5){
				const objektiNro = Math.floor(Math.random()*3);
				switch(objektiNro){
					case 0:
						if(s.lentavatObjektit.length<3){
							s.lentavatObjektit.push([
								lentavaObjekti[0], // Kuvatiedosto
								Math.random()*canvas.width-96, // Satunnainen aloitus X-piste
								-384, // Aloitus Y-piste
								0, // Satunnainen liikkumisnopeus (X)
								(1.5+Math.random())/10*s.pelaajaNopeus,  // Satunnainen liikkumisnopeus (Y)
								true, // Adaptiivinen nopeus (eli objekti menee suhteessa nopeampaa silloin kun hahmokin menee)
								Math.PI*2*Math.random(), // Pyörimisen aloituspiste
								(Math.random()*2-1)*(Math.PI/100), // Pyörimisen nopeus (0 = ei pyöri)
								false // Adaptiivinen pyörimisnopeus (eli objekti pyörii sitä nopeammin mitä nopeammin hahmo liikkuu)
							]);
						}
					break;
					case 1:
						for(let i=0;i<5;i++){ // Luodaan 5 kappaletta
							s.lentavatObjektit.push([
								lentavaObjekti[Math.floor(Math.random()*3)+1], // Kuvatiedosto
								Math.random()*canvas.width-96, // Satunnainen aloitus X-piste
								-384, // Aloitus Y-piste
								0, // Satunnainen liikkumisnopeus (X)
								(3+Math.random()*2)/10*s.pelaajaNopeus,  // Satunnainen liikkumisnopeus (Y)
								true, // Adaptiivinen nopeus (eli objekti menee suhteessa nopeampaa silloin kun hahmokin menee)
								Math.PI*2*Math.random(), // Pyörimisen aloituspiste
								(Math.random()*2-1)*(Math.PI/50), // Pyörimisen nopeus (0 = ei pyöri)
								false // Adaptiivinen pyörimisnopeus (eli objekti pyörii sitä nopeammin mitä nopeammin hahmo liikkuu)
							]);
						}
					break;
					case 2:
						s.lentavatObjektit.push([
							lentavaObjekti[4], // Kuvatiedosto
							Math.random()*canvas.width-96, // Satunnainen aloitus X-piste
							-384, // Aloitus Y-piste
							-((1.5+Math.random())*s.pelaajaNopeus*2), // Satunnainen liikkumisnopeus (X)
							(1.5+Math.random())*s.pelaajaNopeus*2,  // Satunnainen liikkumisnopeus (Y)
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
		for (let j=s.maasto[0].length-1; j>0; j--){
			for (let i=0; i < s.maasto.length; i++){
				//console.log("J I : " + j +" " +i  );
				s.maasto[i][j]=s.maasto[i][j-1]; 
				s.maastomuoto[i][j]=s.maastomuoto[i][j-1];
			}
		}

		// Päivitys funtsittu, eli ok. 
		// 1. Suoraan / käännös oikealle / käännös vasemmalle
		// 	i=0 => Ei vasemmalle
		// 	i=4 => Ei oikealle
		// 2. Tee välisuorat
		// 3. Päivitä maasto / maastomuoto

		const Suunta = Math.random();
		if(s.tieMuutos>2){ // Lukua muuttamalla voit säätää paljonko tulee ylöspäin tulevaa tietä aina mutkan jälkeen vähintään
			if (s.tie == 0){
				//Vasen reuna: ylös tai oikealle
				if(Suunta < 0.75){ //Oikealle
					s.tie = jatkaTieOikeaan(s.tie);
					s.tieMuutos=0;
				}else{ //Ylös
					s.tie = jatkaTieYlos(s.tie);
				}
			}else if (s.tie==4){
				//Oikea reuna; ylös tai vasemmalle
				if(Suunta < 0.75){ //Vasemmalle
					s.tie = jatkaTieVasempaan(s.tie);
					s.tieMuutos=0;
				}else{ //Ylös
					s.tie = jatkaTieYlos(s.tie);
				}
			}else{
				//Tie on oikean ja vasemman reunan välissä
				if (Suunta < 0.3){ // Vasemmalle
					s.tie = jatkaTieVasempaan(s.tie);
					s.tieMuutos=0;
				}else if(Suunta < 0.6){ // Oikealle
					s.tie = jatkaTieOikeaan(s.tie); 
					s.tieMuutos=0;
				}else if(Suunta < 0.9){ // Risteys
					s.oliRisteys=s.tie;
					s.tie = jatkaTieRisteykseen(s.tie);
					s.tieMuutos=0;
				}else{ // Ylös
					s.tie = jatkaTieYlos(s.tie);
				}
			}
		}else{
			s.tie = jatkaTieYlos(s.tie);
		}
		
		// Luo kyltin risteyksen jälkeen mikäli ollaan metsäbiomissa
		if(s.tieMuutos>0 && s.biomi==4){
			if(s.oliRisteys != false){
				s.maasto[s.oliRisteys][0] = kyltti[0];
				s.oliRisteys=false;
			}
		}
		
		for(let i=0;i<s.maastomuoto.length;i++){
			if(s.maastomuoto[i][2]==1){
				s.vihuTavoiteX=192*i; // Asetetaan X-sijainti, johon vihu pyrkii
			}
		}

	}

	if(s.hengissa){
		// Kirjoita nykyiset pisteet
		ctx.textAlign="center";
			kirjoita(Math.round(s.pisteet),canvas.width/5*2,48,true,32,"#FFF","'Raleway'");
			kirjoita("PISTEET",canvas.width/5*2,72,true,12,"silver","'Raleway'");
			kirjoita(Math.round(s.matka),canvas.width/5*3,48,true,32,"#FFF","'Raleway'");
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
		const pylvasK = Math.min(384,Math.round(384/(s.maxBonuspisteet*192)*((s.bonuspisteet-1)*192+s.siirtoY)));
		ctx.rect(32,Math.min(480,384-pylvasK+96),16,pylvasK);
		ctx.closePath();
		
		if(s.bonuspisteet > s.maxBonuspisteet-1){
			if(s.pelaaNo % 1){
				ctx.fillStyle = "lime";
			}else{
				ctx.fillStyle = "gold";
			}
		}else{
			ctx.fillStyle = "gold";
		}
		
		ctx.fill();
		
		kirjoita("+"+(20*s.bonusKerroin),64,160,true,32,"#FFF","'Raleway'");

		if(s.bonuspisteet > s.maxBonuspisteet){
			s.bonuspisteet = 0;
			s.bonusKerroin += 1;
			s.pisteet += 20 * s.bonusKerroin;
			soitaAani(bonusAani[0]);
		}
	}
	
	// Varjo
	//ctx.fillStyle="rgba(0,0,0,.2)";

	if(s.vihuSiirtyma<192 && s.hengissa){
		ctx.textAlign="center";
		const keskiosa = {"x":canvas.width/2,"y":canvas.height/2};
		const sydanKoko = Math.sin(s.pelaaNo*2) * 8 + 64;
		kirjoita("♥",keskiosa.x, keskiosa.y - sydanKoko/2, true, sydanKoko, "red", "'Raleway'");
		kirjoita("Olet hengenvaarassa",keskiosa.x,keskiosa.y+32,true,24,"red");
		ctx.textAlign="start";
	}

	if(s.biomi==3){
		s.tummuus += .005;
		s.tummuus = Math.min(s.tummuus,.7);
	}else{
		s.tummuus -= .02;
		s.tummuus = Math.max(s.tummuus,0);
	}

	if(s.tummuus>0){
		ctx.fillStyle="rgba(0,0,0,"+Math.min(s.tummuus,.7)+")";
		ctx.fillRect(0,0,960,576);
	}

	if(s.tauko){
		s.tummuus=0.5;
		ctx.textAlign="center";
			kirjoita("Tauolla",canvas.width/2,192,true,48,"#FFF","'Raleway'");
			kirjoita("Jatka peliä",canvas.width/2,256,true,24,"#C0C0C0","'Source Sans Pro'");
			kirjoita("Siirry valikkoon",canvas.width/2,256+48,true,24,"#C0C0C0","'Source Sans Pro'");
		ctx.textAlign="start";
	}

	s.pelaajaNopeus = 10 + Math.round(0.0075*s.pisteet); // Peli nopeutuu, mitä pitemmälle siinä päästään
	
	// Kun vihu saa pelaajan kiinni, mene päävalikkoon
	if(s.vihuSiirtyma<96){
		kasitteleKuolema();

		piirraValikonTausta();
			
		if(s.tila==0){
			piirraPaavalikko();
		}
		if(s.tila==0 || s.tila==1){
			piirraRahat();
		}
		if(s.tila==1){
			piirraKenttavalinta();
		}
		if(s.tila==2){
			piirraTavoitteet();
		}
		if(s.tila==3){
			piirraTilastot();
		}
		if(s.tila==4){
		
			piirraTekijat();
		}
		if(s.tila==5){
			piirraAsetukset();
		}
	}
	piirraHud();
}

// Klikkaus kesken pelin (tauko-painike ja taukovalikko)
export function kasittelePelinKlikkaus(){
	if(!s.tauko){
		s.klikkiPos=[s.x,s.y];
		varise(100);
		if(s.x>canvas.width-48 && s.y<64){
			if(s.tauko){
				s.tauko=false;
			}else{
				s.tauko=true;
			}
		}
	}else{
		//yoloyolo
		if(s.x>384 && s.x<canvas.width-384){
			if(s.y>=256-24 && s.y<256+24){
				s.tauko=false;
			}
			if(s.y>=256+24 && s.y<256+48){
				vahvista("Haluatko lopettaa pelin ja siirtyä valikkoon?", function(){
					s.tauko=false;
					s.vihuSiirtyma=95;
				});
			}
		}
	}
}
