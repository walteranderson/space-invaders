import { Bullet } from "./bullet";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { events } from "./events";
import { GameEntity } from "./game-entity";
import { KeyListener } from "./key-listener";
import { Player } from "./player";
import { ShipGrid } from "./ship-grid";

export class Game {
  private ctx: CanvasRenderingContext2D;
  private entities: GameEntity[] = [];
  private keyListener: KeyListener;
  private lastRendered: number;

  constructor() {
    this.ctx = this.initCtx();
    this.initEvents();
    this.keyListener = new KeyListener();
    this.entities = [new Player(), new ShipGrid()];
  }

  start() {
    this.lastRendered = 0;
    this.loop(0);
  }

  update(diff: number) {
    this.checkCollisions();

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

  private checkCollisions() {
    const [bullets, rest] = this.separate();
    if (!bullets.length) {
      return;
    }

    for (let i = 0; i < rest.length; i++) {
      switch (rest[i].type) {
        case "SHIP_GRID":
          (rest[i] as ShipGrid).checkCollision(bullets);
          break;
        case "PLAYER":
          (rest[i] as Player).checkCollision(bullets);
          break;
      }
    }
  }

  private separate(): [Bullet[], GameEntity[]] {
    let bullets: Bullet[] = [];
    let rest: GameEntity[] = [];
    let i = this.entities.length;
    while (i--) {
      const e = this.entities[i];
      if (e.type === "BULLET") {
        bullets.push(e as Bullet);
      } else if (e.type === "PLAYER" || e.type === "SHIP_GRID") {
        rest.push(e);
      }
    }
    return [bullets, rest];
  }
}
