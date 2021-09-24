import { GameServer } from '@game/game/GameServer';
import { IPacket, IPacketData_ConnectToServer, IPacketData_ConnectToServerStatus, IPacketData_EntityData, IPacketData_ServerList, PacketType } from '@game/network/Packet';
import { PacketSender } from '@game/network/PacketSender';
import { v4 as uuidv4 } from 'uuid';
import { Entity } from '@game/entity/Entity';
import { ServerInfo } from '@game/scenes/ServerListScene';
import { Server } from '@game/server/Server';
import { World } from '@game/world/World';
import socketio from 'socket.io';

export class Client {

    private _id: string;
    private _game: GameServer;
    private _packetSender: PacketSender
    private _entity?: Entity;
    private _server?: Server;
    private _world?: World;

    constructor(game: GameServer, socket: socketio.Socket) {
        this._id = uuidv4();
        this._game = game;
        this._packetSender = new PacketSender(socket);
        this._packetSender.receivePacketEvents.on('packet', (packet: IPacket) => this.onReceivePacket(packet));

        setInterval(() => this.update(30), 30);
    }

    public get id() { return this._id; }
    
    public get entity() { return this._entity!; }
    public set entity(entity: Entity) { this._entity = entity; }

    public update(delta: number) {
        const world = this._world;

        if(!world) return;

        for (const entity of world.entities) {
            const data: IPacketData_EntityData = {
                entityId: entity.id,
                x: entity.position.x,
                y: entity.position.y
            }

            this.send(PacketType.ENTITY_DATA, data);
        }

        //console.log(world.entities.length)
    }

    private onReceivePacket(packet: IPacket) {
        if(packet.type == PacketType.REQUEST_SERVER_LIST) {

            const servers = this._game.servers.map(server => {
                const serverInfo: ServerInfo = {
                    id: server.id,
                    name: `Server`,
                    players: server.clients.length,
                    maxplayers: -1
                }
                return serverInfo;
            })

            const data: IPacketData_ServerList = {servers: servers};
            this.send(PacketType.SERVER_LIST, data);
        }

        if(packet.type == PacketType.CONNECT_TO_SERVER) {
            const data: IPacketData_ConnectToServer = packet.data;
            this.connectToServer(data.id);
        }

        if(packet.type == PacketType.ENTITY_DATA) {
            const data: IPacketData_EntityData = packet.data;
            this.entity.position.set(data.x, data.y);
        }
    }

    public connectToServer(id: string) {
        const server = this._game.getServer(id);
        const data: IPacketData_ConnectToServerStatus = {
            serverId: server.id,
            success: false
        } 

        const self = this;
        const sendData = () => self._packetSender.send(PacketType.CONNECT_TO_SERVER_STATUS, data);

        if(this._server != undefined) {
            data.errorMessage = `Already connected to a server`;
            sendData();
            return;
        }

        server.handleClientConnection(this, (success) => {
            if(success) {
                data.success = true;
                data.entityId = this.entity.id;

                this._server = server;
                this._world = this.entity.world;
            }

            sendData();
        });
    }
    
    public send(packetType: PacketType, data?: any) {
        this._packetSender.send(packetType, data);
    }
}