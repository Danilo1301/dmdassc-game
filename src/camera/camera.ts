import * as pc from "playcanvas";
import { PositionComponent } from "../component/positionComponent";
import { PlayCanvas } from "../playcanvas/playcanvas";
import { Render } from "../render/render";

export class Camera {
    public static height: number = 150;
    public static followPlayer: boolean = true;
    public static get positon() { return this._position; }

    private static _position = new pc.Vec3();
    
    public static init() {
        window["Camera"] = Camera;
    }

    public static update(dt: number) {
        if(this.followPlayer) {
            const player = Render.player;

            if(!player) return;

            const positionComponent = player.getComponent(PositionComponent);

            this.setPosition(positionComponent.x, positionComponent.y);
        }
        
        this._position.z = this.height;

        PlayCanvas.camera.setPosition(this._position.x / 10, this._position.z / 10, this._position.y / 10);
    }

    public static setPosition(x: number, y: number) {
        this._position.x = x;
        this._position.y = y;
    }
}