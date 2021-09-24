import { ServerInfo } from "@game/scenes/ServerListScene";

export enum PacketType {
    REQUEST_SERVER_LIST,
    SERVER_LIST,
    CONNECT_TO_SERVER,
    CONNECT_TO_SERVER_STATUS,
    ENTITY_DATA
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

export interface IPacketData_ConnectToServerStatus {
    serverId: string
    success: boolean
    entityId?: string
    errorMessage?: string
}

export interface IPacketData_EntityData {
    entityId: string
    x: number
    y: number
}