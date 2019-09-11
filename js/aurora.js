"use strict";

////////// P5 ///////////

// TODO: put in util
$("div.starryNight").hide();
let song;
let button;
let amp;
let vol = 0;
let compressor;
let currentTime;
let fft;
let spectrum;
// TODO: put in object  For shooting stars
let stars = [];

const swirlParams = {
  particleCount: 1024,
  particlePropCount: 9,
  particlePropsLength: 9216,
  rangeY: 100,
  baseTTL: 100,
  rangeTTL: 100,
  baseSpeed: 0.2,
  rangeSpeed: 2,
  baseRadius: 1,
  rangeRadius: 5,
  baseHue: 200,
  rangeHue: 50,
  noiseSteps: 12,
  xOff: 0.00125,
  yOff: 0.00125,
  zOff: 0.0005,
  backgroundColor: "hsla(260,40%,5%,1)"
};

function toggleSong() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

function preload() {
  song = loadSound("../audio/JoannaWang_Vincent.mp3");
}

function setup() {
  frameRate(30);
  createNewCanvas();
  resize();
  initRays();
  // set up swirl particle
  initParticles();
  // set up stars
  initStars();

  let p5Canvas = createCanvas(window.innerWidth, window.innerHeight);
  p5Canvas.id("fallingStar");
  p5Canvas.style("z-index", "9999");
  p5Canvas.style("visibility", "visible");
  // add stars to array

  button = createButton("toggle");
  button.mousePressed(toggleSong);

  amp = new p5.Amplitude(0.8);
  compressor = new p5.Compressor();
  song.disconnect();
  compressor.process(song);
  fft = new p5.FFT(0.8, 512);
  song.play();
}

function draw() {
  currentTime = song.currentTime();
  let volLevel = amp.getLevel();

  // clear();
  if (currentTime > 95) {
    $("div.riverNight").fadeOut(10000);
    $("div.starryNight").fadeIn(13000);
  }

  spectrum = fft.analyze();
  if (currentTime < 105) {
    drawAurora();
  } else {
    if (isChange(volLevel) && currentTime > 146) {
      shootStar();
      vol = volLevel;
    }
    drawSwirl();
  }
}

// check if vol change more than 30%
function isChange(volLevel) {
  //   console.log(Math.abs(volLevel - vol) / vol);
  return Math.abs(volLevel - vol) / vol > 0.65;
}

// init stars
function initStars() {
  for (let i = 0; i < 10; i++) {
    stars.push({
      beginX: 0,
      beginY: 0,
      endX: 0,
      endY: 0,
      distX: 0,
      distY: 0,
      exponent: 2,
      currentX: 0.0,
      currentY: 0.0,
      step: 0.03,
      pct: 0,
      color: "rgba(255, 255, 255, 0)",
      moving: false,
      history: []
    });
  }
}
////////// trigger shooting star
function shootStar() {
  let selectedStar;
  for (let i = 0; i < stars.length; i++) {
    if (!stars[i].moving) {
      selectedStar = stars[i];
      selectedStar.moving = true;
      selectedStar.pct = 0.0;
      selectedStar.beginX = random(width * 0.6, width);
      selectedStar.beginY = random(0, height * 0.2);
      selectedStar.currentX = selectedStar.beginX;
      selectedStar.currentY = selectedStar.beginY;
      selectedStar.endX = random(0, width * 0.3);
      selectedStar.endY = random(height * 0.75, height * 0.9);
      selectedStar.distX = selectedStar.endX - selectedStar.beginX;
      selectedStar.distY = selectedStar.endY - selectedStar.beginY;
      selectedStar.color = `rgba(${int(random(255))},${int(random(255))},${int(
        random(255)
      )}, 1 )`;
      selectedStar.history = [];
      break;
    }
  }
}

function starAnimation() {
  for (let i = 0; i < stars.length; i++) {
    if (stars[i].currentY >= height * 0.7) {
      stars[i].moving = false;
    }
    if (stars[i].moving === true) {
      let star = stars[i];
      star.pct += star.step;
      let vector = createVector(star.currentX, star.currentY);
      star.history.push(vector);
      if (star.history.length > 2) {
        star.history.splice(0, 1);
      }

      if (star.pct < 1.0) {
        star.currentX = star.beginX + star.pct * star.distX;
        star.currentY = star.beginY + pow(star.pct, star.exponent) * star.distY;
      }
      // fill(star.color);
      // ellipse(star.currentX, star.currentY, 10, 10);

      // draw trail
      // noFill();
      // beginShape();
      // stroke(star.color);
      // strokeWeight(3);
      // for (let i = 0; i < star.history.length; i++) {
      //   let pos = star.history[i];
      //   vertex(pos.x, pos.y);
      // }
      // endShape();
      ctx.a.save();
      ctx.a.beginPath();
      ctx.a.strokeStyle = star.color;
      ctx.a.moveTo(star.currentX, star.currentY);
      ctx.a.lineWidth = 3;
      for (let i = 0; i < star.history.length; i++) {
        let pos = star.history[i];
        ctx.a.lineTo(pos.x, pos.y);
      }
      ctx.a.stroke();
      ctx.a.closePath();
      ctx.a.restore();
    }
  }
}

