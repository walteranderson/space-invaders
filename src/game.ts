import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { events } from "./events";
import { GameEntity } from "./game-entity";
import { KeyListener } from "./key-listener";
import { Player } from "./player";
import { Ship } from "./ship";

export class Game {
  private ctx: CanvasRenderingContext2D;
  private entities: GameEntity[] = [];
  private keyListener: KeyListener;
  private lastRendered: number;

  constructor() {
    this.ctx = this.initCtx();
    this.initEvents();
    this.keyListener = new KeyListener();
    this.entities = [new Player(), new Ship({ x: 10, y: 10, direction: 1 })];
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
    events.subscribe("add_entity", (e: GameEntity) => {
      this.entities.push(e);
    });

    events.subscribe("remove_entity", (e: GameEntity) => {
      this.entities.splice(this.entities.indexOf(e), 1);
    });
  }
}
