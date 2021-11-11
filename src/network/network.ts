
import { EntitySyncComponent } from "@game/entity/component/EntitySyncComponent";
import { InputHandlerComponent } from "@game/entity/component/InputHandlerComponent";
import { Entity } from "@game/entity/Entity";
import { GameClient } from "@game/game/GameClient";
import { Input } from "@game/input/Input";
import { SceneManager } from "@game/sceneManager/SceneManager";
import { GameScene } from "@game/scenes/GameScene";
import { ServerListScene } from "@game/scenes/ServerListScene";
import { io, Socket } from "socket.io-client";
import { LocalPlayer } from "./LocalPlayer";
import { IPacket, IPacketData_ComponentEvent, IPacketData_ConnectToServerStatus, IPacketData_EntityData, IPacketData_Id, IPacketData_InputData, IPacketData_ServerList, IPacketData_SetServerPacketSendDelay, PacketType } from "./Packet";
import { PacketSender } from "./PacketSender";

export class Network {
    
    public receivePacketEvents = new Phaser.Events.EventEmitter();

    private _game: GameClient;
    private _socket: Socket;
    private _packetSender: PacketSender;

    private _bytesReceived: number = 0;
    private _bytesSent: number = 0;

    private _sendPacketDelay: number = 50;
    private _lastSentPackets: number = 0;

    private _hasInputChanged: boolean = false;

    constructor(game: GameClient) {
        this._game = game;

        //https://dmdassc-game.glitch.me/
        
        let address = `https://dmdassc-game.glitch.me/api/game`;
        
        if(location.host.includes('localhost')) address = `${location.protocol}//${location.host}/api/game`;

        console.log(`[Network] Address: (${address})`)

        const socket = this._socket = io(address, {
            path: '/socket',
            autoConnect: false,
            reconnection: false
        });

        this._packetSender = new PacketSender(socket);
        this._packetSender.receivePacketEvents.on('packet', (packet: IPacket) => this.onReceivePacket(packet));

        setInterval(() => this.update(0), 0);

        Input.events.on('input_changed', () => this._hasInputChanged = true);
    }

    public get connected() { return this._socket.connected; }

    public update(delta: number) {
        
   
    }

    private getDataSize(data: any) {
        const byteSize = str => new Blob([str]).size;
        const result = byteSize(JSON.stringify(data));
        return result;
    }

    private onReceivePacket(packet: IPacket) {
        this._bytesReceived += this.getDataSize(packet);

        if(packet.type == PacketType.SERVER_LIST) {
            const data: IPacketData_ServerList = packet.data;
            ServerListScene.Instance.updateServersList(data.servers);
        }

        if(packet.type == PacketType.CONNECT_TO_SERVER_STATUS) {
            const data: IPacketData_ConnectToServerStatus = packet.data;
           
            if(data.success) {
                SceneManager.startScene('GameScene', GameScene);
                GameScene.setupGame(false, true)
            }
        }

        if(packet.type == PacketType.ENTITY_DATA) {
            const data: IPacketData_EntityData = packet.data;
            const world = this._game.servers[0].worlds[0];

            let entity: Entity | undefined;
            let isNewEntity: boolean = false;

            if(!world.hasEntity(data.entityId)) {
                entity = world.createEntity(data.entityType, {id: data.entityId});
                isNewEntity = true;
            }

            if(!entity) entity = world.getEntity(data.entityId);

            if(data.entityData) entity.mergeData(data.entityData);

            if(isNewEntity) {
                entity.addComponent(new EntitySyncComponent());
                world.addEntity(entity);
            }

        }

        if(packet.type == PacketType.CONTROLL_ENTITY) {
            const data: IPacketData_Id = packet.data;

            LocalPlayer.entityId = data.id;
        }

        if(packet.type == PacketType.COMPONENT_EVENT) {
            const data: IPacketData_ComponentEvent = packet.data;
            const world = this._game.servers[0].worlds[0];

            const entity = world.getEntity(data.entityId);
            entity.events.emit('component_event', data.componentName, data.eventName, data.data)
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

    public setSendPacketDelay(client: number, server: number) {
        this._sendPacketDelay = client;

        const data: IPacketData_SetServerPacketSendDelay = {delay: server};
        this.send(PacketType.SET_SERVER_PACKET_SEND_DELAY, data);
    }   
}