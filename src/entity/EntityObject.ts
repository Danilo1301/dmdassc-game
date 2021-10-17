import { Entity } from "@game/entity/Entity";
import { World } from "@game/world/World";
import { DebugComponent } from "./component/DebugComponent";
import { HealthComponent } from "./component/HealthComponent";
import { PhysicBodyComponent } from "./component/PhysicBodyComponent";

export class EntityObject extends Entity {

    constructor(world: World) {
        super(world);

        this.addComponent(new DebugComponent());
        this.addComponent(new PhysicBodyComponent());
        this.addComponent(new HealthComponent())


        const physicBody = this.getComponent(PhysicBodyComponent);
        physicBody.addRectangle('default', 0, 0, 30, 30);
        physicBody.setOptions({
            frictionAir: 0.01,
            mass: 100
        })
    }

    public start() {
        super.start();
    }

    public update(delta: number) {
        
        const physicBody = this.getComponent(PhysicBodyComponent);
        this.setLookRotation(physicBody.angle)

        super.update(delta);
    }
}