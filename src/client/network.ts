
import { io, Socket } from "socket.io-client";
import { Entity } from "../shared/entity/entity";
import { Gameface } from "./gameface";
import { IPacketData_ComponentEvent, IPacketData_ControlEntity, IPacketData_DestroyEntity, IPacketData_EntityData, IPacketData_InputData, IPacketData_JoinServer, IPacketData_SpawnEntity, Packet, PacketType } from "../shared/packet";
import { EntityChar } from "../shared/entity/entityChar";
import { ITransformComponent_Data } from "../shared/component/transformComponent";
import { SyncComponent } from "../shared/component/syncComponent";
import { Input, InputData } from "../shared/input";



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

        Input.events.on("changed", (changed: InputData) => {
            if(changed == undefined) return;

            this.sendPacket<IPacketData_InputData>(PacketType.INPUT_DATA, {d: changed});
        });

        console.log(`[network] Address: (${this.address})`);
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

        const position = entity.transform.getPosition();
        
        this.sendPacket<IPacketData_InputData>(PacketType.INPUT_DATA, {d: {
            x: position.x,
            y: position.y
        }});
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
            const packetData: IPacketData_EntityData = packet.data;

            const id: string = packetData.id;

            //console.log(id);

            const world = Gameface.Instance.game.worlds[0];
            let entity = world.getEntity(id);
            
            if(entity) {
                entity.mergeData(packetData.d);
            } else {
                
                console.log("no entity")
            }

            /*
            if(!entity) {
                entity = new EntityChar(world);
                entity.setId(id);
                entity.addComponent(new SyncComponent());
                world.addEntity(entity);
            }
            */
            
            
        }

        if(packet.type == PacketType.SPAWN_ENTITY) {
            const packetData: IPacketData_SpawnEntity = packet.data;
            
            console.log("spawn entity", JSON.stringify(packetData))

            const entityId = packetData.id;
            const entityType = packetData.type;


            const world = Gameface.Instance.game.worlds[0];

            let entity = world.getEntity(entityId);

            if(entity) return;

            const c = world.game.entityFactory.getEntityByIndex(entityType);
            
            entity = new c(world);
            entity.setId(entityId);
        
            const syncComponent = entity.addComponent(new SyncComponent());

            entity.initData()
            entity.mergeData(packetData.data);

            world.addEntity(entity);

            syncComponent.forceLerp();
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

            const entity = world.getEntity(entityId);

            if(entity) {
                console.warn("remove entity")
                world.removeEntity(entity);

                console.log(entity)
            }
        }

        if(packet.type == PacketType.COMPONENT_EVENT) {
            console.log("received component event packet")

            const packetData: IPacketData_ComponentEvent = packet.data;

            const player = Gameface.Instance.player;

            if(!player) return;

            const world = player.world;
            const entity = world.getEntity(packetData.entity);

            if(!entity) {
                console.log("no entity")
                return;
            }

            const component = entity.getComponent(world.game.entityFactory.getComponentByIndex(packetData.component));
            //console.log(component)

            component?.onReceiveComponentEvent(packetData.event, packetData.data);

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