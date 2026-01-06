const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const player = {
  x: 280,
  y: 330,
  w: 40,
  h: 40,
  speed: 5
};

const keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function update() {
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;

  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
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
