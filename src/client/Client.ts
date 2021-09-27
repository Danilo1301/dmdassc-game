import { GameServer } from '@game/game/GameServer';
import { IPacket, IPacketData_ConnectToServer, IPacketData_ConnectToServerStatus, IPacketData_EntityData, IPacketData_ServerList, PacketType } from '@game/network/Packet';
import { PacketSender } from '@game/network/PacketSender';
import { v4 as uuidv4 } from 'uuid';
import { Entity } from '@game/entity/Entity';
import { ServerInfo } from '@game/scenes/ServerListScene';
import { Server } from '@game/server/Server';
import { World } from '@game/world/World';
import socketio from 'socket.io';
import { EntityWatcher } from './EntityWatcher';
import { InputHandler } from '@game/entity/components/InputHandler';

export class Client {

    private _id: string;
    private _game: GameServer;
    private _socket: socketio.Socket;
    private _packetSender: PacketSender;
    private _entityWatcher: EntityWatcher;
    private _entity?: Entity;
    private _server?: Server;
    private _world?: World;


    constructor(game: GameServer, socket: socketio.Socket) {
        this._id = uuidv4();
        this._game = game;
        this._socket = socket;
        this._packetSender = new PacketSender(socket);
        this._packetSender.receivePacketEvents.on('packet', (packet: IPacket) => this.onReceivePacket(packet));
        this._entityWatcher = new EntityWatcher();

        setInterval(() => this.update(16), 16);
    }

    public get id() { return this._id; }
    public get connected() { return this._socket.connected; }
    
    public get entity() { return this._entity!; }
    public set entity(entity: Entity) { this._entity = entity; }

    public update(delta: number) {
        if(!this.connected) return;

        const world = this._world;

        if(!world) return;

        const entityWatcher = this._entityWatcher;

        for (const entity of world.entities) {
            
            if(!entityWatcher.hasEntity(entity.id)) {
                entityWatcher.addEntity(entity.id, entity);
            }
        }

        entityWatcher.update(delta);

        for (const entity of world.entities) {
            const newData = entityWatcher.getNewEntityData(entity.id);

            let hasNewData = false;
            for (const componentName in newData.components) {
                hasNewData = true;

                //console.log(`[${componentName}]`, newData.components[componentName]);
            }

            if(hasNewData) {
                const data: IPacketData_EntityData = {
                    entityId: entity.id,
                    entityType: entity.constructor.name,
                    components: newData.components
                }
    
                this.send(PacketType.ENTITY_DATA, data);
            }
        }
        
        /*
        
        for (const entity of world.entities) {
            const data: IPacketData_EntityData = {
                entityId: entity.id,
                x: entity.position.x,
                y: entity.position.y
            }

            this.send(PacketType.ENTITY_DATA, data);
        }
        
        */
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
            const positionData = data.components['Position'];
            const inputHandlerData = data.components['InputHandler'];

            this.entity.position.set(positionData.x, positionData.y);
            
            const inputHandler = this.entity.getComponent(InputHandler);
            inputHandler.horizontal = inputHandlerData.h;
            inputHandler.vertical = inputHandlerData.v;
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