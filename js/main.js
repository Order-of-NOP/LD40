let game;
// kinda global scope, hehe
let g = {
	// g for graphics
	g: {
		// TODO remove this debug thing
		thing: null
	},
	// t for time
	t: {
		clk: null,
	}
}

const SIZE = {H: 10, W: 15};
const MINO_TYPE = {
	EMPTY: 0,
	SNAKE: 1,
	HEAD_U: 2,
	HEAD_D: 3,
	HEAD_L: 4,
	HEAD_R: 5,
	// for controllable tetramino
	ACTIVE: 6,
	// just minos
	STILL: 7,
	// unremovable minos
	HEAVY: 8,
	// snake food
	FRUIT: 9,
	// dead snake
	DEAD: 10
};

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

	// TODO remove this debug thing
	g.g.thing = game.add.sprite(64, 64, 'thing');

	//game.physics.enable(g.g.pl);

	newGame();
}

function update() {
	// doesn't work -_-
	if (g.t.clk) {
		game.debug.text(`Clk: ${g.t.clk.next}`, 32, 128);
	}
}

function render() {
}
