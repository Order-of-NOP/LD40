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
/* input for players:
	input[0] - snake,
	input[1] - tetris
*/
let input;

const SIZE = {H: 18, W: 24};
const TILE_SIZE = 32;
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
	// dead snake
	DEAD: 9,
	// snake food
	FRUIT: 10
};

const sprite_grid = make_grid(SIZE.H, SIZE.W);

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
	//game.load.image('thing', '../img/thing.png');
	game.load.spritesheet('sheet', '../img/sheet.png', TILE_SIZE, TILE_SIZE);
}

function create() {
	// wanna do something useful on right click
	document.querySelector('canvas').oncontextmenu
		= function() { return false; };
	game.world.setBounds(0, 0, 800, 600);

	//game.physics.enable(g.g.pl);
	input = [
		game.input.keyboard.createCursorKeys(),
		{
			up: game.input.keyboard.addKey(Phaser.Keyboard.W),
			down: game.input.keyboard.addKey(Phaser.Keyboard.S),
			left: game.input.keyboard.addKey(Phaser.Keyboard.A),
			right: game.input.keyboard.addKey(Phaser.Keyboard.D),
		}
	];

	newGame();
}

function update() {
    // input for snake
    if (input[PL.SNK].up.isDown) {

		if (snake.dir != MINO_TYPE.HEAD_D) 
			snake.dir = MINO_TYPE.HEAD_U;
		
    } else if (input[PL.SNK].down.isDown) {

		if (snake.dir != MINO_TYPE.HEAD_U)
			snake.dir = MINO_TYPE.HEAD_D;

    } else if (input[PL.SNK].right.isDown) {

		if (snake.dir != MINO_TYPE.HEAD_L)
			snake.dir = MINO_TYPE.HEAD_R;

    } else if (input[PL.SNK].left.isDown) {
		
		if (snake.dir != MINO_TYPE.HEAD_R)
			snake.dir = MINO_TYPE.HEAD_L;
	}
	// input for tetris
	if (input[PL.TRS].up.justReleased()) {
		erase(tetr.minos);
		tetr.set_pos(tetr.rotate());
		activate(tetr.minos);
	} else if (input[PL.TRS].down.justReleased()) {
		erase(tetr.minos);
		tetr.move('down');
		activate(tetr.minos);
	} else if (input[PL.TRS].right.justReleased()) {
		erase(tetr.minos);
		tetr.move('right');
		activate(tetr.minos);
	} else if (input[PL.TRS].left.justReleased()) {
		erase(tetr.minos);
		tetr.move('left');
		activate(tetr.minos);
	}
}

function render() {
	// doesn't work -_-
	if (g.t.clk) {
		game.debug.text(`Clk: ${g.t.clk.next}`, 32, 128);
	}
}

function make_grid(n, m) {
	return new Array(n).fill(null).map(row => new Array(m).fill(null));
}
