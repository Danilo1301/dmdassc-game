import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Render } from '../../client/render';
import { Client } from '../../server/client';
import { EntityWeapon } from '../entity/entityWeapon';
import { Input } from '../input';
import { CollisionComponent } from './collisionComponent';
import { Component } from "./component";
import { WeaponComponent } from './weaponComponent';

export class EquipItemComponent extends Component {
    public speed: number = 80;

    //private _hasTriedEquip: boolean = false;
    private _lastUseTime: number = 0;
    

    private _hasEquipedGun: boolean = false;

    private _weapon?: EntityWeapon;

    public initData(): void {
        this.entity.data.defineKey("equipedItem", {minDifference: 0});
        this.entity.data.setKey("equipedItem", -1);
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
            if(this.entity.data.getKey("equipedItem") != -1) {
                this.equipGun()
            }
        }

       
    }

    public equipGun() {
        this._hasEquipedGun = true;

        const entity = this.entity;
        const weapon = entity.world.spawnEntity(EntityWeapon);

        weapon.getComponent(WeaponComponent).entityOwner = entity;
        weapon.attachToEntity(entity);

        this._weapon = weapon;

        
        this.entity.data.setKey("equipedItem", 0);

        console.log(this.entity.data.getData())
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

            if(this._weapon) {
                this._weapon.getComponent(WeaponComponent).shot();
            }
        }
    }
}