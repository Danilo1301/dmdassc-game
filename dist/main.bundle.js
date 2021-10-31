/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/entity/entity.ts":
/*!******************************!*\
  !*** ./src/entity/entity.ts ***!
  \******************************/
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Entity = void 0;
const pc = __importStar(__webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs"));
const cannon_1 = __importDefault(__webpack_require__(/*! cannon */ "./node_modules/cannon/build/cannon.js"));
class Entity {
    constructor(world) {
        this.dontSync = false;
        this.canLerp = false;
        this.data = {};
        this.input = { horizontal: 0, vertical: 0 };
        this._position = new cannon_1.default.Vec3();
        this._velocity = new cannon_1.default.Vec3();
        this._quaternion = new cannon_1.default.Quaternion();
        this._id = `${Math.random()}`;
        this._world = world;
        this.setColor(pc.Color.WHITE);
    }
    get id() { return this._id; }
    get world() { return this._world; }
    get body() { return this._body; }
    get position() { return this._position; }
    get velocity() { return this._velocity; }
    get quaternion() { return this._quaternion; }
    get angularVelocity() {
        if (this._body)
            return this._body.angularVelocity;
        return cannon_1.default.Vec3.ZERO;
    }
    init() { }
    setColor(color) {
        this.data.color = [color.r, color.g, color.b];
    }
    setBody(body) {
        body.position.set(this.position.x, this.position.y, this.position.z);
        this._body = body;
        this._position = body.position;
        this._quaternion = body.quaternion;
        this._velocity = body.velocity;
    }
    setId(id) {
        this._id = id;
    }
    startBotBehaviour() {
        setInterval(() => {
            this.input.horizontal = Math.random() * 2 - 1;
            this.input.vertical = Math.random() * 2 - 1;
        }, 400);
    }
    update(dt) {
        /*
        if(this.canLerp) {
            const position = this.position;
            const newPosition = new CANNON.Vec3();

            const distance = position.distanceTo(this._targetPosition);

            let lerpAmount = 0.3;
            if(distance > 2.5) lerpAmount = 1;


            position.lerp(this._targetPosition, lerpAmount, newPosition);
            position.set(newPosition.x, newPosition.y, newPosition.z);
        }
        */
        var _a, _b;
        if (this.canLerp) {
            const quaternion = this.quaternion;
            //const qfrom = new Phaser.Math.Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
            //const qto = new Phaser.Math.Quaternion(this._targetQuaternion.x, this._targetQuaternion.y, this._targetQuaternion.z, this._targetQuaternion.w);
            //const result = qfrom.lerp(qto, 0.1);           
            //this.quaternion.set(result.x, result.y, result.z, result.w)
        }
        if (this.position.distanceTo(cannon_1.default.Vec3.ZERO) > 20) {
            this.position.set(0, 0, 2);
            (_a = this.body) === null || _a === void 0 ? void 0 : _a.velocity.setZero();
            (_b = this.body) === null || _b === void 0 ? void 0 : _b.angularVelocity.setZero();
        }
        if (this.velocity.almostZero(0.001))
            this.velocity.setZero();
        if (this.angularVelocity.almostZero(0.001))
            this.angularVelocity.setZero();
    }
    toJSON() {
        const data = {};
        data.pos = [this.position.x, this.position.y, this.position.z];
        data.rot = [this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w];
        data.vel = [this.velocity.x, this.velocity.y, this.velocity.z];
        data.aVel = [this.angularVelocity.x, this.angularVelocity.y, this.angularVelocity.z];
        data.input = [this.input.horizontal, this.input.vertical];
        data.data = this.data;
        return data;
    }
    fromJSON(entityData) {
        //if(this == GameClient.player) console.log('uosps')
        if (entityData.pos) {
            if (this.canLerp) {
                const position = this.position;
                const targetPosition = new cannon_1.default.Vec3(entityData.pos[0], entityData.pos[1], entityData.pos[2]);
                const newPosition = new cannon_1.default.Vec3();
                const distance = position.distanceTo(targetPosition);
                let lerpAmount = 0.3;
                if (distance > 2.5)
                    lerpAmount = 1;
                position.lerp(targetPosition, lerpAmount, newPosition);
                this.position.set(newPosition.x, newPosition.y, newPosition.z);
            }
        }
        if (entityData.vel) {
            if (this.canLerp) {
                this.velocity.set(entityData.vel[0], entityData.vel[1], entityData.vel[2]);
            }
        }
        if (entityData.aVel) {
            if (this.canLerp) {
                this.angularVelocity.set(entityData.aVel[0], entityData.aVel[1], entityData.aVel[2]);
            }
        }
        if (entityData.rot) {
            if (this.canLerp) {
                this.quaternion.set(entityData.rot[0], entityData.rot[1], entityData.rot[2], entityData.rot[3]);
            }
        }
        if (entityData.input) {
            if (this.canLerp) {
                this.input.horizontal = entityData.input[0];
                this.input.vertical = entityData.input[1];
            }
        }
        if (entityData.data) {
            this.data = entityData.data;
        }
    }
}
exports.Entity = Entity;


/***/ }),

/***/ "./src/entity/entityObject.ts":
/*!************************************!*\
  !*** ./src/entity/entityObject.ts ***!
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntityObject = exports.IEntityObjectShape = void 0;
const pc = __importStar(__webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs"));
const entity_1 = __webpack_require__(/*! ./entity */ "./src/entity/entity.ts");
const cannon_1 = __importDefault(__webpack_require__(/*! cannon */ "./node_modules/cannon/build/cannon.js"));
var IEntityObjectShape;
(function (IEntityObjectShape) {
    IEntityObjectShape[IEntityObjectShape["RECTANGLE"] = 0] = "RECTANGLE";
    IEntityObjectShape[IEntityObjectShape["SPHERE"] = 1] = "SPHERE";
})(IEntityObjectShape = exports.IEntityObjectShape || (exports.IEntityObjectShape = {}));
class EntityObject extends entity_1.Entity {
    constructor(world) {
        super(world);
        this.setColor(new pc.Color(Math.random(), Math.random(), Math.random()));
    }
    init() {
        super.init();
        console.log(JSON.stringify(this.data));
        console.log('init', this.getCustomData());
        const data = this.getCustomData();
        const halfExtents = data.halfExtents ? new cannon_1.default.Vec3(data.halfExtents.x, data.halfExtents.y, data.halfExtents.z) : new cannon_1.default.Vec3(1, 1, 1);
        if (data.shape == IEntityObjectShape.RECTANGLE) {
            const body = this.world.createRectangleBody(this.position, halfExtents, data.bodyOptions);
            this.setBody(body);
        }
        else {
            const body = this.world.createSphereBody(this.position, data.radius, data.bodyOptions);
            this.setBody(body);
        }
    }
    getCustomData() {
        return this.data.objectCustomData;
    }
    setCustomData(data) {
        return this.data.objectCustomData = data;
    }
}
exports.EntityObject = EntityObject;


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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntityPlayer = void 0;
const pc = __importStar(__webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs"));
const entity_1 = __webpack_require__(/*! ./entity */ "./src/entity/entity.ts");
const cannon_1 = __importDefault(__webpack_require__(/*! cannon */ "./node_modules/cannon/build/cannon.js"));
class EntityPlayer extends entity_1.Entity {
    constructor(world) {
        super(world);
        this.setColor(new pc.Color(Math.random(), Math.random(), Math.random()));
    }
    setBody(body) {
        body.fixedRotation = true;
        body.updateMassProperties();
        super.setBody(body);
    }
    update(dt) {
        super.update(dt);
        const speed = 200;
        const force = new cannon_1.default.Vec3(speed * this.input.horizontal * dt, speed * this.input.vertical * dt, 0);
        const velocity = this.velocity;
        velocity.set(force.x, force.y, velocity.z);
        //this.body?.applyLocalForce(new CANNON.Vec3(0, 0, -1000), CANNON.Vec3.ZERO);
    }
    init() {
        super.init();
        const s = 0.3;
        const body = this.world.createRectangleBody(this.position, new cannon_1.default.Vec3(s, s, s), { mass: 100, material: this.world._material_test });
        this.setBody(body);
    }
}
exports.EntityPlayer = EntityPlayer;


/***/ }),

/***/ "./src/game/game.ts":
/*!**************************!*\
  !*** ./src/game/game.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Game = void 0;
const server_1 = __webpack_require__(/*! ../server/server */ "./src/server/server.ts");
class Game {
    constructor(isServer) {
        this._isServer = false;
        this._servers = new Map();
        this._isServer = isServer === true;
    }
    get isServer() { return this._isServer; }
    get servers() { return Array.from(this._servers.values()); }
    get mainServer() { return this.servers[0]; }
    start() {
        console.log(`[Game] start; isServer =`, this.isServer);
    }
    createServer(id) {
        const server = new server_1.Server(this);
        this._servers.set(id, server);
    }
    update(dt) {
        this.servers.map(server => server.update(dt));
    }
}
exports.Game = Game;


/***/ }),

