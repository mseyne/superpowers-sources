class AlienMissileBehavior extends Sup.Behavior {
  // Current position
  position: Sup.Math.Vector2;
  // Current velocity
  velocity: Sup.Math.Vector2;
  // Target position
  target: Sup.Math.Vector2;
  // Missile trajectory angle
  angle: number;

  start() {
    // Set current position from the actor position
    this.position = this.actor.getLocalPosition().toVector2();
    // Get player ship position to define as target for this missile
    this.target = Sup.getActor("Ship1").getLocalPosition().toVector2();
    // Get angle trajectory between this actor position and the target position
    this.angle = this.position.angleTo(this.target);
    // Create velocity with the Alien.missileSpeed value
    this.velocity = new Sup.Math.Vector2(Alien.missileSpeed, 0);
    // Convert velocity with the angle trajectory
    this.velocity.rotate(this.angle);
    // Add the current actor the Alien.missiles list
    Alien.missiles.push(this.actor);
  }

  update() {
    // While the missile has no reached the target position, keep moving
    // Add current velocity to current position
    this.position.add(this.velocity);
    // Update current position to missile actor
    this.actor.setLocalPosition(this.position);
    // Get the distance between current position and target position
    let distance = this.target.distanceTo(this.position);
    // When the distance to target is nearly reached, the missile explode
    if (distance < 0.5) {
      this.actor.getChild("Sprite").spriteRenderer.setAnimation("explode", false);
      // When the distance is close to 0, the missile actor is destroyed
      if (distance < 0.1) {
        this.actor.destroy();
      }
    }
  }

  onDestroy() {
    // Remove this actor from the Alien.missiles list
    Alien.missiles.splice(Alien.missiles.indexOf(this.actor), 1);
  }
}
Sup.registerBehavior(AlienMissileBehavior);
