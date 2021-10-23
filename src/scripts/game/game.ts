const Ammo = require('ammo.js');
window['Ammo'] = Ammo;

import * as pc from "../../playcanvas";
import { CameraFollow } from "../scripts/cameraFollow";
import { EntitySync } from "../scripts/entitySync";
import { Movement } from "../scripts/movement";
import { Server } from "../server/server";
import { LocalClient } from "./localClient";


export class Game {
    public static testDelay: number = 0;
    public static get isHeadless() { return !LocalClient.hasApp; }
    private _servers = new Map<string, Server>();

    public get app() { return LocalClient.app; }
    public get servers() { return Array.from(this._servers.values()); }

    public start() {
        console.log(`[${this.constructor.name}]`, `start`);
        this.init();
    }

    protected init() {
        console.log(`[${this.constructor.name}]`, `init`);
    }

    public createServer(id: string) {
        console.log(`[${this.constructor.name}]`, `createServer ${id}`);

        const server = new Server(this);
        this._servers.set(id, server);
        return server;
    }

    public createApplication(canvas: any, isDefault?: boolean) {
        const keyboard = new pc.Keyboard(document.body);
        const app = new pc.Application(canvas, {
            keyboard: keyboard
        });
        if(isDefault) LocalClient.app = app;

        pc.registerScript(CameraFollow, 'cameraFollow', app);
        pc.registerScript(Movement, 'movement', app);
        pc.registerScript(EntitySync, 'entitySync', app);

        return app;
    }

    protected setupTestScene(app) {
        console.log(`[Game] setupTestScene`)
        
        const box = new pc.Entity('cube');
        box.addComponent('model', {
            type: 'box'
        });
        app.root.addChild(box);

        

        // create directional light entity
        const light = new pc.Entity('light');
        light.addComponent('light');
        app.root.addChild(light);
        light.setEulerAngles(45, 0, 0);
    }
}