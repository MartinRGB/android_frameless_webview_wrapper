// init canvas
let canvas = document.getElementById("c");
(ctx = canvas.getContext("2d")),
  (H = canvas.height = 780),
  (W = canvas.width = 360);
ctx.lineCap = "round";
document.addEventListener("mousemove", event => mousemove(event), false);

let cursor = new Vector(W / 2, H / 1.2);

function mousemove(event) {
  cursor.x = event.pageX - canvas.offsetLeft;
  cursor.y = event.pageY - canvas.offsetTop;
}

// World variables
let gravity = new Vector(0, -0.3);

let color = ["#fa812a", "#d6570a", "#a13a0e"];
// Hair class

class Point {
  constructor(x, y) {
    this.position = new Vector(x, y);
    this.old_position = new Vector(x, y);
    this.pinned = false;
  }
}

class Link {
  constructor(p0, p1) {
    this.p0 = p0;
    this.p1 = p1;
    this.length = p0.position.dist(p1.position);
  }
}

class Hair {
  constructor(x, y, angle, length, divisions) {
    this.position = new Vector(x, y);
    this.angle = angle || 0;
    this.length = length || 100;
    this.divisions = divisions || 3;
    this.points = [];
    this.links = [];
    this.thickness = 2;
    this.stiffness = .2;
    this.start_color = "#000";
    this.color = color;
    // add points
    for (let i = 0; i < divisions; i++) {
      let separation = this.length / divisions * i;
      let v = new Vector(0, 0);
      v.setMag(separation);
      v.setHeading(angle);
      v.add(this.position);
      this.points.push(new Point(v.x, v.y));
    }
    this.points[0].pinned = true;
    for (let i = 0; i < divisions - 1; i++) {
      this.links.push(new Link(this.points[i], this.points[i + 1]));
    }
  }
  update() {
    for (let i = 0; i < this.points.length; i++) {
      let point = this.points[i];

      if (point.pinned) continue;
      let velocity = point.position.copy();
      velocity.sub(point.old_position);
      velocity.mult(0.98);
      point.old_position = point.position.copy();
      point.position.add(velocity);

      point.position.x += Math.cos(this.angle) * (this.stiffness / i);
      point.position.y += Math.sin(this.angle) * (this.stiffness / i);

      let distance = point.position.dist(cursor);

      if (distance < force_contact.size) {
        let force = new Vector();

        let angle = point.position.angle(cursor);
        force.setMag(Util.map(distance, 0, force_contact.size, 1.6, 0));
        force.setHeading(angle);
        point.position.sub(force);
      }

      point.position.add(wind.value);
      point.position.add(gravity);
    }
      this.links.forEach(link => {
        let distance = link.p0.position.dist(link.p1.position),
          difference = link.length - distance,
          percent = difference / distance / 2;
        let offset = new Vector(
          (link.p1.position.x - link.p0.position.x) * percent,
          (link.p1.position.y - link.p0.position.y) * percent
        );
        if (!link.p0.pinned) {
          link.p0.position.sub(offset);
        }
        if (!link.p1.pinned) {
          link.p1.position.add(offset);
        }
      });
    
  }
  draw() {
    let distance = this.points[0].position.dist(cursor);
    if (distance < force_contact.size) {
      this.color = lerpColor(
      this.contact_color,
      this.start_color,
      Util.map(distance, 0, force_contact.size, 0, 1)
      );
    }else{
      this.color = this.start_color;
    }
    
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.thickness;
    ctx.beginPath();
    smooth(this.points.map(point => point.position));
    ctx.stroke();
  }
}

let land = {
  field: [],
  init: function() {

  let div = 30;
  
  for (let y= H; y > 0;  y-= div){
  for (let x= W; x > 0; x-=div){
    let new_pos = new Vector(0,0);
    if(y % (div*2) < div){
      new_pos = new Vector(x,y);
    }else{
      new_pos = new Vector(x-(div/2),y);
        }
    
        let g = new Hair(
          new_pos.x,
          new_pos.y,
          -Math.PI / 2,
          Util.random(200, 500),
          6
        );
        
        g.color = lerpColor(
          "#2e069e",
          "#1dd2ac",
          Util.map(y, 0, H, 1, 0)
        );
        g.contact_color = lerpColor(
          "#ed3e6f",
          "#fff25e",
          Util.map(y, 0, H, 1, 0)
        );
        g.start_color = g.color;
        g.thickness = Util.random(30, 50);
        g.stiffness = Util.random(0.01, 2);
        this.field.unshift(g);

    
    }
  }
    
  },
  update: function() {
    this.field.forEach(grass => {
      grass.update();
    });
  },
  draw: function() {
    this.field.forEach(grass => {
      grass.draw();
    });
  },
  render: function() {
    this.update();
    this.draw();
  }
};

land.init();

let wind = {
  value: new Vector(0, 0),
  reset: function() {
    this.time_start = new Date();
    this.start = this.value.x;
    this.duration = Util.random(200, 1000);
    this.goal = Util.random(-0.3, 0.3);
  },
  update: function() {
    let time = new Date() - this.time_start;
    if (time < this.duration) {
      this.value.x = Tween.linear(
        time,
        this.start,
        this.goal - this.start,
        this.duration
      );
    } else {
      setTimeout(() => {
        this.reset();
      }, Util.random(100, 3000));
    }
  }
};
wind.reset();

let force_contact = {
  size: 0,
  current:0,
  amplitude: 100,
  period: 80,
  min:60,
  update: function(){

let gradient = ctx.createRadialGradient(cursor.x,cursor.y, 0, cursor.x,cursor.y, this.size);
    
    
gradient.addColorStop(0, lerpColor(
          "#ed3e6f",
          "#fff25e",
          Util.map(cursor.y, 0, H, 1, 0)
        ));
gradient.addColorStop(1, 'rgba(255,150,150,0)');
ctx.fillStyle = gradient;
ctx.fillRect(cursor.x - this.size ,cursor.y - this.size , this.size * 2, this.size * 2);
    
    
    this.size =  this.min + Math.abs(this.amplitude * Math.cos(this.current / this.period));
    this.current += 1;
    
  },
}

function loop() {
  // main animation loop
  ctx.clearRect(0, 0, W, H);
  force_contact.update();
  wind.update()
  land.render();
  // update wind
  requestAnimationFrame(loop);
}

loop();

function smooth(points) {
  ctx.moveTo(points[0].x, points[0].y);
  for (i = 1; i < points.length - 2; i++) {
    var xc = (points[i].x + points[i + 1].x) / 2;
    var yc = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }

  ctx.quadraticCurveTo(
    points[i].x,
    points[i].y,
    points[i + 1].x,
    points[i + 1].y
  );
}

// https://gist.github.com/rosszurowski/67f04465c424a9bc0dae

function lerpColor(a, b, amount) {
  var ah = parseInt(a.replace(/#/g, ""), 16),
    ar = ah >> 16,
    ag = (ah >> 8) & 0xff,
    ab = ah & 0xff,
    bh = parseInt(b.replace(/#/g, ""), 16),
    br = bh >> 16,
    bg = (bh >> 8) & 0xff,
    bb = bh & 0xff,
    rr = ar + amount * (br - ar),
    rg = ag + amount * (bg - ag),
    rb = ab + amount * (bb - ab);

  return (
    "#" + (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1)
  );
}