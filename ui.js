let mouse_used = false;
let toggle_buttons = [];
let push_buttons = [];
let brush_color_picker;
function ui_setup() {
  toggle_buttons.push(new ToggleButton(20, 10, 70, -15));
  push_buttons.push(
    new Button("Clear Board", 25, board_clear, false, 10, 20, -5)
  );
  push_buttons.push(
    new Button(
      "💾",
      20,
      board_clear,
      false,
      13 + push_buttons[0].w * cos(push_buttons[0].theta),
      12.5,
      -5
    )
  );
  brush_color_picker = new ColorPicker(this);
  brush_color_picker.position(10, height - 50, 0);
  make_color_buttons([
    "#FF0045",
    "#FF7F00",
    "#0053FF",
    "#9300FF",
    "#FC00CA",
  ]);
}

function ui_draw() {
  for (let i = 0; i < toggle_buttons.length; i++) toggle_buttons[i].work();
  for (let i = 0; i < push_buttons.length; i++) push_buttons[i].work();
  brush_color_picker.work();
}

function ui_pressed() {
  brush_color_picker.clicked();
  for (let i = 0; i < toggle_buttons.length; i++) toggle_buttons[i].clicked();
  for (let i = 0; i < push_buttons.length; i++) push_buttons[i].clicked();
}
