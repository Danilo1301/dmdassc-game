import { Entity } from "../entity/entity";
import { Render } from "../../client/render";
import { GLBLoader } from "../../client/playcanvas/glbLoader/glbLoader";
import { Component } from "./component";

export class ModelComponent extends Component {
    public entity: Entity;
    public priority: number = 0;
    
    public path: string = "";

    private _renderRootEntity?: pc.Entity;

    public init() {
        super.init();

        if(!Render.app) return;

        console.log("start loading", this.path)

        const entity = this.entity;

        GLBLoader.loadModel(this.path, (renderRootEntity) => {
            //console.log(renderRootEntity);
            this._renderRootEntity = renderRootEntity;

            entity.pcEntity.addChild(renderRootEntity);

            //console.log(renderRootEntity)
        });
    }

    public update(dt: number) {
        super.update(dt);
    }

    public postupdate(dt: number) {
        super.postupdate(dt);
    }

    public destroy(): void {
        super.destroy();

        this._renderRootEntity?.destroy();
    }
}