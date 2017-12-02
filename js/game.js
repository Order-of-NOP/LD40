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
	 * @param {string} color 
	 */
	Snake(x, y, color) {
		v = validate(x, y, color)
		this.Minos = [new Mino(v.pos, v.color)];
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
	/**
	 * 
	 * @param {number} dx 
	 * @param {number} dy 
	 */ 
	move(dx, dy) {
		// move mines from second to last blocks
		for(let i = this.Minos.length; i > 0; i--) {
			this.Minos[i].pos = this.Minos[i-1].pos
		}
		// move head
		let h_pos = Minos[0].pos;
		this.Minos[0].pos = {
			x: h_pos.x + dx,
			y: h_pos.y + dy
		}
	}
}

// ST for states
const ST = {
	MENU: 0,
	GAME: 1,
	OVER: 2
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
}

