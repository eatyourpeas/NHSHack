function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

var IDE_HOOK = false;
var test;
var points = 0;
var shield = false;
var graphics;

Game.Three = function(game) {};

var game = Game.Three;

Game.Three.prototype.preload = function() {

  this.load.spritesheet('buttonvertical', 'button-vertical.png', 64, 64);
  this.load.spritesheet('buttonhorizontal', 'button-horizontal.png', 96, 64);
  this.load.spritesheet('buttondiagonal', 'button-diagonal.png', 64, 64);
  this.load.spritesheet('buttonfire', 'button-round-a.png', 96, 96);
  this.load.spritesheet('buttonjump', 'button-round-b.png', 96, 96);

  this.load.image('crumbs', 'crumbs.png');
  this.load.image('stars', 'starfield.jpg');
  this.load.image('ship', 'player.png');
  this.load.image('commanderkeytone', 'commanderkeytone.png');
  this.load.image('carbonator', 'pipe.png');
  this.load.image('needle', 'needle.png');

  //BS Dials
  this.load.image('normal', 'normal.png');
  this.load.image('ketone', 'ketone.png');
  this.load.image('high', 'high.png');

  //CARBS
  this.load.image('rice', 'rice.png');
  this.load.image('peanut', 'peanut.png');
  this.load.image('cornflakes', 'cornflakes.png');
  this.load.image('pasta', 'pasta.png');
  this.load.image('corn', 'corn.png');
  this.load.image('bread', 'bread.png');
  this.load.image('cake', 'cake.png');
  this.load.image('crisps', 'crisps.png');

  //NONCARBS
  this.load.image('orange', 'orange.png');
  this.load.image('salad', 'salad.png');
  this.load.image('fish', 'fish.png');
  this.load.image('broccoli', 'broccoli.png');
  this.load.image('cheese', 'cheese.png');
  this.load.image('eggs', 'eggs.png');
  this.load.image('banana', 'banana.png');
  this.load.image('sausage', 'sausage.png');
}

var carbCount;
var CarbCountTween;
var score = 0;
var ckCollisionGroup;
var carbsCollisionGroup;
var nonCarbsCollisionGroup;
var lastfire;
var lastuse;
var sprite;
var cursors;
var carbs;
var nonCarbs;
var text;
var carbonator;
var starfield;
var insulin = 0;
var bsLevel = 0;
var keytones;
var bsDial;
var fire;
var use;
var up;
var down;
var emitter;
var bsLevels = [
  'normal',
  'high',
  'ketone'
];
var difficulty = 1;

var carbImages = [{
  label: 'rice',
  carbs: 20
}, {
  label: 'peanut',
  carbs: 0
}, {
  label: 'cornflakes',
  carbs: 30
}, {
  label: 'pasta',
  carbs: 50
}, {
  label: 'corn',
  carbs: 8
}, {
  label: 'bread',
  carbs: 15
}, {
  label: 'cake',
  carbs: 45
}, {
  label: 'crisps',
  carbs: 20
}];
var nonCarbImages = ['orange', 'salad', 'fish', 'borccoli', 'eggs', 'cheese', 'banana', 'sausage'];

var useInsulin = function() {
  if (insulin) {
    if (bsLevel > 0)
      bsLevel--;
    insulin--;
    shield = true;
  }
};

setInterval(function() {
  if (bsLevel == 4)
    keytones++;
}, 2000);

