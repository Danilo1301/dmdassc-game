import { BasicMovement } from "@game/entity/components/BasicMovement";
import { InputHandler } from "@game/entity/components/InputHandler";
import { GameClient } from "@game/game/GameClient";
import { SceneManager } from "@game/sceneManager/SceneManager";
import { GameScene } from "@game/scenes/GameScene";
import { ServerListScene } from "@game/scenes/ServerListScene";
import { io, Socket } from "socket.io-client";
import { LocalPlayer } from "./LocalPlayer";
import { IPacket, IPacketData_ConnectToServerStatus, IPacketData_EntityData, IPacketData_Id, IPacketData_ServerList, IPacketData_SetServerPacketSendDelay, PacketType } from "./Packet";
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
    }

    public get connected() { return this._socket.connected; }

    public update(delta: number) {
        const entity = LocalPlayer.entity;

        if(!entity) return;

        const components = {};
        
        const now = Date.now();
        if(now - this._lastSentPackets <= this._sendPacketDelay) return
        this._lastSentPackets = now;

        for (const component of entity.components) {
            const data = component.toData();

            if(!data) continue;

            if(component.name == "Position" ||
                component.name == "InputHandler" ||
                component.name == "PlayerBehaviour"
            ) components[component.name] = data;

        }

        const data: IPacketData_EntityData = {
            entityId: entity.id,
            entityType: entity.constructor.name,
            components: components
        }

        //console.log(data)

        this.send(PacketType.ENTITY_DATA, data);

        const byteSize = str => new Blob([str]).size;
        const result = byteSize(JSON.stringify(data));
        this._bytesSent += result;
    }

    private onReceivePacket(packet: IPacket) {
        const byteSize = str => new Blob([str]).size;
        const result = byteSize(JSON.stringify(packet));
        this._bytesReceived += result;

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

            try {
                const world = this._game.servers[0].worlds[0];
                LocalPlayer.beginControllEntity(world.getEntity(data.id));
            } catch (error) {
                
            }
          

        }

        if(packet.type == PacketType.ENTITY_DATA) {
            const data: IPacketData_EntityData = packet.data;
            const world = this._game.servers[0].worlds[0];

            let newEntity = false;

            if(!world.hasEntity(data.entityId)) {
                const entity = world.createEntity(data.entityType, {id: data.entityId});
                world.addEntity(entity);

                newEntity = true;
            }

            const entity = world.getEntity(data.entityId);

            if(data.entityId == LocalPlayer.entityId) {

                if(!LocalPlayer.entity) {
                    LocalPlayer.beginControllEntity(entity);
                }

                return;
            }

            entity.position.lastReceivedNetworkData = Date.now();

            
            for (const component of entity.components) {
                if(!data.components[component.name]) continue;

                component.fromData(data.components[component.name]);
            }

            if(newEntity) {
                entity.position.canLerp = true;
                entity.position.lerpAmount = 0.2;
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

    public setSendPacketDelay(client: number, server: number) {
        this._sendPacketDelay = client;

        const data: IPacketData_SetServerPacketSendDelay = {delay: server};
        this.send(PacketType.SET_SERVER_PACKET_SEND_DELAY, data);
    }   
}