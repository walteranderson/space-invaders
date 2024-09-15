import { CANVAS_HEIGHT } from "./constants";
import { GameEntity, GameEntityUpdateParams } from "./game";

export class Player implements GameEntity {
  x: number;
  y: number;
  size: number;
  speed: number;
  shooting: boolean;
  // bullets: Bullet[];

  constructor() {
    this.x = 10;
    this.y = CANVAS_HEIGHT - 40;
    this.size = 20;
    this.speed = 3;
    this.shooting = false;
  }

  update({ keys }: GameEntityUpdateParams) {
    if (keys.pressed("ArrowRight")) {
      this.x += this.speed;
    }
    if (keys.pressed("ArrowLeft")) {
      this.x -= this.speed;
    }
    // if (keys.pressed(' ')) {
    // }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}
