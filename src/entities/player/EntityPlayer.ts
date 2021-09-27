import { BasicMovement } from "@game/entity/components/BasicMovement";
import { InputHandler } from "@game/entity/components/InputHandler";
import { PhysicBody } from "@game/entity/components/PhysicBody";
import { Entity } from "@game/entity/Entity";
import { World } from "@game/world/World";


export class EntityPlayer extends Entity {
    constructor(world: World) {
        super(world);
        
        this.addComponent(new PhysicBody());
        this.addComponent(new InputHandler());
        this.addComponent(new BasicMovement());
        

        const physicBody = this.getComponent(PhysicBody);
        physicBody.setOptions({
            frictionAir: 0.2,
            mass: 100,
            //inertia: Infinity
        })
    }
}
