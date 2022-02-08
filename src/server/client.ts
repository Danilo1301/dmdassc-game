import socketio from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Entity } from '../shared/entity/entity';
import { MasterServer } from './masterServer';
import { Server } from './server';
import { Gamelog } from './gamelog';
import { IPacketData_ComponentEvent, IPacketData_ControlEntity, IPacketData_DestroyEntity, IPacketData_EntityData, IPacketData_InputData, IPacketData_JoinServer, IPacketData_SpawnEntity, Packet, PacketType } from '../shared/packet';
import { InputHandlerComponent } from '../shared/component/inputHandlerComponent';
import { SyncComponent } from '../shared/component/syncComponent';

export class Client {
    public get id() { return this._id; }
    public get addressList() { return this._addressList; }
    public get player() { return this._player; }
    public get socket() { return this._socket!; }

    private _id: string = uuidv4();

    private _socket?: socketio.Socket;

    private _player?: Entity;
    private _server?: Server;

    private _addressList: string[] = [];

    private _streamedEntities: Entity[] = [];

    public getCurrentAddress() {
        const f = this._socket?.handshake.headers["x-forwarded-for"]
        if(typeof f == 'object') return f[0];
        if(!f) return this._socket?.handshake.address || ""
        return f;
    }

    public setPlayer(player: Entity) {
        this._player = player;
        this.sendControllingEntity(player);
    }

    public resetClient() {
        this._streamedEntities = []
    }

    public setSocket(socket: socketio.Socket) {
        this._socket = socket;

        socket.on("p", (packet: Packet) => {
            this.onReceivePacket(packet);
        })
        socket.on("disconnect", this.onDisconnect.bind(this))
        
        this.resetClient();
        this.addIPAddress(socket.handshake.address)
        this.onConnect();
    }

    private addIPAddress(address: string) {
        if(!this._addressList.includes(address)) {
        this._addressList.push(address);
            if(this._addressList.length >= 2) this._addressList.splice(0, 1)
        }
    }

    private onConnect() {
        Gamelog.log(this.getCurrentAddress(), `${this.id} connected`);

    }

    private onDisconnect() {
        Gamelog.log(this.getCurrentAddress(), `${this.id} disconnected`);

        const server = this._server;

        if(server) {
            server.onClientLeave(this);
        }

        //MasterServer.postGameLog(this.getCurrentAddress(), "disconnected")
    }

    public sendControllingEntity(entity: Entity) {
        this.sendPacket<IPacketData_ControlEntity>(PacketType.CONTROL_ENTITY, {id: entity.id});
    }

    public onReceivePacket(packet: Packet) {
        if(packet.type == PacketType.JOIN_SERVER) {
            const packetData: IPacketData_JoinServer = packet.data;
            const id = packetData.id;
            
            console.log("join", id)

            const server = MasterServer.Instance.servers[0];
            this._server = server;

            server.onClientJoin(this);
        }

        if(packet.type == PacketType.INPUT_DATA) {
            const packetData: IPacketData_InputData = packet.data;

            const player = this.player;

            if(player) {
                
                const inputHandlerComponent = player.getComponent(InputHandlerComponent);

                if(inputHandlerComponent) {
                    if(packetData.d.h != undefined) inputHandlerComponent.horizontal = packetData.d.h;
                    if(packetData.d.v != undefined) inputHandlerComponent.vertical = packetData.d.v;
                }

                const currentPos = player.transform.getPosition();

                const newPosition = {
                    x: packetData.d.x != undefined ? packetData.d.x : currentPos.x,
                    y: packetData.d.y != undefined ? packetData.d.y : currentPos.y
                }

                const aimAngle = packetData.d.aa != undefined ? packetData.d.aa : player.transform.getAimAngle();
                
                player.getComponent(SyncComponent)!.setPosition(newPosition.x, newPosition.y);
                player.getComponent(SyncComponent)!.setAimAngle(aimAngle);




                /*
                
                player.transform.setAimAngle(aimAngle)
                */
            }
            //console.log(packet)

        }


        /*

        if(packet.type == PacketType.ENTITY_DATA) {
            const packetData: IPacketData_EntityData = packet.data;
            const entityId = packetData.id;

            if(!packetData.data) return;

            
            const player = this._player;

            if(!player) return;
            if(player.id != entityId) {
                console.log("not same id");
                return;
            }

            const data: any = {};

            if(packetData.data.angle != undefined) data.angle = packetData.data.angle;
            if(packetData.data.position != undefined) data.position = packetData.data.position;
            if(packetData.data.input != undefined) data.input = packetData.data.input;

            //sdconsole.log(data)

  

        }

        if(packet.type == PacketType.COMPONENT_EVENT) {
            const packetData: IPacketData_ComponentEvent = packet.data;

            console.log(packetData)

            const world = this.player!.world;
            const entity = world.getEntity(packetData.entity)!;

            const component = entity.getComponent(world.game.entityFactory.getComponentByIndex(packetData.component));
            //console.log(component)

            component.onReceiveComponentEvent(packetData.event, packetData.data, this);

        }
        */

        /*
        const packetType: PacketType = packet.readShort();
    
        if(packetType == PacketType.ENTITY_DATA) {
            const entityId = packet.readString();
            
            if(this._player) {
                if(this._player.id == entityId) {

                    FormatPacket.unserializeEntityData(this._player, packet);

                } else {
                    console.log("not same id");
                }
            }

        }

        
        */
    }

