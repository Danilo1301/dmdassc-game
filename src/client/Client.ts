import { GameServer } from '@game/game/GameServer';
import { IPacket, IPacketData_ComponentEvent, IPacketData_ConnectToServer, IPacketData_ConnectToServerStatus, IPacketData_EntityData, IPacketData_Id, IPacketData_InputData, IPacketData_ServerList, IPacketData_SetServerPacketSendDelay, IPacketData_WeaponShot, PacketType } from '@game/network/Packet';
import { PacketSender } from '@game/network/PacketSender';
import { v4 as uuidv4 } from 'uuid';
import { Entity } from '@game/entity/Entity';
import { ServerInfo } from '@game/scenes/ServerListScene';
import { Server } from '@game/server/Server';
import { World } from '@game/world/World';
import socketio from 'socket.io';
import { EntityPlayer } from '@game/entity/EntityPlayer';
import { EntityWatcher } from '@game/dataWatcher/EntityWatcher';
import { IWeaponShotData, WeaponComponent } from '@game/entity/component/WeaponComponent';

export class Client {

    private _id: string;
    private _game: GameServer;
    private _socket: socketio.Socket;
    private _packetSender: PacketSender;
    //private _entityWatcher: EntityWatcher;
    private _server?: Server;
    private _world?: World;
    //private _entitiesSyncTime = new Phaser.Structs.Map<string, number>([]);
    
    private _player?: EntityPlayer;

    private _sendPacketsDelay: number = 30;
    private _lastSentPackets: number = 0;

    private _entities = new Phaser.Structs.Map<string, EntityWatcher>([]);

    constructor(game: GameServer, socket: socketio.Socket) {
        this._id = uuidv4();
        this._game = game;
        this._socket = socket;
        this._packetSender = new PacketSender(socket);
        this._packetSender.receivePacketEvents.on('packet', (packet: IPacket) => this.onReceivePacket(packet));
        //this._entityWatcher = new EntityWatcher();

        setInterval(() => this.update(1), 1);

        this._socket.on('disconnect', () => this.onDisconnect());
        this.onConnect();
    }

    public get id() { return this._id; }
    public get connected() { return this._socket.connected; }
    
    public get player() { return this._player!; }

    public setPlayer(player: EntityPlayer) {
        this._player = player;

        const data: IPacketData_Id = {
            id: player.id,
        }

        this.send(PacketType.CONTROLL_ENTITY, data);


    }

    public update(delta: number) {
        if(!this.connected) return;

        const world = this._world;

        if(!world) return;

        const now = Date.now();

        if(now - this._lastSentPackets >= this._sendPacketsDelay) {
            this._lastSentPackets = now;

            for (const entity of world.entities) {
            
                if(entity.dontSync) continue;

                if(!this._entities.has(entity.id)) {
                    this._entities.set(entity.id, new EntityWatcher(entity));

                    //X
                    entity.events.on('component_event', (a, b, c) => {

                        const data: IPacketData_ComponentEvent = {
                            entityId: entity.id,
                            componentName: a,
                            eventName: b,
                            data: c
                        }
                
                        this.send(PacketType.COMPONENT_EVENT, data);
            
        
                    })
                }
    
                const entityWatcher = this._entities.get(entity.id);
                
                entityWatcher.process();
                const newData = entityWatcher.getNewData();
    
                if(newData) {
                    this.sendEntityData(entity, newData);
                }
            }
        }

        
    }

    private sendEntityData(entity: Entity, entityData: any) { 
        //console.log(entity.id, 'newData:', entityData);

        const data: IPacketData_EntityData = {
            entityId: entity.id,
            entityType: entity.name,
            entityData: entityData
        }

        this.send(PacketType.ENTITY_DATA, data);
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

        if(packet.type == PacketType.SET_SERVER_PACKET_SEND_DELAY) {
            const data: IPacketData_SetServerPacketSendDelay = packet.data;

            this._sendPacketsDelay = data.delay;
        }

        if(packet.type == PacketType.ENTITY_DATA) {
            const data: IPacketData_EntityData = packet.data;

     
            if(data.entityData) {
                const position = data.entityData.position;

                if(position) {
                    const newPosition = {x: this.player.position.x, y: this.player.position.y};

                    if(position.x != undefined) newPosition.x = position.x;
                    if(position.y != undefined) newPosition.y = position.y;
       
                    const distance = Phaser.Math.Distance.BetweenPoints(this.player.position, newPosition);
                    
                    if(distance < 10) this.player.setPosition(newPosition.x, newPosition.y);
                }

                const input = data.entityData.input;

                if(input) {
                    if(input.x != undefined) this.player.data.input.x = input.x;
                    if(input.y != undefined) this.player.data.input.y = input.y;
                    if(input.mouse1 != undefined) this.player.data.input.mouse1 = input.mouse1;
                }

                if(data.entityData.lookRotation) this.player.setLookRotation(data.entityData.lookRotation)
            }
        }

        if(packet.type == PacketType.WEAPON_SHOT) {
            const data: IWeaponShotData = packet.data;

            let entityHit: Entity | undefined;

            if(data.entityHit) entityHit = this.player.world.getEntity(data.entityHit)

            /*
                const pos1 = this.player.position;
                const pos2 = entity.position;

                const angle = Phaser.Math.Angle.BetweenPoints(pos1, pos2);

                this.player.setLookRotation(angle);
            */

            this.player.getComponent(WeaponComponent).shot(entityHit);

            /*

            if(data.entityHit) {
                const entity = this.player.world.getEntity(data.entityHit);

                console.log("shot with dir");

                const pos1 = this.player.position;
                const pos2 = entity.position;

                const angle = Phaser.Math.Angle.BetweenPoints(pos1, pos2);

                this.player.getComponent(TestWeaponComponent).shotWithDirection(angle);
            }

            */

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
                this._world = this.player.world;
            }

            sendData();
        });
    }

    public send(packetType: PacketType, data?: any) {

        setTimeout(() => {
            
            this._packetSender.send(packetType, data);
        }, 0);

   

    }

    public onConnect() {
        console.log(`[Client] Connect`)
    }

    public onDisconnect() {
        console.log(`[Client] Disconnect`)

        if(this._server) this._server.handleClientDisconnect(this);
    }
}