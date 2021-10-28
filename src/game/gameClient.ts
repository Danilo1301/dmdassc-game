import CANNON from 'cannon'
import * as pc from "playcanvas";
import { Entity } from '../entity/entity';
import { Network } from "../network/network";
import { IPacketData_ConnectToServer, PacketType } from '../packet/packet';
import { Game } from "./game";

export class GameClient extends Game {
    public static Instance: GameClient;
    public static camera: pc.Entity;
    public static playerId: string = "";
    public static player?: Entity;

    private _app: pc.Application;
    private _canvas;
    private _network: Network;

    public get app() { return this._app; }
    public get network() { return this._network; }

    constructor(canvas) {
        super();
        this._canvas = canvas;
        this._network = new Network(this);
        GameClient.Instance = this;
    }

    protected update(dt: number) {
        super.update(dt);


        if(GameClient.player) {

            const input = GameClient.player.input;
            input.horizontal = 0;
            input.vertical = 0;

            if(this.app.keyboard.isPressed(pc.KEY_A)) input.horizontal = -1;
            if(this.app.keyboard.isPressed(pc.KEY_D)) input.horizontal = 1;

            if(this.app.keyboard.isPressed(pc.KEY_W)) input.vertical = -1;
            if(this.app.keyboard.isPressed(pc.KEY_S)) input.vertical = 1;

        }


        this.render();

        this.network.update(dt);
    }

    public start() {
        super.start();
        this.setupApp();
        this.setupResize();
        this.setupLocalClientScene();

        
        this.network.connect(() => {
            console.log(`[Network] Connected? ${this.network.connected}`);

            const data: IPacketData_ConnectToServer = {
                id: 'any'
            }
            this.network.send(PacketType.CONNECT_TO_SERVER, data);
        });
            
    }

    private setupApp() {
        const canvas = this._canvas;
        const app = new pc.Application(canvas, {
            mouse: new pc.Mouse(canvas),
            touch: new pc.TouchDevice(canvas),
            keyboard: new pc.Keyboard(document.body)
        });
        app.on('update', dt => this.update(dt))
        app.start();

        this._app = app;
        
        //pc.registerScript(CameraFollow, 'cameraFollow', app);
    }

    private setupResize() {
        this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        this.app.setCanvasResolution(pc.RESOLUTION_AUTO);

        window.addEventListener('resize', () => this.resize());
        this.resize();
    }

    public resize() {
        const canvas = this._canvas;

        this.app.resizeCanvas();
        canvas.style.width = "100%";
        canvas.style.height = "100%";
    }

    private setupLocalClientScene() {
        const app = this.app;

        const camera = new pc.Entity('camera');
        camera.addComponent('camera', {
            clearColor: new pc.Color(0.1, 0.1, 0.1)
        });
        app.root.addChild(camera);
        camera.setPosition(0, 5, 10);
        camera.lookAt(0, 0, 0);
        //camera.setEulerAngles(-90, 0, 0);
        (camera.addComponent('script') as pc.ScriptComponent).create('cameraFollow');
        
        const light = new pc.Entity('light');
        light.addComponent('light');
        app.root.addChild(light);
        light.setEulerAngles(30, 0, 0);

        GameClient.camera = camera;
    }

    public render() {
        if(!this.mainServer) return;
        
        const world = this.mainServer.worlds[0];

        world.entities.map(entity => {
            if(!entity.pcEntity) {

                let halfExtents = new CANNON.Vec3(0.1, 0.1, 0.1);
                let radius = 1;
                let box = false;

                if(entity.body) {
                    const shape = entity.body!.shapes[0];

                    if(shape) {
                        if(shape instanceof CANNON.Box) {
                            halfExtents = shape.halfExtents;
                            box = true;
                        }

                        if(shape instanceof CANNON.Sphere) {
                            radius = shape.radius;
                        }
                    }
                }
                
                
                const c = entity.data.color;

                const material = new pc.StandardMaterial();
                material.diffuse = new pc.Color(c[0], c[1], c[2]);
                material.update();

                entity.pcEntity = new pc.Entity();

                if(box) {

                    entity.pcEntity.addComponent("render", {
                        material: material,
                        type: "box"
                    });
                    entity.pcEntity.setLocalScale(new pc.Vec3(halfExtents.x * 2, halfExtents.z * 2, halfExtents.y * 2))
                } else {
                    entity.pcEntity.addComponent("render", {
                        material: material,
                        type: "sphere"
                    });
                    entity.pcEntity.setLocalScale(new pc.Vec3(radius * 2, radius * 2, radius * 2))
                }
     

                this.app.root.addChild(entity.pcEntity);

                console.log("yaes")
            }

            const pos = entity.position;
            const angle = new CANNON.Vec3();
            
            entity.body?.quaternion.toEuler(angle);

            entity.pcEntity.setPosition(pos.x, pos.z, pos.y);
            entity.pcEntity.setEulerAngles(
                angle.x * -pc.math.RAD_TO_DEG,
                angle.z * -pc.math.RAD_TO_DEG,
                angle.y * -pc.math.RAD_TO_DEG
            )
            //entity.pcEntity.setEulerAngles(angle.x, angle.z, angle.y);
        })

        if(GameClient.player) {
            GameClient.camera.setPosition(GameClient.player.position.x, GameClient.player.position.z + 10, GameClient.player.position.y)
            GameClient.camera.setEulerAngles(-90, 0, 0)
        }
    }

    public static
}