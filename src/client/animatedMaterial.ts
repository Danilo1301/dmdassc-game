import * as pc from 'playcanvas';

export class AnimatedMaterial {
    public material = new pc.StandardMaterial()

    private _offset = new pc.Vec2();
    private _numSprites = new pc.Vec2();
    private _currentSprite = new pc.Vec2(0, 0);
    private _animTime: number = 0;
    private _changeSpriteTime: number = 0;

    constructor(spritesX: number, spritesY: number, animTime: number) {
        this._numSprites.x = spritesX;
        this._numSprites.y = spritesY;
        this._animTime = animTime;
    }

    public setAsset(asset: pc.Asset) {
        const material = this.material;

        material.diffuseMap = asset.resource;
        material.blendType = pc.BLEND_NORMAL;
        material.opacityMap = asset.resource;
        /*
        */

        material.update();
    }

    public update(dt: number) {
        this._changeSpriteTime += dt;
        if(this._changeSpriteTime >= this._animTime / 1000) {
            this._changeSpriteTime = 0;

            this._currentSprite.x++;
            if(this._currentSprite.x >= this._numSprites.x) this._currentSprite.x = 0;
        }


        const sx = 1 / this._numSprites.x;
        const sy = 1 / this._numSprites.y;

        this._offset.x = this._currentSprite.x * sx;
        this._offset.y = this._currentSprite.y * sy;

        const material = this.material;
        material.diffuseMapOffset.set(this._offset.x, this._offset.y);
        material.diffuseMapTiling.set(sx, sy);

        material.opacityMapOffset.set(this._offset.x, this._offset.y);
        material.opacityMapTiling.set(sx, sy);
        material.update();
    }
    
}