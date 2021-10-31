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
        if (this.velocity.almostZero(0.05))
            this.velocity.setZero();
        if (this.angularVelocity.almostZero(0.05))
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1VFaERBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9lbnRpdHkvZW50aXR5LnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9lbnRpdHkvZW50aXR5T2JqZWN0LnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9lbnRpdHkvZW50aXR5UGxheWVyLnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9nYW1lL2dhbWUudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL2dhbWUvZ2FtZUNsaWVudC50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL25ldHdvcmsvbmV0d29yay50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvcGFja2V0L3BhY2tldC50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvc2VydmVyL2VudGl0eUZhY3RvcnkudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL3NlcnZlci9zZXJ2ZXIudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL3dvcmxkL3dvcmxkLnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy93b3JsZC93b3JsZFN5bmNIZWxwZXIudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYyBmcm9tICdwbGF5Y2FudmFzJztcclxuaW1wb3J0IFBoYXNlciBmcm9tICdwaGFzZXInO1xyXG5pbXBvcnQgQ0FOTk9OIGZyb20gJ2Nhbm5vbic7XHJcbmltcG9ydCB7IFdvcmxkIH0gZnJvbSBcIi4uL3dvcmxkL3dvcmxkXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElFbnRpdHlEYXRhIHtcclxuICAgIHBvcz86IG51bWJlcltdXHJcbiAgICB2ZWw/OiBudW1iZXJbXVxyXG4gICAgcm90PzogbnVtYmVyW11cclxuICAgIGFWZWw/OiBudW1iZXJbXVxyXG4gICAgaW5wdXQ/OiBudW1iZXJbXVxyXG4gICAgZGF0YT86IGFueVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRW50aXR5IHtcclxuICAgIHB1YmxpYyBwY0VudGl0eT86IHBjLkVudGl0eTtcclxuXHJcbiAgICBwdWJsaWMgZG9udFN5bmM6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBjYW5MZXJwOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgcHVibGljIGRhdGE6IGFueSA9IHt9O1xyXG4gICAgcHVibGljIGlucHV0ID0ge2hvcml6b250YWw6IDAsIHZlcnRpY2FsOiAwfVxyXG5cclxuICAgIHByaXZhdGUgX3Bvc2l0aW9uID0gbmV3IENBTk5PTi5WZWMzKCk7XHJcbiAgICBwcml2YXRlIF92ZWxvY2l0eSA9IG5ldyBDQU5OT04uVmVjMygpO1xyXG4gICAgcHJpdmF0ZSBfcXVhdGVybmlvbiA9IG5ldyBDQU5OT04uUXVhdGVybmlvbigpO1xyXG5cclxuICAgIHByaXZhdGUgX2lkOiBzdHJpbmcgPSBgJHtNYXRoLnJhbmRvbSgpfWA7XHJcbiAgICBwcml2YXRlIF93b3JsZDogV29ybGQ7XHJcbiAgICBwcml2YXRlIF9ib2R5PzogQ0FOTk9OLkJvZHk7XHJcbiAgICBcclxuICAgIHB1YmxpYyBnZXQgaWQoKSB7IHJldHVybiB0aGlzLl9pZDsgfVxyXG4gICAgcHVibGljIGdldCB3b3JsZCgpIHsgcmV0dXJuIHRoaXMuX3dvcmxkOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGJvZHkoKSB7IHJldHVybiB0aGlzLl9ib2R5OyB9XHJcbiAgICBwdWJsaWMgZ2V0IHBvc2l0aW9uKCkgeyByZXR1cm4gdGhpcy5fcG9zaXRpb247IH1cclxuICAgIHB1YmxpYyBnZXQgdmVsb2NpdHkoKSB7IHJldHVybiB0aGlzLl92ZWxvY2l0eTsgfVxyXG4gICAgcHVibGljIGdldCBxdWF0ZXJuaW9uKCkgeyByZXR1cm4gdGhpcy5fcXVhdGVybmlvbjsgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgYW5ndWxhclZlbG9jaXR5KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX2JvZHkpIHJldHVybiB0aGlzLl9ib2R5LmFuZ3VsYXJWZWxvY2l0eTtcclxuICAgICAgICByZXR1cm4gQ0FOTk9OLlZlYzMuWkVSTztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih3b3JsZDogV29ybGQpIHtcclxuICAgICAgICB0aGlzLl93b3JsZCA9IHdvcmxkO1xyXG5cclxuICAgICAgICB0aGlzLnNldENvbG9yKHBjLkNvbG9yLldISVRFKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5pdCgpIHt9XHJcblxyXG4gICAgcHVibGljIHNldENvbG9yKGNvbG9yOiBwYy5Db2xvcikge1xyXG4gICAgICAgIHRoaXMuZGF0YS5jb2xvciA9IFtjb2xvci5yLCBjb2xvci5nLCBjb2xvci5iXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Qm9keShib2R5OiBDQU5OT04uQm9keSkge1xyXG4gICAgICAgIGJvZHkucG9zaXRpb24uc2V0KHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55LCB0aGlzLnBvc2l0aW9uLnopO1xyXG5cclxuICAgICAgICB0aGlzLl9ib2R5ID0gYm9keTtcclxuICAgICAgICB0aGlzLl9wb3NpdGlvbiA9IGJvZHkucG9zaXRpb247XHJcbiAgICAgICAgdGhpcy5fcXVhdGVybmlvbiA9IGJvZHkucXVhdGVybmlvbjtcclxuICAgICAgICB0aGlzLl92ZWxvY2l0eSA9IGJvZHkudmVsb2NpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldElkKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9pZCA9IGlkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydEJvdEJlaGF2aW91cigpIHtcclxuICAgICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXQuaG9yaXpvbnRhbCA9IE1hdGgucmFuZG9tKCkqMi0xXHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXQudmVydGljYWwgPSBNYXRoLnJhbmRvbSgpKjItMVxyXG4gICAgICAgIH0sIDQwMClcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHVwZGF0ZShkdDogbnVtYmVyKSB7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgaWYodGhpcy5jYW5MZXJwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbjtcclxuICAgICAgICAgICAgY29uc3QgbmV3UG9zaXRpb24gPSBuZXcgQ0FOTk9OLlZlYzMoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gcG9zaXRpb24uZGlzdGFuY2VUbyh0aGlzLl90YXJnZXRQb3NpdGlvbik7XHJcblxyXG4gICAgICAgICAgICBsZXQgbGVycEFtb3VudCA9IDAuMztcclxuICAgICAgICAgICAgaWYoZGlzdGFuY2UgPiAyLjUpIGxlcnBBbW91bnQgPSAxO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHBvc2l0aW9uLmxlcnAodGhpcy5fdGFyZ2V0UG9zaXRpb24sIGxlcnBBbW91bnQsIG5ld1Bvc2l0aW9uKTtcclxuICAgICAgICAgICAgcG9zaXRpb24uc2V0KG5ld1Bvc2l0aW9uLngsIG5ld1Bvc2l0aW9uLnksIG5ld1Bvc2l0aW9uLnopO1xyXG4gICAgICAgIH1cclxuICAgICAgICAqL1xyXG5cclxuICAgICAgICBpZih0aGlzLmNhbkxlcnApIHtcclxuICAgICAgICAgICAgY29uc3QgcXVhdGVybmlvbiA9IHRoaXMucXVhdGVybmlvbjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vY29uc3QgcWZyb20gPSBuZXcgUGhhc2VyLk1hdGguUXVhdGVybmlvbihxdWF0ZXJuaW9uLngsIHF1YXRlcm5pb24ueSwgcXVhdGVybmlvbi56LCBxdWF0ZXJuaW9uLncpO1xyXG4gICAgICAgICAgICAvL2NvbnN0IHF0byA9IG5ldyBQaGFzZXIuTWF0aC5RdWF0ZXJuaW9uKHRoaXMuX3RhcmdldFF1YXRlcm5pb24ueCwgdGhpcy5fdGFyZ2V0UXVhdGVybmlvbi55LCB0aGlzLl90YXJnZXRRdWF0ZXJuaW9uLnosIHRoaXMuX3RhcmdldFF1YXRlcm5pb24udyk7XHJcbiAgICAgICAgICAgIC8vY29uc3QgcmVzdWx0ID0gcWZyb20ubGVycChxdG8sIDAuMSk7ICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIC8vdGhpcy5xdWF0ZXJuaW9uLnNldChyZXN1bHQueCwgcmVzdWx0LnksIHJlc3VsdC56LCByZXN1bHQudylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMucG9zaXRpb24uZGlzdGFuY2VUbyhDQU5OT04uVmVjMy5aRVJPKSA+IDIwKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24uc2V0KDAsIDAsIDIpO1xyXG4gICAgICAgICAgICB0aGlzLmJvZHk/LnZlbG9jaXR5LnNldFplcm8oKTtcclxuICAgICAgICAgICAgdGhpcy5ib2R5Py5hbmd1bGFyVmVsb2NpdHkuc2V0WmVybygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy52ZWxvY2l0eS5hbG1vc3RaZXJvKDAuMDUpKSB0aGlzLnZlbG9jaXR5LnNldFplcm8oKVxyXG4gICAgICAgIGlmKHRoaXMuYW5ndWxhclZlbG9jaXR5LmFsbW9zdFplcm8oMC4wNSkpIHRoaXMuYW5ndWxhclZlbG9jaXR5LnNldFplcm8oKVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b0pTT04oKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YTogSUVudGl0eURhdGEgPSB7fVxyXG5cclxuICAgICAgICBkYXRhLnBvcyA9IFt0aGlzLnBvc2l0aW9uLngsIHRoaXMucG9zaXRpb24ueSwgdGhpcy5wb3NpdGlvbi56XTtcclxuICAgICAgICBkYXRhLnJvdCA9IFt0aGlzLnF1YXRlcm5pb24ueCwgdGhpcy5xdWF0ZXJuaW9uLnksIHRoaXMucXVhdGVybmlvbi56LCB0aGlzLnF1YXRlcm5pb24ud107XHJcbiAgICAgICAgZGF0YS52ZWwgPSBbdGhpcy52ZWxvY2l0eS54LCB0aGlzLnZlbG9jaXR5LnksIHRoaXMudmVsb2NpdHkuel07XHJcbiAgICAgICAgZGF0YS5hVmVsID0gW3RoaXMuYW5ndWxhclZlbG9jaXR5LngsIHRoaXMuYW5ndWxhclZlbG9jaXR5LnksIHRoaXMuYW5ndWxhclZlbG9jaXR5LnpdO1xyXG4gICAgICAgIGRhdGEuaW5wdXQgPSBbdGhpcy5pbnB1dC5ob3Jpem9udGFsLCB0aGlzLmlucHV0LnZlcnRpY2FsXTtcclxuICAgICAgICBkYXRhLmRhdGEgPSB0aGlzLmRhdGE7XHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmcm9tSlNPTihlbnRpdHlEYXRhOiBJRW50aXR5RGF0YSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vaWYodGhpcyA9PSBHYW1lQ2xpZW50LnBsYXllcikgY29uc29sZS5sb2coJ3Vvc3BzJylcclxuXHJcbiAgICAgICAgaWYoZW50aXR5RGF0YS5wb3MpIHtcclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuY2FuTGVycCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0UG9zaXRpb24gPSBuZXcgQ0FOTk9OLlZlYzMoZW50aXR5RGF0YS5wb3NbMF0sIGVudGl0eURhdGEucG9zWzFdLCBlbnRpdHlEYXRhLnBvc1syXSlcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1Bvc2l0aW9uID0gbmV3IENBTk5PTi5WZWMzKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBwb3NpdGlvbi5kaXN0YW5jZVRvKHRhcmdldFBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbGVycEFtb3VudCA9IDAuMztcclxuICAgICAgICAgICAgICAgIGlmKGRpc3RhbmNlID4gMi41KSBsZXJwQW1vdW50ID0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbi5sZXJwKHRhcmdldFBvc2l0aW9uLCBsZXJwQW1vdW50LCBuZXdQb3NpdGlvbik7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi5zZXQobmV3UG9zaXRpb24ueCwgbmV3UG9zaXRpb24ueSwgbmV3UG9zaXRpb24ueik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGVudGl0eURhdGEudmVsKSB7XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLmNhbkxlcnApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVsb2NpdHkuc2V0KGVudGl0eURhdGEudmVsWzBdLCBlbnRpdHlEYXRhLnZlbFsxXSwgZW50aXR5RGF0YS52ZWxbMl0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihlbnRpdHlEYXRhLmFWZWwpIHtcclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuY2FuTGVycCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmd1bGFyVmVsb2NpdHkuc2V0KGVudGl0eURhdGEuYVZlbFswXSwgZW50aXR5RGF0YS5hVmVsWzFdLCBlbnRpdHlEYXRhLmFWZWxbMl0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihlbnRpdHlEYXRhLnJvdCkge1xyXG4gICAgICAgICAgICBpZih0aGlzLmNhbkxlcnApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucXVhdGVybmlvbi5zZXQoZW50aXR5RGF0YS5yb3RbMF0sIGVudGl0eURhdGEucm90WzFdLCBlbnRpdHlEYXRhLnJvdFsyXSwgZW50aXR5RGF0YS5yb3RbM10pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKGVudGl0eURhdGEuaW5wdXQpIHtcclxuICAgICAgICAgICAgaWYodGhpcy5jYW5MZXJwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0Lmhvcml6b250YWwgPSBlbnRpdHlEYXRhLmlucHV0WzBdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dC52ZXJ0aWNhbCA9IGVudGl0eURhdGEuaW5wdXRbMV07XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihlbnRpdHlEYXRhLmRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gZW50aXR5RGF0YS5kYXRhO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSAgICIsImltcG9ydCAqIGFzIHBjIGZyb20gJ3BsYXljYW52YXMnO1xyXG5pbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwiLi9lbnRpdHlcIjtcclxuaW1wb3J0IENBTk5PTiBmcm9tICdjYW5ub24nO1xyXG5cclxuZXhwb3J0IGVudW0gSUVudGl0eU9iamVjdFNoYXBlIHtcclxuICAgIFJFQ1RBTkdMRSxcclxuICAgIFNQSEVSRVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElFbnRpdHlPYmplY3RDdXN0b21EYXRhIHtcclxuICAgIHNoYXBlOiBJRW50aXR5T2JqZWN0U2hhcGVcclxuICAgIHJhZGl1cz86IG51bWJlclxyXG4gICAgaGFsZkV4dGVudHM/OiB7eDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcn1cclxuICAgIGJvZHlPcHRpb25zPzogQ0FOTk9OLklCb2R5T3B0aW9uc1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRW50aXR5T2JqZWN0IGV4dGVuZHMgRW50aXR5IHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih3b3JsZCkge1xyXG4gICAgICAgIHN1cGVyKHdvcmxkKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRDb2xvcihuZXcgcGMuQ29sb3IoTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSkpXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluaXQoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdCgpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGEpKVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygnaW5pdCcsIHRoaXMuZ2V0Q3VzdG9tRGF0YSgpKVxyXG5cclxuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5nZXRDdXN0b21EYXRhKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbGZFeHRlbnRzID0gZGF0YS5oYWxmRXh0ZW50cyA/IG5ldyBDQU5OT04uVmVjMyhkYXRhLmhhbGZFeHRlbnRzLngsIGRhdGEuaGFsZkV4dGVudHMueSwgZGF0YS5oYWxmRXh0ZW50cy56KSA6IG5ldyBDQU5OT04uVmVjMygxLCAxLCAxKTtcclxuXHJcbiAgICAgXHJcbiAgICAgICAgaWYoZGF0YS5zaGFwZSA9PSBJRW50aXR5T2JqZWN0U2hhcGUuUkVDVEFOR0xFKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvZHkgPSB0aGlzLndvcmxkLmNyZWF0ZVJlY3RhbmdsZUJvZHkoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uLFxyXG4gICAgICAgICAgICAgICAgaGFsZkV4dGVudHMsXHJcbiAgICAgICAgICAgICAgICBkYXRhLmJvZHlPcHRpb25zXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Qm9keShib2R5KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBib2R5ID0gdGhpcy53b3JsZC5jcmVhdGVTcGhlcmVCb2R5KFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbixcclxuICAgICAgICAgICAgICAgIGRhdGEucmFkaXVzISxcclxuICAgICAgICAgICAgICAgIGRhdGEuYm9keU9wdGlvbnNcclxuICAgICAgICAgICAgKTtcclxuICAgIFxyXG4gICAgICAgICAgICB0aGlzLnNldEJvZHkoYm9keSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q3VzdG9tRGF0YSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLm9iamVjdEN1c3RvbURhdGEgYXMgSUVudGl0eU9iamVjdEN1c3RvbURhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldEN1c3RvbURhdGEoZGF0YTogSUVudGl0eU9iamVjdEN1c3RvbURhdGEpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLm9iamVjdEN1c3RvbURhdGEgPSBkYXRhO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0ICogYXMgcGMgZnJvbSAncGxheWNhbnZhcyc7XHJcbmltcG9ydCB7IEVudGl0eSB9IGZyb20gXCIuL2VudGl0eVwiO1xyXG5pbXBvcnQgQ0FOTk9OIGZyb20gJ2Nhbm5vbic7XHJcblxyXG5leHBvcnQgY2xhc3MgRW50aXR5UGxheWVyIGV4dGVuZHMgRW50aXR5IHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih3b3JsZCkge1xyXG4gICAgICAgIHN1cGVyKHdvcmxkKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRDb2xvcihuZXcgcGMuQ29sb3IoTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSkpXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBzZXRCb2R5KGJvZHk6IENBTk5PTi5Cb2R5KSB7XHJcbiAgICAgICAgYm9keS5maXhlZFJvdGF0aW9uID0gdHJ1ZTtcclxuICAgICAgICBib2R5LnVwZGF0ZU1hc3NQcm9wZXJ0aWVzKCk7XHJcblxyXG4gICAgICAgIHN1cGVyLnNldEJvZHkoYm9keSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKGR0KTtcclxuXHJcbiAgICAgICAgY29uc3Qgc3BlZWQgPSAyMDA7XHJcblxyXG4gICAgICAgIGNvbnN0IGZvcmNlID0gbmV3IENBTk5PTi5WZWMzKFxyXG4gICAgICAgICAgICBzcGVlZCAqIHRoaXMuaW5wdXQuaG9yaXpvbnRhbCAqIGR0LFxyXG4gICAgICAgICAgICBzcGVlZCAqIHRoaXMuaW5wdXQudmVydGljYWwgKiBkdCxcclxuICAgICAgICAgICAgMFxyXG4gICAgICAgICk7XHJcblxyXG5cclxuICAgICAgICBjb25zdCB2ZWxvY2l0eSA9IHRoaXMudmVsb2NpdHk7XHJcbiAgICAgICAgdmVsb2NpdHkuc2V0KGZvcmNlLngsIGZvcmNlLnksIHZlbG9jaXR5LnopO1xyXG5cclxuICAgICAgICAvL3RoaXMuYm9keT8uYXBwbHlMb2NhbEZvcmNlKG5ldyBDQU5OT04uVmVjMygwLCAwLCAtMTAwMCksIENBTk5PTi5WZWMzLlpFUk8pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXQoKTtcclxuXHJcbiAgICAgICAgY29uc3QgcyA9IDAuMztcclxuXHJcbiAgICAgICAgY29uc3QgYm9keSA9IHRoaXMud29ybGQuY3JlYXRlUmVjdGFuZ2xlQm9keShcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbixcclxuICAgICAgICAgICAgbmV3IENBTk5PTi5WZWMzKHMscyxzKSxcclxuICAgICAgICAgICAge21hc3M6IDEwMCwgbWF0ZXJpYWw6IHRoaXMud29ybGQuX21hdGVyaWFsX3Rlc3R9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRCb2R5KGJvZHkpO1xyXG4gICAgfVxyXG59IiwiXHJcbmltcG9ydCAqIGFzIHBjIGZyb20gJ3BsYXljYW52YXMnXHJcbmltcG9ydCB7IFNlcnZlciB9IGZyb20gJy4uL3NlcnZlci9zZXJ2ZXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWUge1xyXG4gICAgcHJpdmF0ZSBfaXNTZXJ2ZXI6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgX3NlcnZlcnMgPSBuZXcgTWFwPHN0cmluZywgU2VydmVyPigpO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNTZXJ2ZXIoKSB7IHJldHVybiB0aGlzLl9pc1NlcnZlcjsgfVxyXG4gICAgcHVibGljIGdldCBzZXJ2ZXJzKCkgeyByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl9zZXJ2ZXJzLnZhbHVlcygpKTsgfVxyXG4gICAgcHVibGljIGdldCBtYWluU2VydmVyKCkgeyByZXR1cm4gdGhpcy5zZXJ2ZXJzWzBdOyB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoaXNTZXJ2ZXI/OiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5faXNTZXJ2ZXIgPSBpc1NlcnZlciA9PT0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFtHYW1lXSBzdGFydDsgaXNTZXJ2ZXIgPWAsIHRoaXMuaXNTZXJ2ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVTZXJ2ZXIoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHNlcnZlciA9IG5ldyBTZXJ2ZXIodGhpcyk7XHJcbiAgICAgICAgdGhpcy5fc2VydmVycy5zZXQoaWQsIHNlcnZlcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZShkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5zZXJ2ZXJzLm1hcChzZXJ2ZXIgPT4gc2VydmVyLnVwZGF0ZShkdCkpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IENBTk5PTiBmcm9tICdjYW5ub24nXHJcbmltcG9ydCAqIGFzIHBjIGZyb20gXCJwbGF5Y2FudmFzXCI7XHJcbmltcG9ydCB7IEVudGl0eSB9IGZyb20gJy4uL2VudGl0eS9lbnRpdHknO1xyXG5pbXBvcnQgeyBOZXR3b3JrIH0gZnJvbSBcIi4uL25ldHdvcmsvbmV0d29ya1wiO1xyXG5pbXBvcnQgeyBJUGFja2V0RGF0YV9Db25uZWN0VG9TZXJ2ZXIsIFBhY2tldFR5cGUgfSBmcm9tICcuLi9wYWNrZXQvcGFja2V0JztcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuL2dhbWVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lQ2xpZW50IGV4dGVuZHMgR2FtZSB7XHJcbiAgICBwdWJsaWMgc3RhdGljIEluc3RhbmNlOiBHYW1lQ2xpZW50O1xyXG4gICAgcHVibGljIHN0YXRpYyBjYW1lcmE6IHBjLkVudGl0eTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcGxheWVySWQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgc3RhdGljIHBsYXllcj86IEVudGl0eTtcclxuXHJcbiAgICBwcml2YXRlIF9hcHA6IHBjLkFwcGxpY2F0aW9uO1xyXG4gICAgcHJpdmF0ZSBfY2FudmFzO1xyXG4gICAgcHJpdmF0ZSBfbmV0d29yazogTmV0d29yaztcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGFwcCgpIHsgcmV0dXJuIHRoaXMuX2FwcDsgfVxyXG4gICAgcHVibGljIGdldCBuZXR3b3JrKCkgeyByZXR1cm4gdGhpcy5fbmV0d29yazsgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNhbnZhcykge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgIHRoaXMuX25ldHdvcmsgPSBuZXcgTmV0d29yayh0aGlzKTtcclxuICAgICAgICBHYW1lQ2xpZW50Lkluc3RhbmNlID0gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlci51cGRhdGUoZHQpO1xyXG5cclxuXHJcbiAgICAgICAgaWYoR2FtZUNsaWVudC5wbGF5ZXIpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gR2FtZUNsaWVudC5wbGF5ZXIuaW5wdXQ7XHJcbiAgICAgICAgICAgIGlucHV0Lmhvcml6b250YWwgPSAwO1xyXG4gICAgICAgICAgICBpbnB1dC52ZXJ0aWNhbCA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLmFwcC5rZXlib2FyZC5pc1ByZXNzZWQocGMuS0VZX0EpKSBpbnB1dC5ob3Jpem9udGFsID0gLTE7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYXBwLmtleWJvYXJkLmlzUHJlc3NlZChwYy5LRVlfRCkpIGlucHV0Lmhvcml6b250YWwgPSAxO1xyXG5cclxuICAgICAgICAgICAgaWYodGhpcy5hcHAua2V5Ym9hcmQuaXNQcmVzc2VkKHBjLktFWV9XKSkgaW5wdXQudmVydGljYWwgPSAtMTtcclxuICAgICAgICAgICAgaWYodGhpcy5hcHAua2V5Ym9hcmQuaXNQcmVzc2VkKHBjLktFWV9TKSkgaW5wdXQudmVydGljYWwgPSAxO1xyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG5cclxuICAgICAgICB0aGlzLm5ldHdvcmsudXBkYXRlKGR0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQoKSB7XHJcbiAgICAgICAgc3VwZXIuc3RhcnQoKTtcclxuICAgICAgICB0aGlzLnNldHVwQXBwKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFJlc2l6ZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBMb2NhbENsaWVudFNjZW5lKCk7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubmV0d29yay5jb25uZWN0KCgpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYFtOZXR3b3JrXSBDb25uZWN0ZWQ/ICR7dGhpcy5uZXR3b3JrLmNvbm5lY3RlZH1gKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGE6IElQYWNrZXREYXRhX0Nvbm5lY3RUb1NlcnZlciA9IHtcclxuICAgICAgICAgICAgICAgIGlkOiAnYW55J1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubmV0d29yay5zZW5kKFBhY2tldFR5cGUuQ09OTkVDVF9UT19TRVJWRVIsIGRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldHVwQXBwKCkge1xyXG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuX2NhbnZhcztcclxuICAgICAgICBjb25zdCBhcHAgPSBuZXcgcGMuQXBwbGljYXRpb24oY2FudmFzLCB7XHJcbiAgICAgICAgICAgIG1vdXNlOiBuZXcgcGMuTW91c2UoY2FudmFzKSxcclxuICAgICAgICAgICAgdG91Y2g6IG5ldyBwYy5Ub3VjaERldmljZShjYW52YXMpLFxyXG4gICAgICAgICAgICBrZXlib2FyZDogbmV3IHBjLktleWJvYXJkKGRvY3VtZW50LmJvZHkpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYXBwLm9uKCd1cGRhdGUnLCBkdCA9PiB0aGlzLnVwZGF0ZShkdCkpXHJcbiAgICAgICAgYXBwLnN0YXJ0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2FwcCA9IGFwcDtcclxuICAgICAgICBcclxuICAgICAgICAvL3BjLnJlZ2lzdGVyU2NyaXB0KENhbWVyYUZvbGxvdywgJ2NhbWVyYUZvbGxvdycsIGFwcCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXR1cFJlc2l6ZSgpIHtcclxuICAgICAgICB0aGlzLmFwcC5zZXRDYW52YXNGaWxsTW9kZShwYy5GSUxMTU9ERV9GSUxMX1dJTkRPVyk7XHJcbiAgICAgICAgdGhpcy5hcHAuc2V0Q2FudmFzUmVzb2x1dGlvbihwYy5SRVNPTFVUSU9OX0FVVE8pO1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4gdGhpcy5yZXNpemUoKSk7XHJcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVzaXplKCkge1xyXG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuX2NhbnZhcztcclxuXHJcbiAgICAgICAgdGhpcy5hcHAucmVzaXplQ2FudmFzKCk7XHJcbiAgICAgICAgY2FudmFzLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgICAgY2FudmFzLnN0eWxlLmhlaWdodCA9IFwiMTAwJVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0dXBMb2NhbENsaWVudFNjZW5lKCkge1xyXG4gICAgICAgIGNvbnN0IGFwcCA9IHRoaXMuYXBwO1xyXG5cclxuICAgICAgICBjb25zdCBjYW1lcmEgPSBuZXcgcGMuRW50aXR5KCdjYW1lcmEnKTtcclxuICAgICAgICBjYW1lcmEuYWRkQ29tcG9uZW50KCdjYW1lcmEnLCB7XHJcbiAgICAgICAgICAgIGNsZWFyQ29sb3I6IG5ldyBwYy5Db2xvcigwLjEsIDAuMSwgMC4xKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGFwcC5yb290LmFkZENoaWxkKGNhbWVyYSk7XHJcbiAgICAgICAgY2FtZXJhLnNldFBvc2l0aW9uKDAsIDUsIDEwKTtcclxuICAgICAgICBjYW1lcmEubG9va0F0KDAsIDAsIDApO1xyXG4gICAgICAgIC8vY2FtZXJhLnNldEV1bGVyQW5nbGVzKC05MCwgMCwgMCk7XHJcbiAgICAgICAgKGNhbWVyYS5hZGRDb21wb25lbnQoJ3NjcmlwdCcpIGFzIHBjLlNjcmlwdENvbXBvbmVudCkuY3JlYXRlKCdjYW1lcmFGb2xsb3cnKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBsaWdodCA9IG5ldyBwYy5FbnRpdHkoJ2xpZ2h0Jyk7XHJcbiAgICAgICAgbGlnaHQuYWRkQ29tcG9uZW50KCdsaWdodCcpO1xyXG4gICAgICAgIGFwcC5yb290LmFkZENoaWxkKGxpZ2h0KTtcclxuICAgICAgICBsaWdodC5zZXRFdWxlckFuZ2xlcygzMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIEdhbWVDbGllbnQuY2FtZXJhID0gY2FtZXJhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW5kZXIoKSB7XHJcbiAgICAgICAgaWYoIXRoaXMubWFpblNlcnZlcikgcmV0dXJuO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHdvcmxkID0gdGhpcy5tYWluU2VydmVyLndvcmxkc1swXTtcclxuXHJcbiAgICAgICAgd29ybGQuZW50aXRpZXMubWFwKGVudGl0eSA9PiB7XHJcbiAgICAgICAgICAgIGlmKCFlbnRpdHkucGNFbnRpdHkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgaGFsZkV4dGVudHMgPSBuZXcgQ0FOTk9OLlZlYzMoMC4xLCAwLjEsIDAuMSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmFkaXVzID0gMTtcclxuICAgICAgICAgICAgICAgIGxldCBib3ggPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihlbnRpdHkuYm9keSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNoYXBlID0gZW50aXR5LmJvZHkhLnNoYXBlc1swXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc2hhcGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoc2hhcGUgaW5zdGFuY2VvZiBDQU5OT04uQm94KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYWxmRXh0ZW50cyA9IHNoYXBlLmhhbGZFeHRlbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoc2hhcGUgaW5zdGFuY2VvZiBDQU5OT04uU3BoZXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYWRpdXMgPSBzaGFwZS5yYWRpdXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc3QgYyA9IGVudGl0eS5kYXRhLmNvbG9yO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IHBjLlN0YW5kYXJkTWF0ZXJpYWwoKTtcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsLmRpZmZ1c2UgPSBuZXcgcGMuQ29sb3IoY1swXSwgY1sxXSwgY1syXSk7XHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbC51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBlbnRpdHkucGNFbnRpdHkgPSBuZXcgcGMuRW50aXR5KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoYm94KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eS5wY0VudGl0eS5hZGRDb21wb25lbnQoXCJyZW5kZXJcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbDogbWF0ZXJpYWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYm94XCJcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBlbnRpdHkucGNFbnRpdHkuc2V0TG9jYWxTY2FsZShuZXcgcGMuVmVjMyhoYWxmRXh0ZW50cy54ICogMiwgaGFsZkV4dGVudHMueiAqIDIsIGhhbGZFeHRlbnRzLnkgKiAyKSlcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5LnBjRW50aXR5LmFkZENvbXBvbmVudChcInJlbmRlclwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsOiBtYXRlcmlhbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzcGhlcmVcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eS5wY0VudGl0eS5zZXRMb2NhbFNjYWxlKG5ldyBwYy5WZWMzKHJhZGl1cyAqIDIsIHJhZGl1cyAqIDIsIHJhZGl1cyAqIDIpKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgIFxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwLnJvb3QuYWRkQ2hpbGQoZW50aXR5LnBjRW50aXR5KTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInlhZXNcIilcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgcG9zID0gZW50aXR5LnBvc2l0aW9uO1xyXG4gICAgICAgICAgICBjb25zdCBhbmdsZSA9IG5ldyBDQU5OT04uVmVjMygpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZW50aXR5LmJvZHk/LnF1YXRlcm5pb24udG9FdWxlcihhbmdsZSk7XHJcblxyXG4gICAgICAgICAgICBlbnRpdHkucGNFbnRpdHkuc2V0UG9zaXRpb24ocG9zLngsIHBvcy56LCBwb3MueSk7XHJcbiAgICAgICAgICAgIGVudGl0eS5wY0VudGl0eS5zZXRFdWxlckFuZ2xlcyhcclxuICAgICAgICAgICAgICAgIGFuZ2xlLnggKiAtcGMubWF0aC5SQURfVE9fREVHLFxyXG4gICAgICAgICAgICAgICAgYW5nbGUueiAqIC1wYy5tYXRoLlJBRF9UT19ERUcsXHJcbiAgICAgICAgICAgICAgICBhbmdsZS55ICogLXBjLm1hdGguUkFEX1RPX0RFR1xyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIC8vZW50aXR5LnBjRW50aXR5LnNldEV1bGVyQW5nbGVzKGFuZ2xlLngsIGFuZ2xlLnosIGFuZ2xlLnkpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmKEdhbWVDbGllbnQucGxheWVyKSB7XHJcbiAgICAgICAgICAgIEdhbWVDbGllbnQuY2FtZXJhLnNldFBvc2l0aW9uKEdhbWVDbGllbnQucGxheWVyLnBvc2l0aW9uLngsIEdhbWVDbGllbnQucGxheWVyLnBvc2l0aW9uLnogKyAxMCwgR2FtZUNsaWVudC5wbGF5ZXIucG9zaXRpb24ueSlcclxuICAgICAgICAgICAgR2FtZUNsaWVudC5jYW1lcmEuc2V0RXVsZXJBbmdsZXMoLTkwLCAwLCAwKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljXHJcbn0iLCJpbXBvcnQgeyBHYW1lQ2xpZW50IH0gZnJvbSBcIi4vZ2FtZS9nYW1lQ2xpZW50XCI7XHJcblxyXG5jb25zdCBnYW1lID0gbmV3IEdhbWVDbGllbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUnKSk7XHJcbmdhbWUuc3RhcnQoKTtcclxud2luZG93WydnYW1lJ10gPSBnYW1lO1xyXG53aW5kb3dbJ0dhbWVDbGllbnQnXSA9IEdhbWVDbGllbnQ7XHJcblxyXG5nYW1lLmNyZWF0ZVNlcnZlcignc2VydmVyMScpO1xyXG4vL0dhbWVDbGllbnQucGxheWVyID0gZ2FtZS5tYWluU2VydmVyLndvcmxkc1swXS5zcGF3blBsYXllcigpIiwiaW1wb3J0IHsgaW8sIFNvY2tldCB9IGZyb20gXCJzb2NrZXQuaW8tY2xpZW50XCI7XHJcbmltcG9ydCB7IEdhbWVDbGllbnQgfSBmcm9tIFwiLi4vZ2FtZS9nYW1lQ2xpZW50XCI7XHJcbmltcG9ydCB7IElQYWNrZXQsIElQYWNrZXREYXRhX0Nvbm5lY3RUb1NlcnZlclN0YXR1cywgSVBhY2tldERhdGFfRW50aXR5RGF0YSwgUGFja2V0VHlwZSB9IGZyb20gXCIuLi9wYWNrZXQvcGFja2V0XCI7XHJcbmltcG9ydCB7IFdvcmxkU3luY0hlbHBlciB9IGZyb20gXCIuLi93b3JsZC93b3JsZFN5bmNIZWxwZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBOZXR3b3JrIHtcclxuICAgIHByaXZhdGUgX2dhbWU6IEdhbWVDbGllbnQ7XHJcbiAgICBwcml2YXRlIF9zb2NrZXQ6IFNvY2tldDtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGdhbWUoKSB7IHJldHVybiB0aGlzLl9nYW1lOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHNvY2tldCgpIHsgcmV0dXJuIHRoaXMuX3NvY2tldDsgfVxyXG4gICAgcHVibGljIGdldCBjb25uZWN0ZWQoKSB7IHJldHVybiB0aGlzLl9zb2NrZXQuY29ubmVjdGVkOyB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VuZFBhY2tldHNEZWxheTogbnVtYmVyID0gNTA7XHJcbiAgICBwcml2YXRlIF9zZW5kVGltZTogbnVtYmVyID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lOiBHYW1lQ2xpZW50KSB7XHJcbiAgICAgICAgdGhpcy5fZ2FtZSA9IGdhbWU7XHJcblxyXG4gICAgICAgIC8vaHR0cHM6Ly9kbWRhc3NjLWdhbWUuZ2xpdGNoLm1lL1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGFkZHJlc3MgPSBgJHtsb2NhdGlvbi5wcm90b2NvbH0vLyR7bG9jYXRpb24uaG9zdH1gO1xyXG4gICAgICAgIHRoaXMuX3NvY2tldCA9IGlvKGFkZHJlc3MsIHtcclxuICAgICAgICAgICAgLy9wYXRoOiAnL3NvY2tldCcsXHJcbiAgICAgICAgICAgIGF1dG9Db25uZWN0OiBmYWxzZSxcclxuICAgICAgICAgICAgcmVjb25uZWN0aW9uOiBmYWxzZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ3BhY2tldCcsIHBhY2tldCA9PiB0aGlzLm9uUmVjZWl2ZVBhY2tldChwYWNrZXQpKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zb2xlLmxvZyhgW05ldHdvcmtdIEFkZHJlc3M6ICgke2FkZHJlc3N9KWApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb25uZWN0KGNhbGxiYWNrPzogKCkgPT4gdm9pZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbTmV0d29ya10gQ29ubmVjdGluZy4uLmApO1xyXG5cclxuICAgICAgICB0aGlzLl9zb2NrZXQuY29ubmVjdCgpO1xyXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbmNlKCdjb25uZWN0JywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjYWxsYmFjaz8uKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fc2VuZFRpbWUgKz0gZHQ7XHJcblxyXG4gICAgICAgIGNvbnN0IGVudGl0eSA9IEdhbWVDbGllbnQucGxheWVyO1xyXG5cclxuICAgICAgICBpZighZW50aXR5KSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmKHRoaXMuX3NlbmRUaW1lIDw9IHRoaXMuX3NlbmRQYWNrZXRzRGVsYXkvMTAwMCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3NlbmRUaW1lID0gMDtcclxuXHJcbiAgICAgICAgY29uc3QgcGFja2V0RGF0YTogSVBhY2tldERhdGFfRW50aXR5RGF0YSA9IHtcclxuICAgICAgICAgICAgZW50aXR5SWQ6IGVudGl0eS5pZCxcclxuICAgICAgICAgICAgZW50aXR5VHlwZTogZW50aXR5LmNvbnN0cnVjdG9yLm5hbWUsXHJcbiAgICAgICAgICAgIGRhdGE6IGVudGl0eS50b0pTT04oKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZW5kKFBhY2tldFR5cGUuRU5USVRZX0RBVEEsIHBhY2tldERhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZW5kKHR5cGU6IFBhY2tldFR5cGUsIGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBjb25zdCBwYWNrZXQ6IElQYWNrZXQgPSB7XHJcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zb2NrZXQuZW1pdCgncGFja2V0JywgcGFja2V0KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIG9uUmVjZWl2ZVBhY2tldChwYWNrZXQ6IElQYWNrZXQpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHBhY2tldClcclxuXHJcbiAgICAgICAgaWYocGFja2V0LnR5cGUgPT0gUGFja2V0VHlwZS5DT05ORUNUX1RPX1NFUlZFUl9TVEFUVVMpIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YTogSVBhY2tldERhdGFfQ29ubmVjdFRvU2VydmVyU3RhdHVzID0gcGFja2V0LmRhdGE7XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgIEdhbWVDbGllbnQucGxheWVySWQgPSBkYXRhLmVudGl0eUlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYocGFja2V0LnR5cGUgPT0gUGFja2V0VHlwZS5FTlRJVFlfREFUQSkge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhOiBJUGFja2V0RGF0YV9FbnRpdHlEYXRhID0gcGFja2V0LmRhdGE7XHJcblxyXG4gICAgICAgICAgICBXb3JsZFN5bmNIZWxwZXIub25SZWNlaXZlRW50aXR5RGF0YShkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgIHByaXZhdGUgb25SZWNlaXZlUGFja2V0KHBhY2tldDogSVBhY2tldCkge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgKi9cclxufSIsImV4cG9ydCBlbnVtIFBhY2tldFR5cGUge1xyXG4gICAgUkVRVUVTVF9TRVJWRVJfTElTVCxcclxuICAgIFNFUlZFUl9MSVNULFxyXG4gICAgQ09OTkVDVF9UT19TRVJWRVIsXHJcbiAgICBDT05ORUNUX1RPX1NFUlZFUl9TVEFUVVMsXHJcbiAgICBFTlRJVFlfREFUQVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQYWNrZXQge1xyXG4gICAgdHlwZTogUGFja2V0VHlwZVxyXG4gICAgZGF0YT86IGFueVxyXG59XHJcblxyXG4vKlxyXG5leHBvcnQgaW50ZXJmYWNlIElQYWNrZXREYXRhX1NlcnZlckxpc3Qge1xyXG4gICAgc2VydmVyczogU2VydmVySW5mb1tdXHJcbn1cclxuKi9cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhY2tldERhdGFfQ29ubmVjdFRvU2VydmVyIHtcclxuICAgIGlkOiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUGFja2V0RGF0YV9JZCB7XHJcbiAgICBpZDogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhY2tldERhdGFfQ29ubmVjdFRvU2VydmVyU3RhdHVzIHtcclxuICAgIHNlcnZlcklkOiBzdHJpbmdcclxuICAgIGVudGl0eUlkOiBzdHJpbmdcclxuICAgIHN1Y2Nlc3M6IGJvb2xlYW5cclxuICAgIGVycm9yTWVzc2FnZT86IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQYWNrZXREYXRhX0VudGl0eURhdGEge1xyXG4gICAgZW50aXR5SWQ6IHN0cmluZ1xyXG4gICAgZW50aXR5VHlwZTogc3RyaW5nXHJcbiAgICBkYXRhOiBhbnlcclxufSIsImltcG9ydCB7IEVudGl0eSB9IGZyb20gXCIuLi9lbnRpdHkvZW50aXR5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRW50aXR5RmFjdG9yeSB7XHJcbiAgICBwcml2YXRlIF9yZWdpc3RlcmVkRW50aXRpZXMgPSBuZXcgTWFwPHN0cmluZywgdHlwZW9mIEVudGl0eT4oKTtcclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJFbnRpdHkobmFtZTogc3RyaW5nLCBlOiB0eXBlb2YgRW50aXR5KSB7XHJcbiAgICAgICAgdGhpcy5fcmVnaXN0ZXJlZEVudGl0aWVzLnNldChuYW1lLCBlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RW50aXR5KG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGUgPSB0aGlzLl9yZWdpc3RlcmVkRW50aXRpZXMuZ2V0KG5hbWUpO1xyXG4gICAgICAgIGlmKCFlKSB0aHJvdyBgRW50aXR5IHR5cGUgJyR7bmFtZX0nIGlzIGludmFsaWRgO1xyXG4gICAgICAgIHJldHVybiBlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRW50aXR5IH0gZnJvbSBcIi4uL2VudGl0eS9lbnRpdHlcIjtcclxuaW1wb3J0IHsgRW50aXR5T2JqZWN0IH0gZnJvbSBcIi4uL2VudGl0eS9lbnRpdHlPYmplY3RcIjtcclxuaW1wb3J0IHsgRW50aXR5UGxheWVyIH0gZnJvbSBcIi4uL2VudGl0eS9lbnRpdHlQbGF5ZXJcIjtcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi9nYW1lL2dhbWVcIjtcclxuaW1wb3J0IHsgV29ybGQgfSBmcm9tIFwiLi4vd29ybGQvd29ybGRcIjtcclxuaW1wb3J0IHsgRW50aXR5RmFjdG9yeSB9IGZyb20gXCIuL2VudGl0eUZhY3RvcnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTZXJ2ZXIge1xyXG4gICAgcHJpdmF0ZSBfZ2FtZTogR2FtZTtcclxuICAgIHByaXZhdGUgX3dvcmxkcyA9IG5ldyBNYXA8c3RyaW5nLCBXb3JsZD4oKTtcclxuICAgIHByaXZhdGUgX2VudGl0eUZhY3Rvcnk6IEVudGl0eUZhY3Rvcnk7XHJcblxyXG4gICAgcHVibGljIGdldCB3b3JsZHMoKSB7IHJldHVybiBBcnJheS5mcm9tKHRoaXMuX3dvcmxkcy52YWx1ZXMoKSk7IH1cclxuICAgIHB1YmxpYyBnZXQgZ2FtZSgpIHsgcmV0dXJuIHRoaXMuX2dhbWU7IH1cclxuICAgIHB1YmxpYyBnZXQgZW50aXR5RmFjdG9yeSgpIHsgcmV0dXJuIHRoaXMuX2VudGl0eUZhY3Rvcnk7IH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lOiBHYW1lKSB7XHJcbiAgICAgICAgdGhpcy5fZ2FtZSA9IGdhbWU7XHJcbiAgICAgICAgdGhpcy5fZW50aXR5RmFjdG9yeSA9IG5ldyBFbnRpdHlGYWN0b3J5KCk7XHJcblxyXG4gICAgICAgIHRoaXMuZW50aXR5RmFjdG9yeS5yZWdpc3RlckVudGl0eSgnRW50aXR5UGxheWVyJywgRW50aXR5UGxheWVyKTtcclxuICAgICAgICB0aGlzLmVudGl0eUZhY3RvcnkucmVnaXN0ZXJFbnRpdHkoJ0VudGl0eU9iamVjdCcsIEVudGl0eU9iamVjdCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlV29ybGQoJ3dvcmxkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy53b3JsZHMubWFwKHdvcmxkID0+IHdvcmxkLnVwZGF0ZShkdCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVXb3JsZChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCB3b3JsZCA9IG5ldyBXb3JsZCh0aGlzKTtcclxuICAgICAgICB0aGlzLl93b3JsZHMuc2V0KG5hbWUsIHdvcmxkKTtcclxuICAgIH1cclxufSIsImltcG9ydCBDQU5OT04gZnJvbSAnY2Fubm9uJ1xyXG5pbXBvcnQgKiBhcyBwYyBmcm9tICdwbGF5Y2FudmFzJztcclxuaW1wb3J0IHsgRGF0YVdhdGNoZXIgfSBmcm9tICcuLi9jbGllbnQvZGF0YVdhdGNoZXInO1xyXG5pbXBvcnQgeyBFbnRpdHkgfSBmcm9tICcuLi9lbnRpdHkvZW50aXR5JztcclxuaW1wb3J0IHsgRW50aXR5T2JqZWN0LCBJRW50aXR5T2JqZWN0Q3VzdG9tRGF0YSwgSUVudGl0eU9iamVjdFNoYXBlIH0gZnJvbSAnLi4vZW50aXR5L2VudGl0eU9iamVjdCc7XHJcbmltcG9ydCB7IEVudGl0eVBsYXllciB9IGZyb20gJy4uL2VudGl0eS9lbnRpdHlQbGF5ZXInO1xyXG5pbXBvcnQgeyBTZXJ2ZXIgfSBmcm9tIFwiLi4vc2VydmVyL3NlcnZlclwiO1xyXG5cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGQge1xyXG5cclxuICAgIHByaXZhdGUgX3NlcnZlcjogU2VydmVyO1xyXG4gICAgcHJpdmF0ZSBfZHluYW1pY1dvcmxkOiBDQU5OT04uV29ybGQ7XHJcbiAgICBwcml2YXRlIF9lbnRpdGllcyA9IG5ldyBNYXA8c3RyaW5nLCBFbnRpdHk+KCk7XHJcblxyXG4gICAgcHVibGljIGdldCBzZXJ2ZXIoKSB7IHJldHVybiB0aGlzLl9zZXJ2ZXIgfTtcclxuICAgIHB1YmxpYyBnZXQgZHluYW1pY1dvcmxkKCkgeyByZXR1cm4gdGhpcy5fZHluYW1pY1dvcmxkIH07XHJcbiAgICBwdWJsaWMgZ2V0IGVudGl0aWVzKCkgeyByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl9lbnRpdGllcy52YWx1ZXMoKSkgfTtcclxuXHJcbiAgICBwdWJsaWMgX21hdGVyaWFsX2dyb3VuZDogQ0FOTk9OLk1hdGVyaWFsO1xyXG4gICAgcHVibGljIF9tYXRlcmlhbF90ZXN0OiBDQU5OT04uTWF0ZXJpYWw7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHNlcnZlcjogU2VydmVyKSB7XHJcbiAgICAgICAgdGhpcy5fc2VydmVyID0gc2VydmVyO1xyXG5cclxuICAgICAgICB0aGlzLnNldHVwRHluYW1pY1dvcmxkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIGZpeGVkVGltZVN0ZXAgPSAxLjAgLyA2MC4wOyAvLyBzZWNvbmRzXHJcbiAgICAgICAgdmFyIG1heFN1YlN0ZXBzID0gMztcclxuXHJcbiAgICAgICAgdGhpcy5lbnRpdGllcy5tYXAoZW50aXR5ID0+IGVudGl0eS51cGRhdGUoZHQpKTtcclxuICAgICAgICB0aGlzLmR5bmFtaWNXb3JsZC5zdGVwKGZpeGVkVGltZVN0ZXAsIGR0LCBtYXhTdWJTdGVwcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEVudGl0eShpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VudGl0aWVzLmdldChpZCkhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoYXNFbnRpdHkoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbnRpdGllcy5oYXMoaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0dXBEeW5hbWljV29ybGQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3NldHVwRHluYW1pY1dvcmxkJylcclxuXHJcbiAgICAgICAgLy8gU2V0dXAgb3VyIHdvcmxkXHJcbiAgICAgICAgdmFyIHdvcmxkID0gdGhpcy5fZHluYW1pY1dvcmxkID0gbmV3IENBTk5PTi5Xb3JsZCgpO1xyXG4gICAgICAgIHdvcmxkLmdyYXZpdHkgPSBuZXcgQ0FOTk9OLlZlYzMoMCwgMCwgLTkuODIpIC8vIG0vc8KyXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9tYXQxXHJcbiAgICAgICAgY29uc3QgZ3JvdW5kTWF0ZXJpYWwgPSBuZXcgQ0FOTk9OLk1hdGVyaWFsKFwiZ3JvdW5kTWF0ZXJpYWxcIik7XHJcbiAgICAgICAgY29uc3QgZ3JvdW5kX2dyb3VuZF9jbSA9IG5ldyBDQU5OT04uQ29udGFjdE1hdGVyaWFsKGdyb3VuZE1hdGVyaWFsLCBncm91bmRNYXRlcmlhbCwge1xyXG4gICAgICAgICAgICBmcmljdGlvbjogMC40LFxyXG4gICAgICAgICAgICByZXN0aXR1dGlvbjogMC4zLFxyXG4gICAgICAgICAgICBjb250YWN0RXF1YXRpb25TdGlmZm5lc3M6IDFlOCxcclxuICAgICAgICAgICAgY29udGFjdEVxdWF0aW9uUmVsYXhhdGlvbjogMyxcclxuICAgICAgICAgICAgZnJpY3Rpb25FcXVhdGlvblN0aWZmbmVzczogMWU4XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgd29ybGQuYWRkQ29udGFjdE1hdGVyaWFsKGdyb3VuZF9ncm91bmRfY20pO1xyXG5cclxuICAgICAgICBjb25zdCBzbGlwcGVyeU1hdGVyaWFsID0gbmV3IENBTk5PTi5NYXRlcmlhbChcInNsaXBwZXJ5TWF0ZXJpYWxcIik7XHJcbiAgICAgICAgY29uc3Qgc2xpcHBlcnlfZ3JvdW5kX2NtID0gbmV3IENBTk5PTi5Db250YWN0TWF0ZXJpYWwoZ3JvdW5kTWF0ZXJpYWwsIHNsaXBwZXJ5TWF0ZXJpYWwsIHtcclxuICAgICAgICAgICAgZnJpY3Rpb246IDAuMDAzLFxyXG4gICAgICAgICAgICByZXN0aXR1dGlvbjogMCxcclxuICAgICAgICAgICAgY29udGFjdEVxdWF0aW9uU3RpZmZuZXNzOiAxZTgsXHJcbiAgICAgICAgICAgIGNvbnRhY3RFcXVhdGlvblJlbGF4YXRpb246IDNcclxuICAgICAgICB9KTtcclxuICAgICAgICB3b3JsZC5hZGRDb250YWN0TWF0ZXJpYWwoc2xpcHBlcnlfZ3JvdW5kX2NtKTtcclxuXHJcbiAgICAgICAgdGhpcy5fbWF0ZXJpYWxfZ3JvdW5kID0gZ3JvdW5kTWF0ZXJpYWw7XHJcbiAgICAgICAgdGhpcy5fbWF0ZXJpYWxfdGVzdCA9IHNsaXBwZXJ5TWF0ZXJpYWw7XHJcblxyXG5cclxuICAgICAgICBjb25zdCBzbGlwcGVyeV9ncm91bmRfY20yID0gbmV3IENBTk5PTi5Db250YWN0TWF0ZXJpYWwoc2xpcHBlcnlNYXRlcmlhbCwgc2xpcHBlcnlNYXRlcmlhbCwge1xyXG4gICAgICAgICAgICBmcmljdGlvbjogMC4wMDAsXHJcbiAgICAgICAgICAgIHJlc3RpdHV0aW9uOiAwLFxyXG4gICAgICAgICAgICBjb250YWN0RXF1YXRpb25TdGlmZm5lc3M6IDFlOCxcclxuICAgICAgICAgICAgY29udGFjdEVxdWF0aW9uUmVsYXhhdGlvbjogM1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHdvcmxkLmFkZENvbnRhY3RNYXRlcmlhbChzbGlwcGVyeV9ncm91bmRfY20yKTtcclxuXHJcblxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgIGNvbnN0IGJ1aWxkaW5nID0gdGhpcy5zcGF3blJlY3RhbmdsZU9iamVjdChcclxuICAgICAgICAgICAgbmV3IENBTk5PTi5WZWMzKDUsIDMsIDIpLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBib2R5OiBuZXcgQ0FOTk9OLkJvZHkoe21hc3M6IDAsIG1hdGVyaWFsOiB0aGlzLl9tYXRlcmlhbF9ncm91bmQsIHNoYXBlOiBuZXcgQ0FOTk9OLkJveChuZXcgQ0FOTk9OLlZlYzMoMiwgMiwgNikpfSksXHJcbiAgICAgICAgICAgICAgICBjb2xvcjogbmV3IHBjLkNvbG9yKDAuNSwgMC43LCAwKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgICAgICAqL1xyXG4gICAgICAgIFxyXG5cclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgZ3JvdW5kQm9keU9wdGlvbnM6IENBTk5PTi5JQm9keU9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIG1hc3M6IDAsXHJcbiAgICAgICAgICAgIG1hdGVyaWFsOiB0aGlzLl9tYXRlcmlhbF9ncm91bmRcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBncm91bmQgPSB0aGlzLnNwYXduUmVjdGFuZ2xlT2JqZWN0KG5ldyBDQU5OT04uVmVjMygwLCAwLCAwKSwgbmV3IENBTk5PTi5WZWMzKDMwLCAzMCwgMSksIGdyb3VuZEJvZHlPcHRpb25zLCBuZXcgcGMuQ29sb3IoMSwgMSwgMSkpO1xyXG4gICAgICAgIGdyb3VuZC5kb250U3luYyA9IHRydWU7XHJcblxyXG4gICAgICAgIGNvbnN0IGJ1aWxkaW5nMSA9IHRoaXMuc3Bhd25SZWN0YW5nbGVPYmplY3QobmV3IENBTk5PTi5WZWMzKC01LCAwLCAyKSwgbmV3IENBTk5PTi5WZWMzKDIsIDQsIDIpLCBncm91bmRCb2R5T3B0aW9ucywgbmV3IHBjLkNvbG9yKDEsIDAsIDApKTtcclxuICAgICAgICBidWlsZGluZzEuZG9udFN5bmMgPSB0cnVlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHN0YWlycyA9IHRoaXMuc3Bhd25SZWN0YW5nbGVPYmplY3QobmV3IENBTk5PTi5WZWMzKC0zLCAyLCAxKSwgbmV3IENBTk5PTi5WZWMzKDEsIDUsIDEpLCBncm91bmRCb2R5T3B0aW9ucyxuZXcgcGMuQ29sb3IoMC41LCAwLjcsIDApKTtcclxuICAgICAgICBzdGFpcnMuZG9udFN5bmMgPSB0cnVlO1xyXG4gICAgICAgIHN0YWlycy5xdWF0ZXJuaW9uLnNldEZyb21FdWxlcigtMzUsIDAsIDApO1xyXG5cclxuICAgICAgICBjb25zdCBidWlsZGluZzIgPSB0aGlzLnNwYXduUmVjdGFuZ2xlT2JqZWN0KG5ldyBDQU5OT04uVmVjMyg1LCAzLCAyKSwgbmV3IENBTk5PTi5WZWMzKDIsIDIsIDYpLCBncm91bmRCb2R5T3B0aW9ucywgbmV3IHBjLkNvbG9yKDAuNSwgMC43LCAwKSk7XHJcbiAgICAgICAgYnVpbGRpbmcyLmRvbnRTeW5jID0gdHJ1ZTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZ2FtZS5pc1NlcnZlcikge1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9iaiA9IHRoaXMuc3Bhd25DdXN0b21PYmplY3QoXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IENBTk5PTi5WZWMzKDAsIDAsIDMpLFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hhcGU6IElFbnRpdHlPYmplY3RTaGFwZS5SRUNUQU5HTEUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhZGl1czogMC4yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYWxmRXh0ZW50czoge3g6IDAuMywgeTogMC4zLCB6OiAwLjN9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5T3B0aW9uczoge21hc3M6IDEwMH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSAgICBcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJvdCA9IHRoaXMuc3Bhd25QbGF5ZXIoKTtcclxuICAgICAgICAgICAgICAgIGJvdC5zZXRDb2xvcihuZXcgcGMuQ29sb3IoMCwgMCwgMSkpXHJcbiAgICAgICAgICAgICAgICBib3Quc3RhcnRCb3RCZWhhdmlvdXIoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgIFxyXG5cclxuICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coYm90LnRvSlNPTigpKVxyXG4gICAgICAgICAgICB9LCAxMDAwKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcblxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgIGlmKHRoaXMuc2VydmVyLmdhbWUuaXNTZXJ2ZXIpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNwYXduUGxheWVyKCkuc3RhcnRCb3RCZWhhdmlvdXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgKi9cclxuXHJcbiAgICAgICAgLy9jb25zdCBib3ggPSB0aGlzLnNwYXduVGVzdEVudGl0eShuZXcgQ0FOTk9OLlZlYzMoMCwgMCwgNCksIG5ldyBDQU5OT04uVmVjMygxLCAxLCAxKSwge21hc3M6IDIwMH0pO1xyXG4gICAgICAgIC8vY29uc3QgYm94MiA9IHRoaXMuc3Bhd25UZXN0RW50aXR5KG5ldyBDQU5OT04uVmVjMygwLCAxLCA4KSwgbmV3IENBTk5PTi5WZWMzKDEsIDEsIDEpLCB7bWFzczogMjAwfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIC8vc2V0SW50ZXJ2YWwoKCkgPT4geyB0aGlzLnNwYXduVGVzdEVudGl0eSgpOyB9LCAxMDAwKVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzcGF3blJlY3RhbmdsZU9iamVjdChwb3NpdGlvbjogQ0FOTk9OLlZlYzMsIGhhbGZFeHRlbmRzOiBDQU5OT04uVmVjMywgYm9keU9wdGlvbnM6IENBTk5PTi5JQm9keU9wdGlvbnMsIGNvbG9yOiBwYy5Db2xvcikge1xyXG4gICAgICAgIGNvbnN0IG9iakRhdGE6IElFbnRpdHlPYmplY3RDdXN0b21EYXRhID0ge1xyXG4gICAgICAgICAgICBzaGFwZTogSUVudGl0eU9iamVjdFNoYXBlLlJFQ1RBTkdMRSxcclxuICAgICAgICAgICAgaGFsZkV4dGVudHM6IGhhbGZFeHRlbmRzLFxyXG4gICAgICAgICAgICBib2R5T3B0aW9uczogYm9keU9wdGlvbnMsXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5zcGF3bkN1c3RvbU9iamVjdChcclxuICAgICAgICAgICAgcG9zaXRpb24sXHJcbiAgICAgICAgICAgIG9iakRhdGFcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZWN0LnNldENvbG9yKGNvbG9yKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNwYXduUGxheWVyKCkge1xyXG4gICAgICAgIGNvbnN0IHBsYXllciA9IG5ldyBFbnRpdHlQbGF5ZXIodGhpcyk7XHJcbiAgICAgICAgcGxheWVyLnBvc2l0aW9uLnNldCgwLCAwLCAzKVxyXG4gICAgICAgIHRoaXMuYWRkRW50aXR5KHBsYXllcik7XHJcbiAgICAgICAgcmV0dXJuIHBsYXllcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkRW50aXR5KGVudGl0eTogRW50aXR5KSB7XHJcbiAgICAgICAgdGhpcy5fZW50aXRpZXMuc2V0KGVudGl0eS5pZCwgZW50aXR5KTtcclxuICAgICAgICBlbnRpdHkuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG5cclxuICAgIHB1YmxpYyBzcGF3bkN1c3RvbU9iamVjdChwb3NpdGlvbjogQ0FOTk9OLlZlYzMsIG9iamVjdERhdGE6IElFbnRpdHlPYmplY3RDdXN0b21EYXRhKSB7XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0ID0gbmV3IEVudGl0eU9iamVjdCh0aGlzKTtcclxuICAgICAgICBvYmplY3Quc2V0Q3VzdG9tRGF0YShvYmplY3REYXRhKTtcclxuICAgICAgICBvYmplY3QucG9zaXRpb24uc2V0KHBvc2l0aW9uLngsIHBvc2l0aW9uLnksIHBvc2l0aW9uLnopO1xyXG4gICAgICAgIHRoaXMuYWRkRW50aXR5KG9iamVjdCk7XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHByaW50UG9zaXRpb24ocG9zOiBDQU5OT04uVmVjMykge1xyXG4gICAgICAgIHJldHVybiBgKCR7cG9zLnh9LCAke3Bvcy55fSwgJHtwb3Muen0pYFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVSZWN0YW5nbGVCb2R5KHBvc2l0aW9uOiBDQU5OT04uVmVjMywgaGFsZkV4dGVuZHM6IENBTk5PTi5WZWMzLCBvcHRpb25zPzogQ0FOTk9OLklCb2R5T3B0aW9ucykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IG9wdCA9IG9wdGlvbnMgfHwge307XHJcblxyXG4gICAgICAgIG9wdC5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgIFxyXG4gICAgICAgIHZhciBzaGFwZSA9IG5ldyBDQU5OT04uQm94KGhhbGZFeHRlbmRzKTtcclxuICAgICAgICB2YXIgYm9keSA9IG5ldyBDQU5OT04uQm9keShvcHQpO1xyXG4gICAgICAgIGJvZHkuYWRkU2hhcGUoc2hhcGUpO1xyXG5cclxuICAgICAgICB0aGlzLmR5bmFtaWNXb3JsZC5hZGRCb2R5KGJvZHkpO1xyXG5cclxuICAgICAgICByZXR1cm4gYm9keTsgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZVNwaGVyZUJvZHkocG9zaXRpb246IENBTk5PTi5WZWMzLCByYWRpdXM6IG51bWJlciwgb3B0aW9ucz86IENBTk5PTi5JQm9keU9wdGlvbnMpIHtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBvcHQgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAgICAgICBvcHQucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgICBcclxuICAgICAgICB2YXIgc2hhcGUgPSBuZXcgQ0FOTk9OLlNwaGVyZShyYWRpdXMpO1xyXG4gICAgICAgIHZhciBib2R5ID0gbmV3IENBTk5PTi5Cb2R5KG9wdCk7XHJcbiAgICAgICAgYm9keS5hZGRTaGFwZShzaGFwZSk7XHJcblxyXG4gICAgICAgIHRoaXMuZHluYW1pY1dvcmxkLmFkZEJvZHkoYm9keSk7XHJcblxyXG4gICAgICAgIHJldHVybiBib2R5OyBcclxuICAgIH1cclxufVxyXG5cclxuLypcclxuY29uc3QgZW50aXR5ID0gbmV3IHBjLkVudGl0eShuYW1lKTtcclxuZW50aXR5LnNldFBvc2l0aW9uKHBvc2l0aW9uKVxyXG50aGlzLmNyZWF0ZVJlY3RhbmdsZUF0RW50aXR5KGVudGl0eSwgc2l6ZSwgaXNEeW5hbWljLCBjb2xvcik7XHJcbmFwcC5yb290LmFkZENoaWxkKGVudGl0eSk7XHJcbiovIiwiaW1wb3J0ICogYXMgcGMgZnJvbSBcInBsYXljYW52YXNcIjtcclxuaW1wb3J0IHsgRW50aXR5IH0gZnJvbSBcIi4uL2VudGl0eS9lbnRpdHlcIjtcclxuaW1wb3J0IHsgRW50aXR5UGxheWVyIH0gZnJvbSBcIi4uL2VudGl0eS9lbnRpdHlQbGF5ZXJcIjtcclxuaW1wb3J0IHsgR2FtZUNsaWVudCB9IGZyb20gXCIuLi9nYW1lL2dhbWVDbGllbnRcIjtcclxuaW1wb3J0IHsgSVBhY2tldERhdGFfRW50aXR5RGF0YSB9IGZyb20gXCIuLi9wYWNrZXQvcGFja2V0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGRTeW5jSGVscGVyIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdhbWUoKSB7IHJldHVybiBHYW1lQ2xpZW50Lkluc3RhbmNlOyB9O1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgb25SZWNlaXZlRW50aXR5RGF0YShkYXRhOiBJUGFja2V0RGF0YV9FbnRpdHlEYXRhKSB7XHJcbiAgICAgICAgY29uc3Qgd29ybGQgPSB0aGlzLmdhbWUubWFpblNlcnZlci53b3JsZHNbMF07XHJcblxyXG4gICAgICAgIGxldCBpc05ld0VudGl0eTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBsZXQgZW50aXR5OiBFbnRpdHkgfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIGlmKCF3b3JsZC5oYXNFbnRpdHkoZGF0YS5lbnRpdHlJZCkpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGMgPSB3b3JsZC5zZXJ2ZXIuZW50aXR5RmFjdG9yeS5nZXRFbnRpdHkoZGF0YS5lbnRpdHlUeXBlKTtcclxuXHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgZW50aXR5ID0gbmV3IGMod29ybGQpO1xyXG4gICAgICAgICAgICBlbnRpdHkuc2V0SWQoZGF0YS5lbnRpdHlJZCk7XHJcbiAgICAgICAgICAgIC8vZW50aXR5LmRhdGEgPSBkYXRhLmRhdGEuZGF0YTsgLy8gJy0nXHJcblxyXG4gICAgICAgICAgIC8vIFxyXG4gICAgICAgICAgICBpc05ld0VudGl0eSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbmV3IGVudGl5JylcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFtlbnRpdHldKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIWVudGl0eSkgZW50aXR5ID0gd29ybGQuZ2V0RW50aXR5KGRhdGEuZW50aXR5SWQpO1xyXG5cclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIlxcblxcblwiLCBKU09OLnN0cmluZ2lmeShkYXRhLmRhdGEpKVxyXG4gICAgICAgIGVudGl0eS5mcm9tSlNPTihkYXRhLmRhdGEpO1xyXG5cclxuICAgICAgICBpZihpc05ld0VudGl0eSkge1xyXG4gICAgICAgICAgICB3b3JsZC5hZGRFbnRpdHkoZW50aXR5KTtcclxuICAgICAgICAgICAgZW50aXR5LmNhbkxlcnAgPSB0cnVlO1xyXG4gICAgICAgICAgICAvL2VudGl0eS5zY3JpcHQhLmNyZWF0ZSgnZW50aXR5U3luYycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIGlmKGVudGl0eS5pZCA9PSBHYW1lQ2xpZW50LnBsYXllcklkKSB7XHJcblxyXG4gICAgICAgICAgICBpZighR2FtZUNsaWVudC5wbGF5ZXIpIHtcclxuICAgICAgICAgICAgICAgIEdhbWVDbGllbnQucGxheWVyID0gZW50aXR5IGFzIEVudGl0eTtcclxuICAgICAgICAgICAgICAgIEdhbWVDbGllbnQucGxheWVyLmNhbkxlcnAgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIC8vR2FtZUNsaWVudC5wbGF5ZXIuc2V0Q29udHJvbGxhYmxlKCk7XHJcbiAgICAgICAgICAgICAgICAvL0dhbWVDbGllbnQuY2FtZXJhRm9sbG93RW50aXR5KGVudGl0eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkc1tpXV0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtkbWRhc3NjX2dhbWVcIl0gPSBzZWxmW1wid2VicGFja0NodW5rZG1kYXNzY19nYW1lXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxuX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9yc1wiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKSkpXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnNcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi93ZWJwYWNrL2NyZWRpdHMuanNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==