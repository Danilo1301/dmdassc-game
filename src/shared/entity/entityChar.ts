import { CollisionComponent } from "../component/collisionComponent";
import { DebugComponent } from "../component/debugComponent";
import { EquipItemComponent } from "../component/equipItemComponent";
import { InputHandlerComponent } from "../component/inputHandlerComponent";
import { MovementComponent } from "../component/movementComponent";
import { PlayerComponent } from "../component/playerComponent";
import { SpriteComponent } from "../component/spriteComponent";
import { World } from "../world";
import { Entity } from "./entity";

export class EntityChar extends Entity {
    constructor(world: World) {
        super(world);

        this.addComponent(new MovementComponent());
        this.addComponent(new InputHandlerComponent());
        this.addComponent(new PlayerComponent());
        this.addComponent(new DebugComponent());
        this.addComponent(new EquipItemComponent());
        //this.addComponent(new InputHandlerComponent());

        const sprite = this.addComponent(new SpriteComponent());
        

        const collision = this.addComponent(new CollisionComponent());
        //collision.options.frictionAir = 0.2;
        collision.addCircle('default', 0, 0, 20);
    }
}