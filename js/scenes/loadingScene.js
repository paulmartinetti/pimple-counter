// create a new scene
let loadingScene = new Phaser.Scene('Loading');

// preload
// load asset files for our game
// ALL scenes have access to these objects!
loadingScene.preload = function () {

    // 
    let gameW = this.sys.game.config.width;
    let gameH = this.sys.game.config.height;

    // test data load
    //this.load.setCORS('anonymous');
    //this.crossOrigin('anonymous);
    // data used in gameScene
    this.load.json('myjson','http://localhost:3003/users');

    // loaded in bootScene
    //let logo = this.add.sprite(gameW / 2, 250, 'logo');

    // progress bar bg
    let bgBar = this.add.graphics();
    let barW = 150;
    let barH = 30;

    // for graphics objs, the default origin is top-left
    bgBar.setPosition(gameW / 2 - barW / 2, gameH / 2 - barH / 2);
    // color, alpha (0-1)
    bgBar.fillStyle(0xF5F5F5, 1);
    bgBar.fillRect(0, 0, barW, barH);

    // progress bar
    let progressBar = this.add.graphics();
    progressBar.setPosition(gameW / 2 - barW / 2, gameH / 2 - barH / 2);

    // listen to progress event
    // value = 0-1 of loaded
    this.load.on('progress', function (value) {

        // clear the bar so we can draw it again
        progressBar.clear();

        // set style
        progressBar.fillStyle(0x9AD98D);

        // draw with updated 'value'
        progressBar.fillRect(0, 0, (barW * value), barH);

    }, this);


    // load assets (can be accessed from different scenes)
    this.load.image('bg', 'assets/images/homeBg.png');
    this.load.image('photo', 'assets/images/LC-710x630.jpg');
    //this.load.image('ring', 'assets/images/ring57-175x59.png');

    // load ring spritesheet
    // params - key, filename, specs
    //https://github.com/photonstorm/phaser/blob/master/src/textures/parsers/SpriteSheet.js
    this.load.spritesheet('ring', 'assets/images/ring57-175x59.png', {
        frameWidth: 57,
        frameHeight: 57,
        startFrame: 0,
        endFrame: 2,
        margin: 1,
        spacing: 1,
        frameNum: 0
    });
    // 150 x 35
    this.load.spritesheet('btn', 'assets/images/showhide.png', {
        frameWidth: 70,
        frameHeight: 32,
        startFrame: 0,
        endFrame: 1,
        margin: 1,
        spacing: 1,
        frameNum: 0
    });
    /* this.load.spritesheet('lesion', 'assets/images/lesion.png', {
        frameWidth: 57,
        frameHeight: 57,
        startFrame: 0,
        endFrame: 2,
        margin: 1,
        spacing: 1
    }); */

    // TESTING ONLY - to watch progress bar grow
    //for (let i=0;i<500;i++){
    //    this.load.image('test'+i, 'assets/images/candy.png');
    //}
};

loadingScene.create = function () {
    
    //
    // animation of spritesheet - animations are global (available in multiple scenes)
    // to loop forever, repeat: -1
    // key name is arbitrary
    /* this.anims.create({
        key: 'severities',
        frames: this.anims.generateFrameNames('lesion', { frames: [1, 2, 3] }),
        frameRate: 7,
        yoyo: true,
        repeat: 0
    }); */

    // 

    // ready to offer game
    this.scene.start('Home');

};