import * as pc from "playcanvas";
import { Render } from "../../client/render";
import { TextScript } from "../../client/playcanvas/scripts/textScript";
import { Entity } from "../entity/entity";
import { Component } from "./component";

export class DebugComponent extends Component {
    public entity: Entity;
    public priority: number = 0;
  
    public init() {
        super.init();

        if(!Render.app) return;
        
        const text = new pc.Entity('text');
        text.setLocalPosition(0, 0.1, 0)
        const textScript = (text.addComponent('script') as pc.ScriptComponent).create('textScript') as TextScript;

        textScript.text = this.entity.constructor.name

        this.entity.pcEntity.addChild(text);
    }

    public update(dt: number) {
        super.update(dt);

    }
}