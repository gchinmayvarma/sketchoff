function make_color_buttons(colorlist) {
  let push_buttons_tempi = push_buttons.length;
  for (let i = 0; i < colorlist.length; ++i) {
    push_buttons.push(
      new Button(
        "",
        15,
        ()=>{
          brush_color_picker.picker.value(colorlist[i]);  
        },
        false,
        15 + brush_color_picker.w + 24*i,
        height - 50,
        0
      )
    );
    push_buttons[push_buttons_tempi + i].w =
      push_buttons[push_buttons_tempi + i].h;
    push_buttons[push_buttons_tempi+i].c_outside = color(colorlist[i]);
  }
}

class ToggleButton {
  constructor(size = 20, x = 0, y = 0, t = -10) {
    this.textSize = size;
    this.position(x, y);
    this.setit();
    this.sx = 0;
    this.on = true;
    this.theta = radians(t);
    this.coloron = color(255, 0, 100, 150);
    this.coloroff = color(85, 27, 194, 150);
    this.color = color(50, 0);
    this.f = function () {
      print("Enable Env Decals =", this.on);
    };
  }
  position(x, y) {
    this.x = x;
    this.y = y;
  }
  setit() {
    textSize(this.textSize);
    this.w = (textWidth("ON") + this.textSize) * 1;
    this.ww = textWidth("OFF") + this.w;
    this.h = textAscent() + this.textSize / 2;
  }
  inside() {
    if (this.theta === 0)
      return (
        mouseX > this.x &&
        mouseX < this.x + this.ww &&
        mouseY > this.y &&
        mouseY < this.y + this.h
      );
    let [x, y] = translatePoint(mouseX, mouseY, this.x, this.y, this.theta);
    return x > 0 && x < this.ww && y > 0 && y < this.h;
  }
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.theta);
    textSize(this.textSize);
    textAlign(LEFT, CENTER);
    if (this.inside()) {
      cursor(HAND);
      this.infocus();
    } else {
      this.outfocus();
    }
    pop();
  }
  infocus() {
    fill(60 - map(this.sx, 0, this.w, 0, 20));
    noStroke();
    rect(0, 0, this.ww, this.h);
    fill(this.color);
    rect(this.sx, 0, this.w, this.h);
    if (this.on) {
      fill(0);
      text("ON", 0, this.h / 2);
      fill(200, 50);
      text("OFF", this.w, this.h / 2);
    } else {
      fill(205);
      text("OFF", this.w, this.h / 2);
      fill(200, 50);
      text("ON", 0, this.h / 2);
    }
  }
  outfocus() {
    fill(60 - map(this.sx, 0, this.w, 0, 20));
    noStroke();
    rect(0, 0, this.ww, this.h);
    fill(this.color);
    rect(this.sx, 0, this.w, this.h);
    if (this.on) {
      fill(0);
      text("ON", 0, this.h / 2);
    } else {
      fill(205);
      text("OFF", this.w, this.h / 2);
    }
  }

  clicked() {
    if (!this.inside()) return;
    this.on = !this.on;
    this.f();
    mouse_used = true;
  }
  work() {
    this.display();
    if (this.on) {
      this.sx = lerp(this.sx, 0, 0.14);
      this.color = lerpColor(this.color, this.coloron, 0.3);
    } else {
      this.sx = lerp(this.sx, this.w, 0.14);
      this.color = lerpColor(this.color, this.coloroff, 0.05);
    }
  }
}

class Button {
  constructor(
    s,
    size = 20,
    f = emptyfunction,
    toggleable = false,
    x = 0,
    y = 0,
    t = -10
  ) {
    this.displaylikelink = false;
    this.s = s;
    this.textSize = size;
    this.toggleable = toggleable;
    this.f = f;
    this.position(x, y);
    this.on = false;
    this.theta = radians(t);
    textSize(this.textSize);
    this.w = textWidth(this.s) + this.textSize;
    this.h = textAscent() + this.textSize / 2;
    this.c = this.c_text = this.c_stroke = this.c_lines = color(0, 0);
    this.c_inside = color(255, 0, 69);
    this.c_outside = color(40);
    this.mx = this.my = 0;
    this.lines_theta = radians(80);
    this.lines_d = this.h / tan(this.lines_theta);
    this.lines_dis = 20;
    this.lines_speed = 0.5;
    this.lines_weight = 2;
  }
  position(x, y) {
    this.x = x;
    this.y = y;
  }
  inside() {
    return this.mx > 0 && this.mx < this.w && this.my > 0 && this.my < this.h;
  }
  display_lines() {
    stroke(this.c_lines);
    strokeWeight(this.lines_weight);
    let x1, y1, x2, y2;
    for (
      let i = ((frameCount * this.lines_speed) % this.lines_dis) - this.lines_d;
      i < this.w;
      i += this.lines_dis
    ) {
      x1 = i;
      y1 = this.h;
      x2 = x1 + this.lines_d;
      y2 = 0;
      if (x2 > this.w) {
        y2 = map(x2 - this.w, 0, this.lines_d, 0, this.h);
        x2 = this.w;
      }
      if (x1 < 0) {
        y1 = map(x1, -this.lines_d, 0, 0, this.h);
        x1 = 0;
      }
      line(x1, y1, x2, y2);
    }
  }
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.theta);
    stroke(0);
    strokeWeight(1);
    fill(this.c);
    rect(0, 0, this.w, this.h);
    //if( this.inside() )
    //this.display_lines() ;
    textSize(this.textSize);
    textAlign(CENTER, CENTER);
    fill(150);
    text(this.s, this.w / 2, this.h / 2);
    pop();
  }
  display_aslink() {
    push();
    translate(this.x, this.y);
    rotate(this.theta);
    // fill(this.c);
    // rect(0, 0, this.w, this.h);
    //if( this.inside() )
    //this.display_lines() ;
    textSize(this.textSize);
    textAlign(CENTER, CENTER);
    stroke(this.c);
    strokeWeight(2);
    line(this.w * 0.04, this.h * 0.9, this.w * 0.96, this.h * 0.9);
    noStroke();
    fill(this.c);
    text(this.s, this.w / 2, this.h / 2);
    pop();
  }
  clicked() {
    if (!this.inside()) return;
    mouse_used = true;
    if (this.toggleable) this.on = !this.on;
    else this.f();
  }
  work() {
    [this.mx, this.my] = translatePoint(
      mouseX,
      mouseY,
      this.x,
      this.y,
      this.theta
    );
    this.c = lerpColor(
      this.c,
      this.inside() ? this.c_inside : this.c_outside,
      0.1
    ); //: lerpColor(this.c, this.c_outside, 0.1);
    // this.c_lines =  //lerpColor(this.c_lines,this.inside()? this.c_outside:this.c_inside, 0.05) ;
    if (this.displaylikelink) this.display_aslink();
    else this.display();
    if (this.on) this.f();
    if (this.inside()) cursor(HAND);
  }
}

function emptyfunction() {}

function translatePoint(absPointX, absPointY, centerX, centerY, theta) {
  // theta in radians
  absPointX -= centerX;
  absPointY -= centerY;
  let c = cos(theta);
  let s = sin(theta);
  return [absPointX * c + absPointY * s, -absPointX * s + absPointY * c];
}
