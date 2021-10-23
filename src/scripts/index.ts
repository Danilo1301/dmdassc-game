
import { GameClient } from './game/gameClient'

const canvas = document.getElementById('game');
const game = new GameClient(canvas);
game.start();