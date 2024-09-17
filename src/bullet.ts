import { CANVAS_HEIGHT } from "./constants";
import { events } from "./events";
import { GameEntity, GameEntityUpdateParams } from "./game-entity";

export class Bullet implements GameEntity {
  readonly type = "BULLET";
  x: number;
  y: number;
  width: number;
  height: number;
  direction: 1 | -1;
  origin: string;
  private speed: number;
  private limit: number;

  constructor(params: {
    x: number;
    y: number;
    direction: 1 | -1;
    origin: string;
  }) {
    this.x = params.x;
    this.y = params.y;
    this.width = 8;
    this.height = 8;
    this.speed = 5;
    this.direction = params.direction;
    this.limit = params.direction < 0 ? 0 : CANVAS_HEIGHT;
    this.origin = params.origin;
  }

  update(_: GameEntityUpdateParams): void {
    if (this.atLimit()) {
      events.emit("remove_entity", this);
      return;
    }
    this.y = this.y + this.speed * this.direction;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  atLimit() {
    if (this.direction > 0) {
      return this.y > this.limit;
    } else {
      return this.y < this.limit;
    }
  }
}
