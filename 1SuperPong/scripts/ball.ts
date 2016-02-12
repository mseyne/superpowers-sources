const BALLSPEED : number = 0.05 ;

class BallBehavior extends Sup.Behavior {
  // Connect the actor body to a constant
  ball = this.actor.arcadeBody2D;
  // An Array with score[0] for player 1 and score[1] for player 2
  score = [0, 0];
  // speed variable
  speed : number = BALLSPEED;
  // set positive or negative direction variables of x and y
  dx : number = 1; dy : number = 1;

  update() {
    // get the ball position of x and y
    let x : number  = this.actor.getX(); let y : number  = this.actor.getY();
    
    // change direction of y if ball reach up and down sides
    if(y > 2.85 || y < -2.85){
      Sup.Audio.playSound("GameSounds/toc");
      this.dy = this.dy * -1;
    }
    
    // We check if there is collision between the ball and the two paddles
    if(Sup.ArcadePhysics2D.collides(this.ball, Sup.ArcadePhysics2D.getAllBodies())){
       Sup.Audio.playSound("GameSounds/tac");
      /* If there is collision we check if the ball touch 
      a left or right side (we change the x direction) or 
      the up and down side of the paddles (y direction), 
      the speed of the ball take an acceleration. */
      if(this.ball.getTouches().right || this.ball.getTouches().left){
        this.dx = this.dx * -1;
        this.speed += 0.01
        } 
      else {
        this.dy = this.dy * -1;
        }
      }
    
    /* We check if the ball pass the paddle and go beyond 
    (sides left and right of the game table) if yes, we move
    the ball to the center and change the direction of x axis,
    the speed take the default speed. */
    if(x > 4 || x < -4){
       this.ball.warpPosition(0, 0);
       this.dx = this.dx * -1;   
       this.speed = BALLSPEED;
       Sup.Audio.playSound("GameSounds/tada");
       }
    
    //We change the score depending on which side the ball go on x axis
    if(x > 4){ 
      ++this.score[0];
      Sup.getActor("Player1").getChild("Score").textRenderer.setText(this.score[0]);
    }
    
    if(x < -4){
      ++this.score[1];
      Sup.getActor("Player2").getChild("Score").textRenderer.setText(this.score[1]);
    }
    
    // set ball movement velocity speed*direction for x and y axis (the ball stay in movement at any time)
    this.ball.setVelocity(this.speed*this.dx, this.speed*this.dy);
    
    if(this.score[0] == 10 || this.score[1] == 10){
      Sup.loadScene("Menu");
    }
  }
}
Sup.registerBehavior(BallBehavior);
