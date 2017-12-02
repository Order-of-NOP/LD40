class Mino
{
    /** Mino
     *
     * @param {{x:number, y:number}} pos
     */
    constructor(pos) {
        this.pos = pos;
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
let grid = new Array(SIZE.H,SIZE.W);
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
		}
	}

	// init all the stuff
	snake = new Snake();

	// when all done, start a timer
	clk.start();
}

// main game tick
function gameTick() {
	// TODO remove the debug thing
	g.g.thing.x += 32;

    // heading snake to the right direction
    {
        let {x, y} = snake.get_head().pos;
        // snake.dir supposed to be of MINO_TYPEs
        grid[y][x] = snake.dir;
    }
	let {x, y} = snake.get_tail().pos;
	// TODO ...

    // input for snake
    if (input[PL.SNK].up.isDown) {
        snake.dir = MINO_TYPE.HEAD_U;
    } else if (input[PL.SNK].down.isDown) {
        snake.dir = MINO_TYPE.HEAD_D;
    } else if (input[PL.SNK].right.isDown) {
        snake.dir = MINO_TYPE.HEAD_R;
    } else if (input[PL.SNK].left.isDown) {
        snake.dir = MINO_TYPE.HEAD_L;
    }

}
