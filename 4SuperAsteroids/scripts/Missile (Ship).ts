class ShipMissileBehavior extends Sup.Behavior {
  // shipIndex owner of this missile actor
  shipIndex: number;
  // Current position
  position: Sup.Math.Vector2;
  // Current movement velocity
  velocity: Sup.Math.Vector2;
  // Missile trajectory angle
  angle: number;
  // Timer before death
  lifeTime: number;

  start() {
    // Set the timer lifeTime to the default value Ships.missileLife
    this.lifeTime = Ships.missileLife;
    // Create a new vector with the default Ships.missileSpeed as value for the velocity
    this.velocity = new Sup.Math.Vector2(Ships.missileSpeed, 0);
    // Convert the velocity with the trajectory angle
    this.velocity.rotate(this.angle);
    // Add the current missile actor to the global Ships.missiles[shipIndex] list (0 for ship1 and 1 for ship2)
    Ships.missiles[this.shipIndex].push(this.actor);
  }

  update() {
    // Keep moving
    this.position.add(this.velocity);
    this.actor.setLocalPosition(this.position);
    
    // If the timer is superior to 0, decrease by one
    if (this.lifeTime > 0) {
      this.lifeTime--;
      // If the timer reach 10 frame before death, play the destruction animation once
      if (this.lifeTime === 10) {
        this.actor.getChild("Sprite").spriteRenderer.setAnimation("explode", false);
      }
    } 
    // Once the lifeTime timer reach 0, destroy the Actor
    else {
      this.actor.destroy();
    }
  }

  onDestroy() {
    // Remove the current actor from the Global list from the shipIndex owner
    Ships.missiles[this.shipIndex].splice(Ships.missiles[this.shipIndex].indexOf(this.actor), 1);
  }
}
Sup.registerBehavior(ShipMissileBehavior);
