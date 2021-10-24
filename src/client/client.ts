import { EntityPlayer } from "../entity/entityPlayer";
import { GameServer } from "../game/gameServer";
import { IPacket, IPacketData_ConnectToServerStatus, IPacketData_EntityData, PacketType } from "../packet/packet";

export class Client {
    private _game: GameServer;
    private _id: string;
    private _player?: EntityPlayer;

    public get game() { return this._game; }
    public get id() { return this._id; }
    public get player() { return this._player; }

    private _sendPacketsDelay: number = 10;
    private _lastSentPackets: number = 0;

    constructor(game: GameServer, id: string) {
        this._game = game;
        this._id = id;

        this.game.sendClientData(this.id, {from: "client"});
    }

    public update(dt: number) {

        const now = Date.now();

        if(now - this._lastSentPackets >= this._sendPacketsDelay) {
            this._lastSentPackets = now;
        }

        for (const entity of this.game.world.entities) {
           
            const packetData: IPacketData_EntityData = {
                entityId: entity.id,
                data: entity.toJSON()
            }

            this.send(PacketType.ENTITY_DATA, packetData)
            
        }
    }

    public onConnect() {
        const player = this._player = this.game.world.createPlayer();

        const data: IPacketData_ConnectToServerStatus = {
            serverId: 'someid',
            entityId: player.id,
            success: false
        } 
        this.send(PacketType.CONNECT_TO_SERVER_STATUS, data);
    }

    public onReceivePacket(packet: IPacket) {
        if(packet.type == PacketType.ENTITY_DATA) {
            const data: IPacketData_EntityData = packet.data;

            this.player?.fromJSON(data.data);
        }
    }

    public send(type: PacketType, data?: any) {
        const packet: IPacket = {
            type: type,
            data: data
        }

        this.game.sendClientData(this.id, packet);
    }
}