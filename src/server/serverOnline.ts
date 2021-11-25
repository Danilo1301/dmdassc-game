import { Client } from "../client/client";
import { PositionComponent } from "../component/positionComponent";
import { EntityBuilding } from "../entity/entityBuilding";
import { Network } from "../network/network";
import { IPacket_ControlEntity, PACKET_TYPE } from "../packet/packets";
import { Server } from "./server";

export class ServerOnline extends Server {
    public sendPacketsInterval: number = 80;
    
    private _clients = new Map<string, Client>();
    private _sendPacketsTime: number = 0;

    public handleClientConnection(client: Client) {
        console.log("new client", client.id);

        this._clients.set(client.id, client);

        client.server = this;
        client.player = this.worlds[0].spawnPlayer();

        const packetData: IPacket_ControlEntity = {
            id: client.player.id
        }
        client.send(PACKET_TYPE.CONTROL_ENTITY, packetData);
    }

    public update(dt: number) {
        super.update(dt);

        const world = this.worlds[0];

        this._sendPacketsTime += dt;
        if(this._sendPacketsTime > this.sendPacketsInterval / 1000) {
            this._sendPacketsTime = 0;

            const clients = Array.from(this._clients.values());

            if(clients.length == 0) return;

            for (const entity of world.entities) {
                if(entity instanceof EntityBuilding) continue;

                //console.log(entity.constructor.name)

                const packet = Network.serializeEntity(entity);
                
                //console.log(entity.getComponent(PositionComponent).x, entity.getComponent(PositionComponent).y)
                
                clients.map(client => {
                    client.send(PACKET_TYPE.ENTITY_DATA, packet);
                })
            }
        }
       

    }
}