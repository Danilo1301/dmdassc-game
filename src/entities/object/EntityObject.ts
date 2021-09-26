import { BasicMovement } from "@game/entity/components/BasicMovement";
import { PhysicBody } from "@game/entity/components/PhysicBody";
import { Entity } from "@game/entity/Entity";
import { World } from "@game/world/World";


export class EntityObject extends Entity {
    constructor(world: World) {
        super(world);
        
        this.addComponent(new PhysicBody());

        const physicBody = this.getComponent(PhysicBody);
        physicBody.setOptions({
            frictionAir: 0.2,
            mass: 100
        })
        
    }
}
