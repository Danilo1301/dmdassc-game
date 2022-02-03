import { CollisionComponent } from "../component/collisionComponent";
import { DebugComponent } from "../component/debugComponent";
import { SpriteComponent } from "../component/spriteComponent";
import { World } from "../world";
import { Entity } from "./entity";

export class EntityVehicle extends Entity {
    constructor(world: World) {
        super(world);

        this.addComponent(new DebugComponent());

        const sprite = this.addComponent(new SpriteComponent());
        sprite.add('default', 'assets/car.png', 1, 200, 100);

        const collision = this.addComponent(new CollisionComponent());
        collision.options.frictionAir = 0.1;
        collision.options.mass = 100000;
        collision.addRectangle('default', 0, 0, 200, 100);
        //collision.addRectangle('part2', 0, 300, 200, 100);

        //const model = this.addComponent(new ModelComponent());
        //model.path = "assets/building.glb";
    }
}