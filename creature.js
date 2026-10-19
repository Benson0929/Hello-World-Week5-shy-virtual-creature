
class Creature {

  constructor(x, y) {

    // Position
    this.x = x;
    this.y = y;

    // Body size
    this.size = 80;

    // Step 2: Breathing
    this.time = 0;
    this.breathSpeed = 0.025;
    this.breathAmount = 8;

    // Step 3: Organic shape
    this.noiseAmount = 8;
    this.noiseScale = 1.5;
    this.shapeSpeed = 0.3;

    // Step 4: Movement
    this.vx = 0.7;
    this.vy = 0.4;
    this.normalSpeed = Math.hypot(this.vx, this.vy);
    this.margin = 60;

    // Step 5: Environment awareness
    this.baseDetectionRadius = 150;
    this.detectionRadius = 150;
    this.distanceToMouse = Infinity;
    this.isNearby = false;

    // Step 6: Escape behavior
    this.escapeSpeed = 3;
    this.isEscaping = false;

    // Step 7: Fear
    this.fear = 0;
    this.fearIncrease = 0.8;
    this.fearRecovery = 0.25;

    // Step 8: Energy
    this.energy = 100;
    this.energyDrain = 0.18;
    this.energyRecovery = 0.08;
    this.minEscapeSpeed = 0.8;

    // Step 9: Visual feedback
    this.calmColor = color(140, 190, 220);
    this.scaredColor = color(230, 100, 140);

    // Step 10: Evolution
    this.sensitivity = 0;
    this.sensitivityIncrease = 10;
    this.sensitivityRecovery = 0.015;
    this.scareCount = 0;
    this.wasNearby = false;

    // Step 11A: Movement smoothing
    this.smoothing = 0.08;

  }

  update() {

    // Breathing speed depends on energy
    let currentBreathSpeed = map(
      this.energy,
      0, 100,
      0.008, this.breathSpeed
    );

    this.time += currentBreathSpeed;

    // Sense the environment
    this.senseEnvironment();

    // Update long-term state
    this.updateSensitivity();

    // Update fear
    this.updateFear();

    // Decide movement behavior
    if (this.isNearby) {

      this.escape();

    } else {

      this.isEscaping = false;
      this.restoreNormalSpeed();

    }

    // Update energy and position
    this.updateEnergy();
    this.move();

  }

  // Step 11A: Smoothly change velocity
  approachVelocity(targetVX, targetVY) {

    this.vx = lerp(
      this.vx,
      targetVX,
      this.smoothing
    );

    this.vy = lerp(
      this.vy,
      targetVY,
      this.smoothing
    );

  }

  updateSensitivity() {

    if (this.isNearby && !this.wasNearby) {

      this.scareCount += 1;

      this.sensitivity +=
        this.sensitivityIncrease;

    }

    if (!this.isNearby) {

      this.sensitivity -=
        this.sensitivityRecovery;

    }

    this.sensitivity = constrain(
      this.sensitivity,
      0,
      100
    );

    this.detectionRadius = map(
      this.sensitivity,
      0,
      100,
      this.baseDetectionRadius,
      this.baseDetectionRadius + 120
    );

    this.wasNearby = this.isNearby;

  }

  updateFear() {

    if (this.isNearby) {

      this.fear = min(
        100,
        this.fear + this.fearIncrease
      );

    } else {

      this.fear = max(
        0,
        this.fear - this.fearRecovery
      );

    }

  }

  updateEnergy() {

    if (this.isEscaping) {

      this.energy -= this.energyDrain;

    } else {

      this.energy += this.energyRecovery;

    }

    this.energy = constrain(
      this.energy,
      0,
      100
    );

  }

  move() {

    this.x += this.vx;
    this.y += this.vy;

    // Horizontal boundary
    if (
      this.x < this.margin ||
      this.x > width - this.margin
    ) {

      this.x = constrain(
        this.x,
        this.margin,
        width - this.margin
      );

      this.vx *= -1;

    }

    // Vertical boundary
    if (
      this.y < this.margin ||
      this.y > height - this.margin
    ) {

      this.y = constrain(
        this.y,
        this.margin,
        height - this.margin
      );

      this.vy *= -1;

    }

  }

  senseEnvironment() {

    let mouseInside =
      mouseX >= 0 &&
      mouseX <= width &&
      mouseY >= 0 &&
      mouseY <= height;

    if (mouseInside) {

      this.distanceToMouse = dist(
        this.x,
        this.y,
        mouseX,
        mouseY
      );

    } else {

      this.distanceToMouse = Infinity;

    }

    this.isNearby =
      mouseInside &&
      this.distanceToMouse < this.detectionRadius;

  }

  escape() {

    let dx = this.x - mouseX;
    let dy = this.y - mouseY;

    let distance = Math.hypot(dx, dy);

    let currentEscapeSpeed = map(
      this.energy,
      0,
      100,
      this.minEscapeSpeed,
      this.escapeSpeed
    );

    if (distance > 0.001) {

      let targetVX =
        (dx / distance) * currentEscapeSpeed;

      let targetVY =
        (dy / distance) * currentEscapeSpeed;

      // Step 11A: Smooth transition
      this.approachVelocity(
        targetVX,
        targetVY
      );

    }

    this.isEscaping = true;

  }

  restoreNormalSpeed() {

    let currentSpeed = Math.hypot(
      this.vx,
      this.vy
    );

    if (currentSpeed > 0.001) {

      let targetVX =
        (this.vx / currentSpeed) *
        this.normalSpeed;

      let targetVY =
        (this.vy / currentSpeed) *
        this.normalSpeed;

      // Step 11A: Smoothly slow down
      this.approachVelocity(
        targetVX,
        targetVY
      );

    } else {

      this.approachVelocity(
        this.normalSpeed,
        0
      );

    }

  }

  display() {

    push();

    translate(this.x, this.y);

    noStroke();

    // Fear controls body color
    let bodyColor = lerpColor(
      this.calmColor,
      this.scaredColor,
      this.fear / 100
    );

    fill(bodyColor);

    // Breathing
    let breathing =
      sin(this.time) * this.breathAmount;

    // Fear controls body size
    let currentRadius = lerp(
      this.size / 2,
      (this.size / 2) * 0.7,
      this.fear / 100
    );

    // Fear controls organic variation
    let currentNoiseAmount = lerp(
      this.noiseAmount,
      this.noiseAmount * 2.2,
      this.fear / 100
    );

    beginShape();

    for (
      let angle = 0;
      angle <= TWO_PI;
      angle += TWO_PI / 120
    ) {

      let noiseX =
        cos(angle) * this.noiseScale + 10;

      let noiseY =
        sin(angle) * this.noiseScale + 10;

      let variation = noise(
        noiseX,
        noiseY,
        this.time * this.shapeSpeed
      );

      variation = map(
        variation,
        0,
        1,
        -currentNoiseAmount,
        currentNoiseAmount
      );

      let radius =
        currentRadius +
        breathing +
        variation;

      let px = cos(angle) * radius;
      let py = sin(angle) * radius;

      vertex(px, py);

    }

    endShape(CLOSE);

    // Temporary sensing indicator
    noFill();

    stroke(
      this.isNearby
        ? color(255, 195, 110, 160)
        : color(140, 190, 220, 50)
    );

    strokeWeight(1);

    drawingContext.setLineDash([6, 7]);

    circle(
      0,
      0,
      this.detectionRadius * 2
    );

    drawingContext.setLineDash([]);

    pop();

  }

}
