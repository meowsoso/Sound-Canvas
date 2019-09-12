let acceleration = 0.0098;
let nDrops = 1000;
let drops = [];
let song;
let button;
let amp;
let vol = 0;
let compressor;
let currentTime;
let flowerReady = true
let canvasWidth = window.innerWidth *0.5;
let canvasHeight = window.innerHeight *0.8;
$('div.pedal').hide()
$('div.pedal2').hide()
$('div.songInfo').hide()

function toggleSong() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
    $('div#monet').fadeOut(5000);
    $('div.songInfo').fadeIn(10000);
  }
}

function preload() {
  song = loadSound("../audio/Helios - Nothing It Can.mp3");

}

function setup() {
  frameRate(30);
  const p5Canvas = createCanvas(canvasWidth, canvasHeight);
  p5Canvas.parent('lilyPond');
  p5Canvas.style('position', 'absolute');
  p5Canvas.style('top', '0');
  p5Canvas.style('border', '5px solid rgba(34, 19, 2, 0.8)');
  
  pondSize()

  button = createButton("Toggle");
  button.mousePressed(toggleSong);
  // play music and get amp
  amp = new p5.Amplitude();
  compressor = new p5.Compressor();
  song.disconnect();
  compressor.process(song);

  // add rain lines
  for (i = 0; i < nDrops; i++) {
    drops.push(new Drop());
  }
}

function draw() {
  clear();
  currentTime = song.currentTime();
  let volLevel = amp.getLevel();

  // trigger ripple
  if (isRipple(volLevel, currentTime)) {
    $("div#lilyPond").ripples("drop", random(width), random(height), 5, 0.2);
  }
  // trigger flower effect
  if (flowerReady === true && currentTime > 60) {
    flowerFly();
    flowerReady = false;
  }
 
// control flower and rain
  if (isChange(volLevel) && currentTime < 270) {
    if (currentTime > 75) {
      nDrops = map(vol, 0, 1, 0, 1000);
    } else if (currentTime > 23 && currentTime < 60 ) {
      createFlower(fadeInEffect);
    } 
    vol = volLevel;
  }
  //   call rain;
  if (currentTime > 78) {
    for (let i = 0; i < nDrops; i++) {
      drops[i].drawAndDrop();
    }
  }
  // background fadeout
  if (currentTime > 100) {
    drawDot(random(width), random(height));
  }



  if (currentTime > 70) {
    $('div#garden').fadeOut(8000);
  }

  if (currentTime > 274) {
    $('div#monet').fadeIn(6000);
  }
}



// adjust lilypond size
function pondSize() {
  $('div.lilyPond').css('width', canvasWidth+"px").css('height', canvasHeight, canvasHeight+"px").css('top', '0');
}

// check if vol change more than 30%
function isChange(volLevel) {
  //   console.log(Math.abs(volLevel - vol) / vol);

  return Math.abs(volLevel - vol) / vol > 0.35;
}



function isRipple(volLevel, currentTime) {
  if (currentTime > 240) {
    return Math.abs(volLevel - vol) / vol > 0.6 
  } else if (currentTime > 160)
  return Math.abs(volLevel - vol) / vol > 0.3;
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
    stroke("rgba(143, 219, 255, 0.4)");
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
backgroundCover.width = canvasWidth * 2;
backgroundCover.height = canvasHeight * 2;
backgroundCover.style.width = canvasWidth + "px";
backgroundCover.style.height = canvasHeight + "px";

let bgCanvas = backgroundCover.getContext("2d"),
  brushRadius;
backgroundCover.width / (Math.floor(Math.random() * (+160 - +140)) + +140);
bgCanvas.scale(2, 2);

img = new Image();
img.src = "../img/2048px-Claude_Monet_-_Woman_with_a_Parasol_-_Madame_Monet_and_Her_Son_-_Google_Art_Project.jpg";
img.onload = function() {
  bgCanvas.imageSmoothingEnabled = false;
  bgCanvas.drawImage(img, 0, 0, canvasWidth, canvasHeight);
};

// make canvas disappear
function drawDot(mouseX, mouseY) {
  brushRadius =
    backgroundCover.width / (Math.floor(Math.random() * (40)) + +90);
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

// create new flower
function createFlower(callback) {
  let flower;
  if (random() > 0.5) {
    flower = "div.pedal2"
  } else {
    flower = "div.pedal"
  }
  $(flower).first()
      .clone()
      // .removeClass("pedal")
      .css(
        "left", random(window.innerWidth))
      .css(
        "top", random(window.innerHeight * 0.5, window.innerHeight))
      .appendTo("body")
      callback()
 }
    
  function fadeInEffect() {
    $("div.pedal").last().fadeIn(3000);
    $("div.pedal2").last().fadeIn(3000);
  }

// flower flies
function flowerFly() {
  anime(
    {
      // targets: `div.${volLevel}`,
      targets: ["div.pedal", "div.pedal2"],
      translateX: -2000,
      translateY: -800,
      rotate: 360,
      loop: false,
      easing: "easeInOutQuad",
      duration: 15000,
      delay: anime.stagger(300)
    });
}
