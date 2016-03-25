// SUPER ASTEROIDS and SUPER SPACEWAR
// Tutorial #4 Game Development with Superpowers

// Main game datas and functions
namespace Game{
  
  // Game timer max value
  export const timeMax: number = 7200; //7200 2 minutes
  
  // The game index of the current played game, 0 for Asteroids, 1 for Spacewar
  export let nameIndex: number = 0; // Temporary allocation
  
  // The screen limits in width and height + outside border
  export let bounds : {
    width:number,
    height:number
  }
  
  // set an invisible border of 2 x 1.5 units (24 pixels wide) around the screen
  let border: number = 3;
  
  // Game points won when target shot
  export enum points {
    asteroidBig = 10,
    asteroidMedium = 15,
    asteroidSmall = 20,
    alien = 50,
    ship = 100 ,
    death = -50,
     }
  
  // Life hearts positions
  export const hearts = [
    ["empty", "empty", "empty", "empty", "empty"],
    ["full", "empty", "empty", "empty", "empty"],
    ["full", "full", "empty", "empty", "empty"],
    ["full", "full", "full", "empty", "empty"],
    ["full", "full", "full", "full", "empty"],
    ["full", "full", "full", "full", "full"]
  ]
  
  // Flags to check HUD changes
  export var checkLifeHUD: boolean;
  export var checkScoreHUD: boolean;
  
  // Start the game
  export function start(){
    // Load Game Scene
    Sup.loadScene("Game/Scene");
    
    // Set new asteroids list
    Asteroids.list = [];
    // Set asteroids number to 0
    Asteroids.currentCount = 0;
    
    // Set new Ships.missiles list
    Ships.missiles = [[], []];
    // Set new Alien.missiles list
    Alien.missiles = [];
    
    
    // get the Camera actor the the game Scene
    let screen = Sup.getActor("Camera").camera;
    // We get the game screen bounds and add the invisible border
    bounds = {
      width: screen.getOrthographicScale() + border,
      height: screen.getOrthographicScale() + border
    }
  
    // If the game is Asteroids, load the Ship 1 only
    if (nameIndex === 0) {
      // Set ship 1 in game
      setShip(Ships.index.ship1);
      // Set visible false the HUD display for ship 2
      Sup.getActor("HUD").getChild("UIShip2").setVisible(false);
      // Set visible true the HUD display for alien
      Sup.getActor("HUD").getChild("UIAlien").setVisible(true);
      // Set Timer HUD visible false
      Sup.getActor("HUD").getChild("Timer").setVisible(true);
    }
    // If the game is Spacewar, load two ships
    if (nameIndex === 1) {
      // Set ship 1 in game
      setShip(Ships.index.ship1);
      // Set ship 2 in game
      setShip(Ships.index.ship2);
      // Set visible true the HUD display for ship 2
      Sup.getActor("HUD").getChild("UIShip2").setVisible(true);
      // Set visible false the HUD display for alien
      Sup.getActor("HUD").getChild("UIAlien").setVisible(false);
      // Set Timer HUD visible false
      Sup.getActor("HUD").getChild("Timer").setVisible(false);
    }
  }
  
  function setShip(shipIndex:number){
    // Initialize a new variable of type Sup.Actor
    let Ship: Sup.Actor;
    // Add the ship 1 or 2 to game scene depending the index
    if (shipIndex === 0) {
      // Create Ship and set the ship variable with the Ship1 actor
      Ship = Sup.appendScene("Ship/0/Prefab")[0];
    }
    else {
      // Create Ship and set the ship variable with the Ship2 actor
      Ship = Sup.appendScene("Ship/1/Prefab")[0];
    }
    // Set behavior variables
    Ship.getBehavior(ShipBehavior).index = shipIndex;
    // Set spawn position of the ship accordingly to the game an ship index
    // If game is Asteroids, set position to center
    if (nameIndex === 0) {
      Ship.setLocalPosition(Ships.spawns[0]);
    }
    // If game is Spacewar and Ship is 1, set position to corner down left
    else if (shipIndex === 0) {
      Ship.setLocalPosition(Ships.spawns[1]);
    }
    // Else it is Ship 2, set position to corner up right
    else {
      Ship.setLocalPosition(Ships.spawns[2]);
    }
  }
  
