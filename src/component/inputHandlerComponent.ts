import { Entity } from "../entity/entity";
import { Input } from "../input/input";
import { Packet } from "../packet/packet";
import { Component } from "./component";
import { SyncComponent, SyncType } from "./syncComponent";

export class InputHandlerComponent extends Component {
    public entity: Entity;
    public priority: number = 0;
    
    public enabled: boolean = false;
    public speed = 4;
    public horizontal: number = 0;
    public vertical: number = 0;

    public init() {
        super.init();
    }

    public update(dt: number) {
        super.update(dt);

        if(this.enabled) {
            const KEY_LEFT = 65;
            const KEY_RIGHT = 68;
            const KEY_UP = 87;
            const KEY_DOWN = 83;

            this.horizontal = (Input.getKeyDown(KEY_RIGHT) ? 1 : 0) + ((Input.getKeyDown(KEY_LEFT) ? -1 : 0));
            this.vertical = (Input.getKeyDown(KEY_DOWN) ? 1 : 0) + ((Input.getKeyDown(KEY_UP) ? -1 : 0));

            //console.log(this.horizontal, this.vertical)
        }
    }

    public serialize(packet: Packet): any {
        packet.writeDouble(this.horizontal);
        packet.writeDouble(this.vertical);
        return packet;
    }

    public unserialize(packet: Packet): any {
        const horizontal = packet.readDouble();
        const vertical = packet.readDouble();
        
        let sync = true;

        if(this.entity.hasComponent(SyncComponent)) {
            if(this.entity.getComponent(SyncComponent).syncType == SyncType.DONT_SYNC) sync = false;
        } 
        
        if(sync) {
            this.horizontal = horizontal;
            this.vertical = vertical;
        }
        

        return packet;
    }
}