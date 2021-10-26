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
        this._quaternion = new cannon_1.default.Quaternion();
        this._targetPosition = new cannon_1.default.Vec3();
        this._targetQuaternion = new cannon_1.default.Quaternion();
        this._id = `${Math.random()}`;
        this._world = world;
        this.setColor(pc.Color.WHITE);
    }
    get id() { return this._id; }
    get body() { return this._body; }
    get position() { return this._position; }
    get quaternion() { return this._quaternion; }
    get velocity() {
        if (this._body)
            return this._body.velocity;
        return cannon_1.default.Vec3.ZERO;
    }
    get angularVelocity() {
        if (this._body)
            return this._body.angularVelocity;
        return cannon_1.default.Vec3.ZERO;
    }
    setColor(color) {
        this.data.color = [color.r, color.g, color.b];
    }
    setBody(body) {
        this._body = body;
        this._position = body.position;
        this._quaternion = body.quaternion;
    }
    setId(id) {
        this._id = id;
    }
    update(dt) {
        var _a, _b, _c;
        const speed = 700;
        const force = new cannon_1.default.Vec3(speed * this.input.horizontal, speed * this.input.vertical, 0);
        (_a = this.body) === null || _a === void 0 ? void 0 : _a.applyForce(force, this.position);
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
        if (this.canLerp) {
            const quaternion = this.quaternion;
            //const qfrom = new Phaser.Math.Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
            //const qto = new Phaser.Math.Quaternion(this._targetQuaternion.x, this._targetQuaternion.y, this._targetQuaternion.z, this._targetQuaternion.w);
            //const result = qfrom.lerp(qto, 0.1);           
            //this.quaternion.set(result.x, result.y, result.z, result.w)
        }
        if (this.position.distanceTo(cannon_1.default.Vec3.ZERO) > 20) {
            this.position.set(0, 0, 2);
            (_b = this.body) === null || _b === void 0 ? void 0 : _b.velocity.setZero();
            (_c = this.body) === null || _c === void 0 ? void 0 : _c.angularVelocity.setZero();
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
                this.position.set(entityData.pos[0], entityData.pos[1], entityData.pos[2]);
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
            else {
                //this.quaternion.set(entityData.rot[0], entityData.rot[1], entityData.rot[2], entityData.rot[3]);
            }
        }
        if (entityData.input) {
            this.input.horizontal = entityData.input[0];
            this.input.vertical = entityData.input[1];
        }
        if (entityData.data) {
            this.data = entityData.data;
        }
    }
}
exports.Entity = Entity;


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
                const shape = entity.body.shapes[0];
                const c = entity.data.color;
                const material = new pc.StandardMaterial();
                material.diffuse = new pc.Color(c[0], c[1], c[2]);
                material.update();
                entity.pcEntity = new pc.Entity();
                entity.pcEntity.addComponent("render", {
                    material: material,
                    type: "box"
                });
                entity.pcEntity.setLocalScale(new pc.Vec3(shape.halfExtents.x * 2, shape.halfExtents.z * 2, shape.halfExtents.y * 2));
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
        this._sendPacketsDelay = 200;
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

