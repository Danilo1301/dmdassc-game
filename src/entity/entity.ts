import * as pc from 'playcanvas';
import Phaser from 'phaser';
import CANNON from 'cannon';
import { World } from "../world/world";

export interface IEntityData {
    pos?: number[]
    vel?: number[]
    rot?: number[]
    aVel?: number[]
    input?: number[]
    data?: any
}

export class Entity {
    public pcEntity?: pc.Entity;

    public dontSync: boolean = false;
    public canLerp: boolean = false;

    public data: any = {};
    public input = {horizontal: 0, vertical: 0}

    private _position = new CANNON.Vec3();
    private _velocity = new CANNON.Vec3();
    private _quaternion = new CANNON.Quaternion();

    private _id: string = `${Math.random()}`;
    private _world: World;
    private _body?: CANNON.Body;
    
    public get id() { return this._id; }
    public get world() { return this._world; }
    public get body() { return this._body; }
    public get position() { return this._position; }
    public get velocity() { return this._velocity; }
    public get quaternion() { return this._quaternion; }

    public get angularVelocity() {
        if(this._body) return this._body.angularVelocity;
        return CANNON.Vec3.ZERO;
    }

    constructor(world: World) {
        this._world = world;

        this.setColor(pc.Color.WHITE);
    }

    public init() {}

    public setColor(color: pc.Color) {
        this.data.color = [color.r, color.g, color.b];
    }

    public setBody(body: CANNON.Body) {
        body.position.set(this.position.x, this.position.y, this.position.z);

        this._body = body;
        this._position = body.position;
        this._quaternion = body.quaternion;
        this._velocity = body.velocity;
    }

    public setId(id: string) {
        this._id = id;
    }

    public startBotBehaviour() {
        setInterval(() => {
            this.input.horizontal = Math.random()*2-1
            this.input.vertical = Math.random()*2-1
        }, 400)
    }
    
    public update(dt: number) {

        /*
        if(this.canLerp) {
            const position = this.position;
            const newPosition = new CANNON.Vec3();

            const distance = position.distanceTo(this._targetPosition);

            let lerpAmount = 0.3;
            if(distance > 2.5) lerpAmount = 1;


            position.lerp(this._targetPosition, lerpAmount, newPosition);
            position.set(newPosition.x, newPosition.y, newPosition.z);
        }
        */

        if(this.canLerp) {
            const quaternion = this.quaternion;
            
            //const qfrom = new Phaser.Math.Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
            //const qto = new Phaser.Math.Quaternion(this._targetQuaternion.x, this._targetQuaternion.y, this._targetQuaternion.z, this._targetQuaternion.w);
            //const result = qfrom.lerp(qto, 0.1);           

            //this.quaternion.set(result.x, result.y, result.z, result.w)
        }

        if(this.position.distanceTo(CANNON.Vec3.ZERO) > 20) {
            this.position.set(0, 0, 2);
            this.body?.velocity.setZero();
            this.body?.angularVelocity.setZero();
        }

    }

    public toJSON() {
        const data: IEntityData = {}

        data.pos = [this.position.x, this.position.y, this.position.z];
        data.rot = [this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w];
        data.vel = [this.velocity.x, this.velocity.y, this.velocity.z];
        data.aVel = [this.angularVelocity.x, this.angularVelocity.y, this.angularVelocity.z];
        data.input = [this.input.horizontal, this.input.vertical];
        data.data = this.data;

        return data;
    }

    public fromJSON(entityData: IEntityData) {
        
        //if(this == GameClient.player) console.log('uosps')

        if(entityData.pos) {

            if(this.canLerp) {
                const position = this.position;
                const targetPosition = new CANNON.Vec3(entityData.pos[0], entityData.pos[1], entityData.pos[2])
                const newPosition = new CANNON.Vec3();

                const distance = position.distanceTo(targetPosition);

                let lerpAmount = 0.3;
                if(distance > 2.5) lerpAmount = 1;

                position.lerp(targetPosition, lerpAmount, newPosition);

                this.position.set(newPosition.x, newPosition.y, newPosition.z);
            }
        }

        if(entityData.vel) {

            if(this.canLerp) {
                this.velocity.set(entityData.vel[0], entityData.vel[1], entityData.vel[2]);
            }
        }

        if(entityData.aVel) {

            if(this.canLerp) {
                this.angularVelocity.set(entityData.aVel[0], entityData.aVel[1], entityData.aVel[2]);
            }
        }

        if(entityData.rot) {
            if(this.canLerp) {
                this.quaternion.set(entityData.rot[0], entityData.rot[1], entityData.rot[2], entityData.rot[3]);
            }
        }
        
        if(entityData.input) {
            if(this.canLerp) {
                this.input.horizontal = entityData.input[0];
                this.input.vertical = entityData.input[1];

            }
        }

        if(entityData.data) {
            this.data = entityData.data;
        }
    }
}   