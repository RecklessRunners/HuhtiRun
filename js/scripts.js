blocks = [];

$(function(){
	function game(){
		var canvas = $("canvas")[0];
		if(canvas.getContext){
			return canvas.getContext('2d');
		}else{
			document.location="unsupported.html";
			return false;
		}
	}
	var img = new Image();
	img.onload = function(){
		setInterval(piirra,1);
	};
	img.src="img/test.png";
	
	var siirto = 0;
	function piirra(){
		game().clearRect(0,0,960,576);
		siirto += 1;
		if(siirto>=192){
			siirto=0;
		}
		for(ia=-1;ia<4;ia++){
			for(ib=-1;ib<6;ib++){
				blocks.push(game().drawImage(img,ib*192,ia*192+siirto));
			}
		}
	}
});