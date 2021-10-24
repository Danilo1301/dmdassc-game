/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/client.ts":
/*!******************************!*\
  !*** ./src/client/client.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Client = void 0;
const packet_1 = __webpack_require__(/*! ../packet/packet */ "./src/packet/packet.ts");
class Client {
    constructor(game, id) {
        this._sendPacketsDelay = 10;
        this._lastSentPackets = 0;
        this._game = game;
        this._id = id;
        this.game.sendClientData(this.id, { from: "client" });
    }
    get game() { return this._game; }
    get id() { return this._id; }
    get player() { return this._player; }
    update(dt) {
        const now = Date.now();
        if (now - this._lastSentPackets >= this._sendPacketsDelay) {
            this._lastSentPackets = now;
        }
        for (const entity of this.game.world.entities) {
            const packetData = {
                entityId: entity.id,
                data: entity.toJSON()
            };
            this.send(packet_1.PacketType.ENTITY_DATA, packetData);
        }
    }
    onConnect() {
        const player = this._player = this.game.world.createPlayer();
        const data = {
            serverId: 'someid',
            entityId: player.id,
            success: false
        };
        this.send(packet_1.PacketType.CONNECT_TO_SERVER_STATUS, data);
    }
    onReceivePacket(packet) {
        var _a;
        if (packet.type == packet_1.PacketType.ENTITY_DATA) {
            const data = packet.data;
            (_a = this.player) === null || _a === void 0 ? void 0 : _a.fromJSON(data.data);
        }
    }
    send(type, data) {
        const packet = {
            type: type,
            data: data
        };
        this.game.sendClientData(this.id, packet);
    }
}
exports.Client = Client;


/***/ }),

/***/ "./src/entity/baseEntity.ts":
/*!**********************************!*\
  !*** ./src/entity/baseEntity.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseEntity = void 0;
const pc = __importStar(__webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs"));
const uuid_1 = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/index.js");
const Ammo = window['Ammo'];
class BaseEntity extends pc.Entity {
    constructor(name) {
        super(name);
        this._id = (0, uuid_1.v4)();
    }
    get id() { return this._id; }
    init() { }
    setId(id) {
        this._id = id;
    }
    toJSON() {
        const position = this.getPosition();
        const data = {
            x: position.x,
            y: position.y,
            z: position.z,
        };
        const s = this.script.get('movement');
        if (s) {
            data.inputH = s.horizontal;
            data.inputV = s.vertical;
        }
        return data;
    }
    fromJSON(data) {
        const hasEntitySync = this.script.has('entitySync');
        const targetPosition = hasEntitySync ? this.script.get('entitySync').getTargetPosition() : undefined;
        const newPosition = targetPosition ? targetPosition : this.getPosition();
        if (data.x !== undefined)
            newPosition.x = data.x;
        if (data.y !== undefined)
            newPosition.y = data.y;
        if (data.z !== undefined)
            newPosition.z = data.z;
        const s = this.script.get('movement');
        if (s) {
            if (data.inputH !== undefined)
                s.horizontal = data.inputH;
            if (data.inputV !== undefined)
                s.vertical = data.inputV;
            //if(data.inputH !== undefined || data.inputV !== undefined) console.log(data.inputH, data.inputV)
        }
        if (this.script.has('entitySync')) {
            const s = this.script.get('entitySync');
            s.setTargetPosition(newPosition);
        }
        else {
            this.teleport(newPosition);
        }
    }
    teleport(position) {
        this.rigidbody.teleport(position.x, position.y, position.z);
    }
    setVelocity(velocity) {
        this.rigidbody['body'].setLinearVelocity(new Ammo.btVector3(velocity.x, velocity.y, velocity.z));
    }
}
exports.BaseEntity = BaseEntity;


/***/ }),

/***/ "./src/entity/entityPlayer.ts":
/*!************************************!*\
  !*** ./src/entity/entityPlayer.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntityPlayer = void 0;
const pc = __importStar(__webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs"));
const world_1 = __webpack_require__(/*! ../world/world */ "./src/world/world.ts");
const baseEntity_1 = __webpack_require__(/*! ./baseEntity */ "./src/entity/baseEntity.ts");
class EntityPlayer extends baseEntity_1.BaseEntity {
    constructor(name) {
        super(name);
    }
    init() {
        super.init();
        this.addMovement();
        this.createBody();
    }
    addMovement() {
        const entity = this;
        let script = entity.findComponent('script');
        if (!script)
            script = entity.addComponent('script');
        script.create('movement');
    }
    setControllable() {
        var m = this.script.get('movement');
        m.controlledByPlayer = true;
    }
    createBody() {
        const s = 0.2;
        const size = new pc.Vec3(s, s, s);
        const entity = this;
        entity.setPosition(0, 2, 0);
        world_1.ShapeUtils.createRectangleAtEntity(entity, size, true, new pc.Color(1, 1, 1));
        //entity.rigidbody!['body'].setAngularFactor(0, 1, 0)
    }
}
exports.EntityPlayer = EntityPlayer;


/***/ }),

/***/ "./src/game/game.ts":
/*!**************************!*\
  !*** ./src/game/game.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Game = void 0;
const pc = __importStar(__webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs"));
const cameraFollow_1 = __webpack_require__(/*! ../scripts/cameraFollow */ "./src/scripts/cameraFollow.ts");
const entitySync_1 = __webpack_require__(/*! ../scripts/entitySync */ "./src/scripts/entitySync.ts");
const movement_1 = __webpack_require__(/*! ../scripts/movement */ "./src/scripts/movement.ts");
const world_1 = __webpack_require__(/*! ../world/world */ "./src/world/world.ts");
const gameClient_1 = __webpack_require__(/*! ./gameClient */ "./src/game/gameClient.ts");
class Game {
    constructor(canvas, isClient) {
        this._canvas = canvas;
        this._isServer = isClient !== true;
        this._world = new world_1.World(this);
        console.log(`[Game] constructor; isServer =`, this.isServer);
    }
    get isServer() { return this._isServer; }
    get app() { return this._app; }
    get world() { return this._world; }
    start() {
        this.setupApp();
        this.app.on('update', (dt) => this.update(dt));
        this.app.start();
        this.setupResize();
        this.setupLocalClientScene(!this.isServer);
        this.world.setupWorld();
    }
    update(dt) { }
    setupApp() {
        const canvas = this._canvas;
        const app = new pc.Application(canvas, {
            mouse: new pc.Mouse(canvas),
            touch: new pc.TouchDevice(canvas),
            keyboard: new pc.Keyboard(document.body)
        });
        this._app = app;
        pc.registerScript(cameraFollow_1.CameraFollow, 'cameraFollow', app);
        pc.registerScript(movement_1.Movement, 'movement', app);
        pc.registerScript(entitySync_1.EntitySync, 'entitySync', app);
    }
    setupResize() {
        this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        this.app.setCanvasResolution(pc.RESOLUTION_AUTO);
        window.addEventListener('resize', () => this.resize());
        this.resize();
    }
    setupLocalClientScene(isLocalClient) {
        const app = this.app;
        const camera = new pc.Entity('camera');
        camera.addComponent('camera', {
            clearColor: new pc.Color(0.1, 0.1, 0.1)
        });
        app.root.addChild(camera);
        camera.setPosition(0, 6, 0);
        camera.setEulerAngles(-90, 0, 0);
        camera.addComponent('script').create('cameraFollow');
        const light = new pc.Entity('light');
        light.addComponent('light');
        app.root.addChild(light);
        light.setEulerAngles(30, 0, 0);
        if (isLocalClient) {
            gameClient_1.GameClient.camera = camera;
        }
    }
    resize() {
        const canvas = this._canvas;
        this.app.resizeCanvas();
        canvas.style.width = "100%";
        canvas.style.height = "100%";
    }
}
exports.Game = Game;


/***/ }),

/***/ "./src/game/gameClient.ts":
/*!********************************!*\
  !*** ./src/game/gameClient.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameClient = void 0;
const network_1 = __webpack_require__(/*! ../network/network */ "./src/network/network.ts");
const game_1 = __webpack_require__(/*! ./game */ "./src/game/game.ts");
class GameClient extends game_1.Game {
    constructor(canvas) {
        super(canvas, true);
        this._network = new network_1.Network(this);
    }
    get network() { return this._network; }
    update(dt) {
        super.update(dt);
        this.network.update(dt);
    }
    start() {
        super.start();
        this.network.connect(() => {
            console.log(`[Network] Connected? ${this.network.connected}`);
        });
    }
    static cameraFollowEntity(p) {
        const scr = this.camera.findComponent('script').get('cameraFollow');
        scr.followEntity = p;
        scr.forceTeleport();
    }
}
exports.GameClient = GameClient;
GameClient.playerId = "";


/***/ }),

/***/ "./src/game/gameServer.ts":
/*!********************************!*\
  !*** ./src/game/gameServer.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameServer = void 0;
const client_1 = __webpack_require__(/*! ../client/client */ "./src/client/client.ts");
const game_1 = __webpack_require__(/*! ./game */ "./src/game/game.ts");
class GameServer extends game_1.Game {
    constructor(canvas) {
        super(canvas);
        this._clients = new Map();
        window['onSocketConnect'] = this.onSocketConnect.bind(this);
        window['onSocketDisconnect'] = this.onSocketDisconnect.bind(this);
        window['onReceiveSocketData'] = this.onReceiveSocketData.bind(this);
    }
    get clients() { return Array.from(this._clients.values()); }
    start() {
        super.start();
    }
    update(dt) {
        super.update(dt);
        this.clients.map(client => client.update(dt));
    }
    onSocketConnect(id) {
        console.log(`[GameServer] New socket connection ${id}`);
        const client = new client_1.Client(this, id);
        this._clients.set(client.id, client);
        client.onConnect();
    }
    onSocketDisconnect(id, reason) {
        console.log(`[GameServer] Socket disconnect ${id}: ${reason}`);
    }
    onReceiveSocketData(id, data) {
        const packet = JSON.parse(data);
        this._clients.get(id).onReceivePacket(packet);
    }
    sendClientData(id, data) {
        const str = typeof data == 'string' ? data : JSON.stringify(data);
        //console.log(`[GameServer] Sending to ${id}: ${str}`);
        window['sendClientData'](id, str);
    }
}
exports.GameServer = GameServer;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const Ammo = __webpack_require__(/*! ammo.js */ "./node_modules/ammo.js/ammo.js");
window['Ammo'] = Ammo;
const gameClient_1 = __webpack_require__(/*! ./game/gameClient */ "./src/game/gameClient.ts");
const gameServer_1 = __webpack_require__(/*! ./game/gameServer */ "./src/game/gameServer.ts");
const isServer = location.href.includes("#server");
if (isServer) {
    const server = new gameServer_1.GameServer(document.getElementById('game'));
    server.start();
    window['game'] = server;
}
else {
    const client = new gameClient_1.GameClient(document.getElementById('game'));
    client.start();
    window['game'] = client;
}