/***/ "./src/server/server.ts":
/*!******************************!*\
  !*** ./src/server/server.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Server = void 0;
const world_1 = __webpack_require__(/*! ../world/world */ "./src/world/world.ts");
class Server {
    constructor(game) {
        this._worlds = new Map();
        this._game = game;
        this.createWorld('world');
    }
    get worlds() { return Array.from(this._worlds.values()); }
    get game() { return this._game; }
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
const entity_1 = __webpack_require__(/*! ../entity/entity */ "./src/entity/entity.ts");
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
        // Setup our world
        var world = this._dynamicWorld = new cannon_1.default.World();
        world.gravity = new cannon_1.default.Vec3(0, 0, -9.82); // m/s²
        const ground = this.spawnEntity(new cannon_1.default.Vec3(0, 0, 0), new cannon_1.default.Vec3(30, 30, 1), { mass: 0 });
        ground.dontSync = true;
        //const box = this.spawnTestEntity(new CANNON.Vec3(0, 0, 4), new CANNON.Vec3(1, 1, 1), {mass: 200});
        //const box2 = this.spawnTestEntity(new CANNON.Vec3(0, 1, 8), new CANNON.Vec3(1, 1, 1), {mass: 200});
        setInterval(() => {
            //console.log("ground: " + this.printPosition(ground.getPosition()));
            //console.log("box: " + this.printPosition(box.getPosition()));
        }, 250);
        //setInterval(() => { this.spawnTestEntity(); }, 1000)
    }
    spawnEntity(position, halfExtends, options, color, customId) {
        options = options || { mass: 50 };
        color = color || new pc.Color(1, 1, 1);
        const body = this.createRectangleBody(position || new cannon_1.default.Vec3(Math.random() * 6 - 3, Math.random() * 6 - 3, 3), halfExtends || new cannon_1.default.Vec3(0.2, 0.2, 0.2), options);
        const entity = new entity_1.Entity(this);
        entity.data.color = [color.r, color.g, color.b];
        entity.setBody(body);
        if (customId)
            entity.setId(customId);
        this._entities.set(entity.id, entity);
        return entity;
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
exports.WorldSyncHelper = void 0;
const pc = __importStar(__webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs"));
const gameClient_1 = __webpack_require__(/*! ../game/gameClient */ "./src/game/gameClient.ts");
class WorldSyncHelper {
    static get game() { return gameClient_1.GameClient.Instance; }
    ;
    static onReceiveEntityData(data) {
        const world = this.game.mainServer.worlds[0];
        let isNewEntity = false;
        if (!world.hasEntity(data.entityId)) {
            world.spawnEntity(undefined, undefined, undefined, new pc.Color(1, 0, 0), data.entityId);
            isNewEntity = true;
            console.log('new entiy');
        }
        const entity = world.getEntity(data.entityId);
        entity.fromJSON(data.data);
        if (isNewEntity) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvZW50aXR5L2VudGl0eS50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvZ2FtZS9nYW1lLnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9nYW1lL2dhbWVDbGllbnQudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9uZXR3b3JrL25ldHdvcmsudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL3BhY2tldC9wYWNrZXQudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL3NlcnZlci9zZXJ2ZXIudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL3dvcmxkL3dvcmxkLnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy93b3JsZC93b3JsZFN5bmNIZWxwZXIudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYyBmcm9tICdwbGF5Y2FudmFzJztcclxuaW1wb3J0IFBoYXNlciBmcm9tICdwaGFzZXInO1xyXG5pbXBvcnQgQ0FOTk9OIGZyb20gJ2Nhbm5vbic7XHJcbmltcG9ydCB7IFdvcmxkIH0gZnJvbSBcIi4uL3dvcmxkL3dvcmxkXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElFbnRpdHlEYXRhIHtcclxuICAgIHBvcz86IG51bWJlcltdXHJcbiAgICB2ZWw/OiBudW1iZXJbXVxyXG4gICAgcm90PzogbnVtYmVyW11cclxuICAgIGFWZWw/OiBudW1iZXJbXVxyXG4gICAgaW5wdXQ/OiBudW1iZXJbXVxyXG4gICAgZGF0YT86IGFueVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRW50aXR5IHtcclxuICAgIHB1YmxpYyBwY0VudGl0eT86IHBjLkVudGl0eTtcclxuXHJcbiAgICBwdWJsaWMgZG9udFN5bmM6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBjYW5MZXJwOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgcHVibGljIGRhdGE6IGFueSA9IHt9O1xyXG4gICAgcHVibGljIGlucHV0ID0ge2hvcml6b250YWw6IDAsIHZlcnRpY2FsOiAwfVxyXG5cclxuICAgIHByaXZhdGUgX3Bvc2l0aW9uID0gbmV3IENBTk5PTi5WZWMzKCk7XHJcbiAgICBwcml2YXRlIF9xdWF0ZXJuaW9uID0gbmV3IENBTk5PTi5RdWF0ZXJuaW9uKCk7XHJcblxyXG4gICAgcHJpdmF0ZSBfdGFyZ2V0UG9zaXRpb24gPSBuZXcgQ0FOTk9OLlZlYzMoKTtcclxuICAgIHByaXZhdGUgX3RhcmdldFF1YXRlcm5pb24gPSBuZXcgQ0FOTk9OLlF1YXRlcm5pb24oKTtcclxuXHJcbiAgICBwcml2YXRlIF9pZDogc3RyaW5nID0gYCR7TWF0aC5yYW5kb20oKX1gO1xyXG4gICAgcHJpdmF0ZSBfd29ybGQ6IFdvcmxkO1xyXG4gICAgcHJpdmF0ZSBfYm9keT86IENBTk5PTi5Cb2R5O1xyXG4gICAgXHJcbiAgICBwdWJsaWMgZ2V0IGlkKCkgeyByZXR1cm4gdGhpcy5faWQ7IH1cclxuICAgIHB1YmxpYyBnZXQgYm9keSgpIHsgcmV0dXJuIHRoaXMuX2JvZHk7IH1cclxuICAgIHB1YmxpYyBnZXQgcG9zaXRpb24oKSB7IHJldHVybiB0aGlzLl9wb3NpdGlvbjsgfVxyXG4gICAgcHVibGljIGdldCBxdWF0ZXJuaW9uKCkgeyByZXR1cm4gdGhpcy5fcXVhdGVybmlvbjsgfVxyXG4gICAgcHVibGljIGdldCB2ZWxvY2l0eSgpIHtcclxuICAgICAgICBpZih0aGlzLl9ib2R5KSByZXR1cm4gdGhpcy5fYm9keS52ZWxvY2l0eTtcclxuICAgICAgICByZXR1cm4gQ0FOTk9OLlZlYzMuWkVSTztcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgYW5ndWxhclZlbG9jaXR5KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX2JvZHkpIHJldHVybiB0aGlzLl9ib2R5LmFuZ3VsYXJWZWxvY2l0eTtcclxuICAgICAgICByZXR1cm4gQ0FOTk9OLlZlYzMuWkVSTztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih3b3JsZDogV29ybGQpIHtcclxuICAgICAgICB0aGlzLl93b3JsZCA9IHdvcmxkO1xyXG5cclxuICAgICAgICB0aGlzLnNldENvbG9yKHBjLkNvbG9yLldISVRFKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb2xvcihjb2xvcjogcGMuQ29sb3IpIHtcclxuICAgICAgICB0aGlzLmRhdGEuY29sb3IgPSBbY29sb3IuciwgY29sb3IuZywgY29sb3IuYl07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldEJvZHkoYm9keTogQ0FOTk9OLkJvZHkpIHtcclxuICAgICAgICB0aGlzLl9ib2R5ID0gYm9keTtcclxuICAgICAgICB0aGlzLl9wb3NpdGlvbiA9IGJvZHkucG9zaXRpb247XHJcbiAgICAgICAgdGhpcy5fcXVhdGVybmlvbiA9IGJvZHkucXVhdGVybmlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0SWQoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX2lkID0gaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShkdDogbnVtYmVyKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IHNwZWVkID0gNzAwO1xyXG5cclxuICAgICAgICBjb25zdCBmb3JjZSA9IG5ldyBDQU5OT04uVmVjMyhzcGVlZCAqIHRoaXMuaW5wdXQuaG9yaXpvbnRhbCwgc3BlZWQgKiB0aGlzLmlucHV0LnZlcnRpY2FsLCAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib2R5Py5hcHBseUZvcmNlKGZvcmNlLCB0aGlzLnBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICBpZih0aGlzLmNhbkxlcnApIHtcclxuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICBjb25zdCBuZXdQb3NpdGlvbiA9IG5ldyBDQU5OT04uVmVjMygpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBwb3NpdGlvbi5kaXN0YW5jZVRvKHRoaXMuX3RhcmdldFBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBsZXJwQW1vdW50ID0gMC4zO1xyXG4gICAgICAgICAgICBpZihkaXN0YW5jZSA+IDIuNSkgbGVycEFtb3VudCA9IDE7XHJcblxyXG5cclxuICAgICAgICAgICAgcG9zaXRpb24ubGVycCh0aGlzLl90YXJnZXRQb3NpdGlvbiwgbGVycEFtb3VudCwgbmV3UG9zaXRpb24pO1xyXG4gICAgICAgICAgICBwb3NpdGlvbi5zZXQobmV3UG9zaXRpb24ueCwgbmV3UG9zaXRpb24ueSwgbmV3UG9zaXRpb24ueik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICovXHJcblxyXG4gICAgICAgIGlmKHRoaXMuY2FuTGVycCkge1xyXG4gICAgICAgICAgICBjb25zdCBxdWF0ZXJuaW9uID0gdGhpcy5xdWF0ZXJuaW9uO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9jb25zdCBxZnJvbSA9IG5ldyBQaGFzZXIuTWF0aC5RdWF0ZXJuaW9uKHF1YXRlcm5pb24ueCwgcXVhdGVybmlvbi55LCBxdWF0ZXJuaW9uLnosIHF1YXRlcm5pb24udyk7XHJcbiAgICAgICAgICAgIC8vY29uc3QgcXRvID0gbmV3IFBoYXNlci5NYXRoLlF1YXRlcm5pb24odGhpcy5fdGFyZ2V0UXVhdGVybmlvbi54LCB0aGlzLl90YXJnZXRRdWF0ZXJuaW9uLnksIHRoaXMuX3RhcmdldFF1YXRlcm5pb24ueiwgdGhpcy5fdGFyZ2V0UXVhdGVybmlvbi53KTtcclxuICAgICAgICAgICAgLy9jb25zdCByZXN1bHQgPSBxZnJvbS5sZXJwKHF0bywgMC4xKTsgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgLy90aGlzLnF1YXRlcm5pb24uc2V0KHJlc3VsdC54LCByZXN1bHQueSwgcmVzdWx0LnosIHJlc3VsdC53KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5wb3NpdGlvbi5kaXN0YW5jZVRvKENBTk5PTi5WZWMzLlpFUk8pID4gMjApIHtcclxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi5zZXQoMCwgMCwgMik7XHJcbiAgICAgICAgICAgIHRoaXMuYm9keT8udmVsb2NpdHkuc2V0WmVybygpO1xyXG4gICAgICAgICAgICB0aGlzLmJvZHk/LmFuZ3VsYXJWZWxvY2l0eS5zZXRaZXJvKCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIFxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9KU09OKCkge1xyXG4gICAgICAgIGNvbnN0IGRhdGE6IElFbnRpdHlEYXRhID0ge31cclxuXHJcbiAgICAgICAgZGF0YS5wb3MgPSBbdGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnksIHRoaXMucG9zaXRpb24uel07XHJcbiAgICAgICAgZGF0YS5yb3QgPSBbdGhpcy5xdWF0ZXJuaW9uLngsIHRoaXMucXVhdGVybmlvbi55LCB0aGlzLnF1YXRlcm5pb24ueiwgdGhpcy5xdWF0ZXJuaW9uLnddO1xyXG4gICAgICAgIGRhdGEudmVsID0gW3RoaXMudmVsb2NpdHkueCwgdGhpcy52ZWxvY2l0eS55LCB0aGlzLnZlbG9jaXR5LnpdO1xyXG4gICAgICAgIGRhdGEuYVZlbCA9IFt0aGlzLmFuZ3VsYXJWZWxvY2l0eS54LCB0aGlzLmFuZ3VsYXJWZWxvY2l0eS55LCB0aGlzLmFuZ3VsYXJWZWxvY2l0eS56XTtcclxuICAgICAgICBkYXRhLmlucHV0ID0gW3RoaXMuaW5wdXQuaG9yaXpvbnRhbCwgdGhpcy5pbnB1dC52ZXJ0aWNhbF07XHJcbiAgICAgICAgZGF0YS5kYXRhID0gdGhpcy5kYXRhO1xyXG5cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZnJvbUpTT04oZW50aXR5RGF0YTogSUVudGl0eURhdGEpIHtcclxuICAgICAgICBcclxuICAgICAgICAvL2lmKHRoaXMgPT0gR2FtZUNsaWVudC5wbGF5ZXIpIGNvbnNvbGUubG9nKCd1b3NwcycpXHJcblxyXG4gICAgICAgIGlmKGVudGl0eURhdGEucG9zKSB7XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLmNhbkxlcnApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb24uc2V0KGVudGl0eURhdGEucG9zWzBdLCBlbnRpdHlEYXRhLnBvc1sxXSwgZW50aXR5RGF0YS5wb3NbMl0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihlbnRpdHlEYXRhLnZlbCkge1xyXG5cclxuICAgICAgICAgICAgaWYodGhpcy5jYW5MZXJwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlbG9jaXR5LnNldChlbnRpdHlEYXRhLnZlbFswXSwgZW50aXR5RGF0YS52ZWxbMV0sIGVudGl0eURhdGEudmVsWzJdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoZW50aXR5RGF0YS5hVmVsKSB7XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLmNhbkxlcnApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5ndWxhclZlbG9jaXR5LnNldChlbnRpdHlEYXRhLmFWZWxbMF0sIGVudGl0eURhdGEuYVZlbFsxXSwgZW50aXR5RGF0YS5hVmVsWzJdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoZW50aXR5RGF0YS5yb3QpIHtcclxuICAgICAgICAgICAgaWYodGhpcy5jYW5MZXJwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnF1YXRlcm5pb24uc2V0KGVudGl0eURhdGEucm90WzBdLCBlbnRpdHlEYXRhLnJvdFsxXSwgZW50aXR5RGF0YS5yb3RbMl0sIGVudGl0eURhdGEucm90WzNdKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vdGhpcy5xdWF0ZXJuaW9uLnNldChlbnRpdHlEYXRhLnJvdFswXSwgZW50aXR5RGF0YS5yb3RbMV0sIGVudGl0eURhdGEucm90WzJdLCBlbnRpdHlEYXRhLnJvdFszXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoZW50aXR5RGF0YS5pbnB1dCkge1xyXG4gICAgICAgICAgICB0aGlzLmlucHV0Lmhvcml6b250YWwgPSBlbnRpdHlEYXRhLmlucHV0WzBdO1xyXG4gICAgICAgICAgICB0aGlzLmlucHV0LnZlcnRpY2FsID0gZW50aXR5RGF0YS5pbnB1dFsxXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGVudGl0eURhdGEuZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBlbnRpdHlEYXRhLmRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59ICAgIiwiXHJcbmltcG9ydCAqIGFzIHBjIGZyb20gJ3BsYXljYW52YXMnXHJcbmltcG9ydCB7IFNlcnZlciB9IGZyb20gJy4uL3NlcnZlci9zZXJ2ZXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWUge1xyXG4gICAgcHJpdmF0ZSBfaXNTZXJ2ZXI6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgX3NlcnZlcnMgPSBuZXcgTWFwPHN0cmluZywgU2VydmVyPigpO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNTZXJ2ZXIoKSB7IHJldHVybiB0aGlzLl9pc1NlcnZlcjsgfVxyXG4gICAgcHVibGljIGdldCBzZXJ2ZXJzKCkgeyByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl9zZXJ2ZXJzLnZhbHVlcygpKTsgfVxyXG4gICAgcHVibGljIGdldCBtYWluU2VydmVyKCkgeyByZXR1cm4gdGhpcy5zZXJ2ZXJzWzBdOyB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoaXNTZXJ2ZXI/OiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5faXNTZXJ2ZXIgPSBpc1NlcnZlciA9PT0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFtHYW1lXSBzdGFydDsgaXNTZXJ2ZXIgPWAsIHRoaXMuaXNTZXJ2ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVTZXJ2ZXIoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHNlcnZlciA9IG5ldyBTZXJ2ZXIodGhpcyk7XHJcbiAgICAgICAgdGhpcy5fc2VydmVycy5zZXQoaWQsIHNlcnZlcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZShkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5zZXJ2ZXJzLm1hcChzZXJ2ZXIgPT4gc2VydmVyLnVwZGF0ZShkdCkpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IENBTk5PTiBmcm9tICdjYW5ub24nXHJcbmltcG9ydCAqIGFzIHBjIGZyb20gXCJwbGF5Y2FudmFzXCI7XHJcbmltcG9ydCB7IEVudGl0eSB9IGZyb20gJy4uL2VudGl0eS9lbnRpdHknO1xyXG5pbXBvcnQgeyBOZXR3b3JrIH0gZnJvbSBcIi4uL25ldHdvcmsvbmV0d29ya1wiO1xyXG5pbXBvcnQgeyBJUGFja2V0RGF0YV9Db25uZWN0VG9TZXJ2ZXIsIFBhY2tldFR5cGUgfSBmcm9tICcuLi9wYWNrZXQvcGFja2V0JztcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuL2dhbWVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lQ2xpZW50IGV4dGVuZHMgR2FtZSB7XHJcbiAgICBwdWJsaWMgc3RhdGljIEluc3RhbmNlOiBHYW1lQ2xpZW50O1xyXG4gICAgcHVibGljIHN0YXRpYyBjYW1lcmE6IHBjLkVudGl0eTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcGxheWVySWQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgc3RhdGljIHBsYXllcj86IEVudGl0eTtcclxuXHJcbiAgICBwcml2YXRlIF9hcHA6IHBjLkFwcGxpY2F0aW9uO1xyXG4gICAgcHJpdmF0ZSBfY2FudmFzO1xyXG4gICAgcHJpdmF0ZSBfbmV0d29yazogTmV0d29yaztcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGFwcCgpIHsgcmV0dXJuIHRoaXMuX2FwcDsgfVxyXG4gICAgcHVibGljIGdldCBuZXR3b3JrKCkgeyByZXR1cm4gdGhpcy5fbmV0d29yazsgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNhbnZhcykge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgIHRoaXMuX25ldHdvcmsgPSBuZXcgTmV0d29yayh0aGlzKTtcclxuICAgICAgICBHYW1lQ2xpZW50Lkluc3RhbmNlID0gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlci51cGRhdGUoZHQpO1xyXG5cclxuXHJcbiAgICAgICAgaWYoR2FtZUNsaWVudC5wbGF5ZXIpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gR2FtZUNsaWVudC5wbGF5ZXIuaW5wdXQ7XHJcbiAgICAgICAgICAgIGlucHV0Lmhvcml6b250YWwgPSAwO1xyXG4gICAgICAgICAgICBpbnB1dC52ZXJ0aWNhbCA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLmFwcC5rZXlib2FyZC5pc1ByZXNzZWQocGMuS0VZX0EpKSBpbnB1dC5ob3Jpem9udGFsID0gLTE7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYXBwLmtleWJvYXJkLmlzUHJlc3NlZChwYy5LRVlfRCkpIGlucHV0Lmhvcml6b250YWwgPSAxO1xyXG5cclxuICAgICAgICAgICAgaWYodGhpcy5hcHAua2V5Ym9hcmQuaXNQcmVzc2VkKHBjLktFWV9XKSkgaW5wdXQudmVydGljYWwgPSAtMTtcclxuICAgICAgICAgICAgaWYodGhpcy5hcHAua2V5Ym9hcmQuaXNQcmVzc2VkKHBjLktFWV9TKSkgaW5wdXQudmVydGljYWwgPSAxO1xyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG5cclxuICAgICAgICB0aGlzLm5ldHdvcmsudXBkYXRlKGR0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQoKSB7XHJcbiAgICAgICAgc3VwZXIuc3RhcnQoKTtcclxuICAgICAgICB0aGlzLnNldHVwQXBwKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFJlc2l6ZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBMb2NhbENsaWVudFNjZW5lKCk7XHJcblxyXG4gICAgICAgIHRoaXMubmV0d29yay5jb25uZWN0KCgpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYFtOZXR3b3JrXSBDb25uZWN0ZWQ/ICR7dGhpcy5uZXR3b3JrLmNvbm5lY3RlZH1gKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGE6IElQYWNrZXREYXRhX0Nvbm5lY3RUb1NlcnZlciA9IHtcclxuICAgICAgICAgICAgICAgIGlkOiAnYW55J1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubmV0d29yay5zZW5kKFBhY2tldFR5cGUuQ09OTkVDVF9UT19TRVJWRVIsIGRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0dXBBcHAoKSB7XHJcbiAgICAgICAgY29uc3QgY2FudmFzID0gdGhpcy5fY2FudmFzO1xyXG4gICAgICAgIGNvbnN0IGFwcCA9IG5ldyBwYy5BcHBsaWNhdGlvbihjYW52YXMsIHtcclxuICAgICAgICAgICAgbW91c2U6IG5ldyBwYy5Nb3VzZShjYW52YXMpLFxyXG4gICAgICAgICAgICB0b3VjaDogbmV3IHBjLlRvdWNoRGV2aWNlKGNhbnZhcyksXHJcbiAgICAgICAgICAgIGtleWJvYXJkOiBuZXcgcGMuS2V5Ym9hcmQoZG9jdW1lbnQuYm9keSlcclxuICAgICAgICB9KTtcclxuICAgICAgICBhcHAub24oJ3VwZGF0ZScsIGR0ID0+IHRoaXMudXBkYXRlKGR0KSlcclxuICAgICAgICBhcHAuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fYXBwID0gYXBwO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vcGMucmVnaXN0ZXJTY3JpcHQoQ2FtZXJhRm9sbG93LCAnY2FtZXJhRm9sbG93JywgYXBwKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldHVwUmVzaXplKCkge1xyXG4gICAgICAgIHRoaXMuYXBwLnNldENhbnZhc0ZpbGxNb2RlKHBjLkZJTExNT0RFX0ZJTExfV0lORE9XKTtcclxuICAgICAgICB0aGlzLmFwcC5zZXRDYW52YXNSZXNvbHV0aW9uKHBjLlJFU09MVVRJT05fQVVUTyk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB0aGlzLnJlc2l6ZSgpKTtcclxuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXNpemUoKSB7XHJcbiAgICAgICAgY29uc3QgY2FudmFzID0gdGhpcy5fY2FudmFzO1xyXG5cclxuICAgICAgICB0aGlzLmFwcC5yZXNpemVDYW52YXMoKTtcclxuICAgICAgICBjYW52YXMuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXR1cExvY2FsQ2xpZW50U2NlbmUoKSB7XHJcbiAgICAgICAgY29uc3QgYXBwID0gdGhpcy5hcHA7XHJcblxyXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IG5ldyBwYy5FbnRpdHkoJ2NhbWVyYScpO1xyXG4gICAgICAgIGNhbWVyYS5hZGRDb21wb25lbnQoJ2NhbWVyYScsIHtcclxuICAgICAgICAgICAgY2xlYXJDb2xvcjogbmV3IHBjLkNvbG9yKDAuMSwgMC4xLCAwLjEpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYXBwLnJvb3QuYWRkQ2hpbGQoY2FtZXJhKTtcclxuICAgICAgICBjYW1lcmEuc2V0UG9zaXRpb24oMCwgNSwgMTApO1xyXG4gICAgICAgIGNhbWVyYS5sb29rQXQoMCwgMCwgMCk7XHJcbiAgICAgICAgLy9jYW1lcmEuc2V0RXVsZXJBbmdsZXMoLTkwLCAwLCAwKTtcclxuICAgICAgICAoY2FtZXJhLmFkZENvbXBvbmVudCgnc2NyaXB0JykgYXMgcGMuU2NyaXB0Q29tcG9uZW50KS5jcmVhdGUoJ2NhbWVyYUZvbGxvdycpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGxpZ2h0ID0gbmV3IHBjLkVudGl0eSgnbGlnaHQnKTtcclxuICAgICAgICBsaWdodC5hZGRDb21wb25lbnQoJ2xpZ2h0Jyk7XHJcbiAgICAgICAgYXBwLnJvb3QuYWRkQ2hpbGQobGlnaHQpO1xyXG4gICAgICAgIGxpZ2h0LnNldEV1bGVyQW5nbGVzKDMwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgR2FtZUNsaWVudC5jYW1lcmEgPSBjYW1lcmE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbmRlcigpIHtcclxuICAgICAgICBpZighdGhpcy5tYWluU2VydmVyKSByZXR1cm47XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3Qgd29ybGQgPSB0aGlzLm1haW5TZXJ2ZXIud29ybGRzWzBdO1xyXG5cclxuICAgICAgICB3b3JsZC5lbnRpdGllcy5tYXAoZW50aXR5ID0+IHtcclxuICAgICAgICAgICAgaWYoIWVudGl0eS5wY0VudGl0eSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHNoYXBlID0gZW50aXR5LmJvZHkhLnNoYXBlc1swXSBhcyBDQU5OT04uQm94O1xyXG5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc3QgYyA9IGVudGl0eS5kYXRhLmNvbG9yO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IHBjLlN0YW5kYXJkTWF0ZXJpYWwoKTtcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsLmRpZmZ1c2UgPSBuZXcgcGMuQ29sb3IoY1swXSwgY1sxXSwgY1syXSk7XHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbC51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBlbnRpdHkucGNFbnRpdHkgPSBuZXcgcGMuRW50aXR5KCk7XHJcbiAgICAgICAgICAgICAgICBlbnRpdHkucGNFbnRpdHkuYWRkQ29tcG9uZW50KFwicmVuZGVyXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbDogbWF0ZXJpYWwsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJib3hcIlxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBlbnRpdHkucGNFbnRpdHkuc2V0TG9jYWxTY2FsZShuZXcgcGMuVmVjMyhzaGFwZS5oYWxmRXh0ZW50cy54ICogMiwgc2hhcGUuaGFsZkV4dGVudHMueiAqIDIsIHNoYXBlLmhhbGZFeHRlbnRzLnkgKiAyKSlcclxuXHJcbiAgICAgXHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5hcHAucm9vdC5hZGRDaGlsZChlbnRpdHkucGNFbnRpdHkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwieWFlc1wiKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwb3MgPSBlbnRpdHkucG9zaXRpb247XHJcbiAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gbmV3IENBTk5PTi5WZWMzKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBlbnRpdHkuYm9keT8ucXVhdGVybmlvbi50b0V1bGVyKGFuZ2xlKTtcclxuXHJcbiAgICAgICAgICAgIGVudGl0eS5wY0VudGl0eS5zZXRQb3NpdGlvbihwb3MueCwgcG9zLnosIHBvcy55KTtcclxuICAgICAgICAgICAgZW50aXR5LnBjRW50aXR5LnNldEV1bGVyQW5nbGVzKFxyXG4gICAgICAgICAgICAgICAgYW5nbGUueCAqIC1wYy5tYXRoLlJBRF9UT19ERUcsXHJcbiAgICAgICAgICAgICAgICBhbmdsZS56ICogLXBjLm1hdGguUkFEX1RPX0RFRyxcclxuICAgICAgICAgICAgICAgIGFuZ2xlLnkgKiAtcGMubWF0aC5SQURfVE9fREVHXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgLy9lbnRpdHkucGNFbnRpdHkuc2V0RXVsZXJBbmdsZXMoYW5nbGUueCwgYW5nbGUueiwgYW5nbGUueSk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufSIsImltcG9ydCB7IEdhbWVDbGllbnQgfSBmcm9tIFwiLi9nYW1lL2dhbWVDbGllbnRcIjtcclxuXHJcbmNvbnN0IGdhbWUgPSBuZXcgR2FtZUNsaWVudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZScpKTtcclxuZ2FtZS5zdGFydCgpO1xyXG53aW5kb3dbJ2dhbWUnXSA9IGdhbWU7XHJcbndpbmRvd1snR2FtZUNsaWVudCddID0gR2FtZUNsaWVudDtcclxuXHJcbmdhbWUuY3JlYXRlU2VydmVyKCdzZXJ2ZXIxJyk7IiwiaW1wb3J0IHsgaW8sIFNvY2tldCB9IGZyb20gXCJzb2NrZXQuaW8tY2xpZW50XCI7XHJcbmltcG9ydCB7IEdhbWVDbGllbnQgfSBmcm9tIFwiLi4vZ2FtZS9nYW1lQ2xpZW50XCI7XHJcbmltcG9ydCB7IElQYWNrZXQsIElQYWNrZXREYXRhX0Nvbm5lY3RUb1NlcnZlclN0YXR1cywgSVBhY2tldERhdGFfRW50aXR5RGF0YSwgUGFja2V0VHlwZSB9IGZyb20gXCIuLi9wYWNrZXQvcGFja2V0XCI7XHJcbmltcG9ydCB7IFdvcmxkU3luY0hlbHBlciB9IGZyb20gXCIuLi93b3JsZC93b3JsZFN5bmNIZWxwZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBOZXR3b3JrIHtcclxuICAgIHByaXZhdGUgX2dhbWU6IEdhbWVDbGllbnQ7XHJcbiAgICBwcml2YXRlIF9zb2NrZXQ6IFNvY2tldDtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGdhbWUoKSB7IHJldHVybiB0aGlzLl9nYW1lOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHNvY2tldCgpIHsgcmV0dXJuIHRoaXMuX3NvY2tldDsgfVxyXG4gICAgcHVibGljIGdldCBjb25uZWN0ZWQoKSB7IHJldHVybiB0aGlzLl9zb2NrZXQuY29ubmVjdGVkOyB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VuZFBhY2tldHNEZWxheTogbnVtYmVyID0gMjAwO1xyXG4gICAgcHJpdmF0ZSBfc2VuZFRpbWU6IG51bWJlciA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZUNsaWVudCkge1xyXG4gICAgICAgIHRoaXMuX2dhbWUgPSBnYW1lO1xyXG5cclxuICAgICAgICAvL2h0dHBzOi8vZG1kYXNzYy1nYW1lLmdsaXRjaC5tZS9cclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBhZGRyZXNzID0gYCR7bG9jYXRpb24ucHJvdG9jb2x9Ly8ke2xvY2F0aW9uLmhvc3R9YDtcclxuICAgICAgICB0aGlzLl9zb2NrZXQgPSBpbyhhZGRyZXNzLCB7XHJcbiAgICAgICAgICAgIC8vcGF0aDogJy9zb2NrZXQnLFxyXG4gICAgICAgICAgICBhdXRvQ29ubmVjdDogZmFsc2UsXHJcbiAgICAgICAgICAgIHJlY29ubmVjdGlvbjogZmFsc2VcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdwYWNrZXQnLCBwYWNrZXQgPT4gdGhpcy5vblJlY2VpdmVQYWNrZXQocGFja2V0KSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2coYFtOZXR3b3JrXSBBZGRyZXNzOiAoJHthZGRyZXNzfSlgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29ubmVjdChjYWxsYmFjaz86ICgpID0+IHZvaWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgW05ldHdvcmtdIENvbm5lY3RpbmcuLi5gKTtcclxuXHJcbiAgICAgICAgdGhpcy5fc29ja2V0LmNvbm5lY3QoKTtcclxuICAgICAgICB0aGlzLl9zb2NrZXQub25jZSgnY29ubmVjdCcsICgpID0+IHtcclxuICAgICAgICAgICAgY2FsbGJhY2s/LigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3NlbmRUaW1lICs9IGR0O1xyXG5cclxuICAgICAgICBjb25zdCBlbnRpdHkgPSBHYW1lQ2xpZW50LnBsYXllcjtcclxuXHJcbiAgICAgICAgaWYoIWVudGl0eSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZih0aGlzLl9zZW5kVGltZSA8PSB0aGlzLl9zZW5kUGFja2V0c0RlbGF5LzEwMDApIHJldHVybjtcclxuICAgICAgICB0aGlzLl9zZW5kVGltZSA9IDA7XHJcblxyXG4gICAgICAgIGNvbnN0IHBhY2tldERhdGE6IElQYWNrZXREYXRhX0VudGl0eURhdGEgPSB7XHJcbiAgICAgICAgICAgIGVudGl0eUlkOiBlbnRpdHkuaWQsXHJcbiAgICAgICAgICAgIGRhdGE6IGVudGl0eS50b0pTT04oKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZW5kKFBhY2tldFR5cGUuRU5USVRZX0RBVEEsIHBhY2tldERhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZW5kKHR5cGU6IFBhY2tldFR5cGUsIGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBjb25zdCBwYWNrZXQ6IElQYWNrZXQgPSB7XHJcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zb2NrZXQuZW1pdCgncGFja2V0JywgcGFja2V0KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIG9uUmVjZWl2ZVBhY2tldChwYWNrZXQ6IElQYWNrZXQpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHBhY2tldClcclxuXHJcbiAgICAgICAgaWYocGFja2V0LnR5cGUgPT0gUGFja2V0VHlwZS5DT05ORUNUX1RPX1NFUlZFUl9TVEFUVVMpIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YTogSVBhY2tldERhdGFfQ29ubmVjdFRvU2VydmVyU3RhdHVzID0gcGFja2V0LmRhdGE7XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgIEdhbWVDbGllbnQucGxheWVySWQgPSBkYXRhLmVudGl0eUlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYocGFja2V0LnR5cGUgPT0gUGFja2V0VHlwZS5FTlRJVFlfREFUQSkge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhOiBJUGFja2V0RGF0YV9FbnRpdHlEYXRhID0gcGFja2V0LmRhdGE7XHJcblxyXG4gICAgICAgICAgICBXb3JsZFN5bmNIZWxwZXIub25SZWNlaXZlRW50aXR5RGF0YShkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgIHByaXZhdGUgb25SZWNlaXZlUGFja2V0KHBhY2tldDogSVBhY2tldCkge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgKi9cclxufSIsImV4cG9ydCBlbnVtIFBhY2tldFR5cGUge1xyXG4gICAgUkVRVUVTVF9TRVJWRVJfTElTVCxcclxuICAgIFNFUlZFUl9MSVNULFxyXG4gICAgQ09OTkVDVF9UT19TRVJWRVIsXHJcbiAgICBDT05ORUNUX1RPX1NFUlZFUl9TVEFUVVMsXHJcbiAgICBFTlRJVFlfREFUQVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQYWNrZXQge1xyXG4gICAgdHlwZTogUGFja2V0VHlwZVxyXG4gICAgZGF0YT86IGFueVxyXG59XHJcblxyXG4vKlxyXG5leHBvcnQgaW50ZXJmYWNlIElQYWNrZXREYXRhX1NlcnZlckxpc3Qge1xyXG4gICAgc2VydmVyczogU2VydmVySW5mb1tdXHJcbn1cclxuKi9cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhY2tldERhdGFfQ29ubmVjdFRvU2VydmVyIHtcclxuICAgIGlkOiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUGFja2V0RGF0YV9JZCB7XHJcbiAgICBpZDogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhY2tldERhdGFfQ29ubmVjdFRvU2VydmVyU3RhdHVzIHtcclxuICAgIHNlcnZlcklkOiBzdHJpbmdcclxuICAgIGVudGl0eUlkOiBzdHJpbmdcclxuICAgIHN1Y2Nlc3M6IGJvb2xlYW5cclxuICAgIGVycm9yTWVzc2FnZT86IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQYWNrZXREYXRhX0VudGl0eURhdGEge1xyXG4gICAgZW50aXR5SWQ6IHN0cmluZ1xyXG4gICAgZGF0YTogYW55XHJcbn0iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uL2dhbWUvZ2FtZVwiO1xyXG5pbXBvcnQgeyBXb3JsZCB9IGZyb20gXCIuLi93b3JsZC93b3JsZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNlcnZlciB7XHJcbiAgICBwcml2YXRlIF9nYW1lOiBHYW1lO1xyXG4gICAgcHJpdmF0ZSBfd29ybGRzID0gbmV3IE1hcDxzdHJpbmcsIFdvcmxkPigpO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgd29ybGRzKCkgeyByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl93b3JsZHMudmFsdWVzKCkpOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGdhbWUoKSB7IHJldHVybiB0aGlzLl9nYW1lOyB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZSkge1xyXG4gICAgICAgIHRoaXMuX2dhbWUgPSBnYW1lO1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZVdvcmxkKCd3b3JsZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMud29ybGRzLm1hcCh3b3JsZCA9PiB3b3JsZC51cGRhdGUoZHQpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlV29ybGQobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgd29ybGQgPSBuZXcgV29ybGQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5fd29ybGRzLnNldChuYW1lLCB3b3JsZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQ0FOTk9OIGZyb20gJ2Nhbm5vbidcclxuaW1wb3J0ICogYXMgcGMgZnJvbSAncGxheWNhbnZhcyc7XHJcbmltcG9ydCB7IEVudGl0eSB9IGZyb20gJy4uL2VudGl0eS9lbnRpdHknO1xyXG5pbXBvcnQgeyBTZXJ2ZXIgfSBmcm9tIFwiLi4vc2VydmVyL3NlcnZlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdvcmxkIHtcclxuXHJcbiAgICBwcml2YXRlIF9zZXJ2ZXI6IFNlcnZlcjtcclxuICAgIHByaXZhdGUgX2R5bmFtaWNXb3JsZDogQ0FOTk9OLldvcmxkO1xyXG4gICAgcHJpdmF0ZSBfZW50aXRpZXMgPSBuZXcgTWFwPHN0cmluZywgRW50aXR5PigpO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgc2VydmVyKCkgeyByZXR1cm4gdGhpcy5fc2VydmVyIH07XHJcbiAgICBwdWJsaWMgZ2V0IGR5bmFtaWNXb3JsZCgpIHsgcmV0dXJuIHRoaXMuX2R5bmFtaWNXb3JsZCB9O1xyXG4gICAgcHVibGljIGdldCBlbnRpdGllcygpIHsgcmV0dXJuIEFycmF5LmZyb20odGhpcy5fZW50aXRpZXMudmFsdWVzKCkpIH07XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2VydmVyOiBTZXJ2ZXIpIHtcclxuICAgICAgICB0aGlzLl9zZXJ2ZXIgPSBzZXJ2ZXI7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBEeW5hbWljV29ybGQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgZml4ZWRUaW1lU3RlcCA9IDEuMCAvIDYwLjA7IC8vIHNlY29uZHNcclxuICAgICAgICB2YXIgbWF4U3ViU3RlcHMgPSAzO1xyXG5cclxuICAgICAgICB0aGlzLmVudGl0aWVzLm1hcChlbnRpdHkgPT4gZW50aXR5LnVwZGF0ZShkdCkpO1xyXG4gICAgICAgIHRoaXMuZHluYW1pY1dvcmxkLnN0ZXAoZml4ZWRUaW1lU3RlcCwgZHQsIG1heFN1YlN0ZXBzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RW50aXR5KGlkOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZW50aXRpZXMuZ2V0KGlkKSE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhhc0VudGl0eShpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VudGl0aWVzLmhhcyhpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXR1cER5bmFtaWNXb3JsZCgpIHtcclxuXHJcbiAgICAgICAgLy8gU2V0dXAgb3VyIHdvcmxkXHJcbiAgICAgICAgdmFyIHdvcmxkID0gdGhpcy5fZHluYW1pY1dvcmxkID0gbmV3IENBTk5PTi5Xb3JsZCgpO1xyXG4gICAgICAgIHdvcmxkLmdyYXZpdHkgPSBuZXcgQ0FOTk9OLlZlYzMoMCwgMCwgLTkuODIpIC8vIG0vc8KyXHJcblxyXG4gICAgICAgIGNvbnN0IGdyb3VuZCA9IHRoaXMuc3Bhd25FbnRpdHkobmV3IENBTk5PTi5WZWMzKDAsIDAsIDApLCBuZXcgQ0FOTk9OLlZlYzMoMzAsIDMwLCAxKSwge21hc3M6IDB9KTtcclxuICAgICAgICBncm91bmQuZG9udFN5bmMgPSB0cnVlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICAvL2NvbnN0IGJveCA9IHRoaXMuc3Bhd25UZXN0RW50aXR5KG5ldyBDQU5OT04uVmVjMygwLCAwLCA0KSwgbmV3IENBTk5PTi5WZWMzKDEsIDEsIDEpLCB7bWFzczogMjAwfSk7XHJcbiAgICAgICAgLy9jb25zdCBib3gyID0gdGhpcy5zcGF3blRlc3RFbnRpdHkobmV3IENBTk5PTi5WZWMzKDAsIDEsIDgpLCBuZXcgQ0FOTk9OLlZlYzMoMSwgMSwgMSksIHttYXNzOiAyMDB9KTtcclxuICAgICAgICBcclxuICAgICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiZ3JvdW5kOiBcIiArIHRoaXMucHJpbnRQb3NpdGlvbihncm91bmQuZ2V0UG9zaXRpb24oKSkpO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYm94OiBcIiArIHRoaXMucHJpbnRQb3NpdGlvbihib3guZ2V0UG9zaXRpb24oKSkpO1xyXG5cclxuICAgICAgICB9LCAyNTApXHJcblxyXG4gICAgICAgIC8vc2V0SW50ZXJ2YWwoKCkgPT4geyB0aGlzLnNwYXduVGVzdEVudGl0eSgpOyB9LCAxMDAwKVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzcGF3bkVudGl0eShwb3NpdGlvbj86IENBTk5PTi5WZWMzLCBoYWxmRXh0ZW5kcz86IENBTk5PTi5WZWMzLCBvcHRpb25zPzogQ0FOTk9OLklCb2R5T3B0aW9ucywgY29sb3I/OiBwYy5Db2xvciwgY3VzdG9tSWQ/OiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge21hc3M6IDUwfTtcclxuICAgICAgICBjb2xvciA9IGNvbG9yIHx8IG5ldyBwYy5Db2xvcigxLCAxLCAxKTtcclxuXHJcbiAgICAgICAgY29uc3QgYm9keSA9IHRoaXMuY3JlYXRlUmVjdGFuZ2xlQm9keShwb3NpdGlvbiB8fCBuZXcgQ0FOTk9OLlZlYzMoTWF0aC5yYW5kb20oKSo2LTMsIE1hdGgucmFuZG9tKCkqNi0zLCAzKSwgaGFsZkV4dGVuZHMgfHwgbmV3IENBTk5PTi5WZWMzKDAuMiwgMC4yLCAwLjIpLCBvcHRpb25zKTtcclxuICAgICAgICBcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgY29uc3QgZW50aXR5ID0gbmV3IEVudGl0eSh0aGlzKTtcclxuICAgICAgICBlbnRpdHkuZGF0YS5jb2xvciA9IFtjb2xvci5yLCBjb2xvci5nLCBjb2xvci5iXTtcclxuICAgICAgICBlbnRpdHkuc2V0Qm9keShib2R5KVxyXG4gICAgICAgIGlmKGN1c3RvbUlkKSBlbnRpdHkuc2V0SWQoY3VzdG9tSWQpO1xyXG5cclxuICAgICAgICB0aGlzLl9lbnRpdGllcy5zZXQoZW50aXR5LmlkLCBlbnRpdHkpO1xyXG5cclxuICAgICAgICByZXR1cm4gZW50aXR5O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcHJpbnRQb3NpdGlvbihwb3M6IENBTk5PTi5WZWMzKSB7XHJcbiAgICAgICAgcmV0dXJuIGAoJHtwb3MueH0sICR7cG9zLnl9LCAke3Bvcy56fSlgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZVJlY3RhbmdsZUJvZHkocG9zaXRpb246IENBTk5PTi5WZWMzLCBoYWxmRXh0ZW5kczogQ0FOTk9OLlZlYzMsIG9wdGlvbnM/OiBDQU5OT04uSUJvZHlPcHRpb25zKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3Qgb3B0ID0gb3B0aW9ucyB8fCB7fTtcclxuXHJcbiAgICAgICAgb3B0LnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICAgXHJcbiAgICAgICAgdmFyIHNoYXBlID0gbmV3IENBTk5PTi5Cb3goaGFsZkV4dGVuZHMpO1xyXG4gICAgICAgIHZhciBib2R5ID0gbmV3IENBTk5PTi5Cb2R5KG9wdCk7XHJcbiAgICAgICAgYm9keS5hZGRTaGFwZShzaGFwZSk7XHJcblxyXG4gICAgICAgIHRoaXMuZHluYW1pY1dvcmxkLmFkZEJvZHkoYm9keSk7XHJcblxyXG4gICAgICAgIHJldHVybiBib2R5OyBcclxuICAgIH1cclxufVxyXG5cclxuLypcclxuY29uc3QgZW50aXR5ID0gbmV3IHBjLkVudGl0eShuYW1lKTtcclxuZW50aXR5LnNldFBvc2l0aW9uKHBvc2l0aW9uKVxyXG50aGlzLmNyZWF0ZVJlY3RhbmdsZUF0RW50aXR5KGVudGl0eSwgc2l6ZSwgaXNEeW5hbWljLCBjb2xvcik7XHJcbmFwcC5yb290LmFkZENoaWxkKGVudGl0eSk7XHJcbiovIiwiaW1wb3J0ICogYXMgcGMgZnJvbSBcInBsYXljYW52YXNcIjtcclxuaW1wb3J0IHsgRW50aXR5IH0gZnJvbSBcIi4uL2VudGl0eS9lbnRpdHlcIjtcclxuaW1wb3J0IHsgR2FtZUNsaWVudCB9IGZyb20gXCIuLi9nYW1lL2dhbWVDbGllbnRcIjtcclxuaW1wb3J0IHsgSVBhY2tldERhdGFfRW50aXR5RGF0YSB9IGZyb20gXCIuLi9wYWNrZXQvcGFja2V0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGRTeW5jSGVscGVyIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdhbWUoKSB7IHJldHVybiBHYW1lQ2xpZW50Lkluc3RhbmNlOyB9O1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgb25SZWNlaXZlRW50aXR5RGF0YShkYXRhOiBJUGFja2V0RGF0YV9FbnRpdHlEYXRhKSB7XHJcbiAgICAgICAgY29uc3Qgd29ybGQgPSB0aGlzLmdhbWUubWFpblNlcnZlci53b3JsZHNbMF07XHJcblxyXG4gICAgICAgIGxldCBpc05ld0VudGl0eTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZighd29ybGQuaGFzRW50aXR5KGRhdGEuZW50aXR5SWQpKSB7XHJcbiAgICAgICAgICAgIHdvcmxkLnNwYXduRW50aXR5KHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIG5ldyBwYy5Db2xvcigxLCAwLCAwKSwgZGF0YS5lbnRpdHlJZCk7XHJcbiAgICAgICAgICAgIGlzTmV3RW50aXR5ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCduZXcgZW50aXknKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZW50aXR5ID0gd29ybGQuZ2V0RW50aXR5KGRhdGEuZW50aXR5SWQpO1xyXG5cclxuICAgICAgICBlbnRpdHkuZnJvbUpTT04oZGF0YS5kYXRhKTtcclxuXHJcbiAgICAgICAgaWYoaXNOZXdFbnRpdHkpIHtcclxuICAgICAgICAgICAgZW50aXR5LmNhbkxlcnAgPSB0cnVlO1xyXG4gICAgICAgICAgICAvL2VudGl0eS5zY3JpcHQhLmNyZWF0ZSgnZW50aXR5U3luYycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIGlmKGVudGl0eS5pZCA9PSBHYW1lQ2xpZW50LnBsYXllcklkKSB7XHJcblxyXG4gICAgICAgICAgICBpZighR2FtZUNsaWVudC5wbGF5ZXIpIHtcclxuICAgICAgICAgICAgICAgIEdhbWVDbGllbnQucGxheWVyID0gZW50aXR5IGFzIEVudGl0eTtcclxuICAgICAgICAgICAgICAgIEdhbWVDbGllbnQucGxheWVyLmNhbkxlcnAgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIC8vR2FtZUNsaWVudC5wbGF5ZXIuc2V0Q29udHJvbGxhYmxlKCk7XHJcbiAgICAgICAgICAgICAgICAvL0dhbWVDbGllbnQuY2FtZXJhRm9sbG93RW50aXR5KGVudGl0eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkc1tpXV0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtkbWRhc3NjX2dhbWVcIl0gPSBzZWxmW1wid2VicGFja0NodW5rZG1kYXNzY19nYW1lXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxuX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9yc1wiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKSkpXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnNcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi93ZWJwYWNrL2NyZWRpdHMuanNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==