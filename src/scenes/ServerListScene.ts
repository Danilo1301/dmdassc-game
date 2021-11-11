import { GameClient } from "@game/game/GameClient";
import { IPacketData_ConnectToServer, PacketType } from "@game/network/Packet";
import { SceneManager } from "@game/sceneManager/SceneManager";

export interface ServerInfo {
    id: string
    name: string
    players: number
    maxplayers: number
}

export class ServerListScene extends Phaser.Scene {

    public static Instance: ServerListScene;

    private _servers: ServerInfo[] = [];

    constructor() {
        super({});
        ServerListScene.Instance = this;
    }

    public get network() { return (SceneManager.game as GameClient).network; }

    public updateServersList(servers: ServerInfo[]) {
        this._servers = servers;
        this.createServerButtons();
    }

    public createServerButtons() {
        const servers = this._servers;
        const centerX = this.cameras.main.centerX;

        let i = 0;

        for (const server of servers) {
            const r = this.add.rectangle(centerX, 60 + i * 60, 700, 50, 0xACAFFF);
            const t = this.add.text(centerX, 60 + i * 60, `[${server.id}] ${server.name} (${server.players} / ${server.maxplayers} players)`, {color: 'black'});
            
            t.setOrigin(0.5);
            r.setInteractive();
            r.on("pointerup", () => {
                this.connectToServer(server.id);
                r.destroy();
            });
            i++;
        }
    }

    public connectToServer(id: string) {
        console.log(`[ServerListScene] Connecting to ${id}...`)

        const network = this.network;
        const data: IPacketData_ConnectToServer = {id: id};

        network.send(PacketType.CONNECT_TO_SERVER, data);
    }

    public preload() {
        console.log(`[ServerListScene] Preload`)
    }

    public create() {
        console.log(`[ServerListScene] Create`);

        const network = this.network;

        network.send(PacketType.REQUEST_SERVER_LIST);
    }
    
    update(time: number, delta: number) {
    }
}