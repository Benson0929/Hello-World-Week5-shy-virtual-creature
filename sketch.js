
let creature;

function setup() {

  let canvas = createCanvas(800, 500);

  canvas.parent("canvas-container");

  creature = new Creature(
    width / 2,
    height / 2
  );

}

function draw() {

  background(24, 26, 32);

  creature.update();
  creature.display();

  displayStatus();

}

function displayStatus() {

  noStroke();
  fill(200);
  textSize(14);
  textAlign(LEFT);

  // Detection
  text(
    "STATUS: " +
    (creature.isNearby ? "NEARBY" : "SAFE"),
    20,
    30
  );

  // Fear
  text(
    "FEAR: " + floor(creature.fear),
    20,
    55
  );

  let emotion;

  if (creature.fear < 30) {
    emotion = "CALM";
  } else if (creature.fear < 70) {
    emotion = "NERVOUS";
  } else {
    emotion = "SCARED";
  }

  text("EMOTION: " + emotion, 20, 80);

  // Energy
  text(
    "ENERGY: " + floor(creature.energy),
    20,
    105
  );

  let energyState;

  if (creature.energy < 30) {
    energyState = "EXHAUSTED";
  } else if (creature.energy < 70) {
    energyState = "TIRED";
  } else {
    energyState = "ENERGETIC";
  }

  text(
    "ENERGY STATE: " + energyState,
    20,
    130
  );

  // Step 10: Evolution status
  text(
    "SENSITIVITY: " +
    creature.sensitivity.toFixed(1),
    20,
    155
  );

  text(
    "SCARE COUNT: " + creature.scareCount,
    20,
    180
  );

  text(
    "DETECTION RADIUS: " +
    floor(creature.detectionRadius),
    20,
    205
  );

}
