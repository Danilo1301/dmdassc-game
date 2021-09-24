import { GameClient } from "@game/game/GameClient";
import { SceneManager } from "@game/sceneManager/SceneManager";

export class GameScene extends Phaser.Scene {

    public static Instance: GameScene;

    constructor() {
        super({});

        GameScene.Instance = this;
    }

    preload() {
        console.log(`[GameScene] Preload`)
    }

    create() {
        console.log(`[GameScene] Create`);

        const game = SceneManager.game as GameClient;
        const server = game.createServer();
        const world = server.createWorld('world1');

        world.events.on('ready', () => {
            console.log("ayo")
        });

        world.init();
    }
    
    update(time: number, delta: number) {
    }
}