import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { EventEmitter } from "./events";
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
  private events: EventEmitter;

  constructor() {
    this.ctx = this.initCtx();
    this.events = this.initEvents();
    this.keyListener = new KeyListener();
    this.entities = [new Player(this.events)];
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

  private initCtx(): CanvasRenderingContext2D {
    const canvas = document.querySelector<HTMLCanvasElement>("#game");
    if (!canvas) throw new Error("ERROR: canvas not found");

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("ERROR: could not get context");

    ctx.font = "32px sans-serif";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";

    return ctx;
  }

  private initEvents() {
    const events = new EventEmitter();

    events.subscribe("add_entity", (e: GameEntity) => {
      this.entities.push(e);
    });

    return events;
  }
}
