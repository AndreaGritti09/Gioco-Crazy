	var animale1={
    specie:"mucca",
    razza:"chianina",
    zampe:"4",
    dieta:{
        tipo:"erba",
        quantità: "30Kg al giorno"
    }
    }
    
    var animale2={
    specie:"cane",
    razza:"bassotto",
    zampe:"4",
    dieta: {
        tipo:"croccantini",
        quantità: "200g al giorno"  
    }
    }
    
    var animale3={
    specie:"gallina",
    razza:"andalusa",
    zampe:"4",
    dieta: {
        tipo:"granaglie",
        quantità: "100g al giorno"  
    }
    }
    
    const recinto = [animale1, animale2, animale3];
    function b1(){
    	document.getElementById("a1").innerHTML= 
        "Specie: " + animale1.specie + " Razza: " + animale1.razza + " Zampe: " + animale1.zampe + " Dieta: " + animale1.dieta.tipo + " Quantità: " + animale1.dieta.quantità
        console.log("la dieta di questa mucca è equilibrata per il suo fabbisogno giornaliero")
    }

	function b2(){
    	document.getElementById("a1").innerHTML= 
        "Specie: " + animale2.specie + " Razza: " + animale2.razza + " Zampe: " + animale2.zampe + " Dieta: " + animale2.dieta.tipo + " Quantità: " + animale2.dieta.quantità
        console.log("la dieta di questo cane è equilibrata per il suo fabbisogno giornaliero")
    }
    
    function b3(){
    	document.getElementById("a1").innerHTML= 
        "Specie: " + animale3.specie + " Razza: " + animale3.razza + " Zampe: " + animale3.zampe + " Dieta: " + animale3.dieta.tipo + " Quantità: " + animale3.dieta.quantità
        console.log("la dieta di questa gallina è equilibrata per il suo fabbisogno giornaliero")
    }

    

    function mostraTuttoIlRecinto() { 
        let testo = "Contenuto del recinto:"; 
        recinto.forEach(function(animale) { 
            testo += animale.caratteristicheComplete() + "<br>"; 
        }); 
        document.getElementById("a4").innerHTML = testo; 
    }  
