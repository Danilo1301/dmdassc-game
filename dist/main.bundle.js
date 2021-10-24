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
        if (this.isServer) {
            this.app.setCanvasResolution(pc.RESOLUTION_FIXED, 10, 10);
            return;
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQzNCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1VFaERBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9jbGllbnQvY2xpZW50LnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9lbnRpdHkvYmFzZUVudGl0eS50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvZW50aXR5L2VudGl0eVBsYXllci50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvZ2FtZS9nYW1lLnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9nYW1lL2dhbWVDbGllbnQudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL2dhbWUvZ2FtZVNlcnZlci50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL25ldHdvcmsvbmV0d29yay50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvcGFja2V0L3BhY2tldC50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvc2NyaXB0cy9jYW1lcmFGb2xsb3cudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL3NjcmlwdHMvZW50aXR5U3luYy50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvc2NyaXB0cy9tb3ZlbWVudC50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvd29ybGQvd29ybGQudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL2lnbm9yZWR8QzpcXFVzZXJzXFxkYW5pbFxcRGVza3RvcFxcZG1kYXNzYy1nYW1lXFxub2RlX21vZHVsZXNcXGFtbW8uanN8ZnMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL2lnbm9yZWR8QzpcXFVzZXJzXFxkYW5pbFxcRGVza3RvcFxcZG1kYXNzYy1nYW1lXFxub2RlX21vZHVsZXNcXGFtbW8uanN8cGF0aCIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVudGl0eVBsYXllciB9IGZyb20gXCIuLi9lbnRpdHkvZW50aXR5UGxheWVyXCI7XHJcbmltcG9ydCB7IEdhbWVTZXJ2ZXIgfSBmcm9tIFwiLi4vZ2FtZS9nYW1lU2VydmVyXCI7XHJcbmltcG9ydCB7IElQYWNrZXQsIElQYWNrZXREYXRhX0Nvbm5lY3RUb1NlcnZlclN0YXR1cywgSVBhY2tldERhdGFfRW50aXR5RGF0YSwgUGFja2V0VHlwZSB9IGZyb20gXCIuLi9wYWNrZXQvcGFja2V0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2xpZW50IHtcclxuICAgIHByaXZhdGUgX2dhbWU6IEdhbWVTZXJ2ZXI7XHJcbiAgICBwcml2YXRlIF9pZDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfcGxheWVyPzogRW50aXR5UGxheWVyO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgZ2FtZSgpIHsgcmV0dXJuIHRoaXMuX2dhbWU7IH1cclxuICAgIHB1YmxpYyBnZXQgaWQoKSB7IHJldHVybiB0aGlzLl9pZDsgfVxyXG4gICAgcHVibGljIGdldCBwbGF5ZXIoKSB7IHJldHVybiB0aGlzLl9wbGF5ZXI7IH1cclxuXHJcbiAgICBwcml2YXRlIF9zZW5kUGFja2V0c0RlbGF5OiBudW1iZXIgPSAxMDtcclxuICAgIHByaXZhdGUgX2xhc3RTZW50UGFja2V0czogbnVtYmVyID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lOiBHYW1lU2VydmVyLCBpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5fZ2FtZSA9IGdhbWU7XHJcbiAgICAgICAgdGhpcy5faWQgPSBpZDtcclxuXHJcbiAgICAgICAgdGhpcy5nYW1lLnNlbmRDbGllbnREYXRhKHRoaXMuaWQsIHtmcm9tOiBcImNsaWVudFwifSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShkdDogbnVtYmVyKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XHJcblxyXG4gICAgICAgIGlmKG5vdyAtIHRoaXMuX2xhc3RTZW50UGFja2V0cyA+PSB0aGlzLl9zZW5kUGFja2V0c0RlbGF5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xhc3RTZW50UGFja2V0cyA9IG5vdztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgZW50aXR5IG9mIHRoaXMuZ2FtZS53b3JsZC5lbnRpdGllcykge1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBwYWNrZXREYXRhOiBJUGFja2V0RGF0YV9FbnRpdHlEYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgZW50aXR5SWQ6IGVudGl0eS5pZCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eS50b0pTT04oKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNlbmQoUGFja2V0VHlwZS5FTlRJVFlfREFUQSwgcGFja2V0RGF0YSlcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkNvbm5lY3QoKSB7XHJcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy5fcGxheWVyID0gdGhpcy5nYW1lLndvcmxkLmNyZWF0ZVBsYXllcigpO1xyXG5cclxuICAgICAgICBjb25zdCBkYXRhOiBJUGFja2V0RGF0YV9Db25uZWN0VG9TZXJ2ZXJTdGF0dXMgPSB7XHJcbiAgICAgICAgICAgIHNlcnZlcklkOiAnc29tZWlkJyxcclxuICAgICAgICAgICAgZW50aXR5SWQ6IHBsYXllci5pZCxcclxuICAgICAgICAgICAgc3VjY2VzczogZmFsc2VcclxuICAgICAgICB9IFxyXG4gICAgICAgIHRoaXMuc2VuZChQYWNrZXRUeXBlLkNPTk5FQ1RfVE9fU0VSVkVSX1NUQVRVUywgZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uUmVjZWl2ZVBhY2tldChwYWNrZXQ6IElQYWNrZXQpIHtcclxuICAgICAgICBpZihwYWNrZXQudHlwZSA9PSBQYWNrZXRUeXBlLkVOVElUWV9EQVRBKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGE6IElQYWNrZXREYXRhX0VudGl0eURhdGEgPSBwYWNrZXQuZGF0YTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyPy5mcm9tSlNPTihkYXRhLmRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VuZCh0eXBlOiBQYWNrZXRUeXBlLCBkYXRhPzogYW55KSB7XHJcbiAgICAgICAgY29uc3QgcGFja2V0OiBJUGFja2V0ID0ge1xyXG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdhbWUuc2VuZENsaWVudERhdGEodGhpcy5pZCwgcGFja2V0KTtcclxuICAgIH1cclxufSIsImltcG9ydCAqIGFzIHBjIGZyb20gXCJwbGF5Y2FudmFzXCI7XHJcbmltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gJ3V1aWQnO1xyXG5pbXBvcnQgeyBFbnRpdHlTeW5jIH0gZnJvbSBcIi4uL3NjcmlwdHMvZW50aXR5U3luY1wiO1xyXG5pbXBvcnQgeyBNb3ZlbWVudCB9IGZyb20gXCIuLi9zY3JpcHRzL21vdmVtZW50XCI7XHJcblxyXG5jb25zdCBBbW1vID0gd2luZG93WydBbW1vJ107XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElFbnRpdHlEYXRhIHtcclxuICAgIHg/OiBudW1iZXJcclxuICAgIHk/OiBudW1iZXJcclxuICAgIHo/OiBudW1iZXJcclxuICAgIGlucHV0SD86IG51bWJlclxyXG4gICAgaW5wdXRWPzogbnVtYmVyXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBCYXNlRW50aXR5IGV4dGVuZHMgcGMuRW50aXR5IHtcclxuICAgIHByaXZhdGUgX2lkOiBzdHJpbmcgPSB1dWlkdjQoKTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGlkKCkgeyByZXR1cm4gdGhpcy5faWQ7IH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluaXQoKSB7fVxyXG5cclxuICAgIHB1YmxpYyBzZXRJZChpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5faWQgPSBpZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9KU09OKCkge1xyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5nZXRQb3NpdGlvbigpO1xyXG5cclxuICAgICAgICBjb25zdCBkYXRhOiBJRW50aXR5RGF0YSA9IHtcclxuICAgICAgICAgICAgeDogcG9zaXRpb24ueCxcclxuICAgICAgICAgICAgeTogcG9zaXRpb24ueSxcclxuICAgICAgICAgICAgejogcG9zaXRpb24ueixcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHMgPSB0aGlzLnNjcmlwdCEuZ2V0KCdtb3ZlbWVudCcpIGFzIE1vdmVtZW50IHwgbnVsbDtcclxuXHJcbiAgICAgICAgaWYocykge1xyXG4gICAgICAgICAgICBkYXRhLmlucHV0SCA9IHMuaG9yaXpvbnRhbDtcclxuICAgICAgICAgICAgZGF0YS5pbnB1dFYgPSBzLnZlcnRpY2FsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZyb21KU09OKGRhdGE6IElFbnRpdHlEYXRhKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhc0VudGl0eVN5bmMgPSB0aGlzLnNjcmlwdCEuaGFzKCdlbnRpdHlTeW5jJyk7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0UG9zaXRpb24gPSBoYXNFbnRpdHlTeW5jID8gKDxFbnRpdHlTeW5jPnRoaXMuc2NyaXB0IS5nZXQoJ2VudGl0eVN5bmMnKSkuZ2V0VGFyZ2V0UG9zaXRpb24oKSA6IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3UG9zaXRpb24gPSB0YXJnZXRQb3NpdGlvbiA/IHRhcmdldFBvc2l0aW9uIDogdGhpcy5nZXRQb3NpdGlvbigpO1xyXG5cclxuICAgICAgICBpZihkYXRhLnggIT09IHVuZGVmaW5lZCkgbmV3UG9zaXRpb24ueCA9IGRhdGEueDtcclxuICAgICAgICBpZihkYXRhLnkgIT09IHVuZGVmaW5lZCkgbmV3UG9zaXRpb24ueSA9IGRhdGEueTtcclxuICAgICAgICBpZihkYXRhLnogIT09IHVuZGVmaW5lZCkgbmV3UG9zaXRpb24ueiA9IGRhdGEuejtcclxuXHJcbiAgICAgICAgY29uc3QgcyA9IHRoaXMuc2NyaXB0IS5nZXQoJ21vdmVtZW50JykgYXMgTW92ZW1lbnQgfCBudWxsO1xyXG5cclxuICAgICAgICBpZihzKSB7XHJcblxyXG4gICAgICAgICAgICBpZihkYXRhLmlucHV0SCAhPT0gdW5kZWZpbmVkKSBzLmhvcml6b250YWwgPSBkYXRhLmlucHV0SDtcclxuICAgICAgICAgICAgaWYoZGF0YS5pbnB1dFYgIT09IHVuZGVmaW5lZCkgcy52ZXJ0aWNhbCA9IGRhdGEuaW5wdXRWO1xyXG5cclxuICAgICAgICAgICAgLy9pZihkYXRhLmlucHV0SCAhPT0gdW5kZWZpbmVkIHx8IGRhdGEuaW5wdXRWICE9PSB1bmRlZmluZWQpIGNvbnNvbGUubG9nKGRhdGEuaW5wdXRILCBkYXRhLmlucHV0VilcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICBcclxuXHJcbiAgICAgICAgaWYodGhpcy5zY3JpcHQhLmhhcygnZW50aXR5U3luYycpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHMgPSA8RW50aXR5U3luYz50aGlzLnNjcmlwdCEuZ2V0KCdlbnRpdHlTeW5jJyk7XHJcbiAgICAgICAgICAgIHMuc2V0VGFyZ2V0UG9zaXRpb24obmV3UG9zaXRpb24pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgdGhpcy50ZWxlcG9ydChuZXdQb3NpdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdGVsZXBvcnQocG9zaXRpb246IHBjLlZlYzMpIHtcclxuICAgICAgICB0aGlzLnJpZ2lkYm9keSEudGVsZXBvcnQocG9zaXRpb24ueCwgcG9zaXRpb24ueSwgcG9zaXRpb24ueik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFZlbG9jaXR5KHZlbG9jaXR5OiBwYy5WZWMzKSB7XHJcbiAgICAgICAgdGhpcy5yaWdpZGJvZHkhWydib2R5J10uc2V0TGluZWFyVmVsb2NpdHkobmV3IEFtbW8uYnRWZWN0b3IzKHZlbG9jaXR5LngsIHZlbG9jaXR5LnksIHZlbG9jaXR5LnopKVxyXG4gICAgfVxyXG59IiwiaW1wb3J0ICogYXMgcGMgZnJvbSBcInBsYXljYW52YXNcIjtcclxuaW1wb3J0IHsgTW92ZW1lbnQgfSBmcm9tIFwiLi4vc2NyaXB0cy9tb3ZlbWVudFwiO1xyXG5pbXBvcnQgeyBTaGFwZVV0aWxzLCBXb3JsZCB9IGZyb20gXCIuLi93b3JsZC93b3JsZFwiO1xyXG5pbXBvcnQgeyBCYXNlRW50aXR5IH0gZnJvbSBcIi4vYmFzZUVudGl0eVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVudGl0eVBsYXllciBleHRlbmRzIEJhc2VFbnRpdHkge1xyXG4gICAgY29uc3RydWN0b3IobmFtZSkge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRNb3ZlbWVudCgpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlQm9keSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRNb3ZlbWVudCgpIHtcclxuICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzO1xyXG4gICAgICAgIGxldCBzY3JpcHQgPSBlbnRpdHkuZmluZENvbXBvbmVudCgnc2NyaXB0JykgYXMgcGMuU2NyaXB0Q29tcG9uZW50IHwgdW5kZWZpbmVkO1xyXG4gICAgICAgIGlmKCFzY3JpcHQpIHNjcmlwdCA9IGVudGl0eS5hZGRDb21wb25lbnQoJ3NjcmlwdCcpIGFzIHBjLlNjcmlwdENvbXBvbmVudDtcclxuICAgICAgICBzY3JpcHQuY3JlYXRlKCdtb3ZlbWVudCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRDb250cm9sbGFibGUoKSB7XHJcbiAgICAgICAgdmFyIG0gPSB0aGlzLnNjcmlwdCEuZ2V0KCdtb3ZlbWVudCcpISBhcyBNb3ZlbWVudDtcclxuICAgICAgICBtLmNvbnRyb2xsZWRCeVBsYXllciA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZUJvZHkoKSB7XHJcbiAgICAgICAgY29uc3QgcyA9IDAuMjtcclxuICAgICAgICBjb25zdCBzaXplID0gbmV3IHBjLlZlYzMocyxzLHMpO1xyXG4gICAgIFxyXG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHRoaXM7XHJcbiAgICAgICAgZW50aXR5LnNldFBvc2l0aW9uKDAsIDIsIDApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFNoYXBlVXRpbHMuY3JlYXRlUmVjdGFuZ2xlQXRFbnRpdHkoZW50aXR5LCBzaXplLCB0cnVlLCBuZXcgcGMuQ29sb3IoMSwgMSwgMSkpO1xyXG5cclxuICAgICAgICAvL2VudGl0eS5yaWdpZGJvZHkhWydib2R5J10uc2V0QW5ndWxhckZhY3RvcigwLCAxLCAwKVxyXG4gICAgfVxyXG59IiwiaW1wb3J0ICogYXMgcGMgZnJvbSAncGxheWNhbnZhcydcclxuaW1wb3J0IHsgQ2FtZXJhRm9sbG93IH0gZnJvbSAnLi4vc2NyaXB0cy9jYW1lcmFGb2xsb3cnO1xyXG5pbXBvcnQgeyBFbnRpdHlTeW5jIH0gZnJvbSAnLi4vc2NyaXB0cy9lbnRpdHlTeW5jJztcclxuaW1wb3J0IHsgTW92ZW1lbnQgfSBmcm9tICcuLi9zY3JpcHRzL21vdmVtZW50JztcclxuaW1wb3J0IHsgV29ybGQgfSBmcm9tICcuLi93b3JsZC93b3JsZCc7XHJcbmltcG9ydCB7IEdhbWVDbGllbnQgfSBmcm9tICcuL2dhbWVDbGllbnQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWUge1xyXG4gICAgcHJpdmF0ZSBfaXNTZXJ2ZXI6IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIF9jYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBfYXBwOiBwYy5BcHBsaWNhdGlvbjtcclxuICAgIHByaXZhdGUgX3dvcmxkOiBXb3JsZDtcclxuICAgIFxyXG4gICAgcHVibGljIGdldCBpc1NlcnZlcigpIHsgcmV0dXJuIHRoaXMuX2lzU2VydmVyOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGFwcCgpIHsgcmV0dXJuIHRoaXMuX2FwcDsgfVxyXG4gICAgcHVibGljIGdldCB3b3JsZCgpIHsgcmV0dXJuIHRoaXMuX3dvcmxkOyB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgaXNDbGllbnQ/OiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5fY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgIHRoaXMuX2lzU2VydmVyID0gaXNDbGllbnQgIT09IHRydWU7XHJcbiAgICAgICAgdGhpcy5fd29ybGQgPSBuZXcgV29ybGQodGhpcyk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbR2FtZV0gY29uc3RydWN0b3I7IGlzU2VydmVyID1gLCB0aGlzLmlzU2VydmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5zZXR1cEFwcCgpO1xyXG4gICAgICAgIHRoaXMuYXBwLm9uKCd1cGRhdGUnLCAoZHQpID0+IHRoaXMudXBkYXRlKGR0KSk7XHJcbiAgICAgICAgdGhpcy5hcHAuc3RhcnQoKTtcclxuICAgICAgICB0aGlzLnNldHVwUmVzaXplKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cExvY2FsQ2xpZW50U2NlbmUoIXRoaXMuaXNTZXJ2ZXIpO1xyXG5cclxuICAgICAgICB0aGlzLndvcmxkLnNldHVwV29ybGQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlKGR0OiBudW1iZXIpIHt9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXR1cEFwcCgpIHtcclxuICAgICAgICBjb25zdCBjYW52YXMgPSB0aGlzLl9jYW52YXM7XHJcbiAgICAgICAgY29uc3QgYXBwID0gbmV3IHBjLkFwcGxpY2F0aW9uKGNhbnZhcywge1xyXG4gICAgICAgICAgICBtb3VzZTogbmV3IHBjLk1vdXNlKGNhbnZhcyksXHJcbiAgICAgICAgICAgIHRvdWNoOiBuZXcgcGMuVG91Y2hEZXZpY2UoY2FudmFzKSxcclxuICAgICAgICAgICAga2V5Ym9hcmQ6IG5ldyBwYy5LZXlib2FyZChkb2N1bWVudC5ib2R5KVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9hcHAgPSBhcHA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcGMucmVnaXN0ZXJTY3JpcHQoQ2FtZXJhRm9sbG93LCAnY2FtZXJhRm9sbG93JywgYXBwKTtcclxuICAgICAgICBwYy5yZWdpc3RlclNjcmlwdChNb3ZlbWVudCwgJ21vdmVtZW50JywgYXBwKTtcclxuICAgICAgICBwYy5yZWdpc3RlclNjcmlwdChFbnRpdHlTeW5jLCAnZW50aXR5U3luYycsIGFwcCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXR1cFJlc2l6ZSgpIHtcclxuXHJcbiAgICAgICAgaWYodGhpcy5pc1NlcnZlcikge1xyXG4gICAgICAgICAgICB0aGlzLmFwcC5zZXRDYW52YXNSZXNvbHV0aW9uKHBjLlJFU09MVVRJT05fRklYRUQsIDEwLCAxMCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYXBwLnNldENhbnZhc0ZpbGxNb2RlKHBjLkZJTExNT0RFX0ZJTExfV0lORE9XKTtcclxuICAgICAgICB0aGlzLmFwcC5zZXRDYW52YXNSZXNvbHV0aW9uKHBjLlJFU09MVVRJT05fQVVUTyk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB0aGlzLnJlc2l6ZSgpKTtcclxuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0dXBMb2NhbENsaWVudFNjZW5lKGlzTG9jYWxDbGllbnQ/OiBib29sZWFuKSB7XHJcbiAgICAgICAgY29uc3QgYXBwID0gdGhpcy5hcHA7XHJcblxyXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IG5ldyBwYy5FbnRpdHkoJ2NhbWVyYScpO1xyXG4gICAgICAgIGNhbWVyYS5hZGRDb21wb25lbnQoJ2NhbWVyYScsIHtcclxuICAgICAgICAgICAgY2xlYXJDb2xvcjogbmV3IHBjLkNvbG9yKDAuMSwgMC4xLCAwLjEpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYXBwLnJvb3QuYWRkQ2hpbGQoY2FtZXJhKTtcclxuICAgICAgICBjYW1lcmEuc2V0UG9zaXRpb24oMCwgNiwgMCk7XHJcbiAgICAgICAgY2FtZXJhLnNldEV1bGVyQW5nbGVzKC05MCwgMCwgMCk7XHJcbiAgICAgICAgKGNhbWVyYS5hZGRDb21wb25lbnQoJ3NjcmlwdCcpIGFzIHBjLlNjcmlwdENvbXBvbmVudCkuY3JlYXRlKCdjYW1lcmFGb2xsb3cnKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBsaWdodCA9IG5ldyBwYy5FbnRpdHkoJ2xpZ2h0Jyk7XHJcbiAgICAgICAgbGlnaHQuYWRkQ29tcG9uZW50KCdsaWdodCcpO1xyXG4gICAgICAgIGFwcC5yb290LmFkZENoaWxkKGxpZ2h0KTtcclxuICAgICAgICBsaWdodC5zZXRFdWxlckFuZ2xlcygzMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIGlmKGlzTG9jYWxDbGllbnQpIHtcclxuICAgICAgICAgICAgR2FtZUNsaWVudC5jYW1lcmEgPSBjYW1lcmE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXNpemUoKSB7XHJcbiAgICAgICAgY29uc3QgY2FudmFzID0gdGhpcy5fY2FudmFzO1xyXG5cclxuICAgICAgICB0aGlzLmFwcC5yZXNpemVDYW52YXMoKTtcclxuICAgICAgICBjYW52YXMuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XHJcblxyXG4gICAgICAgIFxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRW50aXR5UGxheWVyIH0gZnJvbSBcIi4uL2VudGl0eS9lbnRpdHlQbGF5ZXJcIjtcclxuaW1wb3J0IHsgTmV0d29yayB9IGZyb20gXCIuLi9uZXR3b3JrL25ldHdvcmtcIjtcclxuaW1wb3J0IHsgQ2FtZXJhRm9sbG93IH0gZnJvbSBcIi4uL3NjcmlwdHMvY2FtZXJhRm9sbG93XCI7XHJcbmltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi9nYW1lXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZUNsaWVudCBleHRlbmRzIEdhbWUge1xyXG4gICAgcHVibGljIHN0YXRpYyBwbGF5ZXI/OiBFbnRpdHlQbGF5ZXI7XHJcbiAgICBwdWJsaWMgc3RhdGljIGNhbWVyYTogcGMuRW50aXR5O1xyXG4gICAgcHVibGljIHN0YXRpYyBwbGF5ZXJJZDogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICBwcml2YXRlIF9uZXR3b3JrOiBOZXR3b3JrO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgbmV0d29yaygpIHsgcmV0dXJuIHRoaXMuX25ldHdvcms7IH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KSB7XHJcbiAgICAgICAgc3VwZXIoY2FudmFzLCB0cnVlKTtcclxuXHJcbiAgICAgICAgdGhpcy5fbmV0d29yayA9IG5ldyBOZXR3b3JrKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShkdCk7XHJcblxyXG4gICAgICAgIHRoaXMubmV0d29yay51cGRhdGUoZHQpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQoKSB7XHJcbiAgICAgICAgc3VwZXIuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5uZXR3b3JrLmNvbm5lY3QoKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgW05ldHdvcmtdIENvbm5lY3RlZD8gJHt0aGlzLm5ldHdvcmsuY29ubmVjdGVkfWApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgY2FtZXJhRm9sbG93RW50aXR5KHA6IHBjLkVudGl0eSkge1xyXG4gICAgICAgIGNvbnN0IHNjciA9IDxDYW1lcmFGb2xsb3c+KHRoaXMuY2FtZXJhLmZpbmRDb21wb25lbnQoJ3NjcmlwdCcpIGFzIHBjLlNjcmlwdENvbXBvbmVudCkuZ2V0KCdjYW1lcmFGb2xsb3cnKTtcclxuICAgICAgICBzY3IuZm9sbG93RW50aXR5ID0gcDtcclxuICAgICAgICBzY3IuZm9yY2VUZWxlcG9ydCgpO1xyXG4gICAgfVxyXG59IiwiXHJcbmltcG9ydCB7IENsaWVudCB9IGZyb20gXCIuLi9jbGllbnQvY2xpZW50XCI7XHJcbmltcG9ydCB7IElQYWNrZXQgfSBmcm9tIFwiLi4vcGFja2V0L3BhY2tldFwiO1xyXG5pbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4vZ2FtZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWVTZXJ2ZXIgZXh0ZW5kcyBHYW1lIHtcclxuICAgIHByaXZhdGUgX2NsaWVudHMgPSBuZXcgTWFwPHN0cmluZywgQ2xpZW50PigpO1xyXG4gICAgXHJcbiAgICBwdWJsaWMgZ2V0IGNsaWVudHMoKSB7IHJldHVybiBBcnJheS5mcm9tKHRoaXMuX2NsaWVudHMudmFsdWVzKCkpOyB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCkge1xyXG4gICAgICAgIHN1cGVyKGNhbnZhcyk7XHJcblxyXG4gICAgICAgIHdpbmRvd1snb25Tb2NrZXRDb25uZWN0J10gPSB0aGlzLm9uU29ja2V0Q29ubmVjdC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHdpbmRvd1snb25Tb2NrZXREaXNjb25uZWN0J10gPSB0aGlzLm9uU29ja2V0RGlzY29ubmVjdC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHdpbmRvd1snb25SZWNlaXZlU29ja2V0RGF0YSddID0gdGhpcy5vblJlY2VpdmVTb2NrZXREYXRhLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0KCkge1xyXG4gICAgICAgIHN1cGVyLnN0YXJ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZShkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKGR0KTtcclxuXHJcbiAgICAgICAgdGhpcy5jbGllbnRzLm1hcChjbGllbnQgPT4gY2xpZW50LnVwZGF0ZShkdCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25Tb2NrZXRDb25uZWN0KGlkOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgW0dhbWVTZXJ2ZXJdIE5ldyBzb2NrZXQgY29ubmVjdGlvbiAke2lkfWApO1xyXG5cclxuICAgICAgICBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50KHRoaXMsIGlkKTtcclxuICAgICAgICB0aGlzLl9jbGllbnRzLnNldChjbGllbnQuaWQsIGNsaWVudCk7XHJcblxyXG4gICAgICAgIGNsaWVudC5vbkNvbm5lY3QoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uU29ja2V0RGlzY29ubmVjdChpZDogc3RyaW5nLCByZWFzb246IHN0cmluZykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbR2FtZVNlcnZlcl0gU29ja2V0IGRpc2Nvbm5lY3QgJHtpZH06ICR7cmVhc29ufWApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25SZWNlaXZlU29ja2V0RGF0YShpZDogc3RyaW5nLCBkYXRhOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBwYWNrZXQgPSBKU09OLnBhcnNlKGRhdGEpIGFzIElQYWNrZXQ7XHJcblxyXG4gICAgICAgIHRoaXMuX2NsaWVudHMuZ2V0KGlkKSEub25SZWNlaXZlUGFja2V0KHBhY2tldCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbmRDbGllbnREYXRhKGlkOiBzdHJpbmcsIGRhdGE6IGFueSkge1xyXG4gICAgICAgIGNvbnN0IHN0ciA9IHR5cGVvZiBkYXRhID09ICdzdHJpbmcnID8gZGF0YSA6IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKGBbR2FtZVNlcnZlcl0gU2VuZGluZyB0byAke2lkfTogJHtzdHJ9YCk7XHJcblxyXG4gICAgICAgIHdpbmRvd1snc2VuZENsaWVudERhdGEnXShpZCwgc3RyKTtcclxuICAgIH1cclxufSIsImNvbnN0IEFtbW8gPSByZXF1aXJlKCdhbW1vLmpzJyk7XHJcbndpbmRvd1snQW1tbyddID0gQW1tbztcclxuXHJcbmltcG9ydCB7IEdhbWVDbGllbnQgfSBmcm9tIFwiLi9nYW1lL2dhbWVDbGllbnRcIjtcclxuaW1wb3J0IHsgR2FtZVNlcnZlciB9IGZyb20gXCIuL2dhbWUvZ2FtZVNlcnZlclwiO1xyXG5cclxuY29uc3QgaXNTZXJ2ZXIgPSBsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwiI3NlcnZlclwiKTtcclxuXHJcbmlmKGlzU2VydmVyKSB7XHJcbiAgICBjb25zdCBzZXJ2ZXIgPSBuZXcgR2FtZVNlcnZlcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZScpIGFzIEhUTUxDYW52YXNFbGVtZW50KTtcclxuICAgIHNlcnZlci5zdGFydCgpO1xyXG4gICAgd2luZG93WydnYW1lJ10gPSBzZXJ2ZXI7XHJcbn0gZWxzZSB7XHJcbiAgICBjb25zdCBjbGllbnQgPSBuZXcgR2FtZUNsaWVudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZScpIGFzIEhUTUxDYW52YXNFbGVtZW50KTtcclxuICAgIGNsaWVudC5zdGFydCgpO1xyXG4gICAgd2luZG93WydnYW1lJ10gPSBjbGllbnQ7XHJcbn1cclxuXHJcbiIsImltcG9ydCB7IGlvLCBTb2NrZXQgfSBmcm9tIFwic29ja2V0LmlvLWNsaWVudFwiO1xyXG5pbXBvcnQgeyBCYXNlRW50aXR5IH0gZnJvbSBcIi4uL2VudGl0eS9iYXNlRW50aXR5XCI7XHJcbmltcG9ydCB7IEVudGl0eVBsYXllciB9IGZyb20gXCIuLi9lbnRpdHkvZW50aXR5UGxheWVyXCI7XHJcbmltcG9ydCB7IEdhbWVDbGllbnQgfSBmcm9tIFwiLi4vZ2FtZS9nYW1lQ2xpZW50XCI7XHJcbmltcG9ydCB7IElQYWNrZXQsIElQYWNrZXREYXRhX0Nvbm5lY3RUb1NlcnZlclN0YXR1cywgSVBhY2tldERhdGFfRW50aXR5RGF0YSwgUGFja2V0VHlwZSB9IGZyb20gXCIuLi9wYWNrZXQvcGFja2V0XCI7XHJcbmltcG9ydCB7IEVudGl0eVN5bmMgfSBmcm9tIFwiLi4vc2NyaXB0cy9lbnRpdHlTeW5jXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTmV0d29yayB7XHJcbiAgICBwcml2YXRlIF9nYW1lOiBHYW1lQ2xpZW50O1xyXG4gICAgcHJpdmF0ZSBfc29ja2V0OiBTb2NrZXQ7XHJcblxyXG4gICAgcHVibGljIGdldCBnYW1lKCkgeyByZXR1cm4gdGhpcy5fZ2FtZTsgfVxyXG4gICAgcHVibGljIGdldCBjb25uZWN0ZWQoKSB7IHJldHVybiB0aGlzLl9zb2NrZXQuY29ubmVjdGVkOyB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VuZFBhY2tldHNEZWxheTogbnVtYmVyID0gMzA7XHJcbiAgICBwcml2YXRlIF9sYXN0U2VudFBhY2tldHM6IG51bWJlciA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZUNsaWVudCkge1xyXG4gICAgICAgIHRoaXMuX2dhbWUgPSBnYW1lO1xyXG5cclxuICAgICAgICAvL2h0dHBzOi8vZG1kYXNzYy1nYW1lLmdsaXRjaC5tZS9cclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBhZGRyZXNzID0gYCR7bG9jYXRpb24ucHJvdG9jb2x9Ly8ke2xvY2F0aW9uLmhvc3R9L2dhbWVgO1xyXG4gICAgICAgIHRoaXMuX3NvY2tldCA9IGlvKGFkZHJlc3MsIHtcclxuICAgICAgICAgICAgLy9wYXRoOiAnL3NvY2tldCcsXHJcbiAgICAgICAgICAgIGF1dG9Db25uZWN0OiBmYWxzZSxcclxuICAgICAgICAgICAgcmVjb25uZWN0aW9uOiBmYWxzZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbignX2RhdGEnLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwYWNrZXQgPSBKU09OLnBhcnNlKGRhdGEpIGFzIElQYWNrZXQ7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9uUmVjZWl2ZVBhY2tldChwYWNrZXQpO1xyXG5cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhgW05ldHdvcmtdIFJlY2VpdmVkOmAsIGRhdGEpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbTmV0d29ya10gQWRkcmVzczogKCR7YWRkcmVzc30pYCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvbm5lY3QoY2FsbGJhY2s/OiAoKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFtOZXR3b3JrXSBDb25uZWN0aW5nLi4uYCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3NvY2tldC5jb25uZWN0KCk7XHJcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uY2UoJ2Nvbm5lY3QnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrPy4oKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCB3b3JsZCA9IHRoaXMuZ2FtZS53b3JsZDtcclxuICAgICAgICBjb25zdCBlbnRpdHkgPSBHYW1lQ2xpZW50LnBsYXllcjtcclxuXHJcbiAgICAgICAgaWYoIXdvcmxkKSByZXR1cm47XHJcbiAgICAgICAgaWYoIWVudGl0eSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xyXG5cclxuICAgICAgICBpZihub3cgLSB0aGlzLl9sYXN0U2VudFBhY2tldHMgPj0gdGhpcy5fc2VuZFBhY2tldHNEZWxheSkge1xyXG4gICAgICAgICAgICB0aGlzLl9sYXN0U2VudFBhY2tldHMgPSBub3c7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBwYWNrZXREYXRhOiBJUGFja2V0RGF0YV9FbnRpdHlEYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgZW50aXR5SWQ6IGVudGl0eS5pZCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGVudGl0eS50b0pTT04oKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNlbmQoUGFja2V0VHlwZS5FTlRJVFlfREFUQSwgcGFja2V0RGF0YSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VuZCh0eXBlOiBQYWNrZXRUeXBlLCBkYXRhPzogYW55KSB7XHJcbiAgICAgICAgY29uc3QgcGFja2V0OiBJUGFja2V0ID0ge1xyXG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9zb2NrZXQuZW1pdCgnX2RhdGEnLCBKU09OLnN0cmluZ2lmeShwYWNrZXQpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uUmVjZWl2ZVBhY2tldChwYWNrZXQ6IElQYWNrZXQpIHtcclxuICAgICAgICBpZihwYWNrZXQudHlwZSA9PSBQYWNrZXRUeXBlLkNPTk5FQ1RfVE9fU0VSVkVSX1NUQVRVUykge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhOiBJUGFja2V0RGF0YV9Db25uZWN0VG9TZXJ2ZXJTdGF0dXMgPSBwYWNrZXQuZGF0YTtcclxuICAgICAgICAgICAgR2FtZUNsaWVudC5wbGF5ZXJJZCA9IGRhdGEuZW50aXR5SWQ7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhHYW1lQ2xpZW50LnBsYXllcklkKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYocGFja2V0LnR5cGUgPT0gUGFja2V0VHlwZS5FTlRJVFlfREFUQSkge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhOiBJUGFja2V0RGF0YV9FbnRpdHlEYXRhID0gcGFja2V0LmRhdGE7XHJcbiAgICAgICAgICAgIGNvbnN0IHdvcmxkID0gdGhpcy5fZ2FtZS53b3JsZDtcclxuXHJcbiAgICAgICAgICAgIGxldCBpc05ld0VudGl0eTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgaWYoIXdvcmxkLmhhc0VudGl0eShkYXRhLmVudGl0eUlkKSkge1xyXG4gICAgICAgICAgICAgICAgd29ybGQuY3JlYXRlUGxheWVyKHVuZGVmaW5lZCwgZGF0YS5lbnRpdHlJZCk7XHJcbiAgICAgICAgICAgICAgICBpc05ld0VudGl0eSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ25ldyBlbnRpeScpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IHdvcmxkLmdldEVudGl0eShkYXRhLmVudGl0eUlkKTtcclxuXHJcbiAgICAgICAgICAgIGVudGl0eS5mcm9tSlNPTihkYXRhLmRhdGEpO1xyXG5cclxuICAgICAgICAgICAgaWYoaXNOZXdFbnRpdHkpIHtcclxuICAgICAgICAgICAgICAgIGVudGl0eS5zY3JpcHQhLmNyZWF0ZSgnZW50aXR5U3luYycpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGlmKGVudGl0eS5pZCA9PSBHYW1lQ2xpZW50LnBsYXllcklkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoIUdhbWVDbGllbnQucGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgR2FtZUNsaWVudC5wbGF5ZXIgPSBlbnRpdHkgYXMgRW50aXR5UGxheWVyO1xyXG4gICAgICAgICAgICAgICAgICAgIEdhbWVDbGllbnQucGxheWVyLnNldENvbnRyb2xsYWJsZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBHYW1lQ2xpZW50LmNhbWVyYUZvbGxvd0VudGl0eShlbnRpdHkpO1xyXG5cclxuICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBpZihHYW1lQ2xpZW50LnBsYXllci5zY3JpcHQhLmhhcyhFbnRpdHlTeW5jKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYSA9IEdhbWVDbGllbnQucGxheWVyLnNjcmlwdCEuZ2V0KEVudGl0eVN5bmMpISBhcyBFbnRpdHlTeW5jO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhLmVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGVudW0gUGFja2V0VHlwZSB7XHJcbiAgICBSRVFVRVNUX1NFUlZFUl9MSVNULFxyXG4gICAgU0VSVkVSX0xJU1QsXHJcbiAgICBDT05ORUNUX1RPX1NFUlZFUixcclxuICAgIENPTk5FQ1RfVE9fU0VSVkVSX1NUQVRVUyxcclxuICAgIEVOVElUWV9EQVRBXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhY2tldCB7XHJcbiAgICB0eXBlOiBQYWNrZXRUeXBlXHJcbiAgICBkYXRhPzogYW55XHJcbn1cclxuXHJcbi8qXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhY2tldERhdGFfU2VydmVyTGlzdCB7XHJcbiAgICBzZXJ2ZXJzOiBTZXJ2ZXJJbmZvW11cclxufVxyXG4qL1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUGFja2V0RGF0YV9Db25uZWN0VG9TZXJ2ZXIge1xyXG4gICAgaWQ6IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQYWNrZXREYXRhX0lkIHtcclxuICAgIGlkOiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUGFja2V0RGF0YV9Db25uZWN0VG9TZXJ2ZXJTdGF0dXMge1xyXG4gICAgc2VydmVySWQ6IHN0cmluZ1xyXG4gICAgZW50aXR5SWQ6IHN0cmluZ1xyXG4gICAgc3VjY2VzczogYm9vbGVhblxyXG4gICAgZXJyb3JNZXNzYWdlPzogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhY2tldERhdGFfRW50aXR5RGF0YSB7XHJcbiAgICBlbnRpdHlJZDogc3RyaW5nXHJcbiAgICBkYXRhOiBhbnlcclxufSIsImltcG9ydCAqIGFzIHBjIGZyb20gXCJwbGF5Y2FudmFzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2FtZXJhRm9sbG93IGV4dGVuZHMgcGMuU2NyaXB0VHlwZSB7XHJcblxyXG4gICAgcHVibGljIGhlaWdodDogbnVtYmVyID0gNTtcclxuICAgIHB1YmxpYyBmb2xsb3dFbnRpdHk6IHBjLkVudGl0eSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIGxlcnA6IG51bWJlciA9IDE7XHJcblxyXG4gICAgcHVibGljIGluaXRpYWxpemUoKSB7XHJcbiAgICAgICAgdGhpcy5maXJlKCdpbml0aWFsaXplJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBvc3RJbml0aWFsaXplKCkge1xyXG4gICAgICAgIHRoaXMuZmlyZSgncG9zdEluaXRpYWxpemUnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZm9yY2VUZWxlcG9ydCgpIHtcclxuICAgICAgICBpZih0aGlzLmZvbGxvd0VudGl0eSkgdGhpcy5lbnRpdHkuc2V0UG9zaXRpb24odGhpcy5nZXRUYXJnZXRQb3NpdGlvbigpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFRhcmdldFBvc2l0aW9uKCkge1xyXG5cclxuICAgICAgICBpZighdGhpcy5mb2xsb3dFbnRpdHkpIHJldHVybiBwYy5WZWMzLlpFUk87XHJcblxyXG4gICAgICAgIGNvbnN0IGZvbGxvd0VudGl0eVBvc2l0aW9uID0gdGhpcy5mb2xsb3dFbnRpdHkuZ2V0UG9zaXRpb24oKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCB0YXJnZXRQb3NpdGlvbiA9IG5ldyBwYy5WZWMzKFxyXG4gICAgICAgICAgICBmb2xsb3dFbnRpdHlQb3NpdGlvbi54LFxyXG4gICAgICAgICAgICBmb2xsb3dFbnRpdHlQb3NpdGlvbi55ICsgdGhpcy5oZWlnaHQsXHJcbiAgICAgICAgICAgIGZvbGxvd0VudGl0eVBvc2l0aW9uLnpcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gdGFyZ2V0UG9zaXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwdWJsaWMgdXBkYXRlKGR0KSB7XHJcbiAgICAgICAgdGhpcy5maXJlKCd1cGRhdGUnLCBkdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBvc3RVcGRhdGUoZHQpIHtcclxuICAgICAgICB0aGlzLmZpcmUoJ3Bvc3RVcGRhdGUnLCBkdCk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuZm9sbG93RW50aXR5ID09IG51bGwpIHJldHVybjtcclxuXHJcblxyXG4gICAgICAgIGNvbnN0IG5ld1Bvc2l0aW9uID0gbmV3IHBjLlZlYzMoKS5sZXJwKFxyXG4gICAgICAgICAgICB0aGlzLmVudGl0eS5nZXRQb3NpdGlvbigpLFxyXG4gICAgICAgICAgICB0aGlzLmdldFRhcmdldFBvc2l0aW9uKCksXHJcbiAgICAgICAgICAgIHRoaXMubGVycFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMuZW50aXR5LnNldFBvc2l0aW9uKG5ld1Bvc2l0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3dhcCgpIHtcclxuICAgICAgICB0aGlzLmZpcmUoJ3N3YXAnKTtcclxuICAgIH1cclxufVxyXG5cclxuQ2FtZXJhRm9sbG93LmF0dHJpYnV0ZXMuYWRkKCdoZWlnaHQnLCB7dHlwZTogJ251bWJlcicsIGRlZmF1bHQ6IDV9KTtcclxuQ2FtZXJhRm9sbG93LmF0dHJpYnV0ZXMuYWRkKCdmb2xsb3dFbnRpdHknLCB7dHlwZTogJ2VudGl0eSd9KTsiLCJpbXBvcnQgKiBhcyBwYyBmcm9tIFwicGxheWNhbnZhc1wiO1xyXG5pbXBvcnQgeyBCYXNlRW50aXR5IH0gZnJvbSBcIi4uL2VudGl0eS9iYXNlRW50aXR5XCI7XHJcbmltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi4vZ2FtZS9nYW1lXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRW50aXR5U3luYyBleHRlbmRzIHBjLlNjcmlwdFR5cGUge1xyXG5cclxuICAgIHB1YmxpYyBlbnRpdHk6IEJhc2VFbnRpdHk7XHJcbiAgICBwdWJsaWMgcG9zaXRpb25MZXJwOiBudW1iZXIgPSAwLjM7XHJcblxyXG4gICAgcHJpdmF0ZSBfdGFyZ2V0UG9zaXRpb246IHBjLlZlYzMgfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgcHVibGljIGluaXRpYWxpemUoKSB7XHJcbiAgICAgICAgdGhpcy5maXJlKCdpbml0aWFsaXplJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShkdCkge1xyXG4gICAgICAgIHRoaXMuZmlyZSgndXBkYXRlJywgZHQpO1xyXG5cclxuICAgICAgICBjb25zdCB0YXJnZXRQb3NpdGlvbiA9IHRoaXMuX3RhcmdldFBvc2l0aW9uO1xyXG5cclxuICAgICAgICBpZighdGFyZ2V0UG9zaXRpb24pIHJldHVybjtcclxuXHJcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmVudGl0eS5nZXRQb3NpdGlvbigpO1xyXG4gICAgICAgIGNvbnN0IGRpc3RhbmNlID0gdGFyZ2V0UG9zaXRpb24uZGlzdGFuY2UocG9zaXRpb24pO1xyXG5cclxuICAgICAgICBsZXQgcG9zaXRpb25MZXJwID0gdGhpcy5wb3NpdGlvbkxlcnA7XHJcblxyXG4gICAgICAgIGlmKGRpc3RhbmNlIDwgMC4xKSB7XHJcbiAgICAgICAgICAgIC8vcG9zaXRpb25MZXJwID0gMC4wNVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihkaXN0YW5jZSA+IDAuNSkge1xyXG4gICAgICAgICAgICBwb3NpdGlvbkxlcnAgPSAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9hZGp1c3QgbGVycCBieSBkZWx0YSBtb3ZlbWVudFxyXG5cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgY29uc3QgbmV3UG9zaXRpb24gPSBuZXcgcGMuVmVjMyhcclxuICAgICAgICAgICAgcGMubWF0aC5sZXJwKHBvc2l0aW9uLngsIHRhcmdldFBvc2l0aW9uLngsIHBvc2l0aW9uTGVycCksXHJcbiAgICAgICAgICAgIHBjLm1hdGgubGVycChwb3NpdGlvbi55LCB0YXJnZXRQb3NpdGlvbi55LCBwb3NpdGlvbkxlcnApLFxyXG4gICAgICAgICAgICBwYy5tYXRoLmxlcnAocG9zaXRpb24ueiwgdGFyZ2V0UG9zaXRpb24ueiwgcG9zaXRpb25MZXJwKVxyXG4gICAgICAgICk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmVudGl0eS50ZWxlcG9ydChuZXdQb3NpdGlvbik7XHJcblxyXG4gICAgICAgIGxldCBBbW1vID0gd2luZG93WydBbW1vJ107XHJcbiAgICAgICAgdGhpcy5lbnRpdHkucmlnaWRib2R5IVsnYm9keSddLnNldExpbmVhclZlbG9jaXR5KG5ldyBBbW1vLmJ0VmVjdG9yMygwLCAwLCAwKSlcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgaWYoZGlzdGFuY2UgPCAwLjAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW50aXR5LnRlbGVwb3J0KHRhcmdldFBvc2l0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5fdGFyZ2V0UG9zaXRpb24gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0VGFyZ2V0UG9zaXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RhcmdldFBvc2l0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRUYXJnZXRQb3NpdGlvbihwb3NpdGlvbjogcGMuVmVjMykge1xyXG4gICAgICAgIHRoaXMuX3RhcmdldFBvc2l0aW9uID0gcG9zaXRpb24uY2xvbmUoKTtcclxuICAgIH1cclxufSIsImltcG9ydCAqIGFzIHBjIGZyb20gXCJwbGF5Y2FudmFzXCI7XHJcbmltcG9ydCB7IEJhc2VFbnRpdHkgfSBmcm9tIFwiLi4vZW50aXR5L2Jhc2VFbnRpdHlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNb3ZlbWVudCBleHRlbmRzIHBjLlNjcmlwdFR5cGUge1xyXG5cclxuICAgIHByaXZhdGUgZm9yY2UgPSBuZXcgcGMuVmVjMygpO1xyXG5cclxuICAgIHB1YmxpYyBlbnRpdHk6IEJhc2VFbnRpdHk7XHJcblxyXG4gICAgcHVibGljIGNvbnRyb2xsZWRCeVBsYXllcjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGhvcml6b250YWw6IG51bWJlciA9IDA7XHJcbiAgICBwdWJsaWMgdmVydGljYWw6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHVibGljIGluaXRpYWxpemUoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJbTW92ZW1lbnRTY3JpcHRdIGluaXRpYWxpemVcIilcclxuXHJcbiAgICAgICAgdGhpcy5maXJlKCdpbml0aWFsaXplJyk7XHJcblxyXG4gICAgICAgIHZhciB0ZXh0TWVhc3VyZSA9IG5ldyBwYy5FbnRpdHkoKTtcclxuICAgICAgICB0ZXh0TWVhc3VyZS5uYW1lID0gXCJ0ZXh0TWVhc3VyZVwiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRleHRNZWFzdXJlLmFkZENvbXBvbmVudCgnZWxlbWVudCcsIHtcclxuICAgICAgICAgICAgdHlwZTogcGMuRUxFTUVOVFRZUEVfVEVYVCAsXHJcbiAgICAgICAgICAgIHdpZHRoOiAyNTYsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjU2LFxyXG4gICAgICAgICAgICBmb250U2l6ZTogMjQsIFxyXG4gICAgICAgICAgICByZWN0OiBbMCwwLDEsMC4yNV0sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGV4dE1lYXN1cmUuZWxlbWVudCEudGV4dCA9ICdoZWxvPT09PT09PT09PT09PT09PT09PT09PT09PSc7XHJcbiAgICBcclxuXHJcbiAgICAgICAgdGhpcy5lbnRpdHkuYWRkQ2hpbGQodGV4dE1lYXN1cmUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGR0KSB7XHJcbiAgICAgICAgdGhpcy5maXJlKCd1cGRhdGUnLCBkdCk7XHJcblxyXG4gICAgICAgIGxldCBmb3JjZVkgPSAwO1xyXG5cclxuICAgICAgICBpZih0aGlzLmNvbnRyb2xsZWRCeVBsYXllcikge1xyXG4gICAgICAgICAgICB0aGlzLmhvcml6b250YWwgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRpY2FsID0gMDtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmFwcC5rZXlib2FyZC5pc1ByZXNzZWQocGMuS0VZX0xFRlQpKSB0aGlzLmhvcml6b250YWwgPSAtMTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYXBwLmtleWJvYXJkLmlzUHJlc3NlZChwYy5LRVlfUklHSFQpKSB0aGlzLmhvcml6b250YWwgKz0gMTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYXBwLmtleWJvYXJkLmlzUHJlc3NlZChwYy5LRVlfVVApKSB0aGlzLnZlcnRpY2FsID0gLTE7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmFwcC5rZXlib2FyZC5pc1ByZXNzZWQocGMuS0VZX0RPV04pKSB0aGlzLnZlcnRpY2FsICs9IDE7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmFwcC5rZXlib2FyZC5pc1ByZXNzZWQocGMuS0VZX1NQQUNFKSkgZm9yY2VZICs9IDAuMjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL3RoaXMudmVydGljYWwgPSAtMC41O1xyXG4gICAgXHJcbiAgICAgICAgY29uc3Qgc3BlZWQgPSAwLjE7XHJcblxyXG4gICAgICAgIHRoaXMuZm9yY2UueCA9IHRoaXMuaG9yaXpvbnRhbCAqIHNwZWVkO1xyXG4gICAgICAgIHRoaXMuZm9yY2UueSA9IDA7XHJcbiAgICAgICAgdGhpcy5mb3JjZS56ID0gdGhpcy52ZXJ0aWNhbCAqIHNwZWVkO1xyXG5cclxuICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuZm9yY2UubGVuZ3RoKCkpIHtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIHZhciByWCA9IE1hdGguY29zKC1NYXRoLlBJICogMC4yNSk7XHJcbiAgICAgICAgICAgIHZhciByWSA9IE1hdGguc2luKC1NYXRoLlBJICogMC4yNSk7XHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgclggPSBNYXRoLmNvcygwKTtcclxuICAgICAgICAgICAgdmFyIHJZID0gTWF0aC5zaW4oMCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmZvcmNlLnNldCh0aGlzLmZvcmNlLnggKiByWCAtIHRoaXMuZm9yY2UueiAqIHJZLCAwLCB0aGlzLmZvcmNlLnogKiByWCArIHRoaXMuZm9yY2UueCAqIHJZKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZvcmNlLmxlbmd0aCgpID4gc3BlZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9yY2Uubm9ybWFsaXplKCkubXVsU2NhbGFyKHNwZWVkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5mb3JjZS55ID0gZm9yY2VZO1xyXG4gICAgICAgIC8vdGhpcy5mb3JjZS55ID0gdGhpcy5lbnRpdHkucmlnaWRib2R5IS5saW5lYXJWZWxvY2l0eS55O1xyXG5cclxuICAgICAgICAvL3RoaXMuZW50aXR5LnNldFZlbG9jaXR5KHRoaXMuZm9yY2UpXHJcbiAgICAgICAgdmFyIHJlbGF0aXZlUG9pbnQgPSBuZXcgcGMuVmVjMygwLCAwLCAwKTtcclxuICAgICAgICB0aGlzLmVudGl0eS5yaWdpZGJvZHkhLmFwcGx5SW1wdWxzZSh0aGlzLmZvcmNlLCByZWxhdGl2ZVBvaW50KTtcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodGhpcy5lbnRpdHkuZ2V0UG9zaXRpb24oKS55IDwgLTUpIHtcclxuICAgICAgICAgICAgdGhpcy5lbnRpdHkudGVsZXBvcnQobmV3IHBjLlZlYzMoMCwgMywgMCkpO1xyXG4gICAgICAgICAgICB0aGlzLmVudGl0eS5zZXRWZWxvY2l0eShwYy5WZWMzLlpFUk8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcG9zdFVwZGF0ZShkdCkge1xyXG4gICAgICAgIHRoaXMuZmlyZSgncG9zdFVwZGF0ZScsIGR0KTtcclxuXHJcbiAgICAgICAgdmFyIHN0YXJ0ID0gbmV3IHBjLlZlYzMoMCwgMSwgMCk7XHJcbiAgICAgICAgdmFyIGVuZCA9IHRoaXMuZW50aXR5LmdldFBvc2l0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5hcHAuZHJhd0xpbmUoc3RhcnQsIGVuZCwgcGMuQ29sb3IuUkVELCB0cnVlKTtcclxuICAgICAgICAvL3RoaXMuYXBwLmRyYXdMaW5lKHN0YXJ0LCBlbmQsIHBjLkNvbG9yLlJFRCwgZmFsc2UpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIHBjIGZyb20gXCJwbGF5Y2FudmFzXCI7XHJcbmltcG9ydCB7IEJhc2VFbnRpdHkgfSBmcm9tIFwiLi4vZW50aXR5L2Jhc2VFbnRpdHlcIjtcclxuaW1wb3J0IHsgRW50aXR5UGxheWVyIH0gZnJvbSBcIi4uL2VudGl0eS9lbnRpdHlQbGF5ZXJcIjtcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi9nYW1lL2dhbWVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JsZCB7XHJcbiAgICBwcml2YXRlIF9nYW1lOiBHYW1lO1xyXG4gICAgcHJpdmF0ZSBfZW50aXRpZXMgPSBuZXcgTWFwPHN0cmluZywgQmFzZUVudGl0eT4oKTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGdhbWUoKSB7IHJldHVybiB0aGlzLl9nYW1lIH07XHJcbiAgICBwdWJsaWMgZ2V0IGFwcCgpIHsgcmV0dXJuIHRoaXMuX2dhbWUuYXBwIH07XHJcbiAgICBwdWJsaWMgZ2V0IGVudGl0aWVzKCkgeyByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl9lbnRpdGllcy52YWx1ZXMoKSk7IH1cclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZSkge1xyXG4gICAgICAgIHRoaXMuX2dhbWUgPSBnYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXR1cFdvcmxkKCkge1xyXG4gICAgICAgIGNvbnN0IGZsb29yID0gU2hhcGVVdGlscy5jcmVhdGVSZWN0YW5nbGUodGhpcy5hcHAsICdmbG9vcicsIG5ldyBwYy5WZWMzKCksIG5ldyBwYy5WZWMzKDE1LCAxLCAxNSksIGZhbHNlLCBuZXcgcGMuQ29sb3IoMCwgMC41LCAwKSk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuZ2FtZS5pc1NlcnZlcikge1xyXG4gICAgICAgICAgICBjb25zdCBwID0gdGhpcy5jcmVhdGVQbGF5ZXIobmV3IHBjLlZlYzMoKSk7XHJcbiAgICAgICAgICAgIHAuZnJvbUpTT04oe2lucHV0SDogMX0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRFbnRpdHkoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbnRpdGllcy5nZXQoaWQpITtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGFzRW50aXR5KGlkOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZW50aXRpZXMuaGFzKGlkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveUVudGl0eShpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5fZW50aXRpZXMuZ2V0KGlkKSE7XHJcbiAgICAgICAgdGhpcy5hcHAucm9vdC5yZW1vdmVDaGlsZChlbnRpdHkpO1xyXG4gICAgICAgIHRoaXMuX2VudGl0aWVzLmRlbGV0ZShpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZVBsYXllcihwb3NpdGlvbj86IHBjLlZlYzMsIGN1c3RvbUlkPzogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgZW50aXR5ID0gbmV3IEVudGl0eVBsYXllcigncGxheWVyJyk7XHJcblxyXG4gICAgICAgIGlmKGN1c3RvbUlkKSBlbnRpdHkuc2V0SWQoY3VzdG9tSWQpO1xyXG5cclxuICAgICAgICBpZihwb3NpdGlvbiA9PT0gdW5kZWZpbmVkKSBwb3NpdGlvbiA9IG5ldyBwYy5WZWMzKE1hdGgucmFuZG9tKCkqNi0zLCAxLCBNYXRoLnJhbmRvbSgpKjYtMyk7XHJcbiAgICBcclxuICAgICAgICBlbnRpdHkuaW5pdCgpO1xyXG4gICAgICAgIGVudGl0eS50ZWxlcG9ydChwb3NpdGlvbilcclxuXHJcbiAgICAgICAgdGhpcy5hcHAucm9vdC5hZGRDaGlsZChlbnRpdHkpO1xyXG5cclxuICAgICAgICB0aGlzLl9lbnRpdGllcy5zZXQoZW50aXR5LmlkLCBlbnRpdHkpO1xyXG5cclxuICAgICAgICByZXR1cm4gZW50aXR5O1xyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgU2hhcGVVdGlscyB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZVJlY3RhbmdsZShhcHA6IHBjLkFwcGxpY2F0aW9uLCBuYW1lOiBzdHJpbmcsIHBvc2l0aW9uOiBwYy5WZWMzLCBzaXplOiBwYy5WZWMzLCBpc0R5bmFtaWM6IGJvb2xlYW4sIGNvbG9yOiBwYy5Db2xvcikge1xyXG4gICAgICAgIGNvbnN0IGVudGl0eSA9IG5ldyBwYy5FbnRpdHkobmFtZSk7XHJcbiAgICAgICAgZW50aXR5LnNldFBvc2l0aW9uKHBvc2l0aW9uKVxyXG4gICAgICAgIHRoaXMuY3JlYXRlUmVjdGFuZ2xlQXRFbnRpdHkoZW50aXR5LCBzaXplLCBpc0R5bmFtaWMsIGNvbG9yKTtcclxuICAgICAgICBhcHAucm9vdC5hZGRDaGlsZChlbnRpdHkpO1xyXG4gICAgICAgIHJldHVybiBlbnRpdHk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlUmVjdGFuZ2xlQXRFbnRpdHkoZW50aXR5OiBwYy5FbnRpdHksIHNpemU6IHBjLlZlYzMsIGlzRHluYW1pYzogYm9vbGVhbiwgY29sb3I6IHBjLkNvbG9yKSB7XHJcbiAgICAgICAgZW50aXR5LmFkZENvbXBvbmVudCgncmlnaWRib2R5Jywge1xyXG4gICAgICAgICAgICB0eXBlOiBpc0R5bmFtaWMgPyAnZHluYW1pYycgOiAnc3RhdGljJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoJ2NvbGxpc2lvbicsIHtcclxuICAgICAgICAgICAgdHlwZTogJ2JveCcsXHJcbiAgICAgICAgICAgIGhhbGZFeHRlbnRzOiBuZXcgcGMuVmVjMyhzaXplLngvMiwgc2l6ZS55LzIsIHNpemUuei8yKVxyXG4gICAgICAgIH0pO1xyXG4gICAgXHJcbiAgICAgICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgcGMuU3RhbmRhcmRNYXRlcmlhbCgpO1xyXG4gICAgICAgIG1hdGVyaWFsLmRpZmZ1c2UgPSBjb2xvcjtcclxuICAgICAgICBtYXRlcmlhbC51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGN1YmUgPSBuZXcgcGMuRW50aXR5KCdjdWJlJyk7XHJcbiAgICAgICAgY3ViZS5hZGRDb21wb25lbnQoXCJyZW5kZXJcIiwge1xyXG4gICAgICAgICAgICBtYXRlcmlhbDogbWF0ZXJpYWwsXHJcbiAgICAgICAgICAgIHR5cGU6IFwiYm94XCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBjdWJlLnNldExvY2FsU2NhbGUoc2l6ZSlcclxuICAgICAgICBlbnRpdHkuYWRkQ2hpbGQoY3ViZSk7XHJcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcclxuICAgIH1cclxufVxyXG5cclxuIiwiLyogKGlnbm9yZWQpICovIiwiLyogKGlnbm9yZWQpICovIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZHNbaV1dID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rZG1kYXNzY19nYW1lXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2RtZGFzc2NfZ2FtZVwiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbl9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnNcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIikpKVxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vd2VicGFjay9jcmVkaXRzLmpzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=