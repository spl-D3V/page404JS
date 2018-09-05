class Vector {
    constructor(x, y, z = 0){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static distSq(v1, v2){
        return (v1.x-v2.x)*(v1.y-v2.y) + (v1.y-v2.y)*(v1.y-v2.y) + (v1.z-v2.z)*(v1.z-v2.z)
    }
    static random2d(k = 1){
        let alpha = Math.random()*2*Math.PI;
        return new Vector(k*Math.cos(alpha), k*Math.sin(alpha), 0);
    }
    static addVectors(v1, v2, k = 1){
        return new Vector(v1.x+k*v2.x, v1.y+k*v2.y, v1.z+k*v2.z);
    }
}
Vector.prototype.add = function(_vector, k = 1){
    this.x += k*_vector.x;
    this.y += k*_vector.y;
    this.z += k*_vector.z;
}
Vector.prototype.mul = function(k){
    this.x *= k;
    this.y *= k;
    this.z *= k;
}
Vector.prototype.magSq = function(){
    return this.x*this.x + this.y*this.y + this.z*this.z;
}
Vector.prototype.setLimit = function(limit){
    if (this.magSq() > limit*limit){
        console.log(limit, this.magSq());
        this.mul(limit/Math.sqrt(this.magSq()));
        console.log('despues', this.magSq());
    }
}