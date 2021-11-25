import { Render } from "matter-js";
import * as pc from "playcanvas";
import { Camera } from "../../camera/camera";
import { PlayCanvas } from "../playcanvas";

export class TextScript extends pc.ScriptType {

    public text: string = "spawn";
    public fontsize: number = 70;

    public canvas: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;
    public texture: pc.Texture;

    public initialize() {
        this.fire('initialize');

        // Create a canvas to do the text rendering
        this.canvas = document.createElement('canvas');
        this.canvas.height = 128;
        this.canvas.width = 512 ;
        this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;

        this.texture = new pc.Texture(this.app.graphicsDevice, {
            format: pc.PIXELFORMAT_R8_G8_B8_A8
        });
        this.texture.setSource(this.canvas);
        
        this.texture.minFilter = pc.FILTER_LINEAR_MIPMAP_LINEAR;
        this.texture.magFilter = pc.FILTER_LINEAR;

        
        this.texture.addressU = pc.ADDRESS_CLAMP_TO_EDGE;
        this.texture.addressV = pc.ADDRESS_CLAMP_TO_EDGE;

        this.updateText();

        const material = new pc.StandardMaterial();
        this.entity.addComponent("render", {
            material: material,
            type: "plane",
        });

        this.entity.setLocalScale(5.12, 1, 1.28)
        this.entity.render!.castShadows = false;
        this.entity.render!.receiveShadows = false;

        
    

        material.emissiveMap = this.texture;
        material.opacityMap = this.texture;
        material.blendType = pc.BLEND_NORMAL;
        material.depthTest = false;
        material.update();
    }

    public updateText() {
        var ctx = this.context;
        var w = ctx.canvas.width;
        var h = ctx.canvas.height;

        // Clear the context to transparent
        ctx.fillStyle = "#00000000";
        ctx.fillRect(0, 0, w, h);

        // Write white text
        ctx.fillStyle = 'red';
        ctx.save();
        ctx.font = 'bold '+String(this.fontsize)+'px Verdana';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(this.text, w / 2, h / 2);
        ctx.restore();

        // Copy the canvas into the texture
        this.texture.upload();
    }

    public postInitialize() {
        this.fire('postInitialize');
    }


    
    public update(dt) {
        this.fire('update', dt);
    }

    public postUpdate(dt) {
        this.fire('postUpdate', dt);

        //var pos = PlayCanvas.camera.getPosition();

        //this.entity.setPosition(pos.x, 0, pos.z)

        //this.text = `${this.app.}`;
        //this.updateText();
    }

    public swap() {
        this.fire('swap');
    }
}

//TestScript.attributes.add('height', {type: 'number', default: 5});
//TestScript.attributes.add('followEntity', {type: 'entity'});