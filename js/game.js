class Snake
{
    /** init
     *
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        let v = this.valid_set(x, y);
        this.dead = false;
        this.minos = [
            new Mino(v.pos),
            new Mino({x: v.pos.x + 1, y: v.pos.y}),
            new Mino({x: v.pos.x + 2, y: v.pos.y}),
            new Mino({x: v.pos.x + 3, y: v.pos.y})
        ];
        // current dir
        // WARNING!!! dir from 2 to 5
        this.dir = 3;
        this.dirs = [
            null,
            null,
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 }
        ];
    }

    get_head() { return this.minos[0]; }
    get_tail() { return this.minos[this.minos.length - 1]}
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
            this.minos.push(new Mino(v.pos))
    }

    move() {
        // move mines from second to last blocks
        for(let i = this.minos.length - 1; i > 0; i--) {
            this.minos[i].pos.x = this.minos[i-1].pos.x;
            this.minos[i].pos.y = this.minos[i-1].pos.y;
        }
        // move head
        this.minos[0].pos.x += this.dirs[this.dir].x;
        this.minos[0].pos.y += this.dirs[this.dir].y

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
// destroyed snakes
let dminos = [];

let tetr;

let ticks = 0;

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
	let clk_time = 100;

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
	snake = new Snake(5, 5);
	tetr = spawn_tetr();

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

/* checks if pos is in bounds of grid */
function head_in_grid(head_pos) {
    return (head_pos.x > 0 && head_pos.x < SIZE.W - 1
        && head_pos.y > 0 && head_pos.y < SIZE.H - 1);
}

function dead_in_grid(mino_pos) {
    return (mino_pos.x > -1 && mino_pos.x < SIZE.W
        && mino_pos.y > -1 && mino_pos.y < SIZE.H-1);
}

function spawn_tetr() {
	let start = new Mino({x: SIZE.W/2, y: 0});
	return new Tetramino(game.rnd.pick('litjls'), start);
}

// main game tick
function gameTick() {
    // heading snake to the right direction
    {
        // clear tail
        let {x, y} = snake.get_tail().pos;
        set_grid(y, x, MINO_TYPE.EMPTY);
    }
    // snake alive
	//if (false) { // for debug's sake
    if (!snake.dead) {
        // snake in grid
        if (head_in_grid(snake.get_head().pos)) {
            if (ticks % SPEED.SNAKE == 0) snake.move();
        } else {
           snake.dead = true;
        }
    } else {
        // kill snake and clear
        for(let i = 0; i < snake.minos.length; i++) {
            dminos.push(snake.minos[i]);
            set_grid(dminos[i].pos.y, dminos[i].pos.x, MINO_TYPE.EMPTY);
        }
        // make set from arr
        // unique dminos
        tmp_minos = [];
        for (let i = 0; i < dminos.length; i++) {
            let f = false;
            for (let j = 0; j < tmp_minos.length; j++){
                if(tmp_minos[j].pos.x == dminos[i].pos.x &&
                    tmp_minos[j].pos.y == dminos[i].pos.y) {
                    f = true;
                    break;
                }
            }
            if(!f)
                tmp_minos.push(dminos[i]);
        }
        dminos = tmp_minos;
        snake = new Snake(5, 5);
    }
	//} // TODO remove if false
    
    // set dminos
    for(let i = 0; i < dminos.length; i++) {
        if(dead_in_grid(dminos[i].pos) && 
        grid[dminos[i].pos.y+1][dminos[i].pos.x] == MINO_TYPE.EMPTY) {
            set_grid(dminos[i].pos.y, dminos[i].pos.x, MINO_TYPE.EMPTY);
            dminos[i].down();
        }
        set_grid(dminos[i].pos.y, dminos[i].pos.x, MINO_TYPE.DEAD);
    }
    // check collision snake with dminos
    {
        let {x, y} = snake.get_head().pos;
        for(let i = 0; i < dminos.length; i++) {
            if (dminos[i].pos.x == x && dminos[i].pos.y == y) {
                    snake.dead = true;
                    return; // ??
                }
        }
    }
    {
        // set body
        for(let i = 1; i < snake.minos.length; i++) {
            let {x, y} = snake.minos[i].pos;
            set_grid(y, x, MINO_TYPE.SNAKE);
        }
        // set head
        let {x, y} = snake.get_head().pos;
        set_grid(y, x, snake.dir);
    }

	
	if (ticks % (tetr.boost ? SPEED.TETR_BOOST : SPEED.TETR) == 0) {
		// move a tetramino
		let minos = tetr.minos;
		// tetramino's way is free to fall
		let free_to_fall = true;
		for (let i = 0; i < minos.length; ++i) {
			let {x, y} = minos[i].pos;
			// TODO there are some more cases
			if (y >= SIZE.H - 1) { free_to_fall = false; break; }
			else if (grid[y+1][x] !== MINO_TYPE.EMPTY &&
				grid[y+1][x] !== MINO_TYPE.ACTIVE) {
				free_to_fall = false;
				break;
			}
		}
		if (free_to_fall) {
			// three runs along minos -_-
			erase(minos);
			minos.forEach((it, i, arr) => {
				arr[i].pos.y++;
			});
			activate(minos);
			tetr.set_pos(minos);
		} else {
			minos.forEach((it, i, arr) => {
				let {x, y} = it.pos;
				set_grid(y, x, MINO_TYPE.STILL);
			});
			tetr = spawn_tetr();
		}
	}

	// increment ticks. Don't remove this.
	ticks++;
	//let m = max_in_arr(SPEED);
	//if (ticks > m) ticks -= m;
}

// just two helper functions to draw things
function erase(minos) {
	minos.forEach((it) => {
		let {x, y} = it.pos;
		set_grid(y, x, MINO_TYPE.EMPTY);
	});
}

function activate(minos) {
	minos.forEach((it) => {
		let {x, y} = it.pos;
		set_grid(y, x, MINO_TYPE.ACTIVE);
	});
}

/* checks bounds for the list of minos */
function check_bounds(minos) {
	for (let i = 0; i < minos.length; ++i) {
		if (!dead_in_grid(minos[i].pos)) return false;
	}
	return true;
}
