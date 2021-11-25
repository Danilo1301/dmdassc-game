import { Entity } from "../entity/entity";

export class Component {
    public entity: Entity;
    public priority: number = 0;
    
    public init() {}
    public update(dt: number) {}
    public postupdate(dt: number) {}
    public serialize(): any {}
    public unserialize(data) {}
}