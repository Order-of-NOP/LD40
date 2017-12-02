class Mino
{
    /** Mino
     * 
     * @param {{x:number, y:number}} pos 
     * @param {string} color 
     */
    constructor(pos, color) {
        this.pos = pos;
        this.color = color;
    }
};
class Snake
{
    /** init
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {string} color 
     */
    constructor(x, y, color) {
        v = validate(x, y, color)
        this.Minos = [new Mino(v.pos, v.color)];
        // current dir
        this.dir = 'down';
        this.dirs = { 
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 },
            up: { x: 0, y: -1 },
            down: { x: 0, y: 1 }
        };
    }
    /** valid_set
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {string} color 
     */
    valid_set(x, y, color){
        return {
            pos: {
                x: x == null ? 0 : x,
                y: y == null ? 0 : y
            },
            color: color == null ? '#000' : color,
            valid: x == null || y == null || color == null
        }
    }
    /** add_mino
     * 
     * @param {{x:number, y:number}} pos 
     * @param {string} color 
     */
    add_mino(pos, color) {
        v = validate(x, y, color)
        if (v.valid) 
            this.Minos.push(new Mino(v.pos, v.color))
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

// Player
const PL = {
    SNK: 0,
    TRS: 1
}

// DIRS
const DIRS = {
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down'
};

function newGame() {
	// time's atom
	let clk_time = 500;

	let clk = g.t.clk;
	clk = game.time.create(false);
	clk.loop(clk_time, gameTick, this);

	// when all done, start a timer
	clk.start();
}

// main game tick
function gameTick() {
    g.g.thing.x += 32;
    // input for snake
    if (input[PL.SNK].up.isDown) {
        snake.dir = DIRS.UP;
    } else if (input[PL.SNK].down.isDown) {
        snake.dir = DIRS.DOWN;
    } else if (input[PL.SNK].right.isDown) {
        snake.dir = DIRS.RIGHT;
    } else if (input[PL.SNK].left.isDown) {
        snake.dir = DIRS.left;
    }
}

