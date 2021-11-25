import * as pc from 'playcanvas';
import { AnimatedMaterial } from '../animatedMaterial/animatedMaterial';
import { Render } from '../render/render';
import { Component } from "./component";

export class TestAnimSpriteComponent extends Component {
    public get animatedMaterial() { return this._animatedMaterial; }

    private _animatedMaterial: AnimatedMaterial;

    public init() {
        super.init();

        this.initAnimatedMaterial();
  
        const pcEntity = new pc.Entity();
        pcEntity.addComponent("render", {
            material: this.animatedMaterial.material,
            type: "plane",
        });

        this.getPcEntity().addChild(pcEntity);
    }

    private getPcEntity() {
        return this.entity.pcEntity;
    }

    private initAnimatedMaterial() {
        const animatedMaterial = this._animatedMaterial = new AnimatedMaterial(3, 1, 200);

        Render.loadAsset('assets/player.png', (asset) => {
            animatedMaterial.setAsset(asset);
        });
    }

    public postupdate(dt: number) {
        super.postupdate(dt);

        this.animatedMaterial.update(dt);
    }
}