let font;
let letterDots = [];
let initialDots = 0;
let ship;
let bullets = [];
let nbullets = 0;
let nLetBulets = 0;
let obstacles = [];
let letters = [];
let nLetters = 0;
let lbullets = [];
let score = 0;
let lifes = 0;
let radius = 8;

function preload(){
    font = loadFont("pointfree.ttf");
}
function setup(){
    let can = createCanvas(800, 600);
    can.parent(document.getElementById("canvasContainer"));
    score = document.getElementById("enemies");
    lifes = document.getElementById("lifes");
    ship = new Ship(createVector(50, 150));
    ship.init();
    rectMode(CORNER);
    noFill();
    noSmooth();
    stroke(255);
    strokeWeight(radius);
    setupPoints();
}
function draw(){
    clear();
    nLetters = letters.length;
    nLetBulets = lbullets.length;
    initialDots = letterDots.length;
    nbullets = bullets.length;
    updateShip();
    updateBullets();
    updateEnemies();
    joistick();
    obstacles = [];
    score.innerText = initialDots + nLetters;
    lifes.innerText = ship.life;
}
function setupPoints(){
    let pts = font.textToPoints('404', 0.5*width, height/2, 150, {sampleFactor: 0.12, simplifyThreshold: 0})
    for (let i=0; i< pts.length; i++){
        let ldot = new Dots(pts[i].x, pts[i].y, radius);
        letterDots.push(ldot);
    }
    letters.push(new Letter(0.5*width, 0.15*height, 210, 60, {fnt: font, msg:"ERROR", w:230, h:60, fs:70}));
    letters.push(new Letter(0.5*width, 0.55*height, 120, 70, {fnt: font, msg:"NOT", w:130, h:60, fs:70}));
    letters.push(new Letter(0.5*width+170, 0.55*height, 210, 60, {fnt: font, msg:"FOUND", w:220, h:60, fs:70}));
    letters.forEach(e => e.init());
}
function updateShip(){
    ship.update();
    ship.isHit(lbullets);
    if(ship.isAlive()){
        ship.show();
    }else{
        noLoop();
    }
    obstacles.push({blt:false, pos:ship.pos.copy()});
}
function updateBullets(){
    push();
    stroke(255, 125, 0);
    strokeWeight(5);
    for (let i = nbullets-1; i > -1;  i--){
        bullets[i].update();
        bullets[i].show();
        if(bullets[i].endScreen() || bullets[i].collision){
            bullets.splice(i,1);
        }else{
            obstacles.push({blt:true, pos:bullets[i].pos.copy()});
        }
    }
    for (let i = nLetBulets-1; i > -1;  i--){
        lbullets[i].update();
        lbullets[i].show();
        if(lbullets[i].endScreen() || lbullets[i].collision){
            lbullets.splice(i,1);
        }
    }
    pop();
}
function updateEnemies(){
    for (let i = initialDots-1; i > -1; i--){
        if (letterDots[i].destroyed){
            letterDots.splice(i,1);
        }else{
            letterDots[i].behavior(obstacles);
            letterDots[i].update();
            letterDots[i].show();
        }
    }
    for (let i = nLetters-1; i > -1; i--){
        if(letters[i].isDead()){
            letters.splice(i,1);
        }else{
            if (frameCount >= 200){
                letters[i].isHit(bullets);
                letters[i].update(frameCount);
                letters[i].shot(lbullets, nLetters);
            }
            letters[i].show();
        }
    }
}
function keyReleased(){
    if (keyCode === 32 ){
        ship.shot(bullets);
    }
}
function joistick(){
    if (keyIsDown(LEFT_ARROW)){
        ship.move(-1, 0);
        return false;
    }
    if (keyIsDown(RIGHT_ARROW)){
        ship.move(1, 0);
        return false;
    }
    if (keyIsDown(UP_ARROW)){
        ship.move(0, -1);
        return false;
    }
    if (keyIsDown(DOWN_ARROW)){
        ship.move(0, 1);
        return false;
    }
}