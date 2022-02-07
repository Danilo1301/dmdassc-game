import { CollisionComponent } from "../component/collisionComponent";
import { PlayerComponent } from "../component/playerComponent";
import { World } from "../world";
import { Entity } from "./entity";

export class EntityChar extends Entity {
    constructor(world: World) {
        super(world);

        const collision = this.addComponent(new CollisionComponent());
        collision.addCircle('default', 0, 0, 30);

        this.addComponent(new PlayerComponent());
    }
}