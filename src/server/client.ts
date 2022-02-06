import socketio from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Entity } from '../shared/entity/entity';
import { MasterServer } from './masterServer';
import { Server } from './server';
import { Gamelog } from './gamelog';
import { IPacketData_ComponentEvent, IPacketData_ControlEntity, IPacketData_DestroyEntity, IPacketData_EntityData, IPacketData_JoinServer, IPacketData_SpawnEntity, Packet, PacketType } from '../shared/packet';

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

    public checkStreamedEntities() {
        
    }

    public update(dt: number) {
        this.checkStreamedEntities();
    }

    /*
    private sendStreamedEntitiesData() {
        for (const entity of this._streamedEntities) {
            this.sendEntityData(entity);
        }
    }
    */

    public sendPacket<T>(type: PacketType, packetData: T) {
        const packet: Packet = {
            type: type,
            data: packetData
        }
        this._socket?.emit('p', packet);
    }


    public sendEntityData(entity: Entity, data: any) {

        this.sendPacket<IPacketData_EntityData>(PacketType.ENTITY_DATA, {id: entity.id, data: data});

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
        /*
        this.sendPacket<IPacketData_SpawnEntity>(PacketType.SPAWN_ENTITY, {
            id: entity.id,
            type: entity.world.game.entityFactory.getIndexOfEntity(entity),
            data: entity.data.getData()
        });
        */
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