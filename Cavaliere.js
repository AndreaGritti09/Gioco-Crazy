// Variabili globali per la fisica, telecamera e stato del gioco
var cameraX = 0;
var gravity = 0.6;
var friction = 0.8;
var livelloMax = 5000; // Lunghezza totale del livello
var isGameOver = false;
var keys = { ArrowRight: false, ArrowLeft: false, ArrowUp: false };

// Ascolto degli eventi della tastiera
window.addEventListener('keydown', function(e) {
    if (keys.hasOwnProperty(e.code)) keys[e.code] = true;
});
window.addEventListener('keyup', function(e) {
    if (keys.hasOwnProperty(e.code)) keys[e.code] = false;
});

var animatedObject = {
  speedX: 0,
  speedY: 0,
  width: 40, // Leggermente più piccolo per evitare di incastrarsi facilmente
  height: 40,
  x: 50,
  y: 100,
  jumpPower: -12,
  grounded: false,
  imageList: [],
  contaFrame: 0,
  actualFrame: 0,
  image: null,

  update: function() {
    if (isGameOver) return; // Ferma il personaggio se il gioco finisce

    // 1. Gestione Input
    if (keys.ArrowRight) this.speedX += 1.2; // Un po' più veloce
    if (keys.ArrowLeft) this.speedX -= 1.2;
    if (keys.ArrowUp && this.grounded) {
        this.speedY = this.jumpPower;
        this.grounded = false;
    }

    // 2. Fisica
    this.speedX *= friction;
    this.speedY += gravity;
    this.x += this.speedX;
    this.y += this.speedY;

    // 3. Logica della Telecamera (Scrolling)
    if (this.x > cameraX + myGameArea.canvas.width / 2.5) {
        cameraX = this.x - myGameArea.canvas.width / 2.5;
    }
    // Muro invisibile a sinistra per non tornare indietro
    if (this.x < cameraX) {
        this.x = cameraX;
        this.speedX = 0;
    }

    // 4. Animazione Sprite
    this.contaFrame++;
    if (this.contaFrame == 7 && this.imageList.length > 0) {
      this.contaFrame = 0;
      this.actualFrame = (1 + this.actualFrame) % this.imageList.length;
      this.image = this.imageList[this.actualFrame];
    }
  },

  loadImages: function() {
     if (typeof cavaliere !== 'undefined') {
         for (let imgPath of cavaliere) { 
           var img = new Image(this.width, this.height);
           img.src = imgPath;
           this.imageList.push(img);
         }
         this.image = this.imageList[this.actualFrame];
     }
  }
};

var myObstacles = [];
var myScore;

function startGame() {
    myGameArea.start();
    myScore = new component("20px", "Consolas", "white", 10, 30, "text");

    // --- GENERATORE DI LIVELLI PROCEDURALE ---
    let currentX = 0;
    
    // Genera il livello finché non si raggiunge la fine
    while (currentX < livelloMax) {
        // Genera la lunghezza di questo blocco di prato (tra 200 e 600 pixel)
        let groundWidth = Math.floor(Math.random() * 400) + 200;
        
        // Aggiungi il prato
        myObstacles.push(new component(groundWidth, 50, "#228B22", currentX, 230, "rect")); // Verde Erba
        
        // Genera ostacoli sopra questo blocco di prato
        let chance = Math.random();
        if (chance > 0.6) {
            // Piattaforma sospesa (Marrone scuro)
            let platY = Math.floor(Math.random() * 60) + 100; // Altezza tra 100 e 160
            myObstacles.push(new component(120, 20, "#8B4513", currentX + 50, platY, "rect"));
        } else if (chance > 0.3) {
            // Ostacolo stile tubo (Verde lime)
            let pipeHeight = Math.floor(Math.random() * 50) + 30; // Altezza tra 30 e 80
            myObstacles.push(new component(50, pipeHeight, "#32CD32", currentX + (groundWidth/2), 230 - pipeHeight, "rect"));
        }

        currentX += groundWidth;
        
        // 30% di possibilità di creare un "fossato" (salto nel vuoto)
        if (Math.random() > 0.7 && currentX < livelloMax - 300) {
            currentX += Math.floor(Math.random() * 80) + 60; // Buco largo tra 60 e 140 pixel
        }
    }

    // Aggiungi l'Asta della Bandiera finale (Traguardo)
    myObstacles.push(new component(20, 200, "#FFD700", livelloMax, 30, "rect")); // Bandiera d'oro
    // Aggiungi un pavimento sicuro per la fine
    myObstacles.push(new component(800, 50, "#228B22", livelloMax - 100, 230, "rect")); 
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        animatedObject.loadImages();  
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.canvas.style.backgroundColor = "#6495ED"; // Azzurro "Cornflower Blue" molto bello
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
        if (gameObject.image) {
            this.context.drawImage(
              gameObject.image,
              gameObject.x - cameraX, 
              gameObject.y,
              gameObject.width,
              gameObject.height
            );
        } else {
            // Seleziona un rosso acceso in caso non ci sia l'immagine
            this.context.fillStyle = "#FF4500"; 
            this.context.fillRect(gameObject.x - cameraX, gameObject.y, gameObject.width, gameObject.height);
            this.context.strokeStyle = "white";
            this.context.strokeRect(gameObject.x - cameraX, gameObject.y, gameObject.width, gameObject.height);
        }
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;    

    this.update = function() {
        var ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = this.color;
            ctx.fillText(this.text, this.x, this.y); 
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
            // Aggiungi un contorno nero agli ostacoli per farli risaltare
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.strokeRect(this.x - cameraX, this.y, this.width, this.height);
        }
    }
}

