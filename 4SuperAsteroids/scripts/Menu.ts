class MenuBehavior extends Sup.Behavior {
  // The current menu screen
  screen: string;
  // Ray casting
  ray = new Sup.Math.Ray();
  // First button
  button0: Sup.Actor;
  // Second button
  button1: Sup.Actor;

  awake() {
    // Set the menu with the Main screen
    this.setScreen(Menu.screens.main);
    // Update the buttons
    this.updateButtonsText();
  }
  
  setScreen(screenName: string){
    // Set the current screen to the screen string Name
    this.screen = screenName;
    // Loop through all the screen of the scene and set visible the current screen
    for(let screen in Menu.screens){
      // If the screen of the loop is the same as the current screen
      if (Menu.screens[screen] == this.screen){
        // Set visible true the screen
        Sup.getActor("Screens").getChild(Menu.screens[screen]).setVisible(true);
      }
      // Else, hide the screen, set visible false
      else {
        Sup.getActor("Screens").getChild(Menu.screens[screen]).setVisible(false);
      }
    }
    // call the function updateTitle
    this.updateTitle();
  }
  
  updateTitle(){
    // Set title visible true
    Sup.getActor("Title").setVisible(true);
    // Set score visible false
    Sup.getActor("Score").setVisible(false);
    // Change the title depending if the game is asteroids or spacewar
    if(this.screen === Menu.screens.asteroids|| this.screen === Menu.screens.spacewar){
      Sup.getActor("Title").getChild("Text2").textRenderer.setText(this.screen);
    }
    // Else, it change the title with an empty string
    else{
      Sup.getActor("Title").getChild("Text2").textRenderer.setText("");
    }
  }

  updateButtonsText() {
    // Get the two buttons actors in one variable each
    this.button0 = Sup.getActor("Buttons").getChild("Button1");
    this.button1 = Sup.getActor("Buttons").getChild("Button2");
    // If it is the Main screen
    if(this.screen === Menu.screens.main){
      // Set the button to display the game name
      this.button0.getChild("Text").textRenderer.setText("asteroids");
      this.button1.getChild("Text").textRenderer.setText("spacewar");
    }
    // For the other screens
    else {
      // Set the button to display start and return
      this.button0.getChild("Text").textRenderer.setText("start");
      this.button1.getChild("Text").textRenderer.setText("return");
    }
  }

  update() {
    // Update the position of the raycaster of the mouse
    this.ray.setFromCamera(Sup.getActor("Camera").camera, Sup.Input.getMousePosition());
    // Return an object if the raycaster intersect the actor buttons
    let hitB1 = this.ray.intersectActor(this.button0.getChild("Sprite"));
    let hitB2 = this.ray.intersectActor(this.button1.getChild("Sprite"));
    
    // If the button 1 is hovered
    if(hitB1[0]){
      // Change the opacity of the button to full bright
      this.button0.getChild("Sprite").spriteRenderer.setOpacity(1);
      // If the left mouse button is pressed
      if (Sup.Input.wasMouseButtonJustPressed(0)) {
        Sup.Audio.playSound("Sounds/shipShot");
        // Differents case possible depending the current screen
        switch (this.screen){
          // If the current screen is the Main screen
          case Menu.screens.main:
            // Set the new screen to Asteroids screen
            this.setScreen(Menu.screens.asteroids);
            break;
          // If the current screen is the Asteroid screen
          case Menu.screens.asteroids:
            // Set the nameIndex to 0
            Game.nameIndex = Menu.names.Asteroids;
            // Start the game
            Game.start();
            return;
          // If the current screen is the Spacewar screen
          case Menu.screens.spacewar:
            // Set the nameIndex to 1
            Game.nameIndex = Menu.names.Spacewar;
            // Start the game
            Game.start();
            return;
          // If the current screen is the Game Over screen
          case Menu.screens.gameover:
            // Restart the game
            Game.start();
            return;
        }
      }
    }
    // If the button is not hovered, set opacity half bright
    else{
      this.button0.getChild("Sprite").spriteRenderer.setOpacity(0.5); 
    }
    
    // If the button 2 is hovered
    if(hitB2[0]){
      // Change the opacity of the button to full bright
      this.button1.getChild("Sprite").spriteRenderer.setOpacity(1);
      // If the left mouse button is pressed
      if (Sup.Input.wasMouseButtonJustPressed(0)) {
        Sup.Audio.playSound("Sounds/shipShot");
        // Loop through different case
        switch (this.screen){
          // If the current screen is the Main screen
          case Menu.screens.main:
            // Set the screen of the Spacewar game screen
            this.setScreen(Menu.screens.spacewar);
            break;
            // Else, in other case, return to main screen
          default:
            this.setScreen(Menu.screens.main);
        }
      }
    }
    // If the button is not hovered, set opacity half bright
    else{
      this.button1.getChild("Sprite").spriteRenderer.setOpacity(0.5);
    }
    // Update the buttons
    this.updateButtonsText();
  }
}
Sup.registerBehavior(MenuBehavior);