/***/ "./src/game/gameClient.ts":
/*!********************************!*\
  !*** ./src/game/gameClient.ts ***!
  \********************************/
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameClient = void 0;
const cannon_1 = __importDefault(__webpack_require__(/*! cannon */ "./node_modules/cannon/build/cannon.js"));
const pc = __importStar(__webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs"));
const network_1 = __webpack_require__(/*! ../network/network */ "./src/network/network.ts");
const packet_1 = __webpack_require__(/*! ../packet/packet */ "./src/packet/packet.ts");
const game_1 = __webpack_require__(/*! ./game */ "./src/game/game.ts");
class GameClient extends game_1.Game {
    constructor(canvas) {
        super();
        this._canvas = canvas;
        this._network = new network_1.Network(this);
        GameClient.Instance = this;
    }
    get app() { return this._app; }
    get network() { return this._network; }
    update(dt) {
        super.update(dt);
        if (GameClient.player) {
            const input = GameClient.player.input;
            input.horizontal = 0;
            input.vertical = 0;
            if (this.app.keyboard.isPressed(pc.KEY_A))
                input.horizontal = -1;
            if (this.app.keyboard.isPressed(pc.KEY_D))
                input.horizontal = 1;
            if (this.app.keyboard.isPressed(pc.KEY_W))
                input.vertical = -1;
            if (this.app.keyboard.isPressed(pc.KEY_S))
                input.vertical = 1;
        }
        this.render();
        this.network.update(dt);
    }
    start() {
        super.start();
        this.setupApp();
        this.setupResize();
        this.setupLocalClientScene();
        this.network.connect(() => {
            console.log(`[Network] Connected? ${this.network.connected}`);
            const data = {
                id: 'any'
            };
            this.network.send(packet_1.PacketType.CONNECT_TO_SERVER, data);
        });
    }
    setupApp() {
        const canvas = this._canvas;
        const app = new pc.Application(canvas, {
            mouse: new pc.Mouse(canvas),
            touch: new pc.TouchDevice(canvas),
            keyboard: new pc.Keyboard(document.body)
        });
        app.on('update', dt => this.update(dt));
        app.start();
        this._app = app;
        //pc.registerScript(CameraFollow, 'cameraFollow', app);
    }
    setupResize() {
        this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        this.app.setCanvasResolution(pc.RESOLUTION_AUTO);
        window.addEventListener('resize', () => this.resize());
        this.resize();
    }
    resize() {
        const canvas = this._canvas;
        this.app.resizeCanvas();
        canvas.style.width = "100%";
        canvas.style.height = "100%";
    }
    setupLocalClientScene() {
        const app = this.app;
        const camera = new pc.Entity('camera');
        camera.addComponent('camera', {
            clearColor: new pc.Color(0.1, 0.1, 0.1)
        });
        app.root.addChild(camera);
        camera.setPosition(0, 5, 10);
        camera.lookAt(0, 0, 0);
        //camera.setEulerAngles(-90, 0, 0);
        camera.addComponent('script').create('cameraFollow');
        const light = new pc.Entity('light');
        light.addComponent('light');
        app.root.addChild(light);
        light.setEulerAngles(30, 0, 0);
        GameClient.camera = camera;
    }
    render() {
        if (!this.mainServer)
            return;
        const world = this.mainServer.worlds[0];
        world.entities.map(entity => {
            var _a;
            if (!entity.pcEntity) {
                let halfExtents = new cannon_1.default.Vec3(0.1, 0.1, 0.1);
                let radius = 1;
                let box = false;
                if (entity.body) {
                    const shape = entity.body.shapes[0];
                    if (shape) {
                        if (shape instanceof cannon_1.default.Box) {
                            halfExtents = shape.halfExtents;
                            box = true;
                        }
                        if (shape instanceof cannon_1.default.Sphere) {
                            radius = shape.radius;
                        }
                    }
                }
                const c = entity.data.color;
                const material = new pc.StandardMaterial();
                material.diffuse = new pc.Color(c[0], c[1], c[2]);
                material.update();
                entity.pcEntity = new pc.Entity();
                if (box) {
                    entity.pcEntity.addComponent("render", {
                        material: material,
                        type: "box"
                    });
                    entity.pcEntity.setLocalScale(new pc.Vec3(halfExtents.x * 2, halfExtents.z * 2, halfExtents.y * 2));
                }
                else {
                    entity.pcEntity.addComponent("render", {
                        material: material,
                        type: "sphere"
                    });
                    entity.pcEntity.setLocalScale(new pc.Vec3(radius * 2, radius * 2, radius * 2));
                }
                this.app.root.addChild(entity.pcEntity);
                console.log("yaes");
            }
            const pos = entity.position;
            const angle = new cannon_1.default.Vec3();
            (_a = entity.body) === null || _a === void 0 ? void 0 : _a.quaternion.toEuler(angle);
            entity.pcEntity.setPosition(pos.x, pos.z, pos.y);
            entity.pcEntity.setEulerAngles(angle.x * -pc.math.RAD_TO_DEG, angle.z * -pc.math.RAD_TO_DEG, angle.y * -pc.math.RAD_TO_DEG);
            //entity.pcEntity.setEulerAngles(angle.x, angle.z, angle.y);
        });
        if (GameClient.player) {
            GameClient.camera.setPosition(GameClient.player.position.x, GameClient.player.position.z + 10, GameClient.player.position.y);
            GameClient.camera.setEulerAngles(-90, 0, 0);
        }
    }
}
exports.GameClient = GameClient;
GameClient.playerId = "";


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const gameClient_1 = __webpack_require__(/*! ./game/gameClient */ "./src/game/gameClient.ts");
const game = new gameClient_1.GameClient(document.getElementById('game'));
game.start();
window['game'] = game;
window['GameClient'] = gameClient_1.GameClient;
game.createServer('server1');
//GameClient.player = game.mainServer.worlds[0].spawnPlayer()


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
const worldSyncHelper_1 = __webpack_require__(/*! ../world/worldSyncHelper */ "./src/world/worldSyncHelper.ts");
class Network {
    constructor(game) {
        this._sendPacketsDelay = 50;
        this._sendTime = 0;
        this._game = game;
        //https://dmdassc-game.glitch.me/
        const address = `${location.protocol}//${location.host}`;
        this._socket = (0, socket_io_client_1.io)(address, {
            //path: '/socket',
            autoConnect: false,
            reconnection: false
        });
        this._socket.on('packet', packet => this.onReceivePacket(packet));
        console.log(`[Network] Address: (${address})`);
    }
    get game() { return this._game; }
    get socket() { return this._socket; }
    get connected() { return this._socket.connected; }
    connect(callback) {
        console.log(`[Network] Connecting...`);
        this._socket.connect();
        this._socket.once('connect', () => {
            callback === null || callback === void 0 ? void 0 : callback();
        });
    }
    update(dt) {
        this._sendTime += dt;
        const entity = gameClient_1.GameClient.player;
        if (!entity)
            return;
        if (this._sendTime <= this._sendPacketsDelay / 1000)
            return;
        this._sendTime = 0;
        const packetData = {
            entityId: entity.id,
            entityType: entity.constructor.name,
            data: entity.toJSON()
        };
        this.send(packet_1.PacketType.ENTITY_DATA, packetData);
    }
    send(type, data) {
        const packet = {
            type: type,
            data: data
        };
        this.socket.emit('packet', packet);
    }
    onReceivePacket(packet) {
        //console.log(packet)
        if (packet.type == packet_1.PacketType.CONNECT_TO_SERVER_STATUS) {
            const data = packet.data;
            gameClient_1.GameClient.playerId = data.entityId;
        }
        if (packet.type == packet_1.PacketType.ENTITY_DATA) {
            const data = packet.data;
            worldSyncHelper_1.WorldSyncHelper.onReceiveEntityData(data);
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

/***/ "./src/server/entityFactory.ts":
/*!*************************************!*\
  !*** ./src/server/entityFactory.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntityFactory = void 0;
class EntityFactory {
    constructor() {
        this._registeredEntities = new Map();
    }
    registerEntity(name, e) {
        this._registeredEntities.set(name, e);
    }
    getEntity(name) {
        const e = this._registeredEntities.get(name);
        if (!e)
            throw `Entity type '${name}' is invalid`;
        return e;
    }
}
exports.EntityFactory = EntityFactory;


/***/ }),

/***/ "./src/server/server.ts":
/*!******************************!*\
  !*** ./src/server/server.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Server = void 0;
const entityObject_1 = __webpack_require__(/*! ../entity/entityObject */ "./src/entity/entityObject.ts");
const entityPlayer_1 = __webpack_require__(/*! ../entity/entityPlayer */ "./src/entity/entityPlayer.ts");
const world_1 = __webpack_require__(/*! ../world/world */ "./src/world/world.ts");
const entityFactory_1 = __webpack_require__(/*! ./entityFactory */ "./src/server/entityFactory.ts");
class Server {
    constructor(game) {
        this._worlds = new Map();
        this._game = game;
        this._entityFactory = new entityFactory_1.EntityFactory();
        this.entityFactory.registerEntity('EntityPlayer', entityPlayer_1.EntityPlayer);
        this.entityFactory.registerEntity('EntityObject', entityObject_1.EntityObject);
        this.createWorld('world');
    }
    get worlds() { return Array.from(this._worlds.values()); }
    get game() { return this._game; }
    get entityFactory() { return this._entityFactory; }
    update(dt) {
        this.worlds.map(world => world.update(dt));
    }
    createWorld(name) {
        const world = new world_1.World(this);
        this._worlds.set(name, world);
    }
}
exports.Server = Server;


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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.World = void 0;
const cannon_1 = __importDefault(__webpack_require__(/*! cannon */ "./node_modules/cannon/build/cannon.js"));
const pc = __importStar(__webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs"));
const entityObject_1 = __webpack_require__(/*! ../entity/entityObject */ "./src/entity/entityObject.ts");
const entityPlayer_1 = __webpack_require__(/*! ../entity/entityPlayer */ "./src/entity/entityPlayer.ts");
class World {
    constructor(server) {
        this._entities = new Map();
        this._server = server;
        this.setupDynamicWorld();
    }
    get server() { return this._server; }
    ;
    get dynamicWorld() { return this._dynamicWorld; }
    ;
    get entities() { return Array.from(this._entities.values()); }
    ;
    update(dt) {
        var fixedTimeStep = 1.0 / 60.0; // seconds
        var maxSubSteps = 3;
        this.entities.map(entity => entity.update(dt));
        this.dynamicWorld.step(fixedTimeStep, dt, maxSubSteps);
    }
    getEntity(id) {
        return this._entities.get(id);
    }
    hasEntity(id) {
        return this._entities.has(id);
    }
    setupDynamicWorld() {
        console.log('setupDynamicWorld');
        // Setup our world
        var world = this._dynamicWorld = new cannon_1.default.World();
        world.gravity = new cannon_1.default.Vec3(0, 0, -9.82); // m/s²
        //mat1
        const groundMaterial = new cannon_1.default.Material("groundMaterial");
        const ground_ground_cm = new cannon_1.default.ContactMaterial(groundMaterial, groundMaterial, {
            friction: 0.4,
            restitution: 0.3,
            contactEquationStiffness: 1e8,
            contactEquationRelaxation: 3,
            frictionEquationStiffness: 1e8
        });
        world.addContactMaterial(ground_ground_cm);
        const slipperyMaterial = new cannon_1.default.Material("slipperyMaterial");
        const slippery_ground_cm = new cannon_1.default.ContactMaterial(groundMaterial, slipperyMaterial, {
            friction: 0.003,
            restitution: 0,
            contactEquationStiffness: 1e8,
            contactEquationRelaxation: 3
        });
        world.addContactMaterial(slippery_ground_cm);
        this._material_ground = groundMaterial;
        this._material_test = slipperyMaterial;
        const slippery_ground_cm2 = new cannon_1.default.ContactMaterial(slipperyMaterial, slipperyMaterial, {
            friction: 0.000,
            restitution: 0,
            contactEquationStiffness: 1e8,
            contactEquationRelaxation: 3
        });
        world.addContactMaterial(slippery_ground_cm2);
        /*
        const building = this.spawnRectangleObject(
            new CANNON.Vec3(5, 3, 2),
            {
                body: new CANNON.Body({mass: 0, material: this._material_ground, shape: new CANNON.Box(new CANNON.Vec3(2, 2, 6))}),
                color: new pc.Color(0.5, 0.7, 0)
            }
        );
        */
        const groundBodyOptions = {
            mass: 0,
            material: this._material_ground
        };
        const ground = this.spawnRectangleObject(new cannon_1.default.Vec3(0, 0, 0), new cannon_1.default.Vec3(30, 30, 1), groundBodyOptions, new pc.Color(1, 1, 1));
        ground.dontSync = true;
        const building1 = this.spawnRectangleObject(new cannon_1.default.Vec3(-5, 0, 2), new cannon_1.default.Vec3(2, 4, 2), groundBodyOptions, new pc.Color(1, 0, 0));
        building1.dontSync = true;
        const stairs = this.spawnRectangleObject(new cannon_1.default.Vec3(-3, 2, 1), new cannon_1.default.Vec3(1, 5, 1), groundBodyOptions, new pc.Color(0.5, 0.7, 0));
        stairs.dontSync = true;
        stairs.quaternion.setFromEuler(-35, 0, 0);
        const building2 = this.spawnRectangleObject(new cannon_1.default.Vec3(5, 3, 2), new cannon_1.default.Vec3(2, 2, 6), groundBodyOptions, new pc.Color(0.5, 0.7, 0));
        building2.dontSync = true;
        if (this.server.game.isServer) {
            for (let i = 0; i < 4; i++) {
                const obj = this.spawnCustomObject(new cannon_1.default.Vec3(0, 0, 3), {
                    shape: entityObject_1.IEntityObjectShape.RECTANGLE,
                    radius: 0.2,
                    halfExtents: { x: 0.3, y: 0.3, z: 0.3 },
                    bodyOptions: { mass: 100 },
                });
            }
            for (let i = 0; i < 4; i++) {
                const bot = this.spawnPlayer();
                bot.setColor(new pc.Color(0, 0, 1));
                bot.startBotBehaviour();
            }
            setInterval(() => {
                //console.log(bot.toJSON())
            }, 1000);
        }
        /*
        if(this.server.game.isServer) {
            
            for (let i = 0; i < 1; i++) {
                this.spawnPlayer().startBotBehaviour();
            }
            
        }
        */
        //const box = this.spawnTestEntity(new CANNON.Vec3(0, 0, 4), new CANNON.Vec3(1, 1, 1), {mass: 200});
        //const box2 = this.spawnTestEntity(new CANNON.Vec3(0, 1, 8), new CANNON.Vec3(1, 1, 1), {mass: 200});
        //setInterval(() => { this.spawnTestEntity(); }, 1000)
    }
    spawnRectangleObject(position, halfExtends, bodyOptions, color) {
        const objData = {
            shape: entityObject_1.IEntityObjectShape.RECTANGLE,
            halfExtents: halfExtends,
            bodyOptions: bodyOptions,
        };
        const rect = this.spawnCustomObject(position, objData);
        rect.setColor(color);
        return rect;
    }
    spawnPlayer() {
        const player = new entityPlayer_1.EntityPlayer(this);
        player.position.set(0, 0, 3);
        this.addEntity(player);
        return player;
    }
    addEntity(entity) {
        this._entities.set(entity.id, entity);
        entity.init();
    }
    spawnCustomObject(position, objectData) {
        const object = new entityObject_1.EntityObject(this);
        object.setCustomData(objectData);
        object.position.set(position.x, position.y, position.z);
        this.addEntity(object);
        return object;
    }
    printPosition(pos) {
        return `(${pos.x}, ${pos.y}, ${pos.z})`;
    }
    createRectangleBody(position, halfExtends, options) {
        const opt = options || {};
        opt.position = position;
        var shape = new cannon_1.default.Box(halfExtends);
        var body = new cannon_1.default.Body(opt);
        body.addShape(shape);
        this.dynamicWorld.addBody(body);
        return body;
    }
    createSphereBody(position, radius, options) {
        const opt = options || {};
        opt.position = position;
        var shape = new cannon_1.default.Sphere(radius);
        var body = new cannon_1.default.Body(opt);
        body.addShape(shape);
        this.dynamicWorld.addBody(body);
        return body;
    }
}
exports.World = World;
/*
const entity = new pc.Entity(name);
entity.setPosition(position)
this.createRectangleAtEntity(entity, size, isDynamic, color);
app.root.addChild(entity);
*/ 


/***/ }),

