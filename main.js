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
let highScore = localStorage.getItem("dodgeArenaHighScore")
    ? Number(localStorage.getItem("dodgeArenaHighScore"))
    : 0;

// ================== ゲームオーバーフラグ ==================
let gameOver = false;

// ================== タイトル画面管理 ==================
let currentScreen = "title";
let titleBlink = true;

// ================== 自動スポーン ==================
const spawnInterval = 5000;

// 14体分に拡張
let lastSpawn = new Array(14).fill(-spawnInterval);

// ================== 初期化 ==================
function initGame(){
    player.x = field.x + field.w / 2 - player.w / 2;
    player.y = field.y + field.h / 2 - player.h / 2;
    enemies = [];
    bullets = [];
    score = 0;
    gameOver = false;

    const now = performance.now();
    for(let i=0;i<lastSpawn.length;i++){
        lastSpawn[i] = now - spawnInterval + i * 800;
    }
}

// ================== 入力 ==================
const keys = {};
document.addEventListener("keydown", e => {
    keys[e.code] = true;
    if(currentScreen === "title" && e.code === "Space"){
        currentScreen = "game";
        initGame();
    }
    if(gameOver && e.code === "Space"){
        initGame();
    }
});
document.addEventListener("keyup", e => keys[e.code] = false);

// ================== 衝突 ==================
function isColliding(a,b){
    return !(a.x + a.w < b.x || a.x > b.x + b.w || a.y + a.h < b.y || a.y > b.y + b.h);
}

// ================== 更新 ==================
function update(delta){
    if(currentScreen !== "game" || gameOver) return;

    // プレイヤー移動
    if(keys["KeyA"]) player.x -= player.speed;
    if(keys["KeyD"]) player.x += player.speed;
    if(keys["KeyW"]) player.y -= player.speed;
    if(keys["KeyS"]) player.y += player.speed;

    player.x = Math.max(field.x, Math.min(field.x + field.w - player.w, player.x));
    player.y = Math.max(field.y, Math.min(field.y + field.h - player.h, player.y));

    const now = performance.now();
    score += delta * 0.1;

    // ================== 敵スポーン ==================
    const spawnList = [
        { id:"エネミー1", x: field.x + field.w + 20, y:()=>field.y + Math.random()*(field.h-20), speed:2 },
        { id:"エネミー2", x: field.x - 40, y:()=>field.y + Math.random()*(field.h-20), speed:2 },
        { id:"エネミー3", x: ()=>field.x + Math.random()*(field.w-20), y: field.y - 40, speed:2 },
        { id:"エネミー4", x: ()=>field.x + Math.random()*(field.w-20), y: field.y + field.h + 20, speed:2 },

        { id:"エネミー5", x: field.x + field.w + 20, y:()=>field.y + Math.random()*(field.h-20), speed:3 },
        { id:"エネミー6", x: field.x - 40, y:()=>field.y + Math.random()*(field.h-20), speed:3 },
        { id:"エネミー7", x: ()=>field.x + Math.random()*(field.w-20), y: field.y - 40, speed:3 },
        { id:"エネミー8", x: ()=>field.x + Math.random()*(field.w-20), y: field.y + field.h + 20, speed:3 },

        { id:"エネミー9", x: field.x + field.w + 20, y:()=>field.y + Math.random()*(field.h-20), speed:2 },
        { id:"エネミー10", x: field.x - 40, y:()=>field.y + Math.random()*(field.h-20), speed:2 },
        { id:"エネミー11", x: ()=>field.x + Math.random()*(field.w-20), y: field.y + field.h + 20, speed:2 },
        { id:"エネミー12", x: ()=>field.x + Math.random()*(field.w-20), y: field.y - 40, speed:2 },

        // ★ 追加分
        { id:"エネミー13", x: field.x + field.w + 20, y:()=>field.y + Math.random()*(field.h-20), speed:2.5 },
        { id:"エネミー14", x: field.x - 40, y:()=>field.y + Math.random()*(field.h-20), speed:2.5 }
    ];

    spawnList.forEach((e,i)=>{
        if(now - lastSpawn[i] > spawnInterval){
            enemies.push({
                id:e.id,
                x: typeof e.x === "function" ? e.x() : e.x,
                y: typeof e.y === "function" ? e.y() : e.y,
                w:20,h:20,
                spawnTime:now,
                lastShot:0,
                shotsFired:0,
                speed:e.speed
            });
            lastSpawn[i] = now;
        }
    });

    // ================== 敵弾発射 ==================
    for(let i=enemies.length-1;i>=0;i--){
        const e = enemies[i];

        if(now - e.spawnTime > 1000 && e.shotsFired < 5){
            if(now - e.lastShot > 1000){

                // ★ 16方向弾（13・14）
                if(e.id==="エネミー13" || e.id==="エネミー14"){
                    const cx = e.x + e.w/2 -5;
                    const cy = e.y + e.h/2 -5;

                    for(let a=0;a<16;a++){
                        const ang = Math.PI*2/16*a;
                        bullets.push({
                            x:cx,y:cy,w:10,h:10,
                            dx:Math.cos(ang)*e.speed,
                            dy:Math.sin(ang)*e.speed,
                            zigzag:false,
                            time:0
                        });
                    }
                    e.lastShot = now;
                    e.shotsFired++;
                    continue;
                }

                // 通常弾
                let bx,by,dx=0,dy=0;

                if(["エネミー1","エネミー5","エネミー9"].includes(e.id)){
                    bx=e.x-10; by=e.y+e.h/2-5; dx=-e.speed;
                }else if(["エネミー2","エネミー6","エネミー10"].includes(e.id)){
                    bx=e.x+e.w; by=e.y+e.h/2-5; dx=e.speed;
                }else if(["エネミー3","エネミー7","エネミー12"].includes(e.id)){
                    bx=e.x+e.w/2-5; by=e.y+e.h; dy=e.speed;
                }else{
                    bx=e.x+e.w/2-5; by=e.y-10; dy=-e.speed;
                }

                const zigzag = e.id.startsWith("エネミー9") ||
                               e.id.startsWith("エネミー10") ||
                               e.id.startsWith("エネミー11") ||
                               e.id.startsWith("エネミー12");

                bullets.push({x:bx,y:by,w:10,h:10,dx,dy,zigzag,time:0});
                e.lastShot = now;
                e.shotsFired++;
            }
        }

        if(e.shotsFired >= 5) enemies.splice(i,1);
    }

    // ================== 弾移動 ==================
    for(let i=bullets.length-1;i>=0;i--){
        const b = bullets[i];
        if(b.zigzag){
            b.time++;
            b.x += b.dx + Math.sin(b.time*0.2)*2;
            b.y += b.dy + Math.cos(b.time*0.2)*2;
        }else{
            b.x += b.dx;
            b.y += b.dy;
        }

        if(isColliding(b,player)){
    gameOver = true;

    const finalScore = Math.floor(score);
    if(finalScore > highScore){
        highScore = finalScore;
        localStorage.setItem("dodgeArenaHighScore", highScore);
    }
}

        if(b.x+b.w<0||b.x>canvas.width||b.y+b.h<0||b.y>canvas.height){
            bullets.splice(i,1);
        }
    }
}