//////// aurora animation //////////
let rayCount = 512;
const rayPropCount = 8;
const rayPropsLength = rayCount * rayPropCount;
const baseLength = 150;
const rangeLength = 150;
// const baseSpeed = 0.05;
const baseSpeed = 0.1;
const rangeSpeed = 0.1;
const baseWidth = 5;
const rangeWidth = 10;
const baseHue = 182;
const rangeHue = 40;
const baseTTL = 50;
const rangeTTL = 50;
// const noiseStrength = 100;
const noiseStrength = 120;
const xOff = 0.0015;
const yOff = 0.0015;
const zOff = 0.0015;
// const backgroundColor = "hsla(220,44%,12%,0.8)";
const backgroundColor = "hsla(260,40%,5%,1)";

let container;
let canvas;
let ctx;
let center;
let tick;
let simplex;
let rayProps;

// swirl part :
let tickSwirl;
let gradient;
let particleProps;
let positions;
let velocities;
let lifeSpans;
let speeds;
let sizes;
let hues;

function initRays() {
  tick = 0;
  simplex = new SimplexNoise();
  rayProps = new Float32Array(rayPropsLength);

  let i;

  for (i = 0; i < rayPropsLength; i += rayPropCount) {
    initRay(i);
  }
}

function initRay(i) {
  let length, x, y1, y2, n, life, ttl, width, speed, hue;

  length = baseLength + rand(rangeLength);
  x = rand(canvas.a.width);
  y1 = center[1] + noiseStrength - length;
  y2 = center[1] + noiseStrength - length * 2;
  n = simplex.noise3D(x * xOff, y1 * yOff, tick * zOff) * noiseStrength;
  y1 += n;
  y2 += n;
  life = 0;
  ttl = baseTTL + rand(rangeTTL);
  width = baseWidth + rand(rangeWidth);
  speed = baseSpeed + rand(rangeSpeed) * (round(rand(1)) ? 1 : -1);
  hue = baseHue + rand(rangeHue);

  rayProps.set([x, y1, y2, life, ttl, width, speed, hue], i);
}

function drawRays() {
  let i;

  for (i = 0; i < rayPropsLength; i += rayPropCount) {
    updateRay(i);
  }
}

function updateRay(i) {
  let i2 = 1 + i,
    i3 = 2 + i,
    i4 = 3 + i,
    i5 = 4 + i,
    i6 = 5 + i,
    i7 = 6 + i,
    i8 = 7 + i;
  // value 0-255
  let x, y1, y2, life, ttl, width, speed, hue;

  let fftValue = spectrum[i / 8];

  x = rayProps[i];
  y1 = rayProps[i2];
  y2 = rayProps[i3];
  life = rayProps[i4];
  ttl = rayProps[i5];
  width = rayProps[i6];
  speed = rayProps[i7];
  // get color with fft
  if (fftValue > 100) {
    fftValue -= 100;
    fftValue = map(fftValue, 0, 155, 0, 360);
    hue = fftValue || rayProps[i8];
    drawRay(x, y1, y2, life, ttl, width, hue);
  }

  x += speed;
  life++;

  rayProps[i] = x;
  rayProps[i4] = life;

  (checkBounds(x) || life > ttl) && initRay(i);
}

function drawRay(x, y1, y2, life, ttl, width, hue) {
  let gradient;

  gradient = ctx.a.createLinearGradient(x, y1, x, y2);
  gradient.addColorStop(0, `hsla(${hue},100%,65%,0)`);
  gradient.addColorStop(0.5, `hsla(${hue},100%,65%,${fadeInOut(life, ttl)})`);
  gradient.addColorStop(1, `hsla(${hue},100%,65%,0)`);

  ctx.a.save();
  ctx.a.beginPath();
  ctx.a.strokeStyle = gradient;
  ctx.a.lineWidth = width;
  ctx.a.moveTo(x, y1);
  ctx.a.lineTo(x, y2);
  ctx.a.stroke();
  ctx.a.closePath();
  ctx.a.restore();
}

function checkBounds(x) {
  return x < 0 || x > canvas.a.width;
}

function createNewCanvas() {
  container = document.querySelector(".content--canvas");
  canvas = {
    a: document.createElement("canvas"),
    b: document.createElement("canvas")
  };
  canvas.b.style = `
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	`;
  container.appendChild(canvas.b);
  ctx = {
    a: canvas.a.getContext("2d"),
    b: canvas.b.getContext("2d")
  };
  center = [];
}

function resize() {
  const { innerWidth, innerHeight } = window;

  canvas.a.width = innerWidth;
  canvas.a.height = innerHeight;

  ctx.a.drawImage(canvas.b, 0, 0);

  canvas.b.width = innerWidth;
  canvas.b.height = innerHeight;

  ctx.b.drawImage(canvas.a, 0, 0);

  center[0] = 0.5 * canvas.a.width;
  center[1] = 0.5 * canvas.a.height;
}

