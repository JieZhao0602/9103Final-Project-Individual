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

      let noiseVal = noise(x * 0.01, y * 0.01);
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
