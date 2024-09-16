import { CANVAS_WIDTH } from "./constants";
import { GameEntity, GameEntityUpdateParams } from "./game-entity";
import { Ship } from "./ship";

const SHIP_ROWS = 4;
const SHIP_COLS = 8;
const SHIP_X_SPACING = 80;
const SHIP_Y_SPACING = 55;
const SHIP_SPEED_INCREASE = 0.05;

export class ShipGrid implements GameEntity {
  direction: 1 | -1;
  speed: number;
  size: number;
  ships: Ship[][];

  constructor() {
    this.direction = 1;
    this.speed = 1;
    this.size = 30;
    this.initShips();
  }

  update(params: GameEntityUpdateParams): void {
    this.advance();
    this.each((s) => {
      s.direction = this.direction;
      s.speed = this.speed;
      s.size = this.size;
      s.update(params);
    });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.each((s) => s.draw(ctx));
  }

  private each(cb: (ship: Ship) => void) {
    for (let x = 0; x <= this.ships.length - 1; x++) {
      for (let y = 0; y <= this.ships[x].length - 1; y++) {
        cb(this.ships[x][y]);
      }
    }
  }

  private initShips() {
    this.ships = [];
    for (let row = 0; row < SHIP_ROWS; row++) {
      for (let col = 0; col < SHIP_COLS; col++) {
        if (!this.ships[row]) this.ships[row] = [];
        this.ships[row][col] = new Ship({
          x: SHIP_X_SPACING + SHIP_X_SPACING * col,
          y: SHIP_Y_SPACING * (row + 1),
          direction: this.direction,
          speed: this.speed,
          size: this.size,
        });
      }
    }
  }

  private advance() {
    let first: Ship | undefined;
    let last: Ship | undefined;
    for (let x = 0; x <= this.ships.length - 1; x++) {
      const row = this.ships[x];
      if (!first || row[0].x < first.x) {
        first = row[0];
      }
      if (!last || row[row.length - 1].x > last.x) {
        last = row[row.length - 1];
      }
    }

    if (!first || !last) {
      return false;
    }

    let advancing = false;
    if (first.x <= 0 || last.x + this.size >= CANVAS_WIDTH) {
      advancing = true;
      this.direction = this.direction > 0 ? -1 : 1;
      this.speed = this.speed + SHIP_SPEED_INCREASE;
    }

    return advancing;
  }
}
