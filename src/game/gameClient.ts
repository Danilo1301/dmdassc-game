import { EntityPlayer } from "../entity/entityPlayer";
import { Network } from "../network/network";
import { CameraFollow } from "../scripts/cameraFollow";
import { Game } from "./game";

export class GameClient extends Game {
    public static player?: EntityPlayer;
    public static camera: pc.Entity;
    public static playerId: string = "";

    private _network: Network;

    public get network() { return this._network; }

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, true);

        this._network = new Network(this);
    }

    protected update(dt: number) {
        super.update(dt);

        this.network.update(dt);
    }


    public start() {
        super.start();

        this.network.connect(() => {
            console.log(`[Network] Connected? ${this.network.connected}`);
        });
    }

    public static cameraFollowEntity(p: pc.Entity) {
        const scr = <CameraFollow>(this.camera.findComponent('script') as pc.ScriptComponent).get('cameraFollow');
        scr.followEntity = p;
        scr.forceTeleport();
    }
}