// Get the canvas element
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game objects
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    dx: 5,
    dy: 5
};

const paddleHeight = 100;
const paddleWidth = 10;

const leftPaddle = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 5
};

const rightPaddle = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 5
};

// Score
let leftScore = 0;
let rightScore = 0;

// Draw functions
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(paddle) {
    ctx.fillStyle = 'black';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawScore() {
    ctx.font = '30px Arial';
    ctx.fillText(leftScore, canvas.width / 4, 50);
    ctx.fillText(rightScore, 3 * canvas.width / 4, 50);
}

// Update game state
function update() {
    // Move the ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Ball collision with paddles
    if (
        (ball.x - ball.radius < leftPaddle.x + leftPaddle.width && ball.y > leftPaddle.y && ball.y < leftPaddle.y + leftPaddle.height) ||
        (ball.x + ball.radius > rightPaddle.x && ball.y > rightPaddle.y && ball.y < rightPaddle.y + rightPaddle.height)
    ) {
        ball.dx *= -1;
    }

    // Score points
    if (ball.x + ball.radius > canvas.width) {
        leftScore++;
        resetBall();
    } else if (ball.x - ball.radius < 0) {
        rightScore++;
        resetBall();
    }

    // Move paddles
    if (rightPaddle.y + rightPaddle.height < canvas.height) {
        rightPaddle.y += rightPaddle.dy;
    }

    if (leftPaddle.y > 0) {
        leftPaddle.y -= leftPaddle.dy;
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;
    ball.dy = Math.random() > 0.5 ? 5 : -5;
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle(leftPaddle);
    drawPaddle(rightPaddle);
    drawScore();

    update();

    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && rightPaddle.y > 0) {
        rightPaddle.y -= 25;
    } else if (e.key === 'ArrowDown' && rightPaddle.y + rightPaddle.height < canvas.height) {
        rightPaddle.y += 25;
    }
});