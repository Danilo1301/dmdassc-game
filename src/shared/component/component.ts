import { Client } from "../../server/client";
import { Entity } from "../entity/entity";
import { WorldEvent } from "../worldEvent";

export class Component {
    public data: any;
    
    public entity: Entity;
    public priority: number = 0;
    
    private _index: number | null = null;
    private _a: boolean = false;

    public init() {
        //console.log(`[${this.constructor.name}] init`);
    }
    public initData() {
        //console.log(`[${this.constructor.name}] init`);
    }
    public destroy() {
        //console.log(`[${this.constructor.name}] destroy`);
    }
    public preupdate(dt: number) {}
    public update(dt: number) {
        if(!this._a) {
            this._a = true;
            //console.log(`[${this.constructor.name}] update`);
        }
    }
    public postupdate(dt: number) {}

    public render(dt: number) {}
    public postrender(dt: number) {}

    public sendComponentEvent(event: string, data, fromClient?: Client) {
        this.entity.world.events.emit(WorldEvent.COMPONENT_EVENT, this, event, false, data, fromClient);
    }

    public broadcastComponentEvent(event: string, data, fromClient?: Client) {
        this.entity.world.events.emit(WorldEvent.COMPONENT_EVENT, this, event, true, data, fromClient);
    }

    public onReceiveComponentEvent(event: string, data, fromClient?: Client) {}

    public getIndex() {
        if(this._index == null) {
            this._index = this.entity.world.game.entityFactory.getIndexOfComponent(this);
        }
        return this._index;
    }
}