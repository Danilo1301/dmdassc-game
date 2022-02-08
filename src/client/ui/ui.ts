import * as pc from 'playcanvas'
import { Render } from '../render';
import { UIText } from './uiText';

export class UI {
    public static get screen() { return this._screen; }

    private static _fontAsset: any;
    private static _screen: pc.ScreenComponent;

    public static init(app: pc.Application) {
        const screenEntity = new pc.Entity('ui-screen');
        this._screen = screenEntity.addComponent('screen', {
            screenSpace: true, // for 2d screen
            scaleMode: pc.SCALEMODE_BLEND,
            scaleBlend: 0.5,
        }) as pc.ScreenComponent;
        app.root.addChild(screenEntity);

        this.addImage();
        const uitext = this.addText(0, 0, 'text');
        //uitext.entity.setPosition(0, -1, 0)

        window['UI'] = UI;
    }

    public static addText(x: number, y: number, text: string) {
        const uiText = new UIText(x, y, text, this.getFontAsset());
        uiText.setPosition(x, y);

        this._screen.entity.addChild(uiText.entity);

        return uiText;
    }

    public static addImage() {
        const element = new pc.Entity('the element');
        element.addComponent("element", {
            type: pc.ELEMENTTYPE_IMAGE
        });

        this._screen.entity.addChild(element);
    }

    public static getFontAsset() {
        const app = Render.app;

        if(this._fontAsset != undefined) return this._fontAsset;

        this._fontAsset = new pc.Asset('arial.json', "font", { url: "/assets/fonts/arial.json" });
        this._fontAsset.on('load', function () {
            console.log("font loaded")
        });

        app.assets.add(this._fontAsset);
        app.assets.load(this._fontAsset);


        return this._fontAsset;
    }
}