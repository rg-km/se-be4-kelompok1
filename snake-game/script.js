const CELL_SIZE = 20
const CANVAS_SIZE = 400
const DEFAULTLIFE = 3;
const REDRAW_INTERVAL = 50;
let DEFAULTSPEED = 150;
const LEVELS = [
    { level: 1, speed: DEFAULTSPEED, },
    { level: 2, speed: 100, },
    { level: 3, speed: 90, },
    { level: 4, speed: 60, },
    { level: 5, speed: 50, },
];
let snake1 = initSnake()
let apple = {
    type: "food",
    color: "red",
    position: initPosition()
}

let apple2 = {
    type: "food",
    color: "red",
    position: initPosition(),
}

let heart = {
    type: "heart",
    color: "red",
    position: initPosition(),
}

let direction = {
    Up: 0,
    Down: 1,
    Left: 2,
    Right: 3
}
function initSnake() {
    return {
        ...initHeadAndBody(),
        direction: initDirection(),
        width: CELL_SIZE,
        score: 0,
        level: 1,
        life: DEFAULTLIFE,
    }
}
function initHeadAndBody() {
    let head = initPosition()
    let body = [{ x: head.x, y: head.y }]
    return {
        head,
        body
    }
}

function initPosition() {
    return {
        x: Math.floor(Math.random() * CELL_SIZE),
        y: Math.floor(Math.random() * CELL_SIZE)
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4)
}

function showIcon(ctx, path, x, y, width = 10, height = 10) {
    if (path === "snake") {
        // ctx.rotate(20);
    }
    ctx.drawImage(document.getElementById(path), x, y, width, height);
}

function checkPrimer(snake) {
    let score = snake.score;
    let dibagi = 0;
    for (let i = 0; i <= score; i++) {
        if (score % i == 0) {
            dibagi = dibagi + 1;
        }
    }
    if (dibagi == 2) {
        return true;
    } else {
        return false;
    }
}

function drawLife(snake) {
    let healthCanvas = document.getElementById("healthBoard");
    let ctx = healthCanvas.getContext("2d");

    for (var i = 0; i < snake.life; i++) {
        showIcon(ctx, "heartIcon", 10 + (i * 20), 5, 20, 20);
    }
}

function drawHearth(ctx, snake) {
    if (checkPrimer(snake)) {
        drawCell(ctx, heart.position.x, heart.position.y, "heartNew");
    }
}

function drawCell(ctx, x, y, img = null) {
    if (img == null) {
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    } else {
        showIcon(ctx, img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
    }
}

function drawScore(snake, canvas) {
    let scoreCanvas = document.getElementById(canvas)
    if (scoreCanvas !== null) {
        let scoreCtx = scoreCanvas.getContext("2d");
        scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
        scoreCtx.font = "30px Arial";
        scoreCtx.fillStyle = snake.color
        scoreCtx.fillText(snake.score, 10, scoreCanvas.scrollHeight / 2);
    }
}

function draw() {
    drawLevel(snake1, "levelBoard");
    setInterval(function () {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");
        let img = document.getElementById("apple");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);



        drawCell(ctx, snake1.head.x, snake1.head.y, "snake")
        for (let i = 1; i < snake1.body.length; i++) {
            drawCell(ctx, snake1.body[i].x, snake1.body[i].y, "bulat")
        }

        drawCell(ctx, apple.position.x, apple.position.y, "apple")
        drawCell(ctx, apple2.position.x, apple2.position.y, "apple")
        drawHearth(ctx, snake1);


        drawScore(snake1, "score1Board")
        drawSpeed(snake1, "speedBoard");
        drawLife(snake1);

    }, REDRAW_INTERVAL);
}
draw()


function eat(snake, feed) {
    let eat = new Audio()
    eat.src = "./assets/eat.mp3"
    if (snake.head.x === feed.position.x && snake.head.y === feed.position.y) {
        eat.play()
        feed.position = initPosition()
        snake.score++
        if (feed.type == "food") {
            snake.body.push({ x: snake.head.x, y: snake.head.y });
        } else if (feed.type == "heart") {
            snake.life++;
        }
        drawLevel(snake, "levelBoard");
    }
}

