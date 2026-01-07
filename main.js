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
const spawnInterval = 5000; // 5秒ごとに1体
let lastSpawn1 = -spawnInterval + 1000; // エネミー1
let lastSpawn2 = -spawnInterval + 2500; // エネミー2
let lastSpawn3 = -spawnInterval + 15000; // エネミー3
let lastSpawn4 = -spawnInterval + 17500; // エネミー4
let lastSpawn5 = -spawnInterval + 1000;  // エネミー5
let lastSpawn6 = -spawnInterval + 1000;  // エネミー6
let lastSpawn7 = -spawnInterval + 1000;  // エネミー7
let lastSpawn8 = -spawnInterval + 1000;  // エネミー8


// ================== 初期化関数 ==================
function initGame(){
    const now = performance.now();
    player.x = field.x + field.w / 2 - player.w / 2;
    player.y = field.y + field.h / 2 - player.h / 2;
    enemies = [];
    bullets = [];
    score = 0;
    gameOver = false;

    lastSpawn1 = now - spawnInterval + 1000;
    lastSpawn2 = now - spawnInterval + 2500;
    lastSpawn3 = now + 15000 - spawnInterval;
    lastSpawn4 = now + 17500 - spawnInterval;
    lastSpawn5 = now - spawnInterval + 1000;
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

// ================== 衝突判定 ==================
function isColliding(a,b){
    return !(a.x + a.w < b.x || a.x > b.x + b.w || a.y + a.h < b.y || a.y > b.y + b.h);
}

// ================== 更新処理 ==================
function update(delta){
    if(currentScreen !== "game" || gameOver) return;

    // プレイヤー移動
    if(keys["KeyA"]) player.x -= player.speed;
    if(keys["KeyD"]) player.x += player.speed;
    if(keys["KeyW"]) player.y -= player.speed;
    if(keys["KeyS"]) player.y += player.speed;

    // フィールド内制限
    player.x = Math.max(field.x, Math.min(field.x + field.w - player.w, player.x));
    player.y = Math.max(field.y, Math.min(field.y + field.h - player.h, player.y));

    const now = performance.now();
    score += delta * 0.1;

    // ================== 自動スポーン ==================
    if(now - lastSpawn1 > spawnInterval){
        enemies.push({
            id:"エネミー１",
            x: field.x + field.w + 20,
            y: field.y + Math.random()*(field.h - 20),
            w:20, h:20,
            spawnTime: now, lastShot:0, shotsFired:0, speed:-2.5
        });
        lastSpawn1 = now;
    }
    if(now - lastSpawn2 > spawnInterval){
        enemies.push({
            id:"エネミー２",
            x: field.x - 20 - cannonWidth - 5,
            y: field.y + 5 + Math.random()*(field.h - 20 - 10),
            w:20, h:20,
            spawnTime: now, lastShot:0, shotsFired:0, speed:2.5
        });
        lastSpawn2 = now;
    }
    if(now - lastSpawn3 > spawnInterval){
        enemies.push({
            id:"エネミー３",
            x: field.x + 5 + Math.random()*(field.w - 20 - 10),
            y: field.y - 20 - 5,
            w:20, h:20,
            spawnTime: now, lastShot:0, shotsFired:0, speed:2.5
        });
        lastSpawn3 = now;
    }
    if(now - lastSpawn4 > spawnInterval){
        enemies.push({
            id:"エネミー４",
            x: field.x + 5 + Math.random()*(field.w - 20 - 10),
            y: field.y + field.h + 20 + 5,
            w:20, h:20,
            spawnTime: now, lastShot:0, shotsFired:0, speed:-2.5
        });
        lastSpawn4 = now;
    }
    if(now - lastSpawn5 > spawnInterval){
        enemies.push({
            id:"エネミー５",
            x: field.x + field.w + 20,
            y: field.y + Math.random()*(field.h - 20),
            w:20, h:20,
            spawnTime: now, lastShot:0, shotsFired:0, speed:-3.5
        });
        lastSpawn5 = now;
    }
   if(now - lastSpawn6 > spawnInterval){
    enemies.push({
        id:"エネミー6",
        x: field.x - 20 - cannonWidth - 5,
        y: field.y + 5 + Math.random()*(field.h - 20 - 10),
        w:20, h:20,
        spawnTime: now, lastShot:0, shotsFired:0, speed:2.5
    });
    lastSpawn6 = now;
}

if(now - lastSpawn7 > spawnInterval){
    enemies.push({
        id:"エネミー7",
        x: field.x + 5 + Math.random()*(field.w - 20 - 10),
        y: field.y - 20 - 5,
        w:20, h:20,
        spawnTime: now, lastShot:0, shotsFired:0, speed:2.5
    });
    lastSpawn7 = now;
}

if(now - lastSpawn8 > spawnInterval){
    enemies.push({
        id:"エネミー8",
        x: field.x + 5 + Math.random()*(field.w - 20 - 10),
        y: field.y + field.h + 20 + 5,
        w:20, h:20,
        spawnTime: now, lastShot:0, shotsFired:0, speed:-2.5
    });
    lastSpawn8 = now;
}

    // ================== 敵弾発射 ==================
for(let i = enemies.length-1; i>=0; i--){
    const e = enemies[i];
    if(now - e.spawnTime > 1000 && e.shotsFired < 5){
        if(now - e.lastShot > 1000){
            let bx, by, speed;
            if(e.id==="エネミー１" || e.id==="エネミー５"){ // 左
                bx = e.x - 10;
                by = e.y + e.h/2 - 5;
                speed = -Math.abs(e.speed);
            } else if(e.id==="エネミー２" || e.id==="エネミー６"){ // 右
                bx = e.x + e.w;
                by = e.y + e.h/2 - 5;
                speed = Math.abs(e.speed);
            } else if(e.id==="エネミー３" || e.id==="エネミー７"){ // 下
                bx = e.x + e.w/2 - 5;
                by = e.y + e.h;
                speed = Math.abs(e.speed);
            } else if(e.id==="エネミー４" || e.id==="エネミー８"){ // 上
                bx = e.x + e.w/2 - 5;
                by = e.y - 10;
                speed = -Math.abs(e.speed);
            }

            bullets.push({ x:bx, y:by, w:10, h:10, speed:speed, dir:e.id });
            e.lastShot = now;
            e.shotsFired++;
        }
    }
    if(e.shotsFired >= 5) enemies.splice(i,1);
}

// 弾移動
for(let i=bullets.length-1; i>=0; i--){
    const b = bullets[i];
    if(b.dir==="エネミー３" || b.dir==="エネミー４" || b.dir==="エネミー７" || b.dir==="エネミー８"){ // 上下
        b.y += b.speed;
    } else { // 左右
        b.x += b.speed;
    }
    if(isColliding(b, player)) gameOver = true;
    if(b.x + b.w < 0 || b.x > canvas.width || b.y + b.h < 0 || b.y > canvas.height) bullets.splice(i,1);
}
// ================== 描画処理 ==================
function draw(){
    ctx.fillStyle = "#222";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    if(currentScreen==="title"){
        const t = performance.now();
        titleBlink = Math.floor(t/500)%2===0;
        ctx.fillStyle = "white";
        ctx.font = "60px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.fillText("Dodge Arena", canvas.width/2, canvas.height/2 - 50);
        if(titleBlink){
            ctx.font = "25px 'Press Start 2P'";
            ctx.fillText("PRESS SPACE TO START", canvas.width/2, canvas.height/2 + 20);
        }
        return;
    }

    // フィールド枠
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(field.x, field.y, field.w, field.h);

    if(!gameOver){
        ctx.fillStyle = "cyan";
        ctx.fillRect(player.x, player.y, player.w, player.h);

// ================== 描画時の色設定 ==================
enemies.forEach(e=>{
    const cannonWidth = 5;
    const cannonHeight = e.h / 2;

    // 本体色
    if(e.id==="エネミー5" || e.id==="エネミー6" || e.id==="エネミー7" || e.id==="エネミー8"){
        ctx.fillStyle = "orange";
    } else {
        ctx.fillStyle = "red";
    }
    ctx.fillRect(e.x, e.y, e.w, e.h);

    // 大砲口色
    if(e.id==="エネミー5" || e.id==="エネミー6" || e.id==="エネミー7" || e.id==="エネミー8"){
        ctx.fillStyle = "orange";
    } else {
        ctx.fillStyle = "red";
    }

    if(e.id==="エネミー1" || e.id==="エネミー5" || e.id==="エネミー6"){
        ctx.fillRect(e.x - cannonWidth, e.y + e.h/4, cannonWidth, cannonHeight);
    } else if(e.id==="エネミー2"){
        ctx.fillRect(e.x + e.w, e.y + e.h/4, cannonWidth, cannonHeight);
    } else if(e.id==="エネミー3" || e.id==="エネミー7"){
        ctx.fillRect(e.x + e.w/4, e.y + e.h, cannonHeight, cannonWidth);
    } else if(e.id==="エネミー4" || e.id==="エネミー8"){
        ctx.fillRect(e.x + e.w/4, e.y - cannonWidth, cannonHeight, cannonWidth);
    }
});



        // 弾
        ctx.fillStyle = "white";
        bullets.forEach(b=>ctx.fillRect(b.x,b.y,b.w,b.h));

        // スコア
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "left";
        ctx.fillText("SCORE: " + Math.floor(score), 10,30);
    } else {
        ctx.fillStyle = "white";
        ctx.font = "50px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
        ctx.font = "20px 'Press Start 2P'";
        ctx.fillText("SPACEでリスタート", canvas.width/2, canvas.height/2 + 40);
        ctx.fillText("SCORE: " + Math.floor(score), canvas.width/2, canvas.height/2 + 80);
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
