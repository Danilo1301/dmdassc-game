import { BulletTrace } from "@game/bulletTrace/BulletTrace";
import { InputHandler } from "@game/entity/components/InputHandler";
import { GameClient } from "@game/game/GameClient";
import { Input } from "@game/input/Input";
import { LocalPlayer } from "@game/network/LocalPlayer";
import { IPacketData_ServerList, PacketType } from "@game/network/Packet";
import { SceneManager } from "@game/sceneManager/SceneManager";
import { GameScene } from "./GameScene";
import { ServerListScene } from "./ServerListScene";


export class MainScene extends Phaser.Scene {

    public startMultiplayer() {
        
    }

    preload() {

        console.log(`[MainScene] Preload`)
        console.log(`[MainScene] Assets path: (${'assets/'})`)

        this.load.setPath('assets/');
        this.load.image('test', 'test.png');
        this.load.image('player', 'player.png');
        this.load.image('player_test', 'player_test.png');
        this.load.image('car', 'car.png');
        this.load.image('crate', 'crate.png');
        this.load.image('bullet', 'bullet.png');
    }

    create() {
        console.log(`[MainScene] Create`);

        Input.setup(this);
        window['Input'] = Input;
        window['LocalPlayer'] = LocalPlayer;
        window['BulletTrace'] = BulletTrace;

        const btn = this.add.image(200, 100, 'test').setInteractive();

        btn.on('pointerup', () => {
            btn.destroy();
            btn2.destroy();

            SceneManager.startScene('ServerListScene', ServerListScene);

            //this.startMultiplayer();
        });

        const btn2 = this.add.image(200, 500, 'test').setInteractive();
        btn2.setAlpha(0.01)

        btn2.on('pointerup', () => {

            const game = SceneManager.game as GameClient;

            if(!game.network.connected) {
                alert("Can't connect to server");
                return;
            }

            btn.destroy();
            btn2.destroy();

            SceneManager.startScene('GameScene', GameScene);

            SceneManager.game.servers[0].worlds[0].setupDefaultWorld();
            SceneManager.game.servers[0].worlds[0].createPlayer().getComponent(InputHandler).isControlledByPlayer = true;



            //this.startMultiplayer();
        });
    }
    

    
    update(time: number, delta: number) {
    }
}