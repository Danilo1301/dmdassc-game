import * as pc from 'playcanvas';
import { Camera } from '../camera/camera';

import { Input } from "../input/input";
import { Network } from "../network/network";
import { Render } from '../render/render';
import { WorldSync } from '../world/worldSync';
import { Game } from "./game";

export class GameClient extends Game {
    public get network() { return this._network; }
    
    private _network: Network;

    constructor(canvas) {
        super();
        this.isClient = true;

        this._network = new Network();
        this._network.init();

        Render.init(this, canvas);
        Input.init();
        Camera.init();

        Render.app.on('update', (dt: number) => {
            this.update(dt);
        });
    }

    public update(dt: number) {
        super.update(dt);

        this._network.update(dt);

        Render.update(dt);
        Input.update(dt);
        Camera.update(dt);
    }

    public start() {
        super.start();
        const server = this.createServer('server1');

        this.network.connect();
        

        this.startMultiplayer();

        
    }

    private startSingleplayer() {
        const server = this.servers[0];
        const world = server.worlds[0];

        //const player = server.worlds[0].spawnPlayer();
        //Render.setPlayer(player);

        const veh = server.worlds[0].spawnVehicle();
        Render.setPlayer(veh);

        world.generateBaseWorld();
    }

    private startMultiplayer() {
        const server = this.servers[0];
        const world = server.worlds[0];

        WorldSync.world = world;
    }
}