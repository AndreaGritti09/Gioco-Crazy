var redSquare = {
    width: 20,
    height: 20,
    x: 10,
    y: 120,
    color: "red",
    speedX : 0,
    speedY: 0  
    
};

var animatedObject = {
  speedX: 0,
  speedY: 0,
  width: 60,
  height: 60,
  x: 10,
  y: 120,
  imageList: [], //Vettore che conterrà tutte le immagini caricate
  contaFrame: 0, //Tiene conto di quanti frame sono passati
  actualFrame: 0, //Specifica quale frame disegnare

  update: function() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.contaFrame++;
    if (this.contaFrame == 50) {
      this.contaFrame = 0;
      this.actualFrame = (1 + this.actualFrame) % this.imageList.length;
      //console.log(this.actualFrame);
      this.image = this.imageList[this.actualFrame];
    }
  },

  loadImages: function() {
    this.image = new Image(this.width, this.height);
    this.image.src = "https://i.ibb.co/TqYNwMCW/Idle-7.png";
     for (imgPath of running) {
      var img = new Image(this.width, this.height);
      img.src = imgPath;
      this.imageList.push(img);
      //console.log(img);
    }
    this.image = this.imageList[this.actualFrame];
  }
};



function startGame() {
    myGameArea.start();
    animatedObject.loadImages();
}

var myGameArea = {
    drawGameObject: function(gameObject) {
    this.context.drawImage(
      gameObject.image,
      gameObject.x,
      gameObject.y,
      gameObject.width,
      gameObject.height
    )
    },
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
    animatedObject.update();
    myGameArea.drawGameObject(animatedObject);
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

