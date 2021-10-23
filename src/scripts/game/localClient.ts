import { BaseEntity } from "../entity/baseEntity";
import { EntityPlayer } from "../entity/entityPlayer";
import { CameraFollow } from "../scripts/cameraFollow";

export class LocalClient {
    public static app: pc.Application;
    public static camera: pc.Entity;
    public static sunLight: pc.Entity;
    public static player: EntityPlayer;
    public static playerId: string = "";

    public static get hasApp() { return this.app != undefined; }

    public static cameraFollowEntity(p: pc.Entity) {
        const scr = <CameraFollow>(this.camera.findComponent('script') as pc.ScriptComponent).get('cameraFollow');
        scr.followEntity = LocalClient.player;
        scr.forceTeleport();
    }
}