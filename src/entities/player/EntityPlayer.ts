import { BasicMovement } from "@game/entity/components/BasicMovement";
import { InputHandler } from "@game/entity/components/InputHandler";
import { PhysicBody } from "@game/entity/components/PhysicBody";
import { TestSprite } from "@game/entity/components/TestSprite";
import { Entity } from "@game/entity/Entity";
import { World } from "@game/world/World";


export class EntityPlayer extends Entity {
    constructor(world: World) {
        super(world);
        
        this.addComponent(new PhysicBody());
        this.addComponent(new InputHandler());
        this.addComponent(new BasicMovement());

        this.addComponent(new TestSprite());
        this.getComponent(TestSprite).texturename = `player_test`;
        

        const physicBody = this.getComponent(PhysicBody);
        physicBody.addCircle('default', 0, 0, 15);
        physicBody.setOptions({
            frictionAir: 0.2,
            mass: 100,
            //inertia: Infinity
        })
    }
}
