Game.Sorter = function(game){
};

var points = 0;

Game.Sorter.prototype.preload = function () {

  this.load.image('ship', 'player.png');
  this.load.image('rice', 'rice.png');
  this.load.image('orange', 'orange.png');
  this.load.image('veggies', 'fruitnveg32wh37.png', 32, 32);

}

var sprite;
var cursors;
var carbs;
var nonCarbs;
var text;

Game.Sorter.prototype.create = function () {

  text = game.add.text(5, 5, 'Points: 0', {
	fill: '#ffffff',
	font: '14pt Arial'
  });

  //  Enable P2
  this.physics.startSystem(Phaser.Physics.P2JS);

  //  Turn on impact events for the world, without this we get no collision callbacks
  this.physics.p2.setImpactEvents(true);

  this.physics.p2.restitution = 0.8;

  //  Create our collision groups. One for the player, one for the pandas
  var playerCollisionGroup = this.physics.p2.createCollisionGroup();
  var carbsCollisionGroup = this.physics.p2.createCollisionGroup();
  var nonCarbsCollisionGroup = this.physics.p2.createCollisionGroup();

  //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
  //  (which we do) - what this does is adjust the bounds to use its own collision group.
  this.physics.p2.updateBoundsCollisionGroup();

  carbs = this.add.group();
  carbs.enableBody = true;
  carbs.physicsBodyType = Phaser.Physics.P2JS;

  nonCarbs = this.add.group();
  nonCarbs.enableBody = true;
  nonCarbs.physicsBodyType = Phaser.Physics.P2JS;

  for (var i = 0; i < 4; i++) {
	var rice = carbs.create(this.world.randomX, game.world.randomY, 'rice');
	rice.body.setRectangle(40, 40);
	rice.width = 40;
	rice.height = 40;
	rice.body.setCollisionGroup(carbsCollisionGroup);
	rice.body.collides([nonCarbsCollisionGroup, carbsCollisionGroup, playerCollisionGroup]);
  }

  for (var i = 0; i < 4; i++) {
	var orange = nonCarbs.create(this.world.randomX, this.world.randomY, 'orange');
	orange.body.setRectangle(40, 40);
	orange.width = 40;
	orange.height = 40;
	orange.body.setCollisionGroup(nonCarbsCollisionGroup);
	orange.body.collides([carbsCollisionGroup, nonCarbsCollisionGroup, playerCollisionGroup]);
  }

  //  Create our ship sprite
  ship = this.add.sprite(200, 200, 'ship');
  ship.scale.set(0.2);
  ship.smoothed = false;
  ship.animations.add('fly', [0, 1, 2, 3, 4, 5], 10, true);
  ship.play('fly');

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

}

function hitPanda(body1, body2) {



}

Game.Sorter.prototype.update = function () {

  ship.body.setZeroVelocity();

  points = carbs.children.map(function(item) {
	return item.x > this.width / 2;
  }).concat(nonCarbs.children.map(function(item) {
	return item.x < this.width / 2;
  })).filter(function(a) {
	return a
  }).length;

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

  if (!this.camera.atLimit.x) {
	starfield.tilePosition.x += (ship.body.velocity.x * 16) * this.time.physicsElapsed;
  }

  if (!this.camera.atLimit.y) {
	starfield.tilePosition.y += (ship.body.velocity.y * 16) * this.time.physicsElapsed;
  }

}
