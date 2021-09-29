import { BasicMovement } from "@game/entity/components/BasicMovement";
import { InputHandler } from "@game/entity/components/InputHandler";
import { GameClient } from "@game/game/GameClient";
import { SceneManager } from "@game/sceneManager/SceneManager";
import { GameScene } from "@game/scenes/GameScene";
import { ServerListScene } from "@game/scenes/ServerListScene";
import { io, Socket } from "socket.io-client";
import { LocalPlayer } from "./LocalPlayer";
import { IPacket, IPacketData_ConnectToServerStatus, IPacketData_EntityData, IPacketData_Id, IPacketData_ServerList, PacketType } from "./Packet";
import { PacketSender } from "./PacketSender";

export class Network {
    
    public receivePacketEvents = new Phaser.Events.EventEmitter();

    private _game: GameClient;
    private _socket: Socket;
    private _packetSender: PacketSender;

    constructor(game: GameClient) {
        this._game = game;

        const address = `${location.protocol}//${location.host}/api/game`;
        const socket = this._socket = io(address, {
            path: '/socket',
            autoConnect: false,
            reconnection: false
        });

        this._packetSender = new PacketSender(socket);
        this._packetSender.receivePacketEvents.on('packet', (packet: IPacket) => this.onReceivePacket(packet));

        setInterval(() => this.update(100), 100);
    }

    public get connected() { return this._socket.connected; }

    public update(delta: number) {
        const entity = LocalPlayer.entity;

        if(!entity) return;

        const components = {};
        
        for (const component of entity.components) {
            const data = component.toData();

            if(!data) continue;
            if(component.name == "Position" || component.name == "InputHandler") {
                components[component.name] = data;
            }

        }

        const data: IPacketData_EntityData = {
            entityId: entity.id,
            entityType: entity.constructor.name,
            components: components
        }

        //console.log(data)

        this.send(PacketType.ENTITY_DATA, data);
    }

    private onReceivePacket(packet: IPacket) {
        if(packet.type == PacketType.SERVER_LIST) {
            const data: IPacketData_ServerList = packet.data;
            ServerListScene.Instance.updateServersList(data.servers);
        }

        if(packet.type == PacketType.CONNECT_TO_SERVER_STATUS) {
            const data: IPacketData_ConnectToServerStatus = packet.data;
           
            if(data.success) {
                SceneManager.startScene('GameScene', GameScene);
            }
        }

        if(packet.type == PacketType.CONTROLL_ENTITY) {
            const data: IPacketData_Id = packet.data;
  
            LocalPlayer.setControllingEntityId(data.id);
        }

        if(packet.type == PacketType.ENTITY_DATA) {
            const data: IPacketData_EntityData = packet.data;
            const world = this._game.servers[0].worlds[0];

            if(!world.hasEntity(data.entityId)) {
                const entity = world.createEntity(data.entityType, {id: data.entityId});
                world.addEntity(entity);

                entity.position.canLerp = true;
                entity.position.lerpAmount = 0.2;
            }

            const entity = world.getEntity(data.entityId);

            if(data.entityId == LocalPlayer.entityId) {

                if(!LocalPlayer.entity) {
                    LocalPlayer.beginControllEntity(entity);
                }

                return;
            }

            
            for (const component of entity.components) {
                if(!data.components[component.name]) continue;

                component.fromData(data.components[component.name]);
            }

            //entity.position.set(data.x, data.y);
        }
    }

    public connect(callback?: () => void) {
        this._socket.connect();
        this._socket.once('connect', () => {
            callback?.();
        });
    }

    public send(packetType: PacketType, data?: any) {
        this._packetSender.send(packetType, data);
    }
}