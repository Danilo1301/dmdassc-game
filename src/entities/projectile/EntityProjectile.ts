import { BasicMovement } from "@game/entity/components/BasicMovement";
import { InputHandler } from "@game/entity/components/InputHandler";
import { PhysicBody } from "@game/entity/components/PhysicBody";
import { TestSprite } from "@game/entity/components/TestSprite";
import { VehicleMovement } from "@game/entity/components/VehicleMovement";
import { Entity } from "@game/entity/Entity";
import { World } from "@game/world/World";


export class EntityProjectile extends Entity {
    constructor(world: World) {
        super(world);
        
        this.addComponent(new PhysicBody());
        this.addComponent(new InputHandler());
        this.addComponent(new BasicMovement());
        this.addComponent(new TestSprite());
        this.getComponent(TestSprite).texturename = 'bullet';

        const physicBody = this.getComponent(PhysicBody);
        physicBody.addCircle('default', 0, 0, 5);
        physicBody.setOptions({
            frictionAir: 0.1,
            mass: 1,
            inertia: Infinity,
            isSensor: true
        })

        this.getComponent(BasicMovement).directional = true;
        this.getComponent(BasicMovement).speed = 0.02;

        this.getComponent(InputHandler).vertical = 1;
        
        

        setTimeout(() => {
            
            this.world.removeEntity(this);

        }, 2000);

        this.syncTime = 1000;
    }

    public update(delta: number) {
        super.update(delta);


    }
}