import * as pc from 'playcanvas';
import { Render } from '../render/render';
import { Component } from "./component";
import { PositionComponent } from './positionComponent';

export class DELETEDPcEntityComponent extends Component {
    public get pcEntity() { return this._pcEntity; }

    private _pcEntity: pc.Entity;

    public init() {
        this.createPcEntity();

        const app = Render.app;
        app.root.addChild(this._pcEntity);
    }

    public postupdate(dt: number) {
        super.postupdate(dt);

        const pcEntity = this._pcEntity;
        const positionComponent = this.entity.getComponent(PositionComponent);
        
        pcEntity.setPosition(positionComponent.x / 10, 0, positionComponent.y / 10);
        pcEntity.setEulerAngles(0, pc.math.RAD_TO_DEG * -positionComponent.angle, 0);
    }

    private createPcEntity() {
        const pcEntity = new pc.Entity();
        const material = new pc.StandardMaterial();
        material.diffuse = new pc.Color(0, 1, 0);
        material.update();

        
        const centerPcEntity = new pc.Entity();

        centerPcEntity.addComponent("render", {
            material: material,
            type: "box",
        });
        centerPcEntity.setLocalScale(new pc.Vec3(0.2, 0.2, 0.2));
        
        pcEntity.addChild(centerPcEntity);

        

        this._pcEntity = pcEntity;
    }
}