/***/ }),

/***/ "./src/network/network.ts":
/*!********************************!*\
  !*** ./src/network/network.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Network = void 0;
const socket_io_client_1 = __webpack_require__(/*! socket.io-client */ "./node_modules/socket.io-client/build/cjs/index.js");
const gameClient_1 = __webpack_require__(/*! ../game/gameClient */ "./src/game/gameClient.ts");
const packet_1 = __webpack_require__(/*! ../packet/packet */ "./src/packet/packet.ts");
const entitySync_1 = __webpack_require__(/*! ../scripts/entitySync */ "./src/scripts/entitySync.ts");
class Network {
    constructor(game) {
        this._sendPacketsDelay = 30;
        this._lastSentPackets = 0;
        this._game = game;
        //https://dmdassc-game.glitch.me/
        const address = `${location.protocol}//${location.host}/game`;
        this._socket = (0, socket_io_client_1.io)(address, {
            //path: '/socket',
            autoConnect: false,
            reconnection: false
        });
        this._socket.on('_data', (data) => {
            const packet = JSON.parse(data);
            this.onReceivePacket(packet);
            //console.log(`[Network] Received:`, data);
        });
        console.log(`[Network] Address: (${address})`);
    }
    get game() { return this._game; }
    get connected() { return this._socket.connected; }
    connect(callback) {
        console.log(`[Network] Connecting...`);
        this._socket.connect();
        this._socket.once('connect', () => {
            callback === null || callback === void 0 ? void 0 : callback();
        });
    }
    update(dt) {
        const world = this.game.world;
        const entity = gameClient_1.GameClient.player;
        if (!world)
            return;
        if (!entity)
            return;
        const now = Date.now();
        if (now - this._lastSentPackets >= this._sendPacketsDelay) {
            this._lastSentPackets = now;
            const packetData = {
                entityId: entity.id,
                data: entity.toJSON()
            };
            this.send(packet_1.PacketType.ENTITY_DATA, packetData);
        }
    }
    send(type, data) {
        const packet = {
            type: type,
            data: data
        };
        this._socket.emit('_data', JSON.stringify(packet));
    }
    onReceivePacket(packet) {
        if (packet.type == packet_1.PacketType.CONNECT_TO_SERVER_STATUS) {
            const data = packet.data;
            gameClient_1.GameClient.playerId = data.entityId;
            console.log(gameClient_1.GameClient.playerId);
        }
        if (packet.type == packet_1.PacketType.ENTITY_DATA) {
            const data = packet.data;
            const world = this._game.world;
            let isNewEntity = false;
            if (!world.hasEntity(data.entityId)) {
                world.createPlayer(undefined, data.entityId);
                isNewEntity = true;
                console.log('new entiy');
            }
            const entity = world.getEntity(data.entityId);
            entity.fromJSON(data.data);
            if (isNewEntity) {
                entity.script.create('entitySync');
            }
            if (entity.id == gameClient_1.GameClient.playerId) {
                if (!gameClient_1.GameClient.player) {
                    gameClient_1.GameClient.player = entity;
                    gameClient_1.GameClient.player.setControllable();
                    gameClient_1.GameClient.cameraFollowEntity(entity);
                    if (gameClient_1.GameClient.player.script.has(entitySync_1.EntitySync)) {
                        var a = gameClient_1.GameClient.player.script.get(entitySync_1.EntitySync);
                        a.enabled = false;
                    }
                }
            }
        }
    }
}
exports.Network = Network;


/***/ }),

/***/ "./src/packet/packet.ts":
/*!******************************!*\
  !*** ./src/packet/packet.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PacketType = void 0;
var PacketType;
(function (PacketType) {
    PacketType[PacketType["REQUEST_SERVER_LIST"] = 0] = "REQUEST_SERVER_LIST";
    PacketType[PacketType["SERVER_LIST"] = 1] = "SERVER_LIST";
    PacketType[PacketType["CONNECT_TO_SERVER"] = 2] = "CONNECT_TO_SERVER";
    PacketType[PacketType["CONNECT_TO_SERVER_STATUS"] = 3] = "CONNECT_TO_SERVER_STATUS";
    PacketType[PacketType["ENTITY_DATA"] = 4] = "ENTITY_DATA";
})(PacketType = exports.PacketType || (exports.PacketType = {}));


/***/ }),

/***/ "./src/scripts/cameraFollow.ts":
/*!*************************************!*\
  !*** ./src/scripts/cameraFollow.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CameraFollow = void 0;
const pc = __importStar(__webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs"));
class CameraFollow extends pc.ScriptType {
    constructor() {
        super(...arguments);
        this.height = 5;
        this.followEntity = null;
        this.lerp = 1;
    }
    initialize() {
        this.fire('initialize');
    }
    postInitialize() {
        this.fire('postInitialize');
    }
    forceTeleport() {
        if (this.followEntity)
            this.entity.setPosition(this.getTargetPosition());
    }
    getTargetPosition() {
        if (!this.followEntity)
            return pc.Vec3.ZERO;
        const followEntityPosition = this.followEntity.getPosition();
        const targetPosition = new pc.Vec3(followEntityPosition.x, followEntityPosition.y + this.height, followEntityPosition.z);
        return targetPosition;
    }
    update(dt) {
        this.fire('update', dt);
    }
    postUpdate(dt) {
        this.fire('postUpdate', dt);
        if (this.followEntity == null)
            return;
        const newPosition = new pc.Vec3().lerp(this.entity.getPosition(), this.getTargetPosition(), this.lerp);
        this.entity.setPosition(newPosition);
    }
    swap() {
        this.fire('swap');
    }
}
exports.CameraFollow = CameraFollow;
CameraFollow.attributes.add('height', { type: 'number', default: 5 });
CameraFollow.attributes.add('followEntity', { type: 'entity' });


/***/ }),

/***/ "./src/scripts/entitySync.ts":
/*!***********************************!*\
  !*** ./src/scripts/entitySync.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntitySync = void 0;
const pc = __importStar(__webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs"));
class EntitySync extends pc.ScriptType {
    constructor() {
        super(...arguments);
        this.positionLerp = 0.3;
    }
    initialize() {
        this.fire('initialize');
    }
    update(dt) {
        this.fire('update', dt);
        const targetPosition = this._targetPosition;
        if (!targetPosition)
            return;
        const position = this.entity.getPosition();
        const distance = targetPosition.distance(position);
        let positionLerp = this.positionLerp;
        if (distance < 0.1) {
            //positionLerp = 0.05
        }
        if (distance > 0.5) {
            positionLerp = 1;
        }
        //adjust lerp by delta movement
        const newPosition = new pc.Vec3(pc.math.lerp(position.x, targetPosition.x, positionLerp), pc.math.lerp(position.y, targetPosition.y, positionLerp), pc.math.lerp(position.z, targetPosition.z, positionLerp));
        this.entity.teleport(newPosition);
        let Ammo = window['Ammo'];
        this.entity.rigidbody['body'].setLinearVelocity(new Ammo.btVector3(0, 0, 0));
        if (distance < 0.01) {
            this.entity.teleport(targetPosition);
            this._targetPosition = undefined;
        }
    }
    getTargetPosition() {
        return this._targetPosition;
    }
    setTargetPosition(position) {
        this._targetPosition = position.clone();
    }
}
exports.EntitySync = EntitySync;


/***/ }),

/***/ "./src/scripts/movement.ts":
/*!*********************************!*\
  !*** ./src/scripts/movement.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Movement = void 0;
const pc = __importStar(__webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs"));
class Movement extends pc.ScriptType {
    constructor() {
        super(...arguments);
        this.force = new pc.Vec3();
        this.controlledByPlayer = false;
        this.horizontal = 0;
        this.vertical = 0;
    }
    initialize() {
        console.log("[MovementScript] initialize");
        this.fire('initialize');
        var textMeasure = new pc.Entity();
        textMeasure.name = "textMeasure";
        textMeasure.addComponent('element', {
            type: pc.ELEMENTTYPE_TEXT,
            width: 256,
            height: 256,
            fontSize: 24,
            rect: [0, 0, 1, 0.25],
        });
        textMeasure.element.text = 'helo=========================';
        this.entity.addChild(textMeasure);
    }
    update(dt) {
        this.fire('update', dt);
        let forceY = 0;
        if (this.controlledByPlayer) {
            this.horizontal = 0;
            this.vertical = 0;
            if (this.app.keyboard.isPressed(pc.KEY_LEFT))
                this.horizontal = -1;
            if (this.app.keyboard.isPressed(pc.KEY_RIGHT))
                this.horizontal += 1;
            if (this.app.keyboard.isPressed(pc.KEY_UP))
                this.vertical = -1;
            if (this.app.keyboard.isPressed(pc.KEY_DOWN))
                this.vertical += 1;
            if (this.app.keyboard.isPressed(pc.KEY_SPACE))
                forceY += 0.2;
        }
        //this.vertical = -0.5;
        const speed = 0.1;
        this.force.x = this.horizontal * speed;
        this.force.y = 0;
        this.force.z = this.vertical * speed;
        if (this.force.length()) {
            /*
            var rX = Math.cos(-Math.PI * 0.25);
            var rY = Math.sin(-Math.PI * 0.25);
            */
            var rX = Math.cos(0);
            var rY = Math.sin(0);
            this.force.set(this.force.x * rX - this.force.z * rY, 0, this.force.z * rX + this.force.x * rY);
            if (this.force.length() > speed) {
                this.force.normalize().mulScalar(speed);
            }
        }
        this.force.y = forceY;
        //this.force.y = this.entity.rigidbody!.linearVelocity.y;
        //this.entity.setVelocity(this.force)
        var relativePoint = new pc.Vec3(0, 0, 0);
        this.entity.rigidbody.applyImpulse(this.force, relativePoint);
        if (this.entity.getPosition().y < -5) {
            this.entity.teleport(new pc.Vec3(0, 3, 0));
            this.entity.setVelocity(pc.Vec3.ZERO);
        }
    }
    postUpdate(dt) {
        this.fire('postUpdate', dt);
        var start = new pc.Vec3(0, 1, 0);
        var end = this.entity.getPosition();
        this.app.drawLine(start, end, pc.Color.RED, true);
        //this.app.drawLine(start, end, pc.Color.RED, false);
    }
}
exports.Movement = Movement;


/***/ }),

