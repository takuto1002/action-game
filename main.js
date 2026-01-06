const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// プレイヤー
const player = {
  x: 280,
  y: 180,
  w: 40,
  h: 40,
  speed: 4
};

// 入力（code方式）
const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

function update() {
  if (keys["KeyA"]) player.x -= player.speed;
  if (keys["KeyD"]) player.x += player.speed;
  if (keys["KeyW"]) player.y -= player.speed;
  if (keys["KeyS"]) player.y += player.speed;

  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.h, player.y));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.w, player.h);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
