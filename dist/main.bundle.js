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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Entity = void 0;
const cannon_1 = __importStar(__webpack_require__(/*! cannon */ "./node_modules/cannon/build/cannon.js"));
class Entity {
    constructor(world) {
        this.dontSync = false;
        this.canLerp = false;
        this._position = new cannon_1.default.Vec3();
        this._quaternion = new cannon_1.default.Quaternion();
        this._targetPosition = new cannon_1.default.Vec3();
        this._targetQuaternion = new cannon_1.default.Quaternion();
        this._id = `${Math.random()}`;
        this.input = { x: 0, y: 0 };
        this._world = world;
    }
    get id() { return this._id; }
    get body() { return this._body; }
    setBody(body) {
        this._body = body;
    }
    setId(id) {
        this._id = id;
    }
    getPosition() {
        if (this._body)
            return this._body.position;
        return this._position;
    }
    getQuaternion() {
        if (this._body)
            return this._body.quaternion;
        return this._quaternion;
    }
    getVelocity() {
        if (this._body)
            return this._body.velocity;
        return this._quaternion;
    }
    update(dt) {
        var _a, _b, _c;
        const speed = 700;
        const force = new cannon_1.default.Vec3(speed * this.input.x, speed * this.input.y, 0);
        (_a = this.body) === null || _a === void 0 ? void 0 : _a.applyForce(force, this.getPosition());
        if (this.canLerp) {
            const position = this.getPosition();
            const newPosition = new cannon_1.default.Vec3();
            const distance = position.distanceTo(this._targetPosition);
            let lerpAmount = 0.3;
            if (distance > 2.5)
                lerpAmount = 1;
            position.lerp(this._targetPosition, lerpAmount, newPosition);
            position.set(newPosition.x, newPosition.y, newPosition.z);
        }
        if (this.canLerp) {
            //this.body?.angularVelocity.setZero();
            //this.getQuaternion().set(this._targetQuaternion.x, this._targetQuaternion.y, this._targetQuaternion.z, this._targetQuaternion.w)
        }
        if (this.getPosition().distanceTo(cannon_1.Vec3.ZERO) > 20) {
            this.getPosition().set(0, 0, 2);
            (_b = this.body) === null || _b === void 0 ? void 0 : _b.velocity.setZero();
            (_c = this.body) === null || _c === void 0 ? void 0 : _c.angularVelocity.setZero();
        }
    }
    toJSON() {
        const data = {};
        const position = this.getPosition();
        data.pos = [position.x, position.y, position.z];
        const quat = this.getQuaternion();
        data.rot = [quat.x, quat.y, quat.z, quat.w];
        data.input = [this.input.x, this.input.y];
        return data;
    }
    fromJSON(data) {
        if (data.pos) {
            this._targetPosition.set(data.pos[0], data.pos[1], data.pos[2]);
        }
        if (data.rot) {
            if (this.canLerp)
                this.getQuaternion().set(data.rot[0], data.rot[1], data.rot[2], data.rot[3]);
        }
        if (data.input) {
            this.input.x = data.input[0];
            this.input.y = data.input[1];
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
            input.x = 0;
            input.y = 0;
            if (this.app.keyboard.isPressed(pc.KEY_A))
                input.x = -1;
            if (this.app.keyboard.isPressed(pc.KEY_D))
                input.x = 1;
            if (this.app.keyboard.isPressed(pc.KEY_W))
                input.y = -1;
            if (this.app.keyboard.isPressed(pc.KEY_S))
                input.y = 1;
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
                const material = new pc.StandardMaterial();
                material.diffuse = entity.color;
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
            const pos = entity.getPosition();
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
        entity.color = color;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0o7SUFDTCxDQUFDO0NBQ0o7QUFwQ0QsMENBb0NDOzs7Ozs7Ozs7Ozs7Ozs7OztVQ3pDRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOztVQUVBO1VBQ0E7Ozs7O1dDekJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsK0JBQStCLHdDQUF3QztXQUN2RTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlCQUFpQixxQkFBcUI7V0FDdEM7V0FDQTtXQUNBLGtCQUFrQixxQkFBcUI7V0FDdkM7V0FDQTtXQUNBLEtBQUs7V0FDTDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDM0JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL2VudGl0eS9lbnRpdHkudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL2dhbWUvZ2FtZS50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvZ2FtZS9nYW1lQ2xpZW50LnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvbmV0d29yay9uZXR3b3JrLnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9wYWNrZXQvcGFja2V0LnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9zZXJ2ZXIvc2VydmVyLnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy93b3JsZC93b3JsZC50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvd29ybGQvd29ybGRTeW5jSGVscGVyLnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGMgZnJvbSAncGxheWNhbnZhcyc7XHJcbmltcG9ydCBDQU5OT04sIHsgVmVjMyB9IGZyb20gJ2Nhbm5vbic7XHJcbmltcG9ydCB7IFdvcmxkIH0gZnJvbSBcIi4uL3dvcmxkL3dvcmxkXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElFbnRpdHlEYXRhIHtcclxuICAgIHBvcz86IG51bWJlcltdXHJcbiAgICByb3Q/OiBudW1iZXJbXVxyXG4gICAgaW5wdXQ/OiBudW1iZXJbXVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRW50aXR5IHtcclxuICAgIHB1YmxpYyBkb250U3luYzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIHBjRW50aXR5PzogcGMuRW50aXR5O1xyXG5cclxuICAgIHB1YmxpYyBjYW5MZXJwOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgcHVibGljIGNvbG9yOiBwYy5Db2xvcjtcclxuXHJcbiAgICBwcml2YXRlIF9wb3NpdGlvbiA9IG5ldyBDQU5OT04uVmVjMygpO1xyXG4gICAgcHJpdmF0ZSBfcXVhdGVybmlvbiA9IG5ldyBDQU5OT04uUXVhdGVybmlvbigpO1xyXG5cclxuICAgIHByaXZhdGUgX3RhcmdldFBvc2l0aW9uID0gbmV3IENBTk5PTi5WZWMzKCk7XHJcbiAgICBwcml2YXRlIF90YXJnZXRRdWF0ZXJuaW9uID0gbmV3IENBTk5PTi5RdWF0ZXJuaW9uKCk7XHJcblxyXG4gICAgcHJpdmF0ZSBfaWQ6IHN0cmluZyA9IGAke01hdGgucmFuZG9tKCl9YDtcclxuICAgIHByaXZhdGUgX3dvcmxkOiBXb3JsZDtcclxuICAgIHByaXZhdGUgX2JvZHk/OiBDQU5OT04uQm9keTtcclxuICAgIFxyXG4gICAgcHVibGljIGdldCBpZCgpIHsgcmV0dXJuIHRoaXMuX2lkOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGJvZHkoKSB7IHJldHVybiB0aGlzLl9ib2R5OyB9XHJcblxyXG4gICAgcHVibGljIGlucHV0ID0ge3g6IDAsIHk6IDB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHdvcmxkOiBXb3JsZCkge1xyXG4gICAgICAgIHRoaXMuX3dvcmxkID0gd29ybGQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldEJvZHkoYm9keTogQ0FOTk9OLkJvZHkpIHtcclxuICAgICAgICB0aGlzLl9ib2R5ID0gYm9keTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0SWQoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX2lkID0gaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFBvc2l0aW9uKCkge1xyXG4gICAgICAgIGlmKHRoaXMuX2JvZHkpIHJldHVybiB0aGlzLl9ib2R5LnBvc2l0aW9uO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UXVhdGVybmlvbigpIHtcclxuICAgICAgICBpZih0aGlzLl9ib2R5KSByZXR1cm4gdGhpcy5fYm9keS5xdWF0ZXJuaW9uO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9xdWF0ZXJuaW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRWZWxvY2l0eSgpIHtcclxuICAgICAgICBpZih0aGlzLl9ib2R5KSByZXR1cm4gdGhpcy5fYm9keS52ZWxvY2l0eTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcXVhdGVybmlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuXHJcbiAgICAgICAgY29uc3Qgc3BlZWQgPSA3MDA7XHJcblxyXG4gICAgICAgIGNvbnN0IGZvcmNlID0gbmV3IENBTk5PTi5WZWMzKHNwZWVkICogdGhpcy5pbnB1dC54LCBzcGVlZCAqIHRoaXMuaW5wdXQueSwgMClcclxuXHJcbiAgICAgICAgdGhpcy5ib2R5Py5hcHBseUZvcmNlKGZvcmNlLCB0aGlzLmdldFBvc2l0aW9uKCkpO1xyXG5cclxuICAgICAgICBpZih0aGlzLmNhbkxlcnApIHtcclxuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmdldFBvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1Bvc2l0aW9uID0gbmV3IENBTk5PTi5WZWMzKCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IHBvc2l0aW9uLmRpc3RhbmNlVG8odGhpcy5fdGFyZ2V0UG9zaXRpb24pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGxlcnBBbW91bnQgPSAwLjM7XHJcbiAgICAgICAgICAgIGlmKGRpc3RhbmNlID4gMi41KSBsZXJwQW1vdW50ID0gMTtcclxuXHJcblxyXG4gICAgICAgICAgICBwb3NpdGlvbi5sZXJwKHRoaXMuX3RhcmdldFBvc2l0aW9uLCBsZXJwQW1vdW50LCBuZXdQb3NpdGlvbik7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uLnNldChuZXdQb3NpdGlvbi54LCBuZXdQb3NpdGlvbi55LCBuZXdQb3NpdGlvbi56KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMuY2FuTGVycCkge1xyXG4gICAgICAgICAgICAvL3RoaXMuYm9keT8uYW5ndWxhclZlbG9jaXR5LnNldFplcm8oKTtcclxuICAgICAgICAgICAgLy90aGlzLmdldFF1YXRlcm5pb24oKS5zZXQodGhpcy5fdGFyZ2V0UXVhdGVybmlvbi54LCB0aGlzLl90YXJnZXRRdWF0ZXJuaW9uLnksIHRoaXMuX3RhcmdldFF1YXRlcm5pb24ueiwgdGhpcy5fdGFyZ2V0UXVhdGVybmlvbi53KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5nZXRQb3NpdGlvbigpLmRpc3RhbmNlVG8oVmVjMy5aRVJPKSA+IDIwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0UG9zaXRpb24oKS5zZXQoMCwgMCwgMik7XHJcbiAgICAgICAgICAgIHRoaXMuYm9keT8udmVsb2NpdHkuc2V0WmVybygpO1xyXG4gICAgICAgICAgICB0aGlzLmJvZHk/LmFuZ3VsYXJWZWxvY2l0eS5zZXRaZXJvKCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIFxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9KU09OKCkge1xyXG4gICAgICAgIGNvbnN0IGRhdGE6IElFbnRpdHlEYXRhID0ge31cclxuXHJcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmdldFBvc2l0aW9uKCk7XHJcbiAgICAgICAgZGF0YS5wb3MgPSBbcG9zaXRpb24ueCwgcG9zaXRpb24ueSwgcG9zaXRpb24uel07XHJcblxyXG4gICAgICAgIGNvbnN0IHF1YXQgPSB0aGlzLmdldFF1YXRlcm5pb24oKTtcclxuICAgICAgICBkYXRhLnJvdCA9IFtxdWF0LngsIHF1YXQueSwgcXVhdC56LCBxdWF0LnddO1xyXG5cclxuICAgICAgICBkYXRhLmlucHV0ID0gW3RoaXMuaW5wdXQueCwgdGhpcy5pbnB1dC55XTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZyb21KU09OKGRhdGE6IElFbnRpdHlEYXRhKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoZGF0YS5wb3MpIHtcclxuICAgICAgICAgICAgdGhpcy5fdGFyZ2V0UG9zaXRpb24uc2V0KGRhdGEucG9zWzBdLCBkYXRhLnBvc1sxXSwgZGF0YS5wb3NbMl0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoZGF0YS5yb3QpIHtcclxuICAgICAgICAgICAgaWYodGhpcy5jYW5MZXJwKSB0aGlzLmdldFF1YXRlcm5pb24oKS5zZXQoZGF0YS5yb3RbMF0sIGRhdGEucm90WzFdLCBkYXRhLnJvdFsyXSwgZGF0YS5yb3RbM10pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZihkYXRhLmlucHV0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXQueCA9IGRhdGEuaW5wdXRbMF07XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXQueSA9IGRhdGEuaW5wdXRbMV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59ICAgIiwiXHJcbmltcG9ydCAqIGFzIHBjIGZyb20gJ3BsYXljYW52YXMnXHJcbmltcG9ydCB7IFNlcnZlciB9IGZyb20gJy4uL3NlcnZlci9zZXJ2ZXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWUge1xyXG4gICAgcHJpdmF0ZSBfaXNTZXJ2ZXI6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgX3NlcnZlcnMgPSBuZXcgTWFwPHN0cmluZywgU2VydmVyPigpO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNTZXJ2ZXIoKSB7IHJldHVybiB0aGlzLl9pc1NlcnZlcjsgfVxyXG4gICAgcHVibGljIGdldCBzZXJ2ZXJzKCkgeyByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl9zZXJ2ZXJzLnZhbHVlcygpKTsgfVxyXG4gICAgcHVibGljIGdldCBtYWluU2VydmVyKCkgeyByZXR1cm4gdGhpcy5zZXJ2ZXJzWzBdOyB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoaXNTZXJ2ZXI/OiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5faXNTZXJ2ZXIgPSBpc1NlcnZlciA9PT0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFtHYW1lXSBzdGFydDsgaXNTZXJ2ZXIgPWAsIHRoaXMuaXNTZXJ2ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVTZXJ2ZXIoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHNlcnZlciA9IG5ldyBTZXJ2ZXIodGhpcyk7XHJcbiAgICAgICAgdGhpcy5fc2VydmVycy5zZXQoaWQsIHNlcnZlcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZShkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5zZXJ2ZXJzLm1hcChzZXJ2ZXIgPT4gc2VydmVyLnVwZGF0ZShkdCkpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IENBTk5PTiBmcm9tICdjYW5ub24nXHJcbmltcG9ydCAqIGFzIHBjIGZyb20gXCJwbGF5Y2FudmFzXCI7XHJcbmltcG9ydCB7IEVudGl0eSB9IGZyb20gJy4uL2VudGl0eS9lbnRpdHknO1xyXG5pbXBvcnQgeyBOZXR3b3JrIH0gZnJvbSBcIi4uL25ldHdvcmsvbmV0d29ya1wiO1xyXG5pbXBvcnQgeyBJUGFja2V0RGF0YV9Db25uZWN0VG9TZXJ2ZXIsIFBhY2tldFR5cGUgfSBmcm9tICcuLi9wYWNrZXQvcGFja2V0JztcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuL2dhbWVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lQ2xpZW50IGV4dGVuZHMgR2FtZSB7XHJcbiAgICBwdWJsaWMgc3RhdGljIEluc3RhbmNlOiBHYW1lQ2xpZW50O1xyXG4gICAgcHVibGljIHN0YXRpYyBjYW1lcmE6IHBjLkVudGl0eTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcGxheWVySWQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgc3RhdGljIHBsYXllcj86IEVudGl0eTtcclxuXHJcbiAgICBwcml2YXRlIF9hcHA6IHBjLkFwcGxpY2F0aW9uO1xyXG4gICAgcHJpdmF0ZSBfY2FudmFzO1xyXG4gICAgcHJpdmF0ZSBfbmV0d29yazogTmV0d29yaztcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGFwcCgpIHsgcmV0dXJuIHRoaXMuX2FwcDsgfVxyXG4gICAgcHVibGljIGdldCBuZXR3b3JrKCkgeyByZXR1cm4gdGhpcy5fbmV0d29yazsgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNhbnZhcykge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgIHRoaXMuX25ldHdvcmsgPSBuZXcgTmV0d29yayh0aGlzKTtcclxuICAgICAgICBHYW1lQ2xpZW50Lkluc3RhbmNlID0gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlci51cGRhdGUoZHQpO1xyXG5cclxuXHJcbiAgICAgICAgaWYoR2FtZUNsaWVudC5wbGF5ZXIpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gR2FtZUNsaWVudC5wbGF5ZXIuaW5wdXQ7XHJcbiAgICAgICAgICAgIGlucHV0LnggPSAwO1xyXG4gICAgICAgICAgICBpbnB1dC55ID0gMDtcclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuYXBwLmtleWJvYXJkLmlzUHJlc3NlZChwYy5LRVlfQSkpIGlucHV0LnggPSAtMTtcclxuICAgICAgICAgICAgaWYodGhpcy5hcHAua2V5Ym9hcmQuaXNQcmVzc2VkKHBjLktFWV9EKSkgaW5wdXQueCA9IDE7XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLmFwcC5rZXlib2FyZC5pc1ByZXNzZWQocGMuS0VZX1cpKSBpbnB1dC55ID0gLTE7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYXBwLmtleWJvYXJkLmlzUHJlc3NlZChwYy5LRVlfUykpIGlucHV0LnkgPSAxO1xyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG5cclxuICAgICAgICB0aGlzLm5ldHdvcmsudXBkYXRlKGR0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQoKSB7XHJcbiAgICAgICAgc3VwZXIuc3RhcnQoKTtcclxuICAgICAgICB0aGlzLnNldHVwQXBwKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFJlc2l6ZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBMb2NhbENsaWVudFNjZW5lKCk7XHJcblxyXG4gICAgICAgIHRoaXMubmV0d29yay5jb25uZWN0KCgpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYFtOZXR3b3JrXSBDb25uZWN0ZWQ/ICR7dGhpcy5uZXR3b3JrLmNvbm5lY3RlZH1gKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGE6IElQYWNrZXREYXRhX0Nvbm5lY3RUb1NlcnZlciA9IHtcclxuICAgICAgICAgICAgICAgIGlkOiAnYW55J1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubmV0d29yay5zZW5kKFBhY2tldFR5cGUuQ09OTkVDVF9UT19TRVJWRVIsIGRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0dXBBcHAoKSB7XHJcbiAgICAgICAgY29uc3QgY2FudmFzID0gdGhpcy5fY2FudmFzO1xyXG4gICAgICAgIGNvbnN0IGFwcCA9IG5ldyBwYy5BcHBsaWNhdGlvbihjYW52YXMsIHtcclxuICAgICAgICAgICAgbW91c2U6IG5ldyBwYy5Nb3VzZShjYW52YXMpLFxyXG4gICAgICAgICAgICB0b3VjaDogbmV3IHBjLlRvdWNoRGV2aWNlKGNhbnZhcyksXHJcbiAgICAgICAgICAgIGtleWJvYXJkOiBuZXcgcGMuS2V5Ym9hcmQoZG9jdW1lbnQuYm9keSlcclxuICAgICAgICB9KTtcclxuICAgICAgICBhcHAub24oJ3VwZGF0ZScsIGR0ID0+IHRoaXMudXBkYXRlKGR0KSlcclxuICAgICAgICBhcHAuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fYXBwID0gYXBwO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vcGMucmVnaXN0ZXJTY3JpcHQoQ2FtZXJhRm9sbG93LCAnY2FtZXJhRm9sbG93JywgYXBwKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldHVwUmVzaXplKCkge1xyXG4gICAgICAgIHRoaXMuYXBwLnNldENhbnZhc0ZpbGxNb2RlKHBjLkZJTExNT0RFX0ZJTExfV0lORE9XKTtcclxuICAgICAgICB0aGlzLmFwcC5zZXRDYW52YXNSZXNvbHV0aW9uKHBjLlJFU09MVVRJT05fQVVUTyk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB0aGlzLnJlc2l6ZSgpKTtcclxuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXNpemUoKSB7XHJcbiAgICAgICAgY29uc3QgY2FudmFzID0gdGhpcy5fY2FudmFzO1xyXG5cclxuICAgICAgICB0aGlzLmFwcC5yZXNpemVDYW52YXMoKTtcclxuICAgICAgICBjYW52YXMuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXR1cExvY2FsQ2xpZW50U2NlbmUoKSB7XHJcbiAgICAgICAgY29uc3QgYXBwID0gdGhpcy5hcHA7XHJcblxyXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IG5ldyBwYy5FbnRpdHkoJ2NhbWVyYScpO1xyXG4gICAgICAgIGNhbWVyYS5hZGRDb21wb25lbnQoJ2NhbWVyYScsIHtcclxuICAgICAgICAgICAgY2xlYXJDb2xvcjogbmV3IHBjLkNvbG9yKDAuMSwgMC4xLCAwLjEpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYXBwLnJvb3QuYWRkQ2hpbGQoY2FtZXJhKTtcclxuICAgICAgICBjYW1lcmEuc2V0UG9zaXRpb24oMCwgNSwgMTApO1xyXG4gICAgICAgIGNhbWVyYS5sb29rQXQoMCwgMCwgMCk7XHJcbiAgICAgICAgLy9jYW1lcmEuc2V0RXVsZXJBbmdsZXMoLTkwLCAwLCAwKTtcclxuICAgICAgICAoY2FtZXJhLmFkZENvbXBvbmVudCgnc2NyaXB0JykgYXMgcGMuU2NyaXB0Q29tcG9uZW50KS5jcmVhdGUoJ2NhbWVyYUZvbGxvdycpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGxpZ2h0ID0gbmV3IHBjLkVudGl0eSgnbGlnaHQnKTtcclxuICAgICAgICBsaWdodC5hZGRDb21wb25lbnQoJ2xpZ2h0Jyk7XHJcbiAgICAgICAgYXBwLnJvb3QuYWRkQ2hpbGQobGlnaHQpO1xyXG4gICAgICAgIGxpZ2h0LnNldEV1bGVyQW5nbGVzKDMwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgR2FtZUNsaWVudC5jYW1lcmEgPSBjYW1lcmE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbmRlcigpIHtcclxuICAgICAgICBpZighdGhpcy5tYWluU2VydmVyKSByZXR1cm47XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3Qgd29ybGQgPSB0aGlzLm1haW5TZXJ2ZXIud29ybGRzWzBdO1xyXG5cclxuICAgICAgICB3b3JsZC5lbnRpdGllcy5tYXAoZW50aXR5ID0+IHtcclxuICAgICAgICAgICAgaWYoIWVudGl0eS5wY0VudGl0eSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHNoYXBlID0gZW50aXR5LmJvZHkhLnNoYXBlc1swXSBhcyBDQU5OT04uQm94O1xyXG5cclxuICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IHBjLlN0YW5kYXJkTWF0ZXJpYWwoKTtcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsLmRpZmZ1c2UgPSBlbnRpdHkuY29sb3I7XHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbC51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBlbnRpdHkucGNFbnRpdHkgPSBuZXcgcGMuRW50aXR5KCk7XHJcbiAgICAgICAgICAgICAgICBlbnRpdHkucGNFbnRpdHkuYWRkQ29tcG9uZW50KFwicmVuZGVyXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbDogbWF0ZXJpYWwsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJib3hcIlxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBlbnRpdHkucGNFbnRpdHkuc2V0TG9jYWxTY2FsZShuZXcgcGMuVmVjMyhzaGFwZS5oYWxmRXh0ZW50cy54ICogMiwgc2hhcGUuaGFsZkV4dGVudHMueiAqIDIsIHNoYXBlLmhhbGZFeHRlbnRzLnkgKiAyKSlcclxuXHJcbiAgICAgXHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5hcHAucm9vdC5hZGRDaGlsZChlbnRpdHkucGNFbnRpdHkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwieWFlc1wiKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwb3MgPSBlbnRpdHkuZ2V0UG9zaXRpb24oKTtcclxuICAgICAgICAgICAgY29uc3QgYW5nbGUgPSBuZXcgQ0FOTk9OLlZlYzMoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGVudGl0eS5ib2R5Py5xdWF0ZXJuaW9uLnRvRXVsZXIoYW5nbGUpO1xyXG5cclxuICAgICAgICAgICAgZW50aXR5LnBjRW50aXR5LnNldFBvc2l0aW9uKHBvcy54LCBwb3MueiwgcG9zLnkpO1xyXG4gICAgICAgICAgICBlbnRpdHkucGNFbnRpdHkuc2V0RXVsZXJBbmdsZXMoXHJcbiAgICAgICAgICAgICAgICBhbmdsZS54ICogLXBjLm1hdGguUkFEX1RPX0RFRyxcclxuICAgICAgICAgICAgICAgIGFuZ2xlLnogKiAtcGMubWF0aC5SQURfVE9fREVHLFxyXG4gICAgICAgICAgICAgICAgYW5nbGUueSAqIC1wYy5tYXRoLlJBRF9UT19ERUdcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAvL2VudGl0eS5wY0VudGl0eS5zZXRFdWxlckFuZ2xlcyhhbmdsZS54LCBhbmdsZS56LCBhbmdsZS55KTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgR2FtZUNsaWVudCB9IGZyb20gXCIuL2dhbWUvZ2FtZUNsaWVudFwiO1xyXG5cclxuY29uc3QgZ2FtZSA9IG5ldyBHYW1lQ2xpZW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lJykpO1xyXG5nYW1lLnN0YXJ0KCk7XHJcbndpbmRvd1snZ2FtZSddID0gZ2FtZTtcclxuXHJcbmdhbWUuY3JlYXRlU2VydmVyKCdzZXJ2ZXIxJyk7IiwiaW1wb3J0IHsgaW8sIFNvY2tldCB9IGZyb20gXCJzb2NrZXQuaW8tY2xpZW50XCI7XHJcbmltcG9ydCB7IEdhbWVDbGllbnQgfSBmcm9tIFwiLi4vZ2FtZS9nYW1lQ2xpZW50XCI7XHJcbmltcG9ydCB7IElQYWNrZXQsIElQYWNrZXREYXRhX0Nvbm5lY3RUb1NlcnZlclN0YXR1cywgSVBhY2tldERhdGFfRW50aXR5RGF0YSwgUGFja2V0VHlwZSB9IGZyb20gXCIuLi9wYWNrZXQvcGFja2V0XCI7XHJcbmltcG9ydCB7IFdvcmxkU3luY0hlbHBlciB9IGZyb20gXCIuLi93b3JsZC93b3JsZFN5bmNIZWxwZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBOZXR3b3JrIHtcclxuICAgIHByaXZhdGUgX2dhbWU6IEdhbWVDbGllbnQ7XHJcbiAgICBwcml2YXRlIF9zb2NrZXQ6IFNvY2tldDtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGdhbWUoKSB7IHJldHVybiB0aGlzLl9nYW1lOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHNvY2tldCgpIHsgcmV0dXJuIHRoaXMuX3NvY2tldDsgfVxyXG4gICAgcHVibGljIGdldCBjb25uZWN0ZWQoKSB7IHJldHVybiB0aGlzLl9zb2NrZXQuY29ubmVjdGVkOyB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VuZFBhY2tldHNEZWxheTogbnVtYmVyID0gMjAwO1xyXG4gICAgcHJpdmF0ZSBfc2VuZFRpbWU6IG51bWJlciA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZUNsaWVudCkge1xyXG4gICAgICAgIHRoaXMuX2dhbWUgPSBnYW1lO1xyXG5cclxuICAgICAgICAvL2h0dHBzOi8vZG1kYXNzYy1nYW1lLmdsaXRjaC5tZS9cclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBhZGRyZXNzID0gYCR7bG9jYXRpb24ucHJvdG9jb2x9Ly8ke2xvY2F0aW9uLmhvc3R9YDtcclxuICAgICAgICB0aGlzLl9zb2NrZXQgPSBpbyhhZGRyZXNzLCB7XHJcbiAgICAgICAgICAgIC8vcGF0aDogJy9zb2NrZXQnLFxyXG4gICAgICAgICAgICBhdXRvQ29ubmVjdDogZmFsc2UsXHJcbiAgICAgICAgICAgIHJlY29ubmVjdGlvbjogZmFsc2VcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdwYWNrZXQnLCBwYWNrZXQgPT4gdGhpcy5vblJlY2VpdmVQYWNrZXQocGFja2V0KSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2coYFtOZXR3b3JrXSBBZGRyZXNzOiAoJHthZGRyZXNzfSlgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29ubmVjdChjYWxsYmFjaz86ICgpID0+IHZvaWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgW05ldHdvcmtdIENvbm5lY3RpbmcuLi5gKTtcclxuXHJcbiAgICAgICAgdGhpcy5fc29ja2V0LmNvbm5lY3QoKTtcclxuICAgICAgICB0aGlzLl9zb2NrZXQub25jZSgnY29ubmVjdCcsICgpID0+IHtcclxuICAgICAgICAgICAgY2FsbGJhY2s/LigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3NlbmRUaW1lICs9IGR0O1xyXG5cclxuICAgICAgICBjb25zdCBlbnRpdHkgPSBHYW1lQ2xpZW50LnBsYXllcjtcclxuXHJcbiAgICAgICAgaWYoIWVudGl0eSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZih0aGlzLl9zZW5kVGltZSA8PSB0aGlzLl9zZW5kUGFja2V0c0RlbGF5LzEwMDApIHJldHVybjtcclxuICAgICAgICB0aGlzLl9zZW5kVGltZSA9IDA7XHJcblxyXG4gICAgICAgIGNvbnN0IHBhY2tldERhdGE6IElQYWNrZXREYXRhX0VudGl0eURhdGEgPSB7XHJcbiAgICAgICAgICAgIGVudGl0eUlkOiBlbnRpdHkuaWQsXHJcbiAgICAgICAgICAgIGRhdGE6IGVudGl0eS50b0pTT04oKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZW5kKFBhY2tldFR5cGUuRU5USVRZX0RBVEEsIHBhY2tldERhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZW5kKHR5cGU6IFBhY2tldFR5cGUsIGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBjb25zdCBwYWNrZXQ6IElQYWNrZXQgPSB7XHJcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zb2NrZXQuZW1pdCgncGFja2V0JywgcGFja2V0KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIG9uUmVjZWl2ZVBhY2tldChwYWNrZXQ6IElQYWNrZXQpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHBhY2tldClcclxuXHJcbiAgICAgICAgaWYocGFja2V0LnR5cGUgPT0gUGFja2V0VHlwZS5DT05ORUNUX1RPX1NFUlZFUl9TVEFUVVMpIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YTogSVBhY2tldERhdGFfQ29ubmVjdFRvU2VydmVyU3RhdHVzID0gcGFja2V0LmRhdGE7XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgIEdhbWVDbGllbnQucGxheWVySWQgPSBkYXRhLmVudGl0eUlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYocGFja2V0LnR5cGUgPT0gUGFja2V0VHlwZS5FTlRJVFlfREFUQSkge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhOiBJUGFja2V0RGF0YV9FbnRpdHlEYXRhID0gcGFja2V0LmRhdGE7XHJcblxyXG4gICAgICAgICAgICBXb3JsZFN5bmNIZWxwZXIub25SZWNlaXZlRW50aXR5RGF0YShkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgIHByaXZhdGUgb25SZWNlaXZlUGFja2V0KHBhY2tldDogSVBhY2tldCkge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgKi9cclxufSIsImV4cG9ydCBlbnVtIFBhY2tldFR5cGUge1xyXG4gICAgUkVRVUVTVF9TRVJWRVJfTElTVCxcclxuICAgIFNFUlZFUl9MSVNULFxyXG4gICAgQ09OTkVDVF9UT19TRVJWRVIsXHJcbiAgICBDT05ORUNUX1RPX1NFUlZFUl9TVEFUVVMsXHJcbiAgICBFTlRJVFlfREFUQVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQYWNrZXQge1xyXG4gICAgdHlwZTogUGFja2V0VHlwZVxyXG4gICAgZGF0YT86IGFueVxyXG59XHJcblxyXG4vKlxyXG5leHBvcnQgaW50ZXJmYWNlIElQYWNrZXREYXRhX1NlcnZlckxpc3Qge1xyXG4gICAgc2VydmVyczogU2VydmVySW5mb1tdXHJcbn1cclxuKi9cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhY2tldERhdGFfQ29ubmVjdFRvU2VydmVyIHtcclxuICAgIGlkOiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUGFja2V0RGF0YV9JZCB7XHJcbiAgICBpZDogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhY2tldERhdGFfQ29ubmVjdFRvU2VydmVyU3RhdHVzIHtcclxuICAgIHNlcnZlcklkOiBzdHJpbmdcclxuICAgIGVudGl0eUlkOiBzdHJpbmdcclxuICAgIHN1Y2Nlc3M6IGJvb2xlYW5cclxuICAgIGVycm9yTWVzc2FnZT86IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQYWNrZXREYXRhX0VudGl0eURhdGEge1xyXG4gICAgZW50aXR5SWQ6IHN0cmluZ1xyXG4gICAgZGF0YTogYW55XHJcbn0iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uL2dhbWUvZ2FtZVwiO1xyXG5pbXBvcnQgeyBXb3JsZCB9IGZyb20gXCIuLi93b3JsZC93b3JsZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNlcnZlciB7XHJcbiAgICBwcml2YXRlIF9nYW1lOiBHYW1lO1xyXG4gICAgcHJpdmF0ZSBfd29ybGRzID0gbmV3IE1hcDxzdHJpbmcsIFdvcmxkPigpO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgd29ybGRzKCkgeyByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl93b3JsZHMudmFsdWVzKCkpOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGdhbWUoKSB7IHJldHVybiB0aGlzLl9nYW1lOyB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZSkge1xyXG4gICAgICAgIHRoaXMuX2dhbWUgPSBnYW1lO1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZVdvcmxkKCd3b3JsZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMud29ybGRzLm1hcCh3b3JsZCA9PiB3b3JsZC51cGRhdGUoZHQpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlV29ybGQobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgd29ybGQgPSBuZXcgV29ybGQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5fd29ybGRzLnNldChuYW1lLCB3b3JsZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQ0FOTk9OIGZyb20gJ2Nhbm5vbidcclxuaW1wb3J0ICogYXMgcGMgZnJvbSAncGxheWNhbnZhcyc7XHJcbmltcG9ydCB7IEVudGl0eSB9IGZyb20gJy4uL2VudGl0eS9lbnRpdHknO1xyXG5pbXBvcnQgeyBTZXJ2ZXIgfSBmcm9tIFwiLi4vc2VydmVyL3NlcnZlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdvcmxkIHtcclxuXHJcbiAgICBwcml2YXRlIF9zZXJ2ZXI6IFNlcnZlcjtcclxuICAgIHByaXZhdGUgX2R5bmFtaWNXb3JsZDogQ0FOTk9OLldvcmxkO1xyXG4gICAgcHJpdmF0ZSBfZW50aXRpZXMgPSBuZXcgTWFwPHN0cmluZywgRW50aXR5PigpO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgc2VydmVyKCkgeyByZXR1cm4gdGhpcy5fc2VydmVyIH07XHJcbiAgICBwdWJsaWMgZ2V0IGR5bmFtaWNXb3JsZCgpIHsgcmV0dXJuIHRoaXMuX2R5bmFtaWNXb3JsZCB9O1xyXG4gICAgcHVibGljIGdldCBlbnRpdGllcygpIHsgcmV0dXJuIEFycmF5LmZyb20odGhpcy5fZW50aXRpZXMudmFsdWVzKCkpIH07XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2VydmVyOiBTZXJ2ZXIpIHtcclxuICAgICAgICB0aGlzLl9zZXJ2ZXIgPSBzZXJ2ZXI7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBEeW5hbWljV29ybGQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgZml4ZWRUaW1lU3RlcCA9IDEuMCAvIDYwLjA7IC8vIHNlY29uZHNcclxuICAgICAgICB2YXIgbWF4U3ViU3RlcHMgPSAzO1xyXG5cclxuICAgICAgICB0aGlzLmVudGl0aWVzLm1hcChlbnRpdHkgPT4gZW50aXR5LnVwZGF0ZShkdCkpO1xyXG4gICAgICAgIHRoaXMuZHluYW1pY1dvcmxkLnN0ZXAoZml4ZWRUaW1lU3RlcCwgZHQsIG1heFN1YlN0ZXBzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RW50aXR5KGlkOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZW50aXRpZXMuZ2V0KGlkKSE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhhc0VudGl0eShpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VudGl0aWVzLmhhcyhpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXR1cER5bmFtaWNXb3JsZCgpIHtcclxuXHJcbiAgICAgICAgLy8gU2V0dXAgb3VyIHdvcmxkXHJcbiAgICAgICAgdmFyIHdvcmxkID0gdGhpcy5fZHluYW1pY1dvcmxkID0gbmV3IENBTk5PTi5Xb3JsZCgpO1xyXG4gICAgICAgIHdvcmxkLmdyYXZpdHkgPSBuZXcgQ0FOTk9OLlZlYzMoMCwgMCwgLTkuODIpIC8vIG0vc8KyXHJcblxyXG4gICAgICAgIGNvbnN0IGdyb3VuZCA9IHRoaXMuc3Bhd25FbnRpdHkobmV3IENBTk5PTi5WZWMzKDAsIDAsIDApLCBuZXcgQ0FOTk9OLlZlYzMoMzAsIDMwLCAxKSwge21hc3M6IDB9KTtcclxuICAgICAgICBncm91bmQuZG9udFN5bmMgPSB0cnVlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICAvL2NvbnN0IGJveCA9IHRoaXMuc3Bhd25UZXN0RW50aXR5KG5ldyBDQU5OT04uVmVjMygwLCAwLCA0KSwgbmV3IENBTk5PTi5WZWMzKDEsIDEsIDEpLCB7bWFzczogMjAwfSk7XHJcbiAgICAgICAgLy9jb25zdCBib3gyID0gdGhpcy5zcGF3blRlc3RFbnRpdHkobmV3IENBTk5PTi5WZWMzKDAsIDEsIDgpLCBuZXcgQ0FOTk9OLlZlYzMoMSwgMSwgMSksIHttYXNzOiAyMDB9KTtcclxuICAgICAgICBcclxuICAgICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiZ3JvdW5kOiBcIiArIHRoaXMucHJpbnRQb3NpdGlvbihncm91bmQuZ2V0UG9zaXRpb24oKSkpO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYm94OiBcIiArIHRoaXMucHJpbnRQb3NpdGlvbihib3guZ2V0UG9zaXRpb24oKSkpO1xyXG5cclxuICAgICAgICB9LCAyNTApXHJcblxyXG4gICAgICAgIC8vc2V0SW50ZXJ2YWwoKCkgPT4geyB0aGlzLnNwYXduVGVzdEVudGl0eSgpOyB9LCAxMDAwKVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzcGF3bkVudGl0eShwb3NpdGlvbj86IENBTk5PTi5WZWMzLCBoYWxmRXh0ZW5kcz86IENBTk5PTi5WZWMzLCBvcHRpb25zPzogQ0FOTk9OLklCb2R5T3B0aW9ucywgY29sb3I/OiBwYy5Db2xvciwgY3VzdG9tSWQ/OiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge21hc3M6IDUwfTtcclxuICAgICAgICBjb2xvciA9IGNvbG9yIHx8IG5ldyBwYy5Db2xvcigxLCAxLCAxKTtcclxuXHJcbiAgICAgICAgY29uc3QgYm9keSA9IHRoaXMuY3JlYXRlUmVjdGFuZ2xlQm9keShwb3NpdGlvbiB8fCBuZXcgQ0FOTk9OLlZlYzMoTWF0aC5yYW5kb20oKSo2LTMsIE1hdGgucmFuZG9tKCkqNi0zLCAzKSwgaGFsZkV4dGVuZHMgfHwgbmV3IENBTk5PTi5WZWMzKDAuMiwgMC4yLCAwLjIpLCBvcHRpb25zKTtcclxuICAgICAgICBcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgY29uc3QgZW50aXR5ID0gbmV3IEVudGl0eSh0aGlzKTtcclxuICAgICAgICBlbnRpdHkuY29sb3IgPSBjb2xvcjtcclxuICAgICAgICBlbnRpdHkuc2V0Qm9keShib2R5KVxyXG4gICAgICAgIGlmKGN1c3RvbUlkKSBlbnRpdHkuc2V0SWQoY3VzdG9tSWQpO1xyXG5cclxuICAgICAgICB0aGlzLl9lbnRpdGllcy5zZXQoZW50aXR5LmlkLCBlbnRpdHkpO1xyXG5cclxuICAgICAgICByZXR1cm4gZW50aXR5O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcHJpbnRQb3NpdGlvbihwb3M6IENBTk5PTi5WZWMzKSB7XHJcbiAgICAgICAgcmV0dXJuIGAoJHtwb3MueH0sICR7cG9zLnl9LCAke3Bvcy56fSlgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZVJlY3RhbmdsZUJvZHkocG9zaXRpb246IENBTk5PTi5WZWMzLCBoYWxmRXh0ZW5kczogQ0FOTk9OLlZlYzMsIG9wdGlvbnM/OiBDQU5OT04uSUJvZHlPcHRpb25zKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3Qgb3B0ID0gb3B0aW9ucyB8fCB7fTtcclxuXHJcbiAgICAgICAgb3B0LnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICAgXHJcbiAgICAgICAgdmFyIHNoYXBlID0gbmV3IENBTk5PTi5Cb3goaGFsZkV4dGVuZHMpO1xyXG4gICAgICAgIHZhciBib2R5ID0gbmV3IENBTk5PTi5Cb2R5KG9wdCk7XHJcbiAgICAgICAgYm9keS5hZGRTaGFwZShzaGFwZSk7XHJcblxyXG4gICAgICAgIHRoaXMuZHluYW1pY1dvcmxkLmFkZEJvZHkoYm9keSk7XHJcblxyXG4gICAgICAgIHJldHVybiBib2R5OyBcclxuICAgIH1cclxufVxyXG5cclxuLypcclxuY29uc3QgZW50aXR5ID0gbmV3IHBjLkVudGl0eShuYW1lKTtcclxuZW50aXR5LnNldFBvc2l0aW9uKHBvc2l0aW9uKVxyXG50aGlzLmNyZWF0ZVJlY3RhbmdsZUF0RW50aXR5KGVudGl0eSwgc2l6ZSwgaXNEeW5hbWljLCBjb2xvcik7XHJcbmFwcC5yb290LmFkZENoaWxkKGVudGl0eSk7XHJcbiovIiwiaW1wb3J0ICogYXMgcGMgZnJvbSBcInBsYXljYW52YXNcIjtcclxuaW1wb3J0IHsgRW50aXR5IH0gZnJvbSBcIi4uL2VudGl0eS9lbnRpdHlcIjtcclxuaW1wb3J0IHsgR2FtZUNsaWVudCB9IGZyb20gXCIuLi9nYW1lL2dhbWVDbGllbnRcIjtcclxuaW1wb3J0IHsgSVBhY2tldERhdGFfRW50aXR5RGF0YSB9IGZyb20gXCIuLi9wYWNrZXQvcGFja2V0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGRTeW5jSGVscGVyIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdhbWUoKSB7IHJldHVybiBHYW1lQ2xpZW50Lkluc3RhbmNlOyB9O1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgb25SZWNlaXZlRW50aXR5RGF0YShkYXRhOiBJUGFja2V0RGF0YV9FbnRpdHlEYXRhKSB7XHJcbiAgICAgICAgY29uc3Qgd29ybGQgPSB0aGlzLmdhbWUubWFpblNlcnZlci53b3JsZHNbMF07XHJcblxyXG4gICAgICAgIGxldCBpc05ld0VudGl0eTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZighd29ybGQuaGFzRW50aXR5KGRhdGEuZW50aXR5SWQpKSB7XHJcbiAgICAgICAgICAgIHdvcmxkLnNwYXduRW50aXR5KHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIG5ldyBwYy5Db2xvcigxLCAwLCAwKSwgZGF0YS5lbnRpdHlJZCk7XHJcbiAgICAgICAgICAgIGlzTmV3RW50aXR5ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCduZXcgZW50aXknKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZW50aXR5ID0gd29ybGQuZ2V0RW50aXR5KGRhdGEuZW50aXR5SWQpO1xyXG5cclxuICAgICAgICBlbnRpdHkuZnJvbUpTT04oZGF0YS5kYXRhKTtcclxuXHJcbiAgICAgICAgaWYoaXNOZXdFbnRpdHkpIHtcclxuICAgICAgICAgICAgZW50aXR5LmNhbkxlcnAgPSB0cnVlO1xyXG4gICAgICAgICAgICAvL2VudGl0eS5zY3JpcHQhLmNyZWF0ZSgnZW50aXR5U3luYycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIGlmKGVudGl0eS5pZCA9PSBHYW1lQ2xpZW50LnBsYXllcklkKSB7XHJcblxyXG4gICAgICAgICAgICBpZighR2FtZUNsaWVudC5wbGF5ZXIpIHtcclxuICAgICAgICAgICAgICAgIEdhbWVDbGllbnQucGxheWVyID0gZW50aXR5IGFzIEVudGl0eTtcclxuICAgICAgICAgICAgICAgIEdhbWVDbGllbnQucGxheWVyLmNhbkxlcnAgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIC8vR2FtZUNsaWVudC5wbGF5ZXIuc2V0Q29udHJvbGxhYmxlKCk7XHJcbiAgICAgICAgICAgICAgICAvL0dhbWVDbGllbnQuY2FtZXJhRm9sbG93RW50aXR5KGVudGl0eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkc1tpXV0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtkbWRhc3NjX2dhbWVcIl0gPSBzZWxmW1wid2VicGFja0NodW5rZG1kYXNzY19nYW1lXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxuX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9yc1wiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKSkpXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnNcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi93ZWJwYWNrL2NyZWRpdHMuanNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==