  // Create an alien in the Game scene              
  export function spawnAlien(){
    // Load the alien prefab and get the Alien actor (index 0) as a new alien variable
    let alien = Sup.appendScene("Alien/Prefab")[0];
    
    // Choose a random position somewhere at the vertical edges of the game screen
    // Create the three axis positions x, y, z
    let x: number = 0, y: number = 0, z: number = 0;
    
    // Choose randomly a position on one of the vertical edges
    x = Sup.Math.Random.sample([-bounds.width / 2, bounds.width / 2]);
    // Get the height without the invisible border
    let height = bounds.height - border
    // Choose randomly a position on y axis
    y = Sup.Math.Random.integer(-height / 2 , height / 2);
    // Get alien default Z position
    z = Alien.zPosition;
    
    // Set the randomly chosen position to the Alien actor
    alien.setLocalPosition(x, y, z);
  }
  
  // Create an asteroid in the Game scene
  export function spawnAsteroid(){
    // Load the asteroid prefab and get the Asteroid actor (index 0) as a new asteroid variable
    let asteroid = Sup.appendScene("Asteroid/Prefab")[0];
    
    // Choose a random position somewhere at the edges of the game screen
    // Create the three axis positions x, y, z
    let x: number = 0, y: number = 0, z: number = 0;
    
    // Choose randomly if the asteroids come from the horizontal or vertical edges
    if(Sup.Math.Random.sample([0, 1]) === 0){
      x = Sup.Math.Random.sample([-bounds.width / 2, bounds.width / 2]);
      y = Sup.Math.Random.integer(-bounds.height / 2, bounds.height / 2);
    }
    else {
      x = Sup.Math.Random.integer(-bounds.height / 2, bounds.height / 2);
      y = Sup.Math.Random.sample([-bounds.width / 2, bounds.width / 2]);
    }
    // Choose randomly the z position on the scene in the range of Asteroids.zPoistions
    z = Sup.Math.Random.integer(Asteroids.zPositions.min, Asteroids.zPositions.max);
      
    // Set the randomly chosen position to the Asteroid actor
    asteroid.setLocalPosition(x, y, z);
    
    // Report the asteroid size
    asteroid.getBehavior(AsteroidBehavior).sizeClass = "big";
  }
  
  export function checkCollisionMissile(actor: Sup.Actor, actorList: Sup.Actor[], amplitude: number){
    /* 
    We get the distance between actor and all the actors of the actorList
    If the distance if inferior to the amplitude box around the Actor, there is a collision
    */
    
    // Get the position 1 of the actor we check collision with actorList
    let position1: Sup.Math.Vector2 = actor.getLocalPosition().toVector2();
    // Loop through the actors of listToCheck and check if ....
    for(let i = 0; i < actorList.length; i++){
      // Get the position 2 of the current actor of the loop inside actorList
      let position2: Sup.Math.Vector2 = actorList[i].getLocalPosition().toVector2();
      // Get the distance between position 1 and position 2
      let distance: number = Math.round(position1.distanceTo(position2)*100)/100;
      // If the distance is inferior to the amplitude (collision radius), then it is a collision
      if (distance < amplitude) {
        // The current actor of the actorList is destroyed
        actorList[i].destroy();
        // Return true to the behavior which check for collision
        return true;
      }
    }
    // Return false to the behavior which check for collision
    return false;
  }
  