/***/ "./src/world/worldSyncHelper.ts":
/*!**************************************!*\
  !*** ./src/world/worldSyncHelper.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorldSyncHelper = void 0;
const gameClient_1 = __webpack_require__(/*! ../game/gameClient */ "./src/game/gameClient.ts");
class WorldSyncHelper {
    static get game() { return gameClient_1.GameClient.Instance; }
    ;
    static onReceiveEntityData(data) {
        const world = this.game.mainServer.worlds[0];
        let isNewEntity = false;
        let entity;
        if (!world.hasEntity(data.entityId)) {
            const c = world.server.entityFactory.getEntity(data.entityType);
            entity = new c(world);
            entity.setId(data.entityId);
            //entity.data = data.data.data; // '-'
            // 
            isNewEntity = true;
            console.log('new entiy');
            console.log([entity]);
        }
        if (!entity)
            entity = world.getEntity(data.entityId);
        //console.log("\n\n", JSON.stringify(data.data))
        entity.fromJSON(data.data);
        if (isNewEntity) {
            world.addEntity(entity);
            entity.canLerp = true;
            //entity.script!.create('entitySync');
        }
        if (entity.id == gameClient_1.GameClient.playerId) {
            if (!gameClient_1.GameClient.player) {
                gameClient_1.GameClient.player = entity;
                gameClient_1.GameClient.player.canLerp = false;
                //GameClient.player.setControllable();
                //GameClient.cameraFollowEntity(entity);
            }
        }
    }
}
exports.WorldSyncHelper = WorldSyncHelper;


/***/ }),

/***/ "./webpack/credits.js":
/*!****************************!*\
  !*** ./webpack/credits.js ***!
  \****************************/
