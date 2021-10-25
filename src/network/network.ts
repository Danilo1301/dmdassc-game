import { io, Socket } from "socket.io-client";
import { GameClient } from "../game/gameClient";
import { IPacket, IPacketData_ConnectToServerStatus, IPacketData_EntityData, PacketType } from "../packet/packet";
import { WorldSyncHelper } from "../world/worldSyncHelper";

export class Network {
    private _game: GameClient;
    private _socket: Socket;

    public get game() { return this._game; }
    public get socket() { return this._socket; }
    public get connected() { return this._socket.connected; }

    private _sendPacketsDelay: number = 200;
    private _sendTime: number = 0;

    constructor(game: GameClient) {
        this._game = game;

        //https://dmdassc-game.glitch.me/
        
        const address = `${location.protocol}//${location.host}`;
        this._socket = io(address, {
            //path: '/socket',
            autoConnect: false,
            reconnection: false
        });

        this._socket.on('packet', packet => this.onReceivePacket(packet));
        
        console.log(`[Network] Address: (${address})`);
    }

    public connect(callback?: () => void) {
        console.log(`[Network] Connecting...`);

        this._socket.connect();
        this._socket.once('connect', () => {
            callback?.();
        });
    }

    public update(dt: number) {
        this._sendTime += dt;

        const entity = GameClient.player;

        if(!entity) return;

        if(this._sendTime <= this._sendPacketsDelay/1000) return;
        this._sendTime = 0;

        const packetData: IPacketData_EntityData = {
            entityId: entity.id,
            data: entity.toJSON()
        }

        this.send(PacketType.ENTITY_DATA, packetData);
    }

    public send(type: PacketType, data?: any) {
        const packet: IPacket = {
            type: type,
            data: data
        }
        this.socket.emit('packet', packet);
    }
    
    public onReceivePacket(packet: IPacket) {
        //console.log(packet)

        if(packet.type == PacketType.CONNECT_TO_SERVER_STATUS) {
            const data: IPacketData_ConnectToServerStatus = packet.data;
           
            GameClient.playerId = data.entityId;
        }

        if(packet.type == PacketType.ENTITY_DATA) {
            const data: IPacketData_EntityData = packet.data;

            WorldSyncHelper.onReceiveEntityData(data);
        }
    }

    /*
    private onReceivePacket(packet: IPacket) {
        
    }
    */
}