import * as pc from 'playcanvas'
import { CameraFollow } from '../scripts/cameraFollow';
import { EntitySync } from '../scripts/entitySync';
import { Movement } from '../scripts/movement';
import { World } from '../world/world';
import { GameClient } from './gameClient';

export class Game {
    private _isServer: boolean;
    private _canvas: HTMLCanvasElement;
    private _app: pc.Application;
    private _world: World;
    
    public get isServer() { return this._isServer; }
    public get app() { return this._app; }
    public get world() { return this._world; }

    constructor(canvas: HTMLCanvasElement, isClient?: boolean) {
        this._canvas = canvas;
        this._isServer = isClient !== true;
        this._world = new World(this);

        console.log(`[Game] constructor; isServer =`, this.isServer);
    }

    public start() {
        this.setupApp();
        this.app.on('update', (dt) => this.update(dt));
        this.app.start();
        this.setupResize();
        this.setupLocalClientScene(!this.isServer);

        this.world.setupWorld();
    }

    protected update(dt: number) {}

    private setupApp() {
        const canvas = this._canvas;
        const app = new pc.Application(canvas, {
            mouse: new pc.Mouse(canvas),
            touch: new pc.TouchDevice(canvas),
            keyboard: new pc.Keyboard(document.body)
        });

        this._app = app;
        
        pc.registerScript(CameraFollow, 'cameraFollow', app);
        pc.registerScript(Movement, 'movement', app);
        pc.registerScript(EntitySync, 'entitySync', app);
    }

    private setupResize() {
        this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        this.app.setCanvasResolution(pc.RESOLUTION_AUTO);

        window.addEventListener('resize', () => this.resize());
        this.resize();
    }

    private setupLocalClientScene(isLocalClient?: boolean) {
        const app = this.app;

        const camera = new pc.Entity('camera');
        camera.addComponent('camera', {
            clearColor: new pc.Color(0.1, 0.1, 0.1)
        });
        app.root.addChild(camera);
        camera.setPosition(0, 6, 0);
        camera.setEulerAngles(-90, 0, 0);
        (camera.addComponent('script') as pc.ScriptComponent).create('cameraFollow');
        
        const light = new pc.Entity('light');
        light.addComponent('light');
        app.root.addChild(light);
        light.setEulerAngles(30, 0, 0);

        if(isLocalClient) {
            GameClient.camera = camera;
        }
    }

    public resize() {
        const canvas = this._canvas;

        this.app.resizeCanvas();
        canvas.style.width = "100%";
        canvas.style.height = "100%";
    }
}