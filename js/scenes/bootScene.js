// create a new scene
let bootScene = new Phaser.Scene('Boot');

// boot is what users see during preload
//bootScene.preload = function () {
    // usually just a tiny logo
    //this.load.image('logo','assets/images/rubber_duck.png');
//};

// 
bootScene.create = function(){
    this.scene.start('Loading');
};