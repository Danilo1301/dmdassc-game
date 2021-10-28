import { GameClient } from "./game/gameClient";

const game = new GameClient(document.getElementById('game'));
game.start();
window['game'] = game;
window['GameClient'] = GameClient;

game.createServer('server1');
//GameClient.player = game.mainServer.worlds[0].spawnPlayer()