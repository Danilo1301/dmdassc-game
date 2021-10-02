import { BasicMovement } from "@game/entity/components/BasicMovement";
import { Health } from "@game/entity/components/Health";
import { PhysicBody } from "@game/entity/components/PhysicBody";
import { TestSprite } from "@game/entity/components/TestSprite";
import { Entity } from "@game/entity/Entity";
import { World } from "@game/world/World";


export class EntityObject extends Entity {
    constructor(world: World) {
        super(world);
        
        this.addComponent(new PhysicBody());


        this.addComponent(new Health());

        this.addComponent(new TestSprite());
        this.getComponent(TestSprite).texturename = `crate`;

        const physicBody = this.getComponent(PhysicBody);
        physicBody.addRectangle('default', 0, 0, 30, 30);
        physicBody.setOptions({
            frictionAir: 0.2,
            mass: 100
        })
        
    }
}
