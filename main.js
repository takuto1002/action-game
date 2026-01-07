const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ================== フィールド ==================
const field = { w: 600, h: 400 };
field.x = (canvas.width - field.w) / 2;
field.y = (canvas.height - field.h) / 2;

// ================== プレイヤー ==================
let player = { w: 20, h: 20, speed: 5 };

// ================== 敵 ==================
let enemies = [];

// ================== 弾 ==================
let bullets = [];

// ================== スコア ==================
let score = 0;

// ================== ゲームオーバーフラグ ==================
let gameOver = false;

// ================== タイトル画面管理 ==================
let currentScreen = "title"; // "title" or "game"
let titleBlink = true;
let titleTimer = 0;

// ================== 自動スポーン ==================
const spawnInterval = 5000; // 5秒に1体
let lastSpawn1 = -spawnInterval + 1000;
let lastSpawn2 = -spawnInterval + 2500;
let lastSpawn3 = -spawnInterval + 10000;
let lastSpawn4 = -spawnInterval + 12500;
let lastSpawn5 = -spawnInterval + 20000;
let lastSpawn6 = -spawnInterval + 22500;
let lastSpawn7 = -spawnInterval + 30000;
let lastSpawn8 = -spawnInterval + 32500;
let lastSpawn9 = -spawnInterval + 1000;  // 確認用 1秒
let lastSpawn10 = -spawnInterval + 1000; // 確認用 1秒
let lastSpawn11 = -spawnInterval + 1000; // 確認用 1秒
let lastSpawn12 = -spawnInterval + 1000; // 確認用 1秒

// ================== 初期化関数 ==================
function initGame(){
    player.x = field.x + field.w / 2 - player.w / 2;
    player.y = field.y + field.h / 2 - player.h / 2;
    enemies = [];
    bullets = [];
    score = 0;
    gameOver = false;

    const now = performance.now();

    lastSpawn1 = now - spawnInterval + 1000;
    lastSpawn2 = now - spawnInterval + 2500;
    lastSpawn3 = now - spawnInterval + 10000;
    lastSpawn4 = now - spawnInterval + 12500;
    lastSpawn5 = now - spawnInterval + 20000;
    lastSpawn6 = now - spawnInterval + 22500;
    lastSpawn7 = now - spawnInterval + 30000;
    lastSpawn8 = now - spawnInterval + 32500;
    lastSpawn9 = now - spawnInterval + 1000;  // 確認用 1秒
    lastSpawn10 = now - spawnInterval + 1000; // 確認用 1秒
    lastSpawn11 = now - spawnInterval + 1000; // 確認用 1秒
    lastSpawn12 = now - spawnInterval + 1000; // 確認用 1秒
}
// ================== 入力管理 ==================
const keys = {};
document.addEventListener("keydown", e => {
    keys[e.code] = true;

    if(currentScreen === "title" && e.code === "Space"){
        currentScreen = "game";
        initGame();
    }
    if(gameOver && e.code === "Space") initGame();
});
document.addEventListener("keyup", e => keys[e.code] = false);

// ================== 衝突判定関数 ==================
function isColliding(a,b){
    return !(a.x + a.w < b.x || a.x > b.x + b.w || a.y + a.h < b.y || a.y > b.y + b.h);
}

