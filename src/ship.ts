import { CANVAS_WIDTH } from "./constants";
import { GameEntity, GameEntityUpdateParams } from "./game-entity";

// const SPEED_INCREASE = 1;

export class Ship implements GameEntity {
  x: number;
  y: number;
  size: number;
  speed: number;
  direction: 1 | -1;

  constructor(params: { x: number; y: number; direction: 1 | -1 }) {
    this.x = params.x;
    this.y = params.y;
    this.direction = params.direction;
    this.speed = 1;
    this.size = 30;
  }

  update(_: GameEntityUpdateParams): void {
    if (this.x <= 0 || this.x + this.size >= CANVAS_WIDTH) {
      this.direction = this.direction > 0 ? -1 : 1;
      // this.speed = this.speed + SPEED_INCREASE;
    }

    this.x += this.speed * this.direction;
  }
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}
