var Game = {};
//var counter = 0;
var playmusic = true;

var showInstructions = function(text, callback){

	var pig = this.add.sprite(-300, 0, 'pig');
	var entertext = this.add.text(400, 50, text, {
		fill: '#ffffff',
		font: '24pt Arial',
		wordWrap: true,
		wordWrapWidth: 500,
	});
	
	entertext.visible = false;
	entertext.inputEnabled = true;
	

	var tween = this.add.tween(pig).to({x: 0}, 200);
	tween.onComplete.add(function(){
		entertext.visible = true
		game.paused = true;
		if(callback) callback.call(this);
	}, this);
	tween.start();


	document.onkeyup = function(event){
		game.paused = false;
		pig.kill();
		entertext.kill();
	};
};

Game.Boot = function(game){

};

Game.Boot.prototype = {
	init: function(){
		//  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
		this.input.maxPointers = 1;

		//  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
		this.stage.disableVisibilityChange = true;

		if (this.game.device.desktop)
		{
			//  If you have any desktop specific settings, they can go in here
			this.scale.pageAlignHorizontally = true;
		}
		else
		{
			//  Same goes for mobile settings.
			//  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.scale.setMinMax(480, 260, 1024, 768);
			this.scale.forceLandscape = true;
			this.scale.pageAlignHorizontally = true;
		}
	},

	preload: function(){
		//load all assets here
		//this.load.image
		this.load.image('player', 'player.png');
		this.load.image('stars', 'starfield.jpg');
		this.load.image('commander', 'commanderkeytone.png');
		this.load.image('pig', 'pig.png');
		this.load.audio('music', 'music.mp3');

	},

	create: function(){
		var starfield = game.add.tileSprite(0, 0, 1200, 600, 'stars');
		starfield.fixedToCamera = true;

		this.add.image(0, 0, 'player');
		var title = game.add.text(this.world.width/2, 25, 'Diab-eaties', {
			fill: '#ffffff',
			font: '34pt Arial'
		});
		var introtext = game.add.text(this.world.width/2, 100, 'Help Jamie the Space Giraffe through the Milky Way... \nWatch out for Captain Ketone', {
			fill: '#ffffff',
			font: '24pt Arial',
			wordWrap: true,
			wordWrapWidth: this.world.width/2,
		});



		this.add.image(this.world.width/2, 250, 'commander');
		var entertext = game.add.text(this.world.width/2, 550, 'Press ENTER or click to continue', {
			fill: '#ffffff',
			font: '16pt Arial',
		});

		game.input.onTap.addOnce(function(){ // click to continue
					game.state.start('Menu');
				},this);

		var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		
		enterKey.onUp.add(function(){
			this.state.start('Menu');
		}, this);

		var music = this.add.audio('music');
		music.loop = true;
		music.play();
	},

	update: function(){
		
		var music = this.add.audio('music');
		music.mute = !playmusic;
	},

	
};