// ================== 更新処理 ==================
function update(delta){
    if(currentScreen !== "game") return;
    if(gameOver) return;

    // プレイヤー移動
    if(keys["KeyA"]) player.x -= player.speed;
    if(keys["KeyD"]) player.x += player.speed;
    if(keys["KeyW"]) player.y -= player.speed;
    if(keys["KeyS"]) player.y += player.speed;

    // フィールド内制限
    player.x = Math.max(field.x, Math.min(field.x + field.w - player.w, player.x));
    player.y = Math.max(field.y, Math.min(field.y + field.h - player.h, player.y));

    const now = performance.now();

    // スコア増加
    score += delta * 0.1;

    // ================== 敵スポーン ==================
    if(now - lastSpawn1 > spawnInterval){
        enemies.push({ id:"エネミー1", x: field.x + field.w + 20, y: field.y + Math.random()*(field.h-20), w:20,h:20, spawnTime:now,lastShot:0,shotsFired:0,speed:2 });
        lastSpawn1 = now;
    }
    if(now - lastSpawn2 > spawnInterval){
        enemies.push({ id:"エネミー2", x: field.x - 40, y: field.y + Math.random()*(field.h-20), w:20,h:20, spawnTime:now,lastShot:0,shotsFired:0,speed:2 });
        lastSpawn2 = now;
    }
    if(now - lastSpawn3 > spawnInterval){
        enemies.push({ id:"エネミー3", x: field.x + Math.random()*(field.w-20), y: field.y - 40, w:20,h:20, spawnTime:now,lastShot:0,shotsFired:0,speed:2 });
        lastSpawn3 = now;
    }
    if(now - lastSpawn4 > spawnInterval){
        enemies.push({ id:"エネミー4", x: field.x + Math.random()*(field.w-20), y: field.y + field.h + 20, w:20,h:20, spawnTime:now,lastShot:0,shotsFired:0,speed:2 });
        lastSpawn4 = now;
    }
    if(now - lastSpawn5 > spawnInterval){
        enemies.push({ id:"エネミー5", x: field.x + field.w + 20, y: field.y + Math.random()*(field.h-20), w:20,h:20, spawnTime:now,lastShot:0,shotsFired:0,speed:3 });
        lastSpawn5 = now;
    }
    if(now - lastSpawn6 > spawnInterval){
        enemies.push({ id:"エネミー6", x: field.x - 40, y: field.y + Math.random()*(field.h-20), w:20,h:20, spawnTime:now,lastShot:0,shotsFired:0,speed:3 });
        lastSpawn6 = now;
    }
    if(now - lastSpawn7 > spawnInterval){
        enemies.push({ id:"エネミー7", x: field.x + Math.random()*(field.w-20), y: field.y - 40, w:20,h:20, spawnTime:now,lastShot:0,shotsFired:0,speed:3 });
        lastSpawn7 = now;
    }
    if(now - lastSpawn8 > spawnInterval){
        enemies.push({ id:"エネミー8", x: field.x + Math.random()*(field.w-20), y: field.y + field.h + 20, w:20,h:20, spawnTime:now,lastShot:0,shotsFired:0,speed:3 });
        lastSpawn8 = now;
    }
if(now - lastSpawn9 > spawnInterval){
    enemies.push({
        id:"エネミー9",
        x: field.x + 20,                 // 左上から斜めに
        y: field.y + 20,
        w:20, h:20,
        spawnTime: now,
        lastShot: 0,
        shotsFired: 0,
        speed: 2
    });
    lastSpawn9 = now;
}

if(now - lastSpawn10 > spawnInterval){
    enemies.push({
        id:"エネミー10",
        x: field.x + field.w - 40,       // 右上
        y: field.y + 20,
        w:20, h:20,
        spawnTime: now,
        lastShot: 0,
        shotsFired: 0,
        speed: 2
    });
    lastSpawn10 = now;
}

if(now - lastSpawn11 > spawnInterval){
    enemies.push({
        id:"エネミー11",
        x: field.x + 20,                 // 左下
        y: field.y + field.h - 40,
        w:20, h:20,
        spawnTime: now,
        lastShot: 0,
        shotsFired: 0,
        speed: 2
    });
    lastSpawn11 = now;
}

if(now - lastSpawn12 > spawnInterval){
    enemies.push({
        id:"エネミー12",
        x: field.x + field.w - 40,       // 右下
        y: field.y + field.h - 40,
        w:20, h:20,
        spawnTime: now,
        lastShot: 0,
        shotsFired: 0,
        speed: 2
    });
    lastSpawn12 = now;
}

// ================== 敵弾発射 ==================
for(let i = enemies.length-1; i >= 0; i--){
    const e = enemies[i];

    if(now - e.spawnTime > 1000 && e.shotsFired < 5){
        if(now - e.lastShot > 1000){
            let bx, by, dx = 0, dy = 0;

            // 左右上下
            if(e.id==="エネミー1" || e.id==="エネミー5"){ // 左
                bx = e.x - 10;
                by = e.y + e.h/2 - 5;
                dx = -Math.abs(e.speed);
            } else if(e.id==="エネミー2" || e.id==="エネミー6"){ // 右
                bx = e.x + e.w;
                by = e.y + e.h/2 - 5;
                dx = Math.abs(e.speed);
            } else if(e.id==="エネミー3" || e.id==="エネミー7"){ // 下
                bx = e.x + e.w/2 - 5;
                by = e.y + e.h;
                dy = Math.abs(e.speed);
            } else if(e.id==="エネミー4" || e.id==="エネミー8"){ // 上
                bx = e.x + e.w/2 - 5;
                by = e.y - 10;
                dy = -Math.abs(e.speed);
            }

            // 斜め弾（エネミー9～12）
            else if(e.id==="エネミー9"){ // 左上に斜め
                bx = e.x + e.w/2 - 5;
                by = e.y + e.h/2 - 5;
                dx = -Math.abs(e.speed);
                dy = -Math.abs(e.speed);
            } else if(e.id==="エネミー10"){ // 右上
                bx = e.x + e.w/2 - 5;
                by = e.y + e.h/2 - 5;
                dx = Math.abs(e.speed);
                dy = -Math.abs(e.speed);
            } else if(e.id==="エネミー11"){ // 左下
                bx = e.x + e.w/2 - 5;
                by = e.y + e.h/2 - 5;
                dx = -Math.abs(e.speed);
                dy = Math.abs(e.speed);
            } else if(e.id==="エネミー12"){ // 右下
                bx = e.x + e.w/2 - 5;
                by = e.y + e.h/2 - 5;
                dx = Math.abs(e.speed);
                dy = Math.abs(e.speed);
            }

            bullets.push({ x:bx, y:by, w:10, h:10, dx:dx, dy:dy });
            e.lastShot = now;
            e.shotsFired++;
        }
    }

    if(e.shotsFired >= 5) enemies.splice(i,1);
}

// ================== 弾移動 ==================
for(let i = bullets.length-1; i>=0; i--){
    const b = bullets[i];
    b.x += b.dx;
    b.y += b.dy;

    if(isColliding(b, player)) gameOver = true;

    if(b.x + b.w < 0 || b.x > canvas.width || b.y + b.h < 0 || b.y > canvas.height) bullets.splice(i,1);
}

// ================== 描画処理 ==================
function draw(){
    ctx.fillStyle = "#222";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    if(currentScreen === "title"){
        const t = performance.now();
        titleBlink = Math.floor(t/500) %2 ===0;
        ctx.fillStyle = "white";
        ctx.font = "60px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.fillText("Dodge Arena", canvas.width/2, canvas.height/2-50);
        if(titleBlink){
            ctx.font = "25px 'Press Start 2P'";
            ctx.fillText("PRESS SPACE TO START", canvas.width/2, canvas.height/2+20);
        }
        return;
    }

    // フィールド枠
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(field.x, field.y, field.w, field.h);

    if(!gameOver){
        // プレイヤー
        ctx.fillStyle = "cyan";
        ctx.fillRect(player.x, player.y, player.w, player.h);

      // 敵描画
enemies.forEach(e => {
    // 本体の色
    if(e.id.startsWith("エネミー9") || e.id.startsWith("エネミー10") ||
       e.id.startsWith("エネミー11") || e.id.startsWith("エネミー12")){
        ctx.fillStyle = "yellow"; // エネミー9～12は黄色
    } else if(e.id.startsWith("エネミー5") || e.id.startsWith("エネミー6") ||
              e.id.startsWith("エネミー7") || e.id.startsWith("エネミー8")){
        ctx.fillStyle = "orange"; // エネミー5～8はオレンジ
    } else {
        ctx.fillStyle = "red"; // エネミー1～4は赤
    }
    ctx.fillRect(e.x, e.y, e.w, e.h);

    // 大砲口の描画
    const cannonWidth = 5;
    const cannonHeight = e.h / 2;

    if(e.id === "エネミー1" || e.id === "エネミー5"){
        ctx.fillStyle = ctx.fillStyle; // 本体色と同じ
        ctx.fillRect(e.x - cannonWidth, e.y + e.h/4, cannonWidth, cannonHeight);
    } else if(e.id === "エネミー2" || e.id === "エネミー6"){
        ctx.fillStyle = ctx.fillStyle;
        ctx.fillRect(e.x + e.w, e.y + e.h/4, cannonWidth, cannonHeight);
    } else if(e.id === "エネミー3" || e.id === "エネミー7"){
        ctx.fillStyle = ctx.fillStyle;
        ctx.fillRect(e.x + e.w/4, e.y + e.h, cannonHeight, cannonWidth);
    } else if(e.id === "エネミー4" || e.id === "エネミー8"){
        ctx.fillStyle = ctx.fillStyle;
        ctx.fillRect(e.x + e.w/4, e.y - cannonWidth, cannonHeight, cannonWidth);
    } else if(e.id.startsWith("エネミー9") || e.id.startsWith("エネミー10") ||
              e.id.startsWith("エネミー11") || e.id.startsWith("エネミー12")){
        ctx.fillStyle = "yellow"; // 黄色
        ctx.fillRect(e.x + e.w/4, e.y + e.h/4, cannonWidth, cannonHeight); // 斜めでも同じサイズ
    }
});

        // 弾
        bullets.forEach(b=>{
            ctx.fillStyle = "white";
            ctx.fillRect(b.x, b.y, b.w, b.h);
        });

        // スコア表示
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        ctx.fillText("SCORE: "+Math.floor(score), 10,30);

    } else {
        ctx.fillStyle = "white";
        ctx.font = "50px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);

        ctx.font = "20px 'Press Start 2P'";
        ctx.fillText("SPACEでリスタート", canvas.width/2, canvas.height/2+40);
        ctx.fillText("SCORE: "+Math.floor(score), canvas.width/2, canvas.height/2+80);
    }
}

// ================== メインループ ==================
let lastTime = performance.now();
function loop(){
    const now = performance.now();
    const delta = now - lastTime;
    lastTime = now;

    update(delta);
    draw();
    requestAnimationFrame(loop);
}
loop();
