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
		// what point to start ejecting tail from
		this.eject = -1;
		this.minos = [
			new Mino(v.pos),
			new Mino({x: v.pos.x + 1, y: v.pos.y}),
			new Mino({x: v.pos.x + 2, y: v.pos.y}),
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
		// if snake is to turn this tick
		this.turn_charged = false;
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
		let v = this.valid_set(pos.x, pos.y)
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
	collide() {
		let minos = this.minos;
		for (let i = 0; i < minos.length; ++i) {
			let pos = minos[i].pos;
			if (any_neigh(pos, MINO_TYPE.ACTIVE)) {
				if (i === 0) {
					this.dead = 0;
					break
				}
				this.eject = i;
				break;
			}
		}
	}
}
// intersects check snake
function s_in_s_check(minos) {
	for (let i = 1; i < minos.length; i++) {
		if (minos[0].pos.x == minos[i].pos.x
			&& minos[0].pos.y == minos[i].pos.y) {
			return i;
		}
	}
	return -1;
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
// falling after scoring
let still_falling = [];
// current tetr
let tetr;
// active fruit
let a_fruit = [];
// heavy fruit
let h_fruit = [];
// spawn eat time
let spawn_eat_time = SPAWN_EAT_TIME;

let ticks = 0;

// Player
const PL = {
	SNK: 0,
	TRS: 1
}

function newGame() {
	// it's just a prototype, folks!
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

	/*for (let c = 4; c < 6; ++c)
	for (let r = 0; r < SIZE.H; ++r) {
		set_grid(r, c, MINO_TYPE.STILL);
	}*/

	// init all the stuff
	snake = new Snake(2, 1);
	tetr = spawn_tetr();

	// when all done, start a timer
	clk.start();
}

/* sets states in both grid and sprite_grid */
function set_grid(y, x, type) {
	if (typeof(type) !== 'number') console.warn(`'${type}' is not a number.`);
	grid[y][x] = type;
	sprite_grid[y][x].play(type.toString());
}

/* checks if pos is in bounds of grid */
function head_in_grid(pos, direction) {
	return !(
		(pos.x <= 0 && direction == MINO_TYPE.HEAD_L)
		|| (pos.x >= SIZE.W - 1 && direction == MINO_TYPE.HEAD_R)
		|| (pos.y <= 0 && direction == MINO_TYPE.HEAD_U)
		|| (pos.y >= SIZE.H - 1 && direction == MINO_TYPE.HEAD_D)
	);

	return (pos.x > 0 && pos.x < SIZE.W - 1
		&& pos.y > 0 && pos.y < SIZE.H - 1);
}

function dead_in_grid(mino_pos) {
	return (mino_pos.x > -1 && mino_pos.x < SIZE.W
		&& mino_pos.y > -1 && mino_pos.y < SIZE.H-1);
}

function spawn_tetr() {
	let start = new Mino({x: SIZE.W/2, y: 0});
	return new Tetramino(game.rnd.pick('litjlso'), start);
}

function get_rnd(min, max) {
	return Math.random() * (max - min) + min;
}

// main game tick
function gameTick() {
	// heading snake to the right direction
	{
		// clear tail
		let {x, y} = snake.get_tail().pos;
		set_grid(y, x, MINO_TYPE.EMPTY);
		snake.turn_charged = false;
	}
	// move snake
	if (!snake.dead) {
		// snake is in grid
		if (head_in_grid(snake.get_head().pos, snake.dir)) {
			if (snake.eject !== -1) {
				for (let i = snake.eject; i < snake.minos.length; i++) {
					dminos.push(snake.minos[i]);
					set_grid(snake.minos[i].pos.y, snake.minos[i].pos.x,
						MINO_TYPE.EMPTY);
				}
				// remove duplicates using underscore.js
				dminos = _.uniq(dminos);
				snake.minos.splice(snake.eject, Number.MAX_VALUE)
				snake.eject = -1;
			}
			if (ticks % SPEED.SNAKE == 0) {
				snake.move();
				let {x, y} = snake.get_head().pos;
				// snake check eat
				if (grid[y][x] == MINO_TYPE.FRUIT) {
					set_grid(y, x, MINO_TYPE.EMPTY);
					let i = -1;
					for(i = 0; i < a_fruit.length; i++) {
						if(a_fruit[i].pos.x == x
							&& a_fruit[i].pos.y == y)
							break;
					}
					if(i == -1) {
						console.warn('WTF!???')
					} else {
						sounds.eat.play();//////////////////////////
						a_fruit.splice(i, 1);
						let xt = snake.get_tail().pos.x;
						let yt = snake.get_tail().pos.y;
						// add new Mino
						if(grid[yt][xt-1] == MINO_TYPE.EMPTY) {
							snake.add_mino({x:xt-1, yt: yt});
						} else if (grid[yt][xt+1] == MINO_TYPE.EMPTY) {
							snake.add_mino({x:xt-1, yt: yt});
						} else if (grid[yt-1][xt] == MINO_TYPE.EMPTY) {
							snake.add_mino({x:xt, yt: yt-1});
						} else if (grid[yt+1][xt] == MINO_TYPE.EMPTY) {
							snake.add_mino({x:xt, yt: yt+1});
						}
					}
				}
			} // speed check
		} else {
			snake.dead = true;
		}
	} else {
		// kill snake and clear
		for (let i = 0; i < snake.minos.length; i++) {
			dminos.push(snake.minos[i]);
			set_grid(dminos[i].pos.y, dminos[i].pos.x, MINO_TYPE.EMPTY);
		}
		// remove duplicates using underscore.js
		dminos = _.uniq(dminos);
		// respawn snake
		// TODO make it smarter, folk
		for (let y = 1; y < SIZE.H; ++y) {
			let t = true;
			for(let x = 2; x < SIZE.W - 3; x++) {
				if (grid[y][x] == MINO_TYPE.EMPTY
					&& grid[y][x+1] == MINO_TYPE.EMPTY
					&& grid[y][x+2] == MINO_TYPE.EMPTY) {
					snake = new Snake(x, 1);
					t = false;
					break;
				}
				if (!false) break;
			}
		}
	}
	// gravity on dminos
	// here dminos are pushed to the grid
	for (let i = 0; i < dminos.length; i++) {
		let pos = dminos[i].pos;
		if (dead_in_grid(pos) && grid[pos.y+1][pos.x] == MINO_TYPE.EMPTY) {
			set_grid(pos.y, pos.x, MINO_TYPE.EMPTY);
			dminos[i].down();
		}
		set_grid(pos.y, pos.x, MINO_TYPE.DEAD);
	}
	// gravity on still_falling
	// still_falling is meant to be sorted descending
	while (still_falling.length > 0) {
		let mino = still_falling.pop();
		if (dead_in_grid(mino.pos)
				&& grid[mino.pos.y+1][mino.pos.x] == MINO_TYPE.EMPTY) {
			set_grid(mino.pos.y, mino.pos.x, MINO_TYPE.EMPTY);
			mino.down();
		}
		set_grid(mino.pos.y, mino.pos.x, MINO_TYPE.STILL);
	}
	// check snake's collisions
	{
		// corpses (dead snake's bodies, damn it's creepy!)
		let {x, y} = snake.get_head().pos;
		for (let i = 0; i < dminos.length; i++) {
			if (dminos[i].pos.x == x && dminos[i].pos.y == y) {
				snake.dead = true;
			}
		}
		// rooted food (grey freaking blocks)
		for (let i = 0; i < h_fruit.length; i++) {
			if (h_fruit[i].pos.x == x && h_fruit[i].pos.y == y) {
				snake.dead = true;
			}
		}
		// still minos
		if (grid[y][x] === MINO_TYPE.STILL){
			snake.dead = true;
		}
		if (grid[y][x] === MINO_TYPE.ACTIVE) {
			snake.dead = true;
		}
	}
	// finally we can draw our poor snake
	{
		for(let i = 1; i < snake.minos.length; i++) {
			let {x, y} = snake.minos[i].pos;
			set_grid(y, x, MINO_TYPE.SNAKE);
		}
		let {x, y} = snake.get_head().pos;
		set_grid(y, x, snake.dir);
	}
	// gravity for fresh fruit
	if (ticks % SPEED.FRUIT_FALL == 0) {
		//clear
		erase(a_fruit);
		// check if it's free under fruit
		let tmp_a = [];
		for(let i = 0; i < a_fruit.length; i++) {
			let {x, y} = a_fruit[i].pos;
			set_grid(y, x, MINO_TYPE.EMPTY);
			// if bottom empty then fall
			if (y < SIZE.H-1){
				if (grid[y+1][x] == MINO_TYPE.EMPTY){
					a_fruit[i].down();
					tmp_a.push(a_fruit[i]);
				} else {
					if (grid[y+1][x] == MINO_TYPE.DEAD
						|| grid[y+1][x] == MINO_TYPE.STILL
						|| grid[y+1][x] == MINO_TYPE.HEAVY){
						h_fruit.push(a_fruit[i]);
					} else {
						tmp_a.push(a_fruit[i]);
					}
				}
			} else {
				h_fruit.push(new Mino(a_fruit[i].pos));
			}
		}
		a_fruit = tmp_a;
		// setting the grid
		for (let i = 0; i < a_fruit.length; i++) {
			let {x, y} = a_fruit[i].pos;
			set_grid(y, x, MINO_TYPE.FRUIT);
		}
	}
	// setting rooten fruit
	for(let i = 0; i < h_fruit.length; i++) {
		let {x, y} = h_fruit[i].pos;
		set_grid(y, x, MINO_TYPE.HEAVY);
	}

	// it'sa time to move our tetr
	// TODO help me! I'm threaten by a snake!
	if (ticks % (tetr.boost ? SPEED.TETR_BOOST : SPEED.TETR) == 0) {
		let minos = tetr.minos;
		// tetramino's way is free to fall
		let free_to_fall = true;
		let snake_body = [MINO_TYPE.SNAKE, MINO_TYPE.HEAD_U, MINO_TYPE.HEAD_D,
			MINO_TYPE.HEAD_L, MINO_TYPE.HEAD_R];
		for (let i = 0; i < minos.length; ++i) {
			let {x, y} = minos[i].pos;
			if ((y >= SIZE.H - 1) || (
					[MINO_TYPE.EMPTY,
					MINO_TYPE.ACTIVE,
					MINO_TYPE.FRUIT].indexOf(grid[y+1][x]) === -1
					&& snake_body.indexOf(grid[y+1][x]) === -1)) {
				free_to_fall = false;
				break;
			}
			if (snake_body.indexOf(grid[y+1][x])) {
				snake.collide();
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
	// new fresh fruit spawn
	if (ticks % SPEED.FOOD == 0) {
		a_fruit.push(new Mino({x: get_rnd(1, SIZE.W-1)>>0, 
			y: get_rnd(0, 3)>>0}));
	}
	// line removal
	for (let i = 0; i < SIZE.H; i++) {
		if (line_complete(i)) {
			remove_line(i);
			//shift_upper_lines(i);
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

// is there any particular typed mino in the neighborhood
function any_neigh(pos, type) {
	let {x, y} = pos;
	let ps = [
		{x: x + 1, y: y},
		{x: x - 1, y: y},
		{x: x, y: y + 1},
		{x: x, y: y - 1}
	];
	let n = _.filter(ps, (p) => {
		return p.x >= 0 && p.y >= 0 && p.x < SIZE.W && p.y < SIZE.H;
	});
	return _.map(n, (p) => { return grid[p.y][p.x]; }).indexOf(type) !== -1;
}

// Return true, if line complete, false otherwise.
function line_complete(y) {
	is_complete = true;
	let i = 0;
	while (is_complete && (i < grid[y].length)) {
		if ([MINO_TYPE.STILL, MINO_TYPE.HEAVY, MINO_TYPE.DEAD]
			.indexOf(grid[y][i]) == -1) {
			is_complete = false;
		}
		i++;
	}
	return is_complete;
}

function remove_line(y) {
	for (let i = 0; i < grid[y].length; ++i) {
		if (grid[y][i] === MINO_TYPE.DEAD) {
			let dead_index = _.findIndex(dminos, (m) => {
				return m.pos.x === i && m.pos.y === y;
			});
			dminos.splice(dead_index, 1);
			set_grid(y, i, MINO_TYPE.EMPTY);
		}
		else if ([MINO_TYPE.HEAVY].indexOf(grid[y][i]) == -1) {
			set_grid(y, i, MINO_TYPE.EMPTY);
		}
	}
	for (let r = 0; r < y; ++r) {
		for (let c = 0; c < SIZE.W; ++c) {
			if (grid[r][c] === MINO_TYPE.STILL)
				still_falling.push(new Mino({x:c, y:r}));
		}
	}
	// sort by y descending to fall right 
	still_falling = _.sortBy(still_falling, (m) => {return m.pos.y});
}
