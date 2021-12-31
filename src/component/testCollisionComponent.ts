import { Entity } from "../entity/entity";
import { CollisionComponent } from "./collisionComponent";

export class TestCollisionComponent extends CollisionComponent {
    public entity: Entity;
    public priority: number = 0;
    
    public init() {
        console.log("test collision init")
        super.init();
    }

    public update(dt: number) {
        super.update(dt);
    }

    public postupdate(dt: number) {
        super.postupdate(dt);
    }
}