  export function checkCollisionAsteroids(ship: Sup.Actor, shipAmplitude: number) {
    /*
      Get the distance between the ship and the asteroids, compare the distance with the biggest amplitude
    */
    // Initialize a variable asteroid which will take all the asteroids of the list as value
    let asteroid: Sup.Actor;
    // Get the current position of the ship
    let shipPosition: Sup.Math.Vector2 = ship.getLocalPosition().toVector2();
    // Loop through all the asteroids in game
    for(asteroid of Asteroids.list){
      // Get the amplitude of the current asteroid
      let asteroidAmplitude: number = asteroid.getBehavior(AsteroidBehavior).amplitude;
      // Get the position of the current asteroid
      let asteroidPosition: Sup.Math.Vector2 = asteroid.getLocalPosition().toVector2();
      // Convert to distance between ship and current asteroid positions
      let distance: number = Math.round(shipPosition.distanceTo(asteroidPosition)*100)/100;
      // Check if distance is less than the biggest amplitude 
      if (distance < shipAmplitude || distance < asteroidAmplitude) {
        // Destroy the current asteroid
        asteroid.getBehavior(AsteroidBehavior).die();
        // Return true, the ship is destroyed too
        return true;
      }
    }
    return false;
  }
  
  // Check collision between actor1 and actor2
  export function checkCollisionShip(actor1: Sup.Actor, actor1Amplitude: number) {
    // Initialize variable for the actors
    let actor2: Sup.Actor;
    let actor1Position: Sup.Math.Vector2;
    let actor2Position: Sup.Math.Vector2;
    let actor2Amplitude: number;
    let actor2Alive: boolean;
    // If the actor1 is the Ship1, then we check the Ship2 as actor2
    if (actor1.getName() === "Ship1"){
      actor2 = Sup.getActor("Ship2");
    }
    // Else, if the actor1 is Ship2 or Alien Ship, we check the Ship1 as actor2
    else {
      actor2 = Sup.getActor("Ship1");
    }
    // Get the positions of both actors
    actor2Position = actor2.getLocalPosition().toVector2();
    actor1Position = actor1.getLocalPosition().toVector2();
    // Get amplitud of actor 2
    actor2Amplitude = Ships.amplitude;
    // Get the life status of the actor 2
    actor2Alive = actor2.getBehavior(ShipBehavior).alive;
    // Get the distance between the two actors
    let distance: number = Math.round(actor1Position.distanceTo(actor2Position)*100)/100;
    // To avoid to collide when ship is blinking with invulnerability, return false the collisionChecking if actor 2 not alive
    if(!actor2Alive){
      return false;
    }
    // Check if distance if less than the biggest amplitude (or collision radius)
    if (distance < actor1Amplitude || distance < actor2Amplitude) {
        // Destroy the current asteroid
        actor2.getBehavior(ShipBehavior).die();
        // Return true, both actor are destroyed
        return true;
      }
    // If condition not met, return false
    return false
  }
  
  // Update HUD timer in the Game scene
  export function updateTimer(time: number){
    // Sup.log("one second (60 frames) of", time, "frame left."); // Debug log
    // We convert frames in minutes and seconds
    let minutes = Math.floor((time / 60) / 60);
    let seconds = Math.floor((time / 60) % 60);
    // We get The Timer actor from the Game scene and we update the text Renderer with the new time
    let timer = Sup.getActor("HUD").getChild("Timer");
    // For the last 10 seconds we need to add a 0 to keep 2 numbers in the timer
    if (seconds < 10) {
      timer.textRenderer.setText(minutes + ":0" + seconds);
    }
    else {
      timer.textRenderer.setText(minutes + ":" + seconds);
    }
  }
  
  // Add points to the ship score
  export function addPoints(ship1: boolean, points: number){
    // If ship1 is true, add points to ship1
    if(ship1){
      Sup.getActor("Ship1").getBehavior(ShipBehavior).score += points;
    }
    // If ship1 is false, add points to ship2
    else {
      Sup.getActor("Ship2").getBehavior(ShipBehavior).score += points;
    }
  }
  
