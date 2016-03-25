class ShipBehavior extends Sup.Behavior {
  // Ship index, 0 is ship 1, 1 is ship 2
  index: number;
  // Ship radius collision
  amplitude: number;
  // Ship current life
  lifes: number;
  // Ship current status
  alive: boolean;
  // Ship current score
  score: number;
  // Spawn position
  spawnPosition: Sup.Math.Vector2;
  // Current position
  position: Sup.Math.Vector2;
  // Current movement speed
  linearVelocity = new Sup.Math.Vector2();
  // Current rotation speed
  angularVelocity: number;
  // Angle position
  angle: number;
  // Timer before shooting
  shootCooldown: number;
  // Timer before respawn
  spawnCooldown: number;
  // Timer before vulnerability
  invincibilityCooldown: number;

  awake() {
    // Starting life to 3
    this.lifes = Ships.startLife;
    // Set true to alive status
    this.alive = true;
    // Starting score to 0
    this.score = Ships.startScore;
    // Starting speed movement on x and y axis to 0
    this.linearVelocity.set(0, 0);
    // Starting speed rotation to 0
    this.angularVelocity = 0;
  }

  start() {
    // Set the ship default size to half size
    this.actor.setLocalScale(Ships.size);
    // Set the ship default amplitude related to size
    this.amplitude = Ships.amplitude;
    // Get the starting position to become the spawnPosition of this behavior
    this.spawnPosition = this.actor.getLocalPosition().toVector2();
    // Get the starting position to become the current position of this behavior
    this.position = this.actor.getLocalPosition().toVector2();
    // Get the starting angle to become the current angle of this behavior
    this.angle = this.actor.getLocalEulerZ();
  }

  die() {
    Sup.Audio.playSound('Sounds/explosion');
    // Decrease life of one
    this.lifes--;
    // Set false to alive status
    this.alive = false;
    // Flag to check and update the life HUD
    Game.checkLifeHUD = true;
    // If life is 0, then the game is over
    if (this.lifes === 0) {
      // If this is the Asteroids game, death of ship mean victory for Alien
      if(Game.nameIndex === 0) {
        Sup.setTimeout(1000, function () { Game.gameOver("alien") });
      }
      else {
        // If this is Spacewar game and death of ship 1 mean victory for ship 2
        if (this.index === 0){
          Sup.setTimeout(1000, function () { Game.gameOver("ship2") });
        }
        // Else, this is ship 2 and it is a victory for ship 1
        else {
          Sup.setTimeout(1000, function () { Game.gameOver("ship1") });
        }
      }
    }
    // Check which ship index to see which lose points
    if (this.index === 0) {
      Game.addPoints(true, Game.points.death);
    }
    else {
      Game.addPoints(false, Game.points.death); 
    }
    // Flag to check and update the score HUD
    Game.checkScoreHUD = true;
    // Set timer before respawn
    this.spawnCooldown = Ships.respawnTimer;    
    // Set ship model visibility to false
    this.actor.getChild('Model').setVisible(false);
    // Set ship boosts visibility to false
    this.actor.getChild('Boost').setVisible(false);
    // Set sprite animation explosition to play once
    this.actor.getChild('Destruction').spriteRenderer.setAnimation("explode", false);
    // Reset speed movement on x and y axis to 0
    this.linearVelocity.set(0, 0);
    // Reset angular movement to 0
    this.angularVelocity = 0;
    // Reset angle to default for ship 1 or ship 2
    if (this.index === 0){
      this.angle = 1.6;
    }
    else{
      this.angle = -1.6;
    }
  }

  spawn() {
    // The ship respawn to spawn position
    this.position = this.spawnPosition.clone();
    // Set the new current position to the Ship actor
    this.actor.setLocalPosition(this.position);
    // Set the new angle to the Ship actor
    this.actor.setLocalEulerZ(this.angle);
    // The ship model visibility to true
    this.actor.getChild('Model').setVisible(true);
    // Set timer for invincibility
    this.invincibilityCooldown = Ships.invincibleTimer;
  }

  shoot() {
    // Initialize a new missile
    let missile: Sup.Actor;
    // If the ship is ship 1 then create a Ship 1 missile and set the variable missile to the Missile actor
    if (this.index === 0) {
      missile = Sup.appendScene("Ship/0/Missile/Prefab")[0];
    } 
    // Else do the same but for the missile of ship 2
    else {
      missile = Sup.appendScene("Ship/1/Missile/Prefab")[0];
    }
    // Set position of the actor to the current position of the ship
    missile.setLocalPosition(this.position);
    // Set local variables of the missile behavior
    // Report the position of the ship to the variable position of the behavior
    missile.getBehavior(ShipMissileBehavior).position = this.position.clone();
    // Report the angle of the ship to the angle direction of the missile
    missile.getBehavior(ShipMissileBehavior).angle = this.angle;
    // Set the shipIndex related to this missile
    missile.getBehavior(ShipMissileBehavior).shipIndex = this.index;
    // Set Shooting timer to be able to shoot again
    this.shootCooldown = Ships.shootingTimer;
  }

  boost(intensity: string) {
    // Create a new variable boost that get the Boost actor child of Ship actor
    let boost:Sup.Actor = this.actor.getChild("Boost");
    // Set the boost actor visible true
    boost.setVisible(true);
    // Set animation to both sprite with the intensity normal or fast
    boost.getChild("0").spriteRenderer.setAnimation(intensity);
    boost.getChild("1").spriteRenderer.setAnimation(intensity);
  }
  
  rotateBoost(direction: string) {
    // Create a new variable boost that get the Boost actor child of Ship actor
    let boost:Sup.Actor = this.actor.getChild("Boost");
    // Set the boost actor visible true
    boost.setVisible(true);
    // If rotate on the left direction
    if(direction === "left"){
      // Switch animation for right boost stronger
      boost.getChild("0").spriteRenderer.setAnimation("fast");
      boost.getChild("1").spriteRenderer.setAnimation("normal");
    }
    // If rotate on the right direction
    if(direction === "right"){
      // Switch animation for left boost stronger
      boost.getChild("1").spriteRenderer.setAnimation("fast");
      boost.getChild("0").spriteRenderer.setAnimation("normal");
    }
  }

  update() {
    // Keep respawning
    // If the spawnCooldown timer is more than 0
    if (this.spawnCooldown > 0) {
      // Decrease by one the timer
      this.spawnCooldown--
      // If the spawnCooldown is 0
      if (this.spawnCooldown === 0) {
        // Call the spawn method
        this.spawn();
      }
      //restart update loop to skip the following code
      return;
    }
    
    // Keep shooting
    // If the shootCooldown timer is more than 0
    if (this.shootCooldown > 0) {
      // Decrease by one the timer
      this.shootCooldown--;
    }
    // If the timer is 0 (!0 = true)
    if (!this.shootCooldown) {
      // If the shoot key is pressed
      if(Sup.Input.wasKeyJustPressed(Ships.commands[this.index].shoot)){
        Sup.Audio.playSound('Sounds/shipShot');
        // Call the shoot method
        this.shoot();
      }
    }
    
    // Keep moving
    // If forward key is pressed down
    if (Sup.Input.isKeyDown(Ships.commands[this.index].forward)){
      // Set the impulse with the linearAcceleration
      let impulse = new Sup.Math.Vector2(Ships.linearAcceleration, 0);
      // Convert the impulse to the current angle
      impulse.rotate(this.angle);
      // Add the impulse to the linearVelocity
      this.linearVelocity.add(impulse);
        // Call the boost method with a normal intensity
        this.boost("normal");
        // If the boost key is pressed down
        if (Sup.Input.isKeyDown(Ships.commands[this.index].boost)) {
          // Add a second time the impulse to the linearVelocity
          this.linearVelocity.add(impulse);
        // Call the boost method with a fast intensity
          this.boost("fast");
        }
    }
    else {
      // Set visible false booster if not going forward
      this.actor.getChild("Boost").setVisible(false);
    }
    
    // Keep rotating
    // If left key is pressed down
    if (Sup.Input.isKeyDown(Ships.commands[this.index].left)){
      // The angularVelocity get the angularAcceleration
      this.angularVelocity += Ships.angularAcceleration;
      // Boost sprite for left side
      this.rotateBoost("left");
    }
    
    // If right key is pressed down
    if (Sup.Input.isKeyDown(Ships.commands[this.index].right)){
      // The angularVelocity get the opposite angularAcceleration
      this.angularVelocity -= Ships.angularAcceleration;
      // Boost sprite for left side
      this.rotateBoost("right");
    }
    
    // Set boost to default if key left, right and forward are NOT pressed
    if (!Sup.Input.isKeyDown(Ships.commands[this.index].left) && 
        !Sup.Input.isKeyDown(Ships.commands[this.index].right) && 
        !Sup.Input.isKeyDown(Ships.commands[this.index].forward)){
          this.actor.getChild("Boost").setVisible(false);
          this.actor.getChild("Boost").getChild("0").setVisible(true);
          this.actor.getChild("Boost").getChild("1").setVisible(true);
        }
    
    // Keep slowing down
    // The linearVelocity multiply the linearDamping
    this.linearVelocity.multiplyScalar(Ships.linearDamping);
    // The angularVelocity multiply the angularDamping
    this.angularVelocity *= Ships.angularDamping;
    
    // Stay on the game screen
    if (this.position.x > Game.bounds.width / 2) {
      this.position.x = -Game.bounds.width / 2;
    }
    
    if (this.position.x < -Game.bounds.width / 2) {
      this.position.x = Game.bounds.width / 2;
    }
    
    if (this.position.y > Game.bounds.height / 2) {
      this.position.y = -Game.bounds.height / 2;
    }
    
    if (this.position.y < -Game.bounds.height / 2) {
      this.position.y = Game.bounds.height / 2;
    }
    
    // Update position and angle
    // Add the linearVelocity to the current position
    this.position.add(this.linearVelocity);
    // Set the new current position to the Ship actor
    this.actor.setLocalPosition(this.position);
    // Add the angularVelocity to the current angle
    this.angle += this.angularVelocity;
    // Set the new angle to the Ship actor
    this.actor.setLocalEulerZ(this.angle);
    
    // Blinking
    // If the invincibilityCooldown Timer is more than 0
    if (this.invincibilityCooldown > 0) {
      // Decrease by one the timer
      this.invincibilityCooldown--;
      // Set actor visible become true every half second, false the other half and stay visible at the end
      this.actor.setVisible(this.invincibilityCooldown % 60 < 30);
      // When invincibilityCooldown reach 1, get back vulnerability
      if (this.invincibilityCooldown === 1) {
        // Set true to alive status
        this.alive = true;  
      }
      // Restart update loop to skip the collision blocks code
      return;
    }
    
    // If game is Super Asteroids, chek for collision with asteroids, alien missiles and alien ship
    if (Game.nameIndex === 0) {
      // Check collision between the player ship and the alien missiles
      if (Game.checkCollisionMissile(this.actor, Alien.missiles, this.amplitude)){
        this.die();
      }
      // Check collision between the player ship and the asteroids
      if (Game.checkCollisionAsteroids(this.actor, this.amplitude)){
        this.die();
      }
    }
    
    // If game is Super Spacewar, check collision with other missiles and other ship
    if (Game.nameIndex === 1) {
      // If the ship is 1 check collision with ship 2 missile
      if (this.index === 0){
        if (Game.checkCollisionMissile(this.actor, Ships.missiles[1], this.amplitude)){
          // if there is collision, add point to the ship 2 and destroy ship 1
          Game.addPoints(false, Game.points.ship);
          this.die();
        }
      }
      // Else the ship is 2 check collision with ship 1 missile
      else {
        if (Game.checkCollisionMissile(this.actor, Ships.missiles[0], this.amplitude)){
          // if there is collision, add point to the ship 1 and destroy ship 2
          Game.addPoints(true, Game.points.ship);
          this.die();
        }
      }
      // Check collision between this ship and the other ship
      if (Game.checkCollisionShip(this.actor, this.amplitude)) {
            this.die();
      }
    }
  }
}
Sup.registerBehavior(ShipBehavior);
