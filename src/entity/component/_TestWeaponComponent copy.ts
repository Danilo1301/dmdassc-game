import { BulletTrace } from "@game/bulletTrace/BulletTrace";
import { GameClient } from "@game/game/GameClient";
import { Input } from "@game/input/Input";
import { LocalPlayer } from "@game/network/LocalPlayer";
import { IPacketData_WeaponShot, PacketType } from "@game/network/Packet";
import { SceneManager } from "@game/sceneManager/SceneManager";
import { GameScene } from "@game/scenes/GameScene";
import { Entity } from "../Entity";
import { Component } from "./Component";
import { DebugComponent } from "./DebugComponent";
import { HealthComponent } from "./HealthComponent";
import { InputHandlerComponent } from "./InputHandlerComponent";
import { PhysicBodyComponent } from "./PhysicBodyComponent";

export class TestWeaponComponent extends Component {

    public entity!: Entity;

    public accuracy = 1;
    public delay = 250;
   
    private _lastTimeShot: number = 0;

    constructor() {
        super();
    }

    public start() {
        super.start();
    }

    public update(delta: number) {
        super.update(delta);

        const inputHandler = this.entity.getComponent(InputHandlerComponent);

        if(inputHandler.mouse1) {

            const now = Date.now();

            if(now - this._lastTimeShot >= this.delay) {
  
                const result = this.shot();

              
                this._lastTimeShot = now;
                

                

            };
        }
    }

    public shotWithDirection(angle: number) {
        this._lastTimeShot = Date.now();

        console.log("shot", angle);

        const Matter: any = Phaser.Physics.Matter['Matter'];

        const start = new Phaser.Math.Vector2(this.entity.position.x, this.entity.position.y);
        
        const r = new Matter.Vector.create( Math.cos(angle), Math.sin(angle) );
        const normRay = Matter.Vector.normalise(r);

        const distance = 300;

        let end = Matter.Vector.mult(normRay, distance);
        end = Matter.Vector.add(start, end);

        const color = this.entity.data.color || 0xff0000;

        BulletTrace.spawnTracer(start, new Phaser.Math.Vector2(end.x, end.y), color);

        const bodies = new Map<MatterJS.BodyType, Entity>();

        this.entity.world.entities.map(entity => {
            if(entity == this.entity) return;
            if(!entity.hasComponent(PhysicBodyComponent)) return;
            const physicBody = entity.getComponent(PhysicBodyComponent);
            if(!physicBody.body) return;
            bodies.set(physicBody.body, entity);
        })

        const ray = BulletTrace.raycast(Array.from(bodies.keys()), start, r, distance);

        let entity: Entity | undefined;

        if(ray) {
            entity = bodies.get(ray.body)!;
        }

        
        if(entity) {
            const inputHandler = entity.getComponent(InputHandlerComponent);

            console.log("hit");

            console.log(this.entity.id, 'hit', entity.id)

            if(this.entity.id == LocalPlayer.entityId) {
                const data: IPacketData_WeaponShot = {
                    entityHit: entity ? entity.id : undefined
                }
                const game = (SceneManager.game as GameClient);
                game.network.send(PacketType.WEAPON_SHOT, data);

            } else {

                if(LocalPlayer.entity == undefined) {

                    entity.getComponent(HealthComponent).takeDamage(18);
                    console.log("take damage")
                }

            }
        }

        return entity;
    }

    public shot() {

        let angle = this.entity.lookRotation + (1 - this.accuracy)*(Math.random()*2-1);

        return this.shotWithDirection(angle)
    }
}