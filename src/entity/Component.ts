import { BaseEntity } from "./BaseEntity";

export interface IComponentWatchOptions {
    minDifference?: number
}

export class Component {

    public entity!: BaseEntity;
    public priority: number = 0;

    public watchingKeys: {[key: string]: IComponentWatchOptions} = {};

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

    public watchDataKey(key: string, options: IComponentWatchOptions) {
        this.watchingKeys[key] = options;
    }

    public toData(): any {}
    public fromData(data: any) {}
}