import { EntityPlayer } from "@game/entities/player/EntityPlayer";
import { EntityVehicle } from "@game/entities/vehicle/EntityVehicle";
import { InputHandler } from "@game/entity/components/InputHandler";
import { GameClient } from "@game/game/GameClient";
import { Input } from "@game/input/Input";
import { LocalPlayer } from "@game/network/LocalPlayer";
import { IPacketData_Id, PacketType } from "@game/network/Packet";
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

        this.cameras.main.setBackgroundColor(0x286f1e);

        this.add.text(0, 0, `(0,0)\nPress F to enter vehicle\nPress E to shoot`);
    }

    private _key_f_state: boolean = false;
    
    update(time: number, delta: number) {

        const keyDown = Input.getKeyDown(70);

        if(this._key_f_state != keyDown) {
            this._key_f_state = keyDown;

            if(keyDown) this.onPressF();
        }
    }

    public onPressF() {
        const game = SceneManager.game as GameClient;
        const world = game.servers[0].worlds[0];
        const entity = LocalPlayer.entity!;

        if((LocalPlayer.entity!) instanceof EntityVehicle) {

            const data: IPacketData_Id = {
                id: ''
            }

            game.network.send(PacketType.ENTER_VEHICLE, data);


            return
        }

        const vehicles: EntityVehicle[] = world.entities.filter(e => e instanceof EntityVehicle);

        for (const vehicle of vehicles) {
            const distance = Phaser.Math.Distance.BetweenPoints(entity.position, vehicle.position);

            console.log(distance)

            if(distance < 40) {
                console.log(vehicle)

                const game = SceneManager.game as GameClient

                const data: IPacketData_Id = {
                    id: vehicle.id
                }

                game.network.send(PacketType.ENTER_VEHICLE, data);

                break;
            }
        }

        console.log("F", vehicles)
    
    }
    
}