import * as pc from 'playcanvas'

export class UIText {
    public get entity() { return this._entity; }

    private _entity: pc.Entity;

    constructor(x: number, y: number, text: string, fontAsset) {
        const entity = new pc.Entity('ui-text');
        entity.addComponent("element", {
            //anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5), // centered anchor
            fontAsset: fontAsset,
            fontSize: 10,
            pivot: new pc.Vec2(0.5, 1),            // centered pivot
            text: text,
            type: pc.ELEMENTTYPE_TEXT
        });

        this._entity = entity;
    }

    public setPosition(x: number, y: number) {
        this.entity.setLocalPosition(x, y, 0);
    }

    public destroy() {
        this.entity.destroy();
    }
}