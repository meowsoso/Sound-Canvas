let acceleration = 0.0098;
let nDrops = 500;
let drops = [];
let song;
let button;
let amp;
let vol = 0;
let pg;
// let width = window.innerWidth;
// let height = window.innerHeight;

function toggleSong() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

function preload() {
  song = loadSound("../audio/Helios - Nothing It Can.mp3");
  bg = loadImage("../img/Water_Lilies.jpg");
  //   img = loadImage("http://placekitten.com/960/924");
}

function setup() {
  createCanvas(960, 650);
  //   pg = createGraphics(960, 700);

  //   image(img, 0, 0);
  //   pond.id = "lilyPond";
  button = createButton("toggle");
  button.mousePressed(toggleSong);

  // play music and get amp
  song.play();
  amp = new p5.Amplitude();
  // add rain lines
  for (i = 0; i < nDrops; i++) {
    drops.push(new Drop());
  }
}

// check if vol change more than 20%
function isChange(volLevel) {
  //   console.log(Math.abs(volLevel - vol) / vol);
  return Math.abs(volLevel - vol) / vol > 0.4;
}

function draw() {
  clear();
  //   background(bg);
  let volLevel = amp.getLevel();
  if (isChange(volLevel)) {
    vol = volLevel;
    nDrops = map(vol, 0, 1, 0, 500);
  }
  //   console.log(vol);
  for (let i = 0; i < nDrops; i++) {
    drops[i].drawAndDrop();
  }

  // background fadeout
  drawDot(random(width), random(height));
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
    stroke(155, 50, 255);
    strokeWeight(3);
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

let backgroundCover = document.getElementById("bgCover"),
  bgCanvas = backgroundCover.getContext("2d"),
  brushRadius = backgroundCover.width / 50,
  img = new Image();
console.log(bgCanvas);

img.src = "../img/woman_son.jpg";
img.onload = function() {
  bgCanvas.imageSmoothingEnabled = false;
  bgCanvas.drawImage(img, 0, 0, backgroundCover.width, backgroundCover.height);
  console.log(window.devicePixelRatio);
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
backgroundCover.addEventListener("click", function(e) {
  e.preventDefault();
  console.log("clicked");
  const brushPos = getBrushPos(e.clientX, e.clientY);
  drawDot(brushPos.x, brushPos.y);
});
