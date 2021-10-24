import { io, Socket } from "socket.io-client";
import { BaseEntity } from "../entity/baseEntity";
import { EntityPlayer } from "../entity/entityPlayer";
import { GameClient } from "../game/gameClient";
import { IPacket, IPacketData_ConnectToServerStatus, IPacketData_EntityData, PacketType } from "../packet/packet";
import { EntitySync } from "../scripts/entitySync";

export class Network {
    private _game: GameClient;
    private _socket: Socket;

    public get game() { return this._game; }
    public get connected() { return this._socket.connected; }

    private _sendPacketsDelay: number = 200;
    private _lastSentPackets: number = 0;

    constructor(game: GameClient) {
        this._game = game;

        //https://dmdassc-game.glitch.me/
        
        const address = `${location.protocol}//${location.host}/game`;
        this._socket = io(address, {
            //path: '/socket',
            autoConnect: false,
            reconnection: false
        });
        this._socket.on('_data', (data) => {
            const packet = JSON.parse(data) as IPacket;

            this.onReceivePacket(packet);

            //console.log(`[Network] Received:`, data);
        })

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
        const world = this.game.world;
        const entity = GameClient.player;

        if(!world) return;
        if(!entity) return;

        const now = Date.now();

        if(now - this._lastSentPackets >= this._sendPacketsDelay) {
            this._lastSentPackets = now;

        
            
            
            
            const packetData: IPacketData_EntityData = {
                entityId: entity.id,
                data: entity.toJSON()
            }

            this.send(PacketType.ENTITY_DATA, packetData);
            
        }
    }

    public send(type: PacketType, data?: any) {
        const packet: IPacket = {
            type: type,
            data: data
        }

        this._socket.emit('_data', JSON.stringify(packet));
    }

    private onReceivePacket(packet: IPacket) {
        if(packet.type == PacketType.CONNECT_TO_SERVER_STATUS) {
            const data: IPacketData_ConnectToServerStatus = packet.data;
            GameClient.playerId = data.entityId;

            console.log(GameClient.playerId)
        }

        if(packet.type == PacketType.ENTITY_DATA) {
            const data: IPacketData_EntityData = packet.data;
            const world = this._game.world;

            let isNewEntity: boolean = false;

            if(!world.hasEntity(data.entityId)) {
                world.createPlayer(undefined, data.entityId);
                isNewEntity = true;

                console.log('new entiy')
            }

            const entity = world.getEntity(data.entityId);

            entity.fromJSON(data.data);

            if(isNewEntity) {
                entity.script!.create('entitySync');
            }

            

            if(entity.id == GameClient.playerId) {

                if(!GameClient.player) {
                    GameClient.player = entity as EntityPlayer;
                    GameClient.player.setControllable();

                    GameClient.cameraFollowEntity(entity);

                 
                    
                    if(GameClient.player.script!.has(EntitySync)) {
                        var a = GameClient.player.script!.get(EntitySync)! as EntitySync;
                        a.enabled = false;
                    }
                    
                }

            }
        }
    }
}