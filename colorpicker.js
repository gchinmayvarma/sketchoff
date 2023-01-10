function make_color_buttons(colorlist) {
  let push_buttons_tempi = push_buttons.length;
  for (let i = 0; i < colorlist.length; ++i) {
    push_buttons.push(
      new Button(
        "",
        15,
        () => {
          brush_color_picker.picker.value(colorlist[i]);
          if (drawmode == "erase") drawmode = "draw";
        },
        false,
        15 + brush_color_picker.w + 24 * i,
        height - 50,
        0
      )
    );
    push_buttons[push_buttons_tempi + i].w =
      push_buttons[push_buttons_tempi + i].h;
    push_buttons[push_buttons_tempi + i].c_outside = color(colorlist[i]);
    push_buttons[push_buttons_tempi + i].c_inside = color(colorlist[i]);
    push_buttons[push_buttons_tempi + i].highlight = true;
  }
}

class ColorPicker {
  constructor(g) {
    this.g = g;
    this.picker = createColorPicker(color(255, 0, 69));
    this.color = color(0, 0);

    this.w = 50;
    this.h = 20;
    this.picker.size(this.w, this.h);
    this.picker.style("opacity", "0");
    this.picker.style("transform-origin", "0% 0%");
    this.picker.style("cursor", "pointer");
    // this.picker.style( "background-color" , "red" ) ;
    this.mx = this.my = 0;
    this.a = 0;
    this.alpha_slider = new Slider(g, 0, 255, 100);
    this.alpha_slider.r = 5;
    this.alpha_slider.d = 10;
    this.alpha_slider.w = this.w;
    this.size_slider = new Slider(g, 1, 5, 3, this.h);
    this.size_slider.r = 5;
    this.size_slider.d = 10;
    this.position(100, 100, -10);
  }
  position(x, y, t) {
    this.x = x;
    this.y = y;
    this.theta = radians(t);
    this.picker.position(x, y);
    this.picker.style("transform", "rotate(" + this.theta + "rad)");
    this.alpha_slider.x = this.x - (3 + this.h) * sin(this.theta);
    this.alpha_slider.y = this.y + (3 + this.h) * cos(this.theta);
    this.alpha_slider.theta = this.theta;

    this.size_slider.x = this.x - (3 + this.h) * sin(this.theta) - 3;
    this.size_slider.y = this.y + (3 + this.h) * cos(this.theta);
    this.size_slider.theta = this.theta - PI / 2;
  }
  inside() {
    return this.mx > 0 && this.mx < this.w && this.my > 0 && this.my < this.h;
  }
  setm(args) {
    this.mx = args[0];
    this.my = args[1];
  }
  clicked() {
    this.size_slider.clicked();
    this.alpha_slider.clicked();
  }
  display() {
    this.g.push();
    this.g.translate(this.x, this.y);
    this.g.rotate(this.theta);
    this.g.textAlign(LEFT, BOTTOM);
    this.g.textSize(this.h * 0.4);
    this.g.fill(255);
    this.g.noStroke();
    // this.g.text("< COLOR >", 0, 0);

    this.g.stroke(100, this.a);
    this.g.strokeWeight(2);
    this.g.fill(this.color);
    this.g.rect(0, 0, this.w, this.h);
    this.g.pop();
    // this.size_slider.work();
    // this.alpha_slider.work();

  }
  work() {
    // if(this.inside()) cursor(HAND);
    this.a = lerp(this.a, this.inside() ? 255 : 10, 0.08);
    this.setm(translatePoint(mouseX, mouseY, this.x, this.y, this.theta));
    this.color = lerpColor(this.color, this.picker.color(), 0.08);
    this.color.setAlpha(this.alpha_slider.value);
    this.size_slider.color_line = this.color;
    this.size_slider.color_button = lerpColor(
      color(255, 0, 69),
      this.color,
      0.6
    );
    this.alpha_slider.color_line = this.color;
    this.alpha_slider.color_button = lerpColor(
      color(255, 0, 69),
      this.color,
      0.6
    );
    this.display();

  }
}

class Slider {
  constructor(
    g,
    min_val = 0,
    max_val = 100,
    default_val = null,
    w = 150,
    x = 0,
    y = 0,
    theta = 0,
    show_value = 2
  ) {
    this.g = g;

    this.position(x, y);
    this.w = w;
    this.r = 10;
    this.d = 2 * this.r;
    this.on = false;
    this.color_button = color(0, 0);
    this.color_button_target = color(255, 0, 69);
    this.color_line = color(255, 0, 69);
    this.color_text = color(255, 0, 69);
    this.bx = this.xoff = this.yoff = this.mx = this.my = 0;
    this.theta = theta;
    this.show_value = show_value;
    this.minval = min_val;
    this.maxval = max_val;
    this.value = default_val || this.minval;
    this.bx =
      ((this.value - this.minval) * this.w) / (this.maxval - this.minval);
  }
  position(x, y) {
    this.x = x;
    this.y = y;
  }
  setm(args) {
    this.mx = args[0];
    this.my = args[1];
  }
  inside(x, y) {
    if (
      x > this.bx - this.r &&
      x < this.bx + this.r &&
      y > -this.r &&
      y < this.r
    )
      return dist(x, y, this.bx, 0) < this.r;
    return false;
  }
  display() {
    this.g.push();
    this.g.translate(this.x, this.y);
    this.g.rotate(this.theta);
    this.g.stroke(80);
    this.g.strokeWeight(3);
    this.g.line(0, 0, this.w, 0);
    this.g.stroke(this.color_line);
    this.g.line(0, 0, this.bx, 0);
    this.g.noStroke();
    this.g.fill(this.color_button);
    this.g.circle(this.bx, 0, this.d);
    this.g.fill(this.color_text);
    if (this.show_value) {
      /// maybe even control it when on? too many things possible
      if (this.show_value === 1 || this.on || this.inside(this.mx, this.my)) {
        this.g.textSize(this.r * 2.5);
        this.g.textAlign(LEFT, BOTTOM);
        this.g.text(int(this.value), this.w, 0);
      }
    }
    this.g.pop();
  }
  clicked() {
    if (this.inside(this.mx, this.my)) {
      this.xoff = this.bx - this.mx;
      this.yoff = this.y - this.my;
      this.on = true;
      mouse_used = true;
    }
  }
  work() {
    this.display();
    this.setm(translatePoint(mouseX, mouseY, this.x, this.y, this.theta));
    if (this.on) {
      this.bx = constrain(this.xoff + this.mx, 0, this.w);
      this.value =
        this.minval + (this.maxval - this.minval) * (this.bx / this.w);
      if (!mouseIsPressed) this.on = false;
    }
    if (this.inside(this.mx, this.my) || this.on) {
      cursor(HAND);
      this.color_button = lerpColor(this.color_button, color(0, 0, 0), 0.1);
    }
    else
      this.color_button = lerpColor(this.color_button, this.color_button_target, 0.1);
  }
}
