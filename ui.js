let mouse_used = false;
let toggle_buttons = [];
let push_buttons = [];
let brush_color_picker;
function ui_setup() {
  push_buttons = [];
  toggle_buttons = [];
  toggle_buttons.push(new ToggleButton(20, 10, 70, -15));
  toggle_buttons[0].f = () => {
    display_grid = toggle_buttons[0].on;
    console.log(display_grid);
  }
  toggle_buttons.push(new ToggleButton(20, width - 110, height - 40, 0));

  push_buttons.push(
    new Button("Clear Board", 25, board_clear, false, 10, 20, -5)
  );
  push_buttons[0].highlight = false;
  push_buttons.push(
    new Button(
      "💾",
      20,
      () => {
        save(pg, "sketchoff.png");
      },
      false,
      13 + push_buttons[0].w * cos(push_buttons[0].theta),
      12.5,
      -5
    )
  );
  push_buttons[push_buttons.length - 1].highlight = true;
  brush_color_picker = new ColorPicker(this);
  brush_color_picker.position(10, height - 50, 0);
  make_color_buttons([
    "#ff303e",
    "#FC00CA",
    "#9300FF",
    "#0053FF",
    "#008080",
    "#006442",
  ]);
  brush_size_slider = new Slider(this, 2, 18, 10, 200, 10, height - 15);
  brush_size_slider.r = 10;
  brush_size_slider.d = 20;

  toolheight = height - 100;
  push_buttons.push(
    new Button(
      "╱",
      20,
      () => {
        drawmode = "line";
      },
      false,
      60,
      toolheight,
      -5
    )
  );
  push_buttons.push(
    new Button(
      "▭",
      20,
      () => {
        drawmode = "rectangle";
      },
      false,
      110,
      toolheight,
      -5
    )
  );
  push_buttons.push(
    new Button(
      "◯",
      20,
      () => {
        drawmode = "circle";
      },
      false,
      160,
      toolheight,
      -5
    )
  );

  push_buttons.push(
    new Button(
      "✎",
      20,
      () => {
        drawmode = "draw";
      },
      false,
      10,
      toolheight,
      -5
    )
  );
  push_buttons.push(
    new Button(
      "⌫Eraser",
      20,
      () => {
        drawmode = "erase";
      },
      false,
      width - 120,
      toolheight,
      -5
    )
  );
}

function ui_draw() {
  for (let i = 0; i < toggle_buttons.length; i++) toggle_buttons[i].work();
  for (let i = 0; i < push_buttons.length; i++) push_buttons[i].work();
  brush_color_picker.work();
  brush_size_slider.color_line = brush_color_picker.color;
  brush_size_slider.color_button_target = brush_color_picker.color;
  brush_size_slider.work();
  noStroke();
  fill(80);
  push();
  translate(20, 115);
  rotate(-0.25);
  textSize(20);
  text("GRID", 0, 0);
  pop();
  textSize(20); 
  text("background", toggle_buttons[1].x, toggle_buttons[1].y - 5);
}

function ui_pressed() {
  brush_color_picker.clicked();
  brush_size_slider.clicked();
  for (let i = 0; i < toggle_buttons.length; i++) toggle_buttons[i].clicked();
  for (let i = 0; i < push_buttons.length; i++) push_buttons[i].clicked();
}