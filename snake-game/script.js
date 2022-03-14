const CELL_SIZE = 20
const CANVAS_SIZE = 400
const DEFAULTLIFE = 3;
const REDRAW_INTERVAL = 50;
const DEFAULTCOLORBARRIER = "black";
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
let DEFAULTSPEED = 250;
const LEVELS = [
    { level: 1, speed: DEFAULTSPEED, },
    { level: 2, speed: DEFAULTSPEED - 20, },
    { level: 3, speed: DEFAULTSPEED - 40, },
    { level: 4, speed: DEFAULTSPEED - 60, },
    { level: 5, speed: DEFAULTSPEED - 80, },
];
const OBSTACLES = [
    {
        level: 1,
        obstacle: [
            //obstacle code here
        ]
    },
    {
        level: 2,
        obstacle: [
            {
                position: initBarrier(120, 200, 120, 10),
                color: DEFAULTCOLORBARRIER
            },
        ]
    },
    {
        level: 3,
        obstacle: [
            {
                position: initBarrier(120, 100, 120, 10),
                color: DEFAULTCOLORBARRIER
            },
            {
                position: initBarrier(270, 30, 60, 10),
                color: DEFAULTCOLORBARRIER
            },
        ]
    },
    {
        level: 4,
        obstacle: [
            {
                position: initBarrier(120, 200, 120, 10),
                color: DEFAULTCOLORBARRIER
            },
            {
                position: initBarrier(270, 30, 60, 10),
                color: DEFAULTCOLORBARRIER
            },
            {
                position: initBarrier(70, 30, 60, 10),
                color: DEFAULTCOLORBARRIER
            },
        ]
    },
    {
        level: 5,
        obstacle: [
            {
                position: initBarrier(120, 200, 120, 10),
                color: DEFAULTCOLORBARRIER
            },
            {
                position: initBarrier(270, 30, 60, 10),
                color: DEFAULTCOLORBARRIER
            },
            {
                position: initBarrier(70, 30, 60, 10),
                color: DEFAULTCOLORBARRIER
            },
            {
                position: initBarrier(70, 330, 60, 10),
                color: DEFAULTCOLORBARRIER
            },
            {
                position: initBarrier(270, 330, 60, 10),
                color: DEFAULTCOLORBARRIER
            },
        ]
    },
];
let thornDirection = initDirection();

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


