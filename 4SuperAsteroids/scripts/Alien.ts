class AlienBehavior extends Sup.Behavior {
  // Ship size of this Actor
  size: number;
  // Ship amplitude of this Actor
  amplitude: number;
  // Ship position
  position: Sup.Math.Vector2;
  // Ship linear movement
  velocity : Sup.Math.Vector2;
  // Timer before shooting
  shootCooldown: number;
  // Timer before death
  deathTimer: number;

  awake() {
    // Set Alien.alive flag to true
    Alien.alive = true;
    // Get a random index for alien ship size and amplitude
    let randomShip: number = Sup.Math.Random.integer(0, 2);
    // Get the default size related to the random index
    this.size = Alien.sizes[randomShip];
    // Get the default collision amplitude related to the random index
    this.amplitude = Alien.amplitudes[randomShip];
    // Set the size to the actor
    this.actor.setLocalScale(this.size);
    // Set the value of Alien.startLife to the current Alien.lifes
    Alien.lifes = Alien.startLife;
    // Set the shootCooldown timer to the Alien.shootTime value
    this.shootCooldown = Alien.shootTime;
    // Set the Game.checkLifeHUD value to true 
    Game.checkLifeHUD = true;
  }
  
  start() {
    // Set position to the current actor position
    this.position = this.actor.getLocalPosition().toVector2();
    // Set x axis linear movement toward the opposite edge of spawn
    if (this.position.x === Game.bounds.width / 2) {
      this.velocity = new Sup.Math.Vector2(-Alien.linearSpeed, 0);
    }
    else {
      this.velocity = new Sup.Math.Vector2(Alien.linearSpeed, 0);
    }
  }

  shoot() {
    // Create a new alien missile and set the Missile actor to a variable
    let missile = Sup.appendScene("Alien/Missile/Prefab")[0];
    // Set the alien ship position to the missile actor position
    missile.setLocalPosition(this.position);
    // Reset value of Timer to default value
    this.shootCooldown = Alien.shootTime;
  }

  update() {
    // Death timer
    // Decrease death timer before destruction
    if(this.deathTimer > 0){
      this.deathTimer--;
      if(this.deathTimer === 0){
        this.actor.destroy();
      }
      return;
    }
    
    // Death setting
    // Set death if alien don't have lifes anymore
    if(Alien.lifes === 0){
      Sup.Audio.playSound('Sounds/explosion');
      // Reset angles to default for the explosion sprite
      this.actor.setEulerAngles(0,0,0);
      // Set visible off the alien ship model
      this.actor.getChild("Model").setVisible(false);
      // Set the sprite animation explode to play once without looping
      this.actor.getChild('Destruction').spriteRenderer.setAnimation("explode", false);
      // Give 30 frames before actor destruction (half a second)
      this.deathTimer = 30;
      // Add point to the player for alien death
      Game.addPoints(true, Game.points.alien);
      // Flag the game to check and update the HUD score
      Game.checkScoreHUD = true;
    }
    
    // Keep moving
    // Add the linear movement to the position variable
    this.position.add(this.velocity);
    // Set the new position to the alien actor
    this.actor.setLocalPosition(this.position);
    
    // Keep rotating
    // Rotate actor using rotateLocalEulerY with the default Alien.rotationSpeed value
    this.actor.rotateLocalEulerY(Alien.rotationSpeed);
    
    // Keep shooting
    // If the timer is not finished, decrease value of one
    if (this.shootCooldown > 0) {
      this.shootCooldown--;
    }
    // If the timer is finished, shoot missile
    else {
      Sup.Audio.playSound('Sounds/alienShot');
      this.shoot();
    }
    
    // Stay on the screen
    // If position is superior to the max of the x bound then switch position
    if (this.position.x > Game.bounds.width / 2) {
      this.position.x = -Game.bounds.width / 2;
    }
    // If position is inferior to the min of the x bound then switch position
    if (this.position.x < -Game.bounds.width / 2) {
      this.position.x = Game.bounds.width / 2;
    }
    
    // If there is player ship1 missiles, call a collision checking for this actor with the list of the player Ship missiles
    if(Ships.missiles[0].length > 0){
      // If the collision checking return true
      if (Game.checkCollisionMissile(this.actor, Ships.missiles[0], this.amplitude)) {
        Sup.Audio.playSound('Sounds/shotContact');
        // Decrease Alien lifes by one
        Alien.lifes--
        // Flag true to check and update the life HUD in Game Script
        Game.checkLifeHUD = true;
      }
    }
    // Check collision between Alien ship and Player ship
    if (Game.checkCollisionShip(this.actor, this.amplitude)){
      // Destroy the alien ship by setting its lifes to 0
      Alien.lifes = 0;
    }
  }

  onDestroy() {
    // Set Alien.alive flag to false
    Alien.alive = false;
    // Give to Alien.spawnTimer the value of Alien.respawnTime
    Alien.spawnTimer = Alien.respawnTime;
  }
}
Sup.registerBehavior(AlienBehavior);
