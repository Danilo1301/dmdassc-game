import { CollisionComponent } from "../../component/collisionComponent";
import { DebugComponent } from "../../component/debugComponent";
import { ModelComponent } from "../../component/modelComponent";
import { PlayerComponent } from "../../component/playerComponent";
import { SpriteComponent } from "../../component/spriteComponent";
import { World } from "../../world/world";
import { Entity } from "../entity";

export class EntityBuilding extends Entity {
    constructor(world: World) {
        super(world);

        this.addComponent(new DebugComponent());

        
        //this.addComponent(new PlayerComponent());

        //const sprite = this.addComponent(new SpriteComponent());
        //sprite.add('default', 'assets/car.png', 1, 200, 100);

        const collision = this.addComponent(new CollisionComponent());
        collision.options.frictionAir = 0.1;
        collision.options.isStatic = true;
        collision.addCircle('default', 0, 0, 10);
        //collision.addRectangle('part2', 0, 300, 200, 100);

        const model = this.addComponent(new ModelComponent());
        model.path = "assets/building.glb";
    }
}