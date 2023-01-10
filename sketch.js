let display_background = false;
let pg;
let temp_canvas;

function setup() {
  createCanvas(innerWidth, innerHeight);
  pg = createGraphics(width, height);
  document.body.style.backgroundColor = background_color_default.toString();
  clear();
  board_clear();
  ui_setup();
  ui_position();
}
let pivot_x = 0;
let pivot_y = 0;
let drawmode = "draw";
let display_grid = false;
function draw() {
  // background(20);
  clear();
  image(pg, 0, 0);
  if (drawmode == "lineready") {
    push_buttons[8].a = 255;
    if (mouseIsPressed && !mouse_used) {
      cursor("crosshair");
      strokeWeight(2);
      stroke(200);
      dotted_line(pivot_x, pivot_y, mouseX, mouseY);
    } else {
      noStroke();
      textSize(20);
      fill(155);
      text("Click and Drag for a line", mouseX, mouseY);
    }
  }
  if (drawmode == "rectangleready") {
    push_buttons[9].a = 255;
    if (mouseIsPressed && !mouse_used) {
      cursor("crosshair");
      // strokeWeight(brush_size_slider.value);   //rectangle ghost
      // stroke(brush_color_picker.picker.color()); 
      strokeWeight(2);
      stroke(200);
      noFill();
      dotted_rect(pivot_x, pivot_y, mouseX - pivot_x, mouseY - pivot_y);
    } else {
      noStroke();
      textSize(20);
      fill(155);
      text("Click and Drag draw a rectangle", mouseX, mouseY);
    }
  }
  if (drawmode == "circleready") {
    push_buttons[10].a = 255;
    if (mouseIsPressed && !mouse_used) {
      cursor("crosshair");
      strokeWeight(2);
      stroke(200);
      dotted_line(pivot_x, pivot_y, mouseX, mouseY);
      stroke(brush_color_picker.picker.color());
      strokeWeight(5);
      point(pivot_x, pivot_y);
      strokeWeight(brush_size_slider.value);
      noFill();
      circle(pivot_x, pivot_y, 2 * dist(pivot_x, pivot_y, mouseX, mouseY));
    } else {
      noStroke();
      textSize(20);
      fill(155);
      text("Click and Extend for a circle", mouseX, mouseY);
    }
  }
  if (drawmode == "draw") {
    push_buttons[11].a = 85;
    cursor(ARROW);
    if (mouseIsPressed && !mouse_used) {
      pg.strokeWeight(brush_size_slider.value);
      pg.stroke(brush_color_picker.picker.color());
      pg.line(pmouseX, pmouseY, mouseX, mouseY);
    }
  }
  if (drawmode == "erase") {
    push_buttons[12].a = 85;
    cursor("grab");
    noStroke();
    textSize(20);
    fill(155);
    text("Erase", mouseX + 15, mouseY + 4);
    noFill();
    stroke(155);
    strokeWeight(brush_size_slider.value / 4);
    let i = brush_size_slider.value * 2;
    line(
      mouseX - i,
      mouseY - i,
      mouseX + i,
      mouseY + i
    );
    line(
      mouseX + i,
      mouseY - i,
      mouseX - i,
      mouseY + i
    );
    circle(mouseX, mouseY, brush_size_slider.value * 10);
    if (mouseIsPressed && !mouse_used) {
      cursor("grabbing");
      pg.strokeWeight(brush_size_slider.value * 10);
      pg.erase(255, 255);
      pg.line(pmouseX, pmouseY, mouseX, mouseY);
      pg.noErase();
    }
  }
  if (display_grid) draw_grid();
  ui_draw();

}

function mouseDragged() {
  if (mouse_used) return;

  if (mouseButton == LEFT) {
    if (drawmode == "draw") {

    }
  }
}

function mousePressed() {
  if (mouseButton == LEFT) {
    ui_pressed();
    if (mouse_used) return;
    pivot_x = mouseX;
    pivot_y = mouseY;

  }
  // if (mouseButton == RIGHT) board_clear();
}

function mouseReleased() {
  if (!mouse_used) {
    if (drawmode == "lineready") {
      pg.strokeWeight(brush_size_slider.value);
      pg.stroke(brush_color_picker.picker.color());
      pg.line(pivot_x, pivot_y, mouseX, mouseY);
      drawmode = "draw";
    }
    if (drawmode == "rectangleready") {
      pg.strokeWeight(brush_size_slider.value);
      pg.stroke(brush_color_picker.picker.color());
      pg.noFill();
      pg.rect(pivot_x, pivot_y, mouseX - pivot_x, mouseY - pivot_y);
      drawmode = "draw";
    }
    if (drawmode == "circleready") {
      pg.strokeWeight(brush_size_slider.value);
      pg.stroke(brush_color_picker.picker.color());
      pg.noFill();
      pg.circle(pivot_x, pivot_y, 2 * dist(pivot_x, pivot_y, mouseX, mouseY));
      drawmode = "draw";
    }
  }
  if (drawmode == "line") drawmode = "lineready";
  if (drawmode == "rectangle") drawmode = "rectangleready";
  if (drawmode == "circle") drawmode = "circleready";
  mouse_used = false;
}

function board_clear() {
  // pg.background(background_color);
  pg.clear();

}

function draw_grid() {
  let s = 50;
  //draw a grid on the screen using the s variable as the size of each cell
  stroke(155, 5);
  strokeWeight(1);
  for (let x = 0; x < width; x += s) {
    for (let y = 0; y < height; y += s) {
      line(x, 0, x, height);
      line(0, y, width, y);
    }
  }
}

function dotted_line(x1, y1, x2, y2) {
  let s = 10;
  let d = dist(x1, y1, x2, y2);
  let n = d / s;
  for (let i = 0; i < n; i++) {
    let x = lerp(x1, x2, i / n);
    let y = lerp(y1, y2, i / n);
    point(x, y);
  }
}

function dotted_rect(x, y, w, h) {
  dotted_line(x, y, x + w, y);
  dotted_line(x, y, x, y + h);
  dotted_line(x + w, y, x + w, y + h);
  dotted_line(x, y + h, x + w, y + h);
}
function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
  if (width > pg.width || height > pg.height) {
    let temp = createGraphics(width, height);
    temp.image(pg, 0, 0);
    pg = temp;
  }
  ui_position();
  clear();
}