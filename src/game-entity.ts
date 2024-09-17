import { KeyListener } from "./key-listener";

export type GameEntityUpdateParams = {
  diff: number;
  keys: KeyListener;
};

export interface GameEntity {
  readonly type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  update(params: GameEntityUpdateParams): void;
  draw(ctx: CanvasRenderingContext2D): void;
}
