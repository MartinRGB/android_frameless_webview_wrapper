const PI = Math.PI,
      TWO_PI = Math.PI * 2;

const Util = {};
Util.timeStamp = function() {
	return window.performance.now();
};
Util.random = function(min, max) {
  return min + Math.random() * (max - min);
};
Util.map = function(a, b, c, d, e) {
  return (a - b) / (c - b) * (e - d) + d;
};
Util.lerp = function(value1, value2, amount) {
  return value1 + (value2 - value1) * amount;
};
Util.clamp = function(value,min,max){
	return Math.max(min, Math.min(max, value));
};
Util.array2D = function(tableau, array_width){
	var result = [];
	for (var i = 0; i < tableau.length; i += array_width) result.push(tableau.slice(i, i + array_width));
	return result;
};
Util.threeAngle = function(p0,p1,p2){
    var b = Math.pow(p1.x-p0.x,2) + Math.pow(p1.y-p0.y,2),
        a = Math.pow(p1.x-p2.x,2) + Math.pow(p1.y-p2.y,2),
        c = Math.pow(p2.x-p0.x,2) + Math.pow(p2.y-p0.y,2);
    return Math.acos( (a+b-c) / Math.sqrt(4*a*b) );
}

const Tween = {};
Tween.linear = function(currentTime, start, degreeOfChange, duration) {
  return degreeOfChange * currentTime / duration + start;
};
Tween.easeInOutQuad = function(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};
Tween.easeInOutExpo = function(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
  t--;
  return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
};
class v3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class Vector{
	constructor(x,y){
		this.x = x || 0;
		this.y = y || 0;
	}
	set(x,y){
		this.x = x;
		this.y = y;
	}
  reset(){
		this.x = 0;
		this.y = 0;
  }
	fromAngle(angle){
		let x = Math.cos(angle),
			y = Math.sin(angle);
		return new Vector(x,y);
	}
	add(vector){
		this.x += vector.x;
		this.y += vector.y;
	}
	sub(vector){
		this.x -= vector.x;
		this.y -= vector.y;
	}
	mult(scalar){
		this.x *= scalar;
		this.y *= scalar;
	}
	div(scalar){
		this.x /= scalar;
		this.y /= scalar;
	}
	dot(vector){
		return vector.x * this.x + vector.y * this.y;
	}
	limit(limit_value){
		if(this.mag() > limit_value) this.setMag(limit_value);
	}
	mag(){
		return Math.hypot(this.x,this.y);
	}
	setMag(new_mag){
		if(this.mag() > 0){
			this.normalize();
		}else{
			this.x = 1;
			this.y = 0;
		}
		this.mult(new_mag);
	}
	normalize(){
		let mag = this.mag();
		if(mag > 0){
			this.x /= mag;
			this.y /= mag;
		}
	}
	heading(){
		return Math.atan2(this.x,this.y);
	}
	setHeading(angle){
		let mag = this.mag();
		this.x = Math.cos(angle) * mag;
		this.y = Math.sin(angle) * mag;
	}
	dist(vector){
		return new Vector(this.x - vector.x,this.y - vector.y).mag();
	}
	angle(vector){
		return Math.atan2(vector.y - this.y, vector.x - this.x);
	}	
	copy(){
		return new Vector(this.x,this.y);
	}
}

const cp = CanvasRenderingContext2D.prototype;
cp.circle = function(x, y, radius) {
  this.beginPath();
  this.arc(x, y, radius, 0, 2 * Math.PI);
};
cp.fillCircle = function(x, y, radius) {
  this.circle(x, y, radius);
  this.fill();
};
cp.strokeCircle = function(x, y, radius) {
  this.circle(x, y, radius);
  this.stroke();
};
