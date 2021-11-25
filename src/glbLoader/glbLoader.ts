import { Render } from "../render/render";

export class GLBLoader {
    public static loadModel(url: string, callback: (entity: pc.Entity) => void) {
        require('../playcanvas/glb-utils.js')

        Render.app.assets.loadFromUrl('building.glb', 'binary', function (err, glbAsset) {

            if(!glbAsset) return console.error("error");
           
            const utils = window['utils'];

            utils.loadGlbContainerFromAsset(glbAsset, null, glbAsset.name, function (err, asset) {
                var renderRootEntity = asset.resource.instantiateRenderEntity();
                callback(renderRootEntity);
            });

        });
    }
}