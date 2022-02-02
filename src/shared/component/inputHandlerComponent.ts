import * as pc from "playcanvas";
import { Render } from "../../client/gameface/render";
import { Entity } from "../entity/entity";
import { Input } from "../input/input";
import { Component } from "./component";
import { SyncComponent, SyncType } from "./syncComponent";

export class InputHandlerComponent extends Component {
    public entity: Entity;
    public priority: number = 0;
    
    public enabled: boolean = false;
    public speed = 4;
    
    public get horizontal() { return this.entity.data.getKey('input.h') as number; };
    public set horizontal(value: number) { this.entity.data.setKey('input.h', value); };
    
    public get vertical() { return this.entity.data.getKey('input.v') as number; };
    public set vertical(value: number) { this.entity.data.setKey('input.v', value); };

    public init() {
        super.init();

        this.entity.data.defineKey("input.h", {minDifference: 0.1});
        this.entity.data.defineKey("input.v", {minDifference: 0.1});
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

            if(Render.app) {
                var graphicsDevice = Render.app.graphicsDevice;
                var screenCenter = new pc.Vec2(graphicsDevice.width / 2, graphicsDevice.height / 2)
        
                var direction = new pc.Vec2();
                direction.sub2(Input.mousePosition, screenCenter);
                direction.normalize();
        
                var angle = Math.atan2(direction.y, direction.x);
    
                
                this.entity.transform.setAngle(angle)
    

            }
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