Game.Three.prototype.create = function() {
  var background = this.add.tileSprite(
    0,
    0,
    1280,
    720,
    'stars'
  );

  // Scroll
  background.autoScroll(-400,
    0
  );

  //starfield = this.add.tileSprite(0, 0, 800, 600, 'stars');
  //starfield.fixedToCamera = true;
  //  Enable P2
  this.physics.startSystem(Phaser.Physics.P2JS);

  //  Turn on impact events for the world, without this we get no collision callbacks
  this.physics.p2.setImpactEvents(true);

  this.physics.p2.restitution = 0.8;

  //  Create our collision groups. One for the player, one for the pandas
  playerCollisionGroup = this.physics.p2.createCollisionGroup();
  carbsCollisionGroup = this.physics.p2.createCollisionGroup();
  nonCarbsCollisionGroup = this.physics.p2.createCollisionGroup();
  ckCollisionGroup = this.physics.p2.createCollisionGroup();

  //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
  //  (which we do) - what this does is adjust the bounds to use its own collision group.
  //this.physics.p2.updateBoundsCollisionGroup();

  carbs = this.add.group();
  carbs.enableBody = true;
  carbs.physicsBodyType = Phaser.Physics.P2JS;

  nonCarbs = this.add.group();
  nonCarbs.enableBody = true;
  nonCarbs.physicsBodyType = Phaser.Physics.P2JS;

  /*for (var i = 0; i < 4; i++) {
    var image = carbImages[Math.floor(Math.random() * carbImages.length)];
    var rice = carbs.create(this.rnd.integerInRange(100, 400), this.rnd.integerInRange(0, 570), image.label);
    rice.body.setRectangle(40, 40);
    rice.name = 'carb'
    rice.carbs = image.carbs;
    rice.width = 40;
    rice.height = 40;
    rice.body.setCollisionGroup(carbsCollisionGroup);
    rice.body.collides([nonCarbsCollisionGroup, carbsCollisionGroup, playerCollisionGroup, carbonatorCollisionGroup]);
  }

  for (var i = 0; i < 4; i++) {
    var image = nonCarbImages[Math.floor(Math.random() * nonCarbImages.length)];
    var orange = nonCarbs.create(this.rnd.integerInRange(100, 400), this.rnd.integerInRange(0, 570), image);
    orange.body.setRectangle(40, 40);
    orange.name = 'nonCarb';
    orange.width = 40;
    orange.height = 40;
    orange.body.setCollisionGroup(nonCarbsCollisionGroup);
    orange.body.collides([carbsCollisionGroup, nonCarbsCollisionGroup, playerCollisionGroup, carbonatorCollisionGroup]);
  }*/

  //  Create our ship sprite
  ship = this.add.sprite(100, 200, 'ship');
  ship.scale.set(0.2);
  ship.smoothed = true;
  ship.animations.add('fly', [0, 1, 2, 3, 4, 5], 10, true);
  ship.play('fly');

  ck = game.add.sprite(game.width - 200, -100, 'commanderkeytone');
  ck.scale.set(0.4);
  ck.smoothed = true;
  var tween = game.add.tween(ck).to({
    y: game.height + 100
  }, 2000, Phaser.Easing.Linear.None, true, 0, false).start();

  var ckShoot = function() {
    setTimeout(function() {
      var image = carbImages[Math.floor(Math.random() * carbImages.length)];
      var carb = carbs.create(ck.x - 100, ck.y, image.label);
      carb.body.setRectangle(50, 20);
      carb.width = 50;
      carb.height = 50;
      carb.carbs = image.carbs;
      carb.name = 'carb';
      carb.outOfBoundsKill = true;
      carb.body.velocity.x = -(100 * Math.min(difficulty, 3))
      carb.body.setCollisionGroup(carbsCollisionGroup);
      carb.body.collides([nonCarbsCollisionGroup, carbsCollisionGroup, playerCollisionGroup]);
      ckShoot();
      difficulty += Math.min(Math.random() * 0.02, 5)
    }, Math.random() * (2000 / difficulty))
  }
  ckShoot();

  var randPlace = function() {
    setTimeout(function() {
      var nonCarb = nonCarbs.create(ck.x - 100, ck.y, 'needle');
      nonCarb.body.setRectangle(110, 100);
      nonCarb.width = 110;
      nonCarb.height = 100;
      nonCarb.carbs = -1;
      nonCarb.name = 'needle';
      nonCarb.body.velocity.x = -(100 * Math.min(difficulty, 3))
      nonCarb.body.setCollisionGroup(nonCarbsCollisionGroup);
      nonCarb.body.collides([nonCarbsCollisionGroup, carbsCollisionGroup, playerCollisionGroup]);
      randPlace();
    }, Math.random() * 2000)
  }
  randPlace();


  this.physics.p2.enable(ship, false);
  ship.body.setRectangle(114, 86);
  ship.body.fixedRotation = true;

  //  Set the ships collision group
  ship.body.setCollisionGroup(playerCollisionGroup);

  //  The ship will collide with the pandas, and when it strikes one the hitPanda callback will fire, causing it to alpha out a bit
  //  When pandas collide with each other, nothing happens to them.
  ship.body.collides(carbsCollisionGroup, hitPanda, this);
  ship.body.collides(nonCarbsCollisionGroup, hitPanda, this);



  this.camera.follow(ship);

  cursors = this.input.keyboard.createCursorKeys();

  bsDial = this.add.image(100, 100, 'normal');
  bsDial.anchor.set(1, 1)
  bsDial.x = 200;
  bsDial.y = this.height
  bsDial.scale.set(0.5)


  buttonjump = this.add.button(600, 500, 'buttonjump', null, this, 0, 1, 0, 1); //this, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
  buttonjump.fixedToCamera = true; //our buttons should stay on the same place
  buttonjump.events.onInputOver.add(function() {
    use = true;
  });
  buttonjump.events.onInputOut.add(function() {
    use = false;
  });
  buttonjump.events.onInputDown.add(function() {
    use = true;
  });
  buttonjump.events.onInputUp.add(function() {
    use = false;
  });

  buttonfire = this.add.button(700, 500, 'buttonfire', null, this, 0, 1, 0, 1);
  buttonfire.fixedToCamera = true;
  buttonfire.events.onInputOver.add(function() {
    fire = true;
  });
  buttonfire.events.onInputOut.add(function() {
    fire = false;
  });
  buttonfire.events.onInputDown.add(function() {
    fire = true;
  });
  buttonfire.events.onInputUp.add(function() {
    fire = false;
  });


  buttonup = this.add.button(400, 536, 'buttonvertical', null, this, 0, 1, 0, 1);
  buttonup.fixedToCamera = true;
  buttonup.events.onInputOver.add(function() {
    up = true;
  });
  buttonup.events.onInputOut.add(function() {
    up = false;
  });
  buttonup.events.onInputDown.add(function() {
    up = true;
  });
  buttonup.events.onInputUp.add(function() {
    up = false;
  });

  buttonup = this.add.button(400, game.height - 200, 'buttonvertical', null, this, 0, 1, 0, 1);
  buttonup.fixedToCamera = true;
  buttonup.events.onInputOver.add(function() {
    down = true;
  });
  buttonup.events.onInputOut.add(function() {
    down = false;
  });
  buttonup.events.onInputDown.add(function() {
    down = true;
  });
  buttonup.events.onInputUp.add(function() {
    down = false;
  });

  bsDial = game.add.image(300, game.height, bsLevels[bsLevel]);
  bsDial.scale.set(0.5)
  bsDial.anchor.set(1, 1)


  insulinImages = Array(5).join(',').split(',').map(function(value, index) {
    image = game.add.image(game.width - ((100 * index) + 50), 100, '');
    image.scale.set(0.1)
    image.anchor.set(1, 1)
    image.visble = false;
    return image;
  });


  emitter = game.add.emitter(0, 0, 30);

  emitter.makeParticles('crumbs');
  emitter.gravity = 200;
  graphics = game.add.graphics(0, 0)
  graphics.lineStyle(0, 0xffd900);
  graphics.drawEllipse(ship.x, ship.y, 55, 55);

  stateText = game.add.text(game.width - 150, game.height - 50, '', {
    font: '84px Arial',
    fill: '#fff'
  });
  stateText.anchor.setTo(0.5, 0.5);

  carbCount = game.add.text(0, 0, '', {
    font: '84px Arial',
    fill: '#fff'
  });
  carbCount.anchor.setTo(0.5, 0.5);
  carbCount.alpha = 0;

  showInstructions.call(
	this,
    "Jamie has strayed into Galactose, the asteroid belt. Collect the carbs to gain points.\nCareful though... you have to pick up the insulin first.\n\nUse the LEFT ARROW to activate the insulin forcefield. If you forget, the blood sugar will rise.."
  );
}

