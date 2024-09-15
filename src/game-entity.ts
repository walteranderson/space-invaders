import { KeyListener } from "./key-listener";

export type GameEntityUpdateParams = {
  diff: number;
  keys: KeyListener;
};

export interface GameEntity {
  update(params: GameEntityUpdateParams): void;
  draw(ctx: CanvasRenderingContext2D): void;
}
