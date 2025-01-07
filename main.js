const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 800;
    canvas.height = 600;
    
    const player = {
      x: canvas.width / 2 - 25,
      y: canvas.height - 50,
      width: 50,
      height: 20,
      color: '#0f0',
      speed: 5,
      dx: 0
    };
    
    const bullets = [];
    const enemies = [];
    const enemyRows = 3;
    const enemyCols = 8;
    const enemySpacing = 60;
    
    function createEnemies() {
      for (let row = 0; row < enemyRows; row++) {
        for (let col = 0; col < enemyCols; col++) {
          enemies.push({
            x: col * enemySpacing + 100,
            y: row * enemySpacing + 50,
            width: 40,
            height: 20,
            color: '#f00',
            alive: true
          });
        }
      }
    }
    
    function drawPlayer() {
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);
    }
    
    function drawBullets() {
      bullets.forEach((bullet, index) => {
        ctx.fillStyle = '#fff';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        
        bullet.y -= bullet.speed;
        
        if (bullet.y + bullet.height < 0) {
          bullets.splice(index, 1);
        }
      });
    }
    
    function drawEnemies() {
      enemies.forEach(enemy => {
        if (enemy.alive) {
          ctx.fillStyle = enemy.color;
          ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
      });
    }
    
    function updatePlayer() {
      player.x += player.dx;
      
      if (player.x < 0) {
        player.x = 0;
      }
      
      if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
      }
    }
    
    function detectCollisions() {
      bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
          if (enemy.alive &&
              bullet.x < enemy.x + enemy.width &&
              bullet.x + bullet.width > enemy.x &&
              bullet.y < enemy.y + enemy.height &&
              bullet.y + bullet.height > enemy.y) {
            enemy.alive = false;
            bullets.splice(bulletIndex, 1);
          }
        });
      });
    }
    
    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawPlayer();
      drawBullets();
      drawEnemies();
      updatePlayer();
      detectCollisions();
      
      requestAnimationFrame(gameLoop);
    }
    
    function shoot() {
      bullets.push({
        x: player.x + player.width / 2 - 2.5,
        y: player.y,
        width: 5,
        height: 10,
        speed: 5
      });
    }
    
    function keyDown(e) {
      if (e.key === 'ArrowLeft') {
        player.dx = -player.speed;
      } else if (e.key === 'ArrowRight') {
        player.dx = player.speed;
      } else if (e.key === ' ') {
        shoot();
      }
    }
    
    function keyUp(e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        player.dx = 0;
      }
    }
    
    createEnemies();
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    gameLoop();
