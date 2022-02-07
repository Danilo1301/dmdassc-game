import { PlayerComponent } from "../component/playerComponent";
import { World } from "../world";
import { EntityChar } from "./entityChar";

export class EntityPlayer extends EntityChar {
    constructor(world: World) {
        super(world);
    }

    public initData() {
        super.initData();

        this.getComponent(PlayerComponent)!.data.skin = "player";
    }
}