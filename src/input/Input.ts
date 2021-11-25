import * as pc from 'playcanvas'

import { Render } from '../render/render';

export class Input {
    private static _keys = new Map<number, boolean>();

    public static init() {
        console.log("init")

        const app = Render.app;
        app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
        app.keyboard.on(pc.EVENT_KEYUP, this.onKeyUp, this);

    }

    public static update(dt: number) {

    }

    public static getKeyDown(key: number | string) {
        const keyCodes: number[] = []

        if(typeof key == 'string') {
            keyCodes.push(key.toLowerCase().charCodeAt(0))
            keyCodes.push(key.toUpperCase().charCodeAt(0))
        } else {
            keyCodes.push(key)
        }

        for (const keyCode of keyCodes) {
            const state = this._keys.get(keyCode) === true;
            if(state) return true;
        }

        return false;
    }

    private static onKeyDown(e: KeyboardEvent) {
        const keyCode = parseInt(e.key);
        this._keys.set(keyCode, true);
    }

    private static onKeyUp(e: KeyboardEvent) {
        const keyCode = parseInt(e.key);
        this._keys.set(keyCode, false);
    }
    
}