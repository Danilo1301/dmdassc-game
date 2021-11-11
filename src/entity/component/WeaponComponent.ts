import { BulletTrace } from "@game/bulletTrace/BulletTrace";
import { GameClient } from "@game/game/GameClient";
import { LocalPlayer } from "@game/network/LocalPlayer";
import { PacketType } from "@game/network/Packet";
import { SceneManager } from "@game/sceneManager/SceneManager";
import { Entity } from "../Entity";
import { Component } from "./Component";
import { DebugComponent } from "./DebugComponent";
import { HealthComponent } from "./HealthComponent";
import { InputHandlerComponent } from "./InputHandlerComponent";
import { PhysicBodyComponent } from "./PhysicBodyComponent";

export interface IWeaponShotData {
    hitPosition: {x: number, y: number}
    angle: number
    entityHit?: string
}

export class WeaponComponent extends Component {

    public entity!: Entity;
    public delay: number = 200;

    private _lastTimeShot: number = 0;

    public accuracy: number = 0.95;

    private _sendToServer: boolean = false;

    public autoShot: boolean = false;

    constructor() {
        super();
    }

    public start() {
        super.start();

        this.entity.getComponent(DebugComponent).setLineText('tweapon', `has weapon`)

        //console.log("it has weapon?")

        if(!this.entity.world.isHost) return;

       //console.log("it has weapon")
        

        setInterval(() => {
            this.testShot();
            
    
        }, Phaser.Math.RND.integerInRange(1000, 2000))
    }

    public testShot() {
        if(!this.autoShot) return;

        this.shot();

    }

    public update(delta: number) {
        super.update(delta);

        if(LocalPlayer.entity != this.entity) return;

        const inputHandler = this.entity.getComponent(InputHandlerComponent);

        if(inputHandler.mouse1) {
            const now = Date.now();

            if(now - this._lastTimeShot >= this.delay) {
                this._lastTimeShot = now;

                if(this.entity.world.server.isOnline) this._sendToServer = true;

                this.shot();
                
            };
        }
    }

    public shot(entityHit?: Entity) {

        const hitPosition = this.getEndPosition(this.entity.lookRotation, 300)

        const data: IWeaponShotData = {
            hitPosition: hitPosition,
            angle: this.entity.lookRotation
        }

        if(entityHit) data.entityHit = entityHit.id;

        this.dispatchEvent('shot', data);
    }

    public getEndPosition(angle: number, distance: number) {
        const Matter: any = Phaser.Physics.Matter['Matter'];

        const start = new Phaser.Math.Vector2(this.entity.position.x, this.entity.position.y);
        
        const r = new Matter.Vector.create( Math.cos(angle), Math.sin(angle) );
        const normRay = Matter.Vector.normalise(r);

        let end = Matter.Vector.mult(normRay, distance);
        end = Matter.Vector.add(start, end);

        return new Phaser.Math.Vector2(end.x, end.y);
    }

    public onReceiveEvent(eventName: string, data: any) {
        super.onReceiveEvent(eventName, data);

        if(eventName == 'shot') {

            const eventData: IWeaponShotData = data;

            


            //
            const bodies = new Map<MatterJS.BodyType, Entity>();

            this.entity.world.entities.map(entity => {
                if(entity.id == this.entity.id) return;
                if(!entity.hasComponent(PhysicBodyComponent)) return;
                const physicBody = entity.getComponent(PhysicBodyComponent);
                if(!physicBody.body) return;
                bodies.set(physicBody.body, entity);
            })


            const r = {x: Math.cos(this.entity.lookRotation), y: Math.sin(eventData.angle)}

            const ray = BulletTrace.raycast(Array.from(bodies.keys()), this.entity.position, r, 300);

            let entity: Entity | undefined;

            //console.log("check hit")

            if(ray) entity = bodies.get(ray.body)!;

            if(entity) {
                eventData.entityHit = entity.id;
                
                if(this.entity.world.server.isHost) {
                    if(entity.hasComponent(HealthComponent)) entity.getComponent(HealthComponent).takeDamage(17);
                }
            }


            
            if(this._sendToServer) {
                console.log("send shot to interneto", entity != undefined, eventData)

                const game = SceneManager.game as GameClient;
                game.network.send(PacketType.WEAPON_SHOT, eventData);
            }

            
            if(this.entity.world.server.isOnline && LocalPlayer.entityId == this.entity.id && !this._sendToServer) {
                return;
            }
            
            if(entity) {

                const point =  ray!.point;

                const dir = new Phaser.Math.Vector2(
                    point.x - this.entity.position.x,
                    point.y - this.entity.position.y
                );

                entity.getComponent(PhysicBodyComponent).applyForce(
                    new Phaser.Math.Vector2(entity.position.x, entity.position.y),
                    dir.normalize()
                )
            }
            
            BulletTrace.spawnTracer(
                new Phaser.Math.Vector2(this.entity.position.x, this.entity.position.y),
                new Phaser.Math.Vector2(eventData.hitPosition.x, eventData.hitPosition.y),
                eventData.entityHit ? 0xff0000 : 0xffff00
            )
            this._sendToServer = false;
        }




           

            
        
    }

}

/*
import { LocalPlayer } from "@game/network/LocalPlayer";
import { Entity } from "../Entity";
import { Component } from "./Component";
import { InputHandlerComponent } from "./InputHandlerComponent";

export class WeaponComponent extends Component {

    public entity!: Entity;
    public delay: number = 200;

    private _lastTimeShot: number = 0;

    public accuracy: number = 0.95;

    constructor() {
        super();
    }

    public start() {
        super.start();

        
        
        setInterval(() => {

            if(LocalPlayer.entity != undefined) return
            
            console.log("dispatch");

            this.dispatchEvent('test', {a: LocalPlayer.entity == undefined ? 'from server' : 'from client'});

        }, 1000)
    }

    public update(delta: number) {
        super.update(delta);

        return;

        const inputHandler = this.entity.getComponent(InputHandlerComponent);

        if(inputHandler.mouse1) {

            const now = Date.now();

            if(now - this._lastTimeShot >= this.delay) {
                this._lastTimeShot = now;
                this.shot();
            };
        }
    }

    public shot() {
        console.log("shot")

        if(LocalPlayer.entity != undefined && LocalPlayer.entityId != this.entity.id) return;

        let angle = this.entity.lookRotation + (1 - this.accuracy)*(Math.random()*2-1);

        const end = this.getEndPoint(angle, 300);

        const tracer = this.entity.world.createEntity('EntityBulletTracer', {});
        tracer.setPosition(this.entity.position.x, this.entity.position.y);
        tracer.data.byEntity = this.entity.id;
        tracer.data.hitPosition.x = end.x;
        tracer.data.hitPosition.y = end.y;
        tracer.setLookRotation(angle);
        tracer.data.color = this.entity.data.color;

        if(LocalPlayer.entity != undefined) tracer.data.local = true;

        this.entity.world.addEntity(tracer);
    }

    public getEndPoint(angle: number, distance: number) {
        const Matter: any = Phaser.Physics.Matter['Matter'];

        const start = new Phaser.Math.Vector2(this.entity.position.x, this.entity.position.y);
        
        const r = new Matter.Vector.create( Math.cos(angle), Math.sin(angle) );
        const normRay = Matter.Vector.normalise(r);

        let end = Matter.Vector.mult(normRay, distance);
        end = Matter.Vector.add(start, end);

        return new Phaser.Math.Vector2(end.x, end.y);
    }
}
*/