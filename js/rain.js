let acceleration = 0.0098;
let nDrops = 400;
let drops = [];
let song;
let button;
let amp;
let vol = 0;

function toggleSong() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

function preload() {
  song = loadSound("../audio/Helios - Nothing It Can.mp3");
}

function setup() {
  createCanvas(640, 480);
  button = createButton("toggle");
  button.mousePressed(toggleSong);
  song.play();
  amp = new p5.Amplitude();
  for (i = 0; i < nDrops; i++) {
    drops.push(new Drop());
  }
}

// check if vol change more than 20%
function isChange(volLevel) {
  console.log(Math.abs(volLevel - vol) / vol);
  return Math.abs(volLevel - vol) / vol > 0.4;
}

function draw() {
  clear();
  let volLevel = amp.getLevel();
  if (isChange(volLevel)) {
    vol = volLevel;
    nDrops = map(vol, 0, 1, 0, 300);
  }
  //   console.log(vol);
  for (let i = 0; i < nDrops; i++) {
    drops[i].drawAndDrop();
  }
}

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
