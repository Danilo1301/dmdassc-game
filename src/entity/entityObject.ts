import * as pc from 'playcanvas';
import { Entity } from "./entity";
import CANNON from 'cannon';

export enum IEntityObjectShape {
    RECTANGLE,
    SPHERE
}

export interface IEntityObjectCustomData {
    shape: IEntityObjectShape
    radius?: number
    halfExtents?: {x: number, y: number, z: number}
    bodyOptions?: CANNON.IBodyOptions
}

export class EntityObject extends Entity {

    constructor(world) {
        super(world);

        this.setColor(new pc.Color(Math.random(), Math.random(), Math.random()))
    }

    public init() {
        super.init();

        console.log(JSON.stringify(this.data))

        console.log('init', this.getCustomData())

        const data = this.getCustomData();

        const halfExtents = data.halfExtents ? new CANNON.Vec3(data.halfExtents.x, data.halfExtents.y, data.halfExtents.z) : new CANNON.Vec3(1, 1, 1);

     
        if(data.shape == IEntityObjectShape.RECTANGLE) {
            const body = this.world.createRectangleBody(
                this.position,
                halfExtents,
                data.bodyOptions
            );
            this.setBody(body);
        } else {
            const body = this.world.createSphereBody(
                this.position,
                data.radius!,
                data.bodyOptions
            );
    
            this.setBody(body);
        }

        
    }

    public getCustomData() {
        return this.data.objectCustomData as IEntityObjectCustomData;
    }

    public setCustomData(data: IEntityObjectCustomData) {
        return this.data.objectCustomData = data;
    }
}