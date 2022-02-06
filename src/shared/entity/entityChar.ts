import { CollisionComponent } from "../component/collisionComponent";
import { PlayerComponent } from "../component/playerComponent";
import { World } from "../world";
import { Entity } from "./entity";

export class EntityChar extends Entity {
    constructor(world: World) {
        super(world);

        this.addComponent(new CollisionComponent());
        this.addComponent(new PlayerComponent());
    }
}