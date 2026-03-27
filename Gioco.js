var animatedObject = {
  speedX: 0,
  speedY: 0,
  width: 50,
  height: 50,
  x: 10,
  y: 120,
  imageList: [], // Vettore che conterrà tutte le immagini caricate
  contaFrame: 0, // Tiene conto di quanti frame sono passati
  actualFrame: 0, // Specifica quale frame disegnare

  update: function() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.contaFrame++;
    if (this.contaFrame == 7) {
      this.contaFrame = 0;
      this.actualFrame = (1 + this.actualFrame) % this.imageList.length;
      this.image = this.imageList[this.actualFrame];
    }
  },

  loadImages: function() {
     for (imgPath of running) { // Assicurati che "running" esista!
      var img = new Image(this.width, this.height);
      img.src = imgPath;
      this.imageList.push(img);
    }
    this.image = this.imageList[this.actualFrame];
  },

  crashWith: function(otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
        crash = false;
    }
    return crash;
  }
};

var myObstacles = [];
var myScore;

function startGame() {
    myGameArea.start();
    myScore = new component("30px", "Consolas", "white", 280, 40, "text");
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    draw: function(component) {
        this.context.fillStyle = component.color;
        this.context.fillRect(component.x, component.y, component.width, component.height);
    },
    start : function() {
        animatedObject.loadImages();  
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    },
    drawGameObject: function(gameObject) {
            this.context.drawImage(
              gameObject.image,
              gameObject.x,
              gameObject.y,
              gameObject.width,
              gameObject.height
            );
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    
    // Controlla collisioni
    for (i = 0; i < myObstacles.length; i += 1) {
        if (animatedObject.crashWith(myObstacles[i])) {
            myGameArea.stop();
            return;
        } 
    }
    
    myGameArea.clear();
    
    // Aggiorna e disegna il personaggio animato
    animatedObject.update();
    myGameArea.drawGameObject(animatedObject);

    // Gestione ostacoli
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 50;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, "green", x, 0));
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }
    
    for (i = 0; i < myObstacles.length; i += 9) {
        myObstacles[i].speedX = -1;
        myObstacles[i].newPos();
        myObstacles[i].update();
    }
    
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function moveup() { animatedObject.speedY = -3; }
function movedown() { animatedObject.speedY = 3; }
function moveleft() { animatedObject.speedX = -3; }
function moveright() { animatedObject.speedX = 3; }
function clearmove() { 
    animatedObject.speedX = 0; 
    animatedObject.speedY = 0; 
}