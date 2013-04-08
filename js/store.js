$(function(){
	var buusti = parseInt(localStorage.buusti);
	var kilpi = parseInt(localStorage.kilpi);
	var rahat = parseInt(localStorage.kolikot);
	setInterval(function(){paivita();},1000);
	function osta(hinta){
		if(confirm("Tämä toiminto maksaa "+hinta+" €\n\nOsta?")){
			if(hinta <= rahat){
				rahat-=hinta;
				alert("Ostettu!");
				return true;
			}else{
				alert("Rahat eivät riitä kohteen ostamiseen!");
				return false;
			}
		}else{
			return false;
		}
	}
	function paivita(){
		$("#lompakko").html(Math.floor(rahat));
		$("#metrit-kilpi").html(Math.floor(kilpi));
		$("#metrit-buusti").html(Math.floor(buusti));
		localStorage.buusti = parseInt(buusti);
		localStorage.kilpi = parseInt(kilpi);
		localStorage.kolikot = parseInt(rahat);
		console.log(localStorage);
	}
	// Buustin osto
	$("#osta-buusti-1").click(function(){
		if(osta(500)){
			buusti=parseInt(buusti)+100;
			kilpi=parseInt(kilpi)+100;
		}
	});
	$("#osta-buusti-2").click(function(){
		if(osta(2500)){
			buusti=parseInt(buusti)+525;
			kilpi=parseInt(kilpi)+525;
		}
	});
	$("#osta-buusti-3").click(function(){
		if(osta(5000)){
			buusti=parseInt(buusti)+1075;
			kilpi=parseInt(kilpi)+1075;
		}
	});

	// Suojakilven osto
	$("#osta-kilpi-1").click(function(){
		if(osta(80)){
			kilpi=parseInt(kilpi)+20;
		}
	});
	$("#osta-kilpi-2").click(function(){
		if(osta(200)){
			kilpi=parseInt(kilpi)+55;
		}
	});
	$("#osta-kilpi-3").click(function(){
		if(osta(400)){
			kilpi=parseInt(kilpi)+115;
		}
	});
	// Tallennus & poistuminen
	$("#sulje-kauppa").click(function(){
		paivita();
		window.close();
	});
});
