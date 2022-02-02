import { CollisionComponent } from "../../component/collisionComponent";
import { DebugComponent } from "../../component/debugComponent";
import { InputHandlerComponent } from "../../component/inputHandlerComponent";
import { ModelComponent } from "../../component/modelComponent";
import { PlayerComponent } from "../../component/playerComponent";
import { SpriteComponent } from "../../component/spriteComponent";
import { World } from "../../world/world";
import { Entity } from "../entity";

export class EntityPlayer extends Entity {
    constructor(world: World) {
        super(world);

        
        this.addComponent(new DebugComponent());
        this.addComponent(new PlayerComponent());
        this.addComponent(new InputHandlerComponent());

        const sprite = this.addComponent(new SpriteComponent());
        sprite.add('default', 'assets/player.png', 3, 80, 80);

        const collision = this.addComponent(new CollisionComponent());
        collision.options.frictionAir = 0.2;
        collision.addCircle('default', 0, 0, 30);
    }

    public setControllable(value: boolean = true) {
        this.getComponent(InputHandlerComponent).enabled = value;
    }
}