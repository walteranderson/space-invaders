import "./index.css";
import { Game } from "./game";

let game = new Game();
window.addEventListener("load", () => {
  game.start();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "r") {
    if (game.isRunning()) {
      game.stop();
    } else {
      game.start();
    }
  }
});
