import * as pc from "../../playcanvas";
import { v4 as uuidv4 } from 'uuid';
import { EntitySync } from "../scripts/entitySync";
import { Movement } from "../scripts/movement";

const Ammo = window['Ammo'];

export interface IEntityData {
    x?: number
    y?: number
    z?: number
    inputH?: number
    inputV?: number
}

export class BaseEntity extends pc.Entity {
    private _id: string = uuidv4();

    public get id() { return this._id; }

    constructor(name) {
        super(name);
    }

    public init() {}

    public setId(id: string) {
        this._id = id;
    }

    public toJSON() {
        const position = this.getPosition();

        const data: IEntityData = {
            x: position.x,
            y: position.y,
            z: position.z,
        }

        const s = this.script!.get('movement') as Movement | null;

        if(s) {
            data.inputH = s.horizontal;
            data.inputV = s.vertical;
        }

        return data;
    }

    public fromJSON(data: IEntityData) {

        const hasEntitySync = this.script!.has('entitySync');
        const targetPosition = hasEntitySync ? (<EntitySync>this.script!.get('entitySync')).getTargetPosition() : undefined;

        const newPosition = targetPosition ? targetPosition : this.getPosition();

        if(data.x !== undefined) newPosition.x = data.x;
        if(data.y !== undefined) newPosition.y = data.y;
        if(data.z !== undefined) newPosition.z = data.z;

        const s = this.script!.get('movement') as Movement | null;

        if(s) {

            if(data.inputH !== undefined) s.horizontal = data.inputH;
            if(data.inputV !== undefined) s.vertical = data.inputV;

            //if(data.inputH !== undefined || data.inputV !== undefined) console.log(data.inputH, data.inputV)

        }
      

        if(this.script!.has('entitySync')) {
            const s = <EntitySync>this.script!.get('entitySync');
            s.setTargetPosition(newPosition);
        } else {
           this.teleport(newPosition);
        }

    }

    public teleport(position: pc.Vec3) {
        this.rigidbody!.teleport(position.x, position.y, position.z);
    }

    public setVelocity(velocity: pc.Vec3) {
        this.rigidbody!['body'].setLinearVelocity(new Ammo.btVector3(velocity.x, velocity.y, velocity.z))
    }
}