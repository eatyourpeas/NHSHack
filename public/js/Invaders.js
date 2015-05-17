var IDE_HOOK = false;
var test;
var points = 0;

Game.Invaders = function(game) {};

var game = Game.Invaders;

Game.Three.prototype.preload = function() {

  this.load.spritesheet('buttonvertical', 'button-vertical.png', 64, 64);
  this.load.spritesheet('buttonhorizontal', 'button-horizontal.png', 96, 64);
  this.load.spritesheet('buttondiagonal', 'button-diagonal.png', 64, 64);
  this.load.spritesheet('buttonfire', 'button-round-a.png', 96, 96);
  this.load.spritesheet('buttonjump', 'button-round-b.png', 96, 96);

  this.load.image('stars', 'starfield.jpg');
  this.load.image('ship', 'player.png');
  this.load.image('commanderkeytone', 'commanderkeytone.png');
  this.load.image('carbonator', 'pipe.png');
  this.load.image('needle', 'needle.png');

  //BS Dials
  this.load.image('verylow', 'verylow.png');
  this.load.image('low', 'low.png');
  this.load.image('normal', 'normal.png');
  this.load.image('high', 'high.png');
  this.load.image('veryhigh', 'veryhigh.png');

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
var bsLevel = 2;
var keytones;
var bsDial;
var fire;
var use;
var up;
var down;
var bsLevels = [
  'verylow',
  'low',
  'normal',
  'high',
  'veryhigh'
];

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
  label: 'crips',
  carbs: 0
}];
var nonCarbImages = ['orange', 'salad', 'fish', 'borccoli', 'eggs', 'cheese', 'banana', 'sausage'];
var player;
var aliens;
var bullets;
var bulletTime = 0;
var cursors;
var fireButton;
var explosions;
var starfield;
var score = 0;
var scoreString = '';
var scoreText;
var lives;
var enemyBullet;
var firingTimer = 0;
var stateText;
var livingEnemies = [];

Game.Invaders.prototype.create = function() {
game.physics.startSystem(Phaser.Physics.ARCADE);

    //  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    // The enemy's bullets
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    //  The hero!
    player = game.add.sprite(400, 500, 'ship');
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);

    //  The baddies!
    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;

    createAliens();

    //  The score
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#fff' });

    //  Lives
    lives = game.add.group();
    game.add.text(game.world.width - 100, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });

    //  Text
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    for (var i = 0; i < 3; i++) 
    {
        var ship = lives.create(game.world.width - 100 + (30 * i), 60, 'ship');
        ship.anchor.setTo(0.5, 0.5);
        ship.angle = 90;
        ship.alpha = 0.4;
    }

    //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupInvader, this);

    //  And some controls to play the game with
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

Game.Invaders.prototype.update = function() {



}

function collisionHandler (bullet, alien) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    alien.kill();

    //  Increase the score
    score += 20;
    scoreText.text = scoreString + score;

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);

    if (aliens.countLiving() == 0)
    {
        score += 1000;
        scoreText.text = scoreString + score;

        enemyBullets.callAll('kill',this);
        stateText.text = " You Won, \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}

function enemyHitsPlayer (player,bullet) {
    
    bullet.kill();

    live = lives.getFirstAlive();

    if (live)
    {
        live.kill();
    }

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);

    // When the player dies
    if (lives.countLiving() < 1)
    {
        player.kill();
        enemyBullets.callAll('kill');

        stateText.text=" GAME OVER \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}

function createAliens () {

    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 10; x++)
        {
            var alien = aliens.create(x * 48, y * 50, 'invader');
            alien.anchor.setTo(0.5, 0.5);
            alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
            alien.play('fly');
            alien.body.moves = false;
        }
    }

    aliens.x = 100;
    aliens.y = 50;

    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    var tween = game.add.tween(aliens).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    //  When the tween loops it calls descend
    tween.onLoop.add(descend, this);
}

function setupInvader (invader) {

    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');

}

function descend() {

    aliens.y += 10;

}

function enemyFires () {

    //  Grab the first bullet we can from the pool
    enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

    aliens.forEachAlive(function(alien){

        // put every living enemy in an array
        livingEnemies.push(alien);
    });


    if (enemyBullet && livingEnemies.length > 0)
    {
        
        var random=game.rnd.integerInRange(0,livingEnemies.length-1);

        // randomly select one of them
        var shooter=livingEnemies[random];
        // And fire the bullet from this enemy
        enemyBullet.reset(shooter.body.x, shooter.body.y);

        game.physics.arcade.moveToObject(enemyBullet,player,120);
        firingTimer = game.time.now + 2000;
    }

}

function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + 200;
        }
    }

}

function resetBullet (bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

}

function restart () {

    //  A new level starts
    
    //resets the life count
    lives.callAll('revive');
    //  And brings the aliens back from the dead :)
    aliens.removeAll();
    createAliens();

    //revives the player
    player.revive();
    //hides the text
    stateText.visible = false;

}
