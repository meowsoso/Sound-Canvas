////////// P5 ///////////

// TODO: put in util

let song;
let button;
let amp;
let vol = 0;
let compressor;
let currentTime;

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
  createCanvas(200, 200);
  button = createButton("toggle");
  button.mousePressed(toggleSong);

  amp = new p5.Amplitude();
  compressor = new p5.Compressor();
  song.disconnect();
  compressor.process(song);
  song.play();
}

// check if vol change more than 30%
function isChange(volLevel) {
  //   console.log(Math.abs(volLevel - vol) / vol);
  return Math.abs(volLevel - vol) / vol > 0.3;
}

function draw() {
  currentTime = song.currentTime();
  console.log(currentTime);

  let volLevel = amp.getLevel();

  // trigger if there is change in vol
  if (isChange(volLevel)) {
    rayCount = map(vol, 0, 1, 0, rayCount);
    vol = volLevel;
  }
}
