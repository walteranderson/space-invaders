import "./index.css";
import { Game } from "./game";

window.addEventListener("load", () => {
  const game = new Game();
  game.start();
});
