import { GameServer } from '@game/game/GameServer';
import { IPacket, IPacketData_ConnectToServer, IPacketData_ConnectToServerStatus, IPacketData_EntityData, IPacketData_Id, IPacketData_ServerList, IPacketData_SetServerPacketSendDelay, PacketType } from '@game/network/Packet';
import { PacketSender } from '@game/network/PacketSender';
import { v4 as uuidv4 } from 'uuid';
import { Entity } from '@game/entity/Entity';
import { ServerInfo } from '@game/scenes/ServerListScene';
import { Server } from '@game/server/Server';
import { World } from '@game/world/World';
import socketio from 'socket.io';
import { EntityWatcher, IWatchEntityData } from './EntityWatcher';
import { IInputHandlerData, InputHandler } from '@game/entity/components/InputHandler';
import { IPositionData } from '@game/entity/components/Position';
import { EntityPlayer } from '@game/entities/player/EntityPlayer';
import { PlayerBehaviour } from '@game/entity/components/PlayerBehaviour';

export class Client {

    private _id: string;
    private _game: GameServer;
    private _socket: socketio.Socket;
    private _packetSender: PacketSender;
    private _entityWatcher: EntityWatcher;
    private _entity?: Entity;
    private _server?: Server;
    private _world?: World;
    private _player?: EntityPlayer;
    private _entitiesSyncTime = new Phaser.Structs.Map<string, number>([]);

    private _sendPacketDelay: number = 30;
    private _lastSentPackets: number = 0;

    constructor(game: GameServer, socket: socketio.Socket) {
        this._id = uuidv4();
        this._game = game;
        this._socket = socket;
        this._packetSender = new PacketSender(socket);
        this._packetSender.receivePacketEvents.on('packet', (packet: IPacket) => this.onReceivePacket(packet));
        this._entityWatcher = new EntityWatcher();

        setInterval(() => this.update(1), 1);

        this._socket.on('disconnect', () => this.onDisconnect());
        this.onConnect();
    }

    public get id() { return this._id; }
    public get connected() { return this._socket.connected; }
    
    public get player() { return this._player!; }
    public get entity() { return this._entity!; }
    public set entity(entity: Entity) { this._entity = entity; }

    private sendEntityData(entity: Entity, watchData: IWatchEntityData) {
    
        const now = Date.now();

        if(this._entitiesSyncTime.has(entity.id)) {
            const t = this._entitiesSyncTime.get(entity.id);

            if(now - t <= entity.syncTime) return;
        }

        let hasNewData = false;
        for (const componentName in watchData.components) {
            hasNewData = true;

            //console.log(`[${componentName}]`, newData.components[componentName]);
        }

        if(hasNewData) {
            const data: IPacketData_EntityData = {
                entityId: entity.id,
                entityType: entity.constructor.name,
                components: watchData.components
            }

            this.send(PacketType.ENTITY_DATA, data);

            this._entitiesSyncTime.set(entity.id, now);
        }
    }

    public update(delta: number) {
        if(!this.connected) return;

        const world = this._world;

        if(!world) return;

        const entityWatcher = this._entityWatcher;

        for (const entity of world.entities) {
            
            if(!entityWatcher.hasEntity(entity.id)) {
                entityWatcher.addEntity(entity.id, entity);
                entityWatcher.updateEntityData(entity.id);

                const data = entityWatcher.getEntityFullData(entity.id);
                this.sendEntityData(entity, data);
            }
        }

        const now = Date.now();
        if(now - this._lastSentPackets <= this._sendPacketDelay) return
        this._lastSentPackets = now;

        entityWatcher.update(delta);

        for (const entity of world.entities) {
            const data = entityWatcher.getNewEntityData(entity.id);
        
            this.sendEntityData(entity, data);
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

            if(data.entityId != this.entity.id) return;

            const entity = this.entity;

            const positionData = <IPositionData>data.components['Position'];
            if(positionData.x != undefined && positionData.y != undefined) entity.position.set(positionData.x, positionData.y);
            if(positionData.dir != undefined)  entity.position.setDirection(positionData.dir);
            if(positionData.aimDir != undefined)  entity.position.setAimDirection(positionData.aimDir);
            

            const inputHandlerData = <IInputHandlerData>data.components['InputHandler'];
            const inputHandler = entity.getComponent(InputHandler);
            if(inputHandlerData.h != undefined) inputHandler.horizontal = inputHandlerData.h;
            if(inputHandlerData.v != undefined) inputHandler.vertical = inputHandlerData.v;

            
            if(data.components['PlayerBehaviour']) {
      
                entity.getComponent(PlayerBehaviour).fromData(data.components['PlayerBehaviour'])
            }

            entity.position.lastReceivedNetworkData = Date.now();
        }

        if(packet.type == PacketType.ENTER_VEHICLE) {
            const data: IPacketData_Id = packet.data;

            if(data.id == '') {
                this.beginControllEntity(this._player!);

                return;
            }

            const vehicle = this._world!.getEntity(data.id);

            this.beginControllEntity(vehicle);
        }

        if(packet.type == PacketType.SET_SERVER_PACKET_SEND_DELAY) {
            const data: IPacketData_SetServerPacketSendDelay = packet.data;

            this._sendPacketDelay = data.delay;
        }
    }

    public connectToServer(id: string) {
        const server = this._game.getServer(id);
        const data: IPacketData_ConnectToServerStatus = {
            serverId: server.id,
            success: false
        } 

        const self = this;
        const sendData = () => this.send(PacketType.CONNECT_TO_SERVER_STATUS, data);

        if(this._server != undefined) {
            data.errorMessage = `Already connected to a server`;
            sendData();
            return;
        }

        server.handleClientConnection(this, (success) => {
            if(success) {
                data.success = true;
                
                this._server = server;
                this._world = this.entity.world;
            }

            sendData();
        });
    }

    public beginControllEntity(entity: Entity) {
        if(this._player == undefined) this._player = entity as EntityPlayer;

        if(this.entity) {

            const inputHandler = this.entity.getComponent(InputHandler);
            inputHandler.horizontal = 0;
            inputHandler.vertical = 0;

            this.entity.position.canLerp = false;
            this._entity = undefined;
        }

        const data: IPacketData_Id = {
            id: entity.id
        }

        this._entity = entity;
        entity.position.canLerp = true;

        this.send(PacketType.CONTROLL_ENTITY, data);
    }
    
    public send(packetType: PacketType, data?: any) {
        this._packetSender.send(packetType, data);
    }

    public onConnect() {
        console.log("conn")
    }

    public onDisconnect() {
        console.log("descc")

        if(this._server) this._server.handleClientDisconnect(this);
    }
}