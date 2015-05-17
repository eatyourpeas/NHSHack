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


Game.Invaders.prototype.create = function() {
  var background = this.add.tileSprite(
    0,
    0,
    1280,
    720,
    'stars'
  );

}

Game.Invaders.prototype.update = function() {



}
