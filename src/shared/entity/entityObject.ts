import { CollisionComponent } from "../component/collisionComponent";
import { DebugComponent } from "../component/debugComponent";
import { PlayerComponent } from "../component/playerComponent";
import { World } from "../world";
import { Entity } from "./entity";

export class EntityObject extends Entity {
    constructor(world: World) {
        super(world);

        this.addComponent(new DebugComponent());
        

        const collision = this.addComponent(new CollisionComponent());
        //collision.options.frictionAir = 0.2;
        collision.addRectangle('default', 0, 0, 50, 50);
    }
}