const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// 球拍參數
let pad = {
  x: 375,
  y: 500,
  width: 150,
  height: 10,
};

// 圓球參數
let circle_x = 100;
let circle_y = 60;
let radius = 15;
let xSpeed = 15;
let ySpeed = 15;

// 判斷遊戲是否結束
let count = 0;

// 球拍追蹤滑鼠位置(控制球拍)
window.addEventListener("mousemove", (e) => {
  pad.x = e.clientX;
});

// 建立磚塊的隨機座標
// min, max 範圍間的隨機數，例: 100 - 400間的隨機數 => min = 100, max = 500
function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

// 建立磚塊class
let brickArray = []; // 磚塊存放的陣列
class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this); // 磚塊存放進陣列
    this.visible = true; // 磚塊可視化
  }

  // 畫出磚塊
  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  // 判斷圓球是否碰撞磚塊
  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY <= this.y + this.height + radius &&
      ballY >= this.y - radius
    );
  }
}

// 製作10個磚塊
for (let i = 0; i < 10; i++) {
  new Brick(getRandomArbitrary(0, 850), getRandomArbitrary(0, 550));
}

// 初始化計時系統
let startTime = new Date();

function drawCircle() {
  // 確認是否打到磚塊
  brickArray.forEach((brick) => {
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      count++;
      brick.visible = false; // 取消該磚塊可視化
      // 改變x, y方向與速度，並且將brick從brickArray中移除
      if (circle_y >= brick.y + brick.height || circle_y <= brick.y) {
        ySpeed *= -1;
      } else if (circle_x <= brick.x || circle_x >= brick.x + brick.width) {
        xSpeed *= -1;
      }

      if (count == 10) {
        elapsedTime = (new Date() - startTime) / 1000; // 計算經過的時間
        alert(`遊戲結束，花費時間 ${elapsedTime.toFixed(2)} 秒。`);
        clearInterval(myGame);
        for (let i = 0; i < 10; i++) {
          new Brick(getRandomArbitrary(0, 850), getRandomArbitrary(0, 550));
        }
        myGame = setInterval(drawCircle, 10);
        count = 0;
        startTime = new Date();
      }
    }
  });

  // 確認球是否打到球拍
  if (
    circle_x >= pad.x - radius &&
    circle_x <= pad.x + pad.width + radius &&
    circle_y >= pad.y - radius &&
    circle_y <= pad.y + radius
  ) {
    if (ySpeed > 0) {
      circle_y -= 20; // 防止球在球拍間來回跳動，直接 +-20 讓球碰到球拍後遠離球拍
    } else {
      circle_y += 20;
    }
    ySpeed *= -1; // 向反方向反彈
  }

  // 園球移動
  circle_x += xSpeed;
  circle_y += ySpeed;

  // 球碰到牆面反彈
  if (circle_x >= canvas.width) {
    xSpeed *= -1;
  }
  if (circle_x <= radius) {
    xSpeed *= -1;
  }
  if (circle_y >= canvas.height) {
    ySpeed *= -1;
  }
  if (circle_y <= radius) {
    circle_y += radius + 1;
    ySpeed *= -1;
  }

  // 畫出背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 畫出磚塊
  brickArray.forEach((brick) => {
    // 若可視化回true畫出磚塊，反之則不畫出
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  // 畫出球拍
  ctx.fillStyle = "orange";
  ctx.fillRect(pad.x, pad.y, pad.width, pad.height);

  // 畫出圓球
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();

  // 畫出計時器
  let currentTime = (new Date() - startTime) / 1000;
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`時間: ${currentTime.toFixed(2)} 秒`, 10, 30);
}

let myGame = setInterval(drawCircle, 10);
