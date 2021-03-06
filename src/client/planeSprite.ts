import * as pc from 'playcanvas';
import { AnimatedMaterial } from "./animatedMaterial";
import { Render } from "./render";


export class PlaneSprite {

    public get pcEntity() { return this._pcEntity; }

    private _pcEntity: pc.Entity;
    private _animatedMaterial: AnimatedMaterial;

    constructor(url: string, frames: number, width: number, height: number) {
        const animatedMaterial = this._animatedMaterial = new AnimatedMaterial(frames, 1, 200);

        
        Render.loadAsset(url, (asset) => {
            animatedMaterial.setAsset(asset);
        });
    

        

        const pcEntity = this._pcEntity = new pc.Entity();
        
        pcEntity.addComponent("render", {
            material: animatedMaterial.material,
            type: "plane",
        });
        pcEntity.setLocalScale(new pc.Vec3(width * 0.01, 1, height * 0.01));
        pcEntity.render!.castShadows = false

        console.log("pcEntity planesprite", pcEntity)
    }

    public update(dt: number) {
        this._animatedMaterial.update(dt);
    }
}