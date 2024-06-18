// getContext() method會回傳一個drawing context
// drawing context可以用來在cancas內畫圖
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// 尺寸規格
const unit = 20;
const row = canvas.height / unit; // 320 / 20 = 16
const cloumn = canvas.width / unit; // 320 / 20 = 16

// 物件的工作是，儲存身體的x , y座標
let snake = []; // array中的每個元素都是一個物件

// 製作蛇身
function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };
  snake[1] = {
    x: 60,
    y: 0,
  };
  snake[2] = {
    x: 40,
    y: 0,
  };
  snake[3] = {
    x: 20,
    y: 0,
  };
}

// 果實
class Fruit {
  // 初始果實座標設定
  constructor() {
    this.x = Math.floor(Math.random() * cloumn) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  // 繪製果實
  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  // 吃到果實並產生不與蛇身重疊的果實
  pickALocation() {
    let overlapping = false;
    let new_x;
    let new_y;

    // 確認是否重疊的函式
    function checkOverlap(new_x, new_y) {
      // 若重疊return true，重新產生果實座標
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    // 先產生新座標確認是否重疊
    do {
      new_x = Math.floor(Math.random() * cloumn) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}

// 初始設定
createSnake();

// 使用Fruit class
let myFruit = new Fruit();

// 建立方向鍵使用
window.addEventListener("keydown", changeDiration);
let d = "Right";

// 方向鍵使用邏輯
function changeDiration(e) {
  if (e.key == "ArrowUp" && d != "Down") {
    d = "Up";
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
  } else if (e.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  } else if (e.key == "ArrowRight" && d != "Left") {
    d = "Right";
  }

  // 每次按下方向鍵後，在下一幀被畫出來之前
  // 不接受任何keydown事件
  // 可以防止連續按鍵導致蛇快速變向而死亡
  window.removeEventListener("keydown", changeDiration);
}

// 分數設定
// 讀取最高紀錄
let highestScore;
loadHighestScore();

// 分數可視化
let score = 0;
document.getElementById("myScore").innerHTML = "遊戲分數 : " + score;
document.getElementById("myScore2").innerHTML = "最高分數 : " + highestScore;

// 整個遊戲介面
function draw() {
  // 每次畫圖之前確認蛇有沒有咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("遊戲結束");
      return;
    }
  }

  // 更新頁面，每一次執行先把背景塗黑(把舊畫面蓋掉)
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  myFruit.drawFruit();

  // 畫蛇
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen"; // fillStyle 畫出的顏色 // 蛇頭顏色
    } else {
      ctx.fillStyle = "lightblue"; // 蛇身
    }
    ctx.strokeStyle = "white"; // 身體邊框

    ctx.fillRect(snake[i].x, snake[i].y, unit, unit); // fillRect 畫出長方形的起始座標snake[i].x, snake[i].y 與 規格 unit(長/寬)
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  // 以目前d變數方向，來決定蛇的下一幀位置
  let snakeX = snake[0].x; // snake[0]是一個物件，但snake[0].x 是個number
  let snakeY = snake[0].y;

  if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Right") {
    snakeX += unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Down") {
    snakeY += unit;
  }

  // 穿牆功能
  for (let i = 0; i < snake.length; i++) {
    if (snakeX >= canvas.width) {
      snakeX = 0;
    } else if (snakeX < 0) {
      snakeX = canvas.width - unit;
    } else if (snakeY >= canvas.height) {
      snakeY = 0;
    } else if (snakeY < 0) {
      snakeY = canvas.height - unit;
    }
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // 確認蛇是否有吃到果實，更新分數
  if (snakeX == myFruit.x && snakeY == myFruit.y) {
    myFruit.pickALocation();
    score++;
    setHighestScore(score);

    document.getElementById("myScore").innerHTML = "遊戲分數 : " + score;
    document.getElementById("myScore2").innerHTML =
      "最高分數 : " + highestScore;
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
  window.addEventListener("keydown", changeDiration);
}

// 執行畫面
let myGame = setInterval(draw, 100);

// 讀取最高分
function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
    console.log(highestScore);
  }
}

// 更新最高分
function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
