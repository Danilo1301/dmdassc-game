import { BaseEntity } from "../BaseEntity";

export interface IComponentWatchOptions {
    minDifference?: number
}

export class Component {

    public entity!: BaseEntity;
    public priority: number = 0;

    public watchingKeys: {[key: string]: IComponentWatchOptions} = {};

    public get name() { return this.constructor.name; }

    public start() {

        //X
        this.entity.events.on('component_event', (a, b, c) => {
            if(a != this.name) return;
            this.onReceiveEvent(b, c)
        });

        //console.log(`[Component : ${this.name}] Start`);
    }

    public preupdate(delta: number) {
        //console.log(`[Component : ${this.name}] Pre-Update (${this.priority})`);
    }

    public update(delta: number) {
        //console.log(`[Component : ${this.name}] Update (${this.priority})`);
    }

    public postupdate(delta: number) {
        //console.log(`[Component : ${this.name}] Post-Update (${this.priority})`);
    }

    public destroy() {
        //console.log(`[Component : ${this.name}] Destroy`);
    }

    public watchDataKey(key: string, options: IComponentWatchOptions) {
        this.watchingKeys[key] = options;
    }

    public dispatchEvent(eventName: string, data: any) {
        //console.log(`[Component Event : ${this.name}] Dispatch '${eventName}'`, data);

        this.entity.events.emit('component_event', this.name, eventName, data);
    }

    public onReceiveEvent(eventName: string, data: any) {
        //console.log(`[Component Event : ${this.name}] Receive '${eventName}'`, data);

    }

    public toData(): any {}
    public fromData(data: any) {}
}