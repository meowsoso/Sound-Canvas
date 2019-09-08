var canvas,
  bgColor,
  radialArcs = [],
  fft,
  soundFile,
  soundSpectrum;

function setup() {
  colorMode(HSB, 360, 100, 100); // set colour mode of sketch to HSB (360 degress, 100%, 100%)
  frameRate(60); // set framerate
  canvas = createCanvas(windowWidth, windowHeight); // create canvas
  canvas.drop(gotFile); // listen for file drop onto canvas
  bgColor = color(330, 0, 5); // set BG colour in HSB
  background(bgColor); // draw bg
  initRadialArcs(); // setup radial arc objects
  textAlign(CENTER); // welcome text
  fill(0, 0, 90);
  text(
    "Drop MP3 here, then click canvas to play when uploaded.",
    width / 2,
    height / 2
  );
}

function gotFile(file) {
  if (!soundFile && file.type == "audio") {
    // if don't already have sound && is audio
    background(bgColor);
    soundFile = new p5.SoundFile(file.data); // create soundFile from dropped audio file
    initSound(); // init sound & FFT
    canvas.mouseClicked(togglePlay); // listen for mouse click to play sound
  }
}

function draw() {
  if (soundFile) {
    background(bgColor);
    analyseSound();
    updateRadialArcs();
    drawRadialArcs();
  }
}

function initRadialArcs() {
  // pass settings into constructor (arcs,minRadius,maxRadius,baseline angle,maxStrokeWidth,minHue,maxHue)
  radialArcs[0] = new RadialArcs(40, height / 4, width, 0, 3, 330, 360); // bass
  radialArcs[1] = new RadialArcs(
    60,
    height / 12,
    height,
    -HALF_PI,
    1.5,
    300,
    330
  ); // treb
}

function updateRadialArcs() {
  if (soundFile.isPlaying()) {
    radialArcs[0].updateArcs(getNewSoundDataValue("bass")); // bass
    radialArcs[1].updateArcs(getNewSoundDataValue("treble")); // treb
  }
}

function drawRadialArcs() {
  radialArcs[0].drawArcs(); // bass
  radialArcs[1].drawArcs(); // treb
}

class RadialArcs {
  // -------------------------   RadialArcs Class -------------------------------
  constructor(arcCount, minR, maxR, baseR, maxStr, minH, maxH) {
    this.radialArcCount = arcCount;
    this.minRadius = minR;
    this.maxRadius = maxR;
    this.radialArcs = [];
    this.baselineR = baseR;
    this.maxStroke = maxStr;
    this.minHue = minH;
    this.maxHue = maxH;
    this.initArcs();
  }

  initArcs() {
    for (let a = 0; a < this.radialArcCount; a++) {
      // create a new radialArc object x radialArcCount
      // pass vals into constructor (id,arcs,minRadius,maxRadius,cX, cY, baseline angle)
      this.radialArcs[a] = new RadialArc(
        a,
        this.radialArcCount,
        this.minRadius,
        this.maxRadius,
        this.baselineR,
        this.maxStroke,
        this.minHue,
        this.maxHue
      );
    }
  }

  updateArcs(d) {
    for (let a = this.radialArcs.length - 1; a >= 0; a--) {
      // work backwards down array of arcs,
      if (a > 0) {
        this.radialArcs[a].setValue(this.radialArcs[a - 1].getValue()); // taking value from arc in position ahead in array, so shifting values up the array of arcs by one.
      } else {
        this.radialArcs[a].setValue(d); // until last arc, update with new value from data
      }
    }
  }

  drawArcs() {
    for (let a = 0; a < this.radialArcs.length; a++) {
      // loop through array of arcs calling "draw"
      this.radialArcs[a].redrawFromData();
    }
  }
}

class RadialArc {
  // -------------------------   RadialArc Class -------------------------------
  constructor(id, arcs, minR, maxR, baseR, maxStr, minH, maxH) {
    this.arcID = id;
    this.totalArcs = arcs;
    this.minRadius = minR; // min size of arc
    this.maxRadius = maxR; // max size of arc
    this.arcRadius =
      this.minRadius +
      (((this.maxRadius - this.minRadius) / this.totalArcs) * this.arcID + 1); // size of THIS arc based on position in arcs
    this.maxStroke = maxStr;
    this.minHue = minH;
    this.maxHue = maxH;
    this.dataVal = 0;
    this.centerX = width / 2;
    this.centerY = height / 2;
    this.arcMaxRadian = QUARTER_PI; // max length of arc around circumference
    this.arcBaseline = baseR;
    this.arcStartRadian = 0; // starting radian of arc
    this.arcEndRadian = 0; // end radian of this arc (based on data)
  }

  setValue(d) {
    this.dataVal = d;
  }

  getValue() {
    return this.dataVal;
  }

  redrawFromData() {
    this.updateArc();
    this.drawArc();
  }

  updateArc() {
    this.arcEndRadian = this.arcBaseline + this.arcMaxRadian * this.dataVal; // start of arc (radians) based on data
    this.arcStartRadian = this.arcBaseline - this.arcMaxRadian * this.dataVal; // end of arc (radians) based on data
  }

  drawArc() {
    this.dataColor = this.getDataHSBColor(this.dataVal); // get data scaled colour
    stroke(this.dataColor); // set stroke colour
    strokeWeight(map(this.dataVal, 0, 1, 0, this.maxStroke)); // set stroke weight based on data
    noFill(); // no fill in arc shape
    arc(
      this.centerX,
      this.centerY,
      this.arcRadius,
      this.arcRadius,
      this.arcStartRadian,
      this.arcEndRadian
    ); // draw arc
    arc(
      this.centerX,
      this.centerY,
      this.arcRadius,
      this.arcRadius,
      this.arcStartRadian - PI,
      this.arcEndRadian - PI
    ); // draw reflected arc
  }

  getDataHSBColor(d) {
    this.dataHue = map(d, 0, 1, this.minHue, this.maxHue); // value moves across inout hue range
    this.dataSaturation = map(d, 0, 1, 100, 80); // higher value = lower saturation (more white, when combined with brightness)
    this.dataBrightness = map(d, 0, 1, 10, 100); // higher value = higher brightness (more white, when combined with saturation)
    return color(this.dataHue, this.dataSaturation, this.dataBrightness);
  }
}

// -------------------------  Sound Stuff -------------------------------
function getNewSoundDataValue(freqType) {
  return map(fft.getEnergy(freqType), 0, 255, 0, 1); // get energy from frequency, scaled from 0 to 1
}

function initSound() {
  fft = new p5.FFT(0.4, 1024); // (smoothing, bins)
  soundFile.amp(0.7);
}

function togglePlay() {
  if (soundFile.isPlaying()) {
    soundFile.pause();
  } else {
    soundFile.loop();
  }
}

function analyseSound() {
  soundSpectrum = fft.analyze(); // spectrum is array of amplitudes of each frequency
}
