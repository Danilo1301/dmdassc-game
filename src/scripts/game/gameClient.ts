import * as pc from "../../playcanvas";
import { Game } from "./game";
import { Network } from "../network/network";
import { IPacketData_ConnectToServer, PacketType } from "../network/Packet";
import { CameraFollow } from "../scripts/cameraFollow";
import { World } from "../world/world";
import { LocalClient } from "./localClient";

export class GameClient extends Game {
    private _network: Network;

    public get network() { return this._network };

    constructor(canvas) {
        super();

        this._network = new Network(this);

        this.createApplication(canvas, true);
        
        this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        this.app.setCanvasResolution(pc.RESOLUTION_AUTO);

        

        window.addEventListener('resize', () => {
            this.app.resizeCanvas();
            canvas.style.width = "100%";
            canvas.style.height = "100%";
        });

        this.network.connect(() => {
            console.log(`[Network] Connected? ${this.network.connected}`);

            const data: IPacketData_ConnectToServer = {id: 'any'}
            this.network.send(PacketType.CONNECT_TO_SERVER, data);
        });
    }

    public start() {
        super.start();
        this.app.start();

        const server = this.createServer('server1');

        this.setupLocalClientScene();

        

        window['game'] = this;
        window['pc'] = pc;
        window['Game'] = Game;
        window['LocalClient'] = LocalClient;
    }

    protected init() {
        super.init();
    }

    private setupLocalClientScene() {
        const app = this.app;
        const world = this.servers[0].worlds[0];

        //LocalClient.player = world.createPlayer(new pc.Vec3(0, 1, 0), new pc.Color(0, 1, 1));
        //this.attachMovementScript(LocalClient.player);

        const camera = new pc.Entity('camera');
        camera.addComponent('camera', {
            clearColor: new pc.Color(0.1, 0.1, 0.1)
        });
        this.app.root.addChild(camera);
        camera.setPosition(0, 6, 0);
        camera.setEulerAngles(-90, 0, 0);
        (camera.addComponent('script') as pc.ScriptComponent).create('cameraFollow');
        LocalClient.camera = camera;

        const light = new pc.Entity('light');
        light.addComponent('light');
        app.root.addChild(light);
        light.setEulerAngles(30, 0, 0);
        LocalClient.sunLight = light;

        
    }
}