import { GameClient } from "./game/gameClient";

const game = new GameClient(document.getElementById('game'));
game.start();
window['game'] = game;

game.createServer('server1');