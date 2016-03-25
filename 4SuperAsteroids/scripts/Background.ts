class BackgroundBehavior extends Sup.Behavior {
  // Initialize position and speed variables
  position: number;
  speed : number;

  awake() {
    // Get the position on Y axis of the actor
    this.position = this.actor.getLocalY();
    // Set the speed of background scrolling
    this.speed = 0.01;
  }

  update() {
    // Add the speed movement to the current position
    this.position += this.speed;
    // Set the current position to the actor
    this.actor.setLocalY(this.position);
    
    // If the sprite moved all its height (480/16 = 60 units)
    if (this.position > 60) {
      // Then return down to start again
      this.position = -60;
    }
  }
}
Sup.registerBehavior(BackgroundBehavior);
