var Game = {};

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
		var entertext = game.add.text(this.world.width/2, 550, 'Press ENTER to continue', {
			fill: '#ffffff',
			font: '16pt Arial',
		});

		var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		enterKey.onUp.add(function(){
			this.state.start('Menu');
		}, this);
	},
};
