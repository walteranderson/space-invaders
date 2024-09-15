import { CANVAS_HEIGHT } from "./constants";
import { GameEntity, GameEntityUpdateParams } from "./game";

export class Bullet implements GameEntity {
  x: number;
  y: number;
  size: number;
  direction: 1 | -1;
  private speed: number;
  private limit: number;

  constructor(params: { x: number; y: number; direction: 1 | -1 }) {
    this.x = params.x;
    this.y = params.y;
    this.size = 8;
    this.speed = 5;
    this.direction = params.direction;
    this.limit = params.direction < 0 ? 0 : CANVAS_HEIGHT;
  }

  update(_: GameEntityUpdateParams): void {
    if (this.y < this.limit) {
      // TODO remove the bullet
    }
    this.y = this.y + this.speed * this.direction;
  }
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}
