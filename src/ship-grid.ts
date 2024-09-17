import { Bullet } from "./bullet";
import { checkCollision } from "./check-collision";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { events } from "./events";
import { GameEntity, GameEntityUpdateParams } from "./game-entity";
import { Ship } from "./ship";

const SHIP_ROWS = 4;
const SHIP_COLS = 8;
const SHIP_X_SPACING = 80;
const SHIP_Y_SPACING = 55;
const SHIP_SPEED_INCREASE = 0.15;

export class ShipGrid implements GameEntity {
  readonly type = "SHIP_GRID";
  direction: 1 | -1;
  speed: number;
  width: number;
  height: number;
  ships: Ship[][];
  x = -1;
  y = -1;

  constructor() {
    this.direction = 1;
    this.speed = 0.25;
    this.width = 30;
    this.height = 30;
    this.initShips();
  }

  update(params: GameEntityUpdateParams): void {
    this.advance();

    if (this.ships.flat().length === 0) {
      events.emit("win");
      return;
    }

    this.each((s) => {
      if (s.y + s.height >= CANVAS_HEIGHT) {
        events.emit("win");
        return;
      }
      s.direction = this.direction;
      s.speed = this.speed;
      s.width = this.width;
      s.height = this.height;
      s.update(params);
    });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.each((s) => s.draw(ctx));
  }

  checkCollision(b: Bullet[]) {
    outer: for (let row = 0; row < this.ships.length; row++) {
      for (let col = 0; col < this.ships[row].length; col++) {
        if (checkCollision(this.ships[row][col], b)) {
          this.ships[row].splice(col, 1);
          break outer;
        }
      }
    }
  }

  private each(cb: (ship: Ship) => void) {
    this.ships.forEach((row) => row.forEach((s) => cb(s)));
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
          width: this.width,
          height: this.height,
        });
      }
    }
  }

  private advance() {
    let first: Ship | undefined;
    let last: Ship | undefined;
    for (let x = 0; x <= this.ships.length - 1; x++) {
      const row = this.ships[x];
      if (!first || (row[0] && row[0].x < first.x)) {
        first = row[0];
      }
      if (!last || (row[row.length - 1] && row[row.length - 1].x > last.x)) {
        last = row[row.length - 1];
      }
    }

    if (!first || !last) {
      return false;
    }

    if (first.x <= 0 || last.x + this.width >= CANVAS_WIDTH) {
      this.direction = this.direction > 0 ? -1 : 1;
      this.speed = this.speed + SHIP_SPEED_INCREASE;
      this.each((s) => {
        s.y = s.y + SHIP_Y_SPACING;
      });
    }
  }
}