// ================== 描画 ==================
function draw(){
    ctx.fillStyle="#222";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    if(currentScreen==="title"){
        titleBlink = Math.floor(performance.now()/500)%2===0;
        ctx.fillStyle="white";
        ctx.font="60px 'Press Start 2P'";
        ctx.textAlign="center";
        ctx.fillText("Dodge Arena",canvas.width/2,canvas.height/2-50);
        if(titleBlink){
            ctx.font="25px 'Press Start 2P'";
            ctx.fillText("PRESS SPACE TO START",canvas.width/2,canvas.height/2+20);
        }
        return;
    }

    ctx.strokeStyle="white";
    ctx.strokeRect(field.x,field.y,field.w,field.h);

    if(!gameOver){
        ctx.fillStyle="cyan";
        ctx.fillRect(player.x,player.y,player.w,player.h);

enemies.forEach(e=>{
    if(
        e.id==="エネミー1" || e.id==="エネミー2" ||
        e.id==="エネミー3" || e.id==="エネミー4"
    ){
        ctx.fillStyle = "red";        // 1～4
    }
    else if(
        e.id==="エネミー5" || e.id==="エネミー6" ||
        e.id==="エネミー7" || e.id==="エネミー8"
    ){
        ctx.fillStyle = "orange";     // 5～8
    }
    else if(
        e.id==="エネミー9" || e.id==="エネミー10" ||
        e.id==="エネミー11" || e.id==="エネミー12"
    ){
        ctx.fillStyle = "yellow";     // 9～12
    }
    else if(
        e.id==="エネミー13" || e.id==="エネミー14"
    ){
        ctx.fillStyle = "lime";       // 13・14
    }

    ctx.fillRect(e.x, e.y, e.w, e.h);
});


        bullets.forEach(b=>{
            ctx.fillStyle="white";
            ctx.fillRect(b.x,b.y,b.w,b.h);
        });

   ctx.fillStyle="white";
ctx.font="20px Arial";
ctx.textAlign="left";
ctx.fillText("SCORE: " + Math.floor(score), 10, 30);
ctx.fillText("HI-SCORE: " + highScore, 10, 55);
}else{
ctx.fillStyle="white";
ctx.font="50px 'Press Start 2P'";
ctx.textAlign="center";
ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
ctx.font="20px 'Press Start 2P'";
ctx.fillText("SPACEでリスタート", canvas.width/2, canvas.height/2 + 40);
ctx.fillText("SCORE: " + Math.floor(score), canvas.width/2, canvas.height/2 + 80);
ctx.fillText("HI-SCORE: " + highScore, canvas.width/2, canvas.height/2 + 120);
}

}

// ================== ループ ==================
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
