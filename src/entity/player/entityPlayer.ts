import { CollisionComponent } from "../../component/collisionComponent";
import { InputHandlerComponent } from "../../component/inputHandlerComponent";
import { ModelComponent } from "../../component/modelComponent";
import { PlayerComponent } from "../../component/playerComponent";
import { SpriteComponent } from "../../component/spriteComponent";
import { World } from "../../world/world";
import { Entity } from "../entity";

export class EntityPlayer extends Entity {
    constructor(world: World) {
        super(world);

        this.addComponent(new PlayerComponent());
        this.addComponent(new InputHandlerComponent());

        const sprite = this.addComponent(new SpriteComponent());
        sprite.add('default', 'assets/player.png', 3, 100, 100);

        const collision = this.addComponent(new CollisionComponent());
        collision.options.frictionAir = 0.2;
        collision.addRectangle('default', 0, 0, 100, 100);
    }
}