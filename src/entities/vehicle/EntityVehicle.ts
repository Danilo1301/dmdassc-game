import { BasicMovement } from "@game/entity/components/BasicMovement";
import { InputHandler } from "@game/entity/components/InputHandler";
import { PhysicBody } from "@game/entity/components/PhysicBody";
import { TestSprite } from "@game/entity/components/TestSprite";
import { VehicleMovement } from "@game/entity/components/VehicleMovement";
import { Entity } from "@game/entity/Entity";
import { World } from "@game/world/World";


export class EntityVehicle extends Entity {
    constructor(world: World) {
        super(world);
        
        this.addComponent(new PhysicBody());
        this.addComponent(new InputHandler());
        this.addComponent(new VehicleMovement());

        this.addComponent(new TestSprite());
        this.getComponent(TestSprite).texturename = `car`;

        const physicBody = this.getComponent(PhysicBody);
        physicBody.addRectangle('default', 0, 0, 83, 37);
        physicBody.setOptions({
            frictionAir: 0.1,
            mass: 400
        })
        
        
    }
}
