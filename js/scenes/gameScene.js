// create a new scene
let gameScene = new Phaser.Scene('Game');

/* game flow
*  
*  depths
*   1. lesions 1 - 39
*   2. photo 40
*   3. rings 50+
*
*   dims
*   ring = 57px
*
*
*/

// some parameters for our scene
gameScene.init = function () {

    // define lesions
    this.lesionA = [{
        x: 130,
        y: 338,
        d: 8,
        label: 'red'
    }];
    // lesions are found by mousing over photo

    // define ring (spritesheet is called ring)
    this.ringA = [];
};

// executed once, after assets were loaded
gameScene.create = function () {

    // set bg and make interactive
    let photo = this.add.sprite(0, 0, 'photo').setOrigin(0, 0).setInteractive();

    // listen on photo - the 'on' fn is available after setInteractive()
    // bc we're not changing photo, we can pass scene context 'this'
    photo.on('pointerdown', this.placeLesion, this);

    // add a ring, make it interactive
    let frameNum = 0;

    for (let i = 0; i < this.lesionA.length; i++) {
        let rect = this.add.graph
    }

    // make pet draggable
    // access the input object of this scene
    //this.input.setDraggable(this.pet);

    // define dragging fns - follow the mouse pointer
    /* this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        // make sprite follow pointer
        gameObject.x = dragX;
        gameObject.y = dragY;
        // to capture the name of the object being dragged
        //console.log(gameObject.texture.key);
    }); */

    // diplay stats - Heads-up display
    //this.createHud();
    // show initial values
    //this.refreshHud();

};

// fn context - Scene
gameScene.createUI = function () {

    //this.candyBtn = this.add.sprite(144, 570, 'candy').setInteractive();
    //this.candyBtn.customStats = { health: -10, fun: 10 };
    //this.candyBtn.on('pointerdown', this.pickItem);

};


// fn context = Scene not Sprite (bg) passed 'this' in on();
gameScene.placeLesion = function (pointer, localX, localY) {

    // var 'pointer' shows game scene coordinates (and lots of info!)
    // vars localX, localY show coordinates of object selected
    // with our bg, it's the same in this case
    //console.log(pointer);
    console.log(Math.round(localX), Math.round(localY));
    return;

    let tRing = this.add.sprite(this.lesionA[i].x, this.lesionA[i].y, 'ring', frameNum).setInteractive();
    /
    this.tRing.depth = 1;
    // create a new item in the position where user clicked
    let newItem = this.add.sprite(localX, localY, this.selectedItem.texture.key)

    // block UI while pet goes to eat selectedItem
    this.uiBlocked = true;

    // move this.pet to newItem (set in create fn)
    // onComplete is the callback fn
    // tween is inside scene context (passed 'this' from btn)
    let petTween = this.tweens.add({
        targets: this.pet,
        duration: 500,
        x: newItem.x,
        y: newItem.y,
        paused: false,
        callbackScope: this,
        onComplete: function (tween, sprites) {

            // make newItem disappear
            newItem.destroy();

            // listen for chewing to finish before unlocking ui
            this.pet.on('animationcomplete', function () {

                // put pet face back to frame 0
                // use setFrame after obj is created (instead of .frame())
                this.pet.setFrame(0);

                // to limit placing one item, null selectedItem, reset ui
                // this must follow stats update that needs selectedItem
                this.uiReady();
                // pass scene context (this)
            }, this);

            // newItem is reached, so play chewing animation
            this.pet.play('funnyfaces');

            // update stats (final implementation)
            this.updateStats(this.selectedItem.customStats);

        }
    });
};

// heads up display
gameScene.createHud = function () {
    // health stat
    this.healthText = this.add.text(20, 20, 'Health: ', {
        font: '24px Arial',
        fill: '#ffffff'
    }
    );
    // fun stat
    this.funText = this.add.text(170, 20, 'Fun: ', {
        font: '24px Arial',
        fill: '#ffffff'
    }
    );
};

// update stats display
gameScene.refreshHud = function () {
    this.healthText.setText('Health: ' + this.stats.health);
    this.funText.setText('Fun: ' + this.stats.fun);
};

// update stats data
// statDiff is the this.selectedItem.customStats obj
gameScene.updateStats = function (statDiffObj) {
    // update health - bc only two properties can do manually
    //this.stats.health += statDiffObj.health;
    //this.stats.fun += statDiffObj.fun;
    //
    //console.log(this.stats.health);
    let isGameOver = false;

    // update health if there are lots of inconsistent properties
    // e.g. some don't have health, some don't have fun..
    // the var 'stat' is like each or index, made-up
    for (stat in statDiffObj) {
        // if property is only in selectedItem...
        // to avoid inherited properties from __prototype__
        if (statDiffObj.hasOwnProperty(stat)) {
            // increment
            this.stats[stat] += statDiffObj[stat];

            // prevent stats from below 0
            if (this.stats[stat] < 0) {
                isGameOver = true;
                this.stats[stat] = 0;
            }
        }
    }
    // refresh hud
    this.refreshHud();

    //
    if (isGameOver) this.gameOver();
};

gameScene.gameOver = function () {

    // block ui
    this.uiBlocked = true;

    // change the frame of the pet to dead
    this.pet.setFrame(4);

    // scope inside fn is the fn
    // to access scene to restart, use callbackScope 'this'
    this.time.addEvent({
        delay: 2000,
        repeat: 0,
        callback: function () {
            // restart scene
            this.scene.start('Home');
        },
        callbackScope: this
    });

    // 
    //console.log('game over');
};
