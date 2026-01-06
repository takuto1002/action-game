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

    if(this.shootTimer >= 60){ // 1秒に1発
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

// 固定位置に敵を1体右外にスポーン
function spawnEnemy1() {
  const x = field.x + field.w + 20; // 右外
  const y = field.y + field.h / 2 - 10; // フィールド中央高さ
  enemies1.push(new Enemy1(x, y));
  console.log("エネミー1出現:", x, y);
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

  // 敵更新（逆ループ）
  for(let i = enemies1.length - 1; i >= 0; i--){
    const e = enemies1[i];
    e.update();
    if(e.isExpired()) enemies1.splice(i, 1);
  }

  // 弾更新（逆ループ）
  for(let i = bullets.length - 1; i >= 0; i--){
    const b = bullets[i];
    b.x += b.dx;
    b.y += b.dy;
    b.life++;

    if(b.life > 300){ bullets.splice(i, 1); continue; }

    if(b.x < player.x + player.w &&
       b.x + 4 > player.x &&
       b.y < player.y + player.h &&
       b.y + 4 > player.y){
      alert("ゲームオーバー！");
      location.reload();
    }
  }
}

// ================== 描画処理 ==================
function draw() {
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
let spawned = false; // 一度だけ出す
function loop() {
  update();
  draw();

  if(!spawned){
    spawnEnemy1();
    spawned = true;
  }

  requestAnimationFrame(loop);
}

loop();
