class LevelBehavior extends Sup.Behavior {
  
  level =  this.actor.tileMapRenderer;

  awake() {
    // set Level actor  to the current level map path
    this.level.setTileMap("Levels/"+LEVELS[levelCount]);
    
    // call the getPositions function with the current tile map as parameter
    Game.getPosition(this.level.getTileMap());
  }

  update() {
    
    /*
    If the level is won we check
      - if it was the last level
        - if yes, we go to the victory screen
        - else we change the transition text visibility to true
      - if the key space is pressed
        - change the transition text visibility to false
        - change the new level tile map
        - call the setLevel function that will prepare the scene before to reload it
    */
    
    if(isLevelWon){
      if(levelCount == levelMax){
        Sup.loadScene("Victory/Scene");
      }
      else{
        this.actor.getChild("Next").setVisible(true);
        this.actor.getChild("Reset").setVisible(false);
      }

      if(Sup.Input.wasKeyJustPressed("SPACE")){
        this.actor.getChild("Next").setVisible(false);
        this.actor.getChild("Reset").setVisible(true);

        this.level.setTileMap("Levels/"+LEVELS[levelCount]);

        Game.setLevel();
      }
    }
    // if R key is pressed and the level is NOT won, then reset the whole level
    if(Sup.Input.wasKeyJustPressed("R") && !isLevelWon){
      Game.resetLevel(this.level.getTileMap());
    }
  }
}
Sup.registerBehavior(LevelBehavior);