var hitPanda = debounce(function(body1, body2) {
  body2.sprite.kill();
  if (body2.sprite.name == 'carb') {
    carbCount.x = body2.x;
    carbCount.y = body2.y;
    carbCount.setText(body2.sprite.carbs);
    carbCount.alpha = 1;
    carbCountTween = game.add.tween(carbCount).to({
      alpha:0
    }, 500).start();


    if (!shield)
      bsLevel++;
    score += body2.sprite.carbs;
    emitter.x = body2.x;
    emitter.y = body2.y;
    emitter.start(true, 400, null, 2);
    shield = false;
  }
  if (body2.sprite.name == 'needle')
    insulin = Math.min(insulin + 1, 4);
}, 10)

Game.Three.prototype.update = function() {

  ship.alpha = Math.min(1/bsLevel, 1)

  stateText.setText(score+' g');
  graphics.clear();
  graphics.lineStyle(shield ? 8 : 0, 0xCDCEE9);
  graphics.drawEllipse(ship.x, ship.y, 50, 50);


  insulinImages.map(function(value, index) {
    if (index < insulin)
      value.loadTexture('needle');
    else
      value.loadTexture('');
  });

  if (bsLevel == 4) {
	window.location.reload();
  }

  bsDial.loadTexture(bsLevels[bsLevel]);

  ship.body.x = 100

  ship.body.setZeroVelocity();

  if (cursors.left.isDown || use) {
    lastuse = lastuse || Date.now()
    if (Date.now() - lastuse > 300) {
      lastuse = Date.now();
      useInsulin();
    }
  }

  if (cursors.up.isDown || down) {
    ship.body.moveUp(Math.min(400/bsLevel, 400));
  } else if (cursors.down.isDown || up) {
    ship.body.moveDown(Math.min(400/bsLevel, 400));
  }

  bsDial.loadTexture(bsLevels[bsLevel])


}
