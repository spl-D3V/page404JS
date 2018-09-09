class Ship {
    constructor(position){
        this.pos = position;
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.viscosity = 0.02;
        this.nShots = 0;
        this.maxShots = 4;
        this.maxSpeed = 7;
        this.bufferDark = [];
        this.bufferLight = [];
        this.life = 5;
        this.w = 46;
        this.h = 30;
    }
}
Ship.prototype.init = function(){
    for(let i = 0; i <= this.life; i++ ){
        let d = createGraphics(this.w, this.h);
        d.noFill();
        d.stroke(55+(5-i)*50, 255-(5-i)*50, 55);
        d.strokeWeight(4);
        d.triangle(5, 5, 5, 25, 40, 15);
        this.bufferDark.push(d);
    }
    for(let i = 0; i <= this.life; i++ ){
        let l = createGraphics(this.w, this.h);
        l.noFill();
        l.stroke(55+(5-i)*50, 255-(5-i)*50, 55);
        l.strokeWeight(1);
        l.triangle(5, 5, 5, 25, 40, 15);
        this.bufferLight.push(l);
    }
}
Ship.prototype.show = function(){
    if(Math.random() < 0.1){
        image(this.bufferLight[this.life], this.pos.x, this.pos.y-0.5*this.h);
    }else{
        image(this.bufferDark[this.life], this.pos.x, this.pos.y-0.5*this.h);
    }
}
Ship.prototype.move = function(x, y){
    this.vel.x += 2*x;
    this.vel.y += 2*y;
    if(this.vel.magSq() > 80){
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
Ship.prototype.isHit = function(_blt){
    for(let i = 0; i < _blt.length; i++){
        if (this.pos.x <= _blt[i].pos.x && _blt[i].pos.x <= (this.pos.x+this.w) && 
            this.pos.y <= _blt[i].pos.y && _blt[i].pos.y <= (this.pos.y+this.h)){
                this.life--;
                _blt[i].collision = true;
                return true;
        }
    }
    return false;
}
Ship.prototype.isAlive = function(){
    return this.life > 0;
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