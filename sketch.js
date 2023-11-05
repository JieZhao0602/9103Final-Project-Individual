let circles = [];//initialization and set up
const maxRadius = 40;
const bigCircleRadius = 70;
let bgColor = [44, 61, 100];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  makeCircles();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  makeCircles();
}

function makeCircles() {//creating the circles
  circles = [];
  let cols = floor(width / (bigCircleRadius * 2 + 5));
  let rows = floor(height / (bigCircleRadius * 2 + 5));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let x = (bigCircleRadius + 2.5) + col * (bigCircleRadius * 2 + 5);
      let y = (bigCircleRadius + 2.5) + row * (bigCircleRadius * 2 + 5);

      let noiseVal = noise(x * 0.01, y * 0.01);//time based appearance
      let startTime = noiseVal * 5000;

      let hue = random(360);
      circles.push(new BigCircle(x, y, bigCircleRadius, color(hue, 5, 90), startTime));

      for (let j = 0; j < 6; j++) {
        let hueSmall = random(360);
        let shade = color(hueSmall, 80, 70, 0.7);
        let radius = maxRadius * (1.0) * (1 - j * 0.2) * 0.9;
        circles.push(new SmallCircle(x, y, radius, shade, startTime));
      }

      let hueCenter = random(360);
      circles.push(new CircleCenter(x, y, maxRadius * 0.2, color(hueCenter, 100, 50, 0.7), startTime));
    }
  }
}

function draw() {//animation loop
  background(bgColor);
  let currentTime = millis();
  for (let circle of circles) {
    if (currentTime >= circle.startTime) {
      circle.update();
      circle.show();
      circle.checkHover(mouseX, mouseY);
    }
  }
}

function mousePressed() {//interactive elements
  for (let circle of circles) {
    circle.onClick();
  }
}

function mouseDragged() {
  circles.push(new CircleCenter(mouseX, mouseY, maxRadius * 0.2, color(random(360), 100, 50, 0.7)));
}

function doubleClicked() {
  bgColor = [random(360), random(100), random(100)];
}

class BigCircle {//circle classes
  constructor(x, y, radius, base, startTime) {
    this.originalPos = createVector(x, y);
    this.pos = this.originalPos.copy();
    this.base = base;
    this.radius = radius;
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
    this.rotationOffset = random(1000);
    this.speed = 0.02;
    this.hovered = false;
    this.startTime = startTime;
  }

  update() {//positional variation
    this.pos.x = this.originalPos.x + (noise(this.noiseOffsetX) - 0.5) * 20;
    this.pos.y = this.originalPos.y + (noise(this.noiseOffsetY) - 0.5) * 20;
    this.noiseOffsetX += this.speed;
    this.noiseOffsetY += this.speed;
  }

  onClick() {
    this.base = color(random(360), 5, 90);
    this.speed = 0.1;
    setTimeout(() => this.speed = 0.02, 1000);
  }

  checkHover(mx, my) {
    this.hovered = dist(mx, my, this.pos.x, this.pos.y) <= this.radius;
    if (this.hovered) {
      this.base = color(noise(this.noiseOffsetX) * 360, 5, 90);
    }
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(noise(this.rotationOffset) * PI);//rotational variation
    this.rotationOffset += 0.01;

    fill(this.base);
    stroke(color(hue(this.base), 90, brightness(this.base) - 60));
    strokeWeight(1.5);
    ellipse(0, 0, this.radius * 2);

    let numLines = 50;
    let innerRadius = maxRadius * 0.9;
    stroke(34, 100, 100);

    for (let i = 0; i < numLines; i++) {
      let angle = TWO_PI / numLines * i;
      let innerX = cos(angle) * innerRadius;
      let outerX = cos(angle) * this.radius;
      let innerY = sin(angle) * innerRadius;
      let outerY = sin(angle) * this.radius;
      line(innerX, innerY, outerX, outerY);
    }
    pop();
  }
}

class SmallCircle {
  constructor(x, y, radius, base, startTime) {
    this.originalPos = createVector(x, y);
    this.pos = this.originalPos.copy();
    this.base = base;
    this.radius = radius;
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
    this.rotationOffset = random(1000);
    this.speed = 0.03;
    this.hovered = false;
    this.startTime = startTime;
  }

  update() {
    this.pos.x = this.originalPos.x + (noise(this.noiseOffsetX) - 0.5) * 15;
    this.pos.y = this.originalPos.y + (noise(this.noiseOffsetY) - 0.5) * 15;
    this.noiseOffsetX += this.speed;
    this.noiseOffsetY += this.speed;
  }

  onClick() {
    this.base = color(random(360), 80, 70, 0.7);
    this.speed = 0.1;
    setTimeout(() => this.speed = 0.03, 1000);
  }

  checkHover(mx, my) {
    this.hovered = dist(mx, my, this.pos.x, this.pos.y) <= this.radius;
    if (this.hovered) {
      this.base = color(noise(this.noiseOffsetX) * 360, 80, 70, 0.7);//color variation on hover
    }
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(noise(this.rotationOffset) * PI);
    this.rotationOffset += 0.01;

    fill(this.base);
    stroke(255);
    strokeWeight(0.5);
    ellipse(0, 0, this.radius * 2);
    let innerRadius = this.radius * 0.5;
    ellipse(0, 0, innerRadius * 2);

    for (let j = 0; j < 6; j++) {
      for (let i = 0; i < 24; i++) {
        let angle = TWO_PI / 24 * i + j * PI / 12;
        let xOffset = cos(angle) * this.radius * 0.7;
        let yOffset = sin(angle) * this.radius * 0.7;
        ellipse(xOffset, yOffset, this.radius * 0.15);
      }
    }

    for (let i = 0; i < 5; i++) {
      let angle = TWO_PI / 5 * i;
      let xOffset = cos(angle) * (this.radius * 2.5);
      let yOffset = sin(angle) * (this.radius * 2.5);
      ellipse(xOffset, yOffset, this.radius * 0.2);
    }
    pop();
  }
}

class CircleCenter {
  constructor(x, y, radius, base, startTime) {
    this.originalPos = createVector(x, y);
    this.pos = this.originalPos.copy();
    this.base = base;
    this.radius = radius;
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
    this.rotationOffset = random(1000);
    this.speed = 0.04;
    this.hovered = false;
    this.startTime = startTime;
  }

  update() {
    this.pos.x = this.originalPos.x + (noise(this.noiseOffsetX) - 0.5) * 10;
    this.pos.y = this.originalPos.y + (noise(this.noiseOffsetY) - 0.5) * 10;
    this.noiseOffsetX += this.speed;
    this.noiseOffsetY += this.speed;
  }

  onClick() {
    this.base = color(random(360), 100, 50, 0.7);
    this.speed = 0.1;
    setTimeout(() => this.speed = 0.04, 1000);
  }

  checkHover(mx, my) {
    this.hovered = dist(mx, my, this.pos.x, this.pos.y) <= this.radius;
    if (this.hovered) {
      this.base = color(noise(this.noiseOffsetX) * 360, 100, 50, 0.7);
    }
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(noise(this.rotationOffset) * PI);
    this.rotationOffset += 0.01;

    fill(this.base);
    stroke(255);
    strokeWeight(0.5);
    ellipse(0, 0, this.radius * 2);
    pop();
  }
}
