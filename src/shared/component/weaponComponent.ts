import Matter from 'matter-js';
import * as pc from 'playcanvas';
import { Camera } from '../../client/camera';
import { Gameface } from '../../client/gameface';
import { Render } from '../../client/render';
import { Entity } from '../entity/entity';
import { EntityBullet } from '../entity/entityBullet';
import { EntityPlayer } from '../entity/entityPlayer';
import { EntityVehicle } from '../entity/entityVehicle';
import { Input } from '../input';
import { PacketType } from '../packet';
import { WorldEvent } from '../worldEvent';
import { CollisionComponent } from './collisionComponent';
import { Component } from "./component";
import { InputHandlerComponent } from './inputHandlerComponent';



export class WeaponComponent extends Component {
    public speed: number = 40;
    //public enabled: boolean = false;

    public entityOwner?: Entity;

    private _lastShotHit: boolean = false;

    public offset = new pc.Vec2(0, 30);

    private _shotTime: number = 0;

    public init() {
        super.init();
    }

    private raycast(bodies, start, r, dist){
        var normRay = Matter.Vector.normalise(r);
        var ray = normRay;
        var point = Matter.Vector.add(ray, start);
        for(var i = 0; i < dist; i++){
          ray = Matter.Vector.mult(normRay, i);
          ray = Matter.Vector.add(start, ray);
          var bod = Matter.Query.point(bodies, ray)[0];
          if(bod){
            return {point: ray, body: bod};
          }
        }
        return;
      }

    public shot() {
        this._shotTime = 0.2;

 
        const entities: Entity[] = [];
        const bodies: Matter.Body[] = [];

        this.entity.world.entities.map(entity => {

            if(!(entity instanceof EntityVehicle || entity instanceof EntityPlayer)) return;

            if(!entity.hasComponent(CollisionComponent)) return;

            const body = entity.getComponent(CollisionComponent).body;

            entities.push(entity);
            bodies.push(body);
        })
        
   
        const position = this.getMuzzlePosition();
        const angle = this.entity.transform.angle;

        const start = {
            x: position.x,
            y: position.y
        }

    
        const r = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        const result = this.raycast(bodies, start, r, 400);

        if(result) {
            this._lastShotHit = true
        }

        //console.log(result)

        const muzzlePos = this.getMuzzlePosition();
        Render.createGunFlash(muzzlePos.x, muzzlePos.y);

        const gameface = Gameface.Instance;

        /*
        if(gameface) {
            gameface.network.sendPacket(PacketType.WEAPON_SHOT, {x: })
        }
        */
    }

    private getMuzzlePosition() {
        const collisionComponent = this.entity.getComponent(CollisionComponent);
        const bodyPart = collisionComponent.getBodyPart("muzzle");
        
        const p = bodyPart!.Body!.position;

        return new pc.Vec2(p.x, p.y);
    }

    private drawLine() {
        var app = Render.app;

        if(!app) return;

        var color = this._lastShotHit ? pc.Color.RED : pc.Color.WHITE;
        var start = this.getAimStartPoint();
        var end = this.getAimEndPoint();

        //var worldLayer = app.scene.layers.getLayerById(pc.LAYERID_WORLD);
        app.drawLine(start, end, color, false, undefined);
    }

    private updateWeaponPosition() {
        /*
        if(this.entityOwner) {
            //console.log('attachedToEntity')

            const position = this.entityOwner.transform.getPosition();
            const angle = this.entityOwner.transform.angle;
            
            const offset = new pc.Vec2();

            offset.x += this.offset.x * Math.sin(angle),
            offset.y += this.offset.x * -Math.cos(angle)

            offset.x += this.offset.y * Math.cos(angle);
            offset.y += this.offset.y * Math.sin(angle);

            //this.entity.transform.setPosition(position.x + offset.x, position.y + offset.y);
            this.entity.transform.setAngle(angle);

        }
        */
    }

    private getAimStartPoint() {
        const muzzlePos = this.getMuzzlePosition();
        var start = new pc.Vec3(muzzlePos.x * 0.01, 0, muzzlePos.y * 0.01);
        return start;
    }

    private getAimEndPoint() {
        var start = this.getAimStartPoint();
        
        var angle = this.entity.transform.angle;
        var distance = 400;

        

        var end = new pc.Vec3(start.x + (Math.cos(angle) * distance * 0.01), 0, start.z + (Math.sin(angle) * distance * 0.01));

        /*
        var controllable = false;
        if(this.attachedToEntity) {
            if(this.attachedToEntity.hasComponent(InputHandlerComponent)) controllable = this.attachedToEntity.getComponent(InputHandlerComponent).enabled;
        }
        if(controllable) {
            var mousePos = Input.mousePosition;
            end = Render.camera.camera!.screenToWorld(mousePos.x, mousePos.y, Camera.height);
        }
        */

        return end;
    }
    
    private processShotInputs() {
        if(!this.entityOwner) return;
        if(!this.entityOwner.hasComponent(InputHandlerComponent)) return;

        const inputHandler = this.entityOwner.getComponent(InputHandlerComponent);

        if(!inputHandler.enabled) return;


        if(Input.mouseDown) {
            const now = Date.now();
            if(this._shotTime > 0) return;

            this.shot();
        }
    }

    public render(dt: number) {
        //this.updateWeaponPosition();
        this.drawLine();
    }

    public update(dt: number) {
        super.update(dt);

        if(this._shotTime > 0) {
            this._shotTime -= dt;
        }

        if(this._shotTime <= 0) this._lastShotHit = false;

        //this.processShotInputs();
        this.updateWeaponPosition();
        
    }

    public postupdate(dt: number) {
        super.postupdate(dt);

        
    }
}