import { Bullet } from "./bullet";
import { CANVAS_WIDTH } from "./constants";
import { events } from "./events";
import { GameEntity, GameEntityUpdateParams } from "./game-entity";

// const SPEED_INCREASE = 1;

export class Ship implements GameEntity {
  x: number;
  y: number;
  size: number;
  speed: number;
  direction: 1 | -1;
  private shotCounter = 0;

  constructor(params: { x: number; y: number; direction: 1 | -1 }) {
    this.x = params.x;
    this.y = params.y;
    this.direction = params.direction;
    this.speed = 1;
    this.size = 30;
  }

  update({ diff }: GameEntityUpdateParams): void {
    if (this.shouldShoot(diff)) {
      this.shoot();
    }

    if (this.x <= 0 || this.x + this.size >= CANVAS_WIDTH) {
      this.direction = this.direction > 0 ? -1 : 1;
      // this.speed = this.speed + SPEED_INCREASE;
    }
    this.x += this.speed * this.direction;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  private shouldShoot(diff: number) {
    if (this.shotCounter + diff >= 3_000) {
      this.shotCounter = 0;
      return true;
    }

    this.shotCounter += diff;
    return false;
  }

  private shoot() {
    events.emit(
      "add_entity",
      new Bullet({
        x: this.x + this.size / 2,
        y: this.y + this.size / 2,
        direction: 1,
      }),
    );
  }
}
