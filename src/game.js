const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

const ADVANCE_Y_INTERVAL = 30;
const SPEED_INTERVAL = 0.18;

const SHIP_ROWS = 4;
const SHIP_COLS = 8;
const SHIP_X_SPACING = 80;
const SHIP_Y_SPACING = 55;

let KeysPressed = {};
window.addEventListener('keydown', (event) => {
	if (KeysPressed[event.key]) return;
	KeysPressed[event.key] = true;
});
window.addEventListener('keyup', (event) => {
	delete KeysPressed[event.key];
});

export function createGame(canvas, ctx) {
	const entities = [
		createShipGrid(),
		createPlayer()
	];

	return {
		update(diff) {
			for (let i = 0; i < entities.length; i++) {
				entities[i].update(diff);
			}
		},
		draw() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			for (let i = 0; i < entities.length; i++) {
				entities[i].draw(ctx);
			}
		},
	}
}

function createPlayer() {
	let x = 10;
	let y = CANVAS_HEIGHT - 40;
	let size = 20;

	let bullets = [];
	let shooting = false;
	function shoot() {
		if (shooting) return;
		bullets.push(
			createBullet(
				x + size / 3.25,
				y - size / 2.5,
				-1
			)
		);
	}

	return {
		update() {
			const speed = 3;
			if (KeysPressed['ArrowRight']) {
				x += speed;
			}
			if (KeysPressed['ArrowLeft']) {
				x -= speed;
			}
			if (KeysPressed[' ']) {
				shoot();
				shooting = true;
			} else {
				shooting = false;
			}

			if (bullets.length > 0) {
				for (let i = bullets.length-1; i >= 0; i--) {
					const bullet = bullets[i];
					if (bullet.update()) {
						bullets.splice(i, 1);
					}
				}
			}
		},
		draw(ctx) {
			ctx.fillRect(x, y, size, size);
			bullets.forEach((bullet) => {
				bullet.draw(ctx);
			});
		}
	}
}

function createBullet(_x, _y, direction) {
	let x = _x;
	let y = _y;
	let size = 8;
	const limit = direction < 0 ? 0 : CANVAS_HEIGHT;

	return {
		update() {
			if (y < limit) {
				return true;
			}
			y = y + 5 * direction;
		},
		draw(ctx) {
			ctx.fillRect(x, y, size, size);
		}
	}
}

function createShipGrid() {
	let _speed = 0.6;
	let _direction = 1;
	let _size = 40;

	let ships = [];
	for (let row = 0; row < SHIP_ROWS; row++) {
		for (let col = 0; col < SHIP_COLS; col++) {
			if (!ships[row]) ships[row] = [];
			ships[row][col] = {
				x: SHIP_X_SPACING + (SHIP_X_SPACING * col),
				y: SHIP_Y_SPACING * (row + 1),
			};
		}
	}

	function forEachShip(cb) {
		for (let x = 0; x <= ships.length - 1; x++) {
			for (let y = 0; y <= ships[x].length - 1; y++) {
				cb(ships[x][y]);
			}
		}
	}

	function advance() {
		let first, last;
		for (let x = 0; x <= ships.length - 1; x++) {
			const row = ships[x];
			if (!first || row[0].x < first.x) {
				first = row[0];
			}
			if (!last || row[row.length - 1].x > last.x) {
				last = row[row.length - 1];
			}
		}

		let advancing = false;
		if (first.x <= 0 || last.x + _size >= CANVAS_WIDTH) {
			advancing = true;
			_direction = _direction > 0 ? -1 : 1;
			_speed = _speed + SPEED_INTERVAL;
		}
		return advancing;
	}

	function checkEnd() {
		return !!ships[ships.length - 1]
			.filter(s => s.y + _size >= CANVAS_HEIGHT)
			.length;
	}

	return {
		update(diff) {
			if (checkEnd()) return true;
			const shouldAdvance = advance();

			forEachShip(ship => {
				ship.x += _speed * _direction;
				if (shouldAdvance) {
					ship.y += ADVANCE_Y_INTERVAL;
				}
			});
		},
		draw(ctx) {
			forEachShip(ship => {
				ctx.fillRect(ship.x, ship.y, _size, _size);
			});
		}
	}
}