  // Update the score HUD with the score for ship 1 or optionally for ship2
  export function updateHUDScore(score1:number, score2?:number) {
    // Change the score text displayed on HUD with the new score
    Sup.getActor("HUD").getChild("UIShip1").getChild("Score").textRenderer.setText(score1);
    // If there is a score 2, do the same for the HUD of ship 1 and ship 2
    if(score2){
        Sup.getActor("HUD").getChild("UIShip1").getChild("Score").textRenderer.setText(score1);
        Sup.getActor("HUD").getChild("UIShip2").getChild("Score").textRenderer.setText(score2);
    }
    // Set flag to false
    Game.checkScoreHUD = false;
  }
  
  // Update the life HUD
  export function updateHUDLife(life1:number, life2:number){
    /*
    Explanation of life 
    */
    // If the game is Asteroids
    if (Game.nameIndex === 0){
      // Update the player Ship life
      for (let i = 0; i < Ships.startLife; i++) {
        let heart = Sup.getActor("HUD").getChild("UIShip1").getChild("Life").getChild(i.toString());
        heart.spriteRenderer.setAnimation(hearts[life1][i]);
      }

      // Update the alien life
      for (let i = 0; i < Alien.startLife; i++) {
        let heart = Sup.getActor("HUD").getChild("UIAlien").getChild(i.toString());
        heart.spriteRenderer.setAnimation(hearts[life2][i]);
      }      
    }
    
    if (Game.nameIndex === 1){
      // player1 life
      for (let i = 0; i < Ships.startLife; i++) {
        let heart = Sup.getActor("HUD").getChild("UIShip1").getChild("Life").getChild(i.toString());
        heart.spriteRenderer.setAnimation(hearts[life1][i]);
      }
      
      // player2 life
      for (let i = 0; i < Ships.startLife; i++) {
        let heart = Sup.getActor("HUD").getChild("UIShip2").getChild("Life").getChild(i.toString());
        heart.spriteRenderer.setAnimation(hearts[life2][i]);
      }
    }
    // Set false to flag checkLifeHUD
    Game.checkLifeHUD = false;
  }
  
  // Load the gameOver screen and display score
  export function gameOver(winner: string){
    // Initialize variables
    let score1: number;
    let score2: number;
    // Store the ship1 score before to leave the scene
    score1 = Sup.getActor("Ship1").getBehavior(ShipBehavior).score;
    // If the game is spacewar, stock also the Ship2 score
    if (nameIndex === 1) {
      score2 = Sup.getActor("Ship2").getBehavior(ShipBehavior).score;
    }
    // Close game scene and load menu scene
    Sup.loadScene("Menu/Scene");
    // Set game over Screen
    Sup.getActor("Menu").getBehavior(MenuBehavior).setScreen(Menu.screens.gameover);
    // Get in a variable gameOverScreen the gameover screen actor
    let gameOverScreen = Sup.getActor("Screens").getChild(Menu.screens.gameover.toString());
    // Set the Sprite from the actor to display the winner frame
    gameOverScreen.spriteRenderer.setAnimation(winner);
    // Display Score
    // Set title visible false
    Sup.getActor("Title").setVisible(false);
    // Get the Score actor in a variable
    let score: Sup.Actor = Sup.getActor("Score");
    // Set the Score actor visible
    score.setVisible(true);
    // Set the score text to the current score of ship1
    score.getChild("Ship1").textRenderer.setText("Ship1:"+score1);
    // If the game is spacewar
    if (nameIndex === 1) {
      // Set visible true the score of Ship2
      score.getChild("Ship2").setVisible(true);
      // Set the score text to the current score of ship2
      score.getChild("Ship2").textRenderer.setText("Ship2:"+score2);
      
    }
    else {
      // Set visible false the ship2 score
      score.getChild("Ship2").setVisible(false);
    }
  }
}
  
// Menu datas
namespace Menu{
  
  // Different menu screen index
  export const screens = {
      main : "Main",
      asteroids : "Asteroids",
      spacewar : "Spacewar",
      gameover : "GameOver",
     }
  
