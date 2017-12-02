class Mino {
	/** Mino
	 *
	 * @param {{x:number, y:number}} pos
	 */
	constructor(pos) {
		this.pos = pos;
	}
};

class Tetramino {
	constructor(shape, init_pos_x, init_pos_y) {
		this.shape = shape; // Figure shape status from set {i, o, z, t, l, s}.
		switch(shape) {
			case 'i':
				this.minos = [
					new Mino({x: init_pos_x, y: init_pos_y}),
					new Mino({x: init_pos_x + 1, y: init_pos_y}),
					new Mino({x: init_pos_x + 2, y: init_pos_y}),
					new Mino({x: init_pos_x + 3, y: init_pos_y}),
				]
				break;
		}

		this.rotation = 0; // Rotate status from set {0, 1, 2, 3}.
	}

	change_pos(new_pos) {
		for (let i = 0; i < this.minos.length; i++) {
			this.minos[i].pos.x = new_pos[i].x;
			this.minos[i].pos.y = new_pos[i].y;
		}
	}

	// TODO direction selection
	rotate() {
		switch(this.shape) {
			case 'i':
				switch(this.rotation) {
					case 0:
						return  [
							{x: this.minos[2].pos.x, y: this.minos[2].pos.y - 2}, // 1st mino
							{x: this.minos[2].pos.x, y: this.minos[2].pos.y - 1}, // 2nd mino
							{x: this.minos[2].pos.x, y: this.minos[2].pos.y}, // 3rd mino
							{x: this.minos[2].pos.x, y: this.minos[2].pos.y + 1} // 4rd mino
						];
						break;
				}
		}
	}
};


