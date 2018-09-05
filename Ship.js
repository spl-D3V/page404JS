class Ship {
    constructor(position){
        this.pos = position;
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.viscosity = 0.02;
        this.nShots = 0;
        this.maxShots = 4;
        this.maxSpeed = 10;
    }
}
Ship.prototype.show = function(){
    push();
    stroke(50, 255, 50);
    strokeWeight(Math.random()<0.10 ? 1 : 4);
    translate(this.pos.x, this.pos.y);
    triangle(-10, 10, -10, -10, 20, 0);
    pop();
}
Ship.prototype.move = function(x, y){
    this.vel.x += 8*x;
    this.vel.y += 8*y;
    if(this.vel.magSq() > 100){
        this.vel.setMag(this.maxSpeed);
    }
}
Ship.prototype.update = function(){
    this.pos.add(this.vel);
    let resistance = this.vel.copy();
    resistance.mult(-1*this.viscosity);
    this.vel.add(resistance);
    if(this.vel.magSq() < 2){
        this.vel.mult(0);
    }
    if(this.pos.x > width){
        this.pos.x = width;
    }else if(this.pos.x < 0){
        this.pos.x = 0;
    }else if(this.pos.y > height){
        this.pos.y = height;
    }else if(this.pos.y < 0){
        this.pos.y = 0;
    }
}
Ship.prototype.shot = function(_bullets){
    if(_bullets.length === this.maxShots){
        return false;
    }
    if(this.nShots === 0 && _bullets.length === 0){
        this.nShots = this.maxShots;
    }
    let bullet = new Bullet(this.pos.copy())
    _bullets.push(bullet);
    this.nShots--;
}

class Bullet {
    constructor(position, heading=1){
        this.pos = position;
        this.vel = createVector(heading*8, 0);
        this.collision = false;
    }
}
Bullet.prototype.update = function(){
    this.pos.add(this.vel);
}
Bullet.prototype.show = function(){
    
    line(this.pos.x, this.pos.y, this.pos.x+20, this.pos.y);
}
Bullet.prototype.endScreen = function(){
    return (this.pos.x > width || this.pos.x < 0);
}