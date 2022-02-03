import * as pc from "playcanvas";
import { Gameface } from "./gameface";
import { Render } from "./render";

export class Camera {
    public static height: number = 1000;
    public static followPlayer: boolean = true;
    public static get positon() { return this._position; }

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
    }

    public static setPosition(x: number, y: number) {
        this._position.x = x;
        this._position.y = y;
    }
}