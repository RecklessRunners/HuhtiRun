$(function(){
	var game = $("canvas");
	for(ia=0;ia<3;ia++){ // Iteroi grafiikka kolmelle eri riville
		for(ib=0;ib<5;ib++){ // Iteroi grafiikka viiteen eri sarakkeeseen
			game.drawImage({ // Piirrä grafiikka
				source: "img/test.png",
				x: ib*192, y: ia*192,
				fromCenter: false
			});
		}
	}
});