import { Entity } from "../entity/entity";
import { Render } from "../gameface/render";
import { GLBLoader } from "../glbLoader/glbLoader";
import { Component } from "./component";

export class ModelComponent extends Component {
    public entity: Entity;
    public priority: number = 0;
    
    public path: string = "";

    public init() {
        super.init();

        if(!Render.app) return;

        console.log("start loading", this.path)

        const entity = this.entity;

        GLBLoader.loadModel(this.path, (renderRootEntity) => {
            console.log(renderRootEntity);

            entity.pcEntity.addChild(renderRootEntity);

            console.log(renderRootEntity)
        });
    }

    public update(dt: number) {
        super.update(dt);
    }

    public postupdate(dt: number) {
        super.postupdate(dt);
    }
}