import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Render } from '../../client/render';
import { Entity } from "../entity/entity";
import { Input } from '../input';
import { WorldSyncType } from '../world';
import { CollisionComponent } from './collisionComponent';
import { Component } from "./component";
import { DebugComponent } from './debugComponent';
import { SpriteComponent } from './spriteComponent';
import { SyncType } from './syncComponent';

export interface IPlayerComponent_Data {
    skin: string
    name: string
    color: number
}

export class PlayerComponent extends Component {
    public entity: Entity;
    public priority: number = 0;

    public data: IPlayerComponent_Data = {
        name: 'no name',
        color: 0,
        skin: "player_npc"
    }

    public initData(): void {
        
    }
    
    public init() {
        this.entity.getComponent(SpriteComponent)?.add('default', 'assets/' + this.data.skin + '.png', 3, 50, 50);

        super.init();

        
    }



    public update(dt: number) {
        super.update(dt);

        this.entity.getComponent(DebugComponent)?.setLineText('playername', `${this.data.name}`)

        this.entity.transform.setAngle(this.entity.transform.getAimAngle())

        //this.entity.getComponent(DebugComponent)?.setLineText('playercolor', `${this.data.color}`)
    }
}