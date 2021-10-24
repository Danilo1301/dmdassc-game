const Ammo = require('ammo.js');
window['Ammo'] = Ammo;

import { GameClient } from "./game/gameClient";
import { GameServer } from "./game/gameServer";

const isServer = location.href.includes("#server");

if(isServer) {
    const server = new GameServer(document.getElementById('game') as HTMLCanvasElement);
    server.start();
    window['game'] = server;
} else {
    const client = new GameClient(document.getElementById('game') as HTMLCanvasElement);
    client.start();
    window['game'] = client;
}

