import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Render } from '../../client/render';
import { Client } from '../../server/client';
import { Entity } from '../entity/entity';
import { Component } from "./component";
import { DebugComponent } from './debugComponent';

export interface IEquipItemComponent_Data {
    equipedItem: number
}

export class EquipItemComponent extends Component {
    public entity: Entity;
    public priority: number = 0;

    public data: IEquipItemComponent_Data = {
        equipedItem: -1
    }

    private _lastUseTime: number = 0;
    private _hasEquipedGun: boolean = false;

    public initData(): void {
    }

    public init() {
        super.init();
    }

    public update(dt: number) {
        super.update(dt);

        if(this._lastUseTime > 0) {
            this._lastUseTime -= dt;
        }

        if(!this._hasEquipedGun) {
            if(this.data.equipedItem != -1) {
                this.equipGun()
            }
        }

        this.entity.getComponent(DebugComponent)?.setLineText('equipedItem', `${this.data.equipedItem}`)
    }

    public equipGun() {
        this._hasEquipedGun = true;

        this.data.equipedItem = 0;
    }

    public tryUse() {
        if(this._lastUseTime > 0) return;
        this._lastUseTime = 0.2;

        this.sendComponentEvent('TRY_USE', null);
        
    }

    /*
    public tryEquip() {

        if(this._hasTriedEquip) {
            console.log("wait")
            return;
        }

        this._hasTriedEquip = true;
       
        console.log("try equip")

        this.sendComponentEvent('TRY_EQUIP', {id: "test"});
    }
    */

    public onReceiveComponentEvent(event: string, data: any, fromClient?: Client): void {
        super.onReceiveComponentEvent(event, data);

        //console.log("received ", event, fromClient ? "has client" : "no")
        
        if(event == "TRY_USE") {

            if(!this._hasEquipedGun) {
                this.broadcastComponentEvent('EQUIP', data, fromClient);
            } else {
                this.broadcastComponentEvent('USE', data, fromClient);

            }

            //this.broadcastComponentEvent('EQUIP', data, fromClient);
            
        }


        if(event == "EQUIP") {
            console.log("equip!")

            this.equipGun();
        }

        if(event == "USE") {

            console.log("use lol")

            if(Render.app) {
                const position = this.entity.transform.getPosition();
                Render.createGunFlash(position.x, position.y);

            }
        }
    }
}