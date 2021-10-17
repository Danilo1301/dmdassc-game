import { BulletTrace } from "@game/bulletTrace/BulletTrace";
import { GameClient } from "@game/game/GameClient";
import { Input } from "@game/input/Input";
import { LocalPlayer } from "@game/network/LocalPlayer";
import { SceneManager } from "@game/sceneManager/SceneManager";

export class GameScene extends Phaser.Scene {

    public static Instance: GameScene;

    constructor() {
        super({});

        GameScene.Instance = this;
    }

    public static setupGame(isHost: boolean, isOnline: boolean) {
        const game = SceneManager.game as GameClient;
        const server = game.createServer();
        server.isHost = isHost;
        server.isOnline = isOnline;
        const world = server.createWorld('world1');

        world.events.on('ready', () => {
            console.log("ayo")
        });

        world.init();

        this.Instance.cameras.main.setBackgroundColor(0x286f1e);
        this.Instance.add.text(0, 0, `(0,0)\nPress F to enter vehicle\nPress E to shoot`);
    }

    preload() {
        console.log(`[GameScene] Preload`)
    }

    create() {
        console.log(`[GameScene] Create`);

        Input.setup(this);
    }

    public update(time: number, delta: number) {
        LocalPlayer.update(delta);
        BulletTrace.update(delta);
    }    
}