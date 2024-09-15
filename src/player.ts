import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { GameEntity, GameEntityUpdateParams } from "./game";

export class Player implements GameEntity {
  x: number;
  y: number;
  size: number;
  speed: number;
  shooting: boolean;

  constructor() {
    this.x = 10;
    this.y = CANVAS_HEIGHT - 40;
    this.size = 20;
    this.speed = 3;
    this.shooting = false;
  }

  update({ keys }: GameEntityUpdateParams) {
    if (keys.pressed("ArrowRight")) {
      this.moveRight();
    }

    if (keys.pressed("ArrowLeft")) {
      this.moveLeft();
    }

    if (keys.pressed(" ")) {
      this.shoot();
      this.shooting = true;
    } else {
      this.shooting = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  private moveRight() {
    if (this.x + this.size < CANVAS_WIDTH) {
      this.x += this.speed;
      if (this.x + this.size > CANVAS_WIDTH) {
        this.x = CANVAS_WIDTH - this.size;
      }
    }
  }

  private moveLeft() {
    if (this.x > 0) {
      this.x -= this.speed;
      if (this.x < 0) this.x = 0;
    }
  }

  private shoot() {}
}
