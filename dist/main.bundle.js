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
        setInterval(() => {
            //console.log("bot1: " + this.printPosition(bot1.position));
            //console.log("box: " + this.printPosition(box.getPosition()));
        }, 250);
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
            // 
            isNewEntity = true;
            console.log('new entiy');
            console.log(data, c, entity);
        }
        if (!entity)
            entity = world.getEntity(data.entityId);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpSEFBaUM7QUFFakMsNkdBQTRCO0FBWTVCLE1BQWEsTUFBTTtJQTZCZixZQUFZLEtBQVk7UUExQmpCLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFDMUIsWUFBTyxHQUFZLEtBQUssQ0FBQztRQUV6QixTQUFJLEdBQVEsRUFBRSxDQUFDO1FBQ2YsVUFBSyxHQUFHLEVBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFDO1FBRW5DLGNBQVMsR0FBRyxJQUFJLGdCQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDOUIsY0FBUyxHQUFHLElBQUksZ0JBQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM5QixnQkFBVyxHQUFHLElBQUksZ0JBQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUV0QyxRQUFHLEdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQztRQWlCckMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFFcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFoQkQsSUFBVyxFQUFFLEtBQUssT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNwQyxJQUFXLEtBQUssS0FBSyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzFDLElBQVcsSUFBSSxLQUFLLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDeEMsSUFBVyxRQUFRLEtBQUssT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNoRCxJQUFXLFFBQVEsS0FBSyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ2hELElBQVcsVUFBVSxLQUFLLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFFcEQsSUFBVyxlQUFlO1FBQ3RCLElBQUcsSUFBSSxDQUFDLEtBQUs7WUFBRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDO1FBQ2pELE9BQU8sZ0JBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzVCLENBQUM7SUFRTSxJQUFJLEtBQUksQ0FBQztJQUVULFFBQVEsQ0FBQyxLQUFlO1FBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRU0sT0FBTyxDQUFDLElBQWlCO1FBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFckUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQy9CLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNuQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDbkMsQ0FBQztJQUVNLEtBQUssQ0FBQyxFQUFVO1FBQ25CLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2xCLENBQUM7SUFFTSxpQkFBaUI7UUFDcEIsV0FBVyxDQUFDLEdBQUcsRUFBRTtZQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBQyxDQUFDLEdBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUMsQ0FBQyxHQUFDLENBQUM7UUFDM0MsQ0FBQyxFQUFFLEdBQUcsQ0FBQztJQUNYLENBQUM7SUFFTSxNQUFNLENBQUMsRUFBVTtRQUVwQjs7Ozs7Ozs7Ozs7Ozs7VUFjRTs7UUFFRixJQUFHLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDYixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBRW5DLG1HQUFtRztZQUNuRyxpSkFBaUo7WUFDakosaURBQWlEO1lBRWpELDZEQUE2RDtTQUNoRTtRQUVELElBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ2hELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDM0IsVUFBSSxDQUFDLElBQUksMENBQUUsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzlCLFVBQUksQ0FBQyxJQUFJLDBDQUFFLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUN4QztJQUVMLENBQUM7SUFFTSxNQUFNO1FBQ1QsTUFBTSxJQUFJLEdBQWdCLEVBQUU7UUFFNUIsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEYsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckYsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBRXRCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxRQUFRLENBQUMsVUFBdUI7UUFFbkMsb0RBQW9EO1FBRXBELElBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUVmLElBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDYixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUMvQixNQUFNLGNBQWMsR0FBRyxJQUFJLGdCQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvRixNQUFNLFdBQVcsR0FBRyxJQUFJLGdCQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBRXRDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBRXJELElBQUksVUFBVSxHQUFHLEdBQUcsQ0FBQztnQkFDckIsSUFBRyxRQUFRLEdBQUcsR0FBRztvQkFBRSxVQUFVLEdBQUcsQ0FBQyxDQUFDO2dCQUVsQyxRQUFRLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBRXZELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbEU7U0FDSjtRQUVELElBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUVmLElBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDYixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzlFO1NBQ0o7UUFFRCxJQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUU7WUFFaEIsSUFBRyxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNiLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDeEY7U0FDSjtRQUVELElBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNmLElBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDYixJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbkc7U0FDSjtRQUVELElBQUcsVUFBVSxDQUFDLEtBQUssRUFBRTtZQUNqQixJQUFHLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUU3QztTQUNKO1FBRUQsSUFBRyxVQUFVLENBQUMsSUFBSSxFQUFFO1lBQ2hCLElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztTQUMvQjtJQUNMLENBQUM7Q0FDSjtBQXBLRCx3QkFvS0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsTEQsaUhBQWlDO0FBQ2pDLCtFQUFrQztBQUNsQyw2R0FBNEI7QUFFNUIsSUFBWSxrQkFHWDtBQUhELFdBQVksa0JBQWtCO0lBQzFCLHFFQUFTO0lBQ1QsK0RBQU07QUFDVixDQUFDLEVBSFcsa0JBQWtCLEdBQWxCLDBCQUFrQixLQUFsQiwwQkFBa0IsUUFHN0I7QUFTRCxNQUFhLFlBQWEsU0FBUSxlQUFNO0lBRXBDLFlBQVksS0FBSztRQUNiLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUViLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVNLElBQUk7UUFDUCxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFYixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFFekMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBRWxDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxnQkFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRzlJLElBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxrQkFBa0IsQ0FBQyxTQUFTLEVBQUU7WUFDM0MsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FDdkMsSUFBSSxDQUFDLFFBQVEsRUFDYixXQUFXLEVBQ1gsSUFBSSxDQUFDLFdBQVcsQ0FDbkIsQ0FBQztZQUNGLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdEI7YUFBTTtZQUNILE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQ3BDLElBQUksQ0FBQyxRQUFRLEVBQ2IsSUFBSSxDQUFDLE1BQU8sRUFDWixJQUFJLENBQUMsV0FBVyxDQUNuQixDQUFDO1lBRUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0QjtJQUdMLENBQUM7SUFFTSxhQUFhO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBMkMsQ0FBQztJQUNqRSxDQUFDO0lBRU0sYUFBYSxDQUFDLElBQTZCO1FBQzlDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7SUFDN0MsQ0FBQztDQUNKO0FBN0NELG9DQTZDQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdERCxpSEFBaUM7QUFDakMsK0VBQWtDO0FBQ2xDLDZHQUE0QjtBQUU1QixNQUFhLFlBQWEsU0FBUSxlQUFNO0lBRXBDLFlBQVksS0FBSztRQUNiLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUViLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUdNLE9BQU8sQ0FBQyxJQUFpQjtRQUM1QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUMxQixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUU1QixLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFTSxNQUFNLENBQUMsRUFBVTtRQUNwQixLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQztRQUVsQixNQUFNLEtBQUssR0FBRyxJQUFJLGdCQUFNLENBQUMsSUFBSSxDQUN6QixLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsRUFBRSxFQUNsQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsRUFBRSxFQUNoQyxDQUFDLENBQ0osQ0FBQztRQUdGLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDL0IsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTNDLDZFQUE2RTtJQUNqRixDQUFDO0lBRU0sSUFBSTtRQUNQLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUViLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUVkLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQ3ZDLElBQUksQ0FBQyxRQUFRLEVBQ2IsSUFBSSxnQkFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUN0QixFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFDLENBQ25ELENBQUM7UUFFRixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7Q0FDSjtBQS9DRCxvQ0ErQ0M7Ozs7Ozs7Ozs7Ozs7OztBQ2pERCx1RkFBMEM7QUFFMUMsTUFBYSxJQUFJO0lBUWIsWUFBWSxRQUFrQjtRQVB0QixjQUFTLEdBQVksS0FBSyxDQUFDO1FBQzNCLGFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztRQU96QyxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsS0FBSyxJQUFJLENBQUM7SUFDdkMsQ0FBQztJQU5ELElBQVcsUUFBUSxLQUFLLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDaEQsSUFBVyxPQUFPLEtBQUssT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkUsSUFBVyxVQUFVLEtBQUssT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQU01QyxLQUFLO1FBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVNLFlBQVksQ0FBQyxFQUFVO1FBQzFCLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRVMsTUFBTSxDQUFDLEVBQVU7UUFDdkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQztDQUNKO0FBeEJELG9CQXdCQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVCRCw2R0FBMkI7QUFDM0IsaUhBQWlDO0FBRWpDLDRGQUE2QztBQUM3Qyx1RkFBMkU7QUFDM0UsdUVBQThCO0FBRTlCLE1BQWEsVUFBVyxTQUFRLFdBQUk7SUFhaEMsWUFBWSxNQUFNO1FBQ2QsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksaUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxVQUFVLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztJQUMvQixDQUFDO0lBUkQsSUFBVyxHQUFHLEtBQUssT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN0QyxJQUFXLE9BQU8sS0FBSyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBU3BDLE1BQU0sQ0FBQyxFQUFVO1FBQ3ZCLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFHakIsSUFBRyxVQUFVLENBQUMsTUFBTSxFQUFFO1lBRWxCLE1BQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ3RDLEtBQUssQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1lBQ3JCLEtBQUssQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBRW5CLElBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUM7Z0JBQUUsS0FBSyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNoRSxJQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO2dCQUFFLEtBQUssQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1lBRS9ELElBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUM7Z0JBQUUsS0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM5RCxJQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO2dCQUFFLEtBQUssQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1NBRWhFO1FBR0QsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVNLEtBQUs7UUFDUixLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBRzdCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRTtZQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFFOUQsTUFBTSxJQUFJLEdBQWdDO2dCQUN0QyxFQUFFLEVBQUUsS0FBSzthQUNaO1lBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsbUJBQVUsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMxRCxDQUFDLENBQUMsQ0FBQztJQUVQLENBQUM7SUFFTyxRQUFRO1FBQ1osTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUM1QixNQUFNLEdBQUcsR0FBRyxJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO1lBQ25DLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQzNCLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO1lBQ2pDLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztTQUMzQyxDQUFDLENBQUM7UUFDSCxHQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRVosSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7UUFFaEIsdURBQXVEO0lBQzNELENBQUM7SUFFTyxXQUFXO1FBQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUVqRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBRU0sTUFBTTtRQUNULE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFFNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN4QixNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7UUFDNUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ2pDLENBQUM7SUFFTyxxQkFBcUI7UUFDekIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUVyQixNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkMsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUU7WUFDMUIsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztTQUMxQyxDQUFDLENBQUM7UUFDSCxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQixNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDN0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLG1DQUFtQztRQUNsQyxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBd0IsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFN0UsTUFBTSxLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUIsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRS9CLFVBQVUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQy9CLENBQUM7SUFFTSxNQUFNO1FBQ1QsSUFBRyxDQUFDLElBQUksQ0FBQyxVQUFVO1lBQUUsT0FBTztRQUU1QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV4QyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTs7WUFDeEIsSUFBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7Z0JBRWpCLElBQUksV0FBVyxHQUFHLElBQUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDakQsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQztnQkFFaEIsSUFBRyxNQUFNLENBQUMsSUFBSSxFQUFFO29CQUNaLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUVyQyxJQUFHLEtBQUssRUFBRTt3QkFDTixJQUFHLEtBQUssWUFBWSxnQkFBTSxDQUFDLEdBQUcsRUFBRTs0QkFDNUIsV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7NEJBQ2hDLEdBQUcsR0FBRyxJQUFJLENBQUM7eUJBQ2Q7d0JBRUQsSUFBRyxLQUFLLFlBQVksZ0JBQU0sQ0FBQyxNQUFNLEVBQUU7NEJBQy9CLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO3lCQUN6QjtxQkFDSjtpQkFDSjtnQkFHRCxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFFNUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDM0MsUUFBUSxDQUFDLE9BQU8sR0FBRyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEQsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUVsQixNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUVsQyxJQUFHLEdBQUcsRUFBRTtvQkFFSixNQUFNLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUU7d0JBQ25DLFFBQVEsRUFBRSxRQUFRO3dCQUNsQixJQUFJLEVBQUUsS0FBSztxQkFDZCxDQUFDLENBQUM7b0JBQ0gsTUFBTSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7aUJBQ3RHO3FCQUFNO29CQUNILE1BQU0sQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRTt3QkFDbkMsUUFBUSxFQUFFLFFBQVE7d0JBQ2xCLElBQUksRUFBRSxRQUFRO3FCQUNqQixDQUFDLENBQUM7b0JBQ0gsTUFBTSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7aUJBQ2pGO2dCQUdELElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRXhDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO2FBQ3RCO1lBRUQsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUM1QixNQUFNLEtBQUssR0FBRyxJQUFJLGdCQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFaEMsWUFBTSxDQUFDLElBQUksMENBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUV2QyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pELE1BQU0sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUMxQixLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQzdCLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFDN0IsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUNoQztZQUNELDREQUE0RDtRQUNoRSxDQUFDLENBQUM7UUFFRixJQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDbEIsVUFBVSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzVILFVBQVUsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDOUM7SUFDTCxDQUFDOztBQTdMTCxnQ0FnTUM7QUE3TGlCLG1CQUFRLEdBQVcsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ1Z4Qyw4RkFBK0M7QUFFL0MsTUFBTSxJQUFJLEdBQUcsSUFBSSx1QkFBVSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUM3RCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDYixNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyx1QkFBVSxDQUFDO0FBRWxDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDN0IsNkRBQTZEOzs7Ozs7Ozs7Ozs7Ozs7QUNSN0QsNkhBQThDO0FBQzlDLCtGQUFnRDtBQUNoRCx1RkFBa0g7QUFDbEgsZ0hBQTJEO0FBRTNELE1BQWEsT0FBTztJQVdoQixZQUFZLElBQWdCO1FBSHBCLHNCQUFpQixHQUFXLEVBQUUsQ0FBQztRQUMvQixjQUFTLEdBQVcsQ0FBQyxDQUFDO1FBRzFCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBRWxCLGlDQUFpQztRQUVqQyxNQUFNLE9BQU8sR0FBRyxHQUFHLFFBQVEsQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3pELElBQUksQ0FBQyxPQUFPLEdBQUcseUJBQUUsRUFBQyxPQUFPLEVBQUU7WUFDdkIsa0JBQWtCO1lBQ2xCLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLFlBQVksRUFBRSxLQUFLO1NBQ3RCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUVsRSxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixPQUFPLEdBQUcsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUF0QkQsSUFBVyxJQUFJLEtBQUssT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN4QyxJQUFXLE1BQU0sS0FBSyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQzVDLElBQVcsU0FBUyxLQUFLLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBc0JsRCxPQUFPLENBQUMsUUFBcUI7UUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBRXZDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtZQUM5QixRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLEVBQUksQ0FBQztRQUNqQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSxNQUFNLENBQUMsRUFBVTtRQUNwQixJQUFJLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQztRQUVyQixNQUFNLE1BQU0sR0FBRyx1QkFBVSxDQUFDLE1BQU0sQ0FBQztRQUVqQyxJQUFHLENBQUMsTUFBTTtZQUFFLE9BQU87UUFFbkIsSUFBRyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsR0FBQyxJQUFJO1lBQUUsT0FBTztRQUN6RCxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUVuQixNQUFNLFVBQVUsR0FBMkI7WUFDdkMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1lBQ25CLFVBQVUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUk7WUFDbkMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUU7U0FDeEI7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFVLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFTSxJQUFJLENBQUMsSUFBZ0IsRUFBRSxJQUFVO1FBQ3BDLE1BQU0sTUFBTSxHQUFZO1lBQ3BCLElBQUksRUFBRSxJQUFJO1lBQ1YsSUFBSSxFQUFFLElBQUk7U0FDYjtRQUNELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRU0sZUFBZSxDQUFDLE1BQWU7UUFDbEMscUJBQXFCO1FBRXJCLElBQUcsTUFBTSxDQUFDLElBQUksSUFBSSxtQkFBVSxDQUFDLHdCQUF3QixFQUFFO1lBQ25ELE1BQU0sSUFBSSxHQUFzQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBRTVELHVCQUFVLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDdkM7UUFFRCxJQUFHLE1BQU0sQ0FBQyxJQUFJLElBQUksbUJBQVUsQ0FBQyxXQUFXLEVBQUU7WUFDdEMsTUFBTSxJQUFJLEdBQTJCLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFFakQsaUNBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM3QztJQUNMLENBQUM7Q0FPSjtBQXJGRCwwQkFxRkM7Ozs7Ozs7Ozs7Ozs7OztBQzFGRCxJQUFZLFVBTVg7QUFORCxXQUFZLFVBQVU7SUFDbEIseUVBQW1CO0lBQ25CLHlEQUFXO0lBQ1gscUVBQWlCO0lBQ2pCLG1GQUF3QjtJQUN4Qix5REFBVztBQUNmLENBQUMsRUFOVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQU1yQjs7Ozs7Ozs7Ozs7Ozs7O0FDSkQsTUFBYSxhQUFhO0lBQTFCO1FBQ1ksd0JBQW1CLEdBQUcsSUFBSSxHQUFHLEVBQXlCLENBQUM7SUFXbkUsQ0FBQztJQVRVLGNBQWMsQ0FBQyxJQUFZLEVBQUUsQ0FBZ0I7UUFDaEQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVNLFNBQVMsQ0FBQyxJQUFZO1FBQ3pCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0MsSUFBRyxDQUFDLENBQUM7WUFBRSxNQUFNLGdCQUFnQixJQUFJLGNBQWMsQ0FBQztRQUNoRCxPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7Q0FDSjtBQVpELHNDQVlDOzs7Ozs7Ozs7Ozs7Ozs7QUNiRCx5R0FBc0Q7QUFDdEQseUdBQXNEO0FBRXRELGtGQUF1QztBQUN2QyxvR0FBZ0Q7QUFFaEQsTUFBYSxNQUFNO0lBU2YsWUFBWSxJQUFVO1FBUGQsWUFBTyxHQUFHLElBQUksR0FBRyxFQUFpQixDQUFDO1FBUXZDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSw2QkFBYSxFQUFFLENBQUM7UUFFMUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsY0FBYyxFQUFFLDJCQUFZLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxjQUFjLEVBQUUsMkJBQVksQ0FBQyxDQUFDO1FBRWhFLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQVpELElBQVcsTUFBTSxLQUFLLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pFLElBQVcsSUFBSSxLQUFLLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDeEMsSUFBVyxhQUFhLEtBQUssT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztJQVluRCxNQUFNLENBQUMsRUFBVTtRQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRU0sV0FBVyxDQUFDLElBQVk7UUFDM0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxhQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2xDLENBQUM7Q0FDSjtBQTNCRCx3QkEyQkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQ0QsNkdBQTJCO0FBQzNCLGlIQUFpQztBQUVqQyx5R0FBbUc7QUFDbkcseUdBQXNEO0FBS3RELE1BQWEsS0FBSztJQWFkLFlBQVksTUFBYztRQVRsQixjQUFTLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7UUFVMUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFFdEIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDN0IsQ0FBQztJQVhELElBQVcsTUFBTSxLQUFLLE9BQU8sSUFBSSxDQUFDLE9BQU8sRUFBQyxDQUFDO0lBQUEsQ0FBQztJQUM1QyxJQUFXLFlBQVksS0FBSyxPQUFPLElBQUksQ0FBQyxhQUFhLEVBQUMsQ0FBQztJQUFBLENBQUM7SUFDeEQsSUFBVyxRQUFRLEtBQUssT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBQyxDQUFDO0lBQUEsQ0FBQztJQVc5RCxNQUFNLENBQUMsRUFBVTtRQUNwQixJQUFJLGFBQWEsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVTtRQUMxQyxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFFcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRU0sU0FBUyxDQUFDLEVBQVU7UUFDdkIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUUsQ0FBQztJQUNuQyxDQUFDO0lBRU0sU0FBUyxDQUFDLEVBQVU7UUFDdkIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRU8saUJBQWlCO1FBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUM7UUFFaEMsa0JBQWtCO1FBQ2xCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxnQkFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3BELEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxnQkFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUMsT0FBTztRQUVwRCxNQUFNO1FBQ04sTUFBTSxjQUFjLEdBQUcsSUFBSSxnQkFBTSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzdELE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxnQkFBTSxDQUFDLGVBQWUsQ0FBQyxjQUFjLEVBQUUsY0FBYyxFQUFFO1lBQ2hGLFFBQVEsRUFBRSxHQUFHO1lBQ2IsV0FBVyxFQUFFLEdBQUc7WUFDaEIsd0JBQXdCLEVBQUUsR0FBRztZQUM3Qix5QkFBeUIsRUFBRSxDQUFDO1lBQzVCLHlCQUF5QixFQUFFLEdBQUc7U0FDakMsQ0FBQyxDQUFDO1FBQ0gsS0FBSyxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFFM0MsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLGdCQUFNLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDakUsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLGdCQUFNLENBQUMsZUFBZSxDQUFDLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRTtZQUNwRixRQUFRLEVBQUUsS0FBSztZQUNmLFdBQVcsRUFBRSxDQUFDO1lBQ2Qsd0JBQXdCLEVBQUUsR0FBRztZQUM3Qix5QkFBeUIsRUFBRSxDQUFDO1NBQy9CLENBQUMsQ0FBQztRQUNILEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBRTdDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxjQUFjLENBQUM7UUFDdkMsSUFBSSxDQUFDLGNBQWMsR0FBRyxnQkFBZ0IsQ0FBQztRQUd2QyxNQUFNLG1CQUFtQixHQUFHLElBQUksZ0JBQU0sQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUU7WUFDdkYsUUFBUSxFQUFFLEtBQUs7WUFDZixXQUFXLEVBQUUsQ0FBQztZQUNkLHdCQUF3QixFQUFFLEdBQUc7WUFDN0IseUJBQXlCLEVBQUUsQ0FBQztTQUMvQixDQUFDLENBQUM7UUFDSCxLQUFLLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUk5Qzs7Ozs7Ozs7VUFRRTtRQUtGLE1BQU0saUJBQWlCLEdBQXdCO1lBQzNDLElBQUksRUFBRSxDQUFDO1lBQ1AsUUFBUSxFQUFFLElBQUksQ0FBQyxnQkFBZ0I7U0FDbEMsQ0FBQztRQUVGLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLGdCQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxnQkFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLGlCQUFpQixFQUFFLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekksTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFFdkIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNJLFNBQVMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBRTFCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLGdCQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLGdCQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsaUJBQWlCLEVBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzSSxNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUN2QixNQUFNLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFMUMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLGdCQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5SSxTQUFTLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUcxQixJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUUxQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN4QixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQzlCLElBQUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFDeEI7b0JBQ0ksS0FBSyxFQUFFLGlDQUFrQixDQUFDLFNBQVM7b0JBQ25DLE1BQU0sRUFBRSxHQUFHO29CQUNYLFdBQVcsRUFBRSxFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFDO29CQUNyQyxXQUFXLEVBQUUsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFDO2lCQUMzQixDQUNKLENBQUM7YUFFTDtZQUlELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3hCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDL0IsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbkMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUM7YUFDM0I7U0FJSjtRQUtEOzs7Ozs7OztVQVFFO1FBRUYsb0dBQW9HO1FBQ3BHLHFHQUFxRztRQUVyRyxXQUFXLENBQUMsR0FBRyxFQUFFO1lBRWIsNERBQTREO1lBQzVELCtEQUErRDtRQUVuRSxDQUFDLEVBQUUsR0FBRyxDQUFDO1FBRVAsc0RBQXNEO0lBQzFELENBQUM7SUFFTSxvQkFBb0IsQ0FBQyxRQUFxQixFQUFFLFdBQXdCLEVBQUUsV0FBZ0MsRUFBRSxLQUFlO1FBQzFILE1BQU0sT0FBTyxHQUE0QjtZQUNyQyxLQUFLLEVBQUUsaUNBQWtCLENBQUMsU0FBUztZQUNuQyxXQUFXLEVBQUUsV0FBVztZQUN4QixXQUFXLEVBQUUsV0FBVztTQUMzQjtRQUVELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FDL0IsUUFBUSxFQUNSLE9BQU8sQ0FDVixDQUFDO1FBRUYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVyQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sV0FBVztRQUNkLE1BQU0sTUFBTSxHQUFHLElBQUksMkJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZCLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFTSxTQUFTLENBQUMsTUFBYztRQUMzQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBSU0saUJBQWlCLENBQUMsUUFBcUIsRUFBRSxVQUFtQztRQUMvRSxNQUFNLE1BQU0sR0FBRyxJQUFJLDJCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNqQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkIsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVPLGFBQWEsQ0FBQyxHQUFnQjtRQUNsQyxPQUFPLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUc7SUFDM0MsQ0FBQztJQUVNLG1CQUFtQixDQUFDLFFBQXFCLEVBQUUsV0FBd0IsRUFBRSxPQUE2QjtRQUVyRyxNQUFNLEdBQUcsR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO1FBRTFCLEdBQUcsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBRXhCLElBQUksS0FBSyxHQUFHLElBQUksZ0JBQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDeEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxnQkFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXJCLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWhDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxRQUFxQixFQUFFLE1BQWMsRUFBRSxPQUE2QjtRQUV4RixNQUFNLEdBQUcsR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO1FBRTFCLEdBQUcsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBRXhCLElBQUksS0FBSyxHQUFHLElBQUksZ0JBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxnQkFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXJCLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWhDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSjtBQXpPRCxzQkF5T0M7QUFFRDs7Ozs7RUFLRTs7Ozs7Ozs7Ozs7Ozs7O0FDdFBGLCtGQUFnRDtBQUdoRCxNQUFhLGVBQWU7SUFDakIsTUFBTSxLQUFLLElBQUksS0FBSyxPQUFPLHVCQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUFBLENBQUM7SUFFbEQsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQTRCO1FBQzFELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3QyxJQUFJLFdBQVcsR0FBWSxLQUFLLENBQUM7UUFFakMsSUFBSSxNQUEwQixDQUFDO1FBRS9CLElBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUVoQyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBSWhFLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0QixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUU3QixHQUFHO1lBQ0YsV0FBVyxHQUFHLElBQUksQ0FBQztZQUVuQixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQztZQUV4QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDO1NBQy9CO1FBRUQsSUFBRyxDQUFDLE1BQU07WUFBRSxNQUFNLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFcEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFM0IsSUFBRyxXQUFXLEVBQUU7WUFDWixLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLHNDQUFzQztTQUN6QztRQUlELElBQUcsTUFBTSxDQUFDLEVBQUUsSUFBSSx1QkFBVSxDQUFDLFFBQVEsRUFBRTtZQUVqQyxJQUFHLENBQUMsdUJBQVUsQ0FBQyxNQUFNLEVBQUU7Z0JBQ25CLHVCQUFVLENBQUMsTUFBTSxHQUFHLE1BQWdCLENBQUM7Z0JBQ3JDLHVCQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7Z0JBQ2xDLHNDQUFzQztnQkFDdEMsd0NBQXdDO2FBQzNDO1NBQ0o7SUFDTCxDQUFDO0NBQ0o7QUFqREQsMENBaURDOzs7Ozs7Ozs7Ozs7Ozs7OztVQ3ZERDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOztVQUVBO1VBQ0E7Ozs7O1dDekJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsK0JBQStCLHdDQUF3QztXQUN2RTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlCQUFpQixxQkFBcUI7V0FDdEM7V0FDQTtXQUNBLGtCQUFrQixxQkFBcUI7V0FDdkM7V0FDQTtXQUNBLEtBQUs7V0FDTDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDM0JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL2VudGl0eS9lbnRpdHkudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL2VudGl0eS9lbnRpdHlPYmplY3QudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL2VudGl0eS9lbnRpdHlQbGF5ZXIudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL2dhbWUvZ2FtZS50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvZ2FtZS9nYW1lQ2xpZW50LnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvbmV0d29yay9uZXR3b3JrLnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9wYWNrZXQvcGFja2V0LnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9zZXJ2ZXIvZW50aXR5RmFjdG9yeS50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvc2VydmVyL3NlcnZlci50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvd29ybGQvd29ybGQudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL3dvcmxkL3dvcmxkU3luY0hlbHBlci50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBjIGZyb20gJ3BsYXljYW52YXMnO1xyXG5pbXBvcnQgUGhhc2VyIGZyb20gJ3BoYXNlcic7XHJcbmltcG9ydCBDQU5OT04gZnJvbSAnY2Fubm9uJztcclxuaW1wb3J0IHsgV29ybGQgfSBmcm9tIFwiLi4vd29ybGQvd29ybGRcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUVudGl0eURhdGEge1xyXG4gICAgcG9zPzogbnVtYmVyW11cclxuICAgIHZlbD86IG51bWJlcltdXHJcbiAgICByb3Q/OiBudW1iZXJbXVxyXG4gICAgYVZlbD86IG51bWJlcltdXHJcbiAgICBpbnB1dD86IG51bWJlcltdXHJcbiAgICBkYXRhPzogYW55XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFbnRpdHkge1xyXG4gICAgcHVibGljIHBjRW50aXR5PzogcGMuRW50aXR5O1xyXG5cclxuICAgIHB1YmxpYyBkb250U3luYzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGNhbkxlcnA6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBwdWJsaWMgZGF0YTogYW55ID0ge307XHJcbiAgICBwdWJsaWMgaW5wdXQgPSB7aG9yaXpvbnRhbDogMCwgdmVydGljYWw6IDB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcG9zaXRpb24gPSBuZXcgQ0FOTk9OLlZlYzMoKTtcclxuICAgIHByaXZhdGUgX3ZlbG9jaXR5ID0gbmV3IENBTk5PTi5WZWMzKCk7XHJcbiAgICBwcml2YXRlIF9xdWF0ZXJuaW9uID0gbmV3IENBTk5PTi5RdWF0ZXJuaW9uKCk7XHJcblxyXG4gICAgcHJpdmF0ZSBfaWQ6IHN0cmluZyA9IGAke01hdGgucmFuZG9tKCl9YDtcclxuICAgIHByaXZhdGUgX3dvcmxkOiBXb3JsZDtcclxuICAgIHByaXZhdGUgX2JvZHk/OiBDQU5OT04uQm9keTtcclxuICAgIFxyXG4gICAgcHVibGljIGdldCBpZCgpIHsgcmV0dXJuIHRoaXMuX2lkOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHdvcmxkKCkgeyByZXR1cm4gdGhpcy5fd29ybGQ7IH1cclxuICAgIHB1YmxpYyBnZXQgYm9keSgpIHsgcmV0dXJuIHRoaXMuX2JvZHk7IH1cclxuICAgIHB1YmxpYyBnZXQgcG9zaXRpb24oKSB7IHJldHVybiB0aGlzLl9wb3NpdGlvbjsgfVxyXG4gICAgcHVibGljIGdldCB2ZWxvY2l0eSgpIHsgcmV0dXJuIHRoaXMuX3ZlbG9jaXR5OyB9XHJcbiAgICBwdWJsaWMgZ2V0IHF1YXRlcm5pb24oKSB7IHJldHVybiB0aGlzLl9xdWF0ZXJuaW9uOyB9XHJcblxyXG4gICAgcHVibGljIGdldCBhbmd1bGFyVmVsb2NpdHkoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fYm9keSkgcmV0dXJuIHRoaXMuX2JvZHkuYW5ndWxhclZlbG9jaXR5O1xyXG4gICAgICAgIHJldHVybiBDQU5OT04uVmVjMy5aRVJPO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHdvcmxkOiBXb3JsZCkge1xyXG4gICAgICAgIHRoaXMuX3dvcmxkID0gd29ybGQ7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0Q29sb3IocGMuQ29sb3IuV0hJVEUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0KCkge31cclxuXHJcbiAgICBwdWJsaWMgc2V0Q29sb3IoY29sb3I6IHBjLkNvbG9yKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhLmNvbG9yID0gW2NvbG9yLnIsIGNvbG9yLmcsIGNvbG9yLmJdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRCb2R5KGJvZHk6IENBTk5PTi5Cb2R5KSB7XHJcbiAgICAgICAgYm9keS5wb3NpdGlvbi5zZXQodGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnksIHRoaXMucG9zaXRpb24ueik7XHJcblxyXG4gICAgICAgIHRoaXMuX2JvZHkgPSBib2R5O1xyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gYm9keS5wb3NpdGlvbjtcclxuICAgICAgICB0aGlzLl9xdWF0ZXJuaW9uID0gYm9keS5xdWF0ZXJuaW9uO1xyXG4gICAgICAgIHRoaXMuX3ZlbG9jaXR5ID0gYm9keS52ZWxvY2l0eTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0SWQoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX2lkID0gaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0Qm90QmVoYXZpb3VyKCkge1xyXG4gICAgICAgIHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pbnB1dC5ob3Jpem9udGFsID0gTWF0aC5yYW5kb20oKSoyLTFcclxuICAgICAgICAgICAgdGhpcy5pbnB1dC52ZXJ0aWNhbCA9IE1hdGgucmFuZG9tKCkqMi0xXHJcbiAgICAgICAgfSwgNDAwKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICBpZih0aGlzLmNhbkxlcnApIHtcclxuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICBjb25zdCBuZXdQb3NpdGlvbiA9IG5ldyBDQU5OT04uVmVjMygpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBwb3NpdGlvbi5kaXN0YW5jZVRvKHRoaXMuX3RhcmdldFBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBsZXJwQW1vdW50ID0gMC4zO1xyXG4gICAgICAgICAgICBpZihkaXN0YW5jZSA+IDIuNSkgbGVycEFtb3VudCA9IDE7XHJcblxyXG5cclxuICAgICAgICAgICAgcG9zaXRpb24ubGVycCh0aGlzLl90YXJnZXRQb3NpdGlvbiwgbGVycEFtb3VudCwgbmV3UG9zaXRpb24pO1xyXG4gICAgICAgICAgICBwb3NpdGlvbi5zZXQobmV3UG9zaXRpb24ueCwgbmV3UG9zaXRpb24ueSwgbmV3UG9zaXRpb24ueik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICovXHJcblxyXG4gICAgICAgIGlmKHRoaXMuY2FuTGVycCkge1xyXG4gICAgICAgICAgICBjb25zdCBxdWF0ZXJuaW9uID0gdGhpcy5xdWF0ZXJuaW9uO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9jb25zdCBxZnJvbSA9IG5ldyBQaGFzZXIuTWF0aC5RdWF0ZXJuaW9uKHF1YXRlcm5pb24ueCwgcXVhdGVybmlvbi55LCBxdWF0ZXJuaW9uLnosIHF1YXRlcm5pb24udyk7XHJcbiAgICAgICAgICAgIC8vY29uc3QgcXRvID0gbmV3IFBoYXNlci5NYXRoLlF1YXRlcm5pb24odGhpcy5fdGFyZ2V0UXVhdGVybmlvbi54LCB0aGlzLl90YXJnZXRRdWF0ZXJuaW9uLnksIHRoaXMuX3RhcmdldFF1YXRlcm5pb24ueiwgdGhpcy5fdGFyZ2V0UXVhdGVybmlvbi53KTtcclxuICAgICAgICAgICAgLy9jb25zdCByZXN1bHQgPSBxZnJvbS5sZXJwKHF0bywgMC4xKTsgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgLy90aGlzLnF1YXRlcm5pb24uc2V0KHJlc3VsdC54LCByZXN1bHQueSwgcmVzdWx0LnosIHJlc3VsdC53KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5wb3NpdGlvbi5kaXN0YW5jZVRvKENBTk5PTi5WZWMzLlpFUk8pID4gMjApIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi5zZXQoMCwgMCwgMik7XHJcbiAgICAgICAgICAgIHRoaXMuYm9keT8udmVsb2NpdHkuc2V0WmVybygpO1xyXG4gICAgICAgICAgICB0aGlzLmJvZHk/LmFuZ3VsYXJWZWxvY2l0eS5zZXRaZXJvKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9KU09OKCkge1xyXG4gICAgICAgIGNvbnN0IGRhdGE6IElFbnRpdHlEYXRhID0ge31cclxuXHJcbiAgICAgICAgZGF0YS5wb3MgPSBbdGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnksIHRoaXMucG9zaXRpb24uel07XHJcbiAgICAgICAgZGF0YS5yb3QgPSBbdGhpcy5xdWF0ZXJuaW9uLngsIHRoaXMucXVhdGVybmlvbi55LCB0aGlzLnF1YXRlcm5pb24ueiwgdGhpcy5xdWF0ZXJuaW9uLnddO1xyXG4gICAgICAgIGRhdGEudmVsID0gW3RoaXMudmVsb2NpdHkueCwgdGhpcy52ZWxvY2l0eS55LCB0aGlzLnZlbG9jaXR5LnpdO1xyXG4gICAgICAgIGRhdGEuYVZlbCA9IFt0aGlzLmFuZ3VsYXJWZWxvY2l0eS54LCB0aGlzLmFuZ3VsYXJWZWxvY2l0eS55LCB0aGlzLmFuZ3VsYXJWZWxvY2l0eS56XTtcclxuICAgICAgICBkYXRhLmlucHV0ID0gW3RoaXMuaW5wdXQuaG9yaXpvbnRhbCwgdGhpcy5pbnB1dC52ZXJ0aWNhbF07XHJcbiAgICAgICAgZGF0YS5kYXRhID0gdGhpcy5kYXRhO1xyXG5cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZnJvbUpTT04oZW50aXR5RGF0YTogSUVudGl0eURhdGEpIHtcclxuICAgICAgICBcclxuICAgICAgICAvL2lmKHRoaXMgPT0gR2FtZUNsaWVudC5wbGF5ZXIpIGNvbnNvbGUubG9nKCd1b3NwcycpXHJcblxyXG4gICAgICAgIGlmKGVudGl0eURhdGEucG9zKSB7XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLmNhbkxlcnApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldFBvc2l0aW9uID0gbmV3IENBTk5PTi5WZWMzKGVudGl0eURhdGEucG9zWzBdLCBlbnRpdHlEYXRhLnBvc1sxXSwgZW50aXR5RGF0YS5wb3NbMl0pXHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdQb3NpdGlvbiA9IG5ldyBDQU5OT04uVmVjMygpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gcG9zaXRpb24uZGlzdGFuY2VUbyh0YXJnZXRQb3NpdGlvbik7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGxlcnBBbW91bnQgPSAwLjM7XHJcbiAgICAgICAgICAgICAgICBpZihkaXN0YW5jZSA+IDIuNSkgbGVycEFtb3VudCA9IDE7XHJcblxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb24ubGVycCh0YXJnZXRQb3NpdGlvbiwgbGVycEFtb3VudCwgbmV3UG9zaXRpb24pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24uc2V0KG5ld1Bvc2l0aW9uLngsIG5ld1Bvc2l0aW9uLnksIG5ld1Bvc2l0aW9uLnopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihlbnRpdHlEYXRhLnZlbCkge1xyXG5cclxuICAgICAgICAgICAgaWYodGhpcy5jYW5MZXJwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlbG9jaXR5LnNldChlbnRpdHlEYXRhLnZlbFswXSwgZW50aXR5RGF0YS52ZWxbMV0sIGVudGl0eURhdGEudmVsWzJdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoZW50aXR5RGF0YS5hVmVsKSB7XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLmNhbkxlcnApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5ndWxhclZlbG9jaXR5LnNldChlbnRpdHlEYXRhLmFWZWxbMF0sIGVudGl0eURhdGEuYVZlbFsxXSwgZW50aXR5RGF0YS5hVmVsWzJdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoZW50aXR5RGF0YS5yb3QpIHtcclxuICAgICAgICAgICAgaWYodGhpcy5jYW5MZXJwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnF1YXRlcm5pb24uc2V0KGVudGl0eURhdGEucm90WzBdLCBlbnRpdHlEYXRhLnJvdFsxXSwgZW50aXR5RGF0YS5yb3RbMl0sIGVudGl0eURhdGEucm90WzNdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZihlbnRpdHlEYXRhLmlucHV0KSB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY2FuTGVycCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dC5ob3Jpem9udGFsID0gZW50aXR5RGF0YS5pbnB1dFswXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXQudmVydGljYWwgPSBlbnRpdHlEYXRhLmlucHV0WzFdO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoZW50aXR5RGF0YS5kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGVudGl0eURhdGEuZGF0YTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0gICAiLCJpbXBvcnQgKiBhcyBwYyBmcm9tICdwbGF5Y2FudmFzJztcclxuaW1wb3J0IHsgRW50aXR5IH0gZnJvbSBcIi4vZW50aXR5XCI7XHJcbmltcG9ydCBDQU5OT04gZnJvbSAnY2Fubm9uJztcclxuXHJcbmV4cG9ydCBlbnVtIElFbnRpdHlPYmplY3RTaGFwZSB7XHJcbiAgICBSRUNUQU5HTEUsXHJcbiAgICBTUEhFUkVcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJRW50aXR5T2JqZWN0Q3VzdG9tRGF0YSB7XHJcbiAgICBzaGFwZTogSUVudGl0eU9iamVjdFNoYXBlXHJcbiAgICByYWRpdXM/OiBudW1iZXJcclxuICAgIGhhbGZFeHRlbnRzPzoge3g6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXJ9XHJcbiAgICBib2R5T3B0aW9ucz86IENBTk5PTi5JQm9keU9wdGlvbnNcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEVudGl0eU9iamVjdCBleHRlbmRzIEVudGl0eSB7XHJcblxyXG4gICAgY29uc3RydWN0b3Iod29ybGQpIHtcclxuICAgICAgICBzdXBlcih3b3JsZCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0Q29sb3IobmV3IHBjLkNvbG9yKE1hdGgucmFuZG9tKCksIE1hdGgucmFuZG9tKCksIE1hdGgucmFuZG9tKCkpKVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0KCkge1xyXG4gICAgICAgIHN1cGVyLmluaXQoKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ2luaXQnLCB0aGlzLmdldEN1c3RvbURhdGEoKSlcclxuXHJcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZ2V0Q3VzdG9tRGF0YSgpO1xyXG5cclxuICAgICAgICBjb25zdCBoYWxmRXh0ZW50cyA9IGRhdGEuaGFsZkV4dGVudHMgPyBuZXcgQ0FOTk9OLlZlYzMoZGF0YS5oYWxmRXh0ZW50cy54LCBkYXRhLmhhbGZFeHRlbnRzLnksIGRhdGEuaGFsZkV4dGVudHMueikgOiBuZXcgQ0FOTk9OLlZlYzMoMSwgMSwgMSk7XHJcblxyXG4gICAgIFxyXG4gICAgICAgIGlmKGRhdGEuc2hhcGUgPT0gSUVudGl0eU9iamVjdFNoYXBlLlJFQ1RBTkdMRSkge1xyXG4gICAgICAgICAgICBjb25zdCBib2R5ID0gdGhpcy53b3JsZC5jcmVhdGVSZWN0YW5nbGVCb2R5KFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbixcclxuICAgICAgICAgICAgICAgIGhhbGZFeHRlbnRzLFxyXG4gICAgICAgICAgICAgICAgZGF0YS5ib2R5T3B0aW9uc1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB0aGlzLnNldEJvZHkoYm9keSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgYm9keSA9IHRoaXMud29ybGQuY3JlYXRlU3BoZXJlQm9keShcclxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24sXHJcbiAgICAgICAgICAgICAgICBkYXRhLnJhZGl1cyEsXHJcbiAgICAgICAgICAgICAgICBkYXRhLmJvZHlPcHRpb25zXHJcbiAgICAgICAgICAgICk7XHJcbiAgICBcclxuICAgICAgICAgICAgdGhpcy5zZXRCb2R5KGJvZHkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEN1c3RvbURhdGEoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5vYmplY3RDdXN0b21EYXRhIGFzIElFbnRpdHlPYmplY3RDdXN0b21EYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRDdXN0b21EYXRhKGRhdGE6IElFbnRpdHlPYmplY3RDdXN0b21EYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5vYmplY3RDdXN0b21EYXRhID0gZGF0YTtcclxuICAgIH1cclxufSIsImltcG9ydCAqIGFzIHBjIGZyb20gJ3BsYXljYW52YXMnO1xyXG5pbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwiLi9lbnRpdHlcIjtcclxuaW1wb3J0IENBTk5PTiBmcm9tICdjYW5ub24nO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVudGl0eVBsYXllciBleHRlbmRzIEVudGl0eSB7XHJcblxyXG4gICAgY29uc3RydWN0b3Iod29ybGQpIHtcclxuICAgICAgICBzdXBlcih3b3JsZCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0Q29sb3IobmV3IHBjLkNvbG9yKE1hdGgucmFuZG9tKCksIE1hdGgucmFuZG9tKCksIE1hdGgucmFuZG9tKCkpKVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgc2V0Qm9keShib2R5OiBDQU5OT04uQm9keSkge1xyXG4gICAgICAgIGJvZHkuZml4ZWRSb3RhdGlvbiA9IHRydWU7XHJcbiAgICAgICAgYm9keS51cGRhdGVNYXNzUHJvcGVydGllcygpO1xyXG5cclxuICAgICAgICBzdXBlci5zZXRCb2R5KGJvZHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShkdCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNwZWVkID0gMjAwO1xyXG5cclxuICAgICAgICBjb25zdCBmb3JjZSA9IG5ldyBDQU5OT04uVmVjMyhcclxuICAgICAgICAgICAgc3BlZWQgKiB0aGlzLmlucHV0Lmhvcml6b250YWwgKiBkdCxcclxuICAgICAgICAgICAgc3BlZWQgKiB0aGlzLmlucHV0LnZlcnRpY2FsICogZHQsXHJcbiAgICAgICAgICAgIDBcclxuICAgICAgICApO1xyXG5cclxuXHJcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSB0aGlzLnZlbG9jaXR5O1xyXG4gICAgICAgIHZlbG9jaXR5LnNldChmb3JjZS54LCBmb3JjZS55LCB2ZWxvY2l0eS56KTtcclxuXHJcbiAgICAgICAgLy90aGlzLmJvZHk/LmFwcGx5TG9jYWxGb3JjZShuZXcgQ0FOTk9OLlZlYzMoMCwgMCwgLTEwMDApLCBDQU5OT04uVmVjMy5aRVJPKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5pdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0KCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHMgPSAwLjM7XHJcblxyXG4gICAgICAgIGNvbnN0IGJvZHkgPSB0aGlzLndvcmxkLmNyZWF0ZVJlY3RhbmdsZUJvZHkoXHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24sXHJcbiAgICAgICAgICAgIG5ldyBDQU5OT04uVmVjMyhzLHMscyksXHJcbiAgICAgICAgICAgIHttYXNzOiAxMDAsIG1hdGVyaWFsOiB0aGlzLndvcmxkLl9tYXRlcmlhbF90ZXN0fVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0Qm9keShib2R5KTtcclxuICAgIH1cclxufSIsIlxyXG5pbXBvcnQgKiBhcyBwYyBmcm9tICdwbGF5Y2FudmFzJ1xyXG5pbXBvcnQgeyBTZXJ2ZXIgfSBmcm9tICcuLi9zZXJ2ZXIvc2VydmVyJztcclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lIHtcclxuICAgIHByaXZhdGUgX2lzU2VydmVyOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIF9zZXJ2ZXJzID0gbmV3IE1hcDxzdHJpbmcsIFNlcnZlcj4oKTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGlzU2VydmVyKCkgeyByZXR1cm4gdGhpcy5faXNTZXJ2ZXI7IH1cclxuICAgIHB1YmxpYyBnZXQgc2VydmVycygpIHsgcmV0dXJuIEFycmF5LmZyb20odGhpcy5fc2VydmVycy52YWx1ZXMoKSk7IH1cclxuICAgIHB1YmxpYyBnZXQgbWFpblNlcnZlcigpIHsgcmV0dXJuIHRoaXMuc2VydmVyc1swXTsgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGlzU2VydmVyPzogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX2lzU2VydmVyID0gaXNTZXJ2ZXIgPT09IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbR2FtZV0gc3RhcnQ7IGlzU2VydmVyID1gLCB0aGlzLmlzU2VydmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlU2VydmVyKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBzZXJ2ZXIgPSBuZXcgU2VydmVyKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX3NlcnZlcnMuc2V0KGlkLCBzZXJ2ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuc2VydmVycy5tYXAoc2VydmVyID0+IHNlcnZlci51cGRhdGUoZHQpKTtcclxuICAgIH1cclxufSIsImltcG9ydCBDQU5OT04gZnJvbSAnY2Fubm9uJ1xyXG5pbXBvcnQgKiBhcyBwYyBmcm9tIFwicGxheWNhbnZhc1wiO1xyXG5pbXBvcnQgeyBFbnRpdHkgfSBmcm9tICcuLi9lbnRpdHkvZW50aXR5JztcclxuaW1wb3J0IHsgTmV0d29yayB9IGZyb20gXCIuLi9uZXR3b3JrL25ldHdvcmtcIjtcclxuaW1wb3J0IHsgSVBhY2tldERhdGFfQ29ubmVjdFRvU2VydmVyLCBQYWNrZXRUeXBlIH0gZnJvbSAnLi4vcGFja2V0L3BhY2tldCc7XHJcbmltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi9nYW1lXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZUNsaWVudCBleHRlbmRzIEdhbWUge1xyXG4gICAgcHVibGljIHN0YXRpYyBJbnN0YW5jZTogR2FtZUNsaWVudDtcclxuICAgIHB1YmxpYyBzdGF0aWMgY2FtZXJhOiBwYy5FbnRpdHk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHBsYXllcklkOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHVibGljIHN0YXRpYyBwbGF5ZXI/OiBFbnRpdHk7XHJcblxyXG4gICAgcHJpdmF0ZSBfYXBwOiBwYy5BcHBsaWNhdGlvbjtcclxuICAgIHByaXZhdGUgX2NhbnZhcztcclxuICAgIHByaXZhdGUgX25ldHdvcms6IE5ldHdvcms7XHJcblxyXG4gICAgcHVibGljIGdldCBhcHAoKSB7IHJldHVybiB0aGlzLl9hcHA7IH1cclxuICAgIHB1YmxpYyBnZXQgbmV0d29yaygpIHsgcmV0dXJuIHRoaXMuX25ldHdvcms7IH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXMpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NhbnZhcyA9IGNhbnZhcztcclxuICAgICAgICB0aGlzLl9uZXR3b3JrID0gbmV3IE5ldHdvcmsodGhpcyk7XHJcbiAgICAgICAgR2FtZUNsaWVudC5JbnN0YW5jZSA9IHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZShkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKGR0KTtcclxuXHJcblxyXG4gICAgICAgIGlmKEdhbWVDbGllbnQucGxheWVyKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpbnB1dCA9IEdhbWVDbGllbnQucGxheWVyLmlucHV0O1xyXG4gICAgICAgICAgICBpbnB1dC5ob3Jpem9udGFsID0gMDtcclxuICAgICAgICAgICAgaW5wdXQudmVydGljYWwgPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYodGhpcy5hcHAua2V5Ym9hcmQuaXNQcmVzc2VkKHBjLktFWV9BKSkgaW5wdXQuaG9yaXpvbnRhbCA9IC0xO1xyXG4gICAgICAgICAgICBpZih0aGlzLmFwcC5rZXlib2FyZC5pc1ByZXNzZWQocGMuS0VZX0QpKSBpbnB1dC5ob3Jpem9udGFsID0gMTtcclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuYXBwLmtleWJvYXJkLmlzUHJlc3NlZChwYy5LRVlfVykpIGlucHV0LnZlcnRpY2FsID0gLTE7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYXBwLmtleWJvYXJkLmlzUHJlc3NlZChwYy5LRVlfUykpIGlucHV0LnZlcnRpY2FsID0gMTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5uZXR3b3JrLnVwZGF0ZShkdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0KCkge1xyXG4gICAgICAgIHN1cGVyLnN0YXJ0KCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cEFwcCgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBSZXNpemUoKTtcclxuICAgICAgICB0aGlzLnNldHVwTG9jYWxDbGllbnRTY2VuZSgpO1xyXG5cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm5ldHdvcmsuY29ubmVjdCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbTmV0d29ya10gQ29ubmVjdGVkPyAke3RoaXMubmV0d29yay5jb25uZWN0ZWR9YCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBkYXRhOiBJUGFja2V0RGF0YV9Db25uZWN0VG9TZXJ2ZXIgPSB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ2FueSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm5ldHdvcmsuc2VuZChQYWNrZXRUeXBlLkNPTk5FQ1RfVE9fU0VSVkVSLCBkYXRhKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXR1cEFwcCgpIHtcclxuICAgICAgICBjb25zdCBjYW52YXMgPSB0aGlzLl9jYW52YXM7XHJcbiAgICAgICAgY29uc3QgYXBwID0gbmV3IHBjLkFwcGxpY2F0aW9uKGNhbnZhcywge1xyXG4gICAgICAgICAgICBtb3VzZTogbmV3IHBjLk1vdXNlKGNhbnZhcyksXHJcbiAgICAgICAgICAgIHRvdWNoOiBuZXcgcGMuVG91Y2hEZXZpY2UoY2FudmFzKSxcclxuICAgICAgICAgICAga2V5Ym9hcmQ6IG5ldyBwYy5LZXlib2FyZChkb2N1bWVudC5ib2R5KVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGFwcC5vbigndXBkYXRlJywgZHQgPT4gdGhpcy51cGRhdGUoZHQpKVxyXG4gICAgICAgIGFwcC5zdGFydCgpO1xyXG5cclxuICAgICAgICB0aGlzLl9hcHAgPSBhcHA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9wYy5yZWdpc3RlclNjcmlwdChDYW1lcmFGb2xsb3csICdjYW1lcmFGb2xsb3cnLCBhcHApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0dXBSZXNpemUoKSB7XHJcbiAgICAgICAgdGhpcy5hcHAuc2V0Q2FudmFzRmlsbE1vZGUocGMuRklMTE1PREVfRklMTF9XSU5ET1cpO1xyXG4gICAgICAgIHRoaXMuYXBwLnNldENhbnZhc1Jlc29sdXRpb24ocGMuUkVTT0xVVElPTl9BVVRPKTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHRoaXMucmVzaXplKCkpO1xyXG4gICAgICAgIHRoaXMucmVzaXplKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlc2l6ZSgpIHtcclxuICAgICAgICBjb25zdCBjYW52YXMgPSB0aGlzLl9jYW52YXM7XHJcblxyXG4gICAgICAgIHRoaXMuYXBwLnJlc2l6ZUNhbnZhcygpO1xyXG4gICAgICAgIGNhbnZhcy5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgICAgIGNhbnZhcy5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldHVwTG9jYWxDbGllbnRTY2VuZSgpIHtcclxuICAgICAgICBjb25zdCBhcHAgPSB0aGlzLmFwcDtcclxuXHJcbiAgICAgICAgY29uc3QgY2FtZXJhID0gbmV3IHBjLkVudGl0eSgnY2FtZXJhJyk7XHJcbiAgICAgICAgY2FtZXJhLmFkZENvbXBvbmVudCgnY2FtZXJhJywge1xyXG4gICAgICAgICAgICBjbGVhckNvbG9yOiBuZXcgcGMuQ29sb3IoMC4xLCAwLjEsIDAuMSlcclxuICAgICAgICB9KTtcclxuICAgICAgICBhcHAucm9vdC5hZGRDaGlsZChjYW1lcmEpO1xyXG4gICAgICAgIGNhbWVyYS5zZXRQb3NpdGlvbigwLCA1LCAxMCk7XHJcbiAgICAgICAgY2FtZXJhLmxvb2tBdCgwLCAwLCAwKTtcclxuICAgICAgICAvL2NhbWVyYS5zZXRFdWxlckFuZ2xlcygtOTAsIDAsIDApO1xyXG4gICAgICAgIChjYW1lcmEuYWRkQ29tcG9uZW50KCdzY3JpcHQnKSBhcyBwYy5TY3JpcHRDb21wb25lbnQpLmNyZWF0ZSgnY2FtZXJhRm9sbG93Jyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgbGlnaHQgPSBuZXcgcGMuRW50aXR5KCdsaWdodCcpO1xyXG4gICAgICAgIGxpZ2h0LmFkZENvbXBvbmVudCgnbGlnaHQnKTtcclxuICAgICAgICBhcHAucm9vdC5hZGRDaGlsZChsaWdodCk7XHJcbiAgICAgICAgbGlnaHQuc2V0RXVsZXJBbmdsZXMoMzAsIDAsIDApO1xyXG5cclxuICAgICAgICBHYW1lQ2xpZW50LmNhbWVyYSA9IGNhbWVyYTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyKCkge1xyXG4gICAgICAgIGlmKCF0aGlzLm1haW5TZXJ2ZXIpIHJldHVybjtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCB3b3JsZCA9IHRoaXMubWFpblNlcnZlci53b3JsZHNbMF07XHJcblxyXG4gICAgICAgIHdvcmxkLmVudGl0aWVzLm1hcChlbnRpdHkgPT4ge1xyXG4gICAgICAgICAgICBpZighZW50aXR5LnBjRW50aXR5KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGhhbGZFeHRlbnRzID0gbmV3IENBTk5PTi5WZWMzKDAuMSwgMC4xLCAwLjEpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJhZGl1cyA9IDE7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm94ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoZW50aXR5LmJvZHkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzaGFwZSA9IGVudGl0eS5ib2R5IS5zaGFwZXNbMF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNoYXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHNoYXBlIGluc3RhbmNlb2YgQ0FOTk9OLkJveCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFsZkV4dGVudHMgPSBzaGFwZS5oYWxmRXh0ZW50cztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHNoYXBlIGluc3RhbmNlb2YgQ0FOTk9OLlNwaGVyZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmFkaXVzID0gc2hhcGUucmFkaXVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGMgPSBlbnRpdHkuZGF0YS5jb2xvcjtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBwYy5TdGFuZGFyZE1hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbC5kaWZmdXNlID0gbmV3IHBjLkNvbG9yKGNbMF0sIGNbMV0sIGNbMl0pO1xyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwudXBkYXRlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZW50aXR5LnBjRW50aXR5ID0gbmV3IHBjLkVudGl0eSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGJveCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBlbnRpdHkucGNFbnRpdHkuYWRkQ29tcG9uZW50KFwicmVuZGVyXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWw6IG1hdGVyaWFsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImJveFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5LnBjRW50aXR5LnNldExvY2FsU2NhbGUobmV3IHBjLlZlYzMoaGFsZkV4dGVudHMueCAqIDIsIGhhbGZFeHRlbnRzLnogKiAyLCBoYWxmRXh0ZW50cy55ICogMikpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eS5wY0VudGl0eS5hZGRDb21wb25lbnQoXCJyZW5kZXJcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbDogbWF0ZXJpYWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic3BoZXJlXCJcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBlbnRpdHkucGNFbnRpdHkuc2V0TG9jYWxTY2FsZShuZXcgcGMuVmVjMyhyYWRpdXMgKiAyLCByYWRpdXMgKiAyLCByYWRpdXMgKiAyKSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC5yb290LmFkZENoaWxkKGVudGl0eS5wY0VudGl0eSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ5YWVzXCIpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBvcyA9IGVudGl0eS5wb3NpdGlvbjtcclxuICAgICAgICAgICAgY29uc3QgYW5nbGUgPSBuZXcgQ0FOTk9OLlZlYzMoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGVudGl0eS5ib2R5Py5xdWF0ZXJuaW9uLnRvRXVsZXIoYW5nbGUpO1xyXG5cclxuICAgICAgICAgICAgZW50aXR5LnBjRW50aXR5LnNldFBvc2l0aW9uKHBvcy54LCBwb3MueiwgcG9zLnkpO1xyXG4gICAgICAgICAgICBlbnRpdHkucGNFbnRpdHkuc2V0RXVsZXJBbmdsZXMoXHJcbiAgICAgICAgICAgICAgICBhbmdsZS54ICogLXBjLm1hdGguUkFEX1RPX0RFRyxcclxuICAgICAgICAgICAgICAgIGFuZ2xlLnogKiAtcGMubWF0aC5SQURfVE9fREVHLFxyXG4gICAgICAgICAgICAgICAgYW5nbGUueSAqIC1wYy5tYXRoLlJBRF9UT19ERUdcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAvL2VudGl0eS5wY0VudGl0eS5zZXRFdWxlckFuZ2xlcyhhbmdsZS54LCBhbmdsZS56LCBhbmdsZS55KTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBpZihHYW1lQ2xpZW50LnBsYXllcikge1xyXG4gICAgICAgICAgICBHYW1lQ2xpZW50LmNhbWVyYS5zZXRQb3NpdGlvbihHYW1lQ2xpZW50LnBsYXllci5wb3NpdGlvbi54LCBHYW1lQ2xpZW50LnBsYXllci5wb3NpdGlvbi56ICsgMTAsIEdhbWVDbGllbnQucGxheWVyLnBvc2l0aW9uLnkpXHJcbiAgICAgICAgICAgIEdhbWVDbGllbnQuY2FtZXJhLnNldEV1bGVyQW5nbGVzKC05MCwgMCwgMClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpY1xyXG59IiwiaW1wb3J0IHsgR2FtZUNsaWVudCB9IGZyb20gXCIuL2dhbWUvZ2FtZUNsaWVudFwiO1xyXG5cclxuY29uc3QgZ2FtZSA9IG5ldyBHYW1lQ2xpZW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lJykpO1xyXG5nYW1lLnN0YXJ0KCk7XHJcbndpbmRvd1snZ2FtZSddID0gZ2FtZTtcclxud2luZG93WydHYW1lQ2xpZW50J10gPSBHYW1lQ2xpZW50O1xyXG5cclxuZ2FtZS5jcmVhdGVTZXJ2ZXIoJ3NlcnZlcjEnKTtcclxuLy9HYW1lQ2xpZW50LnBsYXllciA9IGdhbWUubWFpblNlcnZlci53b3JsZHNbMF0uc3Bhd25QbGF5ZXIoKSIsImltcG9ydCB7IGlvLCBTb2NrZXQgfSBmcm9tIFwic29ja2V0LmlvLWNsaWVudFwiO1xyXG5pbXBvcnQgeyBHYW1lQ2xpZW50IH0gZnJvbSBcIi4uL2dhbWUvZ2FtZUNsaWVudFwiO1xyXG5pbXBvcnQgeyBJUGFja2V0LCBJUGFja2V0RGF0YV9Db25uZWN0VG9TZXJ2ZXJTdGF0dXMsIElQYWNrZXREYXRhX0VudGl0eURhdGEsIFBhY2tldFR5cGUgfSBmcm9tIFwiLi4vcGFja2V0L3BhY2tldFwiO1xyXG5pbXBvcnQgeyBXb3JsZFN5bmNIZWxwZXIgfSBmcm9tIFwiLi4vd29ybGQvd29ybGRTeW5jSGVscGVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTmV0d29yayB7XHJcbiAgICBwcml2YXRlIF9nYW1lOiBHYW1lQ2xpZW50O1xyXG4gICAgcHJpdmF0ZSBfc29ja2V0OiBTb2NrZXQ7XHJcblxyXG4gICAgcHVibGljIGdldCBnYW1lKCkgeyByZXR1cm4gdGhpcy5fZ2FtZTsgfVxyXG4gICAgcHVibGljIGdldCBzb2NrZXQoKSB7IHJldHVybiB0aGlzLl9zb2NrZXQ7IH1cclxuICAgIHB1YmxpYyBnZXQgY29ubmVjdGVkKCkgeyByZXR1cm4gdGhpcy5fc29ja2V0LmNvbm5lY3RlZDsgfVxyXG5cclxuICAgIHByaXZhdGUgX3NlbmRQYWNrZXRzRGVsYXk6IG51bWJlciA9IDUwO1xyXG4gICAgcHJpdmF0ZSBfc2VuZFRpbWU6IG51bWJlciA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZUNsaWVudCkge1xyXG4gICAgICAgIHRoaXMuX2dhbWUgPSBnYW1lO1xyXG5cclxuICAgICAgICAvL2h0dHBzOi8vZG1kYXNzYy1nYW1lLmdsaXRjaC5tZS9cclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBhZGRyZXNzID0gYCR7bG9jYXRpb24ucHJvdG9jb2x9Ly8ke2xvY2F0aW9uLmhvc3R9YDtcclxuICAgICAgICB0aGlzLl9zb2NrZXQgPSBpbyhhZGRyZXNzLCB7XHJcbiAgICAgICAgICAgIC8vcGF0aDogJy9zb2NrZXQnLFxyXG4gICAgICAgICAgICBhdXRvQ29ubmVjdDogZmFsc2UsXHJcbiAgICAgICAgICAgIHJlY29ubmVjdGlvbjogZmFsc2VcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdwYWNrZXQnLCBwYWNrZXQgPT4gdGhpcy5vblJlY2VpdmVQYWNrZXQocGFja2V0KSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2coYFtOZXR3b3JrXSBBZGRyZXNzOiAoJHthZGRyZXNzfSlgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29ubmVjdChjYWxsYmFjaz86ICgpID0+IHZvaWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgW05ldHdvcmtdIENvbm5lY3RpbmcuLi5gKTtcclxuXHJcbiAgICAgICAgdGhpcy5fc29ja2V0LmNvbm5lY3QoKTtcclxuICAgICAgICB0aGlzLl9zb2NrZXQub25jZSgnY29ubmVjdCcsICgpID0+IHtcclxuICAgICAgICAgICAgY2FsbGJhY2s/LigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3NlbmRUaW1lICs9IGR0O1xyXG5cclxuICAgICAgICBjb25zdCBlbnRpdHkgPSBHYW1lQ2xpZW50LnBsYXllcjtcclxuXHJcbiAgICAgICAgaWYoIWVudGl0eSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZih0aGlzLl9zZW5kVGltZSA8PSB0aGlzLl9zZW5kUGFja2V0c0RlbGF5LzEwMDApIHJldHVybjtcclxuICAgICAgICB0aGlzLl9zZW5kVGltZSA9IDA7XHJcblxyXG4gICAgICAgIGNvbnN0IHBhY2tldERhdGE6IElQYWNrZXREYXRhX0VudGl0eURhdGEgPSB7XHJcbiAgICAgICAgICAgIGVudGl0eUlkOiBlbnRpdHkuaWQsXHJcbiAgICAgICAgICAgIGVudGl0eVR5cGU6IGVudGl0eS5jb25zdHJ1Y3Rvci5uYW1lLFxyXG4gICAgICAgICAgICBkYXRhOiBlbnRpdHkudG9KU09OKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2VuZChQYWNrZXRUeXBlLkVOVElUWV9EQVRBLCBwYWNrZXREYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VuZCh0eXBlOiBQYWNrZXRUeXBlLCBkYXRhPzogYW55KSB7XHJcbiAgICAgICAgY29uc3QgcGFja2V0OiBJUGFja2V0ID0ge1xyXG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc29ja2V0LmVtaXQoJ3BhY2tldCcsIHBhY2tldCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBvblJlY2VpdmVQYWNrZXQocGFja2V0OiBJUGFja2V0KSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhwYWNrZXQpXHJcblxyXG4gICAgICAgIGlmKHBhY2tldC50eXBlID09IFBhY2tldFR5cGUuQ09OTkVDVF9UT19TRVJWRVJfU1RBVFVTKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGE6IElQYWNrZXREYXRhX0Nvbm5lY3RUb1NlcnZlclN0YXR1cyA9IHBhY2tldC5kYXRhO1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICBHYW1lQ2xpZW50LnBsYXllcklkID0gZGF0YS5lbnRpdHlJZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHBhY2tldC50eXBlID09IFBhY2tldFR5cGUuRU5USVRZX0RBVEEpIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YTogSVBhY2tldERhdGFfRW50aXR5RGF0YSA9IHBhY2tldC5kYXRhO1xyXG5cclxuICAgICAgICAgICAgV29ybGRTeW5jSGVscGVyLm9uUmVjZWl2ZUVudGl0eURhdGEoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICBwcml2YXRlIG9uUmVjZWl2ZVBhY2tldChwYWNrZXQ6IElQYWNrZXQpIHtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgICovXHJcbn0iLCJleHBvcnQgZW51bSBQYWNrZXRUeXBlIHtcclxuICAgIFJFUVVFU1RfU0VSVkVSX0xJU1QsXHJcbiAgICBTRVJWRVJfTElTVCxcclxuICAgIENPTk5FQ1RfVE9fU0VSVkVSLFxyXG4gICAgQ09OTkVDVF9UT19TRVJWRVJfU1RBVFVTLFxyXG4gICAgRU5USVRZX0RBVEFcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUGFja2V0IHtcclxuICAgIHR5cGU6IFBhY2tldFR5cGVcclxuICAgIGRhdGE/OiBhbnlcclxufVxyXG5cclxuLypcclxuZXhwb3J0IGludGVyZmFjZSBJUGFja2V0RGF0YV9TZXJ2ZXJMaXN0IHtcclxuICAgIHNlcnZlcnM6IFNlcnZlckluZm9bXVxyXG59XHJcbiovXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQYWNrZXREYXRhX0Nvbm5lY3RUb1NlcnZlciB7XHJcbiAgICBpZDogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhY2tldERhdGFfSWQge1xyXG4gICAgaWQ6IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQYWNrZXREYXRhX0Nvbm5lY3RUb1NlcnZlclN0YXR1cyB7XHJcbiAgICBzZXJ2ZXJJZDogc3RyaW5nXHJcbiAgICBlbnRpdHlJZDogc3RyaW5nXHJcbiAgICBzdWNjZXNzOiBib29sZWFuXHJcbiAgICBlcnJvck1lc3NhZ2U/OiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUGFja2V0RGF0YV9FbnRpdHlEYXRhIHtcclxuICAgIGVudGl0eUlkOiBzdHJpbmdcclxuICAgIGVudGl0eVR5cGU6IHN0cmluZ1xyXG4gICAgZGF0YTogYW55XHJcbn0iLCJpbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwiLi4vZW50aXR5L2VudGl0eVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVudGl0eUZhY3Rvcnkge1xyXG4gICAgcHJpdmF0ZSBfcmVnaXN0ZXJlZEVudGl0aWVzID0gbmV3IE1hcDxzdHJpbmcsIHR5cGVvZiBFbnRpdHk+KCk7XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVyRW50aXR5KG5hbWU6IHN0cmluZywgZTogdHlwZW9mIEVudGl0eSkge1xyXG4gICAgICAgIHRoaXMuX3JlZ2lzdGVyZWRFbnRpdGllcy5zZXQobmFtZSwgZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEVudGl0eShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBlID0gdGhpcy5fcmVnaXN0ZXJlZEVudGl0aWVzLmdldChuYW1lKTtcclxuICAgICAgICBpZighZSkgdGhyb3cgYEVudGl0eSB0eXBlICcke25hbWV9JyBpcyBpbnZhbGlkYDtcclxuICAgICAgICByZXR1cm4gZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEVudGl0eSB9IGZyb20gXCIuLi9lbnRpdHkvZW50aXR5XCI7XHJcbmltcG9ydCB7IEVudGl0eU9iamVjdCB9IGZyb20gXCIuLi9lbnRpdHkvZW50aXR5T2JqZWN0XCI7XHJcbmltcG9ydCB7IEVudGl0eVBsYXllciB9IGZyb20gXCIuLi9lbnRpdHkvZW50aXR5UGxheWVyXCI7XHJcbmltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi4vZ2FtZS9nYW1lXCI7XHJcbmltcG9ydCB7IFdvcmxkIH0gZnJvbSBcIi4uL3dvcmxkL3dvcmxkXCI7XHJcbmltcG9ydCB7IEVudGl0eUZhY3RvcnkgfSBmcm9tIFwiLi9lbnRpdHlGYWN0b3J5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2VydmVyIHtcclxuICAgIHByaXZhdGUgX2dhbWU6IEdhbWU7XHJcbiAgICBwcml2YXRlIF93b3JsZHMgPSBuZXcgTWFwPHN0cmluZywgV29ybGQ+KCk7XHJcbiAgICBwcml2YXRlIF9lbnRpdHlGYWN0b3J5OiBFbnRpdHlGYWN0b3J5O1xyXG5cclxuICAgIHB1YmxpYyBnZXQgd29ybGRzKCkgeyByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl93b3JsZHMudmFsdWVzKCkpOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGdhbWUoKSB7IHJldHVybiB0aGlzLl9nYW1lOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGVudGl0eUZhY3RvcnkoKSB7IHJldHVybiB0aGlzLl9lbnRpdHlGYWN0b3J5OyB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZSkge1xyXG4gICAgICAgIHRoaXMuX2dhbWUgPSBnYW1lO1xyXG4gICAgICAgIHRoaXMuX2VudGl0eUZhY3RvcnkgPSBuZXcgRW50aXR5RmFjdG9yeSgpO1xyXG5cclxuICAgICAgICB0aGlzLmVudGl0eUZhY3RvcnkucmVnaXN0ZXJFbnRpdHkoJ0VudGl0eVBsYXllcicsIEVudGl0eVBsYXllcik7XHJcbiAgICAgICAgdGhpcy5lbnRpdHlGYWN0b3J5LnJlZ2lzdGVyRW50aXR5KCdFbnRpdHlPYmplY3QnLCBFbnRpdHlPYmplY3QpO1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZVdvcmxkKCd3b3JsZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMud29ybGRzLm1hcCh3b3JsZCA9PiB3b3JsZC51cGRhdGUoZHQpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlV29ybGQobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgd29ybGQgPSBuZXcgV29ybGQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5fd29ybGRzLnNldChuYW1lLCB3b3JsZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQ0FOTk9OIGZyb20gJ2Nhbm5vbidcclxuaW1wb3J0ICogYXMgcGMgZnJvbSAncGxheWNhbnZhcyc7XHJcbmltcG9ydCB7IEVudGl0eSB9IGZyb20gJy4uL2VudGl0eS9lbnRpdHknO1xyXG5pbXBvcnQgeyBFbnRpdHlPYmplY3QsIElFbnRpdHlPYmplY3RDdXN0b21EYXRhLCBJRW50aXR5T2JqZWN0U2hhcGUgfSBmcm9tICcuLi9lbnRpdHkvZW50aXR5T2JqZWN0JztcclxuaW1wb3J0IHsgRW50aXR5UGxheWVyIH0gZnJvbSAnLi4vZW50aXR5L2VudGl0eVBsYXllcic7XHJcbmltcG9ydCB7IFNlcnZlciB9IGZyb20gXCIuLi9zZXJ2ZXIvc2VydmVyXCI7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JsZCB7XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VydmVyOiBTZXJ2ZXI7XHJcbiAgICBwcml2YXRlIF9keW5hbWljV29ybGQ6IENBTk5PTi5Xb3JsZDtcclxuICAgIHByaXZhdGUgX2VudGl0aWVzID0gbmV3IE1hcDxzdHJpbmcsIEVudGl0eT4oKTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNlcnZlcigpIHsgcmV0dXJuIHRoaXMuX3NlcnZlciB9O1xyXG4gICAgcHVibGljIGdldCBkeW5hbWljV29ybGQoKSB7IHJldHVybiB0aGlzLl9keW5hbWljV29ybGQgfTtcclxuICAgIHB1YmxpYyBnZXQgZW50aXRpZXMoKSB7IHJldHVybiBBcnJheS5mcm9tKHRoaXMuX2VudGl0aWVzLnZhbHVlcygpKSB9O1xyXG5cclxuICAgIHB1YmxpYyBfbWF0ZXJpYWxfZ3JvdW5kOiBDQU5OT04uTWF0ZXJpYWw7XHJcbiAgICBwdWJsaWMgX21hdGVyaWFsX3Rlc3Q6IENBTk5PTi5NYXRlcmlhbDtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3Ioc2VydmVyOiBTZXJ2ZXIpIHtcclxuICAgICAgICB0aGlzLl9zZXJ2ZXIgPSBzZXJ2ZXI7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBEeW5hbWljV29ybGQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgZml4ZWRUaW1lU3RlcCA9IDEuMCAvIDYwLjA7IC8vIHNlY29uZHNcclxuICAgICAgICB2YXIgbWF4U3ViU3RlcHMgPSAzO1xyXG5cclxuICAgICAgICB0aGlzLmVudGl0aWVzLm1hcChlbnRpdHkgPT4gZW50aXR5LnVwZGF0ZShkdCkpO1xyXG4gICAgICAgIHRoaXMuZHluYW1pY1dvcmxkLnN0ZXAoZml4ZWRUaW1lU3RlcCwgZHQsIG1heFN1YlN0ZXBzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RW50aXR5KGlkOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZW50aXRpZXMuZ2V0KGlkKSE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhhc0VudGl0eShpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VudGl0aWVzLmhhcyhpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXR1cER5bmFtaWNXb3JsZCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnc2V0dXBEeW5hbWljV29ybGQnKVxyXG5cclxuICAgICAgICAvLyBTZXR1cCBvdXIgd29ybGRcclxuICAgICAgICB2YXIgd29ybGQgPSB0aGlzLl9keW5hbWljV29ybGQgPSBuZXcgQ0FOTk9OLldvcmxkKCk7XHJcbiAgICAgICAgd29ybGQuZ3Jhdml0eSA9IG5ldyBDQU5OT04uVmVjMygwLCAwLCAtOS44MikgLy8gbS9zwrJcclxuICAgICAgICBcclxuICAgICAgICAvL21hdDFcclxuICAgICAgICBjb25zdCBncm91bmRNYXRlcmlhbCA9IG5ldyBDQU5OT04uTWF0ZXJpYWwoXCJncm91bmRNYXRlcmlhbFwiKTtcclxuICAgICAgICBjb25zdCBncm91bmRfZ3JvdW5kX2NtID0gbmV3IENBTk5PTi5Db250YWN0TWF0ZXJpYWwoZ3JvdW5kTWF0ZXJpYWwsIGdyb3VuZE1hdGVyaWFsLCB7XHJcbiAgICAgICAgICAgIGZyaWN0aW9uOiAwLjQsXHJcbiAgICAgICAgICAgIHJlc3RpdHV0aW9uOiAwLjMsXHJcbiAgICAgICAgICAgIGNvbnRhY3RFcXVhdGlvblN0aWZmbmVzczogMWU4LFxyXG4gICAgICAgICAgICBjb250YWN0RXF1YXRpb25SZWxheGF0aW9uOiAzLFxyXG4gICAgICAgICAgICBmcmljdGlvbkVxdWF0aW9uU3RpZmZuZXNzOiAxZThcclxuICAgICAgICB9KTtcclxuICAgICAgICB3b3JsZC5hZGRDb250YWN0TWF0ZXJpYWwoZ3JvdW5kX2dyb3VuZF9jbSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNsaXBwZXJ5TWF0ZXJpYWwgPSBuZXcgQ0FOTk9OLk1hdGVyaWFsKFwic2xpcHBlcnlNYXRlcmlhbFwiKTtcclxuICAgICAgICBjb25zdCBzbGlwcGVyeV9ncm91bmRfY20gPSBuZXcgQ0FOTk9OLkNvbnRhY3RNYXRlcmlhbChncm91bmRNYXRlcmlhbCwgc2xpcHBlcnlNYXRlcmlhbCwge1xyXG4gICAgICAgICAgICBmcmljdGlvbjogMC4wMDMsXHJcbiAgICAgICAgICAgIHJlc3RpdHV0aW9uOiAwLFxyXG4gICAgICAgICAgICBjb250YWN0RXF1YXRpb25TdGlmZm5lc3M6IDFlOCxcclxuICAgICAgICAgICAgY29udGFjdEVxdWF0aW9uUmVsYXhhdGlvbjogM1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHdvcmxkLmFkZENvbnRhY3RNYXRlcmlhbChzbGlwcGVyeV9ncm91bmRfY20pO1xyXG5cclxuICAgICAgICB0aGlzLl9tYXRlcmlhbF9ncm91bmQgPSBncm91bmRNYXRlcmlhbDtcclxuICAgICAgICB0aGlzLl9tYXRlcmlhbF90ZXN0ID0gc2xpcHBlcnlNYXRlcmlhbDtcclxuXHJcblxyXG4gICAgICAgIGNvbnN0IHNsaXBwZXJ5X2dyb3VuZF9jbTIgPSBuZXcgQ0FOTk9OLkNvbnRhY3RNYXRlcmlhbChzbGlwcGVyeU1hdGVyaWFsLCBzbGlwcGVyeU1hdGVyaWFsLCB7XHJcbiAgICAgICAgICAgIGZyaWN0aW9uOiAwLjAwMCxcclxuICAgICAgICAgICAgcmVzdGl0dXRpb246IDAsXHJcbiAgICAgICAgICAgIGNvbnRhY3RFcXVhdGlvblN0aWZmbmVzczogMWU4LFxyXG4gICAgICAgICAgICBjb250YWN0RXF1YXRpb25SZWxheGF0aW9uOiAzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgd29ybGQuYWRkQ29udGFjdE1hdGVyaWFsKHNsaXBwZXJ5X2dyb3VuZF9jbTIpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgY29uc3QgYnVpbGRpbmcgPSB0aGlzLnNwYXduUmVjdGFuZ2xlT2JqZWN0KFxyXG4gICAgICAgICAgICBuZXcgQ0FOTk9OLlZlYzMoNSwgMywgMiksXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGJvZHk6IG5ldyBDQU5OT04uQm9keSh7bWFzczogMCwgbWF0ZXJpYWw6IHRoaXMuX21hdGVyaWFsX2dyb3VuZCwgc2hhcGU6IG5ldyBDQU5OT04uQm94KG5ldyBDQU5OT04uVmVjMygyLCAyLCA2KSl9KSxcclxuICAgICAgICAgICAgICAgIGNvbG9yOiBuZXcgcGMuQ29sb3IoMC41LCAwLjcsIDApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgICAgICovXHJcbiAgICAgICAgXHJcblxyXG5cclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBncm91bmRCb2R5T3B0aW9uczogQ0FOTk9OLklCb2R5T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgbWFzczogMCxcclxuICAgICAgICAgICAgbWF0ZXJpYWw6IHRoaXMuX21hdGVyaWFsX2dyb3VuZFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGdyb3VuZCA9IHRoaXMuc3Bhd25SZWN0YW5nbGVPYmplY3QobmV3IENBTk5PTi5WZWMzKDAsIDAsIDApLCBuZXcgQ0FOTk9OLlZlYzMoMzAsIDMwLCAxKSwgZ3JvdW5kQm9keU9wdGlvbnMsIG5ldyBwYy5Db2xvcigxLCAxLCAxKSk7XHJcbiAgICAgICAgZ3JvdW5kLmRvbnRTeW5jID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgY29uc3QgYnVpbGRpbmcxID0gdGhpcy5zcGF3blJlY3RhbmdsZU9iamVjdChuZXcgQ0FOTk9OLlZlYzMoLTUsIDAsIDIpLCBuZXcgQ0FOTk9OLlZlYzMoMiwgNCwgMiksIGdyb3VuZEJvZHlPcHRpb25zLCBuZXcgcGMuQ29sb3IoMSwgMCwgMCkpO1xyXG4gICAgICAgIGJ1aWxkaW5nMS5kb250U3luYyA9IHRydWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3Qgc3RhaXJzID0gdGhpcy5zcGF3blJlY3RhbmdsZU9iamVjdChuZXcgQ0FOTk9OLlZlYzMoLTMsIDIsIDEpLCBuZXcgQ0FOTk9OLlZlYzMoMSwgNSwgMSksIGdyb3VuZEJvZHlPcHRpb25zLG5ldyBwYy5Db2xvcigwLjUsIDAuNywgMCkpO1xyXG4gICAgICAgIHN0YWlycy5kb250U3luYyA9IHRydWU7XHJcbiAgICAgICAgc3RhaXJzLnF1YXRlcm5pb24uc2V0RnJvbUV1bGVyKC0zNSwgMCwgMCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGJ1aWxkaW5nMiA9IHRoaXMuc3Bhd25SZWN0YW5nbGVPYmplY3QobmV3IENBTk5PTi5WZWMzKDUsIDMsIDIpLCBuZXcgQ0FOTk9OLlZlYzMoMiwgMiwgNiksIGdyb3VuZEJvZHlPcHRpb25zLCBuZXcgcGMuQ29sb3IoMC41LCAwLjcsIDApKTtcclxuICAgICAgICBidWlsZGluZzIuZG9udFN5bmMgPSB0cnVlO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBpZih0aGlzLnNlcnZlci5nYW1lLmlzU2VydmVyKSB7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2JqID0gdGhpcy5zcGF3bkN1c3RvbU9iamVjdChcclxuICAgICAgICAgICAgICAgICAgICBuZXcgQ0FOTk9OLlZlYzMoMCwgMCwgMyksXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFwZTogSUVudGl0eU9iamVjdFNoYXBlLlJFQ1RBTkdMRSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmFkaXVzOiAwLjIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbGZFeHRlbnRzOiB7eDogMC4zLCB5OiAwLjMsIHo6IDAuM30sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHlPcHRpb25zOiB7bWFzczogMTAwfSxcclxuICAgICAgICAgICAgICAgICAgICB9ICAgIFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgIFxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYm90ID0gdGhpcy5zcGF3blBsYXllcigpO1xyXG4gICAgICAgICAgICAgICAgYm90LnNldENvbG9yKG5ldyBwYy5Db2xvcigwLCAwLCAxKSlcclxuICAgICAgICAgICAgICAgIGJvdC5zdGFydEJvdEJlaGF2aW91cigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG5cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICBpZih0aGlzLnNlcnZlci5nYW1lLmlzU2VydmVyKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zcGF3blBsYXllcigpLnN0YXJ0Qm90QmVoYXZpb3VyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgICovXHJcblxyXG4gICAgICAgIC8vY29uc3QgYm94ID0gdGhpcy5zcGF3blRlc3RFbnRpdHkobmV3IENBTk5PTi5WZWMzKDAsIDAsIDQpLCBuZXcgQ0FOTk9OLlZlYzMoMSwgMSwgMSksIHttYXNzOiAyMDB9KTtcclxuICAgICAgICAvL2NvbnN0IGJveDIgPSB0aGlzLnNwYXduVGVzdEVudGl0eShuZXcgQ0FOTk9OLlZlYzMoMCwgMSwgOCksIG5ldyBDQU5OT04uVmVjMygxLCAxLCAxKSwge21hc3M6IDIwMH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNldEludGVydmFsKCgpID0+IHtcclxuXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJib3QxOiBcIiArIHRoaXMucHJpbnRQb3NpdGlvbihib3QxLnBvc2l0aW9uKSk7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJib3g6IFwiICsgdGhpcy5wcmludFBvc2l0aW9uKGJveC5nZXRQb3NpdGlvbigpKSk7XHJcblxyXG4gICAgICAgIH0sIDI1MClcclxuXHJcbiAgICAgICAgLy9zZXRJbnRlcnZhbCgoKSA9PiB7IHRoaXMuc3Bhd25UZXN0RW50aXR5KCk7IH0sIDEwMDApXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNwYXduUmVjdGFuZ2xlT2JqZWN0KHBvc2l0aW9uOiBDQU5OT04uVmVjMywgaGFsZkV4dGVuZHM6IENBTk5PTi5WZWMzLCBib2R5T3B0aW9uczogQ0FOTk9OLklCb2R5T3B0aW9ucywgY29sb3I6IHBjLkNvbG9yKSB7XHJcbiAgICAgICAgY29uc3Qgb2JqRGF0YTogSUVudGl0eU9iamVjdEN1c3RvbURhdGEgPSB7XHJcbiAgICAgICAgICAgIHNoYXBlOiBJRW50aXR5T2JqZWN0U2hhcGUuUkVDVEFOR0xFLFxyXG4gICAgICAgICAgICBoYWxmRXh0ZW50czogaGFsZkV4dGVuZHMsXHJcbiAgICAgICAgICAgIGJvZHlPcHRpb25zOiBib2R5T3B0aW9ucyxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlY3QgPSB0aGlzLnNwYXduQ3VzdG9tT2JqZWN0KFxyXG4gICAgICAgICAgICBwb3NpdGlvbixcclxuICAgICAgICAgICAgb2JqRGF0YVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJlY3Quc2V0Q29sb3IoY29sb3IpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVjdDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3Bhd25QbGF5ZXIoKSB7XHJcbiAgICAgICAgY29uc3QgcGxheWVyID0gbmV3IEVudGl0eVBsYXllcih0aGlzKTtcclxuICAgICAgICBwbGF5ZXIucG9zaXRpb24uc2V0KDAsIDAsIDMpXHJcbiAgICAgICAgdGhpcy5hZGRFbnRpdHkocGxheWVyKTtcclxuICAgICAgICByZXR1cm4gcGxheWVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRFbnRpdHkoZW50aXR5OiBFbnRpdHkpIHtcclxuICAgICAgICB0aGlzLl9lbnRpdGllcy5zZXQoZW50aXR5LmlkLCBlbnRpdHkpO1xyXG4gICAgICAgIGVudGl0eS5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcblxyXG4gICAgcHVibGljIHNwYXduQ3VzdG9tT2JqZWN0KHBvc2l0aW9uOiBDQU5OT04uVmVjMywgb2JqZWN0RGF0YTogSUVudGl0eU9iamVjdEN1c3RvbURhdGEpIHtcclxuICAgICAgICBjb25zdCBvYmplY3QgPSBuZXcgRW50aXR5T2JqZWN0KHRoaXMpO1xyXG4gICAgICAgIG9iamVjdC5zZXRDdXN0b21EYXRhKG9iamVjdERhdGEpO1xyXG4gICAgICAgIG9iamVjdC5wb3NpdGlvbi5zZXQocG9zaXRpb24ueCwgcG9zaXRpb24ueSwgcG9zaXRpb24ueik7XHJcbiAgICAgICAgdGhpcy5hZGRFbnRpdHkob2JqZWN0KTtcclxuICAgICAgICByZXR1cm4gb2JqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcHJpbnRQb3NpdGlvbihwb3M6IENBTk5PTi5WZWMzKSB7XHJcbiAgICAgICAgcmV0dXJuIGAoJHtwb3MueH0sICR7cG9zLnl9LCAke3Bvcy56fSlgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZVJlY3RhbmdsZUJvZHkocG9zaXRpb246IENBTk5PTi5WZWMzLCBoYWxmRXh0ZW5kczogQ0FOTk9OLlZlYzMsIG9wdGlvbnM/OiBDQU5OT04uSUJvZHlPcHRpb25zKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3Qgb3B0ID0gb3B0aW9ucyB8fCB7fTtcclxuXHJcbiAgICAgICAgb3B0LnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICAgXHJcbiAgICAgICAgdmFyIHNoYXBlID0gbmV3IENBTk5PTi5Cb3goaGFsZkV4dGVuZHMpO1xyXG4gICAgICAgIHZhciBib2R5ID0gbmV3IENBTk5PTi5Cb2R5KG9wdCk7XHJcbiAgICAgICAgYm9keS5hZGRTaGFwZShzaGFwZSk7XHJcblxyXG4gICAgICAgIHRoaXMuZHluYW1pY1dvcmxkLmFkZEJvZHkoYm9keSk7XHJcblxyXG4gICAgICAgIHJldHVybiBib2R5OyBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlU3BoZXJlQm9keShwb3NpdGlvbjogQ0FOTk9OLlZlYzMsIHJhZGl1czogbnVtYmVyLCBvcHRpb25zPzogQ0FOTk9OLklCb2R5T3B0aW9ucykge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IG9wdCA9IG9wdGlvbnMgfHwge307XHJcblxyXG4gICAgICAgIG9wdC5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgIFxyXG4gICAgICAgIHZhciBzaGFwZSA9IG5ldyBDQU5OT04uU3BoZXJlKHJhZGl1cyk7XHJcbiAgICAgICAgdmFyIGJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkob3B0KTtcclxuICAgICAgICBib2R5LmFkZFNoYXBlKHNoYXBlKTtcclxuXHJcbiAgICAgICAgdGhpcy5keW5hbWljV29ybGQuYWRkQm9keShib2R5KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJvZHk7IFxyXG4gICAgfVxyXG59XHJcblxyXG4vKlxyXG5jb25zdCBlbnRpdHkgPSBuZXcgcGMuRW50aXR5KG5hbWUpO1xyXG5lbnRpdHkuc2V0UG9zaXRpb24ocG9zaXRpb24pXHJcbnRoaXMuY3JlYXRlUmVjdGFuZ2xlQXRFbnRpdHkoZW50aXR5LCBzaXplLCBpc0R5bmFtaWMsIGNvbG9yKTtcclxuYXBwLnJvb3QuYWRkQ2hpbGQoZW50aXR5KTtcclxuKi8iLCJpbXBvcnQgKiBhcyBwYyBmcm9tIFwicGxheWNhbnZhc1wiO1xyXG5pbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwiLi4vZW50aXR5L2VudGl0eVwiO1xyXG5pbXBvcnQgeyBFbnRpdHlQbGF5ZXIgfSBmcm9tIFwiLi4vZW50aXR5L2VudGl0eVBsYXllclwiO1xyXG5pbXBvcnQgeyBHYW1lQ2xpZW50IH0gZnJvbSBcIi4uL2dhbWUvZ2FtZUNsaWVudFwiO1xyXG5pbXBvcnQgeyBJUGFja2V0RGF0YV9FbnRpdHlEYXRhIH0gZnJvbSBcIi4uL3BhY2tldC9wYWNrZXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JsZFN5bmNIZWxwZXIge1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgZ2FtZSgpIHsgcmV0dXJuIEdhbWVDbGllbnQuSW5zdGFuY2U7IH07XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBvblJlY2VpdmVFbnRpdHlEYXRhKGRhdGE6IElQYWNrZXREYXRhX0VudGl0eURhdGEpIHtcclxuICAgICAgICBjb25zdCB3b3JsZCA9IHRoaXMuZ2FtZS5tYWluU2VydmVyLndvcmxkc1swXTtcclxuXHJcbiAgICAgICAgbGV0IGlzTmV3RW50aXR5OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBlbnRpdHk6IEVudGl0eSB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgaWYoIXdvcmxkLmhhc0VudGl0eShkYXRhLmVudGl0eUlkKSkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYyA9IHdvcmxkLnNlcnZlci5lbnRpdHlGYWN0b3J5LmdldEVudGl0eShkYXRhLmVudGl0eVR5cGUpO1xyXG5cclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBlbnRpdHkgPSBuZXcgYyh3b3JsZCk7XHJcbiAgICAgICAgICAgIGVudGl0eS5zZXRJZChkYXRhLmVudGl0eUlkKTtcclxuXHJcbiAgICAgICAgICAgLy8gXHJcbiAgICAgICAgICAgIGlzTmV3RW50aXR5ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCduZXcgZW50aXknKVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSwgYywgZW50aXR5KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIWVudGl0eSkgZW50aXR5ID0gd29ybGQuZ2V0RW50aXR5KGRhdGEuZW50aXR5SWQpO1xyXG5cclxuICAgICAgICBlbnRpdHkuZnJvbUpTT04oZGF0YS5kYXRhKTtcclxuXHJcbiAgICAgICAgaWYoaXNOZXdFbnRpdHkpIHtcclxuICAgICAgICAgICAgd29ybGQuYWRkRW50aXR5KGVudGl0eSk7XHJcbiAgICAgICAgICAgIGVudGl0eS5jYW5MZXJwID0gdHJ1ZTtcclxuICAgICAgICAgICAgLy9lbnRpdHkuc2NyaXB0IS5jcmVhdGUoJ2VudGl0eVN5bmMnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBpZihlbnRpdHkuaWQgPT0gR2FtZUNsaWVudC5wbGF5ZXJJZCkge1xyXG5cclxuICAgICAgICAgICAgaWYoIUdhbWVDbGllbnQucGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICBHYW1lQ2xpZW50LnBsYXllciA9IGVudGl0eSBhcyBFbnRpdHk7XHJcbiAgICAgICAgICAgICAgICBHYW1lQ2xpZW50LnBsYXllci5jYW5MZXJwID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAvL0dhbWVDbGllbnQucGxheWVyLnNldENvbnRyb2xsYWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgLy9HYW1lQ2xpZW50LmNhbWVyYUZvbGxvd0VudGl0eShlbnRpdHkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZHNbaV1dID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rZG1kYXNzY19nYW1lXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2RtZGFzc2NfZ2FtZVwiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbl9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnNcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIikpKVxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vd2VicGFjay9jcmVkaXRzLmpzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=