/***/ "./src/world/world.ts":
/*!****************************!*\
  !*** ./src/world/world.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ShapeUtils = exports.World = void 0;
const pc = __importStar(__webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs"));
const entityPlayer_1 = __webpack_require__(/*! ../entity/entityPlayer */ "./src/entity/entityPlayer.ts");
class World {
    constructor(game) {
        this._entities = new Map();
        this._game = game;
    }
    get game() { return this._game; }
    ;
    get app() { return this._game.app; }
    ;
    get entities() { return Array.from(this._entities.values()); }
    setupWorld() {
        const floor = ShapeUtils.createRectangle(this.app, 'floor', new pc.Vec3(), new pc.Vec3(15, 1, 15), false, new pc.Color(0, 0.5, 0));
        if (this.game.isServer) {
            const p = this.createPlayer(new pc.Vec3());
            p.fromJSON({ inputH: 1 });
        }
    }
    getEntity(id) {
        return this._entities.get(id);
    }
    hasEntity(id) {
        return this._entities.has(id);
    }
    destroyEntity(id) {
        const entity = this._entities.get(id);
        this.app.root.removeChild(entity);
        this._entities.delete(id);
    }
    createPlayer(position, customId) {
        const entity = new entityPlayer_1.EntityPlayer('player');
        if (customId)
            entity.setId(customId);
        if (position === undefined)
            position = new pc.Vec3(Math.random() * 6 - 3, 1, Math.random() * 6 - 3);
        entity.init();
        entity.teleport(position);
        this.app.root.addChild(entity);
        this._entities.set(entity.id, entity);
        return entity;
    }
}
exports.World = World;
class ShapeUtils {
    static createRectangle(app, name, position, size, isDynamic, color) {
        const entity = new pc.Entity(name);
        entity.setPosition(position);
        this.createRectangleAtEntity(entity, size, isDynamic, color);
        app.root.addChild(entity);
        return entity;
    }
    static createRectangleAtEntity(entity, size, isDynamic, color) {
        entity.addComponent('rigidbody', {
            type: isDynamic ? 'dynamic' : 'static'
        });
        entity.addComponent('collision', {
            type: 'box',
            halfExtents: new pc.Vec3(size.x / 2, size.y / 2, size.z / 2)
        });
        const material = new pc.StandardMaterial();
        material.diffuse = color;
        material.update();
        const cube = new pc.Entity('cube');
        cube.addComponent("render", {
            material: material,
            type: "box"
        });
        cube.setLocalScale(size);
        entity.addChild(cube);
        return entity;
    }
}
exports.ShapeUtils = ShapeUtils;


/***/ }),

