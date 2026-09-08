(() => {
  'use strict';

  const canvas = document.querySelector('#game');
  const context = canvas.getContext('2d');
  const scoreEl = document.querySelector('#score');
  const bestEl = document.querySelector('#best-score');
  const statusText = document.querySelector('#status-text');
  const status = document.querySelector('#status');
  const gameOverEl = document.querySelector('#game-over');
  const restartButton = document.querySelector('#restart');
  const retryButton = document.querySelector('#retry-overlay');
  const soundToggle = document.querySelector('#sound-toggle');
  const soundLabel = document.querySelector('#sound-label');
  const pauseButton = document.querySelector('#pause-toggle');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const HIGH_SCORE_KEY = 'little-sunshine-high-score';
  const SOUND_KEY = 'little-sunshine-sound-enabled';
  const GRID_SIZE = 20;
  const TICK_MS = 112;
  const SPRITE_CELL_WIDTH = 192;
  const SPRITE_CELL_HEIGHT = 208;
  const directions = {
    ArrowUp: { x: 0, y: -1 }, KeyW: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 }, KeyS: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 }, KeyA: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }, KeyD: { x: 1, y: 0 },
  };
  const sunshineSprite = new Image();
  sunshineSprite.src = 'assets/little-sunshine.webp';
  const sounds = {
    control: makeSound('assets/sounds/control.mp3', .16),
    eat: makeSound('assets/sounds/eat.mp3', .25),
    newBest: makeSound('assets/sounds/new-best.mp3', .27),
    gameOver: makeSound('assets/sounds/game-over.mp3', .2),
  };

  let snake, food, direction, nextDirection, score, highScore, playing, paused, gameEnded, lastTick, boardSize, cellSize;
  let sunshine = { x: 0, y: 0 };
  let sunshineSparks = [];
  let lastEatenAt = -Infinity;
  let lastFood = null;
  let soundEnabled;

  function readHighScore() {
    try { return Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0; } catch { return 0; }
  }

  function saveHighScore() {
    try { localStorage.setItem(HIGH_SCORE_KEY, String(highScore)); } catch { /* local storage unavailable */ }
  }

  function makeSound(source, volume) {
    const sound = new Audio(source);
    sound.preload = 'auto';
    sound.volume = volume;
    return sound;
  }

  function readSoundPreference() {
    try { return localStorage.getItem(SOUND_KEY) !== 'off'; } catch { return true; }
  }

  function saveSoundPreference() {
    try { localStorage.setItem(SOUND_KEY, soundEnabled ? 'on' : 'off'); } catch { /* local storage unavailable */ }
  }

  function updateSoundToggle() {
    soundToggle.setAttribute('aria-pressed', String(soundEnabled));
    soundLabel.textContent = soundEnabled ? 'Sound on' : 'Sound off';
  }

  function playSound(name) {
    if (!soundEnabled) return;
    const sound = sounds[name];
    if (!sound) return;
    sound.currentTime = 0;
    sound.play().catch(() => { /* browser waits for the next direct user gesture */ });
  }

  function randomFood() {
    const options = [];
    for (let y = 0; y < GRID_SIZE; y += 1) {
      for (let x = 0; x < GRID_SIZE; x += 1) {
        if (!snake.some((part) => part.x === x && part.y === y)) options.push({ x, y });
      }
    }
    return options[Math.floor(Math.random() * options.length)];
  }

  function startGame() {
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    direction = { x: 1, y: 0 };
    nextDirection = direction;
    food = randomFood();
    score = 0;
    playing = false;
    paused = false;
    gameEnded = false;
    lastTick = performance.now();
    sunshine = { x: 10.3, y: 9.25 };
    sunshineSparks = [];
    lastEatenAt = -Infinity;
    lastFood = null;
    gameOverEl.hidden = true;
    scoreEl.textContent = score;
    setStatus('Choose a direction', false);
    canvas.focus({ preventScroll: true });
  }

  function setStatus(text, isPaused) {
    statusText.textContent = text;
    pauseButton.textContent = paused ? 'Resume' : 'Pause';
    pauseButton.disabled = !playing;
    status.style.opacity = isPaused ? '.78' : '1';
  }

  function endGame() {
    playing = false;
    paused = false;
    gameEnded = true;
    if (score > highScore) { highScore = score; saveHighScore(); }
    bestEl.textContent = highScore;
    setStatus('A soft landing', false);
    gameOverEl.hidden = false;
    playSound('gameOver');
  }

  function tick() {
    direction = nextDirection;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    const hitWall = head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE;
    const hitSelf = snake.some((part) => part.x === head.x && part.y === head.y);
    if (hitWall || hitSelf) { endGame(); return; }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      lastFood = { ...food };
      lastEatenAt = performance.now();
      sunshineSparks = Array.from({ length: 7 }, (_, index) => ({
        angle: (Math.PI * 2 * index) / 7 + Math.random() * .25,
        drift: .22 + Math.random() * .2,
        size: .045 + Math.random() * .035,
      }));
      score += 1;
      scoreEl.textContent = score;
      const isNewBest = score > highScore;
      if (isNewBest) { highScore = score; bestEl.textContent = highScore; saveHighScore(); }
      playSound(isNewBest ? 'newBest' : 'eat');
      food = randomFood();
    } else {
      snake.pop();
    }
  }

  function roundedRect(x, y, width, height, radius) {
    context.beginPath();
    context.roundRect(x, y, width, height, radius);
  }

  function drawBoard() {
    context.clearRect(0, 0, boardSize, boardSize);
    const background = context.createLinearGradient(0, 0, boardSize, boardSize);
    background.addColorStop(0, '#1a414b'); background.addColorStop(1, '#102d37');
    context.fillStyle = background;
    context.fillRect(0, 0, boardSize, boardSize);
    context.strokeStyle = 'rgba(185, 211, 214, .055)';
    context.lineWidth = 1;
    for (let i = 1; i < GRID_SIZE; i += 1) {
      const position = Math.round(i * cellSize) + .5;
      context.beginPath(); context.moveTo(position, 0); context.lineTo(position, boardSize); context.stroke();
      context.beginPath(); context.moveTo(0, position); context.lineTo(boardSize, position); context.stroke();
    }
  }

  function drawFood(time) {
    const x = (food.x + .5) * cellSize; const y = (food.y + .5) * cellSize;
    const flicker = Math.sin(time / 560) * .12 + 1;
    const glow = context.createRadialGradient(x, y, 0, x, y, cellSize * 1.2 * flicker);
    glow.addColorStop(0, 'rgba(255, 225, 136, .55)'); glow.addColorStop(1, 'rgba(255, 202, 82, 0)');
    context.fillStyle = glow; context.fillRect(x - cellSize * 1.2, y - cellSize * 1.2, cellSize * 2.4, cellSize * 2.4);
    context.fillStyle = '#ffe29a'; context.shadowColor = '#f4c965'; context.shadowBlur = 12;
    context.beginPath(); context.arc(x, y, cellSize * .17, 0, Math.PI * 2); context.fill();
    context.shadowBlur = 0;
    context.strokeStyle = 'rgba(255, 226, 150, .75)'; context.lineWidth = 1.4;
    for (let i = 0; i < 4; i += 1) {
      const angle = i * Math.PI / 2 + time / 1600;
      context.beginPath(); context.moveTo(x + Math.cos(angle) * cellSize * .28, y + Math.sin(angle) * cellSize * .28); context.lineTo(x + Math.cos(angle) * cellSize * .38, y + Math.sin(angle) * cellSize * .38); context.stroke();
    }
  }

  function drawSnake(time) {
    const afterglow = Math.max(0, 1 - (time - lastEatenAt) / 780);
    snake.slice().reverse().forEach((part, reverseIndex) => {
      const index = snake.length - 1 - reverseIndex;
      const inset = cellSize * .1;
      const x = part.x * cellSize + inset; const y = part.y * cellSize + inset; const size = cellSize - inset * 2;
      const warmth = Math.min(score, 12) / 12;
      const wave = afterglow * Math.max(0, 1 - index / 5);
      const base = index === 0 ? [193, 224, 210] : [Math.round(128 + 38 * warmth), Math.round(190 + 16 * warmth), Math.round(174 - 32 * warmth)];
      context.fillStyle = `rgb(${Math.round(base[0] + wave * 39)}, ${Math.round(base[1] + wave * 13)}, ${Math.round(base[2] - wave * 56)})`;
      if ((warmth && index < Math.min(7, snake.length)) || wave) {
        context.shadowColor = `rgba(244, 201, 101, ${Math.max(warmth * .46, wave * .7)})`;
        context.shadowBlur = 10 * Math.max(warmth, wave * 1.25);
      }
      roundedRect(x, y, size, size, cellSize * .24); context.fill(); context.shadowBlur = 0;
    });
    const head = snake[0]; const hx = (head.x + .5) * cellSize; const hy = (head.y + .5) * cellSize;
    const eyeOffsetX = direction.x * cellSize * .13; const eyeOffsetY = direction.y * cellSize * .13;
    const sideX = direction.y * cellSize * .115; const sideY = -direction.x * cellSize * .115;
    context.fillStyle = '#173940';
    [1, -1].forEach((side) => { context.beginPath(); context.arc(hx + eyeOffsetX + sideX * side, hy + eyeOffsetY + sideY * side, Math.max(1.4, cellSize * .055), 0, Math.PI * 2); context.fill(); });
  }

  function drawSunshineSparks(time) {
    if (!lastFood) return;
    const age = time - lastEatenAt;
    if (age < 0 || age > 680) return;
    const progress = age / 680;
    const originX = (lastFood.x + .5) * cellSize;
    const originY = (lastFood.y + .5) * cellSize;
    sunshineSparks.forEach((spark) => {
      const distance = (progress * spark.drift + Math.sin(progress * Math.PI) * .09) * cellSize * 2.2;
      const x = originX + Math.cos(spark.angle) * distance;
      const y = originY + Math.sin(spark.angle) * distance;
      context.fillStyle = `rgba(255, 226, 144, ${Math.sin(progress * Math.PI) * .78})`;
      context.beginPath(); context.arc(x, y, cellSize * spark.size * (1 - progress * .25), 0, Math.PI * 2); context.fill();
    });
  }

  function companionFrame(time, pulse) {
    if (gameEnded) return { row: 5, frame: Math.floor(time / 420) % 4 };
    if (pulse > .16) return { row: 4, frame: Math.floor(time / 115) % 4 };
    if (paused) return { row: 6, frame: Math.floor(time / 510) % 5 };
    if (!playing) return { row: 0, frame: Math.floor(time / 520) % 7 };
    if (direction.x < 0) return { row: 2, frame: Math.floor(time / 105) % 8 };
    return { row: 1, frame: Math.floor(time / 105) % 8 };
  }

  function drawSunshine(time) {
    const head = snake[0];
    const targetX = head.x + .5 + direction.x * .72 + direction.y * .9;
    const targetY = head.y + .5 + direction.y * .72 - direction.x * .98;
    sunshine.x += (targetX - sunshine.x) * .16; sunshine.y += (targetY - sunshine.y) * .16;
    const bob = Math.sin(time / 380) * .06;
    const x = (sunshine.x + Math.cos(time / 920) * .025) * cellSize;
    const y = (sunshine.y + bob) * cellSize;
    const pulse = Math.max(0, 1 - (time - lastEatenAt) / 620);
    const halo = context.createRadialGradient(x, y, 0, x, y, cellSize * (1.02 + pulse * .34));
    halo.addColorStop(0, `rgba(255, 225, 138, ${.15 + pulse * .16})`); halo.addColorStop(1, 'rgba(244, 201, 101, 0)');
    context.fillStyle = halo; context.fillRect(x - cellSize * 1.25, y - cellSize * 1.25, cellSize * 2.5, cellSize * 2.5);
    if (pulse && lastFood) {
      const foodX = (lastFood.x + .5) * cellSize;
      const foodY = (lastFood.y + .5) * cellSize;
      context.strokeStyle = `rgba(255, 224, 136, ${pulse * .36})`;
      context.lineWidth = Math.max(1, cellSize * .032);
      context.lineCap = 'round';
      context.beginPath(); context.moveTo(x, y); context.quadraticCurveTo((x + foodX) / 2, Math.min(y, foodY) - cellSize * .3, foodX, foodY); context.stroke();
    }
    if (!sunshineSprite.complete || !sunshineSprite.naturalWidth) return;
    const pose = companionFrame(time, pulse);
    const height = cellSize * (1.66 + pulse * .14);
    const width = height * (SPRITE_CELL_WIDTH / SPRITE_CELL_HEIGHT);
    context.save();
    context.globalAlpha = gameEnded ? .9 : 1;
    context.drawImage(
      sunshineSprite,
      pose.frame * SPRITE_CELL_WIDTH,
      pose.row * SPRITE_CELL_HEIGHT,
      SPRITE_CELL_WIDTH,
      SPRITE_CELL_HEIGHT,
      x - width / 2,
      y - height * .58,
      width,
      height,
    );
    context.restore();
  }

  function render(time) {
    const visualTime = reducedMotion.matches ? 0 : time;
    drawBoard(); drawFood(visualTime); drawSunshineSparks(visualTime); drawSnake(visualTime); drawSunshine(visualTime);
    if (playing && !paused && time - lastTick >= TICK_MS) { tick(); lastTick = time; }
    requestAnimationFrame(render);
  }

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    boardSize = Math.floor(Math.min(bounds.width, bounds.height));
    canvas.width = Math.floor(boardSize * dpr); canvas.height = Math.floor(boardSize * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    cellSize = boardSize / GRID_SIZE;
  }

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => { if (document.hidden && playing && !paused) togglePause(); });
  function changeDirection(code) {
    const candidate = directions[code];
    if (!candidate) return;
    if (gameEnded) return;
    if (!playing) {
      direction = candidate;
      nextDirection = candidate;
      playing = true;
      lastTick = performance.now();
      setStatus('Find the light', false);
      return;
    }
    if (candidate.x !== -direction.x || candidate.y !== -direction.y) nextDirection = candidate;
  }
  window.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && event.target.tagName !== 'BUTTON') {
      event.preventDefault(); if (playing) togglePause(); return;
    }
    if (directions[event.code]) { event.preventDefault(); changeDirection(event.code); }
  });
  document.querySelectorAll('[data-direction]').forEach(button => {
    button.addEventListener('click', () => changeDirection(button.dataset.direction));
  });
  pauseButton.addEventListener('click', () => { if (playing) togglePause(); });
  window.addEventListener('blur', () => { if (playing && !paused) togglePause(); });
  function togglePause() {
    paused = !paused;
    setStatus(paused ? 'Paused · space to continue' : 'Find the light', paused);
    playSound('control');
  }
  restartButton.addEventListener('click', () => { playSound('control'); startGame(); });
  retryButton.addEventListener('click', () => { playSound('control'); startGame(); });
  soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    saveSoundPreference();
    updateSoundToggle();
    if (soundEnabled) playSound('control');
  });

  highScore = readHighScore(); bestEl.textContent = highScore;
  soundEnabled = readSoundPreference(); updateSoundToggle();
  resize(); startGame(); requestAnimationFrame(render);
  // No service worker in the portfolio edition: never control or clear the host site's caches.
})();
