class PlayerBehavior extends Sup.Behavior {
  awake() {
    // Call the function setSquares which build the SQUARES Array
    Game.setSquares();
    // Call the function startGame to randomize the new game
    Game.startGame();
  }
  
  // mouse method receiving parameters of the player action and the square related to this action
  mouse(action, square){
    // change the square sprite depending of action
    if(action == "isHover"){
      square.spriteRenderer.setAnimation("isHover");
    }
    else if(action == "unHover"){
      square.spriteRenderer.setAnimation("unHover");
    }
    else if(action == "click"){
      square.spriteRenderer.setAnimation("cross");
    }
  }
  
  gameTurn(){
    turn = "cross";
    // check if player won
    Game.checkVictory();
    
    // change to computer turn if game not ended
    if(turn !== "end"){
      turn = "circle";
      // Call for the computer turn
      
      Game.computerTurn();
      // check if computer won
      Game.checkVictory();
      
      // change to player turn if game not ended
      if(turn !== "end"){
       turn = "cross";
      }
    }
  }
  
  update() {
    // Refresh the ray casting to the mouse position inside the camera screen
    ray.setFromCamera(Sup.getActor("Camera").camera, Sup.Input.getMousePosition());
    
    // Create a new empty variable that will as value the differents array of the SQUARES constant
    let array;
    
    /* 
    We loop through all the arrays in SQUARES and give the current array to the square variable. 
    We then check differents conditions :
    - If the mouse ray intersect with a current square :
        - then if this same square was previously not hovered.
        - and then if there is the left click button pressed from the mouse.
    - Else if the mouse ray leave a square previously hovered.
    */
        
    // Loop which give successively to array the values of the SQUARES array.
    for(array of SQUARES){
          
      // Check if ray intersect with a current square (index 0 of array)
      if(ray.intersectActor(array[0], false).length > 0){
        
        if(array[1] == "unHover"){
          // if true, set the square new situation to isHover
          array[1] = "isHover";
          // and call the local mouse method with the action isHover and the related square actor
          this.mouse("isHover", array[0]);
        }
        
        // Check if the left click button of the mouse is pressed on a free square 
        if(Sup.Input.wasMouseButtonJustPressed(0) && array[1] == "isHover"){
          // Check if it is the player turn
          if(turn == "cross"){
            // if true, set the square new situation to cross
            array[1] = "cross";
            // and call the local mouse method with the action click and the related square actor
            this.mouse("click", array[0]);
            // call a game turn
            turn = "break"; // take control away from player
            Sup.setTimeout(600, this.gameTurn);
          }
        }
      }
      
      // Else if ray does not intersect with a previous hovered square, the square change situation
      else if(array[1] == "isHover"){
        // if true, set the square new situation to unHover
        array[1] = "unHover";
        // and call the local mouse method with the action unHover and the related square actor
        this.mouse("unHover", array[0]);
      }
    }
  }
}
Sup.registerBehavior(PlayerBehavior);

class ScreenBehavior extends Sup.Behavior {  
  
  /*
  when space key pressed :
  - Destroy the victory screen 
  - Start a new game
  */
  
  update() {
    if(Sup.Input.wasKeyJustPressed("SPACE")){
      Sup.getActor("Screen").destroy();
      Game.startGame();
      }
    }
 }
Sup.registerBehavior(ScreenBehavior);