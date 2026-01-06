const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ================== プレイヤー ==================
const player = {
  x: 280,
  y: 180,
  w: 40,
  h: 40,
  speed: 4
};

// ================== 入力管理 ==================
const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// ================== 更新処理 ==================
function update() {
  // 移動（WASD）
  if (keys["a"] || keys["A"]) player.x -= player.speed;
  if (keys["d"] || keys["D"]) player.x += player.speed;
  if (keys["w"] || keys["W"]) player.y -= player.speed;
  if (keys["s"] || keys["S"]) player.y += player.speed;

  // 画面外に出ないように制限
  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.h, player.y));
}

// ================== 描画処理 ==================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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
