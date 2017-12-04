// ST for states
const ST = {
	MENU: 0,
	TUTOR: 1,
	GAME: 2,
	OVER: 3
};

let game_state = ST.MENU;

function change_slide() {
	switch (game_state) {
		case ST.MENU:
			document.getElementById('menu').classList.add('hidden');
			document.getElementById('tutor').classList.remove('hidden');
			game_state = ST.TUTOR;
		break;
		case ST.TUTOR:
			document.getElementById('tutor').classList.add('hidden');
			document.getElementById('hud').classList.remove('hidden');
			game_state = ST.GAME;
			newGame();
		break;
		case ST.GAME:
			document.getElementById('hud').classList.add('hidden');
			document.getElementById('gameover').classList.remove('hidden');
			game_state = ST.OVER;
		break;
		case ST.OVER:
			document.getElementById('gameover').classList.add('hidden');
			document.getElementById('menu').classList.remove('hidden');
			game_state = ST.MENU;
		break;
	}
}
