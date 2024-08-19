// Get the canvas element
const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Ball object
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 4,
    dx: 4,
    dy: 4
};

// Paddle properties
const paddleHeight = 100;
const paddleWidth = 10;
const player = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 5
};
const ai = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 5
};

// Score
let playerScore = 0;
let aiScore = 0;

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "45px fantasy";
    ctx.fillText(text, x, y);
}

// Move paddles
function movePaddle(paddle, y) {
    if (y > 0 && y < canvas.height - paddle.height) {
        paddle.y = y;
    }
}

// Ball collision detection
function collision(b, p) {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

// Reset ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;
    ball.speed = 4;
}

// Update function
function update() {
    // Move the ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Ball collision with paddles
    let paddle = (ball.x < canvas.width / 2) ? player : ai;
    if (collision(ball, paddle)) {
        // Change direction
        let collidePoint = (ball.y - (paddle.y + paddle.height / 2));
        collidePoint = collidePoint / (paddle.height / 2);
        let angleRad = collidePoint * (Math.PI / 4);
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.dx = direction * ball.speed * Math.cos(angleRad);
        ball.dy = ball.speed * Math.sin(angleRad);
        ball.speed += 0.1;
    }

    // Score update
    if (ball.x - ball.radius < 0) {
        aiScore++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        resetBall();
    }

    // AI movement (simple tracking)
    if (ai.y + ai.height / 2 < ball.y) {
        ai.y += ai.dy;
    } else {
        ai.y -= ai.dy;
    }
}

// Render function
function render() {
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    drawText(playerScore, canvas.width / 4, canvas.height / 5, "#FFF");
    drawText(aiScore, 3 * canvas.width / 4, canvas.height / 5, "#FFF");
    drawRect(player.x, player.y, player.width, player.height, "#FFF");
    drawRect(ai.x, ai.y, ai.width, ai.height, "#FFF");
    drawCircle(ball.x, ball.y, ball.radius, "#FFF");
}

// Game loop
function game() {
    update();
    render();
}

// Control the paddle
canvas.addEventListener('mousemove', (e) => {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseY = e.clientY - rect.top - root.scrollTop;
    movePaddle(player, mouseY - paddleHeight / 2);
});

// Loop
let fps = 50;
setInterval(game, 1000 / fps);