/***/ (() => {



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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1VFaERBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9lbnRpdHkvZW50aXR5LnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9lbnRpdHkvZW50aXR5T2JqZWN0LnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9lbnRpdHkvZW50aXR5UGxheWVyLnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9nYW1lL2dhbWUudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL2dhbWUvZ2FtZUNsaWVudC50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL25ldHdvcmsvbmV0d29yay50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvcGFja2V0L3BhY2tldC50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvc2VydmVyL2VudGl0eUZhY3RvcnkudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL3NlcnZlci9zZXJ2ZXIudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL3dvcmxkL3dvcmxkLnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy93b3JsZC93b3JsZFN5bmNIZWxwZXIudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYyBmcm9tICdwbGF5Y2FudmFzJztcclxuaW1wb3J0IFBoYXNlciBmcm9tICdwaGFzZXInO1xyXG5pbXBvcnQgQ0FOTk9OIGZyb20gJ2Nhbm5vbic7XHJcbmltcG9ydCB7IFdvcmxkIH0gZnJvbSBcIi4uL3dvcmxkL3dvcmxkXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElFbnRpdHlEYXRhIHtcclxuICAgIHBvcz86IG51bWJlcltdXHJcbiAgICB2ZWw/OiBudW1iZXJbXVxyXG4gICAgcm90PzogbnVtYmVyW11cclxuICAgIGFWZWw/OiBudW1iZXJbXVxyXG4gICAgaW5wdXQ/OiBudW1iZXJbXVxyXG4gICAgZGF0YT86IGFueVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRW50aXR5IHtcclxuICAgIHB1YmxpYyBwY0VudGl0eT86IHBjLkVudGl0eTtcclxuXHJcbiAgICBwdWJsaWMgZG9udFN5bmM6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBjYW5MZXJwOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgcHVibGljIGRhdGE6IGFueSA9IHt9O1xyXG4gICAgcHVibGljIGlucHV0ID0ge2hvcml6b250YWw6IDAsIHZlcnRpY2FsOiAwfVxyXG5cclxuICAgIHByaXZhdGUgX3Bvc2l0aW9uID0gbmV3IENBTk5PTi5WZWMzKCk7XHJcbiAgICBwcml2YXRlIF92ZWxvY2l0eSA9IG5ldyBDQU5OT04uVmVjMygpO1xyXG4gICAgcHJpdmF0ZSBfcXVhdGVybmlvbiA9IG5ldyBDQU5OT04uUXVhdGVybmlvbigpO1xyXG5cclxuICAgIHByaXZhdGUgX2lkOiBzdHJpbmcgPSBgJHtNYXRoLnJhbmRvbSgpfWA7XHJcbiAgICBwcml2YXRlIF93b3JsZDogV29ybGQ7XHJcbiAgICBwcml2YXRlIF9ib2R5PzogQ0FOTk9OLkJvZHk7XHJcbiAgICBcclxuICAgIHB1YmxpYyBnZXQgaWQoKSB7IHJldHVybiB0aGlzLl9pZDsgfVxyXG4gICAgcHVibGljIGdldCB3b3JsZCgpIHsgcmV0dXJuIHRoaXMuX3dvcmxkOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGJvZHkoKSB7IHJldHVybiB0aGlzLl9ib2R5OyB9XHJcbiAgICBwdWJsaWMgZ2V0IHBvc2l0aW9uKCkgeyByZXR1cm4gdGhpcy5fcG9zaXRpb247IH1cclxuICAgIHB1YmxpYyBnZXQgdmVsb2NpdHkoKSB7IHJldHVybiB0aGlzLl92ZWxvY2l0eTsgfVxyXG4gICAgcHVibGljIGdldCBxdWF0ZXJuaW9uKCkgeyByZXR1cm4gdGhpcy5fcXVhdGVybmlvbjsgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgYW5ndWxhclZlbG9jaXR5KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX2JvZHkpIHJldHVybiB0aGlzLl9ib2R5LmFuZ3VsYXJWZWxvY2l0eTtcclxuICAgICAgICByZXR1cm4gQ0FOTk9OLlZlYzMuWkVSTztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih3b3JsZDogV29ybGQpIHtcclxuICAgICAgICB0aGlzLl93b3JsZCA9IHdvcmxkO1xyXG5cclxuICAgICAgICB0aGlzLnNldENvbG9yKHBjLkNvbG9yLldISVRFKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5pdCgpIHt9XHJcblxyXG4gICAgcHVibGljIHNldENvbG9yKGNvbG9yOiBwYy5Db2xvcikge1xyXG4gICAgICAgIHRoaXMuZGF0YS5jb2xvciA9IFtjb2xvci5yLCBjb2xvci5nLCBjb2xvci5iXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Qm9keShib2R5OiBDQU5OT04uQm9keSkge1xyXG4gICAgICAgIGJvZHkucG9zaXRpb24uc2V0KHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55LCB0aGlzLnBvc2l0aW9uLnopO1xyXG5cclxuICAgICAgICB0aGlzLl9ib2R5ID0gYm9keTtcclxuICAgICAgICB0aGlzLl9wb3NpdGlvbiA9IGJvZHkucG9zaXRpb247XHJcbiAgICAgICAgdGhpcy5fcXVhdGVybmlvbiA9IGJvZHkucXVhdGVybmlvbjtcclxuICAgICAgICB0aGlzLl92ZWxvY2l0eSA9IGJvZHkudmVsb2NpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldElkKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9pZCA9IGlkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydEJvdEJlaGF2aW91cigpIHtcclxuICAgICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXQuaG9yaXpvbnRhbCA9IE1hdGgucmFuZG9tKCkqMi0xXHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXQudmVydGljYWwgPSBNYXRoLnJhbmRvbSgpKjItMVxyXG4gICAgICAgIH0sIDQwMClcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHVwZGF0ZShkdDogbnVtYmVyKSB7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgaWYodGhpcy5jYW5MZXJwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbjtcclxuICAgICAgICAgICAgY29uc3QgbmV3UG9zaXRpb24gPSBuZXcgQ0FOTk9OLlZlYzMoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gcG9zaXRpb24uZGlzdGFuY2VUbyh0aGlzLl90YXJnZXRQb3NpdGlvbik7XHJcblxyXG4gICAgICAgICAgICBsZXQgbGVycEFtb3VudCA9IDAuMztcclxuICAgICAgICAgICAgaWYoZGlzdGFuY2UgPiAyLjUpIGxlcnBBbW91bnQgPSAxO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHBvc2l0aW9uLmxlcnAodGhpcy5fdGFyZ2V0UG9zaXRpb24sIGxlcnBBbW91bnQsIG5ld1Bvc2l0aW9uKTtcclxuICAgICAgICAgICAgcG9zaXRpb24uc2V0KG5ld1Bvc2l0aW9uLngsIG5ld1Bvc2l0aW9uLnksIG5ld1Bvc2l0aW9uLnopO1xyXG4gICAgICAgIH1cclxuICAgICAgICAqL1xyXG5cclxuICAgICAgICBpZih0aGlzLmNhbkxlcnApIHtcclxuICAgICAgICAgICAgY29uc3QgcXVhdGVybmlvbiA9IHRoaXMucXVhdGVybmlvbjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vY29uc3QgcWZyb20gPSBuZXcgUGhhc2VyLk1hdGguUXVhdGVybmlvbihxdWF0ZXJuaW9uLngsIHF1YXRlcm5pb24ueSwgcXVhdGVybmlvbi56LCBxdWF0ZXJuaW9uLncpO1xyXG4gICAgICAgICAgICAvL2NvbnN0IHF0byA9IG5ldyBQaGFzZXIuTWF0aC5RdWF0ZXJuaW9uKHRoaXMuX3RhcmdldFF1YXRlcm5pb24ueCwgdGhpcy5fdGFyZ2V0UXVhdGVybmlvbi55LCB0aGlzLl90YXJnZXRRdWF0ZXJuaW9uLnosIHRoaXMuX3RhcmdldFF1YXRlcm5pb24udyk7XHJcbiAgICAgICAgICAgIC8vY29uc3QgcmVzdWx0ID0gcWZyb20ubGVycChxdG8sIDAuMSk7ICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIC8vdGhpcy5xdWF0ZXJuaW9uLnNldChyZXN1bHQueCwgcmVzdWx0LnksIHJlc3VsdC56LCByZXN1bHQudylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMucG9zaXRpb24uZGlzdGFuY2VUbyhDQU5OT04uVmVjMy5aRVJPKSA+IDIwKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24uc2V0KDAsIDAsIDIpO1xyXG4gICAgICAgICAgICB0aGlzLmJvZHk/LnZlbG9jaXR5LnNldFplcm8oKTtcclxuICAgICAgICAgICAgdGhpcy5ib2R5Py5hbmd1bGFyVmVsb2NpdHkuc2V0WmVybygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy52ZWxvY2l0eS5hbG1vc3RaZXJvKDAuMDAxKSkgdGhpcy52ZWxvY2l0eS5zZXRaZXJvKClcclxuICAgICAgICBpZih0aGlzLmFuZ3VsYXJWZWxvY2l0eS5hbG1vc3RaZXJvKDAuMDAxKSkgdGhpcy5hbmd1bGFyVmVsb2NpdHkuc2V0WmVybygpXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvSlNPTigpIHtcclxuICAgICAgICBjb25zdCBkYXRhOiBJRW50aXR5RGF0YSA9IHt9XHJcblxyXG4gICAgICAgIGRhdGEucG9zID0gW3RoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55LCB0aGlzLnBvc2l0aW9uLnpdO1xyXG4gICAgICAgIGRhdGEucm90ID0gW3RoaXMucXVhdGVybmlvbi54LCB0aGlzLnF1YXRlcm5pb24ueSwgdGhpcy5xdWF0ZXJuaW9uLnosIHRoaXMucXVhdGVybmlvbi53XTtcclxuICAgICAgICBkYXRhLnZlbCA9IFt0aGlzLnZlbG9jaXR5LngsIHRoaXMudmVsb2NpdHkueSwgdGhpcy52ZWxvY2l0eS56XTtcclxuICAgICAgICBkYXRhLmFWZWwgPSBbdGhpcy5hbmd1bGFyVmVsb2NpdHkueCwgdGhpcy5hbmd1bGFyVmVsb2NpdHkueSwgdGhpcy5hbmd1bGFyVmVsb2NpdHkuel07XHJcbiAgICAgICAgZGF0YS5pbnB1dCA9IFt0aGlzLmlucHV0Lmhvcml6b250YWwsIHRoaXMuaW5wdXQudmVydGljYWxdO1xyXG4gICAgICAgIGRhdGEuZGF0YSA9IHRoaXMuZGF0YTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZyb21KU09OKGVudGl0eURhdGE6IElFbnRpdHlEYXRhKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9pZih0aGlzID09IEdhbWVDbGllbnQucGxheWVyKSBjb25zb2xlLmxvZygndW9zcHMnKVxyXG5cclxuICAgICAgICBpZihlbnRpdHlEYXRhLnBvcykge1xyXG5cclxuICAgICAgICAgICAgaWYodGhpcy5jYW5MZXJwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMucG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRQb3NpdGlvbiA9IG5ldyBDQU5OT04uVmVjMyhlbnRpdHlEYXRhLnBvc1swXSwgZW50aXR5RGF0YS5wb3NbMV0sIGVudGl0eURhdGEucG9zWzJdKVxyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3UG9zaXRpb24gPSBuZXcgQ0FOTk9OLlZlYzMoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IHBvc2l0aW9uLmRpc3RhbmNlVG8odGFyZ2V0UG9zaXRpb24pO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBsZXJwQW1vdW50ID0gMC4zO1xyXG4gICAgICAgICAgICAgICAgaWYoZGlzdGFuY2UgPiAyLjUpIGxlcnBBbW91bnQgPSAxO1xyXG5cclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uLmxlcnAodGFyZ2V0UG9zaXRpb24sIGxlcnBBbW91bnQsIG5ld1Bvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnNldChuZXdQb3NpdGlvbi54LCBuZXdQb3NpdGlvbi55LCBuZXdQb3NpdGlvbi56KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoZW50aXR5RGF0YS52ZWwpIHtcclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuY2FuTGVycCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52ZWxvY2l0eS5zZXQoZW50aXR5RGF0YS52ZWxbMF0sIGVudGl0eURhdGEudmVsWzFdLCBlbnRpdHlEYXRhLnZlbFsyXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGVudGl0eURhdGEuYVZlbCkge1xyXG5cclxuICAgICAgICAgICAgaWYodGhpcy5jYW5MZXJwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuZ3VsYXJWZWxvY2l0eS5zZXQoZW50aXR5RGF0YS5hVmVsWzBdLCBlbnRpdHlEYXRhLmFWZWxbMV0sIGVudGl0eURhdGEuYVZlbFsyXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGVudGl0eURhdGEucm90KSB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY2FuTGVycCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5xdWF0ZXJuaW9uLnNldChlbnRpdHlEYXRhLnJvdFswXSwgZW50aXR5RGF0YS5yb3RbMV0sIGVudGl0eURhdGEucm90WzJdLCBlbnRpdHlEYXRhLnJvdFszXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoZW50aXR5RGF0YS5pbnB1dCkge1xyXG4gICAgICAgICAgICBpZih0aGlzLmNhbkxlcnApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXQuaG9yaXpvbnRhbCA9IGVudGl0eURhdGEuaW5wdXRbMF07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0LnZlcnRpY2FsID0gZW50aXR5RGF0YS5pbnB1dFsxXTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGVudGl0eURhdGEuZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBlbnRpdHlEYXRhLmRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59ICAgIiwiaW1wb3J0ICogYXMgcGMgZnJvbSAncGxheWNhbnZhcyc7XHJcbmltcG9ydCB7IEVudGl0eSB9IGZyb20gXCIuL2VudGl0eVwiO1xyXG5pbXBvcnQgQ0FOTk9OIGZyb20gJ2Nhbm5vbic7XHJcblxyXG5leHBvcnQgZW51bSBJRW50aXR5T2JqZWN0U2hhcGUge1xyXG4gICAgUkVDVEFOR0xFLFxyXG4gICAgU1BIRVJFXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUVudGl0eU9iamVjdEN1c3RvbURhdGEge1xyXG4gICAgc2hhcGU6IElFbnRpdHlPYmplY3RTaGFwZVxyXG4gICAgcmFkaXVzPzogbnVtYmVyXHJcbiAgICBoYWxmRXh0ZW50cz86IHt4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyfVxyXG4gICAgYm9keU9wdGlvbnM/OiBDQU5OT04uSUJvZHlPcHRpb25zXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFbnRpdHlPYmplY3QgZXh0ZW5kcyBFbnRpdHkge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHdvcmxkKSB7XHJcbiAgICAgICAgc3VwZXIod29ybGQpO1xyXG5cclxuICAgICAgICB0aGlzLnNldENvbG9yKG5ldyBwYy5Db2xvcihNYXRoLnJhbmRvbSgpLCBNYXRoLnJhbmRvbSgpLCBNYXRoLnJhbmRvbSgpKSlcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5pdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0KCk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YSkpXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdpbml0JywgdGhpcy5nZXRDdXN0b21EYXRhKCkpXHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmdldEN1c3RvbURhdGEoKTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFsZkV4dGVudHMgPSBkYXRhLmhhbGZFeHRlbnRzID8gbmV3IENBTk5PTi5WZWMzKGRhdGEuaGFsZkV4dGVudHMueCwgZGF0YS5oYWxmRXh0ZW50cy55LCBkYXRhLmhhbGZFeHRlbnRzLnopIDogbmV3IENBTk5PTi5WZWMzKDEsIDEsIDEpO1xyXG5cclxuICAgICBcclxuICAgICAgICBpZihkYXRhLnNoYXBlID09IElFbnRpdHlPYmplY3RTaGFwZS5SRUNUQU5HTEUpIHtcclxuICAgICAgICAgICAgY29uc3QgYm9keSA9IHRoaXMud29ybGQuY3JlYXRlUmVjdGFuZ2xlQm9keShcclxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24sXHJcbiAgICAgICAgICAgICAgICBoYWxmRXh0ZW50cyxcclxuICAgICAgICAgICAgICAgIGRhdGEuYm9keU9wdGlvbnNcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRCb2R5KGJvZHkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvZHkgPSB0aGlzLndvcmxkLmNyZWF0ZVNwaGVyZUJvZHkoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uLFxyXG4gICAgICAgICAgICAgICAgZGF0YS5yYWRpdXMhLFxyXG4gICAgICAgICAgICAgICAgZGF0YS5ib2R5T3B0aW9uc1xyXG4gICAgICAgICAgICApO1xyXG4gICAgXHJcbiAgICAgICAgICAgIHRoaXMuc2V0Qm9keShib2R5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDdXN0b21EYXRhKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEub2JqZWN0Q3VzdG9tRGF0YSBhcyBJRW50aXR5T2JqZWN0Q3VzdG9tRGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Q3VzdG9tRGF0YShkYXRhOiBJRW50aXR5T2JqZWN0Q3VzdG9tRGF0YSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEub2JqZWN0Q3VzdG9tRGF0YSA9IGRhdGE7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgKiBhcyBwYyBmcm9tICdwbGF5Y2FudmFzJztcclxuaW1wb3J0IHsgRW50aXR5IH0gZnJvbSBcIi4vZW50aXR5XCI7XHJcbmltcG9ydCBDQU5OT04gZnJvbSAnY2Fubm9uJztcclxuXHJcbmV4cG9ydCBjbGFzcyBFbnRpdHlQbGF5ZXIgZXh0ZW5kcyBFbnRpdHkge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHdvcmxkKSB7XHJcbiAgICAgICAgc3VwZXIod29ybGQpO1xyXG5cclxuICAgICAgICB0aGlzLnNldENvbG9yKG5ldyBwYy5Db2xvcihNYXRoLnJhbmRvbSgpLCBNYXRoLnJhbmRvbSgpLCBNYXRoLnJhbmRvbSgpKSlcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIHNldEJvZHkoYm9keTogQ0FOTk9OLkJvZHkpIHtcclxuICAgICAgICBib2R5LmZpeGVkUm90YXRpb24gPSB0cnVlO1xyXG4gICAgICAgIGJvZHkudXBkYXRlTWFzc1Byb3BlcnRpZXMoKTtcclxuXHJcbiAgICAgICAgc3VwZXIuc2V0Qm9keShib2R5KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlci51cGRhdGUoZHQpO1xyXG5cclxuICAgICAgICBjb25zdCBzcGVlZCA9IDIwMDtcclxuXHJcbiAgICAgICAgY29uc3QgZm9yY2UgPSBuZXcgQ0FOTk9OLlZlYzMoXHJcbiAgICAgICAgICAgIHNwZWVkICogdGhpcy5pbnB1dC5ob3Jpem9udGFsICogZHQsXHJcbiAgICAgICAgICAgIHNwZWVkICogdGhpcy5pbnB1dC52ZXJ0aWNhbCAqIGR0LFxyXG4gICAgICAgICAgICAwXHJcbiAgICAgICAgKTtcclxuXHJcblxyXG4gICAgICAgIGNvbnN0IHZlbG9jaXR5ID0gdGhpcy52ZWxvY2l0eTtcclxuICAgICAgICB2ZWxvY2l0eS5zZXQoZm9yY2UueCwgZm9yY2UueSwgdmVsb2NpdHkueik7XHJcblxyXG4gICAgICAgIC8vdGhpcy5ib2R5Py5hcHBseUxvY2FsRm9yY2UobmV3IENBTk5PTi5WZWMzKDAsIDAsIC0xMDAwKSwgQ0FOTk9OLlZlYzMuWkVSTyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluaXQoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdCgpO1xyXG5cclxuICAgICAgICBjb25zdCBzID0gMC4zO1xyXG5cclxuICAgICAgICBjb25zdCBib2R5ID0gdGhpcy53b3JsZC5jcmVhdGVSZWN0YW5nbGVCb2R5KFxyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLFxyXG4gICAgICAgICAgICBuZXcgQ0FOTk9OLlZlYzMocyxzLHMpLFxyXG4gICAgICAgICAgICB7bWFzczogMTAwLCBtYXRlcmlhbDogdGhpcy53b3JsZC5fbWF0ZXJpYWxfdGVzdH1cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLnNldEJvZHkoYm9keSk7XHJcbiAgICB9XHJcbn0iLCJcclxuaW1wb3J0ICogYXMgcGMgZnJvbSAncGxheWNhbnZhcydcclxuaW1wb3J0IHsgU2VydmVyIH0gZnJvbSAnLi4vc2VydmVyL3NlcnZlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZSB7XHJcbiAgICBwcml2YXRlIF9pc1NlcnZlcjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfc2VydmVycyA9IG5ldyBNYXA8c3RyaW5nLCBTZXJ2ZXI+KCk7XHJcblxyXG4gICAgcHVibGljIGdldCBpc1NlcnZlcigpIHsgcmV0dXJuIHRoaXMuX2lzU2VydmVyOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHNlcnZlcnMoKSB7IHJldHVybiBBcnJheS5mcm9tKHRoaXMuX3NlcnZlcnMudmFsdWVzKCkpOyB9XHJcbiAgICBwdWJsaWMgZ2V0IG1haW5TZXJ2ZXIoKSB7IHJldHVybiB0aGlzLnNlcnZlcnNbMF07IH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihpc1NlcnZlcj86IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9pc1NlcnZlciA9IGlzU2VydmVyID09PSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgW0dhbWVdIHN0YXJ0OyBpc1NlcnZlciA9YCwgdGhpcy5pc1NlcnZlcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZVNlcnZlcihpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgc2VydmVyID0gbmV3IFNlcnZlcih0aGlzKTtcclxuICAgICAgICB0aGlzLl9zZXJ2ZXJzLnNldChpZCwgc2VydmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnNlcnZlcnMubWFwKHNlcnZlciA9PiBzZXJ2ZXIudXBkYXRlKGR0KSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQ0FOTk9OIGZyb20gJ2Nhbm5vbidcclxuaW1wb3J0ICogYXMgcGMgZnJvbSBcInBsYXljYW52YXNcIjtcclxuaW1wb3J0IHsgRW50aXR5IH0gZnJvbSAnLi4vZW50aXR5L2VudGl0eSc7XHJcbmltcG9ydCB7IE5ldHdvcmsgfSBmcm9tIFwiLi4vbmV0d29yay9uZXR3b3JrXCI7XHJcbmltcG9ydCB7IElQYWNrZXREYXRhX0Nvbm5lY3RUb1NlcnZlciwgUGFja2V0VHlwZSB9IGZyb20gJy4uL3BhY2tldC9wYWNrZXQnO1xyXG5pbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4vZ2FtZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWVDbGllbnQgZXh0ZW5kcyBHYW1lIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgSW5zdGFuY2U6IEdhbWVDbGllbnQ7XHJcbiAgICBwdWJsaWMgc3RhdGljIGNhbWVyYTogcGMuRW50aXR5O1xyXG4gICAgcHVibGljIHN0YXRpYyBwbGF5ZXJJZDogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBzdGF0aWMgcGxheWVyPzogRW50aXR5O1xyXG5cclxuICAgIHByaXZhdGUgX2FwcDogcGMuQXBwbGljYXRpb247XHJcbiAgICBwcml2YXRlIF9jYW52YXM7XHJcbiAgICBwcml2YXRlIF9uZXR3b3JrOiBOZXR3b3JrO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgYXBwKCkgeyByZXR1cm4gdGhpcy5fYXBwOyB9XHJcbiAgICBwdWJsaWMgZ2V0IG5ldHdvcmsoKSB7IHJldHVybiB0aGlzLl9uZXR3b3JrOyB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2FudmFzKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgdGhpcy5fbmV0d29yayA9IG5ldyBOZXR3b3JrKHRoaXMpO1xyXG4gICAgICAgIEdhbWVDbGllbnQuSW5zdGFuY2UgPSB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShkdCk7XHJcblxyXG5cclxuICAgICAgICBpZihHYW1lQ2xpZW50LnBsYXllcikge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaW5wdXQgPSBHYW1lQ2xpZW50LnBsYXllci5pbnB1dDtcclxuICAgICAgICAgICAgaW5wdXQuaG9yaXpvbnRhbCA9IDA7XHJcbiAgICAgICAgICAgIGlucHV0LnZlcnRpY2FsID0gMDtcclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuYXBwLmtleWJvYXJkLmlzUHJlc3NlZChwYy5LRVlfQSkpIGlucHV0Lmhvcml6b250YWwgPSAtMTtcclxuICAgICAgICAgICAgaWYodGhpcy5hcHAua2V5Ym9hcmQuaXNQcmVzc2VkKHBjLktFWV9EKSkgaW5wdXQuaG9yaXpvbnRhbCA9IDE7XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLmFwcC5rZXlib2FyZC5pc1ByZXNzZWQocGMuS0VZX1cpKSBpbnB1dC52ZXJ0aWNhbCA9IC0xO1xyXG4gICAgICAgICAgICBpZih0aGlzLmFwcC5rZXlib2FyZC5pc1ByZXNzZWQocGMuS0VZX1MpKSBpbnB1dC52ZXJ0aWNhbCA9IDE7XHJcblxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMubmV0d29yay51cGRhdGUoZHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydCgpIHtcclxuICAgICAgICBzdXBlci5zdGFydCgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBBcHAoKTtcclxuICAgICAgICB0aGlzLnNldHVwUmVzaXplKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cExvY2FsQ2xpZW50U2NlbmUoKTtcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5uZXR3b3JrLmNvbm5lY3QoKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgW05ldHdvcmtdIENvbm5lY3RlZD8gJHt0aGlzLm5ldHdvcmsuY29ubmVjdGVkfWApO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZGF0YTogSVBhY2tldERhdGFfQ29ubmVjdFRvU2VydmVyID0ge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdhbnknXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5uZXR3b3JrLnNlbmQoUGFja2V0VHlwZS5DT05ORUNUX1RPX1NFUlZFUiwgZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0dXBBcHAoKSB7XHJcbiAgICAgICAgY29uc3QgY2FudmFzID0gdGhpcy5fY2FudmFzO1xyXG4gICAgICAgIGNvbnN0IGFwcCA9IG5ldyBwYy5BcHBsaWNhdGlvbihjYW52YXMsIHtcclxuICAgICAgICAgICAgbW91c2U6IG5ldyBwYy5Nb3VzZShjYW52YXMpLFxyXG4gICAgICAgICAgICB0b3VjaDogbmV3IHBjLlRvdWNoRGV2aWNlKGNhbnZhcyksXHJcbiAgICAgICAgICAgIGtleWJvYXJkOiBuZXcgcGMuS2V5Ym9hcmQoZG9jdW1lbnQuYm9keSlcclxuICAgICAgICB9KTtcclxuICAgICAgICBhcHAub24oJ3VwZGF0ZScsIGR0ID0+IHRoaXMudXBkYXRlKGR0KSlcclxuICAgICAgICBhcHAuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fYXBwID0gYXBwO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vcGMucmVnaXN0ZXJTY3JpcHQoQ2FtZXJhRm9sbG93LCAnY2FtZXJhRm9sbG93JywgYXBwKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldHVwUmVzaXplKCkge1xyXG4gICAgICAgIHRoaXMuYXBwLnNldENhbnZhc0ZpbGxNb2RlKHBjLkZJTExNT0RFX0ZJTExfV0lORE9XKTtcclxuICAgICAgICB0aGlzLmFwcC5zZXRDYW52YXNSZXNvbHV0aW9uKHBjLlJFU09MVVRJT05fQVVUTyk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB0aGlzLnJlc2l6ZSgpKTtcclxuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXNpemUoKSB7XHJcbiAgICAgICAgY29uc3QgY2FudmFzID0gdGhpcy5fY2FudmFzO1xyXG5cclxuICAgICAgICB0aGlzLmFwcC5yZXNpemVDYW52YXMoKTtcclxuICAgICAgICBjYW52YXMuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXR1cExvY2FsQ2xpZW50U2NlbmUoKSB7XHJcbiAgICAgICAgY29uc3QgYXBwID0gdGhpcy5hcHA7XHJcblxyXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IG5ldyBwYy5FbnRpdHkoJ2NhbWVyYScpO1xyXG4gICAgICAgIGNhbWVyYS5hZGRDb21wb25lbnQoJ2NhbWVyYScsIHtcclxuICAgICAgICAgICAgY2xlYXJDb2xvcjogbmV3IHBjLkNvbG9yKDAuMSwgMC4xLCAwLjEpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYXBwLnJvb3QuYWRkQ2hpbGQoY2FtZXJhKTtcclxuICAgICAgICBjYW1lcmEuc2V0UG9zaXRpb24oMCwgNSwgMTApO1xyXG4gICAgICAgIGNhbWVyYS5sb29rQXQoMCwgMCwgMCk7XHJcbiAgICAgICAgLy9jYW1lcmEuc2V0RXVsZXJBbmdsZXMoLTkwLCAwLCAwKTtcclxuICAgICAgICAoY2FtZXJhLmFkZENvbXBvbmVudCgnc2NyaXB0JykgYXMgcGMuU2NyaXB0Q29tcG9uZW50KS5jcmVhdGUoJ2NhbWVyYUZvbGxvdycpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGxpZ2h0ID0gbmV3IHBjLkVudGl0eSgnbGlnaHQnKTtcclxuICAgICAgICBsaWdodC5hZGRDb21wb25lbnQoJ2xpZ2h0Jyk7XHJcbiAgICAgICAgYXBwLnJvb3QuYWRkQ2hpbGQobGlnaHQpO1xyXG4gICAgICAgIGxpZ2h0LnNldEV1bGVyQW5nbGVzKDMwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgR2FtZUNsaWVudC5jYW1lcmEgPSBjYW1lcmE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbmRlcigpIHtcclxuICAgICAgICBpZighdGhpcy5tYWluU2VydmVyKSByZXR1cm47XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3Qgd29ybGQgPSB0aGlzLm1haW5TZXJ2ZXIud29ybGRzWzBdO1xyXG5cclxuICAgICAgICB3b3JsZC5lbnRpdGllcy5tYXAoZW50aXR5ID0+IHtcclxuICAgICAgICAgICAgaWYoIWVudGl0eS5wY0VudGl0eSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBoYWxmRXh0ZW50cyA9IG5ldyBDQU5OT04uVmVjMygwLjEsIDAuMSwgMC4xKTtcclxuICAgICAgICAgICAgICAgIGxldCByYWRpdXMgPSAxO1xyXG4gICAgICAgICAgICAgICAgbGV0IGJveCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGVudGl0eS5ib2R5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hhcGUgPSBlbnRpdHkuYm9keSEuc2hhcGVzWzBdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZihzaGFwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzaGFwZSBpbnN0YW5jZW9mIENBTk5PTi5Cb3gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbGZFeHRlbnRzID0gc2hhcGUuaGFsZkV4dGVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3ggPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzaGFwZSBpbnN0YW5jZW9mIENBTk5PTi5TcGhlcmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhZGl1cyA9IHNoYXBlLnJhZGl1cztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjID0gZW50aXR5LmRhdGEuY29sb3I7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgcGMuU3RhbmRhcmRNYXRlcmlhbCgpO1xyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwuZGlmZnVzZSA9IG5ldyBwYy5Db2xvcihjWzBdLCBjWzFdLCBjWzJdKTtcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGVudGl0eS5wY0VudGl0eSA9IG5ldyBwYy5FbnRpdHkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihib3gpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5LnBjRW50aXR5LmFkZENvbXBvbmVudChcInJlbmRlclwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsOiBtYXRlcmlhbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJib3hcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eS5wY0VudGl0eS5zZXRMb2NhbFNjYWxlKG5ldyBwYy5WZWMzKGhhbGZFeHRlbnRzLnggKiAyLCBoYWxmRXh0ZW50cy56ICogMiwgaGFsZkV4dGVudHMueSAqIDIpKVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBlbnRpdHkucGNFbnRpdHkuYWRkQ29tcG9uZW50KFwicmVuZGVyXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWw6IG1hdGVyaWFsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInNwaGVyZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5LnBjRW50aXR5LnNldExvY2FsU2NhbGUobmV3IHBjLlZlYzMocmFkaXVzICogMiwgcmFkaXVzICogMiwgcmFkaXVzICogMikpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgXHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5hcHAucm9vdC5hZGRDaGlsZChlbnRpdHkucGNFbnRpdHkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwieWFlc1wiKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwb3MgPSBlbnRpdHkucG9zaXRpb247XHJcbiAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gbmV3IENBTk5PTi5WZWMzKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBlbnRpdHkuYm9keT8ucXVhdGVybmlvbi50b0V1bGVyKGFuZ2xlKTtcclxuXHJcbiAgICAgICAgICAgIGVudGl0eS5wY0VudGl0eS5zZXRQb3NpdGlvbihwb3MueCwgcG9zLnosIHBvcy55KTtcclxuICAgICAgICAgICAgZW50aXR5LnBjRW50aXR5LnNldEV1bGVyQW5nbGVzKFxyXG4gICAgICAgICAgICAgICAgYW5nbGUueCAqIC1wYy5tYXRoLlJBRF9UT19ERUcsXHJcbiAgICAgICAgICAgICAgICBhbmdsZS56ICogLXBjLm1hdGguUkFEX1RPX0RFRyxcclxuICAgICAgICAgICAgICAgIGFuZ2xlLnkgKiAtcGMubWF0aC5SQURfVE9fREVHXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgLy9lbnRpdHkucGNFbnRpdHkuc2V0RXVsZXJBbmdsZXMoYW5nbGUueCwgYW5nbGUueiwgYW5nbGUueSk7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYoR2FtZUNsaWVudC5wbGF5ZXIpIHtcclxuICAgICAgICAgICAgR2FtZUNsaWVudC5jYW1lcmEuc2V0UG9zaXRpb24oR2FtZUNsaWVudC5wbGF5ZXIucG9zaXRpb24ueCwgR2FtZUNsaWVudC5wbGF5ZXIucG9zaXRpb24ueiArIDEwLCBHYW1lQ2xpZW50LnBsYXllci5wb3NpdGlvbi55KVxyXG4gICAgICAgICAgICBHYW1lQ2xpZW50LmNhbWVyYS5zZXRFdWxlckFuZ2xlcygtOTAsIDAsIDApXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWNcclxufSIsImltcG9ydCB7IEdhbWVDbGllbnQgfSBmcm9tIFwiLi9nYW1lL2dhbWVDbGllbnRcIjtcclxuXHJcbmNvbnN0IGdhbWUgPSBuZXcgR2FtZUNsaWVudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZScpKTtcclxuZ2FtZS5zdGFydCgpO1xyXG53aW5kb3dbJ2dhbWUnXSA9IGdhbWU7XHJcbndpbmRvd1snR2FtZUNsaWVudCddID0gR2FtZUNsaWVudDtcclxuXHJcbmdhbWUuY3JlYXRlU2VydmVyKCdzZXJ2ZXIxJyk7XHJcbi8vR2FtZUNsaWVudC5wbGF5ZXIgPSBnYW1lLm1haW5TZXJ2ZXIud29ybGRzWzBdLnNwYXduUGxheWVyKCkiLCJpbXBvcnQgeyBpbywgU29ja2V0IH0gZnJvbSBcInNvY2tldC5pby1jbGllbnRcIjtcclxuaW1wb3J0IHsgR2FtZUNsaWVudCB9IGZyb20gXCIuLi9nYW1lL2dhbWVDbGllbnRcIjtcclxuaW1wb3J0IHsgSVBhY2tldCwgSVBhY2tldERhdGFfQ29ubmVjdFRvU2VydmVyU3RhdHVzLCBJUGFja2V0RGF0YV9FbnRpdHlEYXRhLCBQYWNrZXRUeXBlIH0gZnJvbSBcIi4uL3BhY2tldC9wYWNrZXRcIjtcclxuaW1wb3J0IHsgV29ybGRTeW5jSGVscGVyIH0gZnJvbSBcIi4uL3dvcmxkL3dvcmxkU3luY0hlbHBlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE5ldHdvcmsge1xyXG4gICAgcHJpdmF0ZSBfZ2FtZTogR2FtZUNsaWVudDtcclxuICAgIHByaXZhdGUgX3NvY2tldDogU29ja2V0O1xyXG5cclxuICAgIHB1YmxpYyBnZXQgZ2FtZSgpIHsgcmV0dXJuIHRoaXMuX2dhbWU7IH1cclxuICAgIHB1YmxpYyBnZXQgc29ja2V0KCkgeyByZXR1cm4gdGhpcy5fc29ja2V0OyB9XHJcbiAgICBwdWJsaWMgZ2V0IGNvbm5lY3RlZCgpIHsgcmV0dXJuIHRoaXMuX3NvY2tldC5jb25uZWN0ZWQ7IH1cclxuXHJcbiAgICBwcml2YXRlIF9zZW5kUGFja2V0c0RlbGF5OiBudW1iZXIgPSA1MDtcclxuICAgIHByaXZhdGUgX3NlbmRUaW1lOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGdhbWU6IEdhbWVDbGllbnQpIHtcclxuICAgICAgICB0aGlzLl9nYW1lID0gZ2FtZTtcclxuXHJcbiAgICAgICAgLy9odHRwczovL2RtZGFzc2MtZ2FtZS5nbGl0Y2gubWUvXHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgYWRkcmVzcyA9IGAke2xvY2F0aW9uLnByb3RvY29sfS8vJHtsb2NhdGlvbi5ob3N0fWA7XHJcbiAgICAgICAgdGhpcy5fc29ja2V0ID0gaW8oYWRkcmVzcywge1xyXG4gICAgICAgICAgICAvL3BhdGg6ICcvc29ja2V0JyxcclxuICAgICAgICAgICAgYXV0b0Nvbm5lY3Q6IGZhbHNlLFxyXG4gICAgICAgICAgICByZWNvbm5lY3Rpb246IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbigncGFja2V0JywgcGFja2V0ID0+IHRoaXMub25SZWNlaXZlUGFja2V0KHBhY2tldCkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbTmV0d29ya10gQWRkcmVzczogKCR7YWRkcmVzc30pYCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvbm5lY3QoY2FsbGJhY2s/OiAoKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFtOZXR3b3JrXSBDb25uZWN0aW5nLi4uYCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3NvY2tldC5jb25uZWN0KCk7XHJcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uY2UoJ2Nvbm5lY3QnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrPy4oKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9zZW5kVGltZSArPSBkdDtcclxuXHJcbiAgICAgICAgY29uc3QgZW50aXR5ID0gR2FtZUNsaWVudC5wbGF5ZXI7XHJcblxyXG4gICAgICAgIGlmKCFlbnRpdHkpIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYodGhpcy5fc2VuZFRpbWUgPD0gdGhpcy5fc2VuZFBhY2tldHNEZWxheS8xMDAwKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fc2VuZFRpbWUgPSAwO1xyXG5cclxuICAgICAgICBjb25zdCBwYWNrZXREYXRhOiBJUGFja2V0RGF0YV9FbnRpdHlEYXRhID0ge1xyXG4gICAgICAgICAgICBlbnRpdHlJZDogZW50aXR5LmlkLFxyXG4gICAgICAgICAgICBlbnRpdHlUeXBlOiBlbnRpdHkuY29uc3RydWN0b3IubmFtZSxcclxuICAgICAgICAgICAgZGF0YTogZW50aXR5LnRvSlNPTigpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNlbmQoUGFja2V0VHlwZS5FTlRJVFlfREFUQSwgcGFja2V0RGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbmQodHlwZTogUGFja2V0VHlwZSwgZGF0YT86IGFueSkge1xyXG4gICAgICAgIGNvbnN0IHBhY2tldDogSVBhY2tldCA9IHtcclxuICAgICAgICAgICAgdHlwZTogdHlwZSxcclxuICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNvY2tldC5lbWl0KCdwYWNrZXQnLCBwYWNrZXQpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgb25SZWNlaXZlUGFja2V0KHBhY2tldDogSVBhY2tldCkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2cocGFja2V0KVxyXG5cclxuICAgICAgICBpZihwYWNrZXQudHlwZSA9PSBQYWNrZXRUeXBlLkNPTk5FQ1RfVE9fU0VSVkVSX1NUQVRVUykge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhOiBJUGFja2V0RGF0YV9Db25uZWN0VG9TZXJ2ZXJTdGF0dXMgPSBwYWNrZXQuZGF0YTtcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgR2FtZUNsaWVudC5wbGF5ZXJJZCA9IGRhdGEuZW50aXR5SWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihwYWNrZXQudHlwZSA9PSBQYWNrZXRUeXBlLkVOVElUWV9EQVRBKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGE6IElQYWNrZXREYXRhX0VudGl0eURhdGEgPSBwYWNrZXQuZGF0YTtcclxuXHJcbiAgICAgICAgICAgIFdvcmxkU3luY0hlbHBlci5vblJlY2VpdmVFbnRpdHlEYXRhKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgcHJpdmF0ZSBvblJlY2VpdmVQYWNrZXQocGFja2V0OiBJUGFja2V0KSB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICAqL1xyXG59IiwiZXhwb3J0IGVudW0gUGFja2V0VHlwZSB7XHJcbiAgICBSRVFVRVNUX1NFUlZFUl9MSVNULFxyXG4gICAgU0VSVkVSX0xJU1QsXHJcbiAgICBDT05ORUNUX1RPX1NFUlZFUixcclxuICAgIENPTk5FQ1RfVE9fU0VSVkVSX1NUQVRVUyxcclxuICAgIEVOVElUWV9EQVRBXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhY2tldCB7XHJcbiAgICB0eXBlOiBQYWNrZXRUeXBlXHJcbiAgICBkYXRhPzogYW55XHJcbn1cclxuXHJcbi8qXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhY2tldERhdGFfU2VydmVyTGlzdCB7XHJcbiAgICBzZXJ2ZXJzOiBTZXJ2ZXJJbmZvW11cclxufVxyXG4qL1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUGFja2V0RGF0YV9Db25uZWN0VG9TZXJ2ZXIge1xyXG4gICAgaWQ6IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQYWNrZXREYXRhX0lkIHtcclxuICAgIGlkOiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUGFja2V0RGF0YV9Db25uZWN0VG9TZXJ2ZXJTdGF0dXMge1xyXG4gICAgc2VydmVySWQ6IHN0cmluZ1xyXG4gICAgZW50aXR5SWQ6IHN0cmluZ1xyXG4gICAgc3VjY2VzczogYm9vbGVhblxyXG4gICAgZXJyb3JNZXNzYWdlPzogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhY2tldERhdGFfRW50aXR5RGF0YSB7XHJcbiAgICBlbnRpdHlJZDogc3RyaW5nXHJcbiAgICBlbnRpdHlUeXBlOiBzdHJpbmdcclxuICAgIGRhdGE6IGFueVxyXG59IiwiaW1wb3J0IHsgRW50aXR5IH0gZnJvbSBcIi4uL2VudGl0eS9lbnRpdHlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBFbnRpdHlGYWN0b3J5IHtcclxuICAgIHByaXZhdGUgX3JlZ2lzdGVyZWRFbnRpdGllcyA9IG5ldyBNYXA8c3RyaW5nLCB0eXBlb2YgRW50aXR5PigpO1xyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlckVudGl0eShuYW1lOiBzdHJpbmcsIGU6IHR5cGVvZiBFbnRpdHkpIHtcclxuICAgICAgICB0aGlzLl9yZWdpc3RlcmVkRW50aXRpZXMuc2V0KG5hbWUsIGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRFbnRpdHkobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgZSA9IHRoaXMuX3JlZ2lzdGVyZWRFbnRpdGllcy5nZXQobmFtZSk7XHJcbiAgICAgICAgaWYoIWUpIHRocm93IGBFbnRpdHkgdHlwZSAnJHtuYW1lfScgaXMgaW52YWxpZGA7XHJcbiAgICAgICAgcmV0dXJuIGU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwiLi4vZW50aXR5L2VudGl0eVwiO1xyXG5pbXBvcnQgeyBFbnRpdHlPYmplY3QgfSBmcm9tIFwiLi4vZW50aXR5L2VudGl0eU9iamVjdFwiO1xyXG5pbXBvcnQgeyBFbnRpdHlQbGF5ZXIgfSBmcm9tIFwiLi4vZW50aXR5L2VudGl0eVBsYXllclwiO1xyXG5pbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uL2dhbWUvZ2FtZVwiO1xyXG5pbXBvcnQgeyBXb3JsZCB9IGZyb20gXCIuLi93b3JsZC93b3JsZFwiO1xyXG5pbXBvcnQgeyBFbnRpdHlGYWN0b3J5IH0gZnJvbSBcIi4vZW50aXR5RmFjdG9yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNlcnZlciB7XHJcbiAgICBwcml2YXRlIF9nYW1lOiBHYW1lO1xyXG4gICAgcHJpdmF0ZSBfd29ybGRzID0gbmV3IE1hcDxzdHJpbmcsIFdvcmxkPigpO1xyXG4gICAgcHJpdmF0ZSBfZW50aXR5RmFjdG9yeTogRW50aXR5RmFjdG9yeTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IHdvcmxkcygpIHsgcmV0dXJuIEFycmF5LmZyb20odGhpcy5fd29ybGRzLnZhbHVlcygpKTsgfVxyXG4gICAgcHVibGljIGdldCBnYW1lKCkgeyByZXR1cm4gdGhpcy5fZ2FtZTsgfVxyXG4gICAgcHVibGljIGdldCBlbnRpdHlGYWN0b3J5KCkgeyByZXR1cm4gdGhpcy5fZW50aXR5RmFjdG9yeTsgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGdhbWU6IEdhbWUpIHtcclxuICAgICAgICB0aGlzLl9nYW1lID0gZ2FtZTtcclxuICAgICAgICB0aGlzLl9lbnRpdHlGYWN0b3J5ID0gbmV3IEVudGl0eUZhY3RvcnkoKTtcclxuXHJcbiAgICAgICAgdGhpcy5lbnRpdHlGYWN0b3J5LnJlZ2lzdGVyRW50aXR5KCdFbnRpdHlQbGF5ZXInLCBFbnRpdHlQbGF5ZXIpO1xyXG4gICAgICAgIHRoaXMuZW50aXR5RmFjdG9yeS5yZWdpc3RlckVudGl0eSgnRW50aXR5T2JqZWN0JywgRW50aXR5T2JqZWN0KTtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGVXb3JsZCgnd29ybGQnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLndvcmxkcy5tYXAod29ybGQgPT4gd29ybGQudXBkYXRlKGR0KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZVdvcmxkKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHdvcmxkID0gbmV3IFdvcmxkKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX3dvcmxkcy5zZXQobmFtZSwgd29ybGQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IENBTk5PTiBmcm9tICdjYW5ub24nXHJcbmltcG9ydCAqIGFzIHBjIGZyb20gJ3BsYXljYW52YXMnO1xyXG5pbXBvcnQgeyBEYXRhV2F0Y2hlciB9IGZyb20gJy4uL2NsaWVudC9kYXRhV2F0Y2hlcic7XHJcbmltcG9ydCB7IEVudGl0eSB9IGZyb20gJy4uL2VudGl0eS9lbnRpdHknO1xyXG5pbXBvcnQgeyBFbnRpdHlPYmplY3QsIElFbnRpdHlPYmplY3RDdXN0b21EYXRhLCBJRW50aXR5T2JqZWN0U2hhcGUgfSBmcm9tICcuLi9lbnRpdHkvZW50aXR5T2JqZWN0JztcclxuaW1wb3J0IHsgRW50aXR5UGxheWVyIH0gZnJvbSAnLi4vZW50aXR5L2VudGl0eVBsYXllcic7XHJcbmltcG9ydCB7IFNlcnZlciB9IGZyb20gXCIuLi9zZXJ2ZXIvc2VydmVyXCI7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JsZCB7XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VydmVyOiBTZXJ2ZXI7XHJcbiAgICBwcml2YXRlIF9keW5hbWljV29ybGQ6IENBTk5PTi5Xb3JsZDtcclxuICAgIHByaXZhdGUgX2VudGl0aWVzID0gbmV3IE1hcDxzdHJpbmcsIEVudGl0eT4oKTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNlcnZlcigpIHsgcmV0dXJuIHRoaXMuX3NlcnZlciB9O1xyXG4gICAgcHVibGljIGdldCBkeW5hbWljV29ybGQoKSB7IHJldHVybiB0aGlzLl9keW5hbWljV29ybGQgfTtcclxuICAgIHB1YmxpYyBnZXQgZW50aXRpZXMoKSB7IHJldHVybiBBcnJheS5mcm9tKHRoaXMuX2VudGl0aWVzLnZhbHVlcygpKSB9O1xyXG5cclxuICAgIHB1YmxpYyBfbWF0ZXJpYWxfZ3JvdW5kOiBDQU5OT04uTWF0ZXJpYWw7XHJcbiAgICBwdWJsaWMgX21hdGVyaWFsX3Rlc3Q6IENBTk5PTi5NYXRlcmlhbDtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3Ioc2VydmVyOiBTZXJ2ZXIpIHtcclxuICAgICAgICB0aGlzLl9zZXJ2ZXIgPSBzZXJ2ZXI7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBEeW5hbWljV29ybGQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgZml4ZWRUaW1lU3RlcCA9IDEuMCAvIDYwLjA7IC8vIHNlY29uZHNcclxuICAgICAgICB2YXIgbWF4U3ViU3RlcHMgPSAzO1xyXG5cclxuICAgICAgICB0aGlzLmVudGl0aWVzLm1hcChlbnRpdHkgPT4gZW50aXR5LnVwZGF0ZShkdCkpO1xyXG4gICAgICAgIHRoaXMuZHluYW1pY1dvcmxkLnN0ZXAoZml4ZWRUaW1lU3RlcCwgZHQsIG1heFN1YlN0ZXBzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RW50aXR5KGlkOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZW50aXRpZXMuZ2V0KGlkKSE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhhc0VudGl0eShpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VudGl0aWVzLmhhcyhpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXR1cER5bmFtaWNXb3JsZCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnc2V0dXBEeW5hbWljV29ybGQnKVxyXG5cclxuICAgICAgICAvLyBTZXR1cCBvdXIgd29ybGRcclxuICAgICAgICB2YXIgd29ybGQgPSB0aGlzLl9keW5hbWljV29ybGQgPSBuZXcgQ0FOTk9OLldvcmxkKCk7XHJcbiAgICAgICAgd29ybGQuZ3Jhdml0eSA9IG5ldyBDQU5OT04uVmVjMygwLCAwLCAtOS44MikgLy8gbS9zwrJcclxuICAgICAgICBcclxuICAgICAgICAvL21hdDFcclxuICAgICAgICBjb25zdCBncm91bmRNYXRlcmlhbCA9IG5ldyBDQU5OT04uTWF0ZXJpYWwoXCJncm91bmRNYXRlcmlhbFwiKTtcclxuICAgICAgICBjb25zdCBncm91bmRfZ3JvdW5kX2NtID0gbmV3IENBTk5PTi5Db250YWN0TWF0ZXJpYWwoZ3JvdW5kTWF0ZXJpYWwsIGdyb3VuZE1hdGVyaWFsLCB7XHJcbiAgICAgICAgICAgIGZyaWN0aW9uOiAwLjQsXHJcbiAgICAgICAgICAgIHJlc3RpdHV0aW9uOiAwLjMsXHJcbiAgICAgICAgICAgIGNvbnRhY3RFcXVhdGlvblN0aWZmbmVzczogMWU4LFxyXG4gICAgICAgICAgICBjb250YWN0RXF1YXRpb25SZWxheGF0aW9uOiAzLFxyXG4gICAgICAgICAgICBmcmljdGlvbkVxdWF0aW9uU3RpZmZuZXNzOiAxZThcclxuICAgICAgICB9KTtcclxuICAgICAgICB3b3JsZC5hZGRDb250YWN0TWF0ZXJpYWwoZ3JvdW5kX2dyb3VuZF9jbSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNsaXBwZXJ5TWF0ZXJpYWwgPSBuZXcgQ0FOTk9OLk1hdGVyaWFsKFwic2xpcHBlcnlNYXRlcmlhbFwiKTtcclxuICAgICAgICBjb25zdCBzbGlwcGVyeV9ncm91bmRfY20gPSBuZXcgQ0FOTk9OLkNvbnRhY3RNYXRlcmlhbChncm91bmRNYXRlcmlhbCwgc2xpcHBlcnlNYXRlcmlhbCwge1xyXG4gICAgICAgICAgICBmcmljdGlvbjogMC4wMDMsXHJcbiAgICAgICAgICAgIHJlc3RpdHV0aW9uOiAwLFxyXG4gICAgICAgICAgICBjb250YWN0RXF1YXRpb25TdGlmZm5lc3M6IDFlOCxcclxuICAgICAgICAgICAgY29udGFjdEVxdWF0aW9uUmVsYXhhdGlvbjogM1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHdvcmxkLmFkZENvbnRhY3RNYXRlcmlhbChzbGlwcGVyeV9ncm91bmRfY20pO1xyXG5cclxuICAgICAgICB0aGlzLl9tYXRlcmlhbF9ncm91bmQgPSBncm91bmRNYXRlcmlhbDtcclxuICAgICAgICB0aGlzLl9tYXRlcmlhbF90ZXN0ID0gc2xpcHBlcnlNYXRlcmlhbDtcclxuXHJcblxyXG4gICAgICAgIGNvbnN0IHNsaXBwZXJ5X2dyb3VuZF9jbTIgPSBuZXcgQ0FOTk9OLkNvbnRhY3RNYXRlcmlhbChzbGlwcGVyeU1hdGVyaWFsLCBzbGlwcGVyeU1hdGVyaWFsLCB7XHJcbiAgICAgICAgICAgIGZyaWN0aW9uOiAwLjAwMCxcclxuICAgICAgICAgICAgcmVzdGl0dXRpb246IDAsXHJcbiAgICAgICAgICAgIGNvbnRhY3RFcXVhdGlvblN0aWZmbmVzczogMWU4LFxyXG4gICAgICAgICAgICBjb250YWN0RXF1YXRpb25SZWxheGF0aW9uOiAzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgd29ybGQuYWRkQ29udGFjdE1hdGVyaWFsKHNsaXBwZXJ5X2dyb3VuZF9jbTIpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgY29uc3QgYnVpbGRpbmcgPSB0aGlzLnNwYXduUmVjdGFuZ2xlT2JqZWN0KFxyXG4gICAgICAgICAgICBuZXcgQ0FOTk9OLlZlYzMoNSwgMywgMiksXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGJvZHk6IG5ldyBDQU5OT04uQm9keSh7bWFzczogMCwgbWF0ZXJpYWw6IHRoaXMuX21hdGVyaWFsX2dyb3VuZCwgc2hhcGU6IG5ldyBDQU5OT04uQm94KG5ldyBDQU5OT04uVmVjMygyLCAyLCA2KSl9KSxcclxuICAgICAgICAgICAgICAgIGNvbG9yOiBuZXcgcGMuQ29sb3IoMC41LCAwLjcsIDApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgICAgICovXHJcbiAgICAgICAgXHJcblxyXG5cclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBncm91bmRCb2R5T3B0aW9uczogQ0FOTk9OLklCb2R5T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgbWFzczogMCxcclxuICAgICAgICAgICAgbWF0ZXJpYWw6IHRoaXMuX21hdGVyaWFsX2dyb3VuZFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGdyb3VuZCA9IHRoaXMuc3Bhd25SZWN0YW5nbGVPYmplY3QobmV3IENBTk5PTi5WZWMzKDAsIDAsIDApLCBuZXcgQ0FOTk9OLlZlYzMoMzAsIDMwLCAxKSwgZ3JvdW5kQm9keU9wdGlvbnMsIG5ldyBwYy5Db2xvcigxLCAxLCAxKSk7XHJcbiAgICAgICAgZ3JvdW5kLmRvbnRTeW5jID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgY29uc3QgYnVpbGRpbmcxID0gdGhpcy5zcGF3blJlY3RhbmdsZU9iamVjdChuZXcgQ0FOTk9OLlZlYzMoLTUsIDAsIDIpLCBuZXcgQ0FOTk9OLlZlYzMoMiwgNCwgMiksIGdyb3VuZEJvZHlPcHRpb25zLCBuZXcgcGMuQ29sb3IoMSwgMCwgMCkpO1xyXG4gICAgICAgIGJ1aWxkaW5nMS5kb250U3luYyA9IHRydWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3Qgc3RhaXJzID0gdGhpcy5zcGF3blJlY3RhbmdsZU9iamVjdChuZXcgQ0FOTk9OLlZlYzMoLTMsIDIsIDEpLCBuZXcgQ0FOTk9OLlZlYzMoMSwgNSwgMSksIGdyb3VuZEJvZHlPcHRpb25zLG5ldyBwYy5Db2xvcigwLjUsIDAuNywgMCkpO1xyXG4gICAgICAgIHN0YWlycy5kb250U3luYyA9IHRydWU7XHJcbiAgICAgICAgc3RhaXJzLnF1YXRlcm5pb24uc2V0RnJvbUV1bGVyKC0zNSwgMCwgMCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGJ1aWxkaW5nMiA9IHRoaXMuc3Bhd25SZWN0YW5nbGVPYmplY3QobmV3IENBTk5PTi5WZWMzKDUsIDMsIDIpLCBuZXcgQ0FOTk9OLlZlYzMoMiwgMiwgNiksIGdyb3VuZEJvZHlPcHRpb25zLCBuZXcgcGMuQ29sb3IoMC41LCAwLjcsIDApKTtcclxuICAgICAgICBidWlsZGluZzIuZG9udFN5bmMgPSB0cnVlO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBpZih0aGlzLnNlcnZlci5nYW1lLmlzU2VydmVyKSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2JqID0gdGhpcy5zcGF3bkN1c3RvbU9iamVjdChcclxuICAgICAgICAgICAgICAgICAgICBuZXcgQ0FOTk9OLlZlYzMoMCwgMCwgMyksXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFwZTogSUVudGl0eU9iamVjdFNoYXBlLlJFQ1RBTkdMRSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmFkaXVzOiAwLjIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbGZFeHRlbnRzOiB7eDogMC4zLCB5OiAwLjMsIHo6IDAuM30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHlPcHRpb25zOiB7bWFzczogMTAwfSxcclxuICAgICAgICAgICAgICAgICAgICB9ICAgIFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYm90ID0gdGhpcy5zcGF3blBsYXllcigpO1xyXG4gICAgICAgICAgICAgICAgYm90LnNldENvbG9yKG5ldyBwYy5Db2xvcigwLCAwLCAxKSlcclxuICAgICAgICAgICAgICAgIGJvdC5zdGFydEJvdEJlaGF2aW91cigpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgXHJcblxyXG4gICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhib3QudG9KU09OKCkpXHJcbiAgICAgICAgICAgIH0sIDEwMDApXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuXHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZ2FtZS5pc1NlcnZlcikge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3Bhd25QbGF5ZXIoKS5zdGFydEJvdEJlaGF2aW91cigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICAqL1xyXG5cclxuICAgICAgICAvL2NvbnN0IGJveCA9IHRoaXMuc3Bhd25UZXN0RW50aXR5KG5ldyBDQU5OT04uVmVjMygwLCAwLCA0KSwgbmV3IENBTk5PTi5WZWMzKDEsIDEsIDEpLCB7bWFzczogMjAwfSk7XHJcbiAgICAgICAgLy9jb25zdCBib3gyID0gdGhpcy5zcGF3blRlc3RFbnRpdHkobmV3IENBTk5PTi5WZWMzKDAsIDEsIDgpLCBuZXcgQ0FOTk9OLlZlYzMoMSwgMSwgMSksIHttYXNzOiAyMDB9KTtcclxuICAgICAgICBcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgLy9zZXRJbnRlcnZhbCgoKSA9PiB7IHRoaXMuc3Bhd25UZXN0RW50aXR5KCk7IH0sIDEwMDApXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNwYXduUmVjdGFuZ2xlT2JqZWN0KHBvc2l0aW9uOiBDQU5OT04uVmVjMywgaGFsZkV4dGVuZHM6IENBTk5PTi5WZWMzLCBib2R5T3B0aW9uczogQ0FOTk9OLklCb2R5T3B0aW9ucywgY29sb3I6IHBjLkNvbG9yKSB7XHJcbiAgICAgICAgY29uc3Qgb2JqRGF0YTogSUVudGl0eU9iamVjdEN1c3RvbURhdGEgPSB7XHJcbiAgICAgICAgICAgIHNoYXBlOiBJRW50aXR5T2JqZWN0U2hhcGUuUkVDVEFOR0xFLFxyXG4gICAgICAgICAgICBoYWxmRXh0ZW50czogaGFsZkV4dGVuZHMsXHJcbiAgICAgICAgICAgIGJvZHlPcHRpb25zOiBib2R5T3B0aW9ucyxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLnNwYXduQ3VzdG9tT2JqZWN0KFxyXG4gICAgICAgICAgICBwb3NpdGlvbixcclxuICAgICAgICAgICAgb2JqRGF0YVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJlY3Quc2V0Q29sb3IoY29sb3IpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVjdDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3Bhd25QbGF5ZXIoKSB7XHJcbiAgICAgICAgY29uc3QgcGxheWVyID0gbmV3IEVudGl0eVBsYXllcih0aGlzKTtcclxuICAgICAgICBwbGF5ZXIucG9zaXRpb24uc2V0KDAsIDAsIDMpXHJcbiAgICAgICAgdGhpcy5hZGRFbnRpdHkocGxheWVyKTtcclxuICAgICAgICByZXR1cm4gcGxheWVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRFbnRpdHkoZW50aXR5OiBFbnRpdHkpIHtcclxuICAgICAgICB0aGlzLl9lbnRpdGllcy5zZXQoZW50aXR5LmlkLCBlbnRpdHkpO1xyXG4gICAgICAgIGVudGl0eS5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcblxyXG4gICAgcHVibGljIHNwYXduQ3VzdG9tT2JqZWN0KHBvc2l0aW9uOiBDQU5OT04uVmVjMywgb2JqZWN0RGF0YTogSUVudGl0eU9iamVjdEN1c3RvbURhdGEpIHtcclxuICAgICAgICBjb25zdCBvYmplY3QgPSBuZXcgRW50aXR5T2JqZWN0KHRoaXMpO1xyXG4gICAgICAgIG9iamVjdC5zZXRDdXN0b21EYXRhKG9iamVjdERhdGEpO1xyXG4gICAgICAgIG9iamVjdC5wb3NpdGlvbi5zZXQocG9zaXRpb24ueCwgcG9zaXRpb24ueSwgcG9zaXRpb24ueik7XHJcbiAgICAgICAgdGhpcy5hZGRFbnRpdHkob2JqZWN0KTtcclxuICAgICAgICByZXR1cm4gb2JqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcHJpbnRQb3NpdGlvbihwb3M6IENBTk5PTi5WZWMzKSB7XHJcbiAgICAgICAgcmV0dXJuIGAoJHtwb3MueH0sICR7cG9zLnl9LCAke3Bvcy56fSlgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZVJlY3RhbmdsZUJvZHkocG9zaXRpb246IENBTk5PTi5WZWMzLCBoYWxmRXh0ZW5kczogQ0FOTk9OLlZlYzMsIG9wdGlvbnM/OiBDQU5OT04uSUJvZHlPcHRpb25zKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3Qgb3B0ID0gb3B0aW9ucyB8fCB7fTtcclxuXHJcbiAgICAgICAgb3B0LnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICAgXHJcbiAgICAgICAgdmFyIHNoYXBlID0gbmV3IENBTk5PTi5Cb3goaGFsZkV4dGVuZHMpO1xyXG4gICAgICAgIHZhciBib2R5ID0gbmV3IENBTk5PTi5Cb2R5KG9wdCk7XHJcbiAgICAgICAgYm9keS5hZGRTaGFwZShzaGFwZSk7XHJcblxyXG4gICAgICAgIHRoaXMuZHluYW1pY1dvcmxkLmFkZEJvZHkoYm9keSk7XHJcblxyXG4gICAgICAgIHJldHVybiBib2R5OyBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlU3BoZXJlQm9keShwb3NpdGlvbjogQ0FOTk9OLlZlYzMsIHJhZGl1czogbnVtYmVyLCBvcHRpb25zPzogQ0FOTk9OLklCb2R5T3B0aW9ucykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IG9wdCA9IG9wdGlvbnMgfHwge307XHJcblxyXG4gICAgICAgIG9wdC5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgIFxyXG4gICAgICAgIHZhciBzaGFwZSA9IG5ldyBDQU5OT04uU3BoZXJlKHJhZGl1cyk7XHJcbiAgICAgICAgdmFyIGJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkob3B0KTtcclxuICAgICAgICBib2R5LmFkZFNoYXBlKHNoYXBlKTtcclxuXHJcbiAgICAgICAgdGhpcy5keW5hbWljV29ybGQuYWRkQm9keShib2R5KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJvZHk7IFxyXG4gICAgfVxyXG59XHJcblxyXG4vKlxyXG5jb25zdCBlbnRpdHkgPSBuZXcgcGMuRW50aXR5KG5hbWUpO1xyXG5lbnRpdHkuc2V0UG9zaXRpb24ocG9zaXRpb24pXHJcbnRoaXMuY3JlYXRlUmVjdGFuZ2xlQXRFbnRpdHkoZW50aXR5LCBzaXplLCBpc0R5bmFtaWMsIGNvbG9yKTtcclxuYXBwLnJvb3QuYWRkQ2hpbGQoZW50aXR5KTtcclxuKi8iLCJpbXBvcnQgKiBhcyBwYyBmcm9tIFwicGxheWNhbnZhc1wiO1xyXG5pbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwiLi4vZW50aXR5L2VudGl0eVwiO1xyXG5pbXBvcnQgeyBFbnRpdHlQbGF5ZXIgfSBmcm9tIFwiLi4vZW50aXR5L2VudGl0eVBsYXllclwiO1xyXG5pbXBvcnQgeyBHYW1lQ2xpZW50IH0gZnJvbSBcIi4uL2dhbWUvZ2FtZUNsaWVudFwiO1xyXG5pbXBvcnQgeyBJUGFja2V0RGF0YV9FbnRpdHlEYXRhIH0gZnJvbSBcIi4uL3BhY2tldC9wYWNrZXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JsZFN5bmNIZWxwZXIge1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgZ2FtZSgpIHsgcmV0dXJuIEdhbWVDbGllbnQuSW5zdGFuY2U7IH07XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBvblJlY2VpdmVFbnRpdHlEYXRhKGRhdGE6IElQYWNrZXREYXRhX0VudGl0eURhdGEpIHtcclxuICAgICAgICBjb25zdCB3b3JsZCA9IHRoaXMuZ2FtZS5tYWluU2VydmVyLndvcmxkc1swXTtcclxuXHJcbiAgICAgICAgbGV0IGlzTmV3RW50aXR5OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBlbnRpdHk6IEVudGl0eSB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgaWYoIXdvcmxkLmhhc0VudGl0eShkYXRhLmVudGl0eUlkKSkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYyA9IHdvcmxkLnNlcnZlci5lbnRpdHlGYWN0b3J5LmdldEVudGl0eShkYXRhLmVudGl0eVR5cGUpO1xyXG5cclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBlbnRpdHkgPSBuZXcgYyh3b3JsZCk7XHJcbiAgICAgICAgICAgIGVudGl0eS5zZXRJZChkYXRhLmVudGl0eUlkKTtcclxuICAgICAgICAgICAgLy9lbnRpdHkuZGF0YSA9IGRhdGEuZGF0YS5kYXRhOyAvLyAnLSdcclxuXHJcbiAgICAgICAgICAgLy8gXHJcbiAgICAgICAgICAgIGlzTmV3RW50aXR5ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCduZXcgZW50aXknKVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coW2VudGl0eV0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZighZW50aXR5KSBlbnRpdHkgPSB3b3JsZC5nZXRFbnRpdHkoZGF0YS5lbnRpdHlJZCk7XHJcblxyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiXFxuXFxuXCIsIEpTT04uc3RyaW5naWZ5KGRhdGEuZGF0YSkpXHJcbiAgICAgICAgZW50aXR5LmZyb21KU09OKGRhdGEuZGF0YSk7XHJcblxyXG4gICAgICAgIGlmKGlzTmV3RW50aXR5KSB7XHJcbiAgICAgICAgICAgIHdvcmxkLmFkZEVudGl0eShlbnRpdHkpO1xyXG4gICAgICAgICAgICBlbnRpdHkuY2FuTGVycCA9IHRydWU7XHJcbiAgICAgICAgICAgIC8vZW50aXR5LnNjcmlwdCEuY3JlYXRlKCdlbnRpdHlTeW5jJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgaWYoZW50aXR5LmlkID09IEdhbWVDbGllbnQucGxheWVySWQpIHtcclxuXHJcbiAgICAgICAgICAgIGlmKCFHYW1lQ2xpZW50LnBsYXllcikge1xyXG4gICAgICAgICAgICAgICAgR2FtZUNsaWVudC5wbGF5ZXIgPSBlbnRpdHkgYXMgRW50aXR5O1xyXG4gICAgICAgICAgICAgICAgR2FtZUNsaWVudC5wbGF5ZXIuY2FuTGVycCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgLy9HYW1lQ2xpZW50LnBsYXllci5zZXRDb250cm9sbGFibGUoKTtcclxuICAgICAgICAgICAgICAgIC8vR2FtZUNsaWVudC5jYW1lcmFGb2xsb3dFbnRpdHkoZW50aXR5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRzW2ldXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2RtZGFzc2NfZ2FtZVwiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtkbWRhc3NjX2dhbWVcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpKSlcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9yc1wiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3dlYnBhY2svY3JlZGl0cy5qc1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9