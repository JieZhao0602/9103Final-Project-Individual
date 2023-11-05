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