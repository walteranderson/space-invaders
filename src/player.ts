import { Bullet } from "./bullet";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { GameEntity, GameEntityUpdateParams } from "./game-entity";
import { events } from "./events";
import { checkCollision } from "./check-collision";

export class Player implements GameEntity {
  readonly type = "PLAYER";
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  shooting: boolean;

  constructor() {
    this.x = 10;
    this.y = CANVAS_HEIGHT - 40;
    this.width = 20;
    this.height = 20;
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
      if (!this.shooting) {
        this.shoot();
        this.shooting = true;
      }
    } else {
      this.shooting = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  checkCollision(bullets: Bullet[]) {
    if (checkCollision(this, bullets)) {
      events.emit("game_over");
    }
  }

  private moveRight() {
    if (this.x + this.width < CANVAS_WIDTH) {
      this.x += this.speed;
      if (this.x + this.width > CANVAS_WIDTH) {
        this.x = CANVAS_WIDTH - this.width;
      }
    }
  }

  private moveLeft() {
    if (this.x > 0) {
      this.x -= this.speed;
      if (this.x < 0) this.x = 0;
    }
  }

  private shoot() {
    events.emit(
      "add_entity",
      new Bullet({
        x: this.x + this.width / 3.25,
        y: this.y - (this.height * 2) / 2.5,
        direction: -1,
        origin: this.type,
      }),
    );
  }
}
