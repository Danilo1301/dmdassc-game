import * as pc from "playcanvas";
import { Render } from "../../client/render";
import { Entity } from "../entity/entity";
import { Input } from "../input";
import { Component } from "./component";

export interface IInputHandler_Data {
    h: number
    v: number
}


export class InputHandlerComponent extends Component {
    public entity: Entity;
    public priority: number = 0;
    
    public data: IInputHandler_Data = {
        h: 0,
        v: 0
    }

    public enabled: boolean = false;
    
    public get horizontal() { return this.data.h; }
    public get vertical() { return this.data.v; }

    public set horizontal(value: number) { this.data.h = value; }
    public set vertical(value: number) { this.data.v = value; }

    public setEnabled(value: boolean) {
        this.enabled = value;
    }

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

            /*
            if(Render.app) {
                var graphicsDevice = Render.app.graphicsDevice;
                var screenCenter = new pc.Vec2(graphicsDevice.width / 2, graphicsDevice.height / 2)
        
                var direction = new pc.Vec2();
                direction.sub2(Input.mousePosition, screenCenter);
                direction.normalize();
        
                var angle = Math.atan2(direction.y, direction.x);
    
                this.entity.transform.setAngle(angle)
            }
            */
            //console.log(this.horizontal, this.vertical)
        }
    }

    /*
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
    */
}