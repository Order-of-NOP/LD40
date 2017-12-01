let game;
// kinda global scope, hehe
let g = {
	// g for graphics
	g: {
		lvl: null,
		circ: null,
		pl: null,
		pl_pt: null
	}
}

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
}

function create() {
	// wanna do something useful on right click
	document.querySelector('canvas').oncontextmenu
		= function() { return false; };
	game.world.setBounds(0, 0, 800, 600);

	//g.g.lvl = game.add.graphics();
	//g.g.circ = game.add.graphics();
	//g.g.pl = game.add.graphics();
	//g.g.pl_pt = game.add.graphics();

	//game.physics.enable(g.g.pl);

	newGame();
}

function update() {
}

function render() {
}
