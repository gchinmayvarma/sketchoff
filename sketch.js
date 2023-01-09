function setup() {
  createCanvas(innerWidth, innerHeight);
  board_clear();
  ui_setup();
}

function draw() {
  // background(20);
  cursor(ARROW);
  ui_draw();
}

function mouseDragged() {
  if (mouse_used) return;
  strokeWeight(5);
  stroke(brush_color_picker.picker.color());

  line(pmouseX, pmouseY, mouseX, mouseY);
}

function mousePressed() {
  ui_pressed();
}

function mouseReleased() {
  mouse_used = false;
}
function board_clear() {
  background(20);
}
