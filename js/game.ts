import { ambientti, auts, bonusAani, korkeaAani, kyltti, lataus, lentavaObjekti, menuMusiikki, tausta, tieSuoraan, tieVaakaan, ukko, vihu } from "./assets";
import { soitaAani, varise } from "./audio";
import { tavoitteet, tutoriaali } from "./data";
import { vahvista } from "./modals";
import { piirraAsetukset } from "./screens/asetukset";
import { piirraHud } from "./screens/hud";
import { piirraKenttavalinta } from "./screens/kentat";
import { kasitteleKuolema } from "./screens/kuolema";
import { piirraTavoitteet } from "./screens/tavoitteet";
import { piirraTekijat } from "./screens/tekijat";
import { piirraTilastot } from "./screens/tilastot";
import { piirraPaavalikko, piirraRahat, piirraValikonTausta } from "./screens/valikko";
import { piirraHyppyNappi, piirraUkko, piirraVarjo, piirraVihu } from "./sprites";
import { s, canvas, ctx } from "./state";
import { jatkaTieOikeaan, jatkaTieRisteykseen, jatkaTieVasempaan, jatkaTieYlos, piirraMaasto } from "./terrain";
import { kirjoita } from "./util";
import { ENEMY_MUSIC_MIN_DISTANCE, ENEMY_MUSIC_RANGE, HIGH_SOUND_MAX_VOLUME, MENU_MUSIC_REVIVE_VOLUME, MUSIC_FADE_STEP } from "./constants/audio";
import { ANIMATION_STEP, AUTO_JUMP_DURATION, BONUS_POINTS, BONUS_TARGET_BASE, BONUS_TARGET_PER_LEVEL, DARKNESS_CAVE_RATE, DARKNESS_FADE_RATE, DARKNESS_MAX, DARKNESS_MENU, ENEMY_CATCH_DISTANCE, ENEMY_CAUGHT_DISTANCE, ENEMY_DANGER_DISTANCE, ENEMY_DISTANCE_MAX, ENEMY_DISTANCE_PULL, ENEMY_DISTANCE_PULL_THRESHOLD, ENEMY_DISTANCE_RELAX_RATE, ENEMY_FOLLOW_DIVISOR, ENEMY_FOLLOW_DIVISOR_KICKSTART, ENEMY_MAX_STEP_PER_SPEED, ENEMY_PENALTY_BASE, ENEMY_PENALTY_RANDOM, ENEMY_RETREAT_FRACTION, ENEMY_RETREAT_ODDS, ENEMY_ROW, FLYING_BASE_SPEED, FLYING_BIG_ROTATION, FLYING_BIG_SPEED_MIN, FLYING_DIAGONAL_ANGLE, FLYING_DIAGONAL_IMAGE, FLYING_DIAGONAL_ROTATION, FLYING_DIAGONAL_SPEED_FACTOR, FLYING_MAX_SINGLE, FLYING_PATTERN_COUNT, FLYING_SMALL_COUNT, FLYING_SMALL_ROTATION, FLYING_SMALL_SPEED_MIN, FLYING_SMALL_SPEED_RANGE, FLYING_SMALL_VARIANTS, FLYING_SPAWN_CHANCE, FLYING_SPAWN_Y, FLYING_SPEED_SCALE, FLY_ADAPTIVE, FLY_ANGLE, FLY_IMAGE, FLY_ROTATION, FLY_SPEED_X, FLY_SPEED_Y, FLY_X, FLY_Y, HORIZONTAL_GAP_TILE, KICKSTART_MIN_REMAINING, KICKSTART_SPEED_MULTIPLIER, MAX_TILT, MIN_ROWS_BETWEEN_TURNS, OBSTACLE_TILES, PLAYER_BASE_SPEED, PLAYER_FOLLOW_DIVISOR, PLAYER_FOLLOW_DIVISOR_KICKSTART, PLAYER_ROW, ROAD_CROSSING_LIMIT, ROAD_EDGE_TURN_CHANCE, ROAD_LEFT_LIMIT, ROAD_RIGHT_EDGE_ALLOWANCE, ROAD_RIGHT_LIMIT, ROAD_SCAN_MARGIN, SHIELD_AFTER_OFF_ROAD, SHIELD_DURING_KICKSTART, SHIELD_RECENTER_THRESHOLD, SPEED_PER_POINT, TILE_CONTACT_PROGRESS, TILT_FULL_DISTANCE, VIBRATE_CLICK, VIBRATE_MEDIUM } from "./constants/gameplay";
import { CANVAS_HEIGHT, CANVAS_WIDTH, HALF_TILE, LAST_COLUMN, PLAYER_Y, TILE_SIZE } from "./constants/geometry";
import { BIOME_CAVE, BIOME_FOREST, BIOME_SPACE, CONTROL_KEYBOARD, SCREEN_CREDITS, SCREEN_GOALS, SCREEN_LEVELS, SCREEN_MENU, SCREEN_SETTINGS, SCREEN_STATS, TUTORIAL_JUMP } from "./constants/ids";
import { BONUS_BAR_BOTTOM, BONUS_BAR_HEIGHT, BONUS_BAR_WIDTH, BONUS_BAR_X, BONUS_BAR_Y, BONUS_LABEL_X, BONUS_LABEL_Y, FONT_CAPTION, FONT_HEADING, FONT_SUBTITLE, FONT_TITLE, HEART_BASE_SIZE, HEART_PULSE_SIZE, HEART_PULSE_SPEED, HUD_DISTANCE_SLOT, HUD_LABEL_Y, HUD_SCORE_SLOT, HUD_SLOTS, HUD_VALUE_Y, PAUSE_BUTTON_HEIGHT, PAUSE_BUTTON_WIDTH, PAUSE_MENU_MARGIN, PAUSE_RESUME_Y, PAUSE_ROW_HALF_HEIGHT, PAUSE_ROW_HEIGHT, PAUSE_TITLE_Y, WARNING_TEXT_OFFSET } from "./constants/ui";

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
	s.maxBonuspisteet = Math.round(BONUS_TARGET_BASE + (BONUS_TARGET_PER_LEVEL * s.bonusKerroin));

	if(s.hengissa && !s.tauko){
		if(s.asetukset.ohjausTapa == CONTROL_KEYBOARD){
			s.tavoiteX += s.ukkoLiikkuuX;
			s.tavoiteX = Math.max(-HALF_TILE,s.tavoiteX);
			s.tavoiteX = Math.min(canvas.width-HALF_TILE,s.tavoiteX);
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

	s.pelaaNo += ANIMATION_STEP;
	
	const liikkuuY = true;

	// Siirrä ukkoa
	if(s.tavoiteX != s.ukkoX){
		let posErotus;
	
		if(s.alkupotkaisu>0){
			posErotus = Math.abs(s.ukkoX-s.tavoiteX)/PLAYER_FOLLOW_DIVISOR_KICKSTART;
		}else{
			posErotus = Math.abs(s.ukkoX-s.tavoiteX)/PLAYER_FOLLOW_DIVISOR;
		}

		s.asteluku = Math.min(MAX_TILT,MAX_TILT/TILT_FULL_DISTANCE*posErotus);
		
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
			vihuPosErotus = Math.min(Math.abs(s.vihuX-s.vihuTavoiteX)/ENEMY_FOLLOW_DIVISOR_KICKSTART,s.pelaajaNopeus*ENEMY_MAX_STEP_PER_SPEED);
		}else{
			vihuPosErotus = Math.min(Math.abs(s.vihuX-s.vihuTavoiteX)/ENEMY_FOLLOW_DIVISOR,s.pelaajaNopeus*ENEMY_MAX_STEP_PER_SPEED);
		}

		s.vihuAsteluku = Math.min(MAX_TILT,MAX_TILT/TILT_FULL_DISTANCE*vihuPosErotus);
		
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
		s.aanenVoimakkuus=Math.min(1,1/ENEMY_MUSIC_RANGE*(s.vihuSiirtyma-ENEMY_MUSIC_MIN_DISTANCE));
	}
	if(s.hengissa && !s.tauko){
		korkeaAani[0].volume=Math.max(0,HIGH_SOUND_MAX_VOLUME-s.aanenVoimakkuus);
		tausta[0].volume=s.aanenVoimakkuus;
		menuMusiikki[0].volume=Math.max(0,menuMusiikki[0].volume-MUSIC_FADE_STEP);
	}else{
		korkeaAani[0].volume=0;
		if(!s.elvytysRuutu){
			if(lataus.ladatut >= lataus.kaikki){
				menuMusiikki[0].volume=Math.min(1,menuMusiikki[0].volume+MUSIC_FADE_STEP);
				ambientti[0].volume=Math.max(0,ambientti[0].volume-MUSIC_FADE_STEP);
			}
		}else{
			menuMusiikki[0].volume=Math.min(MENU_MUSIC_REVIVE_VOLUME,menuMusiikki[0].volume+MUSIC_FADE_STEP);
		}
		tausta[0].volume=Math.max(0,tausta[0].volume-MUSIC_FADE_STEP);
	}

	// Siirtää vihollista hitaasti taaksepäin
	if(Math.ceil(Math.random()*ENEMY_RETREAT_ODDS)==ENEMY_RETREAT_ODDS && !s.tauko){
		s.vihuSiirtyma -= Math.floor(ENEMY_RETREAT_FRACTION*s.vihuSiirtyma);
	}

	s.vihuSiirtyma = Math.min(ENEMY_DISTANCE_MAX,s.vihuSiirtyma+ENEMY_DISTANCE_RELAX_RATE);
	if(s.vihuSiirtyma>ENEMY_DISTANCE_PULL_THRESHOLD && !s.tauko){
		s.vihuSiirtyma-=ENEMY_DISTANCE_PULL;
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
	piirraVihu(s.iVihu,s.vihuX, PLAYER_Y+s.vihuSiirtyma);
	piirraVarjo();
	piirraUkko(s.iUkko,s.ukkoX,PLAYER_Y);
	piirraHyppyNappi();
	
	// Piirretään lentävät objektit
	if(s.biomi==BIOME_SPACE){
		s.lentavatObjektit.forEach(function(v,i){
			// [kuva,x,y,liikkumisnopeusX,liikkumisnopeusY,adaptiivinenLiike,asento,pyoriminen,adaptiivinenPyoriminen]
			if(v != undefined){
				if(!s.tauko){
					let adaptiivisuus = FLYING_BASE_SPEED;
					if(v[FLY_ADAPTIVE]){
						adaptiivisuus = s.pelaajaNopeus;
					}
					if(s.alkupotkaisu > 0 && s.hengissa){
						v[FLY_X] += v[FLY_SPEED_X] * KICKSTART_SPEED_MULTIPLIER / FLYING_SPEED_SCALE * adaptiivisuus;
						v[FLY_Y] += v[FLY_SPEED_Y] * KICKSTART_SPEED_MULTIPLIER / FLYING_SPEED_SCALE * adaptiivisuus;
					}else{
						v[FLY_X] += v[FLY_SPEED_X] / FLYING_SPEED_SCALE * adaptiivisuus;
						v[FLY_Y] += v[FLY_SPEED_Y] / FLYING_SPEED_SCALE * adaptiivisuus;
					}
					v[FLY_ANGLE] += v[FLY_ROTATION];
				}
				ctx.save();
				ctx.translate(v[FLY_X]+HALF_TILE,v[FLY_Y]+HALF_TILE);
				ctx.rotate(v[FLY_ANGLE]);
				ctx.drawImage(v[FLY_IMAGE],0,0);
				//ctx.rotate(-v[FLY_SPEED_Y]);
				//ctx.translate(-(v[FLY_X]+96),-(v[FLY_Y]+96));
				ctx.restore();
				if(v[FLY_Y]>canvas.height+TILE_SIZE){
					s.lentavatObjektit.splice(i,1)
				}
			}
		});
	}
	
        
        // Missä tie?
        if (s.siirtoY>PLAYER_Y-ROAD_SCAN_MARGIN){ // Tien tutkiminen: Voi joutua muuttamaan lukua
            const tieKoordinaatit =[];
            let min;
            let max;
            for (let i=0; i<s.maasto.length; i++){ // X-suuntaan
                tieKoordinaatit.push(s.maastomuoto[i][1]);
            }
            min = tieKoordinaatit.indexOf(1);
            max = tieKoordinaatit.lastIndexOf(1);

            s.tieMinMax = [TILE_SIZE*min, TILE_SIZE*(max+1)];
            // console.log("Koord " + tieMinMax );
            // console.log("Paikkaa " +  tieKoordinaatit );
        }
	let puolivali = Math.floor((s.tieMinMax[0]+s.tieMinMax[1])/2/TILE_SIZE)*TILE_SIZE;
	if(s.suojakilpi>SHIELD_RECENTER_THRESHOLD){
		s.tavoiteX=puolivali;
	}

        //Ukko ja tie
	if((s.ukkoX<(s.tieMinMax[0]-s.ukkoToleranssi) || s.ukkoX > s.tieMinMax[1]+s.ukkoToleranssi-ROAD_RIGHT_EDGE_ALLOWANCE) && !s.tauko){
		puolivali = Math.floor((0.5*(s.tieMinMax[0] + s.tieMinMax[1]))/TILE_SIZE)*TILE_SIZE;
		if(s.suojakilpi <= 0 && !s.hyppy){
			s.ukkoX=puolivali;
			s.tavoiteX=puolivali;
			s.vihuSiirtyma -= ENEMY_PENALTY_BASE + Math.round(Math.random()*ENEMY_PENALTY_RANDOM);
			s.suojakilpi+=SHIELD_AFTER_OFF_ROAD;
			if(s.hengissa){
				s.striikki=0;
				varise(VIBRATE_MEDIUM);
				s.bonuspisteet = Math.max(0,s.bonuspisteet-(s.maxBonuspisteet/2));
				s.bonusKerroin = 1;
				soitaAani(auts[0]);
			}
		}
	}

	// Tunnista tietyyppi (kuolee mikäli kompastuu puuhun, tippuu kuiluun ym.)
	// Suoraan menevät tiet

		const ukonRuutu = Math.max(1,Math.min(LAST_COLUMN,Math.round(s.ukkoX/TILE_SIZE)));
	
		if(OBSTACLE_TILES.some(function(i){ return s.maasto[ukonRuutu][PLAYER_ROW]==tieSuoraan[i]; })){
			if(s.hyppy){
				tutoriaaliSuoritettu(TUTORIAL_JUMP);
			}else{
				if(!s.hengissa && s.siirtoY>TILE_CONTACT_PROGRESS){
					s.hyppy=true;
					setTimeout(function(){s.hyppy=false;},AUTO_JUMP_DURATION);
				}
				if(s.suojakilpi<=0 && s.siirtoY>TILE_CONTACT_PROGRESS){
					s.vihuSiirtyma=ENEMY_CAUGHT_DISTANCE;
				}
			}
		}

	// Vaakaan menevät tiet
	// xxxxxxxxxxxxxxxxxxxxxxxx
	if(!s.hyppy && s.suojakilpi<=0){
		// TODO: siirtoX ei ole määritelty missään (heittää ReferenceErrorin), tarkoitus epäselvä
		// eslint-disable-next-line no-undef
		if(s.maasto[Math.round(s.ukkoX/TILE_SIZE)][PLAYER_ROW]==tieVaakaan[HORIZONTAL_GAP_TILE] && siirtoX>TILE_CONTACT_PROGRESS){
			s.vihuSiirtyma=ENEMY_CAUGHT_DISTANCE;
		}
	}

	// Maaston liikuttaminen
	const striikkiJako = 1;
	if(!s.tauko){
		if(s.alkupotkaisu>0 && s.hengissa){
			s.siirtoY+=s.pelaajaNopeus*KICKSTART_SPEED_MULTIPLIER/striikkiJako;
		}else{
			s.siirtoY+=s.pelaajaNopeus/striikkiJako;
		}
	}

	if (s.siirtoY >= TILE_SIZE){
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
			if(s.alkupotkaisu>KICKSTART_MIN_REMAINING){
				s.alkupotkaisu-=1;
				s.suojakilpi=SHIELD_DURING_KICKSTART;
			}else{
				s.alkupotkaisu=0;
			}
		}
		
		// Luodaan lentäviä objekteja
		if(Math.random()<FLYING_SPAWN_CHANCE){
			if(s.biomi==BIOME_SPACE){
				const objektiNro = Math.floor(Math.random()*FLYING_PATTERN_COUNT);
				switch(objektiNro){
					case 0:
						if(s.lentavatObjektit.length<FLYING_MAX_SINGLE){
							s.lentavatObjektit.push([
								lentavaObjekti[0], // Kuvatiedosto
								Math.random()*canvas.width-HALF_TILE, // Satunnainen aloitus X-piste
								FLYING_SPAWN_Y, // Aloitus Y-piste
								0, // Satunnainen liikkumisnopeus (X)
								(FLYING_BIG_SPEED_MIN+Math.random())/FLYING_SPEED_SCALE*s.pelaajaNopeus,  // Satunnainen liikkumisnopeus (Y)
								true, // Adaptiivinen nopeus (eli objekti menee suhteessa nopeampaa silloin kun hahmokin menee)
								Math.PI*2*Math.random(), // Pyörimisen aloituspiste
								(Math.random()*2-1)*FLYING_BIG_ROTATION, // Pyörimisen nopeus (0 = ei pyöri)
								false // Adaptiivinen pyörimisnopeus (eli objekti pyörii sitä nopeammin mitä nopeammin hahmo liikkuu)
							]);
						}
					break;
					case 1:
						for(let i=0;i<FLYING_SMALL_COUNT;i++){ // Luodaan 5 kappaletta
							s.lentavatObjektit.push([
								lentavaObjekti[Math.floor(Math.random()*FLYING_SMALL_VARIANTS)+1], // Kuvatiedosto
								Math.random()*canvas.width-HALF_TILE, // Satunnainen aloitus X-piste
								FLYING_SPAWN_Y, // Aloitus Y-piste
								0, // Satunnainen liikkumisnopeus (X)
								(FLYING_SMALL_SPEED_MIN+Math.random()*FLYING_SMALL_SPEED_RANGE)/FLYING_SPEED_SCALE*s.pelaajaNopeus,  // Satunnainen liikkumisnopeus (Y)
								true, // Adaptiivinen nopeus (eli objekti menee suhteessa nopeampaa silloin kun hahmokin menee)
								Math.PI*2*Math.random(), // Pyörimisen aloituspiste
								(Math.random()*2-1)*FLYING_SMALL_ROTATION, // Pyörimisen nopeus (0 = ei pyöri)
								false // Adaptiivinen pyörimisnopeus (eli objekti pyörii sitä nopeammin mitä nopeammin hahmo liikkuu)
							]);
						}
					break;
					case 2:
						s.lentavatObjektit.push([
							lentavaObjekti[FLYING_DIAGONAL_IMAGE], // Kuvatiedosto
							Math.random()*canvas.width-HALF_TILE, // Satunnainen aloitus X-piste
							FLYING_SPAWN_Y, // Aloitus Y-piste
							-((FLYING_BIG_SPEED_MIN+Math.random())*s.pelaajaNopeus*FLYING_DIAGONAL_SPEED_FACTOR), // Satunnainen liikkumisnopeus (X)
							(FLYING_BIG_SPEED_MIN+Math.random())*s.pelaajaNopeus*FLYING_DIAGONAL_SPEED_FACTOR,  // Satunnainen liikkumisnopeus (Y)
							true, // Adaptiivinen nopeus (eli objekti menee suhteessa nopeampaa silloin kun hahmokin menee)
							FLYING_DIAGONAL_ANGLE, // Pyörimisen aloituspiste
							FLYING_DIAGONAL_ROTATION, // Pyörimisen nopeus (0 = ei pyöri)
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
		if(s.tieMuutos>MIN_ROWS_BETWEEN_TURNS){ // Lukua muuttamalla voit säätää paljonko tulee ylöspäin tulevaa tietä aina mutkan jälkeen vähintään
			if (s.tie == 0){
				//Vasen reuna: ylös tai oikealle
				if(Suunta < ROAD_EDGE_TURN_CHANCE){ //Oikealle
					s.tie = jatkaTieOikeaan(s.tie);
					s.tieMuutos=0;
				}else{ //Ylös
					s.tie = jatkaTieYlos(s.tie);
				}
			}else if (s.tie==LAST_COLUMN){
				//Oikea reuna; ylös tai vasemmalle
				if(Suunta < ROAD_EDGE_TURN_CHANCE){ //Vasemmalle
					s.tie = jatkaTieVasempaan(s.tie);
					s.tieMuutos=0;
				}else{ //Ylös
					s.tie = jatkaTieYlos(s.tie);
				}
			}else{
				//Tie on oikean ja vasemman reunan välissä
				if (Suunta < ROAD_LEFT_LIMIT){ // Vasemmalle
					s.tie = jatkaTieVasempaan(s.tie);
					s.tieMuutos=0;
				}else if(Suunta < ROAD_RIGHT_LIMIT){ // Oikealle
					s.tie = jatkaTieOikeaan(s.tie); 
					s.tieMuutos=0;
				}else if(Suunta < ROAD_CROSSING_LIMIT){ // Risteys
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
		if(s.tieMuutos>0 && s.biomi==BIOME_FOREST){
			if(s.oliRisteys != false){
				s.maasto[s.oliRisteys][0] = kyltti[0];
				s.oliRisteys=false;
			}
		}
		
		for(let i=0;i<s.maastomuoto.length;i++){
			if(s.maastomuoto[i][ENEMY_ROW]==1){
				s.vihuTavoiteX=TILE_SIZE*i; // Asetetaan X-sijainti, johon vihu pyrkii
			}
		}

	}

	if(s.hengissa){
		// Kirjoita nykyiset pisteet
		ctx.textAlign="center";
			kirjoita(Math.round(s.pisteet),canvas.width/HUD_SLOTS*HUD_SCORE_SLOT,HUD_VALUE_Y,true,FONT_HEADING,"#FFF","'Raleway'");
			kirjoita("PISTEET",canvas.width/HUD_SLOTS*HUD_SCORE_SLOT,HUD_LABEL_Y,true,FONT_CAPTION,"silver","'Raleway'");
			kirjoita(Math.round(s.matka),canvas.width/HUD_SLOTS*HUD_DISTANCE_SLOT,HUD_VALUE_Y,true,FONT_HEADING,"#FFF","'Raleway'");
			kirjoita("JUOSTU MATKA",canvas.width/HUD_SLOTS*HUD_DISTANCE_SLOT,HUD_LABEL_Y,true,FONT_CAPTION,"silver","'Raleway'");
		ctx.textAlign="start";

		// Piirrä bonuspalkin pohja vasempaan reunaan
		ctx.beginPath();
		ctx.rect(BONUS_BAR_X,BONUS_BAR_Y,BONUS_BAR_WIDTH,BONUS_BAR_HEIGHT);
		ctx.fillStyle = "rgba(0,0,0,.5)";
		ctx.fill();
		ctx.closePath();

		// Piirrä itse bonuspalkki
		ctx.beginPath();
		const pylvasK = Math.min(BONUS_BAR_HEIGHT,Math.round(BONUS_BAR_HEIGHT/(s.maxBonuspisteet*TILE_SIZE)*((s.bonuspisteet-1)*TILE_SIZE+s.siirtoY)));
		ctx.rect(BONUS_BAR_X,Math.min(BONUS_BAR_BOTTOM,BONUS_BAR_HEIGHT-pylvasK+BONUS_BAR_Y),BONUS_BAR_WIDTH,pylvasK);
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
		
		kirjoita("+"+(BONUS_POINTS*s.bonusKerroin),BONUS_LABEL_X,BONUS_LABEL_Y,true,FONT_HEADING,"#FFF","'Raleway'");

		if(s.bonuspisteet > s.maxBonuspisteet){
			s.bonuspisteet = 0;
			s.bonusKerroin += 1;
			s.pisteet += BONUS_POINTS * s.bonusKerroin;
			soitaAani(bonusAani[0]);
		}
	}
	
	// Varjo
	//ctx.fillStyle="rgba(0,0,0,.2)";

	if(s.vihuSiirtyma<ENEMY_DANGER_DISTANCE && s.hengissa){
		ctx.textAlign="center";
		const keskiosa = {"x":canvas.width/2,"y":canvas.height/2};
		const sydanKoko = Math.sin(s.pelaaNo*HEART_PULSE_SPEED) * HEART_PULSE_SIZE + HEART_BASE_SIZE;
		kirjoita("♥",keskiosa.x, keskiosa.y - sydanKoko/2, true, sydanKoko, "red", "'Raleway'");
		kirjoita("Olet hengenvaarassa",keskiosa.x,keskiosa.y+WARNING_TEXT_OFFSET,true,FONT_SUBTITLE,"red");
		ctx.textAlign="start";
	}

	if(s.biomi==BIOME_CAVE){
		s.tummuus += DARKNESS_CAVE_RATE;
		s.tummuus = Math.min(s.tummuus,DARKNESS_MAX);
	}else{
		s.tummuus -= DARKNESS_FADE_RATE;
		s.tummuus = Math.max(s.tummuus,0);
	}

	if(s.tummuus>0){
		ctx.fillStyle="rgba(0,0,0,"+Math.min(s.tummuus,DARKNESS_MAX)+")";
		ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	}

	if(s.tauko){
		s.tummuus=DARKNESS_MENU;
		ctx.textAlign="center";
			kirjoita("Tauolla",canvas.width/2,PAUSE_TITLE_Y,true,FONT_TITLE,"#FFF","'Raleway'");
			kirjoita("Jatka peliä",canvas.width/2,PAUSE_RESUME_Y,true,FONT_SUBTITLE,"#C0C0C0","'Source Sans Pro'");
			kirjoita("Siirry valikkoon",canvas.width/2,PAUSE_RESUME_Y+PAUSE_ROW_HEIGHT,true,FONT_SUBTITLE,"#C0C0C0","'Source Sans Pro'");
		ctx.textAlign="start";
	}

	s.pelaajaNopeus = PLAYER_BASE_SPEED + Math.round(SPEED_PER_POINT*s.pisteet); // Peli nopeutuu, mitä pitemmälle siinä päästään
	
	// Kun vihu saa pelaajan kiinni, mene päävalikkoon
	if(s.vihuSiirtyma<ENEMY_CATCH_DISTANCE){
		kasitteleKuolema();

		piirraValikonTausta();
			
		if(s.tila==SCREEN_MENU){
			piirraPaavalikko();
		}
		if(s.tila==SCREEN_MENU || s.tila==SCREEN_LEVELS){
			piirraRahat();
		}
		if(s.tila==SCREEN_LEVELS){
			piirraKenttavalinta();
		}
		if(s.tila==SCREEN_GOALS){
			piirraTavoitteet();
		}
		if(s.tila==SCREEN_STATS){
			piirraTilastot();
		}
		if(s.tila==SCREEN_CREDITS){
		
			piirraTekijat();
		}
		if(s.tila==SCREEN_SETTINGS){
			piirraAsetukset();
		}
	}
	piirraHud();
}

// Klikkaus kesken pelin (tauko-painike ja taukovalikko)
export function kasittelePelinKlikkaus(){
	if(!s.tauko){
		s.klikkiPos=[s.x,s.y];
		varise(VIBRATE_CLICK);
		if(s.x>canvas.width-PAUSE_BUTTON_WIDTH && s.y<PAUSE_BUTTON_HEIGHT){
			if(s.tauko){
				s.tauko=false;
			}else{
				s.tauko=true;
			}
		}
	}else{
		//yoloyolo
		if(s.x>PAUSE_MENU_MARGIN && s.x<canvas.width-PAUSE_MENU_MARGIN){
			if(s.y>=PAUSE_RESUME_Y-PAUSE_ROW_HALF_HEIGHT && s.y<PAUSE_RESUME_Y+PAUSE_ROW_HALF_HEIGHT){
				s.tauko=false;
			}
			if(s.y>=PAUSE_RESUME_Y+PAUSE_ROW_HALF_HEIGHT && s.y<PAUSE_RESUME_Y+PAUSE_ROW_HEIGHT){
				vahvista("Haluatko lopettaa pelin ja siirtyä valikkoon?", function(){
					s.tauko=false;
					s.vihuSiirtyma=ENEMY_CAUGHT_DISTANCE;
				});
			}
		}
	}
}
