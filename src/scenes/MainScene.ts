import { GameClient } from "@game/game/GameClient";
import { Input } from "@game/input/Input";
import { IPacketData_ServerList, PacketType } from "@game/network/Packet";
import { SceneManager } from "@game/sceneManager/SceneManager";
import { ServerListScene } from "./ServerListScene";


export class MainScene extends Phaser.Scene {

    public startMultiplayer() {
        
    }

    preload() {

        console.log(`[MainScene] Preload`)

        this.load.setPath('/static/assets/');
        this.load.image('test', 'test.png');
        this.load.image('player', 'player.png');
        this.load.image('player_test', 'player_test.png');
        this.load.image('car', 'car.png');
        this.load.image('crate', 'crate.png');
    }

    create() {
        console.log(`[MainScene] Create`);

        Input.setup(this);
        window['Input'] = Input;

        const btn = this.add.image(200, 100, 'test').setInteractive();

        btn.on('pointerup', () => {
            btn.destroy();

            SceneManager.startScene('ServerListScene', ServerListScene);

            //this.startMultiplayer();
        });
    }
    
    
    update(time: number, delta: number) {
    }
}