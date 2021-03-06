class Mino {
	/** Mino
	 *
	 * @param {{x:number, y:number}} pos
	 */
	constructor(pos) {
		this.pos = pos;
	}
	down(){
		this.pos.y++;
	}
};

class Tetramino {
	// Note: init_mino is the center mino of the shape,
	// so it sould be placed in the center of the grid.
	constructor(shape, init_mino) {
		// Figure shape status from set {i, o, z, t, l, s, j}.
		this.shape = shape; 
		this.boost = false;
		// Consider 0th mino as the center one.
		if (shape === 'i') {
			this.minos = [
				new Mino({x: init_mino.pos.x, y: init_mino.pos.y}),
				new Mino({x: init_mino.pos.x - 2, y: init_mino.pos.y}),
				new Mino({x: init_mino.pos.x - 1, y: init_mino.pos.y}),
				new Mino({x: init_mino.pos.x + 1, y: init_mino.pos.y}),
			]
		}
		else if (shape === 'o') {
				this.minos = [
				new Mino({x: init_mino.pos.x, y: init_mino.pos.y}),
				new Mino({x: init_mino.pos.x + 1, y: init_mino.pos.y}),
				new Mino({x: init_mino.pos.x, y: init_mino.pos.y + 1}),
				new Mino({x: init_mino.pos.x + 1, y: init_mino.pos.y + 1}),
			]
		}
		else if (shape === 'z') {
				this.minos = [
				new Mino({x: init_mino.pos.x, y: init_mino.pos.y}),
				new Mino({x: init_mino.pos.x - 1, y: init_mino.pos.y}),
				new Mino({x: init_mino.pos.x, y: init_mino.pos.y + 1}),
				new Mino({x: init_mino.pos.x + 1, y: init_mino.pos.y + 1}),
			]
		}
		else if (shape === 't') {
				this.minos = [
				new Mino({x: init_mino.pos.x, y: init_mino.pos.y}),
				new Mino({x: init_mino.pos.x - 1, y: init_mino.pos.y}),
				new Mino({x: init_mino.pos.x, y: init_mino.pos.y + 1}),
				new Mino({x: init_mino.pos.x + 1, y: init_mino.pos.y}),
			]
		}
		else if (shape === 'l') {
				this.minos = [
				new Mino({x: init_mino.pos.x, y: init_mino.pos.y}),
				new Mino({x: init_mino.pos.x, y: init_mino.pos.y + 1}),
				new Mino({x: init_mino.pos.x + 1, y: init_mino.pos.y}),
				new Mino({x: init_mino.pos.x + 2, y: init_mino.pos.y}),
			]
		}
		else if (shape === 's') {
				this.minos = [
				new Mino({x: init_mino.pos.x, y: init_mino.pos.y}),
				new Mino({x: init_mino.pos.x - 1, y: init_mino.pos.y + 1}),
				new Mino({x: init_mino.pos.x, y: init_mino.pos.y + 1}),
				new Mino({x: init_mino.pos.x + 1, y: init_mino.pos.y}),
			]
		}
		else if (shape === 'j') {
				this.minos = [
				new Mino({x: init_mino.pos.x, y: init_mino.pos.y}),
				new Mino({x: init_mino.pos.x - 2, y: init_mino.pos.y}),
				new Mino({x: init_mino.pos.x - 1, y: init_mino.pos.y}),
				new Mino({x: init_mino.pos.x, y: init_mino.pos.y + 1}),
			]
		}
		else {
			console.warn("WARNING: Tetramino constructor: invalid shape token");
		}
	}

	set_pos(new_minos) {
		for (let i = 0; i < this.minos.length; i++) {
			this.minos[i] = new_minos[i];
		}
	}

	move(direction) {
		let new_minos = [];
		if (direction === "left") {
			for (let i = 0; i < this.minos.length; i++) {
				new_minos.push(new Mino({
					x: this.minos[i].pos.x - 1,
					y: this.minos[i].pos.y
				}))
			}
		}
		else if (direction === "right") {
			for (let i = 0; i < this.minos.length; i++) {
				new_minos.push(new Mino({
					x: this.minos[i].pos.x + 1,
					y: this.minos[i].pos.y
				}))
			}
		}
		else if (direction === "down") {
			for (let i = 0; i < this.minos.length; i++) {
				new_minos.push(new Mino({
					x: this.minos[i].pos.x,
					y: this.minos[i].pos.y + 1
				}))
			}
		}
		else {
			console.warn("WARNING: Tetramino move: invalid direction token");
		}
		return new_minos;
	}

	// TODO direction selection
	rotate() {
		if (this.shape === 'o') {
			return this.minos;
		}
		// Calculate minos coordinates relative to the center.
		// 0th mino is the center one, thus we start loop from 1th.
		let new_minos = [];
		new_minos.push(new Mino({
			x: this.minos[0].pos.x,
			y: this.minos[0].pos.y
		}))
		for (let i = 1; i < this.minos.length; i++) {
			new_minos.push(new Mino({
				x: this.minos[i].pos.x - this.minos[0].pos.x,
				y: this.minos[i].pos.y - this.minos[0].pos.y,
			}))
		}
		// Generate new coordinates for non-center minos.
		for (let i = 1; i < this.minos.length; i++) {
			let old_x = new_minos[i].pos.x;
			new_minos[i].pos.x = -(new_minos[i].pos.y);
			new_minos[i].pos.y = old_x;
		}
		// Transform coordinates from local values back to global ones.
		for (let i = 1; i < this.minos.length; i++) {
			new_minos[i].pos.x = new_minos[i].pos.x + this.minos[0].pos.x;
			new_minos[i].pos.y = new_minos[i].pos.y + this.minos[0].pos.y;
		}
		return new_minos;
	}
};
