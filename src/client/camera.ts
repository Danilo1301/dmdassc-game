import * as pc from "playcanvas";
import { Input } from "../shared/input";
import { Gameface } from "./gameface";
import { Render } from "./render";

export class Camera {
    public static height: number = 1000;
    public static followPlayer: boolean = true;
    public static get positon() { return this._position; }

    public static testMode: boolean = false;

    private static _position = new pc.Vec3();
    
    public static init() {
        window["Camera"] = Camera;
    }

    public static update(dt: number) {
        if(this.followPlayer) {
            const player = Gameface.Instance.player;

            if(!player) return;

            const position = player.transform.getPosition();

            this.setPosition(position.x, position.y);
        }
        
        this._position.z = this.height;

        Render.camera.setPosition(this._position.x * 0.01, this._position.z * 0.01, this._position.y * 0.01);

        if(this.testMode) {

            //Input.mousePosition

            const player = Gameface.Instance.player!;
            const position = player.transform.getPosition();

            //Render.camera.setPosition(0, this.height * 0.01, 0);
            //Render.camera.lookAt(this._position.x * 0.01, this._position.z * 0.01, this._position.y * 0.01)
            Render.camera.setPosition(0, 20, 0)
            Render.camera.lookAt(position.x * 0.01, 0, position.y * 0.01)

        }
    }

    public static setPosition(x: number, y: number) {
        this._position.x = x;
        this._position.y = y;
    }
}