function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();

}

function drawLevel(snake, canvas) {
    let levelCanvas = document.getElementById(canvas);
    let levelCtx = levelCanvas.getContext("2d");
    if (snake.score == 0) {
        levelCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        levelCtx.font = "30px Arial";
        levelCtx.fillStyle = snake.color
        levelCtx.fillText(snake.level, 10, levelCanvas.scrollHeight / 2);
    } else if ((snake.score % 5) == 0) {
        snake.level++;
        levelCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        levelCtx.font = "30px Arial";
        levelCtx.fillStyle = snake.color
        levelCtx.fillText(snake.level, 10, levelCanvas.scrollHeight / 2);
        // soundLevelUp();
    }
    for (var i = 0; i < LEVELS.length; i++) {
        if (snake.level == LEVELS[i].level) {
            DEFAULTSPEED = LEVELS[i].speed;
        }
    }
}

function drawSpeed(snake, canvas) {
    let speedCanvas;
    speedCanvas = document.getElementById(canvas);
    let speedContext = speedCanvas.getContext("2d");
    speedContext.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    speedContext.font = "30px Arial";
    speedContext.fillStyle = snake.color;
    for (var i = 0; i < LEVELS.length; i++) {
        if (snake.level == LEVELS[i].level) {
            //MOVE_INTERVAL = LEVELS[i].speed;
            speedContext.fillText(LEVELS[i].speed, 10, speedCanvas.scrollHeight / 2);
        }
    }

}

function checkCollision(snakes) {
    let isCollide = false
    let gameOver = new Audio()
    gameOver.src = "./assets/GameOver.mp3"
    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].body.length; k++) {
                if (snakes[i].head.x === snakes[j].body[k].x && snakes[i].head.y === snakes[j].body[k].y) {
                    isCollide = true
                }
            }
        }
    }
    if (isCollide) {
        gameOver.play()
        setTimeout(() => {
            alert("Game Over")
        }, 150)
        snake1 = initSnake()
    }
    return isCollide
}

function move(snake) {
    switch (snake.direction) {
        case direction.Left:
            moveLeft(snake)
            break;
        case direction.Right:
            moveRight(snake)
            break;
        case direction.Up:
            moveUp(snake)
            break;
        case direction.Down:
            moveDown(snake)
            break;
    }
    moveBody(snake);
    if (!checkCollision([snake1])) {
        setTimeout(() => {
            move(snake);
        }, DEFAULTSPEED);
    } else initGame()

}

function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_SIZE / CELL_SIZE - 1
    }
    if (snake.head.y === -1) {
        snake.head.y = CANVAS_SIZE / CELL_SIZE - 1
    }
    if (snake.head.x >= 20) {
        snake.head.x = 0
    }
    if (snake.head.y === 20) {
        snake.head.y = 0
    }
}
function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apple);
    eat(snake, apple2);
    eat(snake, heart);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apple);
    eat(snake, apple2);
    eat(snake, heart);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apple);
    eat(snake, apple2);
    eat(snake, heart);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apple);
    eat(snake, apple2);
    eat(snake, heart);
}


function turn(snake, d) {
    const oppositeDirections = {
        [direction.Left]: direction.Right,
        [direction.Right]: direction.Left,
        [direction.Down]: direction.Up,
        [direction.Up]: direction.Down,

    }
    if (d !== oppositeDirections[snake.direction]) {
        snake.direction = d;
    }
}
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") turn(snake1, direction.Left)
    else if (e.key === "ArrowRight") turn(snake1, direction.Right)
    else if (e.key === "ArrowUp") turn(snake1, direction.Up)
    else if (e.key === "ArrowDown") turn(snake1, direction.Down)

})

function initGame() {
    move(snake1)
}

initGame()