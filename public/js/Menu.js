var levels = [
	{
		name: 'planet1',
		position:{
			x: 10,
			y: 500,
		},
	},
	{
		name: 'planet2',
		position:{
			x: 150,
			y: 450
		}
	},
	{
		name: 'planet3',
		position:{
			x: 250,
			y: 350
		}
	},
	{
		name: 'planet4',
		position:{
			x: 400,
			y: 300
		}
	},
	{
		name: 'planet5',
		position:{
			x: 500,
			y: 200
		}
	},
];

var levelProgress = 1;

Game.Menu = function(game){

};

Game.Menu.prototype = {
	preload: function(){
		var that = this;

		//create planets
		levels.map(function(item){
			that.load.image(item.name, '/images/' + item.name + '.png');
			that.load.image(item.name + '_grey', '/images/' + item.name + '_grey.png');
		});

		//character
		this.load.image('character', '/images/character.png');

	},

	create: function(){
		var that = this;
		//place each planet
		var planets = levels.map(function(item, index){
			var imageName = (index <= levelProgress) ? item.name : item.name + '_grey';
			return that.add.sprite(item.position.x, item.position.y, imageName);
		});

		//TODO: draw path between each point

		var characterPosition = levels[levelProgress].position;
		var character = this.add.sprite(characterPosition.x, characterPosition.y, 'character');

		var move = this.add.tween(character);
		move.to(levels[levelProgress+1].position, 1000, Phaser.Easing.Bounce.In);
		move.onComplete.add(function(){
			//swap grey sprite for color
			planets[levelProgress+1].loadTexture(levels[levelProgress+1].name);

			setTimeout(function(){
				console.log("go to next level: levelProgress+1");
				that.state.start('Invaders');
			}, 500);
		}, this);
		move.start();

	},

	update: function(){

	}
};
