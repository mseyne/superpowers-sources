class Paddle1Behavior extends Sup.Behavior {
  // connect the paddle body to a variable which will be used many times in the script
  pad = this.actor.arcadeBody2D;

  // set the speed of the paddle
  speed : number = 0.1;

  update() {
    // get Y position of paddle in a variable
    let y : number = this.actor.getY();

    // if the key is pressed and y < to max, the velocity of the body is set in motion with speed
    if(Sup.Input.isKeyDown("W") && y < 2.35){
      this.pad.setVelocityY(this.speed);
    }
    // if the key is pressedand y > to min, the velocity of the body is set in motion with negative speed
    else if(Sup.Input.isKeyDown("S") && y > -2.35){
      this.pad.setVelocityY(-this.speed);
    }
    // in other situations the velocity of the body is set to 0
    else{
      this.pad.setVelocityY(0);
    }
  }
}

class Paddle2Behavior extends Sup.Behavior {
  // connect the paddle body to a variable which will be used many times in the script
  pad = this.actor.arcadeBody2D;

  // set the speed of the paddle
  speed : number = 0.1;

  update() {
    // get Y position of paddle in a variable
    let y : number = this.actor.getY();

    // if the key is pressed and y < to max, the velocity of the body is set in motion with speed
    if(Sup.Input.isKeyDown("UP") && y < 2.35){
      this.pad.setVelocityY(this.speed);
    }
    // if the key is pressedand y > to min, the velocity of the body is set in motion with negative speed
    else if(Sup.Input.isKeyDown("DOWN") && y > -2.35){
      this.pad.setVelocityY(-this.speed);
    }
    // in other situations the velocity of the body is set to 0
    else{
      this.pad.setVelocityY(0);
    }
  }
}

Sup.registerBehavior(Paddle1Behavior);
Sup.registerBehavior(Paddle2Behavior);
