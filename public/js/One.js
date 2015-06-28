(function(Game) {
  Game.One = function(game) {};

  var points = 0;
  var game = Game.One;

  Game.One.prototype.preload = function() {
    var game = this;

    game.load.image('stars', 'starfield.jpg');
    game.load.image('ship', 'player.png');
    game.load.image('carbonator', 'pipe.png');

    //CARBS
    game.load.image('rice', 'rice.png');
    game.load.image('peanut', 'peanut.png');
    game.load.image('cornflakes', 'cornflakes.png');
    game.load.image('pasta', 'pasta.png');
    game.load.image('corn', 'corn.png');
    game.load.image('bread', 'bread (1).png');
    game.load.image('cake', 'cake.png');
    game.load.image('crisps', 'crisps.png');

    //NONCARBS
    game.load.image('orange', 'orange.png');
    game.load.image('salad', 'salad.png');
    game.load.image('fish', 'fish.png');
    game.load.image('broccoli', 'broccoli.png');
    game.load.image('cheese', 'cheese.png');
    game.load.image('eggs', 'eggs.png');
    game.load.image('banana', 'banana.png');
    game.load.image('sausage', 'sausage.png');


  }

  var sprite;
  var cursors;
  var carbs;
  var nonCarbs;
  var text;
  var carbonator;
  var starfield;

  Game.One.prototype.create = function() {

    var game = this;

    var carbImages = [{
      label: 'rice',
      carbs: 0
    }, {
      label: 'peanut',
      carbs: 0
    }, {
      label: 'cornflakes',
      carbs: 0
    }, {
      label: 'pasta',
      carbs: 0
    }, {
      label: 'corn',
      carbs: 0
    }, {
      label: 'bread',
      carbs: 0
    }, {
      label: 'cake',
      carbs: 0
    }, {
      label: 'crisps',
      carbs: 0
    }];
    var nonCarbImages = ['orange', 'salad', 'fish', 'broccoli', 'eggs', 'cheese', 'banana', 'sausage'];



    starfield = game.add.tileSprite(0, 0, 1200, 600, 'stars');
    starfield.fixedToCamera = true;
    //  Enable P2
    game.physics.startSystem(Phaser.Physics.P2JS);

    //  Turn on impact events for the world, without this we get no collision callbacks
    game.physics.p2.setImpactEvents(true);

    game.physics.p2.restitution = 0.8;

    //  Create our collision groups. One for the player, one for the pandas
    var playerCollisionGroup = game.physics.p2.createCollisionGroup();
    var carbsCollisionGroup = game.physics.p2.createCollisionGroup();
    var nonCarbsCollisionGroup = game.physics.p2.createCollisionGroup();
    var carbonatorCollisionGroup = game.physics.p2.createCollisionGroup();

    //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
    //  (which we do) - what this does is adjust the bounds to use its own collision group.
    game.physics.p2.updateBoundsCollisionGroup();

    carbonator = game.add.sprite(1100, 300, 'carbonator');
    carbonator.scale.set(0.7, 1);
    game.physics.p2.enable(carbonator, false);
    carbonator.body.setCollisionGroup(carbonatorCollisionGroup);
    carbonator.body.static = true;
    carbonator.body.fixedRotation = true;
    carbonator.body.collides(carbsCollisionGroup, carbonatorHit, this);
    carbonator.body.collides(nonCarbsCollisionGroup, carbonatorHit, this);

    text = game.add.text(5, 5, 'Points: 0', {
      fill: '#ffffff',
      font: '14pt Arial'
    });


    carbs = game.add.group();
    carbs.enableBody = true;
    carbs.physicsBodyType = Phaser.Physics.P2JS;

    nonCarbs = game.add.group();
    nonCarbs.enableBody = true;
    nonCarbs.physicsBodyType = Phaser.Physics.P2JS;

    for (var i = 0; i < 4; i++) {
      var image = carbImages[Math.floor(Math.random() * carbImages.length)];
      var rice = carbs.create(game.rnd.integerInRange(100, 400), game.rnd.integerInRange(0, 570), image.label);
      rice.body.setRectangle(100, 100);
      rice.name = 'carb'
      rice.carbs = image.carbs;
      rice.width = 100;
      rice.height = 100;
      rice.body.setCollisionGroup(carbsCollisionGroup);
      rice.body.collides([nonCarbsCollisionGroup, carbsCollisionGroup, playerCollisionGroup, carbonatorCollisionGroup]);
    }

    for (var i = 0; i < 4; i++) {
      var image = nonCarbImages[Math.floor(Math.random() * nonCarbImages.length)];
      var orange = nonCarbs.create(game.rnd.integerInRange(100, 400), game.rnd.integerInRange(0, 570), image);
      orange.body.setRectangle(40, 40);
      orange.name = 'nonCarb';
      orange.width = 40;
      orange.height = 40;
      orange.body.setCollisionGroup(nonCarbsCollisionGroup);
      orange.body.collides([carbsCollisionGroup, nonCarbsCollisionGroup, playerCollisionGroup, carbonatorCollisionGroup]);
    }

    //  Create our ship sprite
    ship = game.add.sprite(200, 200, 'ship');
    ship.scale.set(0.2);
    ship.smoothed = false;
    ship.animations.add('fly', [0, 1, 2, 3, 4, 5], 10, true);
    ship.play('fly');

    game.physics.p2.enable(ship, false);
    ship.body.setRectangle(114, 86);
    ship.body.fixedRotation = true;

    //  Set the ships collision group
    ship.body.setCollisionGroup(playerCollisionGroup);

    //  The ship will collide with the pandas, and when it strikes one the hitPanda callback will fire, causing it to alpha out a bit
    //  When pandas collide with each other, nothing happens to them.
    ship.body.collides(carbsCollisionGroup, hitPanda, this);
    ship.body.collides(nonCarbsCollisionGroup, hitPanda, this);

    game.camera.follow(ship);

    cursors = game.input.keyboard.createCursorKeys();

	showInstructions.call(this, "Put the carbs into the Carb-inator.\nCareful though - it can't eat anything else!");
  }

  function hitPanda() {}

  function carbonatorHit(body1, body2) {
    body2.sprite.kill();
    points += {
      carb: 1,
      nonCarb: -1
    }[body2.sprite.name]
    if (carbs.countLiving() == 0) {
      Game.levelProgress++;
      this.state.start('Menu');
    }

  }

  Game.One.prototype.update = function() {


    ship.body.setZeroVelocity();

    text.setText('Points: ' + points);

    if (cursors.left.isDown) {
      ship.body.moveLeft(200);
    } else if (cursors.right.isDown) {
      ship.body.moveRight(200);
    }

    if (cursors.up.isDown) {
      ship.body.moveUp(200);
    } else if (cursors.down.isDown) {
      ship.body.moveDown(200);
    }



  }
})(Game);
