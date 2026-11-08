// Avaa modaalin (<dialog id="...Modal">) nimellä, esim. openModal("noMoney")
export function openModal(nimi){
	const dlg = document.getElementById(nimi+"Modal");
	if(dlg && !dlg.open){
		dlg.showModal();
	}
}

// Ilmoitus (korvaa alert): naytaIlmoitus("teksti")
export function naytaIlmoitus(teksti){
	document.getElementById("infoModalTeksti").textContent = teksti;
	openModal("info");
}

// Kyllä/Ei-kysymys (korvaa confirm, mutta ei estä pelisilmukkaa): vahvista("teksti", function(){ ... })
export function vahvista(teksti, kunKylla){
	const dlg = document.getElementById("confirmModal");
	document.getElementById("confirmModalTeksti").textContent = teksti;
	dlg.addEventListener("close", function(){
		if(dlg.returnValue == "kylla"){
			kunKylla();
		}
	}, {once:true});
	dlg.returnValue = "";
	openModal("confirm");
}
