let mouse_used = false;
let toggle_buttons = [];
let push_buttons = [];
let brush_color_picker;
let background_color_picker;
let background_color_default = "#121212";
let toolheight = 0;

function ui_preload() {

}
function ui_position() {
  toggle_buttons[0].position(10, 70);
  toggle_buttons[1].position(width - 110, height - 40);
  push_buttons[0].position(10, 20);
  push_buttons[1].position(13 + push_buttons[0].w * cos(push_buttons[0].theta), 12.5);
  brush_color_picker.position(10, height - 50, 0);
  brush_size_slider.position(10, height - 15);
  background_color_picker.position(width - 150, height - 44, 0);
  toolheight = height - 100;

  for (let i = 2; i < 8; i++) {
    push_buttons[i].position(15 + brush_color_picker.w + 24 * i - 48,
      height - 50);
  }


  push_buttons[8].position(60, toolheight);
  push_buttons[9].position(110, toolheight);
  push_buttons[10].position(160, toolheight);
  push_buttons[11].position(10, toolheight);
  push_buttons[12].position(width - 120, toolheight);
}
function ui_setup() {
  push_buttons = [];
  toggle_buttons = [];
  toggle_buttons.push(new ToggleButton(20, 10, 70, -15));
  toggle_buttons[0].f = () => {
    display_grid = toggle_buttons[0].on;
  }
  toggle_buttons.push(new ToggleButton(20, width - 110, height - 40, 0));
  toggle_buttons[1].f = () => {
    display_background = toggle_buttons[1].on;
    if (!toggle_buttons[0].on) {
      document.body.style.backgroundColor = background_color_default.toString();
    }
  }
  push_buttons.push(
    new Button("Clear Board", 25, board_clear, false, 10, 20, -5)
  );
  push_buttons[0].highlight = false;
  push_buttons.push(
    new Button(
      "💾",
      20,
      () => {
        if (display_background) {
          temp_canvas = createGraphics(pg.width, pg.height);
          temp_canvas.noStroke();
          temp_canvas.fill(background_color_default);
          temp_canvas.rect(0, 0, temp_canvas.width, temp_canvas.height);
          temp_canvas.fill(background_color_picker.color);              // NOT ABSOLULTE
          // use the picker.picker.color true background (eye cancer)
          temp_canvas.rect(0, 0, temp_canvas.width, temp_canvas.height);
          temp_canvas.image(pg, 0, 0);
          save(temp_canvas, "sketchoff.png");
        } else {
          save(pg, "sketchoff.png");
        }
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

  background_color_picker = new ColorPicker(this);
  background_color_picker.w = background_color_picker.h = 34;
  background_color_picker.picker.value(background_color_default);
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
  if (display_background) {
    background_color_picker.a = 255;
    background_color_picker.work();
    document.body.style.backgroundColor = background_color_picker.color;
  }

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
  if (display_background) background_color_picker.clicked();
  for (let i = 0; i < toggle_buttons.length; i++) toggle_buttons[i].clicked();
  for (let i = 0; i < push_buttons.length; i++) push_buttons[i].clicked();
}