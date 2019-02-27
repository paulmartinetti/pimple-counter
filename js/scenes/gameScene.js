// create a new scene
let gameScene = new Phaser.Scene('Game');

/* game flow
*  
*  depths
*   1. hide lesions 10
*   2. photo 20
*   3. show lesions 30
*   4. rings 40
*   
*   dims
*   ring = 57px
*   lesion = 57px
*   order = black, red, brown
*/

// some parameters for our scene
gameScene.init = function () {

    this.gameW = this.sys.game.config.width;
    this.gameH = this.sys.game.config.height;

    // lesions are found by mousing over photo
    this.dataA = [{
        x: 131,
        y: 338,
        d: 8,
        frame: 1,
        label: 'red',
        desc: 'a papule'
    }, {
        x: 125,
        y: 482,
        d: 8,
        frame: 1,
        label: 'red',
        desc: 'a papule'
    }, {
        x: 161,
        y: 467,
        d: 6,
        frame: 1,
        label: 'red',
        desc: 'a papule'
    }, {
        x: 234,
        y: 525,
        d: 6,
        frame: 1,
        label: 'red',
        desc: 'a papule'
    }, {
        x: 292,
        y: 513,
        d: 8,
        frame: 1,
        label: 'red',
        desc: 'a papule'
    }, {
        x: 583,
        y: 421,
        d: 8,
        frame: 1,
        label: 'red',
        desc: 'a pustule'
    }, {
        x: 470,
        y: 475,
        d: 10,
        frame: 2,
        label: 'brown',
        desc: 'a healing lesion'
    }, {
        x: 304,
        y: 390,
        d: 10,
        frame: 2,
        label: 'brown',
        desc: 'a healing lesion'
    }, {
        x: 260,
        y: 316,
        d: 6,
        frame: 0,
        label: 'black',
        desc: 'an open comedone'
    }];
    
    // lesion depths
    this.hideLesions = 10;
    this.showLesions = 30;
    this.countBlock = false;

    // define ring (spritesheet is called ring)
    // add to this as user clicks
    this.ringA = [];
    // var active = true / false
};

// executed once, after assets were loaded
gameScene.create = function () {

    // set bg and make interactive
    let photo = this.add.sprite(0, 0, 'photo').setOrigin(0, 0).setInteractive();
    photo.setDepth(20);

    // listen on photo - the 'on' fn is available after setInteractive()
    // bc we're not changing photo, we can pass scene context 'this'
    photo.on('pointerdown', this.placeLesion, this);

    // add a group of lesions
    let tempA = [];
    let len = this.dataA.length;
    for (let i = 0; i < len; i++) {
        //let obj = this.add.sprite(this.dataA.x, this.dataA.y, 'ring', 0);
        let obj = {
            key: 'ring',
            setXY: {
                x: this.dataA[i].x,
                y: this.dataA[i].y,
            },
        };
        tempA.push(obj);
    }
    this.lesionA = this.add.group(tempA).getChildren();
    // now add custom and common properties to spritesheet objects
    for (let i = 0; i < len; i++) {
        // d = diameter
        this.lesionA[i].setDisplaySize(40, 40);
        this.lesionA[i].depth = this.hideLesions;
        //this.lesionA[i].depth = this.showLesions;
        //this.lesionA[i].alpha = 0.4;
        this.lesionA[i].label = this.dataA[i].label;
        this.lesionA[i].desc = this.dataA[i].desc;
        this.lesionA[i].setFrame(this.dataA[i].frame);
    }
    //console.log(this.lesionA);

    // make show / hide toggle
    this.btn = this.add.sprite(this.gameH-150, 50, 'btn', 0);
    this.btn.setDepth(21);
    this.btn.setInteractive();
    this.btn.on('pointerup',this.togShowHide);

};

// fn context - Scene
gameScene.togShowHide = function () {

    console.log(this.frame.name);
    //this.setFrame(1);

   if (this.frame.name==0) {
        // on hide
        this.setFrame(1);
        this.scene.lesionA.forEach(lesion => {
            lesion.depth = this.showLesions;
        });
        this.scene.countBlock = true;
   } else if (this.frame.name == 1) {
        this.setFrame(0);
        this.scene.lesionA.forEach(lesion => {
            lesion.depth = this.hideLesions;
        });
        this.scene.countBlock = false;
    }

};


// fn context = Scene not Sprite (bg) passed 'this' in on();
gameScene.placeLesion = function (pointer, localX, localY) {
    
    // no counting while viewing answers
    if (this.countBlock) return;

    // var 'pointer' shows game scene coordinates (and lots of info!)
    // vars localX, localY show coordinates of object selected
    // with our bg, it's the same in this case
    //console.log(pointer);

    // place lesion
    let thisRing = this.add.sprite(localX, localY, 'ring', 0).setInteractive();
    thisRing.depth = 40;
    thisRing.active = true;

    // handle subsequent clicks - black, red, brown, off
    thisRing.on('pointerdown',this.updateRing);

    // store for scoring tog
    this.ringA.push(thisRing);

    // move this.pet to newItem (set in create fn)
    // onComplete is the callback fn
    // tween is inside scene context (passed 'this' from btn)
    /* let petTween = this.tweens.add({
        targets: this.pet,
        duration: 500,
        x: newItem.x,
        y: newItem.y,
        paused: false,
        callbackScope: this,
        onComplete: function (tween, sprites) {

            // make newItem disappear
            newItem.destroy();

             */
};

// context = clicked Sprite
gameScene.updateRing = function () {

    // no counting while viewing answers
    if (this.scene.countBlock) return;

    console.log('updateRing');

    // switch
    switch(this.frame.name){
        case 0:
        // to red
        this.setFrame(1);
        break;

        case 1:
        // to brown
        this.setFrame(2);
        break;

        case 2:
        this.x = -100;
        this.y = -100;
        this.active = false;

    }

    //console.log(this.scene.ringA[0].active);

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
