const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const userScoreDisplay = document.getElementById("userScore");
const computerScoreDisplay = document.getElementById("computerScore");

// Difficulty levels
const DIFFICULTY = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
};

let currentDifficulty = DIFFICULTY.MEDIUM;

// Create the user and computer paddles
const user = {
    x: 0,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: "#00ff99",
    score: 0
};

const computer = {
    x: canvas.width - 10,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: "#00ff99",
    score: 0
};

// Create the ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    dx: 5,
    dy: 5,
    color: "#00ff99"
};

// AI configuration
const AI = {
    reactionDelay: 0,
    maxSpeed: 0,
    accuracy: 0,
    updateConfig: function() {
        switch(currentDifficulty) {
            case DIFFICULTY.EASY:
                this.reactionDelay = 16;
                this.maxSpeed = 3;
                this.accuracy = 0.7;
                break;
            case DIFFICULTY.MEDIUM:
                this.reactionDelay = 8;
                this.maxSpeed = 5;
                this.accuracy = 0.85;
                break;
            case DIFFICULTY.HARD:
                this.reactionDelay = 2;
                this.maxSpeed = 7;
                this.accuracy = 0.95;
                break;
        }
    }
};

AI.updateConfig();

// Draw the paddle
function drawPaddle(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

// Draw the ball
function drawBall(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

// Move the paddles
function movePaddles() {
    canvas.addEventListener("mousemove", function(event) {
        const rect = canvas.getBoundingClientRect();
        user.y = event.clientY - rect.top - user.height / 2;

        if (user.y < 0) user.y = 0;
        if (user.y > canvas.height - user.height) user.y = canvas.height - user.height;
    });

    // AI movement
    if (frameCount % AI.reactionDelay === 0) {
        const perfectY = ball.y - computer.height / 2;
        const randomError = (1 - AI.accuracy) * computer.height * (Math.random() - 0.5);
        const targetY = perfectY + randomError;
        
        if (computer.y < targetY) {
            computer.y += Math.min(AI.maxSpeed, targetY - computer.y);
        } else if (computer.y > targetY) {
            computer.y -= Math.min(AI.maxSpeed, computer.y - targetY);
        }
    }

    // Ensure computer paddle stays within bounds
    if (computer.y < 0) computer.y = 0;
    if (computer.y > canvas.height - computer.height) computer.y = canvas.height - computer.height;
}

// Move the ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    if (ball.x - ball.radius < user.x + user.width && ball.y > user.y && ball.y < user.y + user.height) {
        ball.dx *= -1;
    }

    if (ball.x + ball.radius > computer.x && ball.y > computer.y && ball.y < computer.y + computer.height) {
        ball.dx *= -1;
    }

    if (ball.x + ball.radius < 0) {
        computer.score++;
        computerScoreDisplay.textContent = computer.score;
        resetBall();
    }

    if (ball.x - ball.radius > canvas.width) {
        user.score++;
        userScoreDisplay.textContent = user.score;
        resetBall();
    }
}

// Reset the ball to the center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1;
    ball.dy = ball.speed * (Math.random() > 0.5 ? 1 : -1);
}

// Draw everything on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle(user.x, user.y, user.width, user.height, user.color);
    drawPaddle(computer.x, computer.y, computer.width, computer.height, computer.color);
    drawBall(ball.x, ball.y, ball.radius, ball.color);
}

let frameCount = 0;

// Update game elements
function update() {
    frameCount++;
    movePaddles();
    moveBall();

    if (user.score >= 10 || computer.score >= 10) {
        alert(user.score >= 10 ? "You Win!" : "Computer Wins!");
        user.score = 0;
        computer.score = 0;
        userScoreDisplay.textContent = user.score;
        computerScoreDisplay.textContent = computer.score;
    }
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

// Function to change difficulty
function changeDifficulty(difficulty) {
    currentDifficulty = difficulty;
    AI.updateConfig();
}

// Add these buttons to your HTML
// <button onclick="changeDifficulty(DIFFICULTY.EASY)">Easy</button>
// <button onclick="changeDifficulty(DIFFICULTY.MEDIUM)">Medium</button>
// <button onclick="changeDifficulty(DIFFICULTY.HARD)">Hard</button>