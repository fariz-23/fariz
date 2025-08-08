const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player, bullets, enemies, score, level, lives, isGameOver;
let stars = [];
let moveDirection = 0; // -1 for left, 1 for right
let enemyDirections = [];
let explosions = [];

function drawBackground() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  stars.forEach(star => {
    ctx.fillRect(star.x, star.y, 1, 1);
    star.y += 0.5;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  });
}

const rocketImg = new Image();
rocketImg.src = 'roket2.png';

function drawPlayer() {
  ctx.drawImage(rocketImg, player.x, player.y, player.width, player.height);
}


const enemyImages = [
    new Image(),
    new Image()
];

enemyImages[0].src = 'musuh1.jpg';
enemyImages[1].src = 'musuh2.jpg';
let imagesLoaded = 0;

enemyImages.forEach(img => {
    img.onload = () => {
        imagesLoaded++;
    };
});


function drawBullets() {
  ctx.fillStyle = "lime";
  bullets.forEach(b => ctx.fillRect(b.x, b.y, 6, 25));
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}


function draw() {
  drawBackground();
  drawPlayer();
  drawBullets();
  drawEnemies();
  drawExplosions();
}

function update() {
  if (isGameOver) return;

  // Smooth player movement
  player.x += moveDirection * 6;
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

  bullets.forEach(b => b.y -= 6);
  bullets = bullets.filter(b => b.y > 0);

  enemies.forEach((e, i) => {
    e.y += 5;
    e.x += enemyDirections[i];
    if (e.x <= 0 || e.x >= canvas.width - 20) {
      enemyDirections[i] *= -1; // change direction
    }
  });

  enemies = enemies.filter((e, i) => {
    // tabrakan dengan player
    if (
      e.x < player.x + player.width &&
      e.x + 20 > player.x &&
      e.y < player.y + player.height &&
      e.y + 20 > player.y
    ) {
      lives--;
      updateLives();
      if (lives <= 0) gameOver();
      return false;
    }

    // kena peluru
    for (let j = 0; j < bullets.length; j++) {
  const b = bullets[j];
  if (
    b.x < e.x + 20 &&
    b.x + 10 > e.x &&
    b.y < e.y + 20 &&
    b.y + 25 > e.y
  ) {
    bullets.splice(j, 1);
    score += 10;
    updateStatus();
    updateLevel();


    // 🔊 Mainkan suara
    document.getElementById("explodeSound").play();

    // 💥 Tambah ledakan
    explosions.push({
      x: e.x + 10,
      y: e.y + 10,
      radius: 5,
      alpha: 1
    });

    return false;
  }
}

if (e.y + 20 >= player.y + player.height) {
  lives--;
  updateLives();
  if (lives <= 0) gameOver();
  return false;
}

return e.y < canvas.height;

  });

  draw();
}

function updateStatus() {
  document.getElementById("game-status").textContent = `Level ${level} | Score: ${score}`;
}

function updateLives() {
  const heart = "❤️";
  document.getElementById("lives").textContent = heart.repeat(lives);
}

function updateLevel() {
  if (score >= 500 && level < 3) {
    level = 3;
  } else if (score >= 200 && level < 2) {
    level = 2;
  }
  updateStatus();
}

function spawnEnemy() {
  if (imagesLoaded < enemyImages.length) return;

  // Atur jumlah musuh maksimum berdasarkan level
  let maxEnemies = 2; // default untuk level 1
  if (level === 2) maxEnemies = 3;
  else if (level >= 3) maxEnemies = 5;

  // Jangan spawn kalau jumlah musuh udah maksimal
  if (enemies.length >= maxEnemies) return;

  const randomImage = enemyImages[Math.floor(Math.random() * enemyImages.length)];

  const enemy = {
    x: Math.random() * (canvas.width - 30),
    y: -30,
    width: 30,
    height: 30,
    speed: 1 + Math.random() * 1.5,
    image: randomImage
  };

  enemies.push(enemy);
  enemyDirections.push(Math.random() > 0.5 ? 1 : -1);
}




function fireBullet() {
  if (!isGameOver) {
    bullets.push({ x: player.x + player.width / 2 - 3, y: player.y });
    document.getElementById("shootSound").play();
  }
}

function moveLeft() {
  moveDirection = -1;
}

function moveRight() {
  moveDirection = 1;
}

function stopMove() {
  moveDirection = 0;
}


function gameOver() {
  isGameOver = true;
  document.getElementById("gameOverScreen").style.display = "flex";

  const highScore = Math.max(score, parseInt(localStorage.getItem("highScore") || "0"));
  localStorage.setItem("highScore", highScore);

  document.getElementById("scoreText").textContent = `Score: ${score}`;
  document.getElementById("highScoreText").textContent = `High Score: ${highScore}`;
}

function restartGame() {
  document.getElementById("gameOverScreen").style.display = "none";
  initGame();
}

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  initGame();
}

function initGame() {
  player = { x: 110, y: 280, width: 35, height: 60 };
  bullets = [];
  enemies = [];
  enemyDirections = [];
  score = 0;
  level = 1;
  lives = 3;
  isGameOver = false;
  stars = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height
  }));
  updateStatus();
  updateLives();
  draw();
}

function drawExplosions() {
  explosions.forEach((expl, index) => {
    ctx.fillStyle = `rgba(255, 165, 0, ${expl.alpha})`;
    ctx.beginPath();
    ctx.arc(expl.x, expl.y, expl.radius, 0, Math.PI * 2);
    ctx.fill();

    expl.radius += 1;
    expl.alpha -= 0.05;
    if (expl.alpha <= 0) explosions.splice(index, 1);
  });
}

// Optional: biar bisa pakai keyboard juga
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") moveLeft();
  if (e.key === "ArrowRight") moveRight();
});
document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") stopMove();
});


setInterval(update, 50);
setInterval(spawnEnemy, 300);
setInterval(fireBullet, 300);
