const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ================== フィールド ==================
const field = {
  w: 400,
  h: 300,
};
field.x = (canvas.width - field.w) / 2;
field.y = (canvas.height - field.h) / 2;

// ================== プレイヤー ==================
const player = {
  w: 20,
  h: 20,
  speed: 5,
  x: field.x + field.w / 2 - 10,
  y: field.y + field.h / 2 - 10
};

// ================== 弾 ==================
const bullets = [];

function shootBullet(enemy) {
  const centerX = field.x + field.w / 2;
  const centerY = field.y + field.h / 2;
  const dx = (centerX - (enemy.x + enemy.w / 2)) / 60;
  const dy = (centerY - (enemy.y + enemy.h / 2)) / 60;
  bullets.push({
    x: enemy.x + enemy.w / 2,
    y: enemy.y + enemy.h / 2,
    dx,
    dy,
    life: 0
  });
}

// ================== エネミー1クラス ==================
class Enemy1 {
  constructor(x, y) {
    this.w = 20;
    this.h = 20;
    this.x = x;
    this.y = y;
    this.timer = 0;
    this.shootTimer = 0;
  }

  update() {
    this.timer++;
    this.shootTimer++;

    // 1秒に1発
    if(this.shootTimer >= 60){
      shootBullet(this);
      this.shootTimer = 0;
    }
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  isExpired() {
    return this.timer >= 300; // 5秒で消滅
  }
}

// ================== 敵管理 ==================
const enemies1 = [];

// フィールド四辺からランダムに出現
function spawnEnemy1() {
  let x, y;
  const edge = Math.floor(Math.random() * 4); // 0:上,1:下,2:左,3:右
  switch(edge){
    case 0: // 上
      x = field.x + Math.random() * field.w - 10;
      y = field.y - 30;
      break;
    case 1: // 下
      x = field.x + Math.random() * field.w - 10;
      y = field.y + field.h + 10;
      break;
    case 2: // 左
      x = field.x - 30;
      y = field.y + Math.random() * field.h - 10;
      break;
    case 3: // 右
      x = field.x + field.w + 10;
      y = field.y + Math.random() * field.h - 10;
      break;
  }
  enemies1.push(new Enemy1(x, y));
}

// ================== 入力管理 ==================
const keys = {};
document.addEventListener("keydown", (e) => { keys[e.code] = true; });
document.addEventListener("keyup", (e) => { keys[e.code] = false; });

// ================== 更新処理 ==================
function update() {
  // プレイヤー移動
  if(keys["KeyA"]) player.x -= player.speed;
  if(keys["KeyD"]) player.x += player.speed;
  if(keys["KeyW"]) player.y -= player.speed;
  if(keys["KeyS"]) player.y += player.speed;

  // フィールド内制限
  player.x = Math.max(field.x, Math.min(field.x + field.w - player.w, player.x));
  player.y = Math.max(field.y, Math.min(field.y + field.h - player.h, player.y));

  // 敵更新
  enemies1.forEach((e, i) => {
    e.update();
    if(e.isExpired()) enemies1.splice(i, 1);
  });

  // 弾更新
  bullets.forEach((b, i) => {
    b.x += b.dx;
    b.y += b.dy;
    b.life++;

    // 5秒で消滅
    if(b.life > 300) bullets.splice(i,1);

    // 当たり判定
    if(
      b.x < player.x + player.w &&
      b.x + 4 > player.x &&
      b.y < player.y + player.h &&
      b.y + 4 > player.y
    ){
      alert("ゲームオーバー！");
      location.reload();
    }
  });
}

// ================== 描画処理 ==================
function draw() {
  // 背景
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // フィールド
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.strokeRect(field.x, field.y, field.w, field.h);

  // プレイヤー
  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // 敵
  enemies1.forEach(e => e.draw());

  // 弾
  ctx.fillStyle = "yellow";
  bullets.forEach(b => ctx.fillRect(b.x, b.y, 4, 4));
}

// ================== メインループ ==================
let spawnCounter = 0;

function loop() {
  update();
  draw();

  // 2秒ごとにエネミー1出現
  spawnCounter++;
  if(spawnCounter >= 120){
    spawnEnemy1();
    spawnCounter = 0;
  }

  requestAnimationFrame(loop);
}

loop();
