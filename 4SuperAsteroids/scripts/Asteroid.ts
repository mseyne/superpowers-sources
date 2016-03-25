class AsteroidBehavior extends Sup.Behavior {
  // The size of the asteroid
  size: number;
  // The amplitude of this asteroid Actor
  amplitude: number;
  // The class of size this asteroid belong
  sizeClass: string;
  // The position of the asteroid
  position: Sup.Math.Vector3;
  // The movement of the asteroid
  velocity: Sup.Math.Vector3;
  // The movement of the asteroid on x axis
  linearSpeedX: number;
  // The movement of the asteroid on y axis
  linearSpeedY: number;
  // The rotation speed of the asteroid
  rotationSpeed: number;
  // Timer before destruction
  deathTimer: number;

   awake() {
    // Increase asteroids count by one
    Asteroids.currentCount++;
    // Add this actor to the Asteroids list
    Asteroids.list.push(this.actor);
  }
  
  start() {
    // Get the position of the actor set randomly when spawned
    this.position = this.actor.getLocalPosition();
    // Get random value for linear speed on axis X and axis Y
    this.linearSpeedX = Sup.Math.Random.float(Asteroids.linearSpeed.min, Asteroids.linearSpeed.max);
    this.linearSpeedY = Sup.Math.Random.float(Asteroids.linearSpeed.min, Asteroids.linearSpeed.max);
    // Set asteroid velocity with the linearSpeed values
    this.velocity = new Sup.Math.Vector3(this.linearSpeedX, this.linearSpeedY, 0);
    // Get random value for linear speed on axis X and axis Y
    this.rotationSpeed = Sup.Math.Random.float(Asteroids.rotationSpeed.min, Asteroids.rotationSpeed.max);
    // Set the asteroid size related to the classSize of the asteroid
    this.size = Asteroids.sizes[this.sizeClass];
    // Set the asteroid collision amplitude related to the classSize of the asteroid
    this.amplitude = Asteroids.amplitudes[this.sizeClass];
    // Set the size to the actor model
    this.actor.getChild("Model").setLocalScale(this.size);
    // Set the size to the destruction sprite
    this.actor.getChild("Destruction").setLocalScale(this.size * 2);
  }

  die() {
    Sup.Audio.playSound('Sounds/explosion');
    // Reset angles to default for the explosion sprite
    this.actor.setEulerAngles(0,0,0);
    // Set visible off the asteroid model
    this.actor.getChild("Model").setVisible(false);
    // Set the sprite animation explode to play once without looping
    this.actor.getChild('Destruction').spriteRenderer.setAnimation("explode", false);
    // Give 30 frames before actor destruction (half a second)
    this.deathTimer = 30;
    // We give the points to ship1 related to the classSize of this asteroid
    if(this.sizeClass === "big") {
        Game.addPoints(true, Game.points.asteroidBig);
      }
      else if (this.sizeClass === "medium") {
        Game.addPoints(true, Game.points.asteroidMedium);
      }
      else {
        Game.addPoints(true, Game.points.asteroidSmall);
      }
    // Flag the game to check and update the HUD score
    Game.checkScoreHUD = true;
  }

  spawnChildren() {
    // Create two now asteroid and set the Actor asteroid to each variable
    let asteroid1 = Sup.appendScene("Asteroid/Prefab")[0];
    let asteroid2 = Sup.appendScene("Asteroid/Prefab")[0];
    // Set the position of the new asteroids to the same position than the asteroid parent (this one)
    asteroid1.setPosition(this.position);
    asteroid2.setPosition(this.position);
    // If the sizeClass was big, then both asteroid are medium
    if (this.sizeClass === "big") {
      asteroid1.getBehavior(AsteroidBehavior).sizeClass = "medium";
      asteroid2.getBehavior(AsteroidBehavior).sizeClass = "medium";
      
    }
    // If the sizeClass was medium, then both asteroid are small
    if (this.sizeClass === "medium") {
      asteroid1.getBehavior(AsteroidBehavior).sizeClass = "small";
      asteroid2.getBehavior(AsteroidBehavior).sizeClass = "small";
    }
  }

  update() {
    // Death timer
    if(this.deathTimer > 0){
      this.deathTimer--;
        if(this.deathTimer === 0){
          this.actor.destroy();
        }
      return;
      }
    
    // Keep moving
    this.position.add(this.velocity);
    this.actor.setLocalPosition(this.position);
    
    // Keep rotating
    this.actor.rotateEulerAngles(this.rotationSpeed, this.rotationSpeed, this.rotationSpeed);

    // Stay on the screen
    // Check position of asteroid on x axis
    if (this.position.x > Game.bounds.width / 2) {
      this.position.x = -Game.bounds.width / 2
    }
    
    if (this.position.x < -Game.bounds.width / 2) {
      this.position.x = Game.bounds.width / 2
    }
    // Check position of asteroid on y axis
    if (this.position.y > Game.bounds.height / 2) {
      this.position.y = -Game.bounds.height / 2
    } 
    
    if (this.position.y < -Game.bounds.height / 2) {
      this.position.y = Game.bounds.height / 2
    }
    
    // If there is player ship1 missiles, call a collision checking for this actor with the list of the player Ship missiles
    if(Ships.missiles[0].length > 0){
      // If the collision checking return true
      if (Game.checkCollisionMissile(this.actor, Ships.missiles[0], this.amplitude)) {
        // Destroy this asteroid
        this.die();
        // If the asteroid is not small
        if (this.sizeClass !== "small"){
          // Spawn two new asteroid of the class below
          this.spawnChildren();
        }
      }
    }
  }

  onDestroy() {
    // Decrease asteroids count by one
    Asteroids.currentCount--;
    // Remove this actor from the Asteroids list
    Asteroids.list.splice(Asteroids.list.indexOf(this.actor), 1);
  }
}
Sup.registerBehavior(AsteroidBehavior);
