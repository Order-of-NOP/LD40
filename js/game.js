class Mino {
    /** Mino
     *
     * @param {{x:number, y:number}} pos
     */
    constructor(pos) {
        this.pos = pos;
    }
};

class Tetramino
{
	constructor(shape, init_pos_x, init_pos_y) {
		this.shape = shape; // Figure shape status from set {i, o, z, t, l, ?}.
		switch(shape) {
			case 'i':
				this.minos = [
				new Mino({x : init_pos_x, y : init_pos_y}),
				new Mino({x : init_pos_x + 1, y : init_pos_y}),
				new Mino({x : init_pos_x + 2, y : init_pos_y}),
				new Mino({x : init_pos_x + 3, y : init_pos_y}),
				]
				break;
		}

		this.rotate = 0; // Rotate status from set {0, 1, 2, 3}.
	}

	next_pos() {
		for (let i = 0; i < this.minos.length; i++) {
			this.minos[i].y++;
		}
	}

	change_pos(new_pos) {
		for (let i = 0; i < this.minos.length; i++) {
			this.minos[i].x = new_pos[i].x;
			this.minos[i].y = new_pos[i].y;
		}
	}

	rotate() {
		switch(this.shape) {
			case 'i':
				switch(this.rotate) {
					case 0:
						this.minos[0].x = this.minos[2].x;
						this.minos[1].x = this.minos[2].x;
						this.minos[3].x = this.minos[2].x;
						this.minos[0].y = this.minos[2].y - 2;	
						this.minos[1].y = this.minos[2].y - 1;	
						this.minos[3].y = this.minos[2].y + 1;	
						break;
				}
		}
	}
};

class Snake
{
    /** init
     *
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        let v = this.valid_set(x, y)
        this.Minos = [
            new Mino(v.pos),
            new Mino({x: v.pos.x + 1, y: v.pos.y})
        ];
        // current dir
        this.dir = 2;
        this.dirs = [
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: -1 },
            { x: 0, y: 1 }
        ];
    }
    /** valid_set
     *
     * @param {number} x
     * @param {number} y
     */
    valid_set(x, y){
        return {
            pos: {
                x: x == null ? 0 : x,
                y: y == null ? 0 : y
            },
            valid: x == null || y == null
        }
    }
    /** add_mino
     *
     * @param {{x:number, y:number}} pos
     */
    add_mino(pos) {
        let v = this.valid_set(x, y)
        if (v.valid)
            this.Minos.push(new Mino(v.pos))
    }
    // get the first mino
    get_head() { return this.Minos[0]; }
    // get the last mino
    get_tail() { return this.Minos[this.Minos.length - 1] }

    move() {
        // move mines from second to last blocks
        for(let i = this.Minos.length; i > 0; i--) {
            this.Minos[i].pos = this.Minos[i-1].pos
        }
        // move head
        let h_pos = Minos[0].pos;
        this.Minos[0].pos = {
            x: h_pos.x + this.dirs[this.dir],
            y: h_pos.y + this.dirs[this.dir]
        }
    }
}
// ST for states
const ST = {
	MENU: 0,
	GAME: 1,
	OVER: 2
};

// ATTENTION
// the first coordinate is Y
// it's faster to remove lines
let grid = make_grid(SIZE.H, SIZE.W);

let snake;

// Player
const PL = {
    SNK: 0,
    TRS: 1
}

function newGame() {
	// it's just a prototype, folks!
	let dirs_to_mino_type = (dir) => {
		switch (dir) {
		}
	};
	// time's atom
	let clk_time = 500;

	// setup clock timer
	let clk = g.t.clk;
	clk = game.time.create(false);
	clk.loop(clk_time, gameTick, this);

	// wipe whole the grid
	for (let r = 0; r < grid.length; ++r) {
		for (let c = 0; c < grid[r].length; ++c) {
			grid[r][c] = MINO_TYPE.EMPTY;
			sprite_grid[r][c] = game.add.sprite(c*TILE_SIZE, r*TILE_SIZE,
				'sheet');
			for (let i in MINO_TYPE) {
				// TODO when real animation starts, you will shit bricks
				sprite_grid[r][c].animations.add(MINO_TYPE[i].toString(),
					[MINO_TYPE[i]], 0, true);
			}
			sprite_grid[r][c].play(MINO_TYPE.EMPTY.toString());
		}
	}

	// init all the stuff
	snake = new Snake();

	// when all done, start a timer
	clk.start();
}

/* sets states in both grid and sprite_grid */
// TODO investigate, do we really need `grid`
function set_grid(y, x, type) {
	if (typeof(type) !== 'number') console.warn(`'${type}' is not a number.`);
	grid[y][x] = type;
	sprite_grid[y][x].play(type.toString());
}

// main game tick
function gameTick() {
    // heading snake to the right direction
	// TODO move head
    {
        let {x, y} = snake.get_head().pos;
        // snake.dir supposed to be of MINO_TYPEs
		set_grid(y, x, snake.dir);
    }
	let {x, y} = snake.get_tail().pos;
	set_grid(y, x, MINO_TYPE.SNAKE);
}
