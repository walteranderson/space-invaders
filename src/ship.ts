import { Bullet } from "./bullet";
import { events } from "./events";
import { GameEntity, GameEntityUpdateParams } from "./game-entity";

export class Ship implements GameEntity {
  readonly type = "SHIP";
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  direction: 1 | -1;
  private shotCounter = 0;

  constructor(params: {
    x: number;
    y: number;
    direction: 1 | -1;
    speed: number;
    width: number;
    height: number;
  }) {
    this.x = params.x;
    this.y = params.y;
    this.direction = params.direction;
    this.speed = params.speed;
    this.width = params.width;
    this.height = params.height;
  }

  update({ diff }: GameEntityUpdateParams): void {
    if (this.shouldShoot(diff)) {
      this.shoot();
    }
    this.x += this.speed * this.direction;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  private shouldShoot(diff: number) {
    if (this.shotCounter + diff >= 1_000) {
      this.shotCounter = 0;
      return Math.random() * 100 < 6;
    }

    this.shotCounter += diff;
    return false;
  }

  private shoot() {
    events.emit(
      "add_entity",
      new Bullet({
        x: this.x + this.width / 2,
        y: this.y + this.height / 2,
        direction: 1,
        origin: this.type,
      }),
    );
  }
}
