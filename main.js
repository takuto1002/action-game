const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const player = {
  x: 280,
  y: 180,
  w: 40,
  h: 40,
  speed: 4
};

// キー入力（codeで統一）
const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

function update() {
  // WASDのみ
  if (keys["KeyA"]) player.x -= player.speed;
  if (keys["KeyD"]) player.x += player.speed;
  if (keys["KeyW"]) player.y -= player.speed;
  if (keys["KeyS"]) player.y += player.speed;

  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.h, player.y));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // プレイヤー
  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // ★ デバッグ表示（ここ重要）
  ctx.fillStyle = "white";
  ctx.font = "14px monospace";
  ctx.fillText("W: " + !!keys["KeyW"], 10, 20);
  ctx.fillText("A: " + !!keys["KeyA"], 10, 40);
  ctx.fillText("S: " + !!keys["KeyS"], 10, 60);
  ctx.fillText("D: " + !!keys["KeyD"], 10, 80);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
