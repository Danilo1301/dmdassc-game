import * as pc from 'playcanvas';
import { Camera } from './camera';
import { InputHandlerComponent } from '../shared/component/inputHandlerComponent';
import { SyncComponent, SyncType } from '../shared/component/syncComponent';
import { Entity } from '../shared/entity/entity';
import { EntityPlayer } from '../shared/entity/entityPlayer';
import { Game } from '../shared/game';
import { Input } from '../shared/input';
import { Network } from './network';
import { Render } from './render';
import { TextScript } from './playcanvas/scripts/textScript';
import { EntityWeapon } from '../shared/entity/entityWeapon';
import { WeaponComponent } from '../shared/component/weaponComponent';
import { WorldSyncType } from '../shared/world';

export class Gameface {
    public static Instance: Gameface;

    public player?: Entity;
    public controllingEntityId: string = "";

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

        const isMultiplayer = true;

        const world = this.game.createWorld('world');
        if(isMultiplayer) world.syncType = WorldSyncType.CLIENT;
        world.init();

        Render.world = world;

        

        if(isMultiplayer) {
            this.network.connect();
            this.network.sendJoinServer('idk');
        } else {
            world.generateWorld();

            const entity = world.spawnEntity(EntityPlayer);
            this.setPlayer(entity);
        }
    }

    public equipGun(entity: Entity) {
        const weapon = entity.world.spawnEntity(EntityWeapon);

        weapon.getComponent(WeaponComponent).entityOwner = entity;
        weapon.attachToEntity(entity);
    }

   
    public update(dt: number) {
        //this.game.update(dt);
        this.network.update(dt);

        this.checkControllingEntity();

        Camera.update(dt);
    }

    public render(dt: number) {
        Render.render(dt);
    }


    private initPlaycanvas() {
        const canvas = this._canvas;
        const app = this._app = new pc.Application(canvas, {
            mouse: new pc.Mouse(canvas),
            touch: new pc.TouchDevice(canvas),
            keyboard: new pc.Keyboard(document.body)
        });

        pc.registerScript(TextScript, 'textScript', app);

        
        app.resizeCanvas(800, 600);
        app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        app.setCanvasResolution(pc.RESOLUTION_AUTO);

        app.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);

        app.on('update', (dt: number) => this.update(dt));
        app.on('update', (dt: number) => this.render(dt));
        app.start();

        window.addEventListener('resize', function(event) {
            app.resizeCanvas()
        }, true);


        //--

        /*
        const text = new pc.Entity('text');
        app.root.addChild(text);
        const textScript = (text.addComponent('script') as pc.ScriptComponent).create('textScript') as TextScript;

        console.log(textScript)
        */
    }

    public setPlayer(entity: Entity) {
        this.player = entity;
        this.player.getComponent(InputHandlerComponent).enabled = true;

        if(this.player.hasComponent(SyncComponent)) {
            this.player.getComponent(SyncComponent).syncType = SyncType.DONT_SYNC;
        }
        console.warn("SETPLAYER")
    }

    public checkControllingEntity() {
        if(this.player) {
            if(this.player.id == this.controllingEntityId) return;
        }

        const world = this.game.worlds[0];

        if(!world) return;

        const entity = world.getEntity(this.controllingEntityId);

        if(entity) {
            this.setPlayer(entity);
        }
    }
}