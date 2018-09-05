class Dots{
    constructor(x, y){
        this.target = createVector(x, y);
        this.pos = createVector(Math.random()*width, Math.random()*height);
        this.vel = p5.Vector.random2D();
        this.acc = createVector(x, y);
        this.r = 8;
        this.maxSpeed = 10;
        this.maxForce = 20;
        this.destroyed = false;
    }
}
Dots.prototype.behavior = function(obs){
    let arrive = this.arrive(this.target);
    obs.forEach(o => {
        this.applyForce(this.flee(o));
    });
    this.applyForce(arrive);
}
Dots.prototype.arrive = function(target){
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();
    let speed = this.maxSpeed;
    if(d <100){
        speed = map(d, 0, 100, 0, this.maxSpeed);
    }
    desired.setMag(speed);
    return p5.Vector.sub(desired, this.vel);
}
Dots.prototype.flee = function(target){
    let away = p5.Vector.sub(this.pos, target.pos); // this is like multiply de vector by -1
    let d = away.mag();
    if(d < 75){
        this.destroyed = target.blt && d <= this.r;
        away.setMag(this.maxSpeed);
        let steer = p5.Vector.sub(away, this.vel);
        return steer.limit(this.maxForce);
    }
    return false;
}
Dots.prototype.applyForce = function(f){
    if(f){
        this.acc.add(f);
    }
}
Dots.prototype.update = function(){
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
}
Dots.prototype.show = function(){
    stroke(255);
    strokeWeight(this.r);
    point(this.pos.x, this.pos.y);
}
class Letter{
    constructor(x, y, w, h, buffer){
        this.pos = createVector(x, y);
        this.w = w;
        this.h = h;
        this.vel = createVector();
        this.buffer = buffer;
        this.life = 4;
        this.hit = false;
    }
}
Letter.prototype.update = function(cnt){
    this.pos.add(this.vel);
    if (cnt%200 === 0){
        this.vel = p5.Vector.random2D();
        this.vel.setMag(6);
    }
    if(this.pos.x < 0 || (this.pos.x+this.w) > width){
        this.pos.x = this.pos.x < 0 ? 0 : width-this.w;
        this.vel.x *= -1;
    }
    if((this.pos.y+this.h) > height || this.pos.y < 0){
        this.pos.y = this.pos.y < 0 ? 0 : height-this.h;
        this.vel.y *= -1;
    }
}
Letter.prototype.isHit = function(_blt){
    this.hit = false;
    for(let i = 0; i < _blt.length; i++){
        if (this.pos.x <= _blt[i].pos.x && _blt[i].pos.x <= (this.pos.x+this.w) && 
            this.pos.y <= _blt[i].pos.y && _blt[i].pos.y <= (this.pos.y+this.h)){
                this.life--;
                this.hit = true;
                _blt[i].collision = true;
        }
    }
    return this.hit;
}
Letter.prototype.isDead = function(){
    return this.life === 0;
}
Letter.prototype.shot = function(_bullets, maxShots){
    if(_bullets.length === maxShots){
        return false;
    }else if(Math.random() > 0.4){
        let bullet = new Bullet(this.pos.copy(), -1)
        _bullets.push(bullet);
    }
}
Letter.prototype.show = function(){
    if (this.isDead()){
        push();
        fill(255, 100, 100);
        rect(this.pos.x, this.pos.y, this.w, this.h);
        pop();
    }else if (this.hit){
        push();
        fill(255);
        rect(this.pos.x, this.pos.y, this.w, this.h);
        pop();
    }else{
        image(this.buffer, this.pos.x, this.pos.y);
    }
}