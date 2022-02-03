import * as pc from "playcanvas";
import { Entity } from "../entity/entity";
import { Render } from "../../client/render";
import { PlaneSprite } from "../../client/planeSprite";
import { Component } from "./component";

interface ISpriteOption {
    texture: string
    frames: number
    width: number
    height: number
    planeSprite?: PlaneSprite
}

export class SpriteComponent extends Component {
    public entity: Entity;
    public priority: number = 0;
    
    public path: string = "";

    private _spriteOptions = new Map<string, ISpriteOption>();

    public init() {
        super.init();
    }

    public add(id: string, texture: string, frames: number, width: number, height: number) {
        const spriteOptions: ISpriteOption = {
            texture: texture,
            frames: frames,
            width: width,
            height: height
        }
        this._spriteOptions.set(id, spriteOptions);
    }

    public update(dt: number) {
        super.update(dt);

        if(!Render.app) return;

        Array.from(this._spriteOptions.keys()).map(id => {
            const spriteOptions = this._spriteOptions.get(id)!;

            if(!spriteOptions.planeSprite) {
                spriteOptions.planeSprite = new PlaneSprite(spriteOptions.texture, spriteOptions.frames,  spriteOptions.width, spriteOptions.height);
                this.entity.pcEntityRoot.addChild(spriteOptions.planeSprite.pcEntity);
            }

            spriteOptions.planeSprite.update(dt);
        })
    }

    public postupdate(dt: number) {
        super.postupdate(dt);
    }
}