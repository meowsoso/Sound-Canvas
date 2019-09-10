const tentacles = [];
let tick = 0;
function createTentacles() {
  // TODO: make it dynamic with params
  tentacles.push({
    numSegments: 18,
    x: [],
    y: [],
    angle: [],
    segLength: 15,
    targetX: null,
    targetY: null
  });

  for (let i = 0; i < tentacles[0].numSegments; i++) {
    tentacles[0].x[i] = 0;
    tentacles[0].y[i] = 0;
    tentacles[0].angle[i] = 0;
  }
}

function preload() {}

function setup() {
  frameRate(30);
  createCanvas(710, 400);
  strokeWeight(25);
  stroke("white");
  createTentacles();
  let tentacle = tentacles[0];
  tentacle.x[tentacle.x.length - 1] = width / 2;
  tentacle.y[tentacle.x.length - 1] = height;
}

function draw() {
  background(0);
  tick += 0.05;

  let scale = 2 / (3 - cos(2 * tick));
  let pointX = scale * cos(tick) * 120 + width * 0.5;
  let pointY = ((scale * sin(2 * tick)) / 2) * 60 + height * 0.45;
  //   let pointX = cos(tick) * 55 + width * 0.5;
  //   let pointY = (sin(2 * tick) * 20) / 2 + height * 0.35;
  console.log(pointX, pointY);
  reachSegment(0, pointX, pointY);

  let tentacle = tentacles[0];
  for (let i = 1; i < tentacle.numSegments; i++) {
    reachSegment(i, tentacle.targetX, tentacle.targetY);
  }
  for (let j = tentacle.x.length - 1; j >= 1; j--) {
    positionSegment(j, j - 1);
  }
  for (let k = 0; k < tentacle.x.length; k++) {
    segment(tentacle.x[k], tentacle.y[k], tentacle.angle[k], (k + 5) * 2);
  }
}

function positionSegment(a, b) {
  let tentacle = tentacles[0];
  tentacle.x[b] = tentacle.x[a] + cos(tentacle.angle[a]) * tentacle.segLength;
  tentacle.y[b] = tentacle.y[a] + sin(tentacle.angle[a]) * tentacle.segLength;
}

function reachSegment(i, xin, yin) {
  let tentacle = tentacles[0];
  const dx = xin - tentacle.x[i];
  const dy = yin - tentacle.y[i];
  tentacle.angle[i] = atan2(dy, dx);
  tentacle.targetX = xin - cos(tentacle.angle[i]) * tentacle.segLength;
  tentacle.targetY = yin - sin(tentacle.angle[i]) * tentacle.segLength;
}

function segment(x, y, a, sw) {
  strokeWeight(sw);
  push();
  translate(x, y);
  rotate(a);
  line(0, 0, tentacles[0].segLength, 0);
  pop();
}
