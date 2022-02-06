import * as pc from "playcanvas";

export class TextScript extends pc.ScriptType {

    public text: string = "WorldText";
    public fontsize: number = 20;

    public canvas: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;
    public texture: pc.Texture;

    public height: number = 20;

    public initialize = () => {
        this.fire('initialize');

        // Create a canvas to do the text rendering
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;

        this.texture = new pc.Texture(this.app.graphicsDevice, {
            format: pc.PIXELFORMAT_R8_G8_B8_A8
        });
        this.texture.setSource(this.canvas);
        
        this.texture.minFilter = pc.FILTER_LINEAR_MIPMAP_LINEAR;
        this.texture.magFilter = pc.FILTER_LINEAR;

        
        this.texture.addressU = pc.ADDRESS_CLAMP_TO_EDGE;
        this.texture.addressV = pc.ADDRESS_CLAMP_TO_EDGE;

        const material = new pc.StandardMaterial();
        this.entity.addComponent("render", {
            material: material,
            type: "plane",
        });

        this.entity.render!.castShadows = false;
        this.entity.render!.receiveShadows = false;

        //material.emissiveMap = this.texture;

        material.opacityMap = this.texture;
        material.diffuseMap = this.texture;
        material.blendType = pc.BLEND_NORMAL;
        //material.depthTest = false;
        material.update();

        this.setTextureSize(512, this.height)
        this.updateText();
        
    }

    private setTextureSize(x: number, y: number) {
        this.canvas.width = x;
        this.canvas.height = y;
        this.entity.setLocalScale(x * 0.01, 1, y * 0.01)
    }

    private setText(text: string) {
        this.applyFont()

        const ctx = this.context;
        const width = ctx.measureText(text).width;

        this.setTextureSize(width, this.height)

        var w = ctx.canvas.width;
        var h = ctx.canvas.height;

        //ctx.fillStyle = "#000000";
        ctx.clearRect(0, 0, w, h);
        //ctx.fillRect(0, 0, w, h);

        this.applyFont()
        ctx.fillText(text, w / 2, h / 2);

        this.texture.upload();
    }

    private applyFont() {
        var ctx = this.context;
        ctx.font = 'bold '+String(this.fontsize)+'px Verdana';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'black';
    }

    private updateText() {
        this.setText(this.text);

        setInterval(() => {
            //this.text = `${Math.random()}`

            //this.setText(this.text);
        }, 200)
    }

    public postInitialize = () => {
      

        this.fire('postInitialize');
    }


    
    public update = (dt) => {
        this.fire('update', dt);
    }

    public postUpdate = (dt) => {
        this.fire('postUpdate', dt);

        //var pos = PlayCanvas.camera.getPosition();

        //this.entity.setPosition(pos.x, 0, pos.z)

        //this.text = `${this.app.}`;
        //this.updateText();
    }

    public swap = () => {
        this.fire('swap');
    }
}

//TestScript.attributes.add('height', {type: 'number', default: 5});
//TestScript.attributes.add('followEntity', {type: 'entity'});