import { Entity } from "../entity/entity";

export class Component {
    public entity: Entity;
    public priority: number = 0;
    

    public init() {
        //console.log(`[${this.constructor.name}] init`);
    }
    public destroy() {
        //console.log(`[${this.constructor.name}] destroy`);
    }
    public update(dt: number) {}
    public postupdate(dt: number) {}

}