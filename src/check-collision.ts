import { Bullet } from "./bullet";
import { events } from "./events";
import { GameEntity } from "./game-entity";

export function checkCollision(a: GameEntity, b: Bullet[]) {
  let i = b.length;
  while (i--) {
    const bb = b[i];
    const collided =
      a.x + a.width >= bb.x && // a right collides with bb left
      bb.x + bb.width >= a.x && // bb right collides with a left
      a.y + a.height >= bb.y && // a bbottom collides with bb top
      bb.y + bb.height >= a.y; // a top collides with bb bbottom
    if (collided && a.type !== bb.origin) {
      events.emit("remove_entity", bb);
      return true;
    }
  }
  return false;
}
