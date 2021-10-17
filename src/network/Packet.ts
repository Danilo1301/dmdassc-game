import { ServerInfo } from "@game/scenes/ServerListScene";

export enum PacketType {
    REQUEST_SERVER_LIST,
    SERVER_LIST,
    CONNECT_TO_SERVER,
    CONNECT_TO_SERVER_STATUS,
    ENTITY_DATA,
    CONTROLL_ENTITY,
    ENTER_VEHICLE,
    SET_SERVER_PACKET_SEND_DELAY,
    INPUT_DATA,
    WEAPON_SHOT,
    COMPONENT_EVENT
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
    entityData?: any
}

export interface IPacketData_InputData {
    horizontal?: number
    vertical?: number
    direction?: number
    x?: number
    y?: number
    mouse1?: boolean
}

export interface IPacketData_SetServerPacketSendDelay {
    delay: number
}

export interface IPacketData_WeaponShot {
    entityHit?: string
}

export interface IPacketData_ComponentEvent {
    entityId: string
    componentName: string
    eventName: string
    data: any
}