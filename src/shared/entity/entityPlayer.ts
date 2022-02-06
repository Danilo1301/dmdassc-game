import { World } from "../world";
import { EntityChar } from "./entityChar";

export class EntityPlayer extends EntityChar {
    constructor(world: World) {
        super(world);
    }
}