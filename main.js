const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ================== フィールド（中央配置） ==================
const field = {
  w: 360,
  h: 240,
};
field.x = (canvas.width - field.w) / 2;
field.y = (canvas.height - field.h) / 2;

// ================== プレイヤー ==================
const player = {
  w: 30,          // 少し小さく
  h: 30,
  x: field.x + field.w / 2 - 15,
  y: field.y + field.h / 2 - 15,
  speed: 5.5      // 少し速く
};

// ================== 入力管理 ==================
const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

// ================== 更新処理 ==================
function update() {
  // 移動（WASD）
  if (keys["KeyA"]) player.x -= player.speed;
  if (keys["KeyD"]) player.x += player.speed;
  if (keys["KeyW"]) player.y -= player.speed;
  if (keys["KeyS"]) player.y += player.speed;

  // フィールド内制限
  player.x = Math.max(
    field.x,
    Math.min(field.x + field.w - player.w, player.x)
  );
  player.y = Math.max(
    field.y,
    Math.min(field.y + field.h - player.h, player.y)
  );
}

// ================== 描画処理 ==================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // フィールド
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.strokeRect(field.x, field.y, field.w, field.h);

  // プレイヤー
  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.w, player.h);
}

// ================== メインループ ==================
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
