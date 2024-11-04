const options = [
  { color: "#FF0000", name: "red" },
  { color: "#0000FF", name: "blue" },
  { color: "#00FF00", name: "green" },
  { color: "#FFA500", name: "orange" },
  { color: "#FFFF00", name: "yellow" },
  { color: "#A020F0", name: "purple" },
];
let playerOne;
let playerTwo;
let boxes = [];
let backgroundColor = 0;
let tempColor;
let fadeAmount = 0.05;
let isFading = false;
let getPoint = false;
let timerWidth = 200;

class Player {
  constructor() {
    this.wordMargin = 100;
    this.wordX = random(this.wordMargin, windowWidth - this.wordMargin);
    this.wordY = random(this.wordMargin, windowHeight - this.wordMargin);
    this.points = 0;
    this.wordObj = {};
  }

  generateWord() {
    const name = options[Math.floor(random() * options.length)].name;
    const color = options[Math.floor(random() * options.length)].color;
    this.wordObj = {
      name,
      color,
    };
  }

  renderWord() {
    if (this.wordObj) {
      fill(this.wordObj.color);
      textSize(56);
      textAlign(CENTER);
      textStyle(BOLD);
      noStroke();
      textFont("Modak");
      text(this.wordObj.name, this.wordX, this.wordY);
    }
  }

  dragWord() {
    this.wordX = mouseX;
    this.wordY = mouseY;
  }

  rerenderWord() {
    this.wordX = random(this.wordMargin, windowWidth - this.wordMargin);
    this.wordY = random(this.wordMargin, windowHeight - this.wordMargin);
    this.generateWord();
    this.renderWord();
  }

  renderPoints() {
    fill("white");
    textSize(20);
    noStroke();
    textFont("Verdana");
    text("Points: " + this.points, 90, 40);
  }
}

class Box {
  constructor(color, name) {
    this.boxW = 100;
    this.boxH = 100;
    this.boxX = Math.floor(random(this.boxW, windowWidth - this.boxW));
    this.boxY = Math.floor(random(this.boxH, windowHeight - this.boxH));

    this.velocityX = 2;
    this.velocityY = 2;
    this.color = color;
    this.name = name;
  }

  renderBox() {
    fill(this.color);
    noStroke();
    rect(this.boxX, this.boxY, this.boxW, this.boxH);
    if (this.boxX + this.boxW > windowWidth) this.velocityX *= -1;
    if (this.boxX <= 0) this.velocityX *= -1;
    if (this.boxY <= 0) this.velocityY *= -1;
    if (this.boxY + this.boxH > windowHeight) this.velocityY *= -1;
    this.boxX += this.velocityX;
    this.boxY += this.velocityY;
  }

  isColliding(otherBox) {
    return !(
      this.boxX + this.boxW < otherBox.boxX ||
      this.boxX > otherBox.boxX + otherBox.boxW ||
      this.boxY + this.boxH < otherBox.boxY ||
      this.boxY > otherBox.boxY + otherBox.boxH
    );
  }
  handleCollision(otherBox) {
    let tempX = this.velocityX;
    let tempY = this.velocityY;

    this.velocityX = otherBox.velocityX;
    this.velocityY = otherBox.velocityY;
    otherBox.velocityX = tempX;
    otherBox.velocityY = tempY;
  }
}

function createTimer() {
  fill("none");
  stroke("red");
  rect(windowWidth - 260, 20, 200, 20);

  fill("red");
  rect(windowWidth - 260, 20, timerWidth, 20);
  timerWidth -= 1;
  if (timerWidth === 0) {
    timerWidth = 200;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  playerOne = new Player();
  playerOne.generateWord();
  for (let i = 0; i < options.length; i++) {
    const box = new Box(options[i].color, options[i].name);
    boxes.push(box);
  }
  tempColor = color(0);
}

function draw() {
  background(tempColor);
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].renderBox();
    for (let j = i + 1; j < boxes.length; j++) {
      if (boxes[i].isColliding(boxes[j])) {
        boxes[i].handleCollision(boxes[j]);
      }
    }
  }
  playerOne.renderWord();
  playerOne.renderPoints();
  createTimer();

  if (isFading) {
    tempColor = lerpColor(tempColor, color(0), fadeAmount);
    if (
      tempColor.levels.every(
        (level, index) => abs(level - color(0).levels[index]) < 1
      )
    ) {
      isFading = false;
      tempColor = color(0);
    }
  }

  if (timerWidth === 1) {
    playerOne.rerenderWord();
  }
}

function mouseDragged() {
  playerOne.dragWord();
}

function addPoint() {
  playerOne.points++;
  getPoint = true;
  startFadeEffect();
}

function missPoint() {
  getPoint = false;
  startFadeEffect();
}

function startFadeEffect() {
  getPoint ? (tempColor = color(0, 255, 0)) : (tempColor = color(255, 0, 0));
  isFading = true;
}

function mouseReleased() {
  const droppedBox = boxes.find(
    (box) =>
      box.boxX <= playerOne.wordX && box.boxX + box.boxW >= playerOne.wordX
  );

  droppedBox && droppedBox.name === playerOne.wordObj.name
    ? addPoint()
    : missPoint();
  playerOne.rerenderWord();
  timerWidth = 200;
}
