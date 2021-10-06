import { EntityPlayer } from "@game/entities/player/EntityPlayer";
import { Component } from "@game/entity/Component";
import { Entity } from "@game/entity/Entity";
import { GameScene } from "@game/scenes/GameScene";
import { PhysicBody } from "./PhysicBody";
import { PlayerBehaviour } from "./PlayerBehaviour";
import { Position } from "./Position";

export class EntityDebug extends Component {

    public entity!: Entity;

    public visible: boolean = true;

    private _text?: Phaser.GameObjects.Text;
    private _aimDirLine?: Phaser.GameObjects.Graphics;
    private _lines: {[key: string]: string} = {};

    constructor() {
        super();
    }

    public start(): void {
        super.start();

        if(GameScene.Instance && this.visible) {

            const scene = this.entity.world.scene;

            this._text = scene.add.text(100, 100, 'TEXT');

            this._aimDirLine = scene.add.graphics();
        }
    }

    public setLineText(lineId: string, text?: string) {
        if(text == undefined) {
            delete this._lines[lineId];
            return;
        }
        this._lines[lineId] = text;
    }

    public raycast(bodies, start, r, dist){

        const Matter: any = Phaser.Physics.Matter['Matter'];

        var normRay = Matter.Vector.normalise(r);
        var ray = normRay;
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

    public doRaycast(start: any, r: any) {
        const entities = this.entity.world.entities.filter(entity => {

            if(entity == this.entity) return;
            if(!entity.hasComponent(PhysicBody)) return false;

            const body = entity.getComponent(PhysicBody);

            if(!body) return false;

            return true;
        })

        const bodies = entities.map(e => e.getComponent(PhysicBody).body);
        const result = this.raycast(bodies, start, r, 100);

        return result;
    }

    public update(delta: number): void {
        super.update(delta);

        const position = this.entity.position;
        const text = this._text;

        if(!position) return;
        if(!text) return;

        

        let strLines = '';
        for (const key in this._lines) {
            strLines += this._lines[key] + "\n";
        }
        let str = ``;
        //str += `${this.entity.constructor.name}`;
        str += `\n${Math.round(position.x)}, ${Math.round(position.y)}\n${strLines}`;
        //str += `\nd ${this.entity.position.direction}`
        //str += `\naim d ${this.entity.position.aimDirection}`

        text.setPosition(position.x, position.y);
        text.setText(str);
        text.setDepth(1000);
        text.setFontSize(10)

        if(!this._aimDirLine) return;

        const aimDirLine = this._aimDirLine;

        const linePos = {
            x: 40 * Math.cos(position.aimDirection),
            y: 40 * Math.sin(position.aimDirection)
        }

        aimDirLine.clear();
        aimDirLine.lineStyle(2, 0x0000ff);
        aimDirLine.lineBetween(0, 0, linePos.x, linePos.y);
        aimDirLine.setPosition(position.x, position.y);

        if(this.entity.constructor.name != 'EntityPlayer') return;

        //if(!(this.entity.hasComponent(PlayerBehaviour))) return;

        const Matter: any = Phaser.Physics.Matter['Matter'];

        const start = new Matter.Vector.create( this.entity.position.x, this.entity.position.y );
        start.x = this.entity.position.x;
        start.y = this.entity.position.y;

        const angle = this.entity.position.aimDirection

        const r = new Matter.Vector.create( Math.cos(angle), Math.sin(angle) );
        const normRay = Matter.Vector.normalise(r);

        let ray = Matter.Vector.mult(normRay, 100);
        ray = Matter.Vector.add(start, ray);


        const result = this.doRaycast(start, r);

 
        aimDirLine.lineStyle(3, result ? 0x00ff00 : 0xff0000)
        aimDirLine.lineBetween(
            start.x - this.entity.position.x,
            start.y - this.entity.position.y,
            ray.x - this.entity.position.x,
            ray.y - this.entity.position.y
        );


        /*
        const r = new Matter.Vector.create( 1, 0 );

        
        
        const normRay = Matter.Vector.normalise(r);
        var ray = normRay;
        const point = Matter.Vector.add(ray, start);

        ray = Matter.Vector.mult(normRay, 100);
        const end = Matter.Vector.add(start, ray);
 
        const result = this.raycast(bodies, start, r, 100);
        */
    }

    public destroy(): void {
        super.destroy();

        this._text?.destroy();
        this._aimDirLine?.destroy();
    }
}