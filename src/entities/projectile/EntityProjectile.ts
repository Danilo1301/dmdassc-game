import { BasicMovement } from "@game/entity/components/BasicMovement";
import { EntityDebug } from "@game/entity/components/EntityDebug";
import { InputHandler } from "@game/entity/components/InputHandler";
import { PhysicBody } from "@game/entity/components/PhysicBody";
import { ProjectileBehaviour } from "@game/entity/components/ProjectileBehaviour";
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
        this.addComponent(new ProjectileBehaviour());
        
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
        this.getComponent(BasicMovement).speed = 0.04;

        this.getComponent(InputHandler).vertical = 1;
        
        this.getComponent(EntityDebug).visible = false;
        

        setTimeout(() => {
            
            this.world.removeEntity(this);

        }, 2000);

        this.syncTime = 200;
        this.position.skipSmallLerp = true;
    }

    public update(delta: number) {
        super.update(delta);
    }
}