  // Game names index
  export enum names {
        Asteroids = 0,
        Spacewar = 1,
       }
}
  
// Ship datas
namespace Ships{
  // Default ship size
  export const size: number = 0.5;
  // Default ship collision radius
  export const amplitude: number = 1.5;
  // Starting ship score
  export const startScore: number = 0;
  // Starting ship life
  export const startLife: number = 3;
  
  // Starting spawn positions
  export const spawns: Sup.Math.Vector3[] = [
    new Sup.Math.Vector3(0, 0, 14), // ship1 for asteroids game
    new Sup.Math.Vector3(-4, -12, 2), // ship1 for spacewar game
    new Sup.Math.Vector3(4, 12, 4) // ship1 for spacewar game
  ] 
  
  // ship index
  export enum index {
    ship1 = 0,
    ship2 = 1
    };
  
  // Starting time before next shoot
  export const shootingTimer: number = 30;
  // Starting time before respawn
  export const respawnTimer: number = 180;
  // Starting time before vulnerability
  export const invincibleTimer: number = 200;
  
  // Linear speed
  export const linearAcceleration: number = 0.005;
  // Linear slowing down
  export const linearDamping: number = 0.97;
  
  // Rotation speed
  export const angularAcceleration: number = 0.02;
  // Rotation slowing down
  export const angularDamping: number = 0.75;
  
  // Commands for each ship by index
  export const commands = [
    {left:"LEFT", right:"RIGHT", forward:"UP", shoot:"CONTROL", boost:"SHIFT"}, // commands[0]
    {left:"A", right:"D", forward:"W", shoot:"SPACE", boost:"C"} // commands[1]
  ];
  
  // Missiles list for each ship by index
  export let missiles: Sup.Actor[][];
  // Starting missile life before destruction (frames)
  export const missileLife: number = 60;
  // Missile speed (unit/frame)
  export const missileSpeed: number = 0.30;
}


// Alien datas
namespace Alien{
  // Flag for alien alive
  export let alive: boolean = true;
  
  // Starting alien life
  export const startLife: number = 5;
  // Current alien life
  export let lifes: number;
  
  // Alien z position
  export const zPosition: number = 12;
  
  // Different alien sizes
  export const sizes: number[] = [1.7, 1.3, 1];
  // Different collision amplitude related to size
  export const amplitudes: number[] = [2.5, 2.2, 2];
  
  // Linear and rotation speed of alien ship
  export let linearSpeed: number = 0.05;
  export let rotationSpeed: number = 0.01;
  
  // Starting time before alien ship respawn
  export const respawnTime: number = 300;
  // Current time befer alien ship respawn
  export let spawnTimer: number = 0;
  
  // Starting time before alien ship shoot again
  export const shootTime: number = 200;
  
  // Alien missile list
  export let missiles: Sup.Actor[];
  // Alien missile speed (unit/frame)
  export const missileSpeed: number = 0.05;
}
  
// Asteroids datas
namespace Asteroids{
  // List of all current asteroids
  export let list: Sup.Actor[];
  
  // Differents size of asteroids
  export const sizes = {"big":1.5, "medium":1, "small":0.5};
  // Different collision amplitude related to size
  export const amplitudes = {"big":2.5, "medium":2, "small":1}
  
  // Range for Z positions of asteroids
  export enum zPositions {min = -28, max = 10};
  
  // Starting asteroids number
  export const startCount: number = 5;
  // Current asteroids number
  export let currentCount: number;
  // Maximum asteroids number
  export const maxCount: number = 10;
  
  // Range of linear and rotation speed of asteroids
  export enum linearSpeed {min = -0.05, max = 0.05};
  export enum rotationSpeed {min = -0.01, max = 0.01};
  
  // Starting time before asteroids spawning
  export const respawnTime: number = 180;
  // Current time before asteroids spawning
  export let spawnTimer: number = 0;
}