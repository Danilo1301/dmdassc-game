import { BaseEntity } from "./BaseEntity";

export class Component {

    public entity!: BaseEntity;
    public priority: number = 0;

    public get name() { return this.constructor.name; }

    public start() {
        console.log(`[Component : ${this.name}] Start`);
    }

    public update(delta: number) {
        //console.log(`[Component : ${this.name}] Update (${this.priority})`);
    }

    public destroy() {
        console.log(`[Component : ${this.name}] Destroy`);
    }

    public toData(): any {}
    public fromData(data: any) {}
}