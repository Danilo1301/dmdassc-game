/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/entity/entity.ts":
/*!******************************!*\
  !*** ./src/entity/entity.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Entity = void 0;
const cannon_1 = __importDefault(__webpack_require__(/*! cannon */ "./node_modules/cannon/build/cannon.js"));
class Entity {
    constructor(world) {
        this.dontSync = false;
        this._position = new cannon_1.default.Vec3();
        this._quaternion = new cannon_1.default.Quaternion();
        this._id = `${Math.random()}`;
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
    toJSON() {
        const position = this.getPosition();
        const quat = this.getQuaternion();
        const rotation = new cannon_1.default.Vec3();
        quat.toEuler(rotation);
        const velocity = this.getVelocity();
        const data = {
            x: position.x,
            y: position.y,
            z: position.z,
            rx: rotation.x,
            ry: rotation.y,
            rz: rotation.z,
        };
        return data;
    }
    fromJSON(data) {
        var _a;
        const newPosition = this.getPosition();
        if (data.x !== undefined)
            newPosition.x = data.x;
        if (data.y !== undefined)
            newPosition.y = data.y;
        if (data.z !== undefined)
            newPosition.z = data.z;
        const newRotation = new cannon_1.default.Vec3();
        if (data.rx !== undefined)
            newRotation.x = data.rx;
        if (data.ry !== undefined)
            newRotation.y = data.ry;
        if (data.rz !== undefined)
            newRotation.z = data.rz;
        this.getQuaternion().setFromEuler(newRotation.x, newRotation.y, newRotation.z);
        /*
        const currentQuaternion = this.getQuaternion();
        const newQuaternion = new CANNON.Quaternion();
        newQuaternion.setFromEuler(newRotation.x, newRotation.y, newRotation.z);

        const q1 = new pc.Quat(currentQuaternion.x, currentQuaternion.y, currentQuaternion.z, currentQuaternion.w);
        const q2 = new pc.Quat(newQuaternion.x, newQuaternion.y, newQuaternion.z, newQuaternion.w);
        const q = new pc.Quat().slerp(q1, q2, 1);

        this.getQuaternion().set(q.x, q.y, q.z, q.w)

        */
        /*
        const currentRotation = new CANNON.Vec3();
        const newRotation = new CANNON.Vec3();
        this.getQuaternion().toEuler(currentRotation);
        this.getQuaternion().toEuler(newRotation);

        if(data.rx !== undefined) newRotation.x = data.rx;
        if(data.ry !== undefined) newRotation.y = data.ry;
        if(data.rz !== undefined) newRotation.z = data.rz;

        currentRotation.lerp(newRotation, 0.1, currentRotation);

        this.body?.quaternion.setFromEuler(newRotation.x, newRotation.y, newRotation.z);
        */
        (_a = this.body) === null || _a === void 0 ? void 0 : _a.angularVelocity.setZero();
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
        camera.setPosition(-30, 30, -50);
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
                material.diffuse = new pc.Color(1, 1, 1);
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
        this._lastSentPackets = 0;
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

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.World = void 0;
const cannon_1 = __importDefault(__webpack_require__(/*! cannon */ "./node_modules/cannon/build/cannon.js"));
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
    spawnEntity(position, halfExtends, options, customId) {
        options = options || { mass: 200 };
        const body = this.createRectangleBody(position || new cannon_1.default.Vec3(Math.random() * 6 - 3, Math.random() * 6 - 3, 3), halfExtends || new cannon_1.default.Vec3(1, 1, 1), options);
        const entity = new entity_1.Entity(this);
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
        if (!world.hasEntity(data.entityId)) {
            world.spawnEntity(undefined, undefined, undefined, data.entityId);
            isNewEntity = true;
            console.log('new entiy');
        }
        const entity = world.getEntity(data.entityId);
        entity.fromJSON(data.data);
        if (isNewEntity) {
            //entity.script!.create('entitySync');
        }
        if (entity.id == gameClient_1.GameClient.playerId) {
            if (!gameClient_1.GameClient.player) {
                gameClient_1.GameClient.player = entity;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1VFaERBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9lbnRpdHkvZW50aXR5LnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9nYW1lL2dhbWUudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL2dhbWUvZ2FtZUNsaWVudC50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL25ldHdvcmsvbmV0d29yay50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvcGFja2V0L3BhY2tldC50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvc2VydmVyL3NlcnZlci50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvd29ybGQvd29ybGQudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL3dvcmxkL3dvcmxkU3luY0hlbHBlci50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBjIGZyb20gJ3BsYXljYW52YXMnO1xyXG5pbXBvcnQgQ0FOTk9OIGZyb20gJ2Nhbm5vbic7XHJcbmltcG9ydCB7IFdvcmxkIH0gZnJvbSBcIi4uL3dvcmxkL3dvcmxkXCI7XHJcbmltcG9ydCBQaGFzZXIgZnJvbSAncGhhc2VyJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUVudGl0eURhdGEge1xyXG4gICAgeD86IG51bWJlclxyXG4gICAgeT86IG51bWJlclxyXG4gICAgej86IG51bWJlclxyXG4gICAgcng/OiBudW1iZXJcclxuICAgIHJ5PzogbnVtYmVyXHJcbiAgICByej86IG51bWJlclxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRW50aXR5IHtcclxuICAgIHB1YmxpYyBkb250U3luYzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIHBjRW50aXR5PzogcGMuRW50aXR5O1xyXG5cclxuICAgIHByaXZhdGUgX3Bvc2l0aW9uID0gbmV3IENBTk5PTi5WZWMzKCk7XHJcbiAgICBwcml2YXRlIF9xdWF0ZXJuaW9uID0gbmV3IENBTk5PTi5RdWF0ZXJuaW9uKCk7XHJcblxyXG4gICAgcHJpdmF0ZSBfaWQ6IHN0cmluZyA9IGAke01hdGgucmFuZG9tKCl9YDtcclxuICAgIHByaXZhdGUgX3dvcmxkOiBXb3JsZDtcclxuICAgIHByaXZhdGUgX2JvZHk/OiBDQU5OT04uQm9keTtcclxuICAgIFxyXG4gICAgcHVibGljIGdldCBpZCgpIHsgcmV0dXJuIHRoaXMuX2lkOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGJvZHkoKSB7IHJldHVybiB0aGlzLl9ib2R5OyB9XHJcblxyXG4gICAgY29uc3RydWN0b3Iod29ybGQ6IFdvcmxkKSB7XHJcbiAgICAgICAgdGhpcy5fd29ybGQgPSB3b3JsZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Qm9keShib2R5OiBDQU5OT04uQm9keSkge1xyXG4gICAgICAgIHRoaXMuX2JvZHkgPSBib2R5O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRJZChpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5faWQgPSBpZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UG9zaXRpb24oKSB7XHJcbiAgICAgICAgaWYodGhpcy5fYm9keSkgcmV0dXJuIHRoaXMuX2JvZHkucG9zaXRpb247XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRRdWF0ZXJuaW9uKCkge1xyXG4gICAgICAgIGlmKHRoaXMuX2JvZHkpIHJldHVybiB0aGlzLl9ib2R5LnF1YXRlcm5pb247XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3F1YXRlcm5pb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFZlbG9jaXR5KCkge1xyXG4gICAgICAgIGlmKHRoaXMuX2JvZHkpIHJldHVybiB0aGlzLl9ib2R5LnZlbG9jaXR5O1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9xdWF0ZXJuaW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b0pTT04oKSB7XHJcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmdldFBvc2l0aW9uKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHF1YXQgPSB0aGlzLmdldFF1YXRlcm5pb24oKTtcclxuICAgICAgICBjb25zdCByb3RhdGlvbiA9IG5ldyBDQU5OT04uVmVjMygpO1xyXG4gICAgICAgIHF1YXQudG9FdWxlcihyb3RhdGlvbik7XHJcblxyXG4gICAgICAgIGNvbnN0IHZlbG9jaXR5ID0gdGhpcy5nZXRWZWxvY2l0eSgpO1xyXG5cclxuICAgICAgICBjb25zdCBkYXRhOiBJRW50aXR5RGF0YSA9IHtcclxuICAgICAgICAgICAgeDogcG9zaXRpb24ueCxcclxuICAgICAgICAgICAgeTogcG9zaXRpb24ueSxcclxuICAgICAgICAgICAgejogcG9zaXRpb24ueixcclxuXHJcbiAgICAgICAgICAgIHJ4OiByb3RhdGlvbi54LFxyXG4gICAgICAgICAgICByeTogcm90YXRpb24ueSxcclxuICAgICAgICAgICAgcno6IHJvdGF0aW9uLnosXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZnJvbUpTT04oZGF0YTogSUVudGl0eURhdGEpIHtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBuZXdQb3NpdGlvbiA9IHRoaXMuZ2V0UG9zaXRpb24oKTtcclxuXHJcbiAgICAgICAgaWYoZGF0YS54ICE9PSB1bmRlZmluZWQpIG5ld1Bvc2l0aW9uLnggPSBkYXRhLnhcclxuICAgICAgICBpZihkYXRhLnkgIT09IHVuZGVmaW5lZCkgbmV3UG9zaXRpb24ueSA9IGRhdGEueVxyXG4gICAgICAgIGlmKGRhdGEueiAhPT0gdW5kZWZpbmVkKSBuZXdQb3NpdGlvbi56ID0gZGF0YS56XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld1JvdGF0aW9uID0gbmV3IENBTk5PTi5WZWMzKCk7XHJcbiAgICAgICAgaWYoZGF0YS5yeCAhPT0gdW5kZWZpbmVkKSBuZXdSb3RhdGlvbi54ID0gZGF0YS5yeDtcclxuICAgICAgICBpZihkYXRhLnJ5ICE9PSB1bmRlZmluZWQpIG5ld1JvdGF0aW9uLnkgPSBkYXRhLnJ5O1xyXG4gICAgICAgIGlmKGRhdGEucnogIT09IHVuZGVmaW5lZCkgbmV3Um90YXRpb24ueiA9IGRhdGEucno7XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0UXVhdGVybmlvbigpLnNldEZyb21FdWxlcihuZXdSb3RhdGlvbi54LCBuZXdSb3RhdGlvbi55LCBuZXdSb3RhdGlvbi56KVxyXG5cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICBjb25zdCBjdXJyZW50UXVhdGVybmlvbiA9IHRoaXMuZ2V0UXVhdGVybmlvbigpO1xyXG4gICAgICAgIGNvbnN0IG5ld1F1YXRlcm5pb24gPSBuZXcgQ0FOTk9OLlF1YXRlcm5pb24oKTtcclxuICAgICAgICBuZXdRdWF0ZXJuaW9uLnNldEZyb21FdWxlcihuZXdSb3RhdGlvbi54LCBuZXdSb3RhdGlvbi55LCBuZXdSb3RhdGlvbi56KTtcclxuXHJcbiAgICAgICAgY29uc3QgcTEgPSBuZXcgcGMuUXVhdChjdXJyZW50UXVhdGVybmlvbi54LCBjdXJyZW50UXVhdGVybmlvbi55LCBjdXJyZW50UXVhdGVybmlvbi56LCBjdXJyZW50UXVhdGVybmlvbi53KTtcclxuICAgICAgICBjb25zdCBxMiA9IG5ldyBwYy5RdWF0KG5ld1F1YXRlcm5pb24ueCwgbmV3UXVhdGVybmlvbi55LCBuZXdRdWF0ZXJuaW9uLnosIG5ld1F1YXRlcm5pb24udyk7XHJcbiAgICAgICAgY29uc3QgcSA9IG5ldyBwYy5RdWF0KCkuc2xlcnAocTEsIHEyLCAxKTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRRdWF0ZXJuaW9uKCkuc2V0KHEueCwgcS55LCBxLnosIHEudylcclxuXHJcbiAgICAgICAgKi9cclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcblxyXG5cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICBjb25zdCBjdXJyZW50Um90YXRpb24gPSBuZXcgQ0FOTk9OLlZlYzMoKTtcclxuICAgICAgICBjb25zdCBuZXdSb3RhdGlvbiA9IG5ldyBDQU5OT04uVmVjMygpO1xyXG4gICAgICAgIHRoaXMuZ2V0UXVhdGVybmlvbigpLnRvRXVsZXIoY3VycmVudFJvdGF0aW9uKTtcclxuICAgICAgICB0aGlzLmdldFF1YXRlcm5pb24oKS50b0V1bGVyKG5ld1JvdGF0aW9uKTtcclxuXHJcbiAgICAgICAgaWYoZGF0YS5yeCAhPT0gdW5kZWZpbmVkKSBuZXdSb3RhdGlvbi54ID0gZGF0YS5yeDtcclxuICAgICAgICBpZihkYXRhLnJ5ICE9PSB1bmRlZmluZWQpIG5ld1JvdGF0aW9uLnkgPSBkYXRhLnJ5O1xyXG4gICAgICAgIGlmKGRhdGEucnogIT09IHVuZGVmaW5lZCkgbmV3Um90YXRpb24ueiA9IGRhdGEucno7XHJcblxyXG4gICAgICAgIGN1cnJlbnRSb3RhdGlvbi5sZXJwKG5ld1JvdGF0aW9uLCAwLjEsIGN1cnJlbnRSb3RhdGlvbik7XHJcblxyXG4gICAgICAgIHRoaXMuYm9keT8ucXVhdGVybmlvbi5zZXRGcm9tRXVsZXIobmV3Um90YXRpb24ueCwgbmV3Um90YXRpb24ueSwgbmV3Um90YXRpb24ueik7XHJcbiAgICAgICAgKi9cclxuXHJcbiAgICAgICAgdGhpcy5ib2R5Py5hbmd1bGFyVmVsb2NpdHkuc2V0WmVybygpO1xyXG4gICAgfVxyXG59ICAgIiwiXHJcbmltcG9ydCAqIGFzIHBjIGZyb20gJ3BsYXljYW52YXMnXHJcbmltcG9ydCB7IFNlcnZlciB9IGZyb20gJy4uL3NlcnZlci9zZXJ2ZXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWUge1xyXG4gICAgcHJpdmF0ZSBfaXNTZXJ2ZXI6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgX3NlcnZlcnMgPSBuZXcgTWFwPHN0cmluZywgU2VydmVyPigpO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNTZXJ2ZXIoKSB7IHJldHVybiB0aGlzLl9pc1NlcnZlcjsgfVxyXG4gICAgcHVibGljIGdldCBzZXJ2ZXJzKCkgeyByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl9zZXJ2ZXJzLnZhbHVlcygpKTsgfVxyXG4gICAgcHVibGljIGdldCBtYWluU2VydmVyKCkgeyByZXR1cm4gdGhpcy5zZXJ2ZXJzWzBdOyB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoaXNTZXJ2ZXI/OiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5faXNTZXJ2ZXIgPSBpc1NlcnZlciA9PT0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFtHYW1lXSBzdGFydDsgaXNTZXJ2ZXIgPWAsIHRoaXMuaXNTZXJ2ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVTZXJ2ZXIoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHNlcnZlciA9IG5ldyBTZXJ2ZXIodGhpcyk7XHJcbiAgICAgICAgdGhpcy5fc2VydmVycy5zZXQoaWQsIHNlcnZlcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZShkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5zZXJ2ZXJzLm1hcChzZXJ2ZXIgPT4gc2VydmVyLnVwZGF0ZShkdCkpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IENBTk5PTiBmcm9tICdjYW5ub24nXHJcbmltcG9ydCAqIGFzIHBjIGZyb20gXCJwbGF5Y2FudmFzXCI7XHJcbmltcG9ydCB7IEVudGl0eSB9IGZyb20gJy4uL2VudGl0eS9lbnRpdHknO1xyXG5pbXBvcnQgeyBOZXR3b3JrIH0gZnJvbSBcIi4uL25ldHdvcmsvbmV0d29ya1wiO1xyXG5pbXBvcnQgeyBJUGFja2V0RGF0YV9Db25uZWN0VG9TZXJ2ZXIsIFBhY2tldFR5cGUgfSBmcm9tICcuLi9wYWNrZXQvcGFja2V0JztcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuL2dhbWVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lQ2xpZW50IGV4dGVuZHMgR2FtZSB7XHJcbiAgICBwdWJsaWMgc3RhdGljIEluc3RhbmNlOiBHYW1lQ2xpZW50O1xyXG4gICAgcHVibGljIHN0YXRpYyBjYW1lcmE6IHBjLkVudGl0eTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcGxheWVySWQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgc3RhdGljIHBsYXllcj86IEVudGl0eTtcclxuXHJcbiAgICBwcml2YXRlIF9hcHA6IHBjLkFwcGxpY2F0aW9uO1xyXG4gICAgcHJpdmF0ZSBfY2FudmFzO1xyXG4gICAgcHJpdmF0ZSBfbmV0d29yazogTmV0d29yaztcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGFwcCgpIHsgcmV0dXJuIHRoaXMuX2FwcDsgfVxyXG4gICAgcHVibGljIGdldCBuZXR3b3JrKCkgeyByZXR1cm4gdGhpcy5fbmV0d29yazsgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNhbnZhcykge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgIHRoaXMuX25ldHdvcmsgPSBuZXcgTmV0d29yayh0aGlzKTtcclxuICAgICAgICBHYW1lQ2xpZW50Lkluc3RhbmNlID0gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlci51cGRhdGUoZHQpO1xyXG5cclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG5cclxuICAgICAgICB0aGlzLm5ldHdvcmsudXBkYXRlKGR0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQoKSB7XHJcbiAgICAgICAgc3VwZXIuc3RhcnQoKTtcclxuICAgICAgICB0aGlzLnNldHVwQXBwKCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cFJlc2l6ZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBMb2NhbENsaWVudFNjZW5lKCk7XHJcblxyXG4gICAgICAgIHRoaXMubmV0d29yay5jb25uZWN0KCgpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYFtOZXR3b3JrXSBDb25uZWN0ZWQ/ICR7dGhpcy5uZXR3b3JrLmNvbm5lY3RlZH1gKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGE6IElQYWNrZXREYXRhX0Nvbm5lY3RUb1NlcnZlciA9IHtcclxuICAgICAgICAgICAgICAgIGlkOiAnYW55J1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubmV0d29yay5zZW5kKFBhY2tldFR5cGUuQ09OTkVDVF9UT19TRVJWRVIsIGRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0dXBBcHAoKSB7XHJcbiAgICAgICAgY29uc3QgY2FudmFzID0gdGhpcy5fY2FudmFzO1xyXG4gICAgICAgIGNvbnN0IGFwcCA9IG5ldyBwYy5BcHBsaWNhdGlvbihjYW52YXMsIHtcclxuICAgICAgICAgICAgbW91c2U6IG5ldyBwYy5Nb3VzZShjYW52YXMpLFxyXG4gICAgICAgICAgICB0b3VjaDogbmV3IHBjLlRvdWNoRGV2aWNlKGNhbnZhcyksXHJcbiAgICAgICAgICAgIGtleWJvYXJkOiBuZXcgcGMuS2V5Ym9hcmQoZG9jdW1lbnQuYm9keSlcclxuICAgICAgICB9KTtcclxuICAgICAgICBhcHAub24oJ3VwZGF0ZScsIGR0ID0+IHRoaXMudXBkYXRlKGR0KSlcclxuICAgICAgICBhcHAuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fYXBwID0gYXBwO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vcGMucmVnaXN0ZXJTY3JpcHQoQ2FtZXJhRm9sbG93LCAnY2FtZXJhRm9sbG93JywgYXBwKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldHVwUmVzaXplKCkge1xyXG4gICAgICAgIHRoaXMuYXBwLnNldENhbnZhc0ZpbGxNb2RlKHBjLkZJTExNT0RFX0ZJTExfV0lORE9XKTtcclxuICAgICAgICB0aGlzLmFwcC5zZXRDYW52YXNSZXNvbHV0aW9uKHBjLlJFU09MVVRJT05fQVVUTyk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB0aGlzLnJlc2l6ZSgpKTtcclxuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXNpemUoKSB7XHJcbiAgICAgICAgY29uc3QgY2FudmFzID0gdGhpcy5fY2FudmFzO1xyXG5cclxuICAgICAgICB0aGlzLmFwcC5yZXNpemVDYW52YXMoKTtcclxuICAgICAgICBjYW52YXMuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXR1cExvY2FsQ2xpZW50U2NlbmUoKSB7XHJcbiAgICAgICAgY29uc3QgYXBwID0gdGhpcy5hcHA7XHJcblxyXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IG5ldyBwYy5FbnRpdHkoJ2NhbWVyYScpO1xyXG4gICAgICAgIGNhbWVyYS5hZGRDb21wb25lbnQoJ2NhbWVyYScsIHtcclxuICAgICAgICAgICAgY2xlYXJDb2xvcjogbmV3IHBjLkNvbG9yKDAuMSwgMC4xLCAwLjEpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYXBwLnJvb3QuYWRkQ2hpbGQoY2FtZXJhKTtcclxuICAgICAgICBjYW1lcmEuc2V0UG9zaXRpb24oLTMwLCAzMCwgLTUwKTtcclxuICAgICAgICBjYW1lcmEubG9va0F0KDAsIDAsIDApO1xyXG4gICAgICAgIC8vY2FtZXJhLnNldEV1bGVyQW5nbGVzKC05MCwgMCwgMCk7XHJcbiAgICAgICAgKGNhbWVyYS5hZGRDb21wb25lbnQoJ3NjcmlwdCcpIGFzIHBjLlNjcmlwdENvbXBvbmVudCkuY3JlYXRlKCdjYW1lcmFGb2xsb3cnKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBsaWdodCA9IG5ldyBwYy5FbnRpdHkoJ2xpZ2h0Jyk7XHJcbiAgICAgICAgbGlnaHQuYWRkQ29tcG9uZW50KCdsaWdodCcpO1xyXG4gICAgICAgIGFwcC5yb290LmFkZENoaWxkKGxpZ2h0KTtcclxuICAgICAgICBsaWdodC5zZXRFdWxlckFuZ2xlcygzMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIEdhbWVDbGllbnQuY2FtZXJhID0gY2FtZXJhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW5kZXIoKSB7XHJcbiAgICAgICAgaWYoIXRoaXMubWFpblNlcnZlcikgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCB3b3JsZCA9IHRoaXMubWFpblNlcnZlci53b3JsZHNbMF07XHJcblxyXG4gICAgICAgIHdvcmxkLmVudGl0aWVzLm1hcChlbnRpdHkgPT4ge1xyXG4gICAgICAgICAgICBpZighZW50aXR5LnBjRW50aXR5KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hhcGUgPSBlbnRpdHkuYm9keSEuc2hhcGVzWzBdIGFzIENBTk5PTi5Cb3g7XHJcblxyXG4gICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgcGMuU3RhbmRhcmRNYXRlcmlhbCgpO1xyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwuZGlmZnVzZSA9IG5ldyBwYy5Db2xvcigxLCAxLCAxKTtcclxuICAgICAgICAgICAgICAgIG1hdGVyaWFsLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGVudGl0eS5wY0VudGl0eSA9IG5ldyBwYy5FbnRpdHkoKTtcclxuICAgICAgICAgICAgICAgIGVudGl0eS5wY0VudGl0eS5hZGRDb21wb25lbnQoXCJyZW5kZXJcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsOiBtYXRlcmlhbCxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImJveFwiXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGVudGl0eS5wY0VudGl0eS5zZXRMb2NhbFNjYWxlKG5ldyBwYy5WZWMzKHNoYXBlLmhhbGZFeHRlbnRzLnggKiAyLCBzaGFwZS5oYWxmRXh0ZW50cy56ICogMiwgc2hhcGUuaGFsZkV4dGVudHMueSAqIDIpKVxyXG5cclxuICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC5yb290LmFkZENoaWxkKGVudGl0eS5wY0VudGl0eSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ5YWVzXCIpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBvcyA9IGVudGl0eS5nZXRQb3NpdGlvbigpO1xyXG4gICAgICAgICAgICBjb25zdCBhbmdsZSA9IG5ldyBDQU5OT04uVmVjMygpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZW50aXR5LmJvZHk/LnF1YXRlcm5pb24udG9FdWxlcihhbmdsZSk7XHJcblxyXG4gICAgICAgICAgICBlbnRpdHkucGNFbnRpdHkuc2V0UG9zaXRpb24ocG9zLngsIHBvcy56LCBwb3MueSk7XHJcbiAgICAgICAgICAgIGVudGl0eS5wY0VudGl0eS5zZXRFdWxlckFuZ2xlcyhcclxuICAgICAgICAgICAgICAgIGFuZ2xlLnggKiAtcGMubWF0aC5SQURfVE9fREVHLFxyXG4gICAgICAgICAgICAgICAgYW5nbGUueiAqIC1wYy5tYXRoLlJBRF9UT19ERUcsXHJcbiAgICAgICAgICAgICAgICBhbmdsZS55ICogLXBjLm1hdGguUkFEX1RPX0RFR1xyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIC8vZW50aXR5LnBjRW50aXR5LnNldEV1bGVyQW5nbGVzKGFuZ2xlLngsIGFuZ2xlLnosIGFuZ2xlLnkpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBHYW1lQ2xpZW50IH0gZnJvbSBcIi4vZ2FtZS9nYW1lQ2xpZW50XCI7XHJcblxyXG5jb25zdCBnYW1lID0gbmV3IEdhbWVDbGllbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dhbWUnKSk7XHJcbmdhbWUuc3RhcnQoKTtcclxud2luZG93WydnYW1lJ10gPSBnYW1lO1xyXG5cclxuZ2FtZS5jcmVhdGVTZXJ2ZXIoJ3NlcnZlcjEnKTsiLCJpbXBvcnQgeyBpbywgU29ja2V0IH0gZnJvbSBcInNvY2tldC5pby1jbGllbnRcIjtcclxuaW1wb3J0IHsgR2FtZUNsaWVudCB9IGZyb20gXCIuLi9nYW1lL2dhbWVDbGllbnRcIjtcclxuaW1wb3J0IHsgSVBhY2tldCwgSVBhY2tldERhdGFfQ29ubmVjdFRvU2VydmVyU3RhdHVzLCBJUGFja2V0RGF0YV9FbnRpdHlEYXRhLCBQYWNrZXRUeXBlIH0gZnJvbSBcIi4uL3BhY2tldC9wYWNrZXRcIjtcclxuaW1wb3J0IHsgV29ybGRTeW5jSGVscGVyIH0gZnJvbSBcIi4uL3dvcmxkL3dvcmxkU3luY0hlbHBlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE5ldHdvcmsge1xyXG4gICAgcHJpdmF0ZSBfZ2FtZTogR2FtZUNsaWVudDtcclxuICAgIHByaXZhdGUgX3NvY2tldDogU29ja2V0O1xyXG5cclxuICAgIHB1YmxpYyBnZXQgZ2FtZSgpIHsgcmV0dXJuIHRoaXMuX2dhbWU7IH1cclxuICAgIHB1YmxpYyBnZXQgc29ja2V0KCkgeyByZXR1cm4gdGhpcy5fc29ja2V0OyB9XHJcbiAgICBwdWJsaWMgZ2V0IGNvbm5lY3RlZCgpIHsgcmV0dXJuIHRoaXMuX3NvY2tldC5jb25uZWN0ZWQ7IH1cclxuXHJcbiAgICBwcml2YXRlIF9zZW5kUGFja2V0c0RlbGF5OiBudW1iZXIgPSAyMDA7XHJcbiAgICBwcml2YXRlIF9sYXN0U2VudFBhY2tldHM6IG51bWJlciA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZUNsaWVudCkge1xyXG4gICAgICAgIHRoaXMuX2dhbWUgPSBnYW1lO1xyXG5cclxuICAgICAgICAvL2h0dHBzOi8vZG1kYXNzYy1nYW1lLmdsaXRjaC5tZS9cclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBhZGRyZXNzID0gYCR7bG9jYXRpb24ucHJvdG9jb2x9Ly8ke2xvY2F0aW9uLmhvc3R9YDtcclxuICAgICAgICB0aGlzLl9zb2NrZXQgPSBpbyhhZGRyZXNzLCB7XHJcbiAgICAgICAgICAgIC8vcGF0aDogJy9zb2NrZXQnLFxyXG4gICAgICAgICAgICBhdXRvQ29ubmVjdDogZmFsc2UsXHJcbiAgICAgICAgICAgIHJlY29ubmVjdGlvbjogZmFsc2VcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fc29ja2V0Lm9uKCdwYWNrZXQnLCBwYWNrZXQgPT4gdGhpcy5vblJlY2VpdmVQYWNrZXQocGFja2V0KSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2coYFtOZXR3b3JrXSBBZGRyZXNzOiAoJHthZGRyZXNzfSlgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29ubmVjdChjYWxsYmFjaz86ICgpID0+IHZvaWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgW05ldHdvcmtdIENvbm5lY3RpbmcuLi5gKTtcclxuXHJcbiAgICAgICAgdGhpcy5fc29ja2V0LmNvbm5lY3QoKTtcclxuICAgICAgICB0aGlzLl9zb2NrZXQub25jZSgnY29ubmVjdCcsICgpID0+IHtcclxuICAgICAgICAgICAgY2FsbGJhY2s/LigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZW5kKHR5cGU6IFBhY2tldFR5cGUsIGRhdGE/OiBhbnkpIHtcclxuICAgICAgICBjb25zdCBwYWNrZXQ6IElQYWNrZXQgPSB7XHJcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zb2NrZXQuZW1pdCgncGFja2V0JywgcGFja2V0KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIG9uUmVjZWl2ZVBhY2tldChwYWNrZXQ6IElQYWNrZXQpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHBhY2tldClcclxuXHJcbiAgICAgICAgaWYocGFja2V0LnR5cGUgPT0gUGFja2V0VHlwZS5DT05ORUNUX1RPX1NFUlZFUl9TVEFUVVMpIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YTogSVBhY2tldERhdGFfQ29ubmVjdFRvU2VydmVyU3RhdHVzID0gcGFja2V0LmRhdGE7XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgIEdhbWVDbGllbnQucGxheWVySWQgPSBkYXRhLmVudGl0eUlkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYocGFja2V0LnR5cGUgPT0gUGFja2V0VHlwZS5FTlRJVFlfREFUQSkge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhOiBJUGFja2V0RGF0YV9FbnRpdHlEYXRhID0gcGFja2V0LmRhdGE7XHJcblxyXG4gICAgICAgICAgICBXb3JsZFN5bmNIZWxwZXIub25SZWNlaXZlRW50aXR5RGF0YShkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLypcclxuICAgIHByaXZhdGUgb25SZWNlaXZlUGFja2V0KHBhY2tldDogSVBhY2tldCkge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgKi9cclxufSIsImV4cG9ydCBlbnVtIFBhY2tldFR5cGUge1xyXG4gICAgUkVRVUVTVF9TRVJWRVJfTElTVCxcclxuICAgIFNFUlZFUl9MSVNULFxyXG4gICAgQ09OTkVDVF9UT19TRVJWRVIsXHJcbiAgICBDT05ORUNUX1RPX1NFUlZFUl9TVEFUVVMsXHJcbiAgICBFTlRJVFlfREFUQVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQYWNrZXQge1xyXG4gICAgdHlwZTogUGFja2V0VHlwZVxyXG4gICAgZGF0YT86IGFueVxyXG59XHJcblxyXG4vKlxyXG5leHBvcnQgaW50ZXJmYWNlIElQYWNrZXREYXRhX1NlcnZlckxpc3Qge1xyXG4gICAgc2VydmVyczogU2VydmVySW5mb1tdXHJcbn1cclxuKi9cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhY2tldERhdGFfQ29ubmVjdFRvU2VydmVyIHtcclxuICAgIGlkOiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUGFja2V0RGF0YV9JZCB7XHJcbiAgICBpZDogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhY2tldERhdGFfQ29ubmVjdFRvU2VydmVyU3RhdHVzIHtcclxuICAgIHNlcnZlcklkOiBzdHJpbmdcclxuICAgIGVudGl0eUlkOiBzdHJpbmdcclxuICAgIHN1Y2Nlc3M6IGJvb2xlYW5cclxuICAgIGVycm9yTWVzc2FnZT86IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQYWNrZXREYXRhX0VudGl0eURhdGEge1xyXG4gICAgZW50aXR5SWQ6IHN0cmluZ1xyXG4gICAgZGF0YTogYW55XHJcbn0iLCJpbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uL2dhbWUvZ2FtZVwiO1xyXG5pbXBvcnQgeyBXb3JsZCB9IGZyb20gXCIuLi93b3JsZC93b3JsZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNlcnZlciB7XHJcbiAgICBwcml2YXRlIF9nYW1lOiBHYW1lO1xyXG4gICAgcHJpdmF0ZSBfd29ybGRzID0gbmV3IE1hcDxzdHJpbmcsIFdvcmxkPigpO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgd29ybGRzKCkgeyByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl93b3JsZHMudmFsdWVzKCkpOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGdhbWUoKSB7IHJldHVybiB0aGlzLl9nYW1lOyB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZTogR2FtZSkge1xyXG4gICAgICAgIHRoaXMuX2dhbWUgPSBnYW1lO1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZVdvcmxkKCd3b3JsZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMud29ybGRzLm1hcCh3b3JsZCA9PiB3b3JsZC51cGRhdGUoZHQpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlV29ybGQobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgd29ybGQgPSBuZXcgV29ybGQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5fd29ybGRzLnNldChuYW1lLCB3b3JsZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQ0FOTk9OIGZyb20gJ2Nhbm5vbidcclxuaW1wb3J0IHsgRW50aXR5IH0gZnJvbSAnLi4vZW50aXR5L2VudGl0eSc7XHJcbmltcG9ydCB7IFNlcnZlciB9IGZyb20gXCIuLi9zZXJ2ZXIvc2VydmVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGQge1xyXG5cclxuICAgIHByaXZhdGUgX3NlcnZlcjogU2VydmVyO1xyXG4gICAgcHJpdmF0ZSBfZHluYW1pY1dvcmxkOiBDQU5OT04uV29ybGQ7XHJcbiAgICBwcml2YXRlIF9lbnRpdGllcyA9IG5ldyBNYXA8c3RyaW5nLCBFbnRpdHk+KCk7XHJcblxyXG4gICAgcHVibGljIGdldCBzZXJ2ZXIoKSB7IHJldHVybiB0aGlzLl9zZXJ2ZXIgfTtcclxuICAgIHB1YmxpYyBnZXQgZHluYW1pY1dvcmxkKCkgeyByZXR1cm4gdGhpcy5fZHluYW1pY1dvcmxkIH07XHJcbiAgICBwdWJsaWMgZ2V0IGVudGl0aWVzKCkgeyByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl9lbnRpdGllcy52YWx1ZXMoKSkgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzZXJ2ZXI6IFNlcnZlcikge1xyXG4gICAgICAgIHRoaXMuX3NlcnZlciA9IHNlcnZlcjtcclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cER5bmFtaWNXb3JsZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHZhciBmaXhlZFRpbWVTdGVwID0gMS4wIC8gNjAuMDsgLy8gc2Vjb25kc1xyXG4gICAgICAgIHZhciBtYXhTdWJTdGVwcyA9IDM7XHJcblxyXG4gICAgICAgIHRoaXMuZHluYW1pY1dvcmxkLnN0ZXAoZml4ZWRUaW1lU3RlcCwgZHQsIG1heFN1YlN0ZXBzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RW50aXR5KGlkOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZW50aXRpZXMuZ2V0KGlkKSE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhhc0VudGl0eShpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VudGl0aWVzLmhhcyhpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXR1cER5bmFtaWNXb3JsZCgpIHtcclxuXHJcbiAgICAgICAgLy8gU2V0dXAgb3VyIHdvcmxkXHJcbiAgICAgICAgdmFyIHdvcmxkID0gdGhpcy5fZHluYW1pY1dvcmxkID0gbmV3IENBTk5PTi5Xb3JsZCgpO1xyXG4gICAgICAgIHdvcmxkLmdyYXZpdHkgPSBuZXcgQ0FOTk9OLlZlYzMoMCwgMCwgLTkuODIpIC8vIG0vc8KyXHJcblxyXG4gICAgICAgIGNvbnN0IGdyb3VuZCA9IHRoaXMuc3Bhd25FbnRpdHkobmV3IENBTk5PTi5WZWMzKDAsIDAsIDApLCBuZXcgQ0FOTk9OLlZlYzMoMzAsIDMwLCAxKSwge21hc3M6IDB9KTtcclxuICAgICAgICBncm91bmQuZG9udFN5bmMgPSB0cnVlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICAvL2NvbnN0IGJveCA9IHRoaXMuc3Bhd25UZXN0RW50aXR5KG5ldyBDQU5OT04uVmVjMygwLCAwLCA0KSwgbmV3IENBTk5PTi5WZWMzKDEsIDEsIDEpLCB7bWFzczogMjAwfSk7XHJcbiAgICAgICAgLy9jb25zdCBib3gyID0gdGhpcy5zcGF3blRlc3RFbnRpdHkobmV3IENBTk5PTi5WZWMzKDAsIDEsIDgpLCBuZXcgQ0FOTk9OLlZlYzMoMSwgMSwgMSksIHttYXNzOiAyMDB9KTtcclxuICAgICAgICBcclxuICAgICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiZ3JvdW5kOiBcIiArIHRoaXMucHJpbnRQb3NpdGlvbihncm91bmQuZ2V0UG9zaXRpb24oKSkpO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYm94OiBcIiArIHRoaXMucHJpbnRQb3NpdGlvbihib3guZ2V0UG9zaXRpb24oKSkpO1xyXG5cclxuICAgICAgICB9LCAyNTApXHJcblxyXG4gICAgICAgIC8vc2V0SW50ZXJ2YWwoKCkgPT4geyB0aGlzLnNwYXduVGVzdEVudGl0eSgpOyB9LCAxMDAwKVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzcGF3bkVudGl0eShwb3NpdGlvbj86IENBTk5PTi5WZWMzLCBoYWxmRXh0ZW5kcz86IENBTk5PTi5WZWMzLCBvcHRpb25zPzogQ0FOTk9OLklCb2R5T3B0aW9ucywgY3VzdG9tSWQ/OiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge21hc3M6IDIwMH07XHJcblxyXG4gICAgICAgIGNvbnN0IGJvZHkgPSB0aGlzLmNyZWF0ZVJlY3RhbmdsZUJvZHkocG9zaXRpb24gfHwgbmV3IENBTk5PTi5WZWMzKE1hdGgucmFuZG9tKCkqNi0zLCBNYXRoLnJhbmRvbSgpKjYtMywgMyksIGhhbGZFeHRlbmRzIHx8IG5ldyBDQU5OT04uVmVjMygxLCAxLCAxKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgZW50aXR5ID0gbmV3IEVudGl0eSh0aGlzKTtcclxuICAgICAgICBlbnRpdHkuc2V0Qm9keShib2R5KVxyXG4gICAgICAgIGlmKGN1c3RvbUlkKSBlbnRpdHkuc2V0SWQoY3VzdG9tSWQpO1xyXG5cclxuICAgICAgICB0aGlzLl9lbnRpdGllcy5zZXQoZW50aXR5LmlkLCBlbnRpdHkpO1xyXG5cclxuICAgICAgICByZXR1cm4gZW50aXR5O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcHJpbnRQb3NpdGlvbihwb3M6IENBTk5PTi5WZWMzKSB7XHJcbiAgICAgICAgcmV0dXJuIGAoJHtwb3MueH0sICR7cG9zLnl9LCAke3Bvcy56fSlgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZVJlY3RhbmdsZUJvZHkocG9zaXRpb246IENBTk5PTi5WZWMzLCBoYWxmRXh0ZW5kczogQ0FOTk9OLlZlYzMsIG9wdGlvbnM/OiBDQU5OT04uSUJvZHlPcHRpb25zKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3Qgb3B0ID0gb3B0aW9ucyB8fCB7fTtcclxuXHJcbiAgICAgICAgb3B0LnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICAgXHJcbiAgICAgICAgdmFyIHNoYXBlID0gbmV3IENBTk5PTi5Cb3goaGFsZkV4dGVuZHMpO1xyXG4gICAgICAgIHZhciBib2R5ID0gbmV3IENBTk5PTi5Cb2R5KG9wdCk7XHJcbiAgICAgICAgYm9keS5hZGRTaGFwZShzaGFwZSk7XHJcblxyXG4gICAgICAgIHRoaXMuZHluYW1pY1dvcmxkLmFkZEJvZHkoYm9keSk7XHJcblxyXG4gICAgICAgIHJldHVybiBib2R5OyBcclxuICAgIH1cclxufVxyXG5cclxuLypcclxuY29uc3QgZW50aXR5ID0gbmV3IHBjLkVudGl0eShuYW1lKTtcclxuZW50aXR5LnNldFBvc2l0aW9uKHBvc2l0aW9uKVxyXG50aGlzLmNyZWF0ZVJlY3RhbmdsZUF0RW50aXR5KGVudGl0eSwgc2l6ZSwgaXNEeW5hbWljLCBjb2xvcik7XHJcbmFwcC5yb290LmFkZENoaWxkKGVudGl0eSk7XHJcbiovIiwiaW1wb3J0IHsgRW50aXR5IH0gZnJvbSBcIi4uL2VudGl0eS9lbnRpdHlcIjtcclxuaW1wb3J0IHsgR2FtZUNsaWVudCB9IGZyb20gXCIuLi9nYW1lL2dhbWVDbGllbnRcIjtcclxuaW1wb3J0IHsgSVBhY2tldERhdGFfRW50aXR5RGF0YSB9IGZyb20gXCIuLi9wYWNrZXQvcGFja2V0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGRTeW5jSGVscGVyIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdhbWUoKSB7IHJldHVybiBHYW1lQ2xpZW50Lkluc3RhbmNlOyB9O1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgb25SZWNlaXZlRW50aXR5RGF0YShkYXRhOiBJUGFja2V0RGF0YV9FbnRpdHlEYXRhKSB7XHJcbiAgICAgICAgY29uc3Qgd29ybGQgPSB0aGlzLmdhbWUubWFpblNlcnZlci53b3JsZHNbMF07XHJcblxyXG4gICAgICAgIGxldCBpc05ld0VudGl0eTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZighd29ybGQuaGFzRW50aXR5KGRhdGEuZW50aXR5SWQpKSB7XHJcbiAgICAgICAgICAgIHdvcmxkLnNwYXduRW50aXR5KHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGRhdGEuZW50aXR5SWQpO1xyXG4gICAgICAgICAgICBpc05ld0VudGl0eSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbmV3IGVudGl5JylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGVudGl0eSA9IHdvcmxkLmdldEVudGl0eShkYXRhLmVudGl0eUlkKTtcclxuXHJcbiAgICAgICAgZW50aXR5LmZyb21KU09OKGRhdGEuZGF0YSk7XHJcblxyXG4gICAgICAgIGlmKGlzTmV3RW50aXR5KSB7XHJcbiAgICAgICAgICAgIC8vZW50aXR5LnNjcmlwdCEuY3JlYXRlKCdlbnRpdHlTeW5jJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgaWYoZW50aXR5LmlkID09IEdhbWVDbGllbnQucGxheWVySWQpIHtcclxuXHJcbiAgICAgICAgICAgIGlmKCFHYW1lQ2xpZW50LnBsYXllcikge1xyXG4gICAgICAgICAgICAgICAgR2FtZUNsaWVudC5wbGF5ZXIgPSBlbnRpdHkgYXMgRW50aXR5O1xyXG4gICAgICAgICAgICAgICAgLy9HYW1lQ2xpZW50LnBsYXllci5zZXRDb250cm9sbGFibGUoKTtcclxuICAgICAgICAgICAgICAgIC8vR2FtZUNsaWVudC5jYW1lcmFGb2xsb3dFbnRpdHkoZW50aXR5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRzW2ldXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2RtZGFzc2NfZ2FtZVwiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtkbWRhc3NjX2dhbWVcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpKSlcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9yc1wiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3dlYnBhY2svY3JlZGl0cy5qc1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9