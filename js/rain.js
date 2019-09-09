let acceleration = 0.0098;
let nDrops = 1000;
let drops = [];
let song;
let button;
let amp;
let vol = 0;
let compressor;
let currentTime;
// let width = window.innerWidth;
// let height = window.innerHeight;

//////// Testing Tone.JS

// let player = new Tone.Player("../audio/Helios - Nothing It Can.mp3").toMaster();

// let analyser = player.createAnalyser();
// analyser.fftSize = 2048;
// let bufferLength = analyser.frequencyBinCount;
// let dataArray = new Uint8Array(bufferLength);
// analyser.getByteTimeDomainData(dataArray);

// let fft = new Tone.FFT(1024);
// player.connect(fft);
// fft.toMaster();
// //play as soon as the buffer is loaded
// player.autostart = true;

/////////////

function toggleSong() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

function preload() {
  song = loadSound("../audio/Helios - Nothing It Can.mp3");
  // bg = loadImage("../img/Water_Lilies.jpg");
  //   img = loadImage("http://placekitten.com/960/924");
}

function setup() {
  frameRate(30);
  createCanvas(window.innerWidth, window.innerHeight);
  button = createButton("toggle");
  button.mousePressed(toggleSong);
  // play music and get amp
  amp = new p5.Amplitude();
  compressor = new p5.Compressor();
  song.disconnect();
  compressor.process(song);
  song.play();

  // add rain lines
  for (i = 0; i < nDrops; i++) {
    drops.push(new Drop());
  }
}

// check if vol change more than 30%
function isChange(volLevel) {
  //   console.log(Math.abs(volLevel - vol) / vol);
  return Math.abs(volLevel - vol) / vol > 0.3;
}

function isRipple(volLevel, currentTime) {
  return Math.abs(volLevel - vol) / vol > 0.6 && currentTime > 60;
}

function draw() {
  clear();
  currentTime = song.currentTime();

  let volLevel = amp.getLevel();

  // trigger ripple
  if (isRipple(volLevel, currentTime)) {
    $("body").ripples("drop", random(width), random(height), 5, 0.2);
  }

  // console.log(volLevel);
  if (isChange(volLevel)) {
    nDrops = map(vol, 0, 1, 0, 1000);
    vol = volLevel;
  }
  //   console.log(vol);
  for (let i = 0; i < nDrops; i++) {
    drops[i].drawAndDrop();
  }
  // background fadeout
  if (currentTime > 30) {
    drawDot(random(width), random(height));
  }
}

// draw lines as raindrops
function Drop() {
  this.initX = function() {
    this.x = random() * width;
  };
  this.initY = function() {
    this.y = (-random() * height) / 3; // Initialise rain somewhat off the screen
  };

  this.initX();
  this.y = random() * height;

  this.length = random() * 20 + 10;
  this.speed = random();

  this.drawAndDrop = function() {
    this.draw();
    this.drop();
  };

  this.draw = function() {
    stroke("rgba(143, 219, 255, 0.8)");
    strokeWeight(4);
    line(this.x, this.y, this.x, this.y + this.length);
  };

  this.drop = function() {
    if (this.y < height) {
      this.y += this.speed;
      this.speed += acceleration;
    } else {
      this.speed = random();
      this.initY();
      this.initX();
    }
  };
}

/////////////////// background fadeout effect //////////////////

let backgroundCover = document.getElementById("bgCover");
backgroundCover.width = window.innerWidth * 2;
backgroundCover.height = window.innerHeight * 2;
backgroundCover.style.width = window.innerWidth + "px";
backgroundCover.style.height = window.innerHeight + "px";

let bgCanvas = backgroundCover.getContext("2d"),
  brushRadius = backgroundCover.width / 150;
bgCanvas.scale(2, 2);

img = new Image();
img.src = "../img/woman_son.jpg";
img.onload = function() {
  bgCanvas.imageSmoothingEnabled = false;
  bgCanvas.drawImage(img, 0, 0, window.innerWidth, window.innerHeight);
};

// make canvas disappear
function drawDot(mouseX, mouseY) {
  bgCanvas.beginPath();
  bgCanvas.arc(mouseX, mouseY, brushRadius, 0, 2 * Math.PI, true);
  bgCanvas.fillStyle = "#000";
  bgCanvas.globalCompositeOperation = "destination-out";
  bgCanvas.fill();
}

function getBrushPos(xRef, yRef) {
  // the clicking area
  const bgRect = backgroundCover.getBoundingClientRect();
  return {
    x: Math.floor(
      ((xRef - bgRect.left) / (bgRect.right - bgRect.left)) *
        backgroundCover.width
    ),
    y: Math.floor(
      ((yRef - bgRect.top) / (bgRect.bottom - bgRect.top)) *
        backgroundCover.height
    )
  };
}
