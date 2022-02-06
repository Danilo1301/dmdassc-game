
import { io, Socket } from "socket.io-client";
import { Entity } from "../shared/entity/entity";
import { Gameface } from "./gameface";
import { IPacketData_ComponentEvent, IPacketData_ControlEntity, IPacketData_DestroyEntity, IPacketData_EntityData, IPacketData_JoinServer, IPacketData_SpawnEntity, Packet, PacketType } from "../shared/packet";
import { EntityChar } from "../shared/entity/entityChar";
import { ITransformComponent_Data } from "../shared/component/transformComponent";



export class Network {
    public sendPacketInterval: number = 80;

    private _socket: Socket;
    private _sendPacketTime: number = 0;

    public get address() {
        if(location.host.includes('localhost')) return `${location.protocol}//${location.host}/`;
        return `https://dmdassc-game.glitch.me/`;
    }

    public init() {
        this._socket = io(this.address, {
            //path: '/socket',
            autoConnect: false,
            reconnection: false
        });

        this._socket.on("p", (packetType: PacketType, data: any) => {
            const packet: Packet = {
                type: packetType,
                data: data
            }

            this.onReceivePacket(packet);
        })

        console.log(`[network] Address: (${this.address})`)
    }

    public connect() {
        this._socket.connect();
    }

    public sendJoinServer(id: string) {
        this.sendPacket<IPacketData_JoinServer>(PacketType.JOIN_SERVER, {id: id});
    }

    public update(dt: number) {
        this._sendPacketTime += dt;
        if(this._sendPacketTime >= this.sendPacketInterval / 1000) {
            this._sendPacketTime = 0;

            const player = Gameface.Instance.player;
            if(player) this.sendPlayerData(player);
        }
    }

    public sendPlayerData(entity: Entity) {

        //const data = entity.data.getChangedData();

        //console.log(data)

        //entity.data.clearChangedData();

        //this.sendPacket<IPacketData_EntityData>(PacketType.ENTITY_DATA, {id: entity.id, data: data})

        /*
        const components: Component[] = [entity.transform];
        if(entity.hasComponent(InputHandlerComponent)) components.push(entity.getComponent(InputHandlerComponent));
        const packet = FormatPacket.entityData(entity, components);
        this.sendPacket(packet);
        */
    }

    public sendPacket<T>(type: PacketType, packetData: T) {
        const packet: Packet = {
            type: type,
            data: packetData
        }
        this._socket.emit('p', packet);
    }

    public onReceivePacket(packet: Packet) {
        if(packet.type == PacketType.ENTITY_DATA) {
            const packetData = packet.data;

            const id: string = packetData.id;

            //console.log(id);

            const world = Gameface.Instance.game.worlds[0];
            let entity = world.getEntity(id);
            
            if(!entity) {
                entity = new EntityChar(world);
                entity.setId(id);
                world.addEntity(entity);
            }
            
            const c = packetData.c;

            if(c == undefined) return;

            console.log(c)

            const data: ITransformComponent_Data = c["0"];

            Object.assign(entity.transform.data, data);

            //entity.transform.data = data;

            //console.log(entity.transform.getPosition())

            //console.log("got data");
            /*
            const packetData: IPacketData_SpawnEntity = packet.data;
            
            const world = Gameface.Instance.game.worlds[0];
            const entity = world.getEntity(packetData.id);

            if(!entity) return;

            entity.mergeEntityData(packetData.data);


            //console.log(packet)

            
            */
        }

        /*
        if(packet.type == PacketType.SPAWN_ENTITY) {
            const packetData: IPacketData_SpawnEntity = packet.data;
            
            const entityId = packetData.id;
            const entityType = packetData.type;


            const world = Gameface.Instance.game.worlds[0];

            if(world.hasEntity(entityId)) return;

            const entity = world.spawnEntity(world.game.entityFactory.getEntityByIndex(entityType), {id: entityId, dontAdd: true});
            const syncComponent = entity.addComponent(new SyncComponent());

            entity.initData()
            entity.mergeEntityData(packetData.data);

            world.addEntity(entity);

            syncComponent.forceLerp();

            //FormatPacket.unserializeEntityData(entity, packet);
            
            console.log("spsawn entity", packetData)
        }

        if(packet.type == PacketType.ENTITY_DATA) {
            const packetData: IPacketData_SpawnEntity = packet.data;
            
            const world = Gameface.Instance.game.worlds[0];
            const entity = world.getEntity(packetData.id);

            if(!entity) return;

            entity.mergeEntityData(packetData.data);


            //console.log(packet)

            //console.log("got data");
        }

        if(packet.type == PacketType.CONTROL_ENTITY) {
            const packetData: IPacketData_ControlEntity = packet.data;
            

            Gameface.Instance.controllingEntityId = packetData.id;
            Gameface.Instance.checkControllingEntity();
        }

        if(packet.type == PacketType.DESTROY_ENTITY) {
            const packetData: IPacketData_DestroyEntity = packet.data;
            const entityId = packetData.id;
            
            const world = Gameface.Instance.game.worlds[0];

            if(world.hasEntity(entityId)) {
                world.removeEntity(world.getEntity(entityId)!);
            }
        }

        if(packet.type == PacketType.COMPONENT_EVENT) {
            console.log("received component event packet")

            const packetData: IPacketData_ComponentEvent = packet.data;

            const player = Gameface.Instance.player!;

            const world = player.world;
            const entity = world.getEntity(packetData.entity)!;

            const component = entity.getComponent(world.game.entityFactory.getComponentByIndex(packetData.component));
            //console.log(component)

            component.onReceiveComponentEvent(packetData.event, packetData.data);

        }

        */
       
        //const packetType: PacketType = packet.readShort();
        
        /*
        if(packetType == PacketType.COMPONENT_DATA) {
            const entityId: string = packet.readString();
            const cindex: number = packet.readShort();

            const world = Gameface.Instance.game.worlds[0];

            if(world.hasEntity(entityId)) {
                const entity = world.getEntity(entityId)!;
                entity.components.forEach(c => {
                    try {
                        if(cindex == world.game.entityFactory.getIndexOfComponent(c)) {
                            c.unserialize(packet);
                        }
                    } catch (error) {}
                });
            }

        }
        */

        /*
        if(packetType == PacketType.ENTITY_DATA) {
            const entityId = packet.readString();

            const world = Gameface.Instance.game.worlds[0];
            const entity = world.getEntity(entityId);
            
            if(entity) {
                FormatPacket.unserializeEntityData(entity, packet);
            }
        }

        if(packetType == PacketType.SPAWN_ENTITY) {
            const entityId: string = packet.readString();
            const entityType: number = packet.readShort();
            
            const world = Gameface.Instance.game.worlds[0];

            if(world.hasEntity(entityId)) return;

            const entity = world.spawnEntity(world.game.entityFactory.getEntityByIndex(entityType), {id: entityId});
            entity.addComponent(new SyncComponent());

            FormatPacket.unserializeEntityData(entity, packet);
            
            console.log("spsawn entity")
        }

        if(packetType == PacketType.DESTROY_ENTITY) {
            const entityId: string = packet.readString();

            const world = Gameface.Instance.game.worlds[0];

            if(world.hasEntity(entityId)) {
                world.removeEntity(world.getEntity(entityId)!);
            }
        }

        
        */
    }
}