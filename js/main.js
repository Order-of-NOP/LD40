let game;
// kinda global scope, hehe
let g = {
	// g for graphics
	g: {
		thing: null
	},
	// t for time
	t: {
		clk: null,
	}
}
/* input for players:
	input[0] - snake,
	input[1] - tetris
*/
let input = [
	game.input.keyboard.createCursorKeys(),
	null
];

function init() {
	const config = {
		width: 800,
		height: 600,
		renderer: Phaser.AUTO,
		parent: 'game',
		antialias: true,
		multiTexture: true,
		state: {
			preload: preload,
			create: create,
			update: update,
			render: render
		}
	};
	game = new Phaser.Game(config);

	// init input

}



function preload() {
	// load all the sprites, fonts and other stuff
	game.load.image('thing', '../img/thing.png');
}

function create() {
	// wanna do something useful on right click
	document.querySelector('canvas').oncontextmenu
		= function() { return false; };
	game.world.setBounds(0, 0, 800, 600);

	g.g.thing = game.add.sprite(64, 64, 'thing');

	//game.physics.enable(g.g.pl);

	newGame();
}

function update() {
	if (g.t.clk) {
		game.debug.text(`Clk: ${g.t.clk.next}`, 32, 128);
	}
}

function render() {
}
