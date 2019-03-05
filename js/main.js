
// our game's configuration
// backgroundColor - game only
let config = {
  type: Phaser.AUTO,
  width: 710,
  height: 630,
  scene: [bootScene, loadingScene, homeScene, gameScene],
  title: 'Lesion counter',
  pixelArt: false,
  backgroundColor: 'ffffff',
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
