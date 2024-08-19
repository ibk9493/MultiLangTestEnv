const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const userScoreDisplay = document.getElementById("userScore");
const computerScoreDisplay = document.getElementById("computerScore");

// Existing game variables
let difficulty = "medium";
let computerSpeed = 2;
let userScore = 0;
let computerScore = 0;
let streak = 0;

// Difficulty multipliers
const difficultyMultipliers = {
    easy: 1,
    medium: 1.5,
    hard: 2
};
// Difficulty settings
const difficultySettings = {
    easy: { speed: 1.5, reactionTime: 0.2, missChance: 0.3 },
    medium: { speed: 2.5, reactionTime: 0.1, missChance: 0.15 },
    hard: { speed: 4, reactionTime: 0.05, missChance: 0.05 }
};

// Streak multipliers
const streakMultipliers = [
    1, // 0 consecutive scores
    1.2, // 1 consecutive score (we'll use this for 2 to make it more challenging)
    1.5, // 2 consecutive scores (3 in gameplay)
    1.8, // 3 consecutive scores (4 in gameplay)
    2.0  // 4 or more consecutive scores
];

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
    speed: 2, 
    dx: 2,
    dy: 2,
    color: "#00ff99"
};
function setDifficulty(level) {
    difficulty = level;
    const settings = difficultySettings[difficulty];
    computerSpeed = settings.speed;
    // Reset scores when difficulty changes for a fair start
    userScore = 0;
    computerScore = 0;
    streak = 0;
    userScoreDisplay.textContent = userScore;
    computerScoreDisplay.textContent = computerScore;
    document.getElementById('streakDisplay').textContent = `Streak: x1`;
}

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
// Function to update streak and score
function updateScore(isUserScore) {
    if (isUserScore) {
        streak++;
        let baseScore = 1; // Base score for scoring a point
        let difficultyMultiplier = difficultyMultipliers[difficulty];
        let currentStreakMultiplier = streakMultipliers[Math.min(streak, streakMultipliers.length - 1)];
        
        // Calculate score with all multipliers
        userScore += Math.floor(baseScore * difficultyMultiplier * currentStreakMultiplier);
        userScoreDisplay.textContent = userScore;

        // Update streak display
        document.getElementById('streakDisplay').textContent = `Streak: x${currentStreakMultiplier.toFixed(1)}`;
    } else {
        // Reset streak if computer scores
        streak = 0;
        document.getElementById('streakDisplay').textContent = `Streak: x1`;
    }
}


// Move the paddles
function movePaddles() {
    canvas.addEventListener("mousemove", function(event) {
        const rect = canvas.getBoundingClientRect();
        user.y = event.clientY - rect.top - user.height / 2;

        if (user.y < 0) user.y = 0;
        if (user.y > canvas.height - user.height) user.y = canvas.height - user.height;
    });

    // AI for computer paddle based on difficulty
    const settings = difficultySettings[difficulty];
    
    if (Math.random() > settings.missChance) {
        if (ball.y < computer.y + computer.height / 2) {
            computer.y -= computerSpeed * (1 - settings.reactionTime);
        } else if (ball.y > computer.y + computer.height / 2) {
            computer.y += computerSpeed * (1 - settings.reactionTime);
        }
    }

    // Prevent computer paddle from going out of bounds
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
    
    if (ball.x + ball.radius < 0) {
        computerScore++;
        computerScoreDisplay.textContent = computerScore;
        updateScore(false); // Computer scored, reset streak
        resetBall();
    }

    if (ball.x - ball.radius > canvas.width) {
        updateScore(true); // User scored, update score and streak
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

// Update game elements
function update() {
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