/***/ "./webpack/credits.js":
/*!****************************!*\
  !*** ./webpack/credits.js ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "?380e":
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?20fd":
/*!**********************!*\
  !*** path (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkdmdassc_game"] = self["webpackChunkdmdassc_game"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["vendors"], () => (__webpack_require__("./src/index.ts")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors"], () => (__webpack_require__("./webpack/credits.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL2NsaWVudC9jbGllbnQudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL2VudGl0eS9iYXNlRW50aXR5LnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9lbnRpdHkvZW50aXR5UGxheWVyLnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9nYW1lL2dhbWUudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL2dhbWUvZ2FtZUNsaWVudC50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvZ2FtZS9nYW1lU2VydmVyLnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvbmV0d29yay9uZXR3b3JrLnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9wYWNrZXQvcGFja2V0LnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9zY3JpcHRzL2NhbWVyYUZvbGxvdy50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvc2NyaXB0cy9lbnRpdHlTeW5jLnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9zY3JpcHRzL21vdmVtZW50LnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy93b3JsZC93b3JsZC50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvaWdub3JlZHxDOlxcVXNlcnNcXGRhbmlsXFxEZXNrdG9wXFxkbWRhc3NjLWdhbWVcXG5vZGVfbW9kdWxlc1xcYW1tby5qc3xmcyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvaWdub3JlZHxDOlxcVXNlcnNcXGRhbmlsXFxEZXNrdG9wXFxkbWRhc3NjLWdhbWVcXG5vZGVfbW9kdWxlc1xcYW1tby5qc3xwYXRoIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRW50aXR5UGxheWVyIH0gZnJvbSBcIi4uL2VudGl0eS9lbnRpdHlQbGF5ZXJcIjtcclxuaW1wb3J0IHsgR2FtZVNlcnZlciB9IGZyb20gXCIuLi9nYW1lL2dhbWVTZXJ2ZXJcIjtcclxuaW1wb3J0IHsgSVBhY2tldCwgSVBhY2tldERhdGFfQ29ubmVjdFRvU2VydmVyU3RhdHVzLCBJUGFja2V0RGF0YV9FbnRpdHlEYXRhLCBQYWNrZXRUeXBlIH0gZnJvbSBcIi4uL3BhY2tldC9wYWNrZXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDbGllbnQge1xyXG4gICAgcHJpdmF0ZSBfZ2FtZTogR2FtZVNlcnZlcjtcclxuICAgIHByaXZhdGUgX2lkOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9wbGF5ZXI/OiBFbnRpdHlQbGF5ZXI7XHJcblxyXG4gICAgcHVibGljIGdldCBnYW1lKCkgeyByZXR1cm4gdGhpcy5fZ2FtZTsgfVxyXG4gICAgcHVibGljIGdldCBpZCgpIHsgcmV0dXJuIHRoaXMuX2lkOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHBsYXllcigpIHsgcmV0dXJuIHRoaXMuX3BsYXllcjsgfVxyXG5cclxuICAgIHByaXZhdGUgX3NlbmRQYWNrZXRzRGVsYXk6IG51bWJlciA9IDEwO1xyXG4gICAgcHJpdmF0ZSBfbGFzdFNlbnRQYWNrZXRzOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGdhbWU6IEdhbWVTZXJ2ZXIsIGlkOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9nYW1lID0gZ2FtZTtcclxuICAgICAgICB0aGlzLl9pZCA9IGlkO1xyXG5cclxuICAgICAgICB0aGlzLmdhbWUuc2VuZENsaWVudERhdGEodGhpcy5pZCwge2Zyb206IFwiY2xpZW50XCJ9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuXHJcbiAgICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcclxuXHJcbiAgICAgICAgaWYobm93IC0gdGhpcy5fbGFzdFNlbnRQYWNrZXRzID49IHRoaXMuX3NlbmRQYWNrZXRzRGVsYXkpIHtcclxuICAgICAgICAgICAgdGhpcy5fbGFzdFNlbnRQYWNrZXRzID0gbm93O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBlbnRpdHkgb2YgdGhpcy5nYW1lLndvcmxkLmVudGl0aWVzKSB7XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IHBhY2tldERhdGE6IElQYWNrZXREYXRhX0VudGl0eURhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICBlbnRpdHlJZDogZW50aXR5LmlkLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5LnRvSlNPTigpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2VuZChQYWNrZXRUeXBlLkVOVElUWV9EQVRBLCBwYWNrZXREYXRhKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uQ29ubmVjdCgpIHtcclxuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLl9wbGF5ZXIgPSB0aGlzLmdhbWUud29ybGQuY3JlYXRlUGxheWVyKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGE6IElQYWNrZXREYXRhX0Nvbm5lY3RUb1NlcnZlclN0YXR1cyA9IHtcclxuICAgICAgICAgICAgc2VydmVySWQ6ICdzb21laWQnLFxyXG4gICAgICAgICAgICBlbnRpdHlJZDogcGxheWVyLmlkLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmYWxzZVxyXG4gICAgICAgIH0gXHJcbiAgICAgICAgdGhpcy5zZW5kKFBhY2tldFR5cGUuQ09OTkVDVF9UT19TRVJWRVJfU1RBVFVTLCBkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25SZWNlaXZlUGFja2V0KHBhY2tldDogSVBhY2tldCkge1xyXG4gICAgICAgIGlmKHBhY2tldC50eXBlID09IFBhY2tldFR5cGUuRU5USVRZX0RBVEEpIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YTogSVBhY2tldERhdGFfRW50aXR5RGF0YSA9IHBhY2tldC5kYXRhO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXI/LmZyb21KU09OKGRhdGEuZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZW5kKHR5cGU6IFBhY2tldFR5cGUsIGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBjb25zdCBwYWNrZXQ6IElQYWNrZXQgPSB7XHJcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZS5zZW5kQ2xpZW50RGF0YSh0aGlzLmlkLCBwYWNrZXQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0ICogYXMgcGMgZnJvbSBcInBsYXljYW52YXNcIjtcclxuaW1wb3J0IHsgdjQgYXMgdXVpZHY0IH0gZnJvbSAndXVpZCc7XHJcbmltcG9ydCB7IEVudGl0eVN5bmMgfSBmcm9tIFwiLi4vc2NyaXB0cy9lbnRpdHlTeW5jXCI7XHJcbmltcG9ydCB7IE1vdmVtZW50IH0gZnJvbSBcIi4uL3NjcmlwdHMvbW92ZW1lbnRcIjtcclxuXHJcbmNvbnN0IEFtbW8gPSB3aW5kb3dbJ0FtbW8nXTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUVudGl0eURhdGEge1xyXG4gICAgeD86IG51bWJlclxyXG4gICAgeT86IG51bWJlclxyXG4gICAgej86IG51bWJlclxyXG4gICAgaW5wdXRIPzogbnVtYmVyXHJcbiAgICBpbnB1dFY/OiBudW1iZXJcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEJhc2VFbnRpdHkgZXh0ZW5kcyBwYy5FbnRpdHkge1xyXG4gICAgcHJpdmF0ZSBfaWQ6IHN0cmluZyA9IHV1aWR2NCgpO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgaWQoKSB7IHJldHVybiB0aGlzLl9pZDsgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcclxuICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5pdCgpIHt9XHJcblxyXG4gICAgcHVibGljIHNldElkKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9pZCA9IGlkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b0pTT04oKSB7XHJcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmdldFBvc2l0aW9uKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGE6IElFbnRpdHlEYXRhID0ge1xyXG4gICAgICAgICAgICB4OiBwb3NpdGlvbi54LFxyXG4gICAgICAgICAgICB5OiBwb3NpdGlvbi55LFxyXG4gICAgICAgICAgICB6OiBwb3NpdGlvbi56LFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcyA9IHRoaXMuc2NyaXB0IS5nZXQoJ21vdmVtZW50JykgYXMgTW92ZW1lbnQgfCBudWxsO1xyXG5cclxuICAgICAgICBpZihzKSB7XHJcbiAgICAgICAgICAgIGRhdGEuaW5wdXRIID0gcy5ob3Jpem9udGFsO1xyXG4gICAgICAgICAgICBkYXRhLmlucHV0ViA9IHMudmVydGljYWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZnJvbUpTT04oZGF0YTogSUVudGl0eURhdGEpIHtcclxuXHJcbiAgICAgICAgY29uc3QgaGFzRW50aXR5U3luYyA9IHRoaXMuc2NyaXB0IS5oYXMoJ2VudGl0eVN5bmMnKTtcclxuICAgICAgICBjb25zdCB0YXJnZXRQb3NpdGlvbiA9IGhhc0VudGl0eVN5bmMgPyAoPEVudGl0eVN5bmM+dGhpcy5zY3JpcHQhLmdldCgnZW50aXR5U3luYycpKS5nZXRUYXJnZXRQb3NpdGlvbigpIDogdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICBjb25zdCBuZXdQb3NpdGlvbiA9IHRhcmdldFBvc2l0aW9uID8gdGFyZ2V0UG9zaXRpb24gOiB0aGlzLmdldFBvc2l0aW9uKCk7XHJcblxyXG4gICAgICAgIGlmKGRhdGEueCAhPT0gdW5kZWZpbmVkKSBuZXdQb3NpdGlvbi54ID0gZGF0YS54O1xyXG4gICAgICAgIGlmKGRhdGEueSAhPT0gdW5kZWZpbmVkKSBuZXdQb3NpdGlvbi55ID0gZGF0YS55O1xyXG4gICAgICAgIGlmKGRhdGEueiAhPT0gdW5kZWZpbmVkKSBuZXdQb3NpdGlvbi56ID0gZGF0YS56O1xyXG5cclxuICAgICAgICBjb25zdCBzID0gdGhpcy5zY3JpcHQhLmdldCgnbW92ZW1lbnQnKSBhcyBNb3ZlbWVudCB8IG51bGw7XHJcblxyXG4gICAgICAgIGlmKHMpIHtcclxuXHJcbiAgICAgICAgICAgIGlmKGRhdGEuaW5wdXRIICE9PSB1bmRlZmluZWQpIHMuaG9yaXpvbnRhbCA9IGRhdGEuaW5wdXRIO1xyXG4gICAgICAgICAgICBpZihkYXRhLmlucHV0ViAhPT0gdW5kZWZpbmVkKSBzLnZlcnRpY2FsID0gZGF0YS5pbnB1dFY7XHJcblxyXG4gICAgICAgICAgICAvL2lmKGRhdGEuaW5wdXRIICE9PSB1bmRlZmluZWQgfHwgZGF0YS5pbnB1dFYgIT09IHVuZGVmaW5lZCkgY29uc29sZS5sb2coZGF0YS5pbnB1dEgsIGRhdGEuaW5wdXRWKVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgIFxyXG5cclxuICAgICAgICBpZih0aGlzLnNjcmlwdCEuaGFzKCdlbnRpdHlTeW5jJykpIHtcclxuICAgICAgICAgICAgY29uc3QgcyA9IDxFbnRpdHlTeW5jPnRoaXMuc2NyaXB0IS5nZXQoJ2VudGl0eVN5bmMnKTtcclxuICAgICAgICAgICAgcy5zZXRUYXJnZXRQb3NpdGlvbihuZXdQb3NpdGlvbik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICB0aGlzLnRlbGVwb3J0KG5ld1Bvc2l0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0ZWxlcG9ydChwb3NpdGlvbjogcGMuVmVjMykge1xyXG4gICAgICAgIHRoaXMucmlnaWRib2R5IS50ZWxlcG9ydChwb3NpdGlvbi54LCBwb3NpdGlvbi55LCBwb3NpdGlvbi56KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0VmVsb2NpdHkodmVsb2NpdHk6IHBjLlZlYzMpIHtcclxuICAgICAgICB0aGlzLnJpZ2lkYm9keSFbJ2JvZHknXS5zZXRMaW5lYXJWZWxvY2l0eShuZXcgQW1tby5idFZlY3RvcjModmVsb2NpdHkueCwgdmVsb2NpdHkueSwgdmVsb2NpdHkueikpXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgKiBhcyBwYyBmcm9tIFwicGxheWNhbnZhc1wiO1xyXG5pbXBvcnQgeyBNb3ZlbWVudCB9IGZyb20gXCIuLi9zY3JpcHRzL21vdmVtZW50XCI7XHJcbmltcG9ydCB7IFNoYXBlVXRpbHMsIFdvcmxkIH0gZnJvbSBcIi4uL3dvcmxkL3dvcmxkXCI7XHJcbmltcG9ydCB7IEJhc2VFbnRpdHkgfSBmcm9tIFwiLi9iYXNlRW50aXR5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRW50aXR5UGxheWVyIGV4dGVuZHMgQmFzZUVudGl0eSB7XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluaXQoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdCgpO1xyXG5cclxuICAgICAgICB0aGlzLmFkZE1vdmVtZW50KCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVCb2R5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZE1vdmVtZW50KCkge1xyXG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXM7XHJcbiAgICAgICAgbGV0IHNjcmlwdCA9IGVudGl0eS5maW5kQ29tcG9uZW50KCdzY3JpcHQnKSBhcyBwYy5TY3JpcHRDb21wb25lbnQgfCB1bmRlZmluZWQ7XHJcbiAgICAgICAgaWYoIXNjcmlwdCkgc2NyaXB0ID0gZW50aXR5LmFkZENvbXBvbmVudCgnc2NyaXB0JykgYXMgcGMuU2NyaXB0Q29tcG9uZW50O1xyXG4gICAgICAgIHNjcmlwdC5jcmVhdGUoJ21vdmVtZW50Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldENvbnRyb2xsYWJsZSgpIHtcclxuICAgICAgICB2YXIgbSA9IHRoaXMuc2NyaXB0IS5nZXQoJ21vdmVtZW50JykhIGFzIE1vdmVtZW50O1xyXG4gICAgICAgIG0uY29udHJvbGxlZEJ5UGxheWVyID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlQm9keSgpIHtcclxuICAgICAgICBjb25zdCBzID0gMC4yO1xyXG4gICAgICAgIGNvbnN0IHNpemUgPSBuZXcgcGMuVmVjMyhzLHMscyk7XHJcbiAgICAgXHJcbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcztcclxuICAgICAgICBlbnRpdHkuc2V0UG9zaXRpb24oMCwgMiwgMCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgU2hhcGVVdGlscy5jcmVhdGVSZWN0YW5nbGVBdEVudGl0eShlbnRpdHksIHNpemUsIHRydWUsIG5ldyBwYy5Db2xvcigxLCAxLCAxKSk7XHJcblxyXG4gICAgICAgIC8vZW50aXR5LnJpZ2lkYm9keSFbJ2JvZHknXS5zZXRBbmd1bGFyRmFjdG9yKDAsIDEsIDApXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgKiBhcyBwYyBmcm9tICdwbGF5Y2FudmFzJ1xyXG5pbXBvcnQgeyBDYW1lcmFGb2xsb3cgfSBmcm9tICcuLi9zY3JpcHRzL2NhbWVyYUZvbGxvdyc7XHJcbmltcG9ydCB7IEVudGl0eVN5bmMgfSBmcm9tICcuLi9zY3JpcHRzL2VudGl0eVN5bmMnO1xyXG5pbXBvcnQgeyBNb3ZlbWVudCB9IGZyb20gJy4uL3NjcmlwdHMvbW92ZW1lbnQnO1xyXG5pbXBvcnQgeyBXb3JsZCB9IGZyb20gJy4uL3dvcmxkL3dvcmxkJztcclxuaW1wb3J0IHsgR2FtZUNsaWVudCB9IGZyb20gJy4vZ2FtZUNsaWVudCc7XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZSB7XHJcbiAgICBwcml2YXRlIF9pc1NlcnZlcjogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX2NhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBwcml2YXRlIF9hcHA6IHBjLkFwcGxpY2F0aW9uO1xyXG4gICAgcHJpdmF0ZSBfd29ybGQ6IFdvcmxkO1xyXG4gICAgXHJcbiAgICBwdWJsaWMgZ2V0IGlzU2VydmVyKCkgeyByZXR1cm4gdGhpcy5faXNTZXJ2ZXI7IH1cclxuICAgIHB1YmxpYyBnZXQgYXBwKCkgeyByZXR1cm4gdGhpcy5fYXBwOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHdvcmxkKCkgeyByZXR1cm4gdGhpcy5fd29ybGQ7IH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBpc0NsaWVudD86IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgdGhpcy5faXNTZXJ2ZXIgPSBpc0NsaWVudCAhPT0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl93b3JsZCA9IG5ldyBXb3JsZCh0aGlzKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coYFtHYW1lXSBjb25zdHJ1Y3RvcjsgaXNTZXJ2ZXIgPWAsIHRoaXMuaXNTZXJ2ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydCgpIHtcclxuICAgICAgICB0aGlzLnNldHVwQXBwKCk7XHJcbiAgICAgICAgdGhpcy5hcHAub24oJ3VwZGF0ZScsIChkdCkgPT4gdGhpcy51cGRhdGUoZHQpKTtcclxuICAgICAgICB0aGlzLmFwcC5zdGFydCgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBSZXNpemUoKTtcclxuICAgICAgICB0aGlzLnNldHVwTG9jYWxDbGllbnRTY2VuZSghdGhpcy5pc1NlcnZlcik7XHJcblxyXG4gICAgICAgIHRoaXMud29ybGQuc2V0dXBXb3JsZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCB1cGRhdGUoZHQ6IG51bWJlcikge31cclxuXHJcbiAgICBwcml2YXRlIHNldHVwQXBwKCkge1xyXG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuX2NhbnZhcztcclxuICAgICAgICBjb25zdCBhcHAgPSBuZXcgcGMuQXBwbGljYXRpb24oY2FudmFzLCB7XHJcbiAgICAgICAgICAgIG1vdXNlOiBuZXcgcGMuTW91c2UoY2FudmFzKSxcclxuICAgICAgICAgICAgdG91Y2g6IG5ldyBwYy5Ub3VjaERldmljZShjYW52YXMpLFxyXG4gICAgICAgICAgICBrZXlib2FyZDogbmV3IHBjLktleWJvYXJkKGRvY3VtZW50LmJvZHkpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2FwcCA9IGFwcDtcclxuICAgICAgICBcclxuICAgICAgICBwYy5yZWdpc3RlclNjcmlwdChDYW1lcmFGb2xsb3csICdjYW1lcmFGb2xsb3cnLCBhcHApO1xyXG4gICAgICAgIHBjLnJlZ2lzdGVyU2NyaXB0KE1vdmVtZW50LCAnbW92ZW1lbnQnLCBhcHApO1xyXG4gICAgICAgIHBjLnJlZ2lzdGVyU2NyaXB0KEVudGl0eVN5bmMsICdlbnRpdHlTeW5jJywgYXBwKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldHVwUmVzaXplKCkge1xyXG4gICAgICAgIHRoaXMuYXBwLnNldENhbnZhc0ZpbGxNb2RlKHBjLkZJTExNT0RFX0ZJTExfV0lORE9XKTtcclxuICAgICAgICB0aGlzLmFwcC5zZXRDYW52YXNSZXNvbHV0aW9uKHBjLlJFU09MVVRJT05fQVVUTyk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB0aGlzLnJlc2l6ZSgpKTtcclxuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0dXBMb2NhbENsaWVudFNjZW5lKGlzTG9jYWxDbGllbnQ/OiBib29sZWFuKSB7XHJcbiAgICAgICAgY29uc3QgYXBwID0gdGhpcy5hcHA7XHJcblxyXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IG5ldyBwYy5FbnRpdHkoJ2NhbWVyYScpO1xyXG4gICAgICAgIGNhbWVyYS5hZGRDb21wb25lbnQoJ2NhbWVyYScsIHtcclxuICAgICAgICAgICAgY2xlYXJDb2xvcjogbmV3IHBjLkNvbG9yKDAuMSwgMC4xLCAwLjEpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYXBwLnJvb3QuYWRkQ2hpbGQoY2FtZXJhKTtcclxuICAgICAgICBjYW1lcmEuc2V0UG9zaXRpb24oMCwgNiwgMCk7XHJcbiAgICAgICAgY2FtZXJhLnNldEV1bGVyQW5nbGVzKC05MCwgMCwgMCk7XHJcbiAgICAgICAgKGNhbWVyYS5hZGRDb21wb25lbnQoJ3NjcmlwdCcpIGFzIHBjLlNjcmlwdENvbXBvbmVudCkuY3JlYXRlKCdjYW1lcmFGb2xsb3cnKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBsaWdodCA9IG5ldyBwYy5FbnRpdHkoJ2xpZ2h0Jyk7XHJcbiAgICAgICAgbGlnaHQuYWRkQ29tcG9uZW50KCdsaWdodCcpO1xyXG4gICAgICAgIGFwcC5yb290LmFkZENoaWxkKGxpZ2h0KTtcclxuICAgICAgICBsaWdodC5zZXRFdWxlckFuZ2xlcygzMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIGlmKGlzTG9jYWxDbGllbnQpIHtcclxuICAgICAgICAgICAgR2FtZUNsaWVudC5jYW1lcmEgPSBjYW1lcmE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXNpemUoKSB7XHJcbiAgICAgICAgY29uc3QgY2FudmFzID0gdGhpcy5fY2FudmFzO1xyXG5cclxuICAgICAgICB0aGlzLmFwcC5yZXNpemVDYW52YXMoKTtcclxuICAgICAgICBjYW52YXMuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFbnRpdHlQbGF5ZXIgfSBmcm9tIFwiLi4vZW50aXR5L2VudGl0eVBsYXllclwiO1xyXG5pbXBvcnQgeyBOZXR3b3JrIH0gZnJvbSBcIi4uL25ldHdvcmsvbmV0d29ya1wiO1xyXG5pbXBvcnQgeyBDYW1lcmFGb2xsb3cgfSBmcm9tIFwiLi4vc2NyaXB0cy9jYW1lcmFGb2xsb3dcIjtcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuL2dhbWVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lQ2xpZW50IGV4dGVuZHMgR2FtZSB7XHJcbiAgICBwdWJsaWMgc3RhdGljIHBsYXllcj86IEVudGl0eVBsYXllcjtcclxuICAgIHB1YmxpYyBzdGF0aWMgY2FtZXJhOiBwYy5FbnRpdHk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHBsYXllcklkOiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgIHByaXZhdGUgX25ldHdvcms6IE5ldHdvcms7XHJcblxyXG4gICAgcHVibGljIGdldCBuZXR3b3JrKCkgeyByZXR1cm4gdGhpcy5fbmV0d29yazsgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQpIHtcclxuICAgICAgICBzdXBlcihjYW52YXMsIHRydWUpO1xyXG5cclxuICAgICAgICB0aGlzLl9uZXR3b3JrID0gbmV3IE5ldHdvcmsodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZShkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKGR0KTtcclxuXHJcbiAgICAgICAgdGhpcy5uZXR3b3JrLnVwZGF0ZShkdCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBzdGFydCgpIHtcclxuICAgICAgICBzdXBlci5zdGFydCgpO1xyXG5cclxuICAgICAgICB0aGlzLm5ldHdvcmsuY29ubmVjdCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbTmV0d29ya10gQ29ubmVjdGVkPyAke3RoaXMubmV0d29yay5jb25uZWN0ZWR9YCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBjYW1lcmFGb2xsb3dFbnRpdHkocDogcGMuRW50aXR5KSB7XHJcbiAgICAgICAgY29uc3Qgc2NyID0gPENhbWVyYUZvbGxvdz4odGhpcy5jYW1lcmEuZmluZENvbXBvbmVudCgnc2NyaXB0JykgYXMgcGMuU2NyaXB0Q29tcG9uZW50KS5nZXQoJ2NhbWVyYUZvbGxvdycpO1xyXG4gICAgICAgIHNjci5mb2xsb3dFbnRpdHkgPSBwO1xyXG4gICAgICAgIHNjci5mb3JjZVRlbGVwb3J0KCk7XHJcbiAgICB9XHJcbn0iLCJcclxuaW1wb3J0IHsgQ2xpZW50IH0gZnJvbSBcIi4uL2NsaWVudC9jbGllbnRcIjtcclxuaW1wb3J0IHsgSVBhY2tldCB9IGZyb20gXCIuLi9wYWNrZXQvcGFja2V0XCI7XHJcbmltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi9nYW1lXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZVNlcnZlciBleHRlbmRzIEdhbWUge1xyXG4gICAgcHJpdmF0ZSBfY2xpZW50cyA9IG5ldyBNYXA8c3RyaW5nLCBDbGllbnQ+KCk7XHJcbiAgICBcclxuICAgIHB1YmxpYyBnZXQgY2xpZW50cygpIHsgcmV0dXJuIEFycmF5LmZyb20odGhpcy5fY2xpZW50cy52YWx1ZXMoKSk7IH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KSB7XHJcbiAgICAgICAgc3VwZXIoY2FudmFzKTtcclxuXHJcbiAgICAgICAgd2luZG93WydvblNvY2tldENvbm5lY3QnXSA9IHRoaXMub25Tb2NrZXRDb25uZWN0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgd2luZG93WydvblNvY2tldERpc2Nvbm5lY3QnXSA9IHRoaXMub25Tb2NrZXREaXNjb25uZWN0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgd2luZG93WydvblJlY2VpdmVTb2NrZXREYXRhJ10gPSB0aGlzLm9uUmVjZWl2ZVNvY2tldERhdGEuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQoKSB7XHJcbiAgICAgICAgc3VwZXIuc3RhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlci51cGRhdGUoZHQpO1xyXG5cclxuICAgICAgICB0aGlzLmNsaWVudHMubWFwKGNsaWVudCA9PiBjbGllbnQudXBkYXRlKGR0KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblNvY2tldENvbm5lY3QoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbR2FtZVNlcnZlcl0gTmV3IHNvY2tldCBjb25uZWN0aW9uICR7aWR9YCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNsaWVudCA9IG5ldyBDbGllbnQodGhpcywgaWQpO1xyXG4gICAgICAgIHRoaXMuX2NsaWVudHMuc2V0KGNsaWVudC5pZCwgY2xpZW50KTtcclxuXHJcbiAgICAgICAgY2xpZW50Lm9uQ29ubmVjdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25Tb2NrZXREaXNjb25uZWN0KGlkOiBzdHJpbmcsIHJlYXNvbjogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFtHYW1lU2VydmVyXSBTb2NrZXQgZGlzY29ubmVjdCAke2lkfTogJHtyZWFzb259YCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblJlY2VpdmVTb2NrZXREYXRhKGlkOiBzdHJpbmcsIGRhdGE6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHBhY2tldCA9IEpTT04ucGFyc2UoZGF0YSkgYXMgSVBhY2tldDtcclxuXHJcbiAgICAgICAgdGhpcy5fY2xpZW50cy5nZXQoaWQpIS5vblJlY2VpdmVQYWNrZXQocGFja2V0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VuZENsaWVudERhdGEoaWQ6IHN0cmluZywgZGF0YTogYW55KSB7XHJcbiAgICAgICAgY29uc3Qgc3RyID0gdHlwZW9mIGRhdGEgPT0gJ3N0cmluZycgPyBkYXRhIDogSlNPTi5zdHJpbmdpZnkoZGF0YSk7XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2coYFtHYW1lU2VydmVyXSBTZW5kaW5nIHRvICR7aWR9OiAke3N0cn1gKTtcclxuXHJcbiAgICAgICAgd2luZG93WydzZW5kQ2xpZW50RGF0YSddKGlkLCBzdHIpO1xyXG4gICAgfVxyXG59IiwiY29uc3QgQW1tbyA9IHJlcXVpcmUoJ2FtbW8uanMnKTtcclxud2luZG93WydBbW1vJ10gPSBBbW1vO1xyXG5cclxuaW1wb3J0IHsgR2FtZUNsaWVudCB9IGZyb20gXCIuL2dhbWUvZ2FtZUNsaWVudFwiO1xyXG5pbXBvcnQgeyBHYW1lU2VydmVyIH0gZnJvbSBcIi4vZ2FtZS9nYW1lU2VydmVyXCI7XHJcblxyXG5jb25zdCBpc1NlcnZlciA9IGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCIjc2VydmVyXCIpO1xyXG5cclxuaWYoaXNTZXJ2ZXIpIHtcclxuICAgIGNvbnN0IHNlcnZlciA9IG5ldyBHYW1lU2VydmVyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lJykgYXMgSFRNTENhbnZhc0VsZW1lbnQpO1xyXG4gICAgc2VydmVyLnN0YXJ0KCk7XHJcbiAgICB3aW5kb3dbJ2dhbWUnXSA9IHNlcnZlcjtcclxufSBlbHNlIHtcclxuICAgIGNvbnN0IGNsaWVudCA9IG5ldyBHYW1lQ2xpZW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lJykgYXMgSFRNTENhbnZhc0VsZW1lbnQpO1xyXG4gICAgY2xpZW50LnN0YXJ0KCk7XHJcbiAgICB3aW5kb3dbJ2dhbWUnXSA9IGNsaWVudDtcclxufVxyXG5cclxuIiwiaW1wb3J0IHsgaW8sIFNvY2tldCB9IGZyb20gXCJzb2NrZXQuaW8tY2xpZW50XCI7XHJcbmltcG9ydCB7IEJhc2VFbnRpdHkgfSBmcm9tIFwiLi4vZW50aXR5L2Jhc2VFbnRpdHlcIjtcclxuaW1wb3J0IHsgRW50aXR5UGxheWVyIH0gZnJvbSBcIi4uL2VudGl0eS9lbnRpdHlQbGF5ZXJcIjtcclxuaW1wb3J0IHsgR2FtZUNsaWVudCB9IGZyb20gXCIuLi9nYW1lL2dhbWVDbGllbnRcIjtcclxuaW1wb3J0IHsgSVBhY2tldCwgSVBhY2tldERhdGFfQ29ubmVjdFRvU2VydmVyU3RhdHVzLCBJUGFja2V0RGF0YV9FbnRpdHlEYXRhLCBQYWNrZXRUeXBlIH0gZnJvbSBcIi4uL3BhY2tldC9wYWNrZXRcIjtcclxuaW1wb3J0IHsgRW50aXR5U3luYyB9IGZyb20gXCIuLi9zY3JpcHRzL2VudGl0eVN5bmNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBOZXR3b3JrIHtcclxuICAgIHByaXZhdGUgX2dhbWU6IEdhbWVDbGllbnQ7XHJcbiAgICBwcml2YXRlIF9zb2NrZXQ6IFNvY2tldDtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGdhbWUoKSB7IHJldHVybiB0aGlzLl9nYW1lOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGNvbm5lY3RlZCgpIHsgcmV0dXJuIHRoaXMuX3NvY2tldC5jb25uZWN0ZWQ7IH1cclxuXHJcbiAgICBwcml2YXRlIF9zZW5kUGFja2V0c0RlbGF5OiBudW1iZXIgPSAzMDtcclxuICAgIHByaXZhdGUgX2xhc3RTZW50UGFja2V0czogbnVtYmVyID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lOiBHYW1lQ2xpZW50KSB7XHJcbiAgICAgICAgdGhpcy5fZ2FtZSA9IGdhbWU7XHJcblxyXG4gICAgICAgIC8vaHR0cHM6Ly9kbWRhc3NjLWdhbWUuZ2xpdGNoLm1lL1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGFkZHJlc3MgPSBgJHtsb2NhdGlvbi5wcm90b2NvbH0vLyR7bG9jYXRpb24uaG9zdH0vZ2FtZWA7XHJcbiAgICAgICAgdGhpcy5fc29ja2V0ID0gaW8oYWRkcmVzcywge1xyXG4gICAgICAgICAgICAvL3BhdGg6ICcvc29ja2V0JyxcclxuICAgICAgICAgICAgYXV0b0Nvbm5lY3Q6IGZhbHNlLFxyXG4gICAgICAgICAgICByZWNvbm5lY3Rpb246IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdfZGF0YScsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhY2tldCA9IEpTT04ucGFyc2UoZGF0YSkgYXMgSVBhY2tldDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMub25SZWNlaXZlUGFja2V0KHBhY2tldCk7XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGBbTmV0d29ya10gUmVjZWl2ZWQ6YCwgZGF0YSk7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coYFtOZXR3b3JrXSBBZGRyZXNzOiAoJHthZGRyZXNzfSlgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29ubmVjdChjYWxsYmFjaz86ICgpID0+IHZvaWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgW05ldHdvcmtdIENvbm5lY3RpbmcuLi5gKTtcclxuXHJcbiAgICAgICAgdGhpcy5fc29ja2V0LmNvbm5lY3QoKTtcclxuICAgICAgICB0aGlzLl9zb2NrZXQub25jZSgnY29ubmVjdCcsICgpID0+IHtcclxuICAgICAgICAgICAgY2FsbGJhY2s/LigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHdvcmxkID0gdGhpcy5nYW1lLndvcmxkO1xyXG4gICAgICAgIGNvbnN0IGVudGl0eSA9IEdhbWVDbGllbnQucGxheWVyO1xyXG5cclxuICAgICAgICBpZighd29ybGQpIHJldHVybjtcclxuICAgICAgICBpZighZW50aXR5KSByZXR1cm47XHJcblxyXG4gICAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XHJcblxyXG4gICAgICAgIGlmKG5vdyAtIHRoaXMuX2xhc3RTZW50UGFja2V0cyA+PSB0aGlzLl9zZW5kUGFja2V0c0RlbGF5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xhc3RTZW50UGFja2V0cyA9IG5vdztcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IHBhY2tldERhdGE6IElQYWNrZXREYXRhX0VudGl0eURhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICBlbnRpdHlJZDogZW50aXR5LmlkLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogZW50aXR5LnRvSlNPTigpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2VuZChQYWNrZXRUeXBlLkVOVElUWV9EQVRBLCBwYWNrZXREYXRhKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZW5kKHR5cGU6IFBhY2tldFR5cGUsIGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBjb25zdCBwYWNrZXQ6IElQYWNrZXQgPSB7XHJcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3NvY2tldC5lbWl0KCdfZGF0YScsIEpTT04uc3RyaW5naWZ5KHBhY2tldCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25SZWNlaXZlUGFja2V0KHBhY2tldDogSVBhY2tldCkge1xyXG4gICAgICAgIGlmKHBhY2tldC50eXBlID09IFBhY2tldFR5cGUuQ09OTkVDVF9UT19TRVJWRVJfU1RBVFVTKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGE6IElQYWNrZXREYXRhX0Nvbm5lY3RUb1NlcnZlclN0YXR1cyA9IHBhY2tldC5kYXRhO1xyXG4gICAgICAgICAgICBHYW1lQ2xpZW50LnBsYXllcklkID0gZGF0YS5lbnRpdHlJZDtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKEdhbWVDbGllbnQucGxheWVySWQpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihwYWNrZXQudHlwZSA9PSBQYWNrZXRUeXBlLkVOVElUWV9EQVRBKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGE6IElQYWNrZXREYXRhX0VudGl0eURhdGEgPSBwYWNrZXQuZGF0YTtcclxuICAgICAgICAgICAgY29uc3Qgd29ybGQgPSB0aGlzLl9nYW1lLndvcmxkO1xyXG5cclxuICAgICAgICAgICAgbGV0IGlzTmV3RW50aXR5OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZighd29ybGQuaGFzRW50aXR5KGRhdGEuZW50aXR5SWQpKSB7XHJcbiAgICAgICAgICAgICAgICB3b3JsZC5jcmVhdGVQbGF5ZXIodW5kZWZpbmVkLCBkYXRhLmVudGl0eUlkKTtcclxuICAgICAgICAgICAgICAgIGlzTmV3RW50aXR5ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbmV3IGVudGl5JylcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgZW50aXR5ID0gd29ybGQuZ2V0RW50aXR5KGRhdGEuZW50aXR5SWQpO1xyXG5cclxuICAgICAgICAgICAgZW50aXR5LmZyb21KU09OKGRhdGEuZGF0YSk7XHJcblxyXG4gICAgICAgICAgICBpZihpc05ld0VudGl0eSkge1xyXG4gICAgICAgICAgICAgICAgZW50aXR5LnNjcmlwdCEuY3JlYXRlKCdlbnRpdHlTeW5jJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgaWYoZW50aXR5LmlkID09IEdhbWVDbGllbnQucGxheWVySWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZighR2FtZUNsaWVudC5wbGF5ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBHYW1lQ2xpZW50LnBsYXllciA9IGVudGl0eSBhcyBFbnRpdHlQbGF5ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgR2FtZUNsaWVudC5wbGF5ZXIuc2V0Q29udHJvbGxhYmxlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIEdhbWVDbGllbnQuY2FtZXJhRm9sbG93RW50aXR5KGVudGl0eSk7XHJcblxyXG4gICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmKEdhbWVDbGllbnQucGxheWVyLnNjcmlwdCEuaGFzKEVudGl0eVN5bmMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhID0gR2FtZUNsaWVudC5wbGF5ZXIuc2NyaXB0IS5nZXQoRW50aXR5U3luYykhIGFzIEVudGl0eVN5bmM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGEuZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZW51bSBQYWNrZXRUeXBlIHtcclxuICAgIFJFUVVFU1RfU0VSVkVSX0xJU1QsXHJcbiAgICBTRVJWRVJfTElTVCxcclxuICAgIENPTk5FQ1RfVE9fU0VSVkVSLFxyXG4gICAgQ09OTkVDVF9UT19TRVJWRVJfU1RBVFVTLFxyXG4gICAgRU5USVRZX0RBVEFcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUGFja2V0IHtcclxuICAgIHR5cGU6IFBhY2tldFR5cGVcclxuICAgIGRhdGE/OiBhbnlcclxufVxyXG5cclxuLypcclxuZXhwb3J0IGludGVyZmFjZSBJUGFja2V0RGF0YV9TZXJ2ZXJMaXN0IHtcclxuICAgIHNlcnZlcnM6IFNlcnZlckluZm9bXVxyXG59XHJcbiovXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQYWNrZXREYXRhX0Nvbm5lY3RUb1NlcnZlciB7XHJcbiAgICBpZDogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhY2tldERhdGFfSWQge1xyXG4gICAgaWQ6IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQYWNrZXREYXRhX0Nvbm5lY3RUb1NlcnZlclN0YXR1cyB7XHJcbiAgICBzZXJ2ZXJJZDogc3RyaW5nXHJcbiAgICBlbnRpdHlJZDogc3RyaW5nXHJcbiAgICBzdWNjZXNzOiBib29sZWFuXHJcbiAgICBlcnJvck1lc3NhZ2U/OiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUGFja2V0RGF0YV9FbnRpdHlEYXRhIHtcclxuICAgIGVudGl0eUlkOiBzdHJpbmdcclxuICAgIGRhdGE6IGFueVxyXG59IiwiaW1wb3J0ICogYXMgcGMgZnJvbSBcInBsYXljYW52YXNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDYW1lcmFGb2xsb3cgZXh0ZW5kcyBwYy5TY3JpcHRUeXBlIHtcclxuXHJcbiAgICBwdWJsaWMgaGVpZ2h0OiBudW1iZXIgPSA1O1xyXG4gICAgcHVibGljIGZvbGxvd0VudGl0eTogcGMuRW50aXR5IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgbGVycDogbnVtYmVyID0gMTtcclxuXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICB0aGlzLmZpcmUoJ2luaXRpYWxpemUnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcG9zdEluaXRpYWxpemUoKSB7XHJcbiAgICAgICAgdGhpcy5maXJlKCdwb3N0SW5pdGlhbGl6ZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmb3JjZVRlbGVwb3J0KCkge1xyXG4gICAgICAgIGlmKHRoaXMuZm9sbG93RW50aXR5KSB0aGlzLmVudGl0eS5zZXRQb3NpdGlvbih0aGlzLmdldFRhcmdldFBvc2l0aW9uKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0VGFyZ2V0UG9zaXRpb24oKSB7XHJcblxyXG4gICAgICAgIGlmKCF0aGlzLmZvbGxvd0VudGl0eSkgcmV0dXJuIHBjLlZlYzMuWkVSTztcclxuXHJcbiAgICAgICAgY29uc3QgZm9sbG93RW50aXR5UG9zaXRpb24gPSB0aGlzLmZvbGxvd0VudGl0eS5nZXRQb3NpdGlvbigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHRhcmdldFBvc2l0aW9uID0gbmV3IHBjLlZlYzMoXHJcbiAgICAgICAgICAgIGZvbGxvd0VudGl0eVBvc2l0aW9uLngsXHJcbiAgICAgICAgICAgIGZvbGxvd0VudGl0eVBvc2l0aW9uLnkgKyB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgZm9sbG93RW50aXR5UG9zaXRpb24uelxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiB0YXJnZXRQb3NpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHB1YmxpYyB1cGRhdGUoZHQpIHtcclxuICAgICAgICB0aGlzLmZpcmUoJ3VwZGF0ZScsIGR0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcG9zdFVwZGF0ZShkdCkge1xyXG4gICAgICAgIHRoaXMuZmlyZSgncG9zdFVwZGF0ZScsIGR0KTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5mb2xsb3dFbnRpdHkgPT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuXHJcbiAgICAgICAgY29uc3QgbmV3UG9zaXRpb24gPSBuZXcgcGMuVmVjMygpLmxlcnAoXHJcbiAgICAgICAgICAgIHRoaXMuZW50aXR5LmdldFBvc2l0aW9uKCksXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0VGFyZ2V0UG9zaXRpb24oKSxcclxuICAgICAgICAgICAgdGhpcy5sZXJwXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5lbnRpdHkuc2V0UG9zaXRpb24obmV3UG9zaXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzd2FwKCkge1xyXG4gICAgICAgIHRoaXMuZmlyZSgnc3dhcCcpO1xyXG4gICAgfVxyXG59XHJcblxyXG5DYW1lcmFGb2xsb3cuYXR0cmlidXRlcy5hZGQoJ2hlaWdodCcsIHt0eXBlOiAnbnVtYmVyJywgZGVmYXVsdDogNX0pO1xyXG5DYW1lcmFGb2xsb3cuYXR0cmlidXRlcy5hZGQoJ2ZvbGxvd0VudGl0eScsIHt0eXBlOiAnZW50aXR5J30pOyIsImltcG9ydCAqIGFzIHBjIGZyb20gXCJwbGF5Y2FudmFzXCI7XHJcbmltcG9ydCB7IEJhc2VFbnRpdHkgfSBmcm9tIFwiLi4vZW50aXR5L2Jhc2VFbnRpdHlcIjtcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi9nYW1lL2dhbWVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBFbnRpdHlTeW5jIGV4dGVuZHMgcGMuU2NyaXB0VHlwZSB7XHJcblxyXG4gICAgcHVibGljIGVudGl0eTogQmFzZUVudGl0eTtcclxuICAgIHB1YmxpYyBwb3NpdGlvbkxlcnA6IG51bWJlciA9IDAuMztcclxuXHJcbiAgICBwcml2YXRlIF90YXJnZXRQb3NpdGlvbjogcGMuVmVjMyB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICB0aGlzLmZpcmUoJ2luaXRpYWxpemUnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGR0KSB7XHJcbiAgICAgICAgdGhpcy5maXJlKCd1cGRhdGUnLCBkdCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRhcmdldFBvc2l0aW9uID0gdGhpcy5fdGFyZ2V0UG9zaXRpb247XHJcblxyXG4gICAgICAgIGlmKCF0YXJnZXRQb3NpdGlvbikgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuZW50aXR5LmdldFBvc2l0aW9uKCk7XHJcbiAgICAgICAgY29uc3QgZGlzdGFuY2UgPSB0YXJnZXRQb3NpdGlvbi5kaXN0YW5jZShwb3NpdGlvbik7XHJcblxyXG4gICAgICAgIGxldCBwb3NpdGlvbkxlcnAgPSB0aGlzLnBvc2l0aW9uTGVycDtcclxuXHJcbiAgICAgICAgaWYoZGlzdGFuY2UgPCAwLjEpIHtcclxuICAgICAgICAgICAgLy9wb3NpdGlvbkxlcnAgPSAwLjA1XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGRpc3RhbmNlID4gMC41KSB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uTGVycCA9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2FkanVzdCBsZXJwIGJ5IGRlbHRhIG1vdmVtZW50XHJcblxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBjb25zdCBuZXdQb3NpdGlvbiA9IG5ldyBwYy5WZWMzKFxyXG4gICAgICAgICAgICBwYy5tYXRoLmxlcnAocG9zaXRpb24ueCwgdGFyZ2V0UG9zaXRpb24ueCwgcG9zaXRpb25MZXJwKSxcclxuICAgICAgICAgICAgcGMubWF0aC5sZXJwKHBvc2l0aW9uLnksIHRhcmdldFBvc2l0aW9uLnksIHBvc2l0aW9uTGVycCksXHJcbiAgICAgICAgICAgIHBjLm1hdGgubGVycChwb3NpdGlvbi56LCB0YXJnZXRQb3NpdGlvbi56LCBwb3NpdGlvbkxlcnApXHJcbiAgICAgICAgKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuZW50aXR5LnRlbGVwb3J0KG5ld1Bvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgbGV0IEFtbW8gPSB3aW5kb3dbJ0FtbW8nXTtcclxuICAgICAgICB0aGlzLmVudGl0eS5yaWdpZGJvZHkhWydib2R5J10uc2V0TGluZWFyVmVsb2NpdHkobmV3IEFtbW8uYnRWZWN0b3IzKDAsIDAsIDApKVxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBpZihkaXN0YW5jZSA8IDAuMDEpIHtcclxuICAgICAgICAgICAgdGhpcy5lbnRpdHkudGVsZXBvcnQodGFyZ2V0UG9zaXRpb24pO1xyXG4gICAgICAgICAgICB0aGlzLl90YXJnZXRQb3NpdGlvbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRUYXJnZXRQb3NpdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGFyZ2V0UG9zaXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFRhcmdldFBvc2l0aW9uKHBvc2l0aW9uOiBwYy5WZWMzKSB7XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0UG9zaXRpb24gPSBwb3NpdGlvbi5jbG9uZSgpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0ICogYXMgcGMgZnJvbSBcInBsYXljYW52YXNcIjtcclxuaW1wb3J0IHsgQmFzZUVudGl0eSB9IGZyb20gXCIuLi9lbnRpdHkvYmFzZUVudGl0eVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1vdmVtZW50IGV4dGVuZHMgcGMuU2NyaXB0VHlwZSB7XHJcblxyXG4gICAgcHJpdmF0ZSBmb3JjZSA9IG5ldyBwYy5WZWMzKCk7XHJcblxyXG4gICAgcHVibGljIGVudGl0eTogQmFzZUVudGl0eTtcclxuXHJcbiAgICBwdWJsaWMgY29udHJvbGxlZEJ5UGxheWVyOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgaG9yaXpvbnRhbDogbnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyB2ZXJ0aWNhbDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIltNb3ZlbWVudFNjcmlwdF0gaW5pdGlhbGl6ZVwiKVxyXG5cclxuICAgICAgICB0aGlzLmZpcmUoJ2luaXRpYWxpemUnKTtcclxuXHJcbiAgICAgICAgdmFyIHRleHRNZWFzdXJlID0gbmV3IHBjLkVudGl0eSgpO1xyXG4gICAgICAgIHRleHRNZWFzdXJlLm5hbWUgPSBcInRleHRNZWFzdXJlXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGV4dE1lYXN1cmUuYWRkQ29tcG9uZW50KCdlbGVtZW50Jywge1xyXG4gICAgICAgICAgICB0eXBlOiBwYy5FTEVNRU5UVFlQRV9URVhUICxcclxuICAgICAgICAgICAgd2lkdGg6IDI1NixcclxuICAgICAgICAgICAgaGVpZ2h0OiAyNTYsXHJcbiAgICAgICAgICAgIGZvbnRTaXplOiAyNCwgXHJcbiAgICAgICAgICAgIHJlY3Q6IFswLDAsMSwwLjI1XSxcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICB0ZXh0TWVhc3VyZS5lbGVtZW50IS50ZXh0ID0gJ2hlbG89PT09PT09PT09PT09PT09PT09PT09PT09JztcclxuICAgIFxyXG5cclxuICAgICAgICB0aGlzLmVudGl0eS5hZGRDaGlsZCh0ZXh0TWVhc3VyZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZHQpIHtcclxuICAgICAgICB0aGlzLmZpcmUoJ3VwZGF0ZScsIGR0KTtcclxuXHJcbiAgICAgICAgbGV0IGZvcmNlWSA9IDA7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuY29udHJvbGxlZEJ5UGxheWVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMudmVydGljYWwgPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuYXBwLmtleWJvYXJkLmlzUHJlc3NlZChwYy5LRVlfTEVGVCkpIHRoaXMuaG9yaXpvbnRhbCA9IC0xO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hcHAua2V5Ym9hcmQuaXNQcmVzc2VkKHBjLktFWV9SSUdIVCkpIHRoaXMuaG9yaXpvbnRhbCArPSAxO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hcHAua2V5Ym9hcmQuaXNQcmVzc2VkKHBjLktFWV9VUCkpIHRoaXMudmVydGljYWwgPSAtMTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYXBwLmtleWJvYXJkLmlzUHJlc3NlZChwYy5LRVlfRE9XTikpIHRoaXMudmVydGljYWwgKz0gMTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYXBwLmtleWJvYXJkLmlzUHJlc3NlZChwYy5LRVlfU1BBQ0UpKSBmb3JjZVkgKz0gMC4yO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vdGhpcy52ZXJ0aWNhbCA9IC0wLjU7XHJcbiAgICBcclxuICAgICAgICBjb25zdCBzcGVlZCA9IDAuMTtcclxuXHJcbiAgICAgICAgdGhpcy5mb3JjZS54ID0gdGhpcy5ob3Jpem9udGFsICogc3BlZWQ7XHJcbiAgICAgICAgdGhpcy5mb3JjZS55ID0gMDtcclxuICAgICAgICB0aGlzLmZvcmNlLnogPSB0aGlzLnZlcnRpY2FsICogc3BlZWQ7XHJcblxyXG4gICAgICBcclxuICAgICAgICBpZiAodGhpcy5mb3JjZS5sZW5ndGgoKSkge1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgdmFyIHJYID0gTWF0aC5jb3MoLU1hdGguUEkgKiAwLjI1KTtcclxuICAgICAgICAgICAgdmFyIHJZID0gTWF0aC5zaW4oLU1hdGguUEkgKiAwLjI1KTtcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciByWCA9IE1hdGguY29zKDApO1xyXG4gICAgICAgICAgICB2YXIgclkgPSBNYXRoLnNpbigwKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuZm9yY2Uuc2V0KHRoaXMuZm9yY2UueCAqIHJYIC0gdGhpcy5mb3JjZS56ICogclksIDAsIHRoaXMuZm9yY2UueiAqIHJYICsgdGhpcy5mb3JjZS54ICogclkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZm9yY2UubGVuZ3RoKCkgPiBzcGVlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JjZS5ub3JtYWxpemUoKS5tdWxTY2FsYXIoc3BlZWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmZvcmNlLnkgPSBmb3JjZVk7XHJcbiAgICAgICAgLy90aGlzLmZvcmNlLnkgPSB0aGlzLmVudGl0eS5yaWdpZGJvZHkhLmxpbmVhclZlbG9jaXR5Lnk7XHJcblxyXG4gICAgICAgIC8vdGhpcy5lbnRpdHkuc2V0VmVsb2NpdHkodGhpcy5mb3JjZSlcclxuICAgICAgICB2YXIgcmVsYXRpdmVQb2ludCA9IG5ldyBwYy5WZWMzKDAsIDAsIDApO1xyXG4gICAgICAgIHRoaXMuZW50aXR5LnJpZ2lkYm9keSEuYXBwbHlJbXB1bHNlKHRoaXMuZm9yY2UsIHJlbGF0aXZlUG9pbnQpO1xyXG5cclxuICAgICAgICBcclxuICAgICAgICBpZih0aGlzLmVudGl0eS5nZXRQb3NpdGlvbigpLnkgPCAtNSkge1xyXG4gICAgICAgICAgICB0aGlzLmVudGl0eS50ZWxlcG9ydChuZXcgcGMuVmVjMygwLCAzLCAwKSk7XHJcbiAgICAgICAgICAgIHRoaXMuZW50aXR5LnNldFZlbG9jaXR5KHBjLlZlYzMuWkVSTyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwb3N0VXBkYXRlKGR0KSB7XHJcbiAgICAgICAgdGhpcy5maXJlKCdwb3N0VXBkYXRlJywgZHQpO1xyXG5cclxuICAgICAgICB2YXIgc3RhcnQgPSBuZXcgcGMuVmVjMygwLCAxLCAwKTtcclxuICAgICAgICB2YXIgZW5kID0gdGhpcy5lbnRpdHkuZ2V0UG9zaXRpb24oKTtcclxuICAgICAgICB0aGlzLmFwcC5kcmF3TGluZShzdGFydCwgZW5kLCBwYy5Db2xvci5SRUQsIHRydWUpO1xyXG4gICAgICAgIC8vdGhpcy5hcHAuZHJhd0xpbmUoc3RhcnQsIGVuZCwgcGMuQ29sb3IuUkVELCBmYWxzZSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgcGMgZnJvbSBcInBsYXljYW52YXNcIjtcclxuaW1wb3J0IHsgQmFzZUVudGl0eSB9IGZyb20gXCIuLi9lbnRpdHkvYmFzZUVudGl0eVwiO1xyXG5pbXBvcnQgeyBFbnRpdHlQbGF5ZXIgfSBmcm9tIFwiLi4vZW50aXR5L2VudGl0eVBsYXllclwiO1xyXG5pbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uL2dhbWUvZ2FtZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdvcmxkIHtcclxuICAgIHByaXZhdGUgX2dhbWU6IEdhbWU7XHJcbiAgICBwcml2YXRlIF9lbnRpdGllcyA9IG5ldyBNYXA8c3RyaW5nLCBCYXNlRW50aXR5PigpO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgZ2FtZSgpIHsgcmV0dXJuIHRoaXMuX2dhbWUgfTtcclxuICAgIHB1YmxpYyBnZXQgYXBwKCkgeyByZXR1cm4gdGhpcy5fZ2FtZS5hcHAgfTtcclxuICAgIHB1YmxpYyBnZXQgZW50aXRpZXMoKSB7IHJldHVybiBBcnJheS5mcm9tKHRoaXMuX2VudGl0aWVzLnZhbHVlcygpKTsgfVxyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lOiBHYW1lKSB7XHJcbiAgICAgICAgdGhpcy5fZ2FtZSA9IGdhbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldHVwV29ybGQoKSB7XHJcbiAgICAgICAgY29uc3QgZmxvb3IgPSBTaGFwZVV0aWxzLmNyZWF0ZVJlY3RhbmdsZSh0aGlzLmFwcCwgJ2Zsb29yJywgbmV3IHBjLlZlYzMoKSwgbmV3IHBjLlZlYzMoMTUsIDEsIDE1KSwgZmFsc2UsIG5ldyBwYy5Db2xvcigwLCAwLjUsIDApKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5nYW1lLmlzU2VydmVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHAgPSB0aGlzLmNyZWF0ZVBsYXllcihuZXcgcGMuVmVjMygpKTtcclxuICAgICAgICAgICAgcC5mcm9tSlNPTih7aW5wdXRIOiAxfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEVudGl0eShpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VudGl0aWVzLmdldChpZCkhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoYXNFbnRpdHkoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbnRpdGllcy5oYXMoaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95RW50aXR5KGlkOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLl9lbnRpdGllcy5nZXQoaWQpITtcclxuICAgICAgICB0aGlzLmFwcC5yb290LnJlbW92ZUNoaWxkKGVudGl0eSk7XHJcbiAgICAgICAgdGhpcy5fZW50aXRpZXMuZGVsZXRlKGlkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlUGxheWVyKHBvc2l0aW9uPzogcGMuVmVjMywgY3VzdG9tSWQ/OiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBlbnRpdHkgPSBuZXcgRW50aXR5UGxheWVyKCdwbGF5ZXInKTtcclxuXHJcbiAgICAgICAgaWYoY3VzdG9tSWQpIGVudGl0eS5zZXRJZChjdXN0b21JZCk7XHJcblxyXG4gICAgICAgIGlmKHBvc2l0aW9uID09PSB1bmRlZmluZWQpIHBvc2l0aW9uID0gbmV3IHBjLlZlYzMoTWF0aC5yYW5kb20oKSo2LTMsIDEsIE1hdGgucmFuZG9tKCkqNi0zKTtcclxuICAgIFxyXG4gICAgICAgIGVudGl0eS5pbml0KCk7XHJcbiAgICAgICAgZW50aXR5LnRlbGVwb3J0KHBvc2l0aW9uKVxyXG5cclxuICAgICAgICB0aGlzLmFwcC5yb290LmFkZENoaWxkKGVudGl0eSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2VudGl0aWVzLnNldChlbnRpdHkuaWQsIGVudGl0eSk7XHJcblxyXG4gICAgICAgIHJldHVybiBlbnRpdHk7XHJcbiAgICB9XHJcbiAgICBcclxufVxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBTaGFwZVV0aWxzIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlUmVjdGFuZ2xlKGFwcDogcGMuQXBwbGljYXRpb24sIG5hbWU6IHN0cmluZywgcG9zaXRpb246IHBjLlZlYzMsIHNpemU6IHBjLlZlYzMsIGlzRHluYW1pYzogYm9vbGVhbiwgY29sb3I6IHBjLkNvbG9yKSB7XHJcbiAgICAgICAgY29uc3QgZW50aXR5ID0gbmV3IHBjLkVudGl0eShuYW1lKTtcclxuICAgICAgICBlbnRpdHkuc2V0UG9zaXRpb24ocG9zaXRpb24pXHJcbiAgICAgICAgdGhpcy5jcmVhdGVSZWN0YW5nbGVBdEVudGl0eShlbnRpdHksIHNpemUsIGlzRHluYW1pYywgY29sb3IpO1xyXG4gICAgICAgIGFwcC5yb290LmFkZENoaWxkKGVudGl0eSk7XHJcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVSZWN0YW5nbGVBdEVudGl0eShlbnRpdHk6IHBjLkVudGl0eSwgc2l6ZTogcGMuVmVjMywgaXNEeW5hbWljOiBib29sZWFuLCBjb2xvcjogcGMuQ29sb3IpIHtcclxuICAgICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KCdyaWdpZGJvZHknLCB7XHJcbiAgICAgICAgICAgIHR5cGU6IGlzRHluYW1pYyA/ICdkeW5hbWljJyA6ICdzdGF0aWMnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZW50aXR5LmFkZENvbXBvbmVudCgnY29sbGlzaW9uJywge1xyXG4gICAgICAgICAgICB0eXBlOiAnYm94JyxcclxuICAgICAgICAgICAgaGFsZkV4dGVudHM6IG5ldyBwYy5WZWMzKHNpemUueC8yLCBzaXplLnkvMiwgc2l6ZS56LzIpXHJcbiAgICAgICAgfSk7XHJcbiAgICBcclxuICAgICAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBwYy5TdGFuZGFyZE1hdGVyaWFsKCk7XHJcbiAgICAgICAgbWF0ZXJpYWwuZGlmZnVzZSA9IGNvbG9yO1xyXG4gICAgICAgIG1hdGVyaWFsLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgY29uc3QgY3ViZSA9IG5ldyBwYy5FbnRpdHkoJ2N1YmUnKTtcclxuICAgICAgICBjdWJlLmFkZENvbXBvbmVudChcInJlbmRlclwiLCB7XHJcbiAgICAgICAgICAgIG1hdGVyaWFsOiBtYXRlcmlhbCxcclxuICAgICAgICAgICAgdHlwZTogXCJib3hcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGN1YmUuc2V0TG9jYWxTY2FsZShzaXplKVxyXG4gICAgICAgIGVudGl0eS5hZGRDaGlsZChjdWJlKTtcclxuICAgICAgICByZXR1cm4gZW50aXR5O1xyXG4gICAgfVxyXG59XHJcblxyXG4iLCIvKiAoaWdub3JlZCkgKi8iLCIvKiAoaWdub3JlZCkgKi8iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkc1tpXV0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtkbWRhc3NjX2dhbWVcIl0gPSBzZWxmW1wid2VicGFja0NodW5rZG1kYXNzY19nYW1lXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxuX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9yc1wiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKSkpXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnNcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi93ZWJwYWNrL2NyZWRpdHMuanNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==