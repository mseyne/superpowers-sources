class PlayerBehavior extends Sup.Behavior {
  
  start() {
    // set position of Player actor to the playerPosition 2D vector
    this.actor.setPosition(playerPosition);
  }
  
  move(x, y){
    
    /*
    We update the future position of the player and start to check condition :
    - (1) if the next tile is an empty floor, the player can move, canMove is true
    - (2) else, canMove is false
    - (3) if the next tile is a box, then we check a second branch of condition :
        - (4) if the the next tile after the box tile is an empty floor, the player can push the box
        - (5) else, canMove is false
    - (6) if canMove is true, then we update the SpriteRenderer of the Player Actor to the new position
    - (7) else, we take back the previous coordinates for the player position
    */
    
    let canMove: boolean;
    
    // Set to new coordinates
    playerPosition.add(x, y);
    
    // We get the tiles index for each layer of the map from the new coordinates
    let level = Sup.getActor("Level").tileMapRenderer.getTileMap();
    let tileWorld = level.getTileAt(Layers.World, playerPosition.x, playerPosition.y);
    let tileActors = level.getTileAt(Layers.Actors, playerPosition.x, playerPosition.y);
    
    // (1)
    if(tileWorld === Tiles.Floor || tileWorld === Tiles.Target){
      canMove = true;
      
      // (3)
      if(tileActors == Tiles.Crate || tileActors == Tiles.Packet){
        
        // We get the tiles index for each layer of the map from the coordinates after the new ones
        let nextWorldTile = level.getTileAt(Layers.World, playerPosition.x + x, playerPosition.y + y);
        let nextActorsTile = level.getTileAt(Layers.Actors, playerPosition.x + x, playerPosition.y + y);

        // (4) 
        if(nextWorldTile == Tiles.Floor && nextActorsTile == Tiles.Empty){
        
          level.setTileAt(Layers.Actors, playerPosition.x, playerPosition.y, Tiles.Empty);
          // If the next world tile is floor, the box is a crate. 
          level.setTileAt(Layers.Actors, playerPosition.x + x, playerPosition.y + y, Tiles.Crate);
          
        }
        // (4) 
        else if(nextWorldTile == Tiles.Target && nextActorsTile == Tiles.Empty){
          
          level.setTileAt(Layers.Actors, playerPosition.x, playerPosition.y, Tiles.Empty);
          // If the next world tile is a target tile, the box is a packet.
          level.setTileAt(Layers.Actors, playerPosition.x + x, playerPosition.y + y, Tiles.Packet);
          
        }
        // (5)
        else{
          canMove = false;
        }
      }
    }
    // (2)
    else{
      canMove = false;
    }
    
    // (6)
    if(canMove === true){
      // We update the Player Actor with the new playerPosition vector coordinate
      this.actor.setPosition(playerPosition.x, playerPosition.y);
          
      Game.checkLevel(level);
    }
    // (7)
    else{ // blocked, return to previous value
      playerPosition.subtract(x, y);
    }
  }
  
  update() {
    // if the level is NOT won, the player have control
    if(!isLevelWon){
      if(Sup.Input.wasKeyJustPressed("UP")){
        this.move(0, 1);
        this.actor.spriteRenderer.setAnimation('up');
      }
      else if(Sup.Input.wasKeyJustPressed("DOWN")){
        this.move(0, -1);
        this.actor.spriteRenderer.setAnimation('down');
      }
      else if(Sup.Input.wasKeyJustPressed("LEFT")){
        this.move(-1, 0);
        this.actor.spriteRenderer.setAnimation('left');
      }
      else if(Sup.Input.wasKeyJustPressed("RIGHT")){
        this.move(1, 0);
        this.actor.spriteRenderer.setAnimation('right');
      }
    }
  }
}
Sup.registerBehavior(PlayerBehavior);
