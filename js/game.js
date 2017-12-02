// time's atom
let clk_time = 500;

// ST for states
const ST = {
	MENU: 0,
	GAME: 1,
	OVER: 2
};

function newGame() {
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
