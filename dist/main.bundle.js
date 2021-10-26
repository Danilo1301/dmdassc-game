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
        body.fixedRotation = true;
        body.updateMassProperties();
        this._body = body;
        this._position = body.position;
        this._quaternion = body.quaternion;
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
        var _a, _b, _c;
        const speed = 50000;
        const force = new cannon_1.default.Vec3(speed * this.input.horizontal * dt, speed * this.input.vertical * dt, 0);
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
            restitution: 0.3,
            contactEquationStiffness: 1e8,
            contactEquationRelaxation: 3
        });
        world.addContactMaterial(slippery_ground_cm);
        this._material_ground = groundMaterial;
        this._material_test = slipperyMaterial;
        const slippery_ground_cm2 = new cannon_1.default.ContactMaterial(slipperyMaterial, slipperyMaterial, {
            friction: 0.000,
            restitution: 0.3,
            contactEquationStiffness: 1e8,
            contactEquationRelaxation: 3
        });
        world.addContactMaterial(slippery_ground_cm2);
        const ground = this.spawnEntity(new cannon_1.default.Vec3(0, 0, 0), new cannon_1.default.Vec3(30, 30, 1), { mass: 0, material: this._material_ground });
        ground.dontSync = true;
        const building1 = this.spawnEntity(new cannon_1.default.Vec3(-5, 0, 2), new cannon_1.default.Vec3(2, 4, 2), { mass: 0, material: this._material_ground }, new pc.Color(1, 0, 0));
        building1.dontSync = true;
        const stairs = this.spawnEntity(new cannon_1.default.Vec3(-3, 2, 1), new cannon_1.default.Vec3(1, 5, 1), { mass: 0, material: this._material_ground }, new pc.Color(0.5, 0.7, 0));
        stairs.dontSync = true;
        stairs.quaternion.setFromEuler(-35, 0, 0);
        const building2 = this.spawnEntity(new cannon_1.default.Vec3(5, 3, 2), new cannon_1.default.Vec3(2, 2, 6), { mass: 0, material: this._material_ground }, new pc.Color(0.5, 0.7, 0));
        building2.dontSync = true;
        if (this.server.game.isServer) {
            for (let i = 0; i < 4; i++) {
                this.spawnEntity(undefined, undefined, undefined, new pc.Color(0.5, 0, 0)).startBotBehaviour();
            }
        }
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
        console.log('spawn entity');
        if (!options.material)
            options.material = this._material_test;
        console.log(options);
        const body = this.createRectangleBody(position || new cannon_1.default.Vec3(Math.random() * 3 - 1.5, Math.random() * 3 - 1.5, 2), halfExtends || new cannon_1.default.Vec3(0.2, 0.2, 0.2), options);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLGdCQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUMsQ0FBQyxDQUFDO1FBQ2xJLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBRXZCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxnQkFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxnQkFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixFQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzSixTQUFTLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUUxQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksZ0JBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBQyxFQUFFLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUosTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDdkIsTUFBTSxDQUFD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Q0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL2VudGl0eS9lbnRpdHkudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL2dhbWUvZ2FtZS50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvZ2FtZS9nYW1lQ2xpZW50LnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvbmV0d29yay9uZXR3b3JrLnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9wYWNrZXQvcGFja2V0LnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9zZXJ2ZXIvc2VydmVyLnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy93b3JsZC93b3JsZC50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvd29ybGQvd29ybGRTeW5jSGVscGVyLnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGMgZnJvbSAncGxheWNhbnZhcyc7XHJcbmltcG9ydCBQaGFzZXIgZnJvbSAncGhhc2VyJztcclxuaW1wb3J0IENBTk5PTiBmcm9tICdjYW5ub24nO1xyXG5pbXBvcnQgeyBXb3JsZCB9IGZyb20gXCIuLi93b3JsZC93b3JsZFwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJRW50aXR5RGF0YSB7XHJcbiAgICBwb3M/OiBudW1iZXJbXVxyXG4gICAgdmVsPzogbnVtYmVyW11cclxuICAgIHJvdD86IG51bWJlcltdXHJcbiAgICBhVmVsPzogbnVtYmVyW11cclxuICAgIGlucHV0PzogbnVtYmVyW11cclxuICAgIGRhdGE/OiBhbnlcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEVudGl0eSB7XHJcbiAgICBwdWJsaWMgcGNFbnRpdHk/OiBwYy5FbnRpdHk7XHJcblxyXG4gICAgcHVibGljIGRvbnRTeW5jOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgY2FuTGVycDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyBkYXRhOiBhbnkgPSB7fTtcclxuICAgIHB1YmxpYyBpbnB1dCA9IHtob3Jpem9udGFsOiAwLCB2ZXJ0aWNhbDogMH1cclxuXHJcbiAgICBwcml2YXRlIF9wb3NpdGlvbiA9IG5ldyBDQU5OT04uVmVjMygpO1xyXG4gICAgcHJpdmF0ZSBfcXVhdGVybmlvbiA9IG5ldyBDQU5OT04uUXVhdGVybmlvbigpO1xyXG5cclxuICAgIHByaXZhdGUgX3RhcmdldFBvc2l0aW9uID0gbmV3IENBTk5PTi5WZWMzKCk7XHJcbiAgICBwcml2YXRlIF90YXJnZXRRdWF0ZXJuaW9uID0gbmV3IENBTk5PTi5RdWF0ZXJuaW9uKCk7XHJcblxyXG4gICAgcHJpdmF0ZSBfaWQ6IHN0cmluZyA9IGAke01hdGgucmFuZG9tKCl9YDtcclxuICAgIHByaXZhdGUgX3dvcmxkOiBXb3JsZDtcclxuICAgIHByaXZhdGUgX2JvZHk/OiBDQU5OT04uQm9keTtcclxuICAgIFxyXG4gICAgcHVibGljIGdldCBpZCgpIHsgcmV0dXJuIHRoaXMuX2lkOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGJvZHkoKSB7IHJldHVybiB0aGlzLl9ib2R5OyB9XHJcbiAgICBwdWJsaWMgZ2V0IHBvc2l0aW9uKCkgeyByZXR1cm4gdGhpcy5fcG9zaXRpb247IH1cclxuICAgIHB1YmxpYyBnZXQgcXVhdGVybmlvbigpIHsgcmV0dXJuIHRoaXMuX3F1YXRlcm5pb247IH1cclxuICAgIHB1YmxpYyBnZXQgdmVsb2NpdHkoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fYm9keSkgcmV0dXJuIHRoaXMuX2JvZHkudmVsb2NpdHk7XHJcbiAgICAgICAgcmV0dXJuIENBTk5PTi5WZWMzLlpFUk87XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGFuZ3VsYXJWZWxvY2l0eSgpIHtcclxuICAgICAgICBpZih0aGlzLl9ib2R5KSByZXR1cm4gdGhpcy5fYm9keS5hbmd1bGFyVmVsb2NpdHk7XHJcbiAgICAgICAgcmV0dXJuIENBTk5PTi5WZWMzLlpFUk87XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3Iod29ybGQ6IFdvcmxkKSB7XHJcbiAgICAgICAgdGhpcy5fd29ybGQgPSB3b3JsZDtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRDb2xvcihwYy5Db2xvci5XSElURSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29sb3IoY29sb3I6IHBjLkNvbG9yKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhLmNvbG9yID0gW2NvbG9yLnIsIGNvbG9yLmcsIGNvbG9yLmJdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRCb2R5KGJvZHk6IENBTk5PTi5Cb2R5KSB7XHJcbiAgICAgICAgYm9keS5maXhlZFJvdGF0aW9uID0gdHJ1ZTtcclxuICAgICAgICBib2R5LnVwZGF0ZU1hc3NQcm9wZXJ0aWVzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2JvZHkgPSBib2R5O1xyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gYm9keS5wb3NpdGlvbjtcclxuICAgICAgICB0aGlzLl9xdWF0ZXJuaW9uID0gYm9keS5xdWF0ZXJuaW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRJZChpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5faWQgPSBpZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnRCb3RCZWhhdmlvdXIoKSB7XHJcbiAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5pbnB1dC5ob3Jpem9udGFsID0gTWF0aC5yYW5kb20oKSoyLTFcclxuICAgICAgICAgICAgdGhpcy5pbnB1dC52ZXJ0aWNhbCA9IE1hdGgucmFuZG9tKCkqMi0xXHJcblxyXG4gICAgICAgIH0sIDQwMClcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHVwZGF0ZShkdDogbnVtYmVyKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IHNwZWVkID0gNTAwMDA7XHJcblxyXG4gICAgICAgIGNvbnN0IGZvcmNlID0gbmV3IENBTk5PTi5WZWMzKFxyXG4gICAgICAgICAgICBzcGVlZCAqIHRoaXMuaW5wdXQuaG9yaXpvbnRhbCAqIGR0LFxyXG4gICAgICAgICAgICBzcGVlZCAqIHRoaXMuaW5wdXQudmVydGljYWwgKiBkdCxcclxuICAgICAgICAgICAgMFxyXG4gICAgICAgICk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmJvZHk/LmFwcGx5Rm9yY2UoZm9yY2UsIHRoaXMucG9zaXRpb24pO1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgIGlmKHRoaXMuY2FuTGVycCkge1xyXG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMucG9zaXRpb247XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1Bvc2l0aW9uID0gbmV3IENBTk5PTi5WZWMzKCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IHBvc2l0aW9uLmRpc3RhbmNlVG8odGhpcy5fdGFyZ2V0UG9zaXRpb24pO1xyXG5cclxuICAgICAgICAgICAgbGV0IGxlcnBBbW91bnQgPSAwLjM7XHJcbiAgICAgICAgICAgIGlmKGRpc3RhbmNlID4gMi41KSBsZXJwQW1vdW50ID0gMTtcclxuXHJcblxyXG4gICAgICAgICAgICBwb3NpdGlvbi5sZXJwKHRoaXMuX3RhcmdldFBvc2l0aW9uLCBsZXJwQW1vdW50LCBuZXdQb3NpdGlvbik7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uLnNldChuZXdQb3NpdGlvbi54LCBuZXdQb3NpdGlvbi55LCBuZXdQb3NpdGlvbi56KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgKi9cclxuXHJcbiAgICAgICAgaWYodGhpcy5jYW5MZXJwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHF1YXRlcm5pb24gPSB0aGlzLnF1YXRlcm5pb247XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL2NvbnN0IHFmcm9tID0gbmV3IFBoYXNlci5NYXRoLlF1YXRlcm5pb24ocXVhdGVybmlvbi54LCBxdWF0ZXJuaW9uLnksIHF1YXRlcm5pb24ueiwgcXVhdGVybmlvbi53KTtcclxuICAgICAgICAgICAgLy9jb25zdCBxdG8gPSBuZXcgUGhhc2VyLk1hdGguUXVhdGVybmlvbih0aGlzLl90YXJnZXRRdWF0ZXJuaW9uLngsIHRoaXMuX3RhcmdldFF1YXRlcm5pb24ueSwgdGhpcy5fdGFyZ2V0UXVhdGVybmlvbi56LCB0aGlzLl90YXJnZXRRdWF0ZXJuaW9uLncpO1xyXG4gICAgICAgICAgICAvL2NvbnN0IHJlc3VsdCA9IHFmcm9tLmxlcnAocXRvLCAwLjEpOyAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICAvL3RoaXMucXVhdGVybmlvbi5zZXQocmVzdWx0LngsIHJlc3VsdC55LCByZXN1bHQueiwgcmVzdWx0LncpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLnBvc2l0aW9uLmRpc3RhbmNlVG8oQ0FOTk9OLlZlYzMuWkVSTykgPiAyMCkge1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uLnNldCgwLCAwLCAyKTtcclxuICAgICAgICAgICAgdGhpcy5ib2R5Py52ZWxvY2l0eS5zZXRaZXJvKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYm9keT8uYW5ndWxhclZlbG9jaXR5LnNldFplcm8oKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgXHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b0pTT04oKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YTogSUVudGl0eURhdGEgPSB7fVxyXG5cclxuICAgICAgICBkYXRhLnBvcyA9IFt0aGlzLnBvc2l0aW9uLngsIHRoaXMucG9zaXRpb24ueSwgdGhpcy5wb3NpdGlvbi56XTtcclxuICAgICAgICBkYXRhLnJvdCA9IFt0aGlzLnF1YXRlcm5pb24ueCwgdGhpcy5xdWF0ZXJuaW9uLnksIHRoaXMucXVhdGVybmlvbi56LCB0aGlzLnF1YXRlcm5pb24ud107XHJcbiAgICAgICAgZGF0YS52ZWwgPSBbdGhpcy52ZWxvY2l0eS54LCB0aGlzLnZlbG9jaXR5LnksIHRoaXMudmVsb2NpdHkuel07XHJcbiAgICAgICAgZGF0YS5hVmVsID0gW3RoaXMuYW5ndWxhclZlbG9jaXR5LngsIHRoaXMuYW5ndWxhclZlbG9jaXR5LnksIHRoaXMuYW5ndWxhclZlbG9jaXR5LnpdO1xyXG4gICAgICAgIGRhdGEuaW5wdXQgPSBbdGhpcy5pbnB1dC5ob3Jpem9udGFsLCB0aGlzLmlucHV0LnZlcnRpY2FsXTtcclxuICAgICAgICBkYXRhLmRhdGEgPSB0aGlzLmRhdGE7XHJcblxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmcm9tSlNPTihlbnRpdHlEYXRhOiBJRW50aXR5RGF0YSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vaWYodGhpcyA9PSBHYW1lQ2xpZW50LnBsYXllcikgY29uc29sZS5sb2coJ3Vvc3BzJylcclxuXHJcbiAgICAgICAgaWYoZW50aXR5RGF0YS5wb3MpIHtcclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuY2FuTGVycCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi5zZXQoZW50aXR5RGF0YS5wb3NbMF0sIGVudGl0eURhdGEucG9zWzFdLCBlbnRpdHlEYXRhLnBvc1syXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGVudGl0eURhdGEudmVsKSB7XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLmNhbkxlcnApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVsb2NpdHkuc2V0KGVudGl0eURhdGEudmVsWzBdLCBlbnRpdHlEYXRhLnZlbFsxXSwgZW50aXR5RGF0YS52ZWxbMl0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihlbnRpdHlEYXRhLmFWZWwpIHtcclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuY2FuTGVycCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmd1bGFyVmVsb2NpdHkuc2V0KGVudGl0eURhdGEuYVZlbFswXSwgZW50aXR5RGF0YS5hVmVsWzFdLCBlbnRpdHlEYXRhLmFWZWxbMl0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihlbnRpdHlEYXRhLnJvdCkge1xyXG4gICAgICAgICAgICBpZih0aGlzLmNhbkxlcnApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucXVhdGVybmlvbi5zZXQoZW50aXR5RGF0YS5yb3RbMF0sIGVudGl0eURhdGEucm90WzFdLCBlbnRpdHlEYXRhLnJvdFsyXSwgZW50aXR5RGF0YS5yb3RbM10pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKGVudGl0eURhdGEuaW5wdXQpIHtcclxuICAgICAgICAgICAgdGhpcy5pbnB1dC5ob3Jpem9udGFsID0gZW50aXR5RGF0YS5pbnB1dFswXTtcclxuICAgICAgICAgICAgdGhpcy5pbnB1dC52ZXJ0aWNhbCA9IGVudGl0eURhdGEuaW5wdXRbMV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihlbnRpdHlEYXRhLmRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gZW50aXR5RGF0YS5kYXRhO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSAgICIsIlxyXG5pbXBvcnQgKiBhcyBwYyBmcm9tICdwbGF5Y2FudmFzJ1xyXG5pbXBvcnQgeyBTZXJ2ZXIgfSBmcm9tICcuLi9zZXJ2ZXIvc2VydmVyJztcclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lIHtcclxuICAgIHByaXZhdGUgX2lzU2VydmVyOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIF9zZXJ2ZXJzID0gbmV3IE1hcDxzdHJpbmcsIFNlcnZlcj4oKTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGlzU2VydmVyKCkgeyByZXR1cm4gdGhpcy5faXNTZXJ2ZXI7IH1cclxuICAgIHB1YmxpYyBnZXQgc2VydmVycygpIHsgcmV0dXJuIEFycmF5LmZyb20odGhpcy5fc2VydmVycy52YWx1ZXMoKSk7IH1cclxuICAgIHB1YmxpYyBnZXQgbWFpblNlcnZlcigpIHsgcmV0dXJuIHRoaXMuc2VydmVyc1swXTsgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGlzU2VydmVyPzogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX2lzU2VydmVyID0gaXNTZXJ2ZXIgPT09IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbR2FtZV0gc3RhcnQ7IGlzU2VydmVyID1gLCB0aGlzLmlzU2VydmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlU2VydmVyKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBzZXJ2ZXIgPSBuZXcgU2VydmVyKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX3NlcnZlcnMuc2V0KGlkLCBzZXJ2ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuc2VydmVycy5tYXAoc2VydmVyID0+IHNlcnZlci51cGRhdGUoZHQpKTtcclxuICAgIH1cclxufSIsImltcG9ydCBDQU5OT04gZnJvbSAnY2Fubm9uJ1xyXG5pbXBvcnQgKiBhcyBwYyBmcm9tIFwicGxheWNhbnZhc1wiO1xyXG5pbXBvcnQgeyBFbnRpdHkgfSBmcm9tICcuLi9lbnRpdHkvZW50aXR5JztcclxuaW1wb3J0IHsgTmV0d29yayB9IGZyb20gXCIuLi9uZXR3b3JrL25ldHdvcmtcIjtcclxuaW1wb3J0IHsgSVBhY2tldERhdGFfQ29ubmVjdFRvU2VydmVyLCBQYWNrZXRUeXBlIH0gZnJvbSAnLi4vcGFja2V0L3BhY2tldCc7XHJcbmltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi9nYW1lXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZUNsaWVudCBleHRlbmRzIEdhbWUge1xyXG4gICAgcHVibGljIHN0YXRpYyBJbnN0YW5jZTogR2FtZUNsaWVudDtcclxuICAgIHB1YmxpYyBzdGF0aWMgY2FtZXJhOiBwYy5FbnRpdHk7XHJcbiAgICBwdWJsaWMgc3RhdGljIHBsYXllcklkOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHVibGljIHN0YXRpYyBwbGF5ZXI/OiBFbnRpdHk7XHJcblxyXG4gICAgcHJpdmF0ZSBfYXBwOiBwYy5BcHBsaWNhdGlvbjtcclxuICAgIHByaXZhdGUgX2NhbnZhcztcclxuICAgIHByaXZhdGUgX25ldHdvcms6IE5ldHdvcms7XHJcblxyXG4gICAgcHVibGljIGdldCBhcHAoKSB7IHJldHVybiB0aGlzLl9hcHA7IH1cclxuICAgIHB1YmxpYyBnZXQgbmV0d29yaygpIHsgcmV0dXJuIHRoaXMuX25ldHdvcms7IH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXMpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NhbnZhcyA9IGNhbnZhcztcclxuICAgICAgICB0aGlzLl9uZXR3b3JrID0gbmV3IE5ldHdvcmsodGhpcyk7XHJcbiAgICAgICAgR2FtZUNsaWVudC5JbnN0YW5jZSA9IHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZShkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKGR0KTtcclxuXHJcblxyXG4gICAgICAgIGlmKEdhbWVDbGllbnQucGxheWVyKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpbnB1dCA9IEdhbWVDbGllbnQucGxheWVyLmlucHV0O1xyXG4gICAgICAgICAgICBpbnB1dC5ob3Jpem9udGFsID0gMDtcclxuICAgICAgICAgICAgaW5wdXQudmVydGljYWwgPSAwO1xyXG5cclxuICAgICAgICAgICAgaWYodGhpcy5hcHAua2V5Ym9hcmQuaXNQcmVzc2VkKHBjLktFWV9BKSkgaW5wdXQuaG9yaXpvbnRhbCA9IC0xO1xyXG4gICAgICAgICAgICBpZih0aGlzLmFwcC5rZXlib2FyZC5pc1ByZXNzZWQocGMuS0VZX0QpKSBpbnB1dC5ob3Jpem9udGFsID0gMTtcclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuYXBwLmtleWJvYXJkLmlzUHJlc3NlZChwYy5LRVlfVykpIGlucHV0LnZlcnRpY2FsID0gLTE7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYXBwLmtleWJvYXJkLmlzUHJlc3NlZChwYy5LRVlfUykpIGlucHV0LnZlcnRpY2FsID0gMTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5uZXR3b3JrLnVwZGF0ZShkdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0KCkge1xyXG4gICAgICAgIHN1cGVyLnN0YXJ0KCk7XHJcbiAgICAgICAgdGhpcy5zZXR1cEFwcCgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBSZXNpemUoKTtcclxuICAgICAgICB0aGlzLnNldHVwTG9jYWxDbGllbnRTY2VuZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm5ldHdvcmsuY29ubmVjdCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbTmV0d29ya10gQ29ubmVjdGVkPyAke3RoaXMubmV0d29yay5jb25uZWN0ZWR9YCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBkYXRhOiBJUGFja2V0RGF0YV9Db25uZWN0VG9TZXJ2ZXIgPSB7XHJcbiAgICAgICAgICAgICAgICBpZDogJ2FueSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm5ldHdvcmsuc2VuZChQYWNrZXRUeXBlLkNPTk5FQ1RfVE9fU0VSVkVSLCBkYXRhKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldHVwQXBwKCkge1xyXG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuX2NhbnZhcztcclxuICAgICAgICBjb25zdCBhcHAgPSBuZXcgcGMuQXBwbGljYXRpb24oY2FudmFzLCB7XHJcbiAgICAgICAgICAgIG1vdXNlOiBuZXcgcGMuTW91c2UoY2FudmFzKSxcclxuICAgICAgICAgICAgdG91Y2g6IG5ldyBwYy5Ub3VjaERldmljZShjYW52YXMpLFxyXG4gICAgICAgICAgICBrZXlib2FyZDogbmV3IHBjLktleWJvYXJkKGRvY3VtZW50LmJvZHkpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYXBwLm9uKCd1cGRhdGUnLCBkdCA9PiB0aGlzLnVwZGF0ZShkdCkpXHJcbiAgICAgICAgYXBwLnN0YXJ0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2FwcCA9IGFwcDtcclxuICAgICAgICBcclxuICAgICAgICAvL3BjLnJlZ2lzdGVyU2NyaXB0KENhbWVyYUZvbGxvdywgJ2NhbWVyYUZvbGxvdycsIGFwcCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXR1cFJlc2l6ZSgpIHtcclxuICAgICAgICB0aGlzLmFwcC5zZXRDYW52YXNGaWxsTW9kZShwYy5GSUxMTU9ERV9GSUxMX1dJTkRPVyk7XHJcbiAgICAgICAgdGhpcy5hcHAuc2V0Q2FudmFzUmVzb2x1dGlvbihwYy5SRVNPTFVUSU9OX0FVVE8pO1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4gdGhpcy5yZXNpemUoKSk7XHJcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVzaXplKCkge1xyXG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuX2NhbnZhcztcclxuXHJcbiAgICAgICAgdGhpcy5hcHAucmVzaXplQ2FudmFzKCk7XHJcbiAgICAgICAgY2FudmFzLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgICAgY2FudmFzLnN0eWxlLmhlaWdodCA9IFwiMTAwJVwiO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0dXBMb2NhbENsaWVudFNjZW5lKCkge1xyXG4gICAgICAgIGNvbnN0IGFwcCA9IHRoaXMuYXBwO1xyXG5cclxuICAgICAgICBjb25zdCBjYW1lcmEgPSBuZXcgcGMuRW50aXR5KCdjYW1lcmEnKTtcclxuICAgICAgICBjYW1lcmEuYWRkQ29tcG9uZW50KCdjYW1lcmEnLCB7XHJcbiAgICAgICAgICAgIGNsZWFyQ29sb3I6IG5ldyBwYy5Db2xvcigwLjEsIDAuMSwgMC4xKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGFwcC5yb290LmFkZENoaWxkKGNhbWVyYSk7XHJcbiAgICAgICAgY2FtZXJhLnNldFBvc2l0aW9uKDAsIDUsIDEwKTtcclxuICAgICAgICBjYW1lcmEubG9va0F0KDAsIDAsIDApO1xyXG4gICAgICAgIC8vY2FtZXJhLnNldEV1bGVyQW5nbGVzKC05MCwgMCwgMCk7XHJcbiAgICAgICAgKGNhbWVyYS5hZGRDb21wb25lbnQoJ3NjcmlwdCcpIGFzIHBjLlNjcmlwdENvbXBvbmVudCkuY3JlYXRlKCdjYW1lcmFGb2xsb3cnKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBsaWdodCA9IG5ldyBwYy5FbnRpdHkoJ2xpZ2h0Jyk7XHJcbiAgICAgICAgbGlnaHQuYWRkQ29tcG9uZW50KCdsaWdodCcpO1xyXG4gICAgICAgIGFwcC5yb290LmFkZENoaWxkKGxpZ2h0KTtcclxuICAgICAgICBsaWdodC5zZXRFdWxlckFuZ2xlcygzMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIEdhbWVDbGllbnQuY2FtZXJhID0gY2FtZXJhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW5kZXIoKSB7XHJcbiAgICAgICAgaWYoIXRoaXMubWFpblNlcnZlcikgcmV0dXJuO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHdvcmxkID0gdGhpcy5tYWluU2VydmVyLndvcmxkc1swXTtcclxuXHJcbiAgICAgICAgd29ybGQuZW50aXRpZXMubWFwKGVudGl0eSA9PiB7XHJcbiAgICAgICAgICAgIGlmKCFlbnRpdHkucGNFbnRpdHkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzaGFwZSA9IGVudGl0eS5ib2R5IS5zaGFwZXNbMF0gYXMgQ0FOTk9OLkJveDtcclxuXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGMgPSBlbnRpdHkuZGF0YS5jb2xvcjtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBwYy5TdGFuZGFyZE1hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgICAgICBtYXRlcmlhbC5kaWZmdXNlID0gbmV3IHBjLkNvbG9yKGNbMF0sIGNbMV0sIGNbMl0pO1xyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwudXBkYXRlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZW50aXR5LnBjRW50aXR5ID0gbmV3IHBjLkVudGl0eSgpO1xyXG4gICAgICAgICAgICAgICAgZW50aXR5LnBjRW50aXR5LmFkZENvbXBvbmVudChcInJlbmRlclwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWw6IG1hdGVyaWFsLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYm94XCJcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZW50aXR5LnBjRW50aXR5LnNldExvY2FsU2NhbGUobmV3IHBjLlZlYzMoc2hhcGUuaGFsZkV4dGVudHMueCAqIDIsIHNoYXBlLmhhbGZFeHRlbnRzLnogKiAyLCBzaGFwZS5oYWxmRXh0ZW50cy55ICogMikpXHJcblxyXG4gICAgIFxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwLnJvb3QuYWRkQ2hpbGQoZW50aXR5LnBjRW50aXR5KTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInlhZXNcIilcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgcG9zID0gZW50aXR5LnBvc2l0aW9uO1xyXG4gICAgICAgICAgICBjb25zdCBhbmdsZSA9IG5ldyBDQU5OT04uVmVjMygpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZW50aXR5LmJvZHk/LnF1YXRlcm5pb24udG9FdWxlcihhbmdsZSk7XHJcblxyXG4gICAgICAgICAgICBlbnRpdHkucGNFbnRpdHkuc2V0UG9zaXRpb24ocG9zLngsIHBvcy56LCBwb3MueSk7XHJcbiAgICAgICAgICAgIGVudGl0eS5wY0VudGl0eS5zZXRFdWxlckFuZ2xlcyhcclxuICAgICAgICAgICAgICAgIGFuZ2xlLnggKiAtcGMubWF0aC5SQURfVE9fREVHLFxyXG4gICAgICAgICAgICAgICAgYW5nbGUueiAqIC1wYy5tYXRoLlJBRF9UT19ERUcsXHJcbiAgICAgICAgICAgICAgICBhbmdsZS55ICogLXBjLm1hdGguUkFEX1RPX0RFR1xyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIC8vZW50aXR5LnBjRW50aXR5LnNldEV1bGVyQW5nbGVzKGFuZ2xlLngsIGFuZ2xlLnosIGFuZ2xlLnkpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmKEdhbWVDbGllbnQucGxheWVyKSB7XHJcbiAgICAgICAgICAgIEdhbWVDbGllbnQuY2FtZXJhLnNldFBvc2l0aW9uKEdhbWVDbGllbnQucGxheWVyLnBvc2l0aW9uLngsIEdhbWVDbGllbnQucGxheWVyLnBvc2l0aW9uLnogKyAxMCwgR2FtZUNsaWVudC5wbGF5ZXIucG9zaXRpb24ueSlcclxuICAgICAgICAgICAgR2FtZUNsaWVudC5jYW1lcmEuc2V0RXVsZXJBbmdsZXMoLTkwLCAwLCAwKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IEdhbWVDbGllbnQgfSBmcm9tIFwiLi9nYW1lL2dhbWVDbGllbnRcIjtcclxuXHJcbmNvbnN0IGdhbWUgPSBuZXcgR2FtZUNsaWVudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZScpKTtcclxuZ2FtZS5zdGFydCgpO1xyXG53aW5kb3dbJ2dhbWUnXSA9IGdhbWU7XHJcbndpbmRvd1snR2FtZUNsaWVudCddID0gR2FtZUNsaWVudDtcclxuXHJcbmdhbWUuY3JlYXRlU2VydmVyKCdzZXJ2ZXIxJyk7IiwiaW1wb3J0IHsgaW8sIFNvY2tldCB9IGZyb20gXCJzb2NrZXQuaW8tY2xpZW50XCI7XHJcbmltcG9ydCB7IEdhbWVDbGllbnQgfSBmcm9tIFwiLi4vZ2FtZS9nYW1lQ2xpZW50XCI7XHJcbmltcG9ydCB7IElQYWNrZXQsIElQYWNrZXREYXRhX0Nvbm5lY3RUb1NlcnZlclN0YXR1cywgSVBhY2tldERhdGFfRW50aXR5RGF0YSwgUGFja2V0VHlwZSB9IGZyb20gXCIuLi9wYWNrZXQvcGFja2V0XCI7XHJcbmltcG9ydCB7IFdvcmxkU3luY0hlbHBlciB9IGZyb20gXCIuLi93b3JsZC93b3JsZFN5bmNIZWxwZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBOZXR3b3JrIHtcclxuICAgIHByaXZhdGUgX2dhbWU6IEdhbWVDbGllbnQ7XHJcbiAgICBwcml2YXRlIF9zb2NrZXQ6IFNvY2tldDtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGdhbWUoKSB7IHJldHVybiB0aGlzLl9nYW1lOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHNvY2tldCgpIHsgcmV0dXJuIHRoaXMuX3NvY2tldDsgfVxyXG4gICAgcHVibGljIGdldCBjb25uZWN0ZWQoKSB7IHJldHVybiB0aGlzLl9zb2NrZXQuY29ubmVjdGVkOyB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2VuZFBhY2tldHNEZWxheTogbnVtYmVyID0gNTA7XHJcbiAgICBwcml2YXRlIF9zZW5kVGltZTogbnVtYmVyID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lOiBHYW1lQ2xpZW50KSB7XHJcbiAgICAgICAgdGhpcy5fZ2FtZSA9IGdhbWU7XHJcblxyXG4gICAgICAgIC8vaHR0cHM6Ly9kbWRhc3NjLWdhbWUuZ2xpdGNoLm1lL1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGFkZHJlc3MgPSBgJHtsb2NhdGlvbi5wcm90b2NvbH0vLyR7bG9jYXRpb24uaG9zdH1gO1xyXG4gICAgICAgIHRoaXMuX3NvY2tldCA9IGlvKGFkZHJlc3MsIHtcclxuICAgICAgICAgICAgLy9wYXRoOiAnL3NvY2tldCcsXHJcbiAgICAgICAgICAgIGF1dG9Db25uZWN0OiBmYWxzZSxcclxuICAgICAgICAgICAgcmVjb25uZWN0aW9uOiBmYWxzZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9zb2NrZXQub24oJ3BhY2tldCcsIHBhY2tldCA9PiB0aGlzLm9uUmVjZWl2ZVBhY2tldChwYWNrZXQpKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zb2xlLmxvZyhgW05ldHdvcmtdIEFkZHJlc3M6ICgke2FkZHJlc3N9KWApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb25uZWN0KGNhbGxiYWNrPzogKCkgPT4gdm9pZCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbTmV0d29ya10gQ29ubmVjdGluZy4uLmApO1xyXG5cclxuICAgICAgICB0aGlzLl9zb2NrZXQuY29ubmVjdCgpO1xyXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbmNlKCdjb25uZWN0JywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjYWxsYmFjaz8uKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fc2VuZFRpbWUgKz0gZHQ7XHJcblxyXG4gICAgICAgIGNvbnN0IGVudGl0eSA9IEdhbWVDbGllbnQucGxheWVyO1xyXG5cclxuICAgICAgICBpZighZW50aXR5KSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmKHRoaXMuX3NlbmRUaW1lIDw9IHRoaXMuX3NlbmRQYWNrZXRzRGVsYXkvMTAwMCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3NlbmRUaW1lID0gMDtcclxuXHJcbiAgICAgICAgY29uc3QgcGFja2V0RGF0YTogSVBhY2tldERhdGFfRW50aXR5RGF0YSA9IHtcclxuICAgICAgICAgICAgZW50aXR5SWQ6IGVudGl0eS5pZCxcclxuICAgICAgICAgICAgZGF0YTogZW50aXR5LnRvSlNPTigpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNlbmQoUGFja2V0VHlwZS5FTlRJVFlfREFUQSwgcGFja2V0RGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbmQodHlwZTogUGFja2V0VHlwZSwgZGF0YT86IGFueSkge1xyXG4gICAgICAgIGNvbnN0IHBhY2tldDogSVBhY2tldCA9IHtcclxuICAgICAgICAgICAgdHlwZTogdHlwZSxcclxuICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNvY2tldC5lbWl0KCdwYWNrZXQnLCBwYWNrZXQpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgb25SZWNlaXZlUGFja2V0KHBhY2tldDogSVBhY2tldCkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2cocGFja2V0KVxyXG5cclxuICAgICAgICBpZihwYWNrZXQudHlwZSA9PSBQYWNrZXRUeXBlLkNPTk5FQ1RfVE9fU0VSVkVSX1NUQVRVUykge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhOiBJUGFja2V0RGF0YV9Db25uZWN0VG9TZXJ2ZXJTdGF0dXMgPSBwYWNrZXQuZGF0YTtcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgR2FtZUNsaWVudC5wbGF5ZXJJZCA9IGRhdGEuZW50aXR5SWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihwYWNrZXQudHlwZSA9PSBQYWNrZXRUeXBlLkVOVElUWV9EQVRBKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGE6IElQYWNrZXREYXRhX0VudGl0eURhdGEgPSBwYWNrZXQuZGF0YTtcclxuXHJcbiAgICAgICAgICAgIFdvcmxkU3luY0hlbHBlci5vblJlY2VpdmVFbnRpdHlEYXRhKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgcHJpdmF0ZSBvblJlY2VpdmVQYWNrZXQocGFja2V0OiBJUGFja2V0KSB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICAqL1xyXG59IiwiZXhwb3J0IGVudW0gUGFja2V0VHlwZSB7XHJcbiAgICBSRVFVRVNUX1NFUlZFUl9MSVNULFxyXG4gICAgU0VSVkVSX0xJU1QsXHJcbiAgICBDT05ORUNUX1RPX1NFUlZFUixcclxuICAgIENPTk5FQ1RfVE9fU0VSVkVSX1NUQVRVUyxcclxuICAgIEVOVElUWV9EQVRBXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhY2tldCB7XHJcbiAgICB0eXBlOiBQYWNrZXRUeXBlXHJcbiAgICBkYXRhPzogYW55XHJcbn1cclxuXHJcbi8qXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhY2tldERhdGFfU2VydmVyTGlzdCB7XHJcbiAgICBzZXJ2ZXJzOiBTZXJ2ZXJJbmZvW11cclxufVxyXG4qL1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUGFja2V0RGF0YV9Db25uZWN0VG9TZXJ2ZXIge1xyXG4gICAgaWQ6IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQYWNrZXREYXRhX0lkIHtcclxuICAgIGlkOiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUGFja2V0RGF0YV9Db25uZWN0VG9TZXJ2ZXJTdGF0dXMge1xyXG4gICAgc2VydmVySWQ6IHN0cmluZ1xyXG4gICAgZW50aXR5SWQ6IHN0cmluZ1xyXG4gICAgc3VjY2VzczogYm9vbGVhblxyXG4gICAgZXJyb3JNZXNzYWdlPzogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhY2tldERhdGFfRW50aXR5RGF0YSB7XHJcbiAgICBlbnRpdHlJZDogc3RyaW5nXHJcbiAgICBkYXRhOiBhbnlcclxufSIsImltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi4vZ2FtZS9nYW1lXCI7XHJcbmltcG9ydCB7IFdvcmxkIH0gZnJvbSBcIi4uL3dvcmxkL3dvcmxkXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2VydmVyIHtcclxuICAgIHByaXZhdGUgX2dhbWU6IEdhbWU7XHJcbiAgICBwcml2YXRlIF93b3JsZHMgPSBuZXcgTWFwPHN0cmluZywgV29ybGQ+KCk7XHJcblxyXG4gICAgcHVibGljIGdldCB3b3JsZHMoKSB7IHJldHVybiBBcnJheS5mcm9tKHRoaXMuX3dvcmxkcy52YWx1ZXMoKSk7IH1cclxuICAgIHB1YmxpYyBnZXQgZ2FtZSgpIHsgcmV0dXJuIHRoaXMuX2dhbWU7IH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lOiBHYW1lKSB7XHJcbiAgICAgICAgdGhpcy5fZ2FtZSA9IGdhbWU7XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlV29ybGQoJ3dvcmxkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy53b3JsZHMubWFwKHdvcmxkID0+IHdvcmxkLnVwZGF0ZShkdCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVXb3JsZChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCB3b3JsZCA9IG5ldyBXb3JsZCh0aGlzKTtcclxuICAgICAgICB0aGlzLl93b3JsZHMuc2V0KG5hbWUsIHdvcmxkKTtcclxuICAgIH1cclxufSIsImltcG9ydCBDQU5OT04gZnJvbSAnY2Fubm9uJ1xyXG5pbXBvcnQgKiBhcyBwYyBmcm9tICdwbGF5Y2FudmFzJztcclxuaW1wb3J0IHsgRW50aXR5IH0gZnJvbSAnLi4vZW50aXR5L2VudGl0eSc7XHJcbmltcG9ydCB7IFNlcnZlciB9IGZyb20gXCIuLi9zZXJ2ZXIvc2VydmVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGQge1xyXG5cclxuICAgIHByaXZhdGUgX3NlcnZlcjogU2VydmVyO1xyXG4gICAgcHJpdmF0ZSBfZHluYW1pY1dvcmxkOiBDQU5OT04uV29ybGQ7XHJcbiAgICBwcml2YXRlIF9lbnRpdGllcyA9IG5ldyBNYXA8c3RyaW5nLCBFbnRpdHk+KCk7XHJcblxyXG4gICAgcHVibGljIGdldCBzZXJ2ZXIoKSB7IHJldHVybiB0aGlzLl9zZXJ2ZXIgfTtcclxuICAgIHB1YmxpYyBnZXQgZHluYW1pY1dvcmxkKCkgeyByZXR1cm4gdGhpcy5fZHluYW1pY1dvcmxkIH07XHJcbiAgICBwdWJsaWMgZ2V0IGVudGl0aWVzKCkgeyByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl9lbnRpdGllcy52YWx1ZXMoKSkgfTtcclxuXHJcbiAgICBwcml2YXRlIF9tYXRlcmlhbF9ncm91bmQ6IENBTk5PTi5NYXRlcmlhbDtcclxuICAgIHByaXZhdGUgX21hdGVyaWFsX3Rlc3Q6IENBTk5PTi5NYXRlcmlhbDtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3Ioc2VydmVyOiBTZXJ2ZXIpIHtcclxuICAgICAgICB0aGlzLl9zZXJ2ZXIgPSBzZXJ2ZXI7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dXBEeW5hbWljV29ybGQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgZml4ZWRUaW1lU3RlcCA9IDEuMCAvIDYwLjA7IC8vIHNlY29uZHNcclxuICAgICAgICB2YXIgbWF4U3ViU3RlcHMgPSAzO1xyXG5cclxuICAgICAgICB0aGlzLmVudGl0aWVzLm1hcChlbnRpdHkgPT4gZW50aXR5LnVwZGF0ZShkdCkpO1xyXG4gICAgICAgIHRoaXMuZHluYW1pY1dvcmxkLnN0ZXAoZml4ZWRUaW1lU3RlcCwgZHQsIG1heFN1YlN0ZXBzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RW50aXR5KGlkOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZW50aXRpZXMuZ2V0KGlkKSE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhhc0VudGl0eShpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VudGl0aWVzLmhhcyhpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXR1cER5bmFtaWNXb3JsZCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnc2V0dXBEeW5hbWljV29ybGQnKVxyXG5cclxuICAgICAgICAvLyBTZXR1cCBvdXIgd29ybGRcclxuICAgICAgICB2YXIgd29ybGQgPSB0aGlzLl9keW5hbWljV29ybGQgPSBuZXcgQ0FOTk9OLldvcmxkKCk7XHJcbiAgICAgICAgd29ybGQuZ3Jhdml0eSA9IG5ldyBDQU5OT04uVmVjMygwLCAwLCAtOS44MikgLy8gbS9zwrJcclxuICAgICAgICBcclxuICAgICAgICAvL21hdDFcclxuICAgICAgICBjb25zdCBncm91bmRNYXRlcmlhbCA9IG5ldyBDQU5OT04uTWF0ZXJpYWwoXCJncm91bmRNYXRlcmlhbFwiKTtcclxuICAgICAgICBjb25zdCBncm91bmRfZ3JvdW5kX2NtID0gbmV3IENBTk5PTi5Db250YWN0TWF0ZXJpYWwoZ3JvdW5kTWF0ZXJpYWwsIGdyb3VuZE1hdGVyaWFsLCB7XHJcbiAgICAgICAgICAgIGZyaWN0aW9uOiAwLjQsXHJcbiAgICAgICAgICAgIHJlc3RpdHV0aW9uOiAwLjMsXHJcbiAgICAgICAgICAgIGNvbnRhY3RFcXVhdGlvblN0aWZmbmVzczogMWU4LFxyXG4gICAgICAgICAgICBjb250YWN0RXF1YXRpb25SZWxheGF0aW9uOiAzLFxyXG4gICAgICAgICAgICBmcmljdGlvbkVxdWF0aW9uU3RpZmZuZXNzOiAxZThcclxuICAgICAgICB9KTtcclxuICAgICAgICB3b3JsZC5hZGRDb250YWN0TWF0ZXJpYWwoZ3JvdW5kX2dyb3VuZF9jbSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNsaXBwZXJ5TWF0ZXJpYWwgPSBuZXcgQ0FOTk9OLk1hdGVyaWFsKFwic2xpcHBlcnlNYXRlcmlhbFwiKTtcclxuICAgICAgICBjb25zdCBzbGlwcGVyeV9ncm91bmRfY20gPSBuZXcgQ0FOTk9OLkNvbnRhY3RNYXRlcmlhbChncm91bmRNYXRlcmlhbCwgc2xpcHBlcnlNYXRlcmlhbCwge1xyXG4gICAgICAgICAgICBmcmljdGlvbjogMC4wMDMsXHJcbiAgICAgICAgICAgIHJlc3RpdHV0aW9uOiAwLjMsXHJcbiAgICAgICAgICAgIGNvbnRhY3RFcXVhdGlvblN0aWZmbmVzczogMWU4LFxyXG4gICAgICAgICAgICBjb250YWN0RXF1YXRpb25SZWxheGF0aW9uOiAzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgd29ybGQuYWRkQ29udGFjdE1hdGVyaWFsKHNsaXBwZXJ5X2dyb3VuZF9jbSk7XHJcblxyXG4gICAgICAgIHRoaXMuX21hdGVyaWFsX2dyb3VuZCA9IGdyb3VuZE1hdGVyaWFsO1xyXG4gICAgICAgIHRoaXMuX21hdGVyaWFsX3Rlc3QgPSBzbGlwcGVyeU1hdGVyaWFsO1xyXG5cclxuXHJcbiAgICAgICAgY29uc3Qgc2xpcHBlcnlfZ3JvdW5kX2NtMiA9IG5ldyBDQU5OT04uQ29udGFjdE1hdGVyaWFsKHNsaXBwZXJ5TWF0ZXJpYWwsIHNsaXBwZXJ5TWF0ZXJpYWwsIHtcclxuICAgICAgICAgICAgZnJpY3Rpb246IDAuMDAwLFxyXG4gICAgICAgICAgICByZXN0aXR1dGlvbjogMC4zLFxyXG4gICAgICAgICAgICBjb250YWN0RXF1YXRpb25TdGlmZm5lc3M6IDFlOCxcclxuICAgICAgICAgICAgY29udGFjdEVxdWF0aW9uUmVsYXhhdGlvbjogM1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHdvcmxkLmFkZENvbnRhY3RNYXRlcmlhbChzbGlwcGVyeV9ncm91bmRfY20yKTtcclxuXHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGdyb3VuZCA9IHRoaXMuc3Bhd25FbnRpdHkobmV3IENBTk5PTi5WZWMzKDAsIDAsIDApLCBuZXcgQ0FOTk9OLlZlYzMoMzAsIDMwLCAxKSwge21hc3M6IDAsIG1hdGVyaWFsOiB0aGlzLl9tYXRlcmlhbF9ncm91bmR9KTtcclxuICAgICAgICBncm91bmQuZG9udFN5bmMgPSB0cnVlO1xyXG5cclxuICAgICAgICBjb25zdCBidWlsZGluZzEgPSB0aGlzLnNwYXduRW50aXR5KG5ldyBDQU5OT04uVmVjMygtNSwgMCwgMiksIG5ldyBDQU5OT04uVmVjMygyLCA0LCAyKSwge21hc3M6IDAsIG1hdGVyaWFsOiB0aGlzLl9tYXRlcmlhbF9ncm91bmR9LCBuZXcgcGMuQ29sb3IoMSwgMCwgMCkpO1xyXG4gICAgICAgIGJ1aWxkaW5nMS5kb250U3luYyA9IHRydWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3Qgc3RhaXJzID0gdGhpcy5zcGF3bkVudGl0eShuZXcgQ0FOTk9OLlZlYzMoLTMsIDIsIDEpLCBuZXcgQ0FOTk9OLlZlYzMoMSwgNSwgMSksIHttYXNzOiAwLCBtYXRlcmlhbDogdGhpcy5fbWF0ZXJpYWxfZ3JvdW5kfSwgbmV3IHBjLkNvbG9yKDAuNSwgMC43LCAwKSk7XHJcbiAgICAgICAgc3RhaXJzLmRvbnRTeW5jID0gdHJ1ZTtcclxuICAgICAgICBzdGFpcnMucXVhdGVybmlvbi5zZXRGcm9tRXVsZXIoLTM1LCAwLCAwKTtcclxuXHJcbiAgICAgICAgY29uc3QgYnVpbGRpbmcyID0gdGhpcy5zcGF3bkVudGl0eShuZXcgQ0FOTk9OLlZlYzMoNSwgMywgMiksIG5ldyBDQU5OT04uVmVjMygyLCAyLCA2KSwge21hc3M6IDAsIG1hdGVyaWFsOiB0aGlzLl9tYXRlcmlhbF9ncm91bmR9LCBuZXcgcGMuQ29sb3IoMC41LCAwLjcsIDApKTtcclxuICAgICAgICBidWlsZGluZzIuZG9udFN5bmMgPSB0cnVlO1xyXG5cclxuXHJcbiAgICAgICAgaWYodGhpcy5zZXJ2ZXIuZ2FtZS5pc1NlcnZlcikge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3Bhd25FbnRpdHkodW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgbmV3IHBjLkNvbG9yKDAuNSwgMCwgMCkpLnN0YXJ0Qm90QmVoYXZpb3VyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2NvbnN0IGJveCA9IHRoaXMuc3Bhd25UZXN0RW50aXR5KG5ldyBDQU5OT04uVmVjMygwLCAwLCA0KSwgbmV3IENBTk5PTi5WZWMzKDEsIDEsIDEpLCB7bWFzczogMjAwfSk7XHJcbiAgICAgICAgLy9jb25zdCBib3gyID0gdGhpcy5zcGF3blRlc3RFbnRpdHkobmV3IENBTk5PTi5WZWMzKDAsIDEsIDgpLCBuZXcgQ0FOTk9OLlZlYzMoMSwgMSwgMSksIHttYXNzOiAyMDB9KTtcclxuICAgICAgICBcclxuICAgICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiZ3JvdW5kOiBcIiArIHRoaXMucHJpbnRQb3NpdGlvbihncm91bmQuZ2V0UG9zaXRpb24oKSkpO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYm94OiBcIiArIHRoaXMucHJpbnRQb3NpdGlvbihib3guZ2V0UG9zaXRpb24oKSkpO1xyXG5cclxuICAgICAgICB9LCAyNTApXHJcblxyXG4gICAgICAgIC8vc2V0SW50ZXJ2YWwoKCkgPT4geyB0aGlzLnNwYXduVGVzdEVudGl0eSgpOyB9LCAxMDAwKVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzcGF3bkVudGl0eShwb3NpdGlvbj86IENBTk5PTi5WZWMzLCBoYWxmRXh0ZW5kcz86IENBTk5PTi5WZWMzLCBvcHRpb25zPzogQ0FOTk9OLklCb2R5T3B0aW9ucywgY29sb3I/OiBwYy5Db2xvciwgY3VzdG9tSWQ/OiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge21hc3M6IDUwfTtcclxuICAgICAgICBjb2xvciA9IGNvbG9yIHx8IG5ldyBwYy5Db2xvcigxLCAxLCAxKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ3NwYXduIGVudGl0eScpXHJcblxyXG4gICAgICAgIGlmKCFvcHRpb25zLm1hdGVyaWFsKSBvcHRpb25zLm1hdGVyaWFsID0gdGhpcy5fbWF0ZXJpYWxfdGVzdDtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2cob3B0aW9ucylcclxuXHJcbiAgICAgICAgY29uc3QgYm9keSA9IHRoaXMuY3JlYXRlUmVjdGFuZ2xlQm9keShwb3NpdGlvbiB8fCBuZXcgQ0FOTk9OLlZlYzMoTWF0aC5yYW5kb20oKSozLTEuNSwgTWF0aC5yYW5kb20oKSozLTEuNSwgMiksIGhhbGZFeHRlbmRzIHx8IG5ldyBDQU5OT04uVmVjMygwLjIsIDAuMiwgMC4yKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgZW50aXR5ID0gbmV3IEVudGl0eSh0aGlzKTtcclxuICAgICAgICBlbnRpdHkuZGF0YS5jb2xvciA9IFtjb2xvci5yLCBjb2xvci5nLCBjb2xvci5iXTtcclxuICAgICAgICBlbnRpdHkuc2V0Qm9keShib2R5KVxyXG4gICAgICAgIGlmKGN1c3RvbUlkKSBlbnRpdHkuc2V0SWQoY3VzdG9tSWQpO1xyXG5cclxuICAgICAgICB0aGlzLl9lbnRpdGllcy5zZXQoZW50aXR5LmlkLCBlbnRpdHkpO1xyXG5cclxuICAgICAgICByZXR1cm4gZW50aXR5O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcHJpbnRQb3NpdGlvbihwb3M6IENBTk5PTi5WZWMzKSB7XHJcbiAgICAgICAgcmV0dXJuIGAoJHtwb3MueH0sICR7cG9zLnl9LCAke3Bvcy56fSlgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZVJlY3RhbmdsZUJvZHkocG9zaXRpb246IENBTk5PTi5WZWMzLCBoYWxmRXh0ZW5kczogQ0FOTk9OLlZlYzMsIG9wdGlvbnM/OiBDQU5OT04uSUJvZHlPcHRpb25zKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3Qgb3B0ID0gb3B0aW9ucyB8fCB7fTtcclxuXHJcbiAgICAgICAgb3B0LnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICAgXHJcbiAgICAgICAgdmFyIHNoYXBlID0gbmV3IENBTk5PTi5Cb3goaGFsZkV4dGVuZHMpO1xyXG4gICAgICAgIHZhciBib2R5ID0gbmV3IENBTk5PTi5Cb2R5KG9wdCk7XHJcbiAgICAgICAgYm9keS5hZGRTaGFwZShzaGFwZSk7XHJcblxyXG4gICAgICAgIHRoaXMuZHluYW1pY1dvcmxkLmFkZEJvZHkoYm9keSk7XHJcblxyXG4gICAgICAgIHJldHVybiBib2R5OyBcclxuICAgIH1cclxufVxyXG5cclxuLypcclxuY29uc3QgZW50aXR5ID0gbmV3IHBjLkVudGl0eShuYW1lKTtcclxuZW50aXR5LnNldFBvc2l0aW9uKHBvc2l0aW9uKVxyXG50aGlzLmNyZWF0ZVJlY3RhbmdsZUF0RW50aXR5KGVudGl0eSwgc2l6ZSwgaXNEeW5hbWljLCBjb2xvcik7XHJcbmFwcC5yb290LmFkZENoaWxkKGVudGl0eSk7XHJcbiovIiwiaW1wb3J0ICogYXMgcGMgZnJvbSBcInBsYXljYW52YXNcIjtcclxuaW1wb3J0IHsgRW50aXR5IH0gZnJvbSBcIi4uL2VudGl0eS9lbnRpdHlcIjtcclxuaW1wb3J0IHsgR2FtZUNsaWVudCB9IGZyb20gXCIuLi9nYW1lL2dhbWVDbGllbnRcIjtcclxuaW1wb3J0IHsgSVBhY2tldERhdGFfRW50aXR5RGF0YSB9IGZyb20gXCIuLi9wYWNrZXQvcGFja2V0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGRTeW5jSGVscGVyIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGdhbWUoKSB7IHJldHVybiBHYW1lQ2xpZW50Lkluc3RhbmNlOyB9O1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgb25SZWNlaXZlRW50aXR5RGF0YShkYXRhOiBJUGFja2V0RGF0YV9FbnRpdHlEYXRhKSB7XHJcbiAgICAgICAgY29uc3Qgd29ybGQgPSB0aGlzLmdhbWUubWFpblNlcnZlci53b3JsZHNbMF07XHJcblxyXG4gICAgICAgIGxldCBpc05ld0VudGl0eTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZighd29ybGQuaGFzRW50aXR5KGRhdGEuZW50aXR5SWQpKSB7XHJcbiAgICAgICAgICAgIHdvcmxkLnNwYXduRW50aXR5KHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIG5ldyBwYy5Db2xvcigxLCAwLCAwKSwgZGF0YS5lbnRpdHlJZCk7XHJcbiAgICAgICAgICAgIGlzTmV3RW50aXR5ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCduZXcgZW50aXknKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZW50aXR5ID0gd29ybGQuZ2V0RW50aXR5KGRhdGEuZW50aXR5SWQpO1xyXG5cclxuICAgICAgICBlbnRpdHkuZnJvbUpTT04oZGF0YS5kYXRhKTtcclxuXHJcbiAgICAgICAgaWYoaXNOZXdFbnRpdHkpIHtcclxuICAgICAgICAgICAgZW50aXR5LmNhbkxlcnAgPSB0cnVlO1xyXG4gICAgICAgICAgICAvL2VudGl0eS5zY3JpcHQhLmNyZWF0ZSgnZW50aXR5U3luYycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIGlmKGVudGl0eS5pZCA9PSBHYW1lQ2xpZW50LnBsYXllcklkKSB7XHJcblxyXG4gICAgICAgICAgICBpZighR2FtZUNsaWVudC5wbGF5ZXIpIHtcclxuICAgICAgICAgICAgICAgIEdhbWVDbGllbnQucGxheWVyID0gZW50aXR5IGFzIEVudGl0eTtcclxuICAgICAgICAgICAgICAgIEdhbWVDbGllbnQucGxheWVyLmNhbkxlcnAgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIC8vR2FtZUNsaWVudC5wbGF5ZXIuc2V0Q29udHJvbGxhYmxlKCk7XHJcbiAgICAgICAgICAgICAgICAvL0dhbWVDbGllbnQuY2FtZXJhRm9sbG93RW50aXR5KGVudGl0eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkc1tpXV0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtkbWRhc3NjX2dhbWVcIl0gPSBzZWxmW1wid2VicGFja0NodW5rZG1kYXNzY19nYW1lXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxuX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9yc1wiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKSkpXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnNcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi93ZWJwYWNrL2NyZWRpdHMuanNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==