import { ServerInfo } from "@game/scenes/ServerListScene";

export enum PacketType {
    REQUEST_SERVER_LIST,
    SERVER_LIST,
    CONNECT_TO_SERVER,
    CONNECT_TO_SERVER_STATUS,
    ENTITY_DATA,
    CONTROLL_ENTITY,
    ENTER_VEHICLE
}

export interface IPacket {
    type: PacketType
    data?: any
}

export interface IPacketData_ServerList {
    servers: ServerInfo[]
}

export interface IPacketData_ConnectToServer {
    id: string
}

export interface IPacketData_Id {
    id: string
}

export interface IPacketData_ConnectToServerStatus {
    serverId: string
    success: boolean
    errorMessage?: string
}

export interface IPacketData_EntityData {
    entityId: string
    entityType: string
    components: {[component: string]: {[key: string]: any}}
}