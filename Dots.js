class Dots{
    constructor(x, y, r){
        this.target = createVector(x, y);
        this.pos = createVector(Math.random()*width, Math.random()*height);
        this.vel = p5.Vector.random2D();
        this.acc = createVector();
        this.r = r;
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
    point(this.pos.x, this.pos.y);
}
class Letter{
    constructor(x, y, w, h, textbox){
        this.pos = createVector(x, y);
        this.w = w;
        this.h = h;
        this.vel = createVector();
        this.textbox = textbox;
        this.life = 4;
        this.hit = false;
        this.buffer = [];
    }
}
Letter.prototype.init = function(){
    let _colors = [[214, 1, 12], [255, 70, 0], [255, 100, 0], [252,236,20], [255,255,255]]
    for(let i=0; i <= this.life; i++){
        let b = createGraphics(this.textbox.w, this.textbox.h);
        b.textFont(this.textbox.fnt);
        b.textSize(this.textbox.fs);
        b.fill(_colors[i]);
        b.text(this.textbox.msg, 0, this.textbox.h);
        this.buffer.push(b);
    }
    this.textbox = undefined;
}
Letter.prototype.update = function(cnt){
    this.pos.add(this.vel);
    if (cnt%200 === 0){
        this.vel = p5.Vector.random2D();
        this.vel.setMag(5);
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
    if(_bullets.length >= maxShots){
        return false;
    }else if(Math.random() < 0.4){
        let bullet = new Bullet(this.pos.copy(), -1)
        _bullets.push(bullet);
    }
}
Letter.prototype.show = function(){
    image(this.buffer[this.life], this.pos.x, this.pos.y);
}