let thorn = {
    type: "thorn",
    color: "red",
    position: initPosition(),
    direction: 0
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

function recentSnake(snake) {
    return {
        ...initHeadAndBody(),
        direction: initDirection(),
        score: snake.score,
        life: snake.life,
        level: snake.level,
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

function initBarrier(x, y, width, height) {
    return {
        x: x,
        y: y,
        width: width,
        height: height
    }
}

function showIcon(ctx, path, x, y, width = 10, height = 10) {
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
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    for (var i = 0; i < snake.life; i++) {
        showIcon(ctx, "heartIcon", 360 - (i * 20), 5, 20, 20);
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

function drawObstacle(ctx, x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawThorn(snake) {
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");

    if (snake.level == 1 || snake.level == 3) {
        drawCell(ctx, thorn.position.x, thorn.position.y, "thorn");
    }

}

function drawScore(snake, canvas) {
    let scoreCanvas = document.getElementById(canvas)
    if (scoreCanvas !== null) {
        let scoreCtx = scoreCanvas.getContext("2d");
        scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
        scoreCtx.font = "30px Arial";
        scoreCtx.fillStyle = snake.color
        scoreCtx.fillText(snake.score, 30, scoreCanvas.scrollHeight / 2);
    }
}

function drawHeadSnake(context, snake) {
    switch (snake.direction) {
        case direction.Left:
            drawCell(context, snake1.head.x, snake1.head.y, "snakeLeft")
            break;
        case direction.Right:
            drawCell(context, snake1.head.x, snake1.head.y, "snakeRight")
            break;
        case direction.Up:
            drawCell(context, snake1.head.x, snake1.head.y, "snakeUp")
            break;
        case direction.Down:
            drawCell(context, snake1.head.x, snake1.head.y, "snake")
            break;
    }
}

function draw() {
    drawLevel(snake1, "levelBoard");
    setInterval(function () {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        showObstacle(snake1);


        drawHeadSnake(ctx, snake1);
        // drawCell(ctx, snake1.head.x, snake1.head.y, "snake")
        for (let i = 1; i < snake1.body.length; i++) {
            drawCell(ctx, snake1.body[i].x, snake1.body[i].y, "bulat")
        }

        drawCell(ctx, apple.position.x, apple.position.y, "apple")
        drawCell(ctx, apple2.position.x, apple2.position.y, "apple")
        drawHearth(ctx, snake1);


        drawScore(snake1, "score1Board")
        drawSpeed(snake1, "speedBoard");
        drawLife(snake1);
        drawThorn(snake1);

    }, REDRAW_INTERVAL);
}
draw()


function setIntervalThorn() {
    setInterval(function () {
        thorn.direction = initDirection()
    }, 2000);
}
setIntervalThorn()



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

    let soundLevelUp = new Audio()
    soundLevelUp.src = "./assets/changeLevel.wav"
    let levelCanvas = document.getElementById(canvas);
    let levelCtx = levelCanvas.getContext("2d");


    if (snake.score == 0) {
        levelCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        levelCtx.font = "30px Arial";
        levelCtx.fillStyle = snake.color
        levelCtx.fillText("Level " + snake.level, 30, levelCanvas.scrollHeight / 2);
    } else if ((snake.score % 5) == 0) {
        snake.level++;
        levelCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        levelCtx.font = "30px Arial";
        levelCtx.fillStyle = snake.color
        levelCtx.fillText("Level " + snake.level, 30, levelCanvas.scrollHeight / 2);
        soundLevelUp.play();

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
    speedContext.font = "20px Arial";
    speedContext.fillStyle = snake.color;
    for (var i = 0; i < LEVELS.length; i++) {
        if (snake.level == LEVELS[i].level) {
            speedContext.fillText(LEVELS[i].speed + "ms", 20, speedCanvas.scrollHeight / 2);
        }
    }

}

function showObstacle(snake) {
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");
    for (let i = 0; i < OBSTACLES.length; i++) {
        for (let j = 0; j < OBSTACLES[i].obstacle.length; j++) {
            if (snake.level == OBSTACLES[i].level) {
                if (OBSTACLES[i].obstacle.length > 0) {
                    ctx.fillStyle = OBSTACLES[i].obstacle[j].color;
                    drawObstacle(ctx, OBSTACLES[i].obstacle[j].position.x, OBSTACLES[i].obstacle[j].position.y, OBSTACLES[i].obstacle[j].position.width, OBSTACLES[i].obstacle[j].position.height, OBSTACLES[i].obstacle[j].color);
                }
            }
        }
    }
}


function checkCollision(snakes) {

    let isCollide = false
    let gameOver = new Audio()
    gameOver.src = "./assets/GameOver.mp3"
    let soundHitObstacle = new Audio()
    soundHitObstacle.src = "./assets/ObstacleSound.wav"

    for (let i = 0; i < snakes.length; i++) {
        for (let k = 1; k < snakes[0].body.length; k++) {
            if (snakes[i].head.x === snakes[i].body[k].x && snakes[i].head.y === snakes[i].body[k].y) {
                isCollide = true
            }
        }
    }

    //tembok
    for (let p = 0; p < snakes.length; p++) {
        for (let i = 0; i < OBSTACLES.length; i++) {
            for (let j = 0; j < OBSTACLES[i].obstacle.length; j++) {
                if (snakes[p].level == OBSTACLES[i].level && OBSTACLES[i].obstacle.length > 0) {
                    if (snakes[p].head.x >= (Math.floor(OBSTACLES[i].obstacle[j].position.x / CELL_SIZE)) && snakes[p].head.y >= (Math.floor(OBSTACLES[i].obstacle[j].position.y / CELL_SIZE))
                        && snakes[p].head.y <= (Math.floor(OBSTACLES[i].obstacle[j].position.height / HEIGHT)) + Math.floor(OBSTACLES[i].obstacle[j].position.y / CELL_SIZE) && snakes[p].head.x < (Math.floor(OBSTACLES[i].obstacle[j].position.x / CELL_SIZE) + Math.ceil(OBSTACLES[i].obstacle[j].position.width / WIDTH))) {
                        isCollide = true;
                    }
                }
            }
        }
    }

    if (isCollide) {
        if (snake1.life === 1) {
            gameOver.play()
            setTimeout(() => {      
                alert("Game over");
            },200)
            snake1 = initSnake("purple");
            drawLevel(snake1, "levelBoard");
        } else {
            snake1.life--;
            snake1 = recentSnake(snake1);
            soundHitObstacle.play();
        }
    }
    return isCollide
}


function checkThorn(snakes, thorn) {

    let soundHitThorn = new Audio()
    soundHitThorn.src = "./assets/ObstacleSound.wav"
    let gameOver = new Audio()
    gameOver.src = "./assets/GameOver.mp3"

    switch (thorn.direction) {
        case direction.Left:
            thorn.position.x--;
            break;
        case direction.Right:
            thorn.position.x++;
            break;
        case direction.Up:
            thorn.position.y--;
            break;
        case direction.Down:
            thorn.position.y++;
            break;
    }

    if (snakes.head.x === thorn.position.x && snakes.head.y === thorn.position.y) {
        soundHitThorn.play()
        thorn.position = initPosition()

        if (thorn.type == "thorn") {
            snake1.life--;
        }

        if (snakes.life === 0) {
            gameOver.play()
            setTimeout(() => {      
                 alert("Game over");
            },200)
            snakes = initSnake("purple");
            drawLevel(snakes, "levelBoard");
        }

    }

}

function checkWin() {
    let winnerSound = new Audio()
    winnerSound.src = "./assets/Victory.mp3"

    if (snake1.level === 6) {
        winnerSound.play();
        setTimeout(() => {      
            alert("You Win");
       },200)
        snake1 = initSnake("purple");
        drawLevel(snake1, "levelBoard");
        initGame()
    }
    
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

function teleportThorn(thorn) {
    if (thorn.position.x < 0) {
        thorn.position.x = CANVAS_SIZE / CELL_SIZE - 1
    }
    if (thorn.position.y === -1) {
        thorn.position.y =  CANVAS_SIZE / CELL_SIZE - 1
    }
    if (thorn.position.x >= 20) {
        thorn.position.x = 0
    }
    if (thorn.position.y === 20) {
        thorn.position.y = 0
    }

}
function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apple);
    eat(snake, apple2);
    eat(snake, heart);
    checkWin();
    checkThorn(snake, thorn);
    teleportThorn(thorn);
    
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apple);
    eat(snake, apple2);
    eat(snake, heart);
    checkWin();
    checkThorn(snake, thorn);
    teleportThorn(thorn);
  
}


function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apple);
    eat(snake, apple2);
    eat(snake, heart);
    checkWin();
    checkThorn(snake, thorn);
    teleportThorn(thorn);
}


function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apple);
    eat(snake, apple2);
    eat(snake, heart);
    checkWin();
    checkThorn(snake, thorn);
    teleportThorn(thorn);
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

function start() {
    document.getElementById("bg_snake").style.display = "none";
    document.getElementById("snake_game").style.display = "block";
    draw();
    initGame()
}
