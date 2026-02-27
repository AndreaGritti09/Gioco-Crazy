var redSquare = {
    width: 20,
    height: 20,
    x: 10,
    y: 120,
    color: "red",
    speedX : 0,
    speedY: 0  
    
};

function startGame() {
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        
    
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        
        
        this.interval = setInterval(updateGameArea, 20); 
    },


    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    draw: function(component) {
        this.context.fillStyle = component.color;
        this.context.fillRect(component.x, component.y, component.width, component.height);
    }
}

function updateGameArea() {

    myGameArea.clear();
    

    myGameArea.draw(redSquare);
}
redSquare.speedX = 0;
redSquare.speedY = 0;

// Loop di animazione
setInterval(() => {
  redSquare.x += redSquare.speedX;
  redSquare.y += redSquare.speedY;
  // Ridisegna il quadrato
}, 100);

// Bottoni per controllare la direzione




function moveup() {
redSquare.speedY = -10;
}

function movedown() {
redSquare.speedY = 10;
}

function moveleft() {
redSquare.speedX = -10;
}

function moveright() {
redSquare.speedX = 10;
}

function clearmove() {
    redSquare.speedX = 0; 
    redSquare.speedY = 0; 
}