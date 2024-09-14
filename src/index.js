import './index.css';
import { createGame } from './game';

let game;
let lastRendered = 0;

window.addEventListener('load', init);
function init() {
	const canvas = document.querySelector('#game');
	const ctx = canvas.getContext('2d');
	ctx.font = '32px sans-serif';
	ctx.fillStyle = 'white';
	ctx.strokeStyle = 'white';
	game = createGame(canvas, ctx);
	window.requestAnimationFrame(loop);
}

function loop(now) {
	game.update(now - lastRendered);
	game.draw();
	lastRendered = now;
	window.requestAnimationFrame(loop);
}
