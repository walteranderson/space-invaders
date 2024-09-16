import { Bullet } from "./bullet";
import { events } from "./events";
import { GameEntity, GameEntityUpdateParams } from "./game-entity";

export class Ship implements GameEntity {
  public x: number;
  public y: number;
  public size: number;
  public speed: number;
  public direction: 1 | -1;
  private shotCounter = 0;

  constructor(params: {
    x: number;
    y: number;
    direction: 1 | -1;
    speed: number;
    size: number;
  }) {
    this.x = params.x;
    this.y = params.y;
    this.direction = params.direction;
    this.speed = params.speed;
    this.size = params.size;
  }

  update({ diff }: GameEntityUpdateParams): void {
    if (this.shouldShoot(diff)) {
      this.shoot();
    }
    this.x += this.speed * this.direction;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillRect(this.x, this.y, this.size, this.size);
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
        x: this.x + this.size / 2,
        y: this.y + this.size / 2,
        direction: 1,
      }),
    );
  }
}
