import { Gameface } from "../../gameface";

export class GLBLoader {
    public static loadModel(url: string, callback: (entity: pc.Entity) => void) {
        const utils = require('./glb-utils.js')

        Gameface.Instance.app.assets.loadFromUrl(url, 'binary', function (err, glbAsset) {

            if(!glbAsset) return console.error("error");
           
            utils.loadGlbContainerFromAsset(glbAsset, null, glbAsset.name, function (err, asset) {
                var renderRootEntity = asset.resource.instantiateRenderEntity();
                callback(renderRootEntity);
            });

        });
    }
}