import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { KeyListener } from "./key-listener";
import { Player } from "./player";

export type GameEntityUpdateParams = {
  diff: number;
  keys: KeyListener;
};

export interface GameEntity {
  update(params: GameEntityUpdateParams): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

export class Game {
  private ctx: CanvasRenderingContext2D;
  private entities: GameEntity[] = [];
  private keyListener: KeyListener;
  private lastRendered: number;

  constructor() {
    const canvas = document.querySelector<HTMLCanvasElement>("#game");
    if (!canvas) throw new Error("canvas not found");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("error getting canvas");
    this.ctx = ctx;
    this.ctx.font = "32px sans-serif";
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "white";

    this.entities = [new Player()];
    this.keyListener = new KeyListener();
  }

  start() {
    this.lastRendered = 0;
    this.loop(0);
  }

  update(diff: number) {
    let i = this.entities.length;
    while (i--) {
      this.entities[i].update({
        diff,
        keys: this.keyListener,
      });
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    let i = this.entities.length;
    while (i--) {
      this.entities[i].draw(this.ctx);
    }
  }

  private loop(now: number) {
    this.draw();
    this.update(now - this.lastRendered);
    this.lastRendered = now;
    window.requestAnimationFrame(this.loop.bind(this));
  }
}