    public isEntityStreamed(entity: Entity) {
        return this._streamedEntities.includes(entity);
    }

    private _entityDataToSend: any[] = [];
    private _entityToSend: Entity[] = []
    private _lastSentEntityData = new Map<string, number>();

    public trySendEntityData(entity: Entity, data: any) {
        //console.log(`added data from ${entity.id} to list`)

        const instaSend = true;

        if(!this._entityToSend.includes(entity)) {
            this._entityToSend.push(entity);
            this._entityDataToSend.push(data);
        } else {
            const index = this._entityToSend.indexOf(entity);

            this._entityDataToSend[index] = Object.assign(this._entityDataToSend[index], data);

            //console.log("data merged")
        }
    }

    public checkStreamedEntities() {
        const player = this._player;

        if(!player) return;

        const playerPosition = player.transform.getPosition();

        const world = player.world;

        for (const entity of world.entities) {

            if(!entity.canSync) continue;
            
            const distance: number = playerPosition.distance(entity.transform.getPosition());

            let canBeStreamed = false;
            if(distance < 1000) canBeStreamed = true;

            if(canBeStreamed) {
                if(!this._streamedEntities.includes(entity)) {
                    console.log(`[client] entity stream in ${entity.id}`);
    
                    this._streamedEntities.push(entity);
    
                    this.sendEntitySpawn(entity);
                }
            } else {
                if(this._streamedEntities.includes(entity)) {
                    console.log(`[client] entity stream out ${entity.id}`);
    
                    this._streamedEntities.splice(this._streamedEntities.indexOf(entity), 1);
    
                    this.sendEntityDestroy(entity);
                }
            }
            

        }
    }

    public update(dt: number) {
        this.checkStreamedEntities();

        for (const entity of this._entityToSend) {
            
            const index = this._entityToSend.indexOf(entity);
            const data = this._entityDataToSend[index];
            
            const lastSentData = this._lastSentEntityData.has(entity.id) ? this._lastSentEntityData.get(entity.id)! : 0;
            
            //console.log(Date.now() - lastSentData   )
            
            let distance = this.player ? this.player.transform.getPosition().distance(entity.transform.getPosition()) : 0;

            distance = Math.max(100, distance * 0.3);

            if(Date.now() - lastSentData <= distance) continue;
            
            //console.log(`actually sending data from ${entity.id}`)

            this.sendPacket<IPacketData_EntityData>(PacketType.ENTITY_DATA, {
                id: entity.id,
                d: data
            });

            this._entityToSend.splice(index, 1);
            this._entityDataToSend.splice(index, 1);

            this._lastSentEntityData.set(entity.id, Date.now());

        }
    }

    /*
    private sendStreamedEntitiesData() {
        for (const entity of this._streamedEntities) {
            this.sendEntityData(entity);
        }
    }
    */

    public sendPacket<T>(type: PacketType, packetData: T) {
        this._socket?.emit('p', type, packetData);
    }


    public sendEntityData(entity: Entity, data: any) {

        this.sendPacket<IPacketData_EntityData>(PacketType.ENTITY_DATA, {id: entity.id, d: data});

        /*
        const components: Component[] = [];
        for (const c of entity.components) {
            try {
                entity.world.game.entityFactory.getIndexOfComponent(c);
                components.push(c);
            } catch (error) { }
        }

        const packet = FormatPacket.entityData(entity, components);
        this.sendPacket(packet);
        */
    }

    public sendEntitySpawn(entity: Entity) {
        //console.log('entity:',entity.getIndex())
        
        //console.log(entity.constructor.name, entity.getIndex())

        this.sendPacket<IPacketData_SpawnEntity>(PacketType.SPAWN_ENTITY, {
            id: entity.id,
            type: entity.getIndex(),
            data: entity.getFullData()
        });
    }

    public sendEntityDestroy(entity: Entity) {
        this.sendPacket<IPacketData_DestroyEntity>(PacketType.DESTROY_ENTITY, {
            id: entity.id,
        });

        /*
        const packet = FormatPacket.entityDestroy(entity);
        this.sendPacket(packet);
        */
    }
}