function updateGameArea() {
    if (isGameOver) return; // Stoppa il ciclo se il gioco è finito

    myGameArea.clear();
    animatedObject.update();

    // 1. Condizione di Vittoria (Ha raggiunto l'asta dorata a "livelloMax")
    if (animatedObject.x >= livelloMax) {
        isGameOver = true;
        myGameArea.stop();
        myScore.text = "🏆 HAI VINTO! 🏆";
        myScore.x = 130;
        myScore.y = 135;
        myScore.width = "30px";
        myScore.update();
        return;
    }

    // 2. Condizione di Sconfitta (Caduta in un fossato)
    if (animatedObject.y > myGameArea.canvas.height) {
        isGameOver = true;
        myGameArea.stop();
        myScore.text = "💀 GAME OVER 💀";
        myScore.color = "red";
        myScore.x = 130;
        myScore.y = 135;
        myScore.width = "30px";
        myScore.update();
        return;
    }

    // Rilevamento Collisioni
    animatedObject.grounded = false;
    for (let i = 0; i < myObstacles.length; i++) {
        let plat = myObstacles[i];
        
        if (animatedObject.x < plat.x + plat.width &&
            animatedObject.x + animatedObject.width > plat.x &&
            animatedObject.y < plat.y + plat.height &&
            animatedObject.y + animatedObject.height > plat.y) {
            
            // Atterraggio
            if (animatedObject.speedY > 0 && animatedObject.y + animatedObject.height - animatedObject.speedY <= plat.y) {
                animatedObject.grounded = true;
                animatedObject.speedY = 0;
                animatedObject.y = plat.y - animatedObject.height;
            }
            // Testata sotto il blocco
            else if (animatedObject.speedY < 0 && animatedObject.y - animatedObject.speedY >= plat.y + plat.height) {
                animatedObject.speedY = 0;
                animatedObject.y = plat.y + plat.height;
            }
            // Muro a Destra
            else if (animatedObject.speedX > 0 && animatedObject.x + animatedObject.width - animatedObject.speedX <= plat.x) {
                animatedObject.speedX = 0;
                animatedObject.x = plat.x - animatedObject.width;
            }
            // Muro a Sinistra
            else if (animatedObject.speedX < 0 && animatedObject.x - animatedObject.speedX >= plat.x + plat.width) {
                animatedObject.speedX = 0;
                animatedObject.x = plat.x + plat.width;
            }
        }
    }

    // Disegna ostacoli
    for (let i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].update();
    }
    
    // Disegna giocatore
    myGameArea.drawGameObject(animatedObject);

    // Testo UI (Punteggio/Distanza rimanente)
    let distanzaRimanente = Math.floor(livelloMax - animatedObject.x);
    myScore.text = "Obiettivo a: " + (distanzaRimanente > 0 ? distanzaRimanente : 0) + "m";
    myScore.update();
}

// Funzioni per bottoni touch
function moveup() { keys.ArrowUp = true; }
function moveleft() { keys.ArrowLeft = true; }
function moveright() { keys.ArrowRight = true; }
function clearmove() { keys.ArrowUp = false; keys.ArrowLeft = false; keys.ArrowRight = false; }