import * as pc from 'playcanvas';
import { Camera } from '../camera/camera';
import { InputHandlerComponent } from '../component/inputHandlerComponent';
import { SyncComponent, SyncType } from '../component/syncComponent';
import { Entity } from '../entity/entity';
import { EntityPlayer } from '../entity/player/entityPlayer';
import { Game } from '../game/game';
import { Input } from '../input/input';
import { Network } from '../network/network';
import { Render } from './render';

export class Gameface {
    public static Instance: Gameface;

    public player?: Entity;
    public controllingEntity: string = "";

    public get game() { return this._game; }
    public get network() { return this._network; }
    public get app() { return this._app; }

    private _game: Game;
    private _app: pc.Application;
    private _network: Network;

    private _canvas;

    constructor(canvas) {
        this._canvas = canvas;
        this._game = new Game();
        this._network = new Network();
        
        Gameface.Instance = this;
    }

    public start() {
        this.initPlaycanvas();

        this.network.init();

        Camera.init();
        Render.init(this._app);
        Input.init(this._app);

        this.game.start();

        const world = this.game.createWorld('world');
        world.init();

        Render.world = world;

        const isMultiplayer = true;

        if(isMultiplayer) {
            this.network.connect();
            this.network.sendJoinServer('idk');
        } else {
            world.generateWorld();

            const entity = world.spawnEntity(EntityPlayer);
            this.setPlayer(entity);
        }
    }

    public update(dt: number) {
        this.game.update(dt);
        this.network.update(dt);
        

        Camera.update(dt);
        Render.update(dt);
    }

    private initPlaycanvas() {
        const canvas = this._canvas;
        const app = this._app = new pc.Application(canvas, {
            mouse: new pc.Mouse(canvas),
            touch: new pc.TouchDevice(canvas),
            keyboard: new pc.Keyboard(document.body)
        });

        ///pc.registerScript(TextScript, 'textScript', app);

        app.resizeCanvas(800, 600);
        app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        app.setCanvasResolution(pc.RESOLUTION_AUTO);

        app.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);

        app.on('update', (dt: number) => this.update(dt));
        app.start();
    }

    public setPlayer(entity: Entity) {
        this.player = entity;
        this.player.getComponent(InputHandlerComponent).enabled = true;
        this.player.getComponent(SyncComponent).syncType = SyncType.DONT_SYNC;
    }

    public checkControllingEntity() {
        if(this.player) {
            if(this.player.id == this.controllingEntity) return;
        }

        const world = this.game.worlds[0];
        const entity = world.getEntity(this.controllingEntity);

        if(entity) {
            this.setPlayer(entity);
        }
    }
}