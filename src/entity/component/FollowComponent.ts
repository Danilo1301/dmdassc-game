import { Input } from "@game/input/Input";
import { LocalPlayer } from "@game/network/LocalPlayer";
import { SceneManager } from "@game/sceneManager/SceneManager";
import { Entity } from "../Entity";
import { EntityBulletTracer } from "../EntityBulletTracer";
import { Component } from "./Component";
import { DebugComponent } from "./DebugComponent";
import { InputHandlerComponent } from "./InputHandlerComponent";
import { WeaponComponent } from "./WeaponComponent";

export class FollowComponent extends Component {

    public entity!: Entity;

    private _followingEntity?: Entity;

    constructor() {
        super();
    }

    
    public start() {
        super.start();

        console.log("start")

        setInterval(() => this.findRandomTarget(), Math.random() * 3000 + 7000);
        this.findRandomTarget();

        this.entity.getComponent(WeaponComponent).accuracy = 0.7;
        this.entity.getComponent(WeaponComponent).delay = 500;
    }

    public update(delta: number) {
        super.update(delta);

        if(LocalPlayer.entity != undefined) return;

        //console.log('u')

        const inputHandler = this.entity.getComponent(InputHandlerComponent);

        if(!inputHandler) return;

        if(this._followingEntity) {

            const pos1 = {x: this.entity.position.x, y: this.entity.position.y};
            const pos2 = {x: this._followingEntity.position.x, y: this._followingEntity.position.y};

            const targetAngle = Phaser.Math.Angle.BetweenPoints(pos1, pos2);
            const angle = Phaser.Math.Angle.RotateTo(this.entity.lookRotation, targetAngle, 0.1)



            this.entity.setLookRotation(angle);

            const r = new Phaser.Math.Vector2( Math.cos(angle), Math.sin(angle) );

            const distance = Phaser.Math.Distance.BetweenPoints(pos1, pos2);

            let speed = 0;
            if(distance > 100) speed = 1;
            if(distance < 50) speed = -1;
            
            inputHandler.horizontal = r.x * speed;
            inputHandler.vertical = r.y * speed;

            inputHandler.mouse1 = distance < 300 ? true : false;
        }
    }


    public findRandomTarget() {
        const entities: Entity[] = this.entity.world.entities.filter(e => e != this.entity && !(e instanceof EntityBulletTracer));
        const targetEntity = entities[Phaser.Math.RND.integerInRange(0, entities.length-1)];
        this._followingEntity = targetEntity;
    }
    
}