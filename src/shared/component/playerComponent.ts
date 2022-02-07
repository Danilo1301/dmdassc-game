import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Entity } from "../entity/entity";
import { WorldSyncType } from '../world';
import { CollisionComponent } from './collisionComponent';
import { Component } from "./component";
import { DebugComponent } from './debugComponent';
import { SyncType } from './syncComponent';

export interface IPlayerComponent_Data {
    name: string
    color: number
}

export class PlayerComponent extends Component {
    public entity: Entity;
    public priority: number = 0;

    public data: IPlayerComponent_Data = {
        name: 'no name',
        color: 0
    }

    public initData(): void {
        if(this.entity.world.syncType != WorldSyncType.CLIENT) {
            setInterval(() => {
                this.data.color++
            }, 1000)
        }
    }
    
    public init() {
        super.init();

        
    }



    public update(dt: number) {
        super.update(dt);

        this.entity.getComponent(DebugComponent)?.setLineText('playername', `${this.data.name}, ${this.data.color}`)
    }
}