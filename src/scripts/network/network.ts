import { io, Socket } from "socket.io-client";
import { NewLineKind } from "typescript";
import { EntityPlayer } from "../entity/entityPlayer";
import { Game } from "../game/game";
import { GameClient } from "../game/gameClient";
import { LocalClient } from "../game/localClient";
import { EntitySync } from "../scripts/entitySync";
import { IPacket, IPacketData_ConnectToServerStatus, IPacketData_EntityData, PacketType } from "./Packet";
import { PacketSender } from "./packetSender";

export class Network {
    private _game: GameClient;
    private _socket: Socket;
    private _packetSender: PacketSender;

    public get connected() { return this._socket.connected; }

    private _sendPacketsDelay: number = 30;
    private _lastSentPackets: number = 0;

    constructor(game: GameClient) {
        this._game = game;

        const isDevEnv = location.host.includes('localhost') || location.host.includes('192.168');
        const address = (isDevEnv ? `${location.protocol}//${location.hostname}:3000` : `https://dmdassc-game.glitch.me`) + '/api/game';


        console.log(`[Network] Address: (${address})`)

        const socket = this._socket = io(address, {
            path: '/socket',
            autoConnect: false,
            reconnection: false
        });

        this._packetSender = new PacketSender(socket, this.onReceivePacket.bind(this));
        
        setInterval(() => { this.update(); }, 1)
    }

    public update() {
        if(!this.connected) return;

        const world = this._game.servers[0].worlds[0];

        if(!world) return;
        if(!LocalClient.player) return;

        const now = Date.now();

        if(now - this._lastSentPackets >= this._sendPacketsDelay) {
            this._lastSentPackets = now;

        
            
            const entity = LocalClient.player;
            
            const packetData: IPacketData_EntityData = {
                entityId: entity.id,
                data: entity.toJSON()
            }

            this.send(PacketType.ENTITY_DATA, packetData);
            
        }
    }

    public connect(callback?: () => void) {
        this._socket.connect();
        this._socket.once('connect', () => {
            callback?.();
        });
    }

    public send(packetType: PacketType, data?: any) {
        setTimeout(() => {
            this._packetSender.send(packetType, data);
        }, Game.testDelay);
    }

    private onReceivePacket(packet: IPacket) {
        if(packet.type == PacketType.CONNECT_TO_SERVER_STATUS) {
            const data: IPacketData_ConnectToServerStatus = packet.data;
            
            LocalClient.playerId = data.entityId;
        }

        if(packet.type == PacketType.ENTITY_DATA) {
            const data: IPacketData_EntityData = packet.data;

            const world = this._game.servers[0].worlds[0];

            let isNewEntity: boolean = false;

            if(!world.hasEntity(data.entityId)) {
                world.createPlayer(undefined, data.entityId);
                isNewEntity = true;
            }

            const entity = world.getEntity(data.entityId);

            entity.fromJSON(data.data);

            if(isNewEntity) {
                entity.script!.create('entitySync');
            }

            if(entity.id == LocalClient.playerId) {

                if(!LocalClient.player) {
                    LocalClient.player = entity as EntityPlayer;
                    LocalClient.player.setControllable();

                    LocalClient.cameraFollowEntity(entity)

                 
                    if(LocalClient.player.script!.has(EntitySync)) {
                        var a = LocalClient.player.script!.get(EntitySync)! as EntitySync;
                        a.enabled = false;
                    }
                }

            }


        }
    }
}