function render() {
  ctx.b.save();
  ctx.b.filter = "blur(10px)";
  ctx.a.globalCompositeOperation = "lighter";
  ctx.b.drawImage(canvas.a, 0, 0);
  ctx.b.restore();
}

const drawAurora = function() {
  tick++;
  ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height);
  ctx.b.fillStyle = backgroundColor;
  ctx.b.fillRect(0, 0, canvas.b.width, canvas.a.height);
  drawRays();
  // starAnimation();
  render();
};

//////////////////////// Swirl effect /////////////////////////

function initParticles() {
  tickSwirl = 0;
  simplex = new SimplexNoise();
  particleProps = new Float32Array(swirlParams.particlePropsLength);

  for (
    let i = 0;
    i < swirlParams.particlePropsLength;
    i += swirlParams.particlePropCount
  ) {
    initParticle(i);
  }
}

function initParticle(i) {
  let x, y, vx, vy, life, ttl, speed, radius, hue;

  x = rand(canvas.a.width); // changes start point of x
  y = center[1] + randRange(swirlParams.rangeY) - height * 0.25; // changes start point of y
  vx = 0;
  vy = 0;
  life = 0;
  ttl = swirlParams.baseTTL + rand(swirlParams.rangeTTL);
  speed = swirlParams.baseSpeed * 10 + rand(swirlParams.rangeSpeed);
  radius = swirlParams.baseRadius * 2 + rand(swirlParams.rangeRadius);
  hue = swirlParams.baseHue + rand(swirlParams.rangeHue);

  particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
}

function drawParticles() {
  for (
    let i = 0;
    i < swirlParams.particlePropsLength;
    i += swirlParams.particlePropCount
  ) {
    updateParticle(i);
  }
}

function updateParticle(i) {
  let i2 = 1 + i,
    i3 = 2 + i,
    i4 = 3 + i,
    i5 = 4 + i,
    i6 = 5 + i,
    i7 = 6 + i,
    i8 = 7 + i,
    i9 = 8 + i;
  let n, x, y, vx, vy, life, ttl, speed, x2, y2, radius, hue;

  let index = Math.floor(i / 9 / 2);
  let fftValue = spectrum[index];
  if (fftValue) {
    fftValue = map(fftValue, 0, 255, 0, 360);
  }

  x = particleProps[i];
  y = particleProps[i2];
  n =
    simplex.noise3D(
      x * swirlParams.xOff,
      y * swirlParams.yOff,
      tickSwirl * swirlParams.zOff
    ) *
    swirlParams.noiseSteps *
    TAU;
  vx = lerp(particleProps[i3], cos(n), 0.5);
  vy = lerp(particleProps[i4], sin(n), 0.5);
  life = particleProps[i5];
  ttl = particleProps[i6];
  speed = particleProps[i7];
  x2 = x + vx * speed;
  y2 = y + vy * speed;
  radius = particleProps[i8];
  // hue = particleProps[i9];
  hue = fftValue || particleProps[i9];

  drawParticle(x, y, x2, y2, life, ttl, radius, hue);

  life++;

  particleProps[i] = x2;
  particleProps[i2] = y2;
  particleProps[i3] = vx;
  particleProps[i4] = vy;
  particleProps[i5] = life;

  (checkBounds(x, y) || life > ttl) && initParticle(i);
}

function drawParticle(x, y, x2, y2, life, ttl, radius, hue) {
  ctx.a.save();
  ctx.a.lineCap = "round";
  ctx.a.lineWidth = radius;
  ctx.a.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
  ctx.a.beginPath();
  ctx.a.moveTo(x, y);
  ctx.a.lineTo(x2, y2);
  ctx.a.stroke();
  ctx.a.closePath();
  ctx.a.restore();
}

function renderSwirlGlow() {
  ctx.b.save();
  ctx.b.filter = "blur(8px) brightness(200%)";
  ctx.b.globalCompositeOperation = "lighter";
  ctx.b.drawImage(canvas.a, 0, 0);
  ctx.b.restore();

  ctx.b.save();
  ctx.b.filter = "blur(4px) brightness(200%)";
  ctx.b.globalCompositeOperation = "lighter";
  ctx.b.drawImage(canvas.a, 0, 0);
  ctx.b.restore();
}

function renderSwirlScreen() {
  ctx.b.save();
  ctx.b.globalCompositeOperation = "lighter";
  ctx.b.drawImage(canvas.a, 0, 0);
  ctx.b.restore();
}

function drawSwirl() {
  tickSwirl++;

  ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height);

  ctx.b.fillStyle = backgroundColor;
  ctx.b.fillRect(0, 0, canvas.a.width, canvas.a.height);

  drawParticles();
  starAnimation();
  renderSwirlGlow();
  renderSwirlScreen();
}
