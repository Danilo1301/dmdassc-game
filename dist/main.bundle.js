/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./index/index.ts":
/*!************************!*\
  !*** ./index/index.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const matter_js_1 = __importDefault(__webpack_require__(/*! matter-js */ "./node_modules/matter-js/build/matter.js"));
const gameClient_1 = __webpack_require__(/*! ../src/game/gameClient */ "./src/game/gameClient.ts");
const game = new gameClient_1.GameClient(document.getElementById('game'));
game.start();
window['game'] = game;
const width = 800;
const height = 600;
const s = 3;
// renderer
const engine = game.mainServer.worlds[0].engine;
const render = matter_js_1.default.Render.create({
    element: document.body,
    engine: engine,
    bounds: {
        min: {
            x: -width / 2 * s,
            y: -height / 2 * s
        },
        max: {
            x: width / 2 * s,
            y: height / 2 * s
        }
    },
    options: {
        hasBounds: true,
        width: width,
        height: height,
        showAngleIndicator: true
    }
});
matter_js_1.default.Render.run(render);
// mouse constraint
const matterWorld = game.mainServer.worlds[0].matterWorld;
const constraint = {
    stiffness: 0.2,
    render: {
        visible: false
    }
};
const mouse = matter_js_1.default.Mouse.create(render.canvas);
const mouseConstraint = matter_js_1.default.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: constraint
});
matter_js_1.default.Composite.add(matterWorld, mouseConstraint);


/***/ }),

/***/ "./src/animatedMaterial/animatedMaterial.ts":
/*!**************************************************!*\
  !*** ./src/animatedMaterial/animatedMaterial.ts ***!
  \**************************************************/
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
exports.AnimatedMaterial = void 0;
const pc = __importStar(__webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs"));
class AnimatedMaterial {
    constructor(spritesX, spritesY, animTime) {
        this.material = new pc.StandardMaterial();
        this._offset = new pc.Vec2();
        this._numSprites = new pc.Vec2();
        this._currentSprite = new pc.Vec2(0, 0);
        this._animTime = 0;
        this._changeSpriteTime = 0;
        this._numSprites.x = spritesX;
        this._numSprites.y = spritesY;
        this._animTime = animTime;
    }
    setAsset(asset) {
        const material = this.material;
        material.diffuseMap = asset.resource;
        //material.blendType = pc.BLENDMODE_SRC_ALPHA;
        material.update();
    }
    update(dt) {
        this._changeSpriteTime += dt;
        if (this._changeSpriteTime >= this._animTime / 1000) {
            this._changeSpriteTime = 0;
            this._currentSprite.x++;
            if (this._currentSprite.x >= this._numSprites.x)
                this._currentSprite.x = 0;
        }
        const sx = 1 / this._numSprites.x;
        const sy = 1 / this._numSprites.y;
        this._offset.x = this._currentSprite.x * sx;
        this._offset.y = this._currentSprite.y * sy;
        const material = this.material;
        material.diffuseMapOffset.set(this._offset.x, this._offset.y);
        material.diffuseMapTiling.set(sx, sy);
        material.update();
    }
}
exports.AnimatedMaterial = AnimatedMaterial;


/***/ }),

/***/ "./src/camera/camera.ts":
/*!******************************!*\
  !*** ./src/camera/camera.ts ***!
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
exports.Camera = void 0;
const pc = __importStar(__webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs"));
const positionComponent_1 = __webpack_require__(/*! ../component/positionComponent */ "./src/component/positionComponent.ts");
const playcanvas_1 = __webpack_require__(/*! ../playcanvas/playcanvas */ "./src/playcanvas/playcanvas.ts");
const render_1 = __webpack_require__(/*! ../render/render */ "./src/render/render.ts");
class Camera {
    static init() {
        window["Camera"] = Camera;
    }
    static update(dt) {
        if (this.followPlayer) {
            const player = render_1.Render.player;
            if (!player)
                return;
            const positionComponent = player.getComponent(positionComponent_1.PositionComponent);
            this.setPosition(positionComponent.x, positionComponent.y);
        }
        this._position.z = this.height;
        playcanvas_1.PlayCanvas.camera.setPosition(this._position.x / 10, this._position.z / 10, this._position.y / 10);
    }
    static setPosition(x, y) {
        this._position.x = x;
        this._position.y = y;
    }
}
exports.Camera = Camera;
Camera.height = 200;
Camera.followPlayer = true;
Camera._position = new pc.Vec3();


/***/ }),

/***/ "./src/component/buildingSpriteComponent.ts":
/*!**************************************************!*\
  !*** ./src/component/buildingSpriteComponent.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BuildingSpriteComponent = void 0;
const glbLoader_1 = __webpack_require__(/*! ../glbLoader/glbLoader */ "./src/glbLoader/glbLoader.ts");
const render_1 = __webpack_require__(/*! ../render/render */ "./src/render/render.ts");
const component_1 = __webpack_require__(/*! ./component */ "./src/component/component.ts");
class BuildingSpriteComponent extends component_1.Component {
    init() {
        super.init();
        this.loadModel();
    }
    loadModel() {
        var app = render_1.Render.app;
        var world = this.entity.world;
        const pcEntity = this.entity.pcEntity;
        glbLoader_1.GLBLoader.loadModel('', (renderRootEntity) => {
            console.log(renderRootEntity);
            /*
            var bdl = renderRootEntity.children[1] as pc.Entity;

            console.log(bdl, 'bld')

            const obj = world.spawnObject();
            obj.position.set(20, 40);
            obj.setPcEntity(bdl);
            */
            /*
            CREATE COLLISION

            const bodies: Matter.Body[] = [];
            const positions: pc.Vec2[] = [];


            for (const node of renderRootEntity.children) {
                    
                if(node.name.startsWith("Collision")) {
                    console.log(node)

                    const localPosition = node.getLocalPosition();
                    const localScale = node.getLocalScale();
                    
                    const position = new pc.Vec2();
                    position.x = localPosition.x * 100;
                    position.y = localPosition.z * 100;

                    
                    positions.push(position)

                    const size = {
                        x: localScale.x * 100 * 2,
                        y: localScale.z * 100 * 2
                    }

                    const body = Matter.Bodies.rectangle(position.x, position.y, size.x, size.y, {isStatic: true});
                    
                    bodies.push(body);
                    
                    
                }
            }

     

            const bodyCenter = Matter.Body.create({isStatic: true, parts: Object.assign([], bodies)});
            
            Matter.Composite.add(world.matterWorld, bodyCenter);

            Matter.Body.setCentre(bodyCenter, {x: 0, y: 0})

            console.log(bodies)
            console.log(positions)

            for (let index = 0; index <= bodies.length-1; index++) {
                var b = bodies[index];
                var p = positions[index];

                console.log("index", index)

                console.log(p)

            
            }


            setInterval(() => {
                
                
                const positionComponent = this.entity.getComponent(PositionComponent);

                Matter.Body.setAngle(bodyCenter, positionComponent.angle);
                Matter.Body.setPosition(bodyCenter, {
                    x: positionComponent.x * 10,
                    y: positionComponent.y * 10
                });
                
            }, 0)
            */
            //
            pcEntity.addChild(renderRootEntity);
        });
        /*
        
        */
        /*
        loadGltf(gltf, app.graphicsDevice, function (err, res) {
            // Wrap the model as an asset and add to the asset registry
            var asset = new pc.Asset('gltf', 'model', {
                url: ''
            });

            asset.resource = res.model;
            asset.loaded = true;
            app.assets.add(asset);

            // Add the loaded scene to the hierarchy
            self.entity.addComponent('model', {
                asset: asset
            });
        }, {
            buffers : self.binAsset.resources
        });
        */
    }
    update(dt) {
        super.update(dt);
    }
    postupdate(dt) {
        super.postupdate(dt);
    }
}
exports.BuildingSpriteComponent = BuildingSpriteComponent;


/***/ }),

/***/ "./src/component/collisionComponent.ts":
/*!*********************************************!*\
  !*** ./src/component/collisionComponent.ts ***!
  \*********************************************/
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
exports.CollisionComponent = void 0;
const matter_js_1 = __importDefault(__webpack_require__(/*! matter-js */ "./node_modules/matter-js/build/matter.js"));
const pc = __importStar(__webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs"));
const component_1 = __webpack_require__(/*! ./component */ "./src/component/component.ts");
class CollisionComponent extends component_1.Component {
    constructor() {
        super(...arguments);
        this.size = new pc.Vec2(10, 10);
        this.frictionAir = 0.2;
    }
    get body() { return this._body; }
    init() {
        super.init();
        const body = this._body = matter_js_1.default.Bodies.rectangle(0, 0, this.size.x * 10, this.size.y * 10, { friction: 0.001, frictionAir: this.frictionAir });
        matter_js_1.default.Composite.add(this.entity.world.matterWorld, body);
    }
    update(dt) {
        super.update(dt);
    }
}
exports.CollisionComponent = CollisionComponent;


/***/ }),

/***/ "./src/component/component.ts":
/*!************************************!*\
  !*** ./src/component/component.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Component = void 0;
class Component {
    constructor() {
        this.priority = 0;
    }
    init() { }
    update(dt) { }
    postupdate(dt) { }
    serialize() { }
    unserialize(data) { }
}
exports.Component = Component;


/***/ }),

/***/ "./src/component/inputHandlerComponent.ts":
/*!************************************************!*\
  !*** ./src/component/inputHandlerComponent.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InputHandlerComponent = void 0;
const input_1 = __webpack_require__(/*! ../input/input */ "./src/input/input.ts");
const component_1 = __webpack_require__(/*! ./component */ "./src/component/component.ts");
class InputHandlerComponent extends component_1.Component {
    constructor() {
        super(...arguments);
        this.enabled = false;
        this.speed = 4;
        this.horizontal = 0;
        this.vertical = 0;
    }
    init() {
        super.init();
    }
    update(dt) {
        super.update(dt);
        if (this.enabled) {
            const KEY_LEFT = 65;
            const KEY_RIGHT = 68;
            const KEY_UP = 87;
            const KEY_DOWN = 83;
            this.horizontal = (input_1.Input.getKeyDown(KEY_RIGHT) ? 1 : 0) + ((input_1.Input.getKeyDown(KEY_LEFT) ? -1 : 0));
            this.vertical = (input_1.Input.getKeyDown(KEY_DOWN) ? 1 : 0) + ((input_1.Input.getKeyDown(KEY_UP) ? -1 : 0));
        }
    }
}
exports.InputHandlerComponent = InputHandlerComponent;


/***/ }),

/***/ "./src/component/objectSpriteComponent.ts":
/*!************************************************!*\
  !*** ./src/component/objectSpriteComponent.ts ***!
  \************************************************/
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
exports.ObjectSpriteComponent = void 0;
const pc = __importStar(__webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs"));
const animatedMaterial_1 = __webpack_require__(/*! ../animatedMaterial/animatedMaterial */ "./src/animatedMaterial/animatedMaterial.ts");
const render_1 = __webpack_require__(/*! ../render/render */ "./src/render/render.ts");
const component_1 = __webpack_require__(/*! ./component */ "./src/component/component.ts");
class ObjectSpriteComponent extends component_1.Component {
    get animatedMaterial() { return this._animatedMaterial; }
    init() {
        super.init();
        this.initAnimatedMaterial();
        const pcEntity = new pc.Entity();
        pcEntity.addComponent("render", {
            material: this.animatedMaterial.material,
            type: "box",
        });
        this.getPcEntity().addChild(pcEntity);
    }
    getPcEntity() {
        return this.entity.pcEntity;
    }
    initAnimatedMaterial() {
        const animatedMaterial = this._animatedMaterial = new animatedMaterial_1.AnimatedMaterial(1, 1, 200);
        render_1.Render.loadAsset('crate.png', (asset) => {
            animatedMaterial.setAsset(asset);
        });
    }
    postupdate(dt) {
        super.postupdate(dt);
        this.animatedMaterial.update(dt);
    }
}
exports.ObjectSpriteComponent = ObjectSpriteComponent;


/***/ }),

/***/ "./src/component/playerComponent.ts":
/*!******************************************!*\
  !*** ./src/component/playerComponent.ts ***!
  \******************************************/
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
exports.PlayerComponent = void 0;
const matter_js_1 = __importDefault(__webpack_require__(/*! matter-js */ "./node_modules/matter-js/build/matter.js"));
const pc = __importStar(__webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs"));
const collisionComponent_1 = __webpack_require__(/*! ./collisionComponent */ "./src/component/collisionComponent.ts");
const component_1 = __webpack_require__(/*! ./component */ "./src/component/component.ts");
const inputHandlerComponent_1 = __webpack_require__(/*! ./inputHandlerComponent */ "./src/component/inputHandlerComponent.ts");
class PlayerComponent extends component_1.Component {
    constructor() {
        super(...arguments);
        this.speed = 40;
    }
    init() {
        super.init();
    }
    update(dt) {
        super.update(dt);
        const inputHandler = this.entity.getComponent(inputHandlerComponent_1.InputHandlerComponent);
        const move = new pc.Vec2(inputHandler.horizontal, inputHandler.vertical);
        if (move.length() > 0) {
            const collisionComponent = this.entity.getComponent(collisionComponent_1.CollisionComponent);
            const s = this.speed * 0.001;
            matter_js_1.default.Body.applyForce(collisionComponent.body, collisionComponent.body.position, { x: move.x * s, y: move.y * s });
        }
    }
}
exports.PlayerComponent = PlayerComponent;


/***/ }),

/***/ "./src/component/positionComponent.ts":
/*!********************************************!*\
  !*** ./src/component/positionComponent.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PositionComponent = void 0;
const matter_js_1 = __importDefault(__webpack_require__(/*! matter-js */ "./node_modules/matter-js/build/matter.js"));
const collisionComponent_1 = __webpack_require__(/*! ./collisionComponent */ "./src/component/collisionComponent.ts");
const component_1 = __webpack_require__(/*! ./component */ "./src/component/component.ts");
class PositionComponent extends component_1.Component {
    constructor() {
        super(...arguments);
        this.priority = 1000;
        this._x = 0;
        this._y = 0;
        this._angle = 0;
    }
    get x() { return this._x; }
    get y() { return this._y; }
    get angle() { return this._angle; }
    update(dt) {
        super.update(dt);
        this.handleCollisionComponent();
    }
    set(x, y) {
        this._x = x;
        this._y = y;
        if (this.entity.hasComponent(collisionComponent_1.CollisionComponent)) {
            const c = this.entity.getComponent(collisionComponent_1.CollisionComponent);
            matter_js_1.default.Body.setPosition(c.body, { x: this._x * 10, y: this._y * 10 });
        }
    }
    handleCollisionComponent() {
        if (this.entity.hasComponent(collisionComponent_1.CollisionComponent)) {
            const c = this.entity.getComponent(collisionComponent_1.CollisionComponent);
            this._x = c.body.position.x * 0.1;
            this._y = c.body.position.y * 0.1;
            this._angle = c.body.angle;
        }
    }
    serialize() {
        const data = {
            x: this.x,
            y: this.y
        };
        return data;
    }
    unserialize(data) {
        const newPos = { x: this.x, y: this.y };
        if (data.x != undefined)
            newPos.x = data.x;
        if (data.y != undefined)
            newPos.y = data.y;
        this.set(newPos.x, newPos.y);
    }
}
exports.PositionComponent = PositionComponent;


/***/ }),

/***/ "./src/component/testAnimSprite.ts":
/*!*****************************************!*\
  !*** ./src/component/testAnimSprite.ts ***!
  \*****************************************/
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
exports.TestAnimSpriteComponent = void 0;
const pc = __importStar(__webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs"));
const animatedMaterial_1 = __webpack_require__(/*! ../animatedMaterial/animatedMaterial */ "./src/animatedMaterial/animatedMaterial.ts");
const render_1 = __webpack_require__(/*! ../render/render */ "./src/render/render.ts");
const component_1 = __webpack_require__(/*! ./component */ "./src/component/component.ts");
class TestAnimSpriteComponent extends component_1.Component {
    get animatedMaterial() { return this._animatedMaterial; }
    init() {
        super.init();
        this.initAnimatedMaterial();
        const pcEntity = new pc.Entity();
        pcEntity.addComponent("render", {
            material: this.animatedMaterial.material,
            type: "plane",
        });
        this.getPcEntity().addChild(pcEntity);
    }
    getPcEntity() {
        return this.entity.pcEntity;
    }
    initAnimatedMaterial() {
        const animatedMaterial = this._animatedMaterial = new animatedMaterial_1.AnimatedMaterial(3, 1, 200);
        render_1.Render.loadAsset('player.png', (asset) => {
            animatedMaterial.setAsset(asset);
        });
    }
    postupdate(dt) {
        super.postupdate(dt);
        this.animatedMaterial.update(dt);
    }
}
exports.TestAnimSpriteComponent = TestAnimSpriteComponent;


/***/ }),

/***/ "./src/component/vehicleComponent.ts":
/*!*******************************************!*\
  !*** ./src/component/vehicleComponent.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VehicleComponent = void 0;
const matter_js_1 = __importDefault(__webpack_require__(/*! matter-js */ "./node_modules/matter-js/build/matter.js"));
const collisionComponent_1 = __webpack_require__(/*! ./collisionComponent */ "./src/component/collisionComponent.ts");
const component_1 = __webpack_require__(/*! ./component */ "./src/component/component.ts");
const inputHandlerComponent_1 = __webpack_require__(/*! ./inputHandlerComponent */ "./src/component/inputHandlerComponent.ts");
const positionComponent_1 = __webpack_require__(/*! ./positionComponent */ "./src/component/positionComponent.ts");
class VehicleComponent extends component_1.Component {
    constructor() {
        super(...arguments);
        this.speed = 3;
    }
    init() {
        super.init();
    }
    update(dt) {
        super.update(dt);
        const inputHandler = this.entity.getComponent(inputHandlerComponent_1.InputHandlerComponent);
        const positionComponent = this.entity.getComponent(positionComponent_1.PositionComponent);
        const collisionComponent = this.entity.getComponent(collisionComponent_1.CollisionComponent);
        const body = collisionComponent.body;
        const angle = positionComponent.angle;
        const s = this.speed * 0.01;
        const force = {
            x: inputHandler.vertical * Math.cos(angle) * s,
            y: inputHandler.vertical * Math.sin(angle) * s
        };
        matter_js_1.default.Body.applyForce(collisionComponent.body, collisionComponent.body.position, { x: force.x, y: force.y });
        matter_js_1.default.Body.setAngularVelocity(body, inputHandler.horizontal * 0.1);
    }
}
exports.VehicleComponent = VehicleComponent;


/***/ }),

/***/ "./src/component/vehicleSpriteComponent.ts":
/*!*************************************************!*\
  !*** ./src/component/vehicleSpriteComponent.ts ***!
  \*************************************************/
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
exports.VehicleSpriteComponent = void 0;
const pc = __importStar(__webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs"));
const animatedMaterial_1 = __webpack_require__(/*! ../animatedMaterial/animatedMaterial */ "./src/animatedMaterial/animatedMaterial.ts");
const render_1 = __webpack_require__(/*! ../render/render */ "./src/render/render.ts");
const component_1 = __webpack_require__(/*! ./component */ "./src/component/component.ts");
class VehicleSpriteComponent extends component_1.Component {
    get animatedMaterial() { return this._animatedMaterial; }
    init() {
        super.init();
        this.initAnimatedMaterial();
        const pcEntity = new pc.Entity();
        pcEntity.addComponent("render", {
            material: this.animatedMaterial.material,
            type: "plane",
        });
        this.getPcEntity().addChild(pcEntity);
    }
    getPcEntity() {
        return this.entity.pcEntity;
    }
    initAnimatedMaterial() {
        const animatedMaterial = this._animatedMaterial = new animatedMaterial_1.AnimatedMaterial(1, 1, 200);
        render_1.Render.loadAsset('car.png', (asset) => {
            animatedMaterial.setAsset(asset);
        });
    }
    postupdate(dt) {
        super.postupdate(dt);
        this.animatedMaterial.update(dt);
    }
}
exports.VehicleSpriteComponent = VehicleSpriteComponent;


/***/ }),

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
const pc = __importStar(__webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs"));
const uuid_1 = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-browser/index.js");
class Entity {
    constructor(world, pcEntity) {
        this.data = {};
        this._id = (0, uuid_1.v4)();
        this._components = [];
        this._world = world;
        if (pcEntity)
            this._pcEntity = pcEntity;
    }
    get id() { return this._id; }
    get world() { return this._world; }
    get components() { return this._components; }
    get pcEntity() {
        if (!this._pcEntity)
            this._pcEntity = new pc.Entity();
        return this._pcEntity;
    }
    setId(id) {
        this._id = id;
    }
    setPcEntity(entity) {
        this._pcEntity = entity;
    }
    addComponent(c) {
        c.entity = this;
        this._components.push(c);
        return c;
    }
    hasComponent(constr) {
        for (const component of this._components)
            if (component instanceof constr)
                return true;
        return false;
    }
    getComponent(constr) {
        for (const component of this._components)
            if (component instanceof constr)
                return component;
        throw new Error(`Component ${constr.name} not found on Entity ${this.constructor.name}`);
    }
    init() {
        for (const component of this._components)
            component.init();
    }
    update(dt) {
        for (const component of this._components)
            component.update(dt);
    }
    postupdate(dt) {
        for (const component of this._components)
            component.postupdate(dt);
    }
}
exports.Entity = Entity;


/***/ }),

/***/ "./src/entity/entityBuilding.ts":
/*!**************************************!*\
  !*** ./src/entity/entityBuilding.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntityBuilding = void 0;
const entity_1 = __webpack_require__(/*! ./entity */ "./src/entity/entity.ts");
const positionComponent_1 = __webpack_require__(/*! ../component/positionComponent */ "./src/component/positionComponent.ts");
const buildingSpriteComponent_1 = __webpack_require__(/*! ../component/buildingSpriteComponent */ "./src/component/buildingSpriteComponent.ts");
class EntityBuilding extends entity_1.Entity {
    constructor(world) {
        super(world);
        this.position = this.addComponent(new positionComponent_1.PositionComponent());
        //const collisionComponent = this.addComponent(new CollisionComponent());
        //collisionComponent.size.set(10, 10)
        if (world.server.game.isClient) {
            this.addComponent(new buildingSpriteComponent_1.BuildingSpriteComponent());
        }
    }
}
exports.EntityBuilding = EntityBuilding;


/***/ }),

/***/ "./src/entity/entityObject.ts":
/*!************************************!*\
  !*** ./src/entity/entityObject.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntityObject = void 0;
const entity_1 = __webpack_require__(/*! ./entity */ "./src/entity/entity.ts");
const positionComponent_1 = __webpack_require__(/*! ../component/positionComponent */ "./src/component/positionComponent.ts");
const collisionComponent_1 = __webpack_require__(/*! ../component/collisionComponent */ "./src/component/collisionComponent.ts");
const objectSpriteComponent_1 = __webpack_require__(/*! ../component/objectSpriteComponent */ "./src/component/objectSpriteComponent.ts");
class EntityObject extends entity_1.Entity {
    constructor(world) {
        super(world);
        this.position = this.addComponent(new positionComponent_1.PositionComponent());
        const collisionComponent = this.addComponent(new collisionComponent_1.CollisionComponent());
        /*
        const s = 100;
        collisionComponent.size.set(s, s);
        collisionComponent.frictionAir = 0.03;
        */
        if (world.server.game.isClient) {
            this.addComponent(new objectSpriteComponent_1.ObjectSpriteComponent());
        }
    }
}
exports.EntityObject = EntityObject;


/***/ }),

/***/ "./src/entity/entityPlayer.ts":
/*!************************************!*\
  !*** ./src/entity/entityPlayer.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntityPlayer = void 0;
const entity_1 = __webpack_require__(/*! ./entity */ "./src/entity/entity.ts");
const positionComponent_1 = __webpack_require__(/*! ../component/positionComponent */ "./src/component/positionComponent.ts");
const collisionComponent_1 = __webpack_require__(/*! ../component/collisionComponent */ "./src/component/collisionComponent.ts");
const inputHandlerComponent_1 = __webpack_require__(/*! ../component/inputHandlerComponent */ "./src/component/inputHandlerComponent.ts");
const testAnimSprite_1 = __webpack_require__(/*! ../component/testAnimSprite */ "./src/component/testAnimSprite.ts");
const playerComponent_1 = __webpack_require__(/*! ../component/playerComponent */ "./src/component/playerComponent.ts");
class EntityPlayer extends entity_1.Entity {
    constructor(world) {
        super(world);
        this.position = this.addComponent(new positionComponent_1.PositionComponent());
        this.addComponent(new collisionComponent_1.CollisionComponent());
        this.addComponent(new inputHandlerComponent_1.InputHandlerComponent());
        this.addComponent(new playerComponent_1.PlayerComponent());
        if (world.server.game.isClient) {
            this.addComponent(new testAnimSprite_1.TestAnimSpriteComponent());
        }
    }
}
exports.EntityPlayer = EntityPlayer;


/***/ }),

/***/ "./src/entity/entityVehicle.ts":
/*!*************************************!*\
  !*** ./src/entity/entityVehicle.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntityVehicle = void 0;
const entity_1 = __webpack_require__(/*! ./entity */ "./src/entity/entity.ts");
const positionComponent_1 = __webpack_require__(/*! ../component/positionComponent */ "./src/component/positionComponent.ts");
const collisionComponent_1 = __webpack_require__(/*! ../component/collisionComponent */ "./src/component/collisionComponent.ts");
const inputHandlerComponent_1 = __webpack_require__(/*! ../component/inputHandlerComponent */ "./src/component/inputHandlerComponent.ts");
const vehicleSpriteComponent_1 = __webpack_require__(/*! ../component/vehicleSpriteComponent */ "./src/component/vehicleSpriteComponent.ts");
const vehicleComponent_1 = __webpack_require__(/*! ../component/vehicleComponent */ "./src/component/vehicleComponent.ts");
class EntityVehicle extends entity_1.Entity {
    constructor(world) {
        super(world);
        this.position = this.addComponent(new positionComponent_1.PositionComponent());
        this.addComponent(new inputHandlerComponent_1.InputHandlerComponent());
        this.addComponent(new vehicleComponent_1.VehicleComponent());
        const collisionComponent = this.addComponent(new collisionComponent_1.CollisionComponent());
        //collisionComponent.size.set(100, 45);
        //collisionComponent.frictionAir = 0.4;
        if (world.server.game.isClient) {
            this.addComponent(new vehicleSpriteComponent_1.VehicleSpriteComponent());
        }
    }
}
exports.EntityVehicle = EntityVehicle;


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
    constructor() {
        this._servers = new Map();
        this.isClient = false;
    }
    get servers() { return Array.from(this._servers.values()); }
    get mainServer() { return this.servers[0]; }
    start() { }
    update(dt) {
        this.servers.map(server => server.update(dt));
    }
    createServer(id) {
        const server = new server_1.Server(this);
        server.id = id;
        return this.addServer(server);
        ;
    }
    addServer(server) {
        this._servers.set(server.id, server);
        server.init();
        return server;
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
const camera_1 = __webpack_require__(/*! ../camera/camera */ "./src/camera/camera.ts");
const input_1 = __webpack_require__(/*! ../input/input */ "./src/input/input.ts");
const network_1 = __webpack_require__(/*! ../network/network */ "./src/network/network.ts");
const render_1 = __webpack_require__(/*! ../render/render */ "./src/render/render.ts");
const worldSync_1 = __webpack_require__(/*! ../world/worldSync */ "./src/world/worldSync.ts");
const game_1 = __webpack_require__(/*! ./game */ "./src/game/game.ts");
class GameClient extends game_1.Game {
    constructor(canvas) {
        super();
        this.isClient = true;
        this._network = new network_1.Network();
        this._network.init();
        render_1.Render.init(this, canvas);
        input_1.Input.init();
        camera_1.Camera.init();
        render_1.Render.app.on('update', (dt) => {
            this.update(dt);
        });
    }
    get network() { return this._network; }
    update(dt) {
        super.update(dt);
        this._network.update(dt);
        render_1.Render.update(dt);
        input_1.Input.update(dt);
        camera_1.Camera.update(dt);
    }
    start() {
        super.start();
        const server = this.createServer('server1');
        this.network.connect();
        this.startMultiplayer();
    }
    startSingleplayer() {
        const server = this.servers[0];
        const world = server.worlds[0];
        //const player = server.worlds[0].spawnPlayer();
        //Render.setPlayer(player);
        const veh = server.worlds[0].spawnVehicle();
        render_1.Render.setPlayer(veh);
        world.generateBaseWorld();
    }
    startMultiplayer() {
        const server = this.servers[0];
        const world = server.worlds[0];
        worldSync_1.WorldSync.world = world;
    }
}
exports.GameClient = GameClient;


/***/ }),

/***/ "./src/glbLoader/glbLoader.ts":
/*!************************************!*\
  !*** ./src/glbLoader/glbLoader.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GLBLoader = void 0;
const render_1 = __webpack_require__(/*! ../render/render */ "./src/render/render.ts");
class GLBLoader {
    static loadModel(url, callback) {
        __webpack_require__(/*! ../playcanvas/glb-utils.js */ "./src/playcanvas/glb-utils.js");
        render_1.Render.app.assets.loadFromUrl('building.glb', 'binary', function (err, glbAsset) {
            if (!glbAsset)
                return console.error("error");
            const utils = window['utils'];
            utils.loadGlbContainerFromAsset(glbAsset, null, glbAsset.name, function (err, asset) {
                var renderRootEntity = asset.resource.instantiateRenderEntity();
                callback(renderRootEntity);
            });
        });
    }
}
exports.GLBLoader = GLBLoader;


/***/ }),

/***/ "./src/input/input.ts":
/*!****************************!*\
  !*** ./src/input/input.ts ***!
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
exports.Input = void 0;
const pc = __importStar(__webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs"));
const render_1 = __webpack_require__(/*! ../render/render */ "./src/render/render.ts");
class Input {
    static init() {
        console.log("init");
        const app = render_1.Render.app;
        app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
        app.keyboard.on(pc.EVENT_KEYUP, this.onKeyUp, this);
    }
    static update(dt) {
    }
    static getKeyDown(key) {
        const keyCodes = [];
        if (typeof key == 'string') {
            keyCodes.push(key.toLowerCase().charCodeAt(0));
            keyCodes.push(key.toUpperCase().charCodeAt(0));
        }
        else {
            keyCodes.push(key);
        }
        for (const keyCode of keyCodes) {
            const state = this._keys.get(keyCode) === true;
            if (state)
                return true;
        }
        return false;
    }
    static onKeyDown(e) {
        const keyCode = parseInt(e.key);
        this._keys.set(keyCode, true);
    }
    static onKeyUp(e) {
        const keyCode = parseInt(e.key);
        this._keys.set(keyCode, false);
    }
}
exports.Input = Input;
Input._keys = new Map();


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
const packets_1 = __webpack_require__(/*! ../packet/packets */ "./src/packet/packets.ts");
const render_1 = __webpack_require__(/*! ../render/render */ "./src/render/render.ts");
const worldSync_1 = __webpack_require__(/*! ../world/worldSync */ "./src/world/worldSync.ts");
class Network {
    constructor() {
        this.sendPacketIntervalMs = 80;
        this._sendPacketTime = 0;
    }
    get address() {
        if (location.host.includes('localhost'))
            return `${location.protocol}//${location.host}/`;
        return `https://dmdassc-game.glitch.me/`;
    }
    init() {
        this._socket = (0, socket_io_client_1.io)(this.address, {
            //path: '/socket',
            autoConnect: false,
            reconnection: false
        });
        this._socket.on('p', (packet) => {
            this.onReceivePacket(packet);
        });
        console.log(`[network] Address: (${this.address})`);
    }
    connect() {
        this._socket.connect();
    }
    update(dt) {
        this._sendPacketTime += dt;
        if (this._sendPacketTime >= this.sendPacketIntervalMs / 1000) {
            this._sendPacketTime = 0;
            const player = render_1.Render.player;
            if (!player)
                return;
            const packet = Network.serializeEntity(player);
            this.send(packets_1.PACKET_TYPE.ENTITY_DATA, packet);
        }
    }
    send(packetId, data) {
        const packet = {
            id: packetId,
            data: data
        };
        this._socket.emit('p', packet);
        console.log(`[network] send`, packet);
    }
    onReceivePacket(packet) {
        if (packet.id == packets_1.PACKET_TYPE.ENTITY_DATA) {
            worldSync_1.WorldSync.processEntityPacketData(packet.data);
        }
        if (packet.id == packets_1.PACKET_TYPE.CONTROL_ENTITY) {
            const data = packet.data;
            worldSync_1.WorldSync.entityId = data.id;
        }
    }
    static serializeEntity(entity) {
        const componentsData = {};
        const entityFactory = entity.world.server.entityFactory;
        const packet = {
            id: entity.id,
            type: entityFactory.getIndexOfEntity(entity),
            cdata: componentsData
        };
        for (const component of entity.components) {
            const serializedData = component.serialize();
            if (!serializedData)
                continue;
            const id = entityFactory.getIndexOfComponent(component);
            componentsData[id] = serializedData;
        }
        return packet;
    }
}
exports.Network = Network;


/***/ }),

/***/ "./src/packet/packets.ts":
/*!*******************************!*\
  !*** ./src/packet/packets.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PACKET_TYPE = void 0;
var PACKET_TYPE;
(function (PACKET_TYPE) {
    PACKET_TYPE[PACKET_TYPE["ENTITY_DATA"] = 0] = "ENTITY_DATA";
    PACKET_TYPE[PACKET_TYPE["CONTROL_ENTITY"] = 1] = "CONTROL_ENTITY";
})(PACKET_TYPE = exports.PACKET_TYPE || (exports.PACKET_TYPE = {}));


/***/ }),

/***/ "./src/playcanvas/playcanvas.ts":
/*!**************************************!*\
  !*** ./src/playcanvas/playcanvas.ts ***!
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
exports.PlayCanvas = void 0;
const pc = __importStar(__webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs"));
class PlayCanvas {
    static setupApp(canvas) {
        const app = new pc.Application(canvas, {
            mouse: new pc.Mouse(canvas),
            touch: new pc.TouchDevice(canvas),
            keyboard: new pc.Keyboard(document.body)
        });
        app.resizeCanvas(800, 600);
        /*
        const ObjModelParser = require('./objModelParser.js');

        const m: any = app.loader.getHandler("model");
        m.addParser(new ObjModelParser(app.graphicsDevice), function (url, data) {
            return (pc.path.getExtension(url) === '.obj');
        });
        */
        //app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        //app.setCanvasResolution(pc.RESOLUTION_AUTO);
        return app;
    }
    static setupLocalClientScene(app) {
        const camera = this.camera = new pc.Entity('camera');
        camera.addComponent('camera', {
            clearColor: new pc.Color(0.1, 0.1, 0.1)
        });
        app.root.addChild(camera);
        camera.setPosition(0, 50, 0);
        //camera.lookAt(0, 0, 0);
        camera.setEulerAngles(-90, 0, 0);
        camera.addComponent('script').create('cameraFollow');
        const light = new pc.Entity('light');
        light.addComponent('light');
        app.root.addChild(light);
        light.setEulerAngles(30, 0, 0);
    }
}
exports.PlayCanvas = PlayCanvas;


/***/ }),

/***/ "./src/render/render.ts":
/*!******************************!*\
  !*** ./src/render/render.ts ***!
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
exports.Render = void 0;
const pc = __importStar(__webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs"));
const inputHandlerComponent_1 = __webpack_require__(/*! ../component/inputHandlerComponent */ "./src/component/inputHandlerComponent.ts");
const positionComponent_1 = __webpack_require__(/*! ../component/positionComponent */ "./src/component/positionComponent.ts");
const playcanvas_1 = __webpack_require__(/*! ../playcanvas/playcanvas */ "./src/playcanvas/playcanvas.ts");
class Render {
    static init(game, canvas) {
        this.game = game;
        this.app = playcanvas_1.PlayCanvas.setupApp(canvas);
        this.app.start();
        playcanvas_1.PlayCanvas.setupLocalClientScene(this.app);
        window["Render"] = Render;
    }
    static update(dt) {
        const world = this.game.mainServer.worlds[0];
        const app = this.app;
        for (const entity of world.entities) {
            //entity.render();
            if (!entity.pcEntity.parent) {
                if (!app.root.children.includes(entity.pcEntity)) {
                    app.root.addChild(entity.pcEntity);
                    const material = new pc.StandardMaterial();
                    material.diffuse = new pc.Color(0, 1, 0);
                    material.update();
                    const centerPcEntity = new pc.Entity();
                    centerPcEntity.addComponent("render", {
                        material: material,
                        type: "box",
                    });
                    centerPcEntity.setLocalScale(new pc.Vec3(0.2, 0.2, 0.2));
                    entity.pcEntity.addChild(centerPcEntity);
                }
            }
            const pcEntity = entity.pcEntity;
            const positionComponent = entity.getComponent(positionComponent_1.PositionComponent);
            pcEntity.setPosition(positionComponent.x / 10, 0, positionComponent.y / 10);
            pcEntity.setEulerAngles(0, pc.math.RAD_TO_DEG * -positionComponent.angle, 0);
        }
    }
    static setPlayer(entity) {
        this.player = entity;
        this.player.getComponent(inputHandlerComponent_1.InputHandlerComponent).enabled = true;
    }
    static loadAsset(url, callback) {
        const imageUrl = url;
        const app = Render.app;
        app.loader.getHandler("texture")['crossOrigin'] = "anonymous";
        const asset = new pc.Asset("myTexture", "texture", { url: imageUrl });
        asset.on("error", function (message) {
            console.log(message);
        });
        asset.on("load", function (asset) {
            callback(asset);
        });
        app.assets.add(asset);
        app.assets.load(asset);
        return asset;
    }
}
exports.Render = Render;


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
        this._allComponents = new Map();
        this._allEntities = new Map();
    }
    registerEntity(name, constr) {
        this._allEntities.set(name, constr);
    }
    registerComponent(name, constr) {
        this._allComponents.set(name, constr);
    }
    getIndexOfComponent(c) {
        let i = 0;
        for (const constr of this._allComponents.values()) {
            if (c instanceof constr)
                return i;
            i++;
        }
        throw "Component " + c.constructor.name + " not found";
    }
    getEntityByIndex(index) {
        return Array.from(this._allEntities.values())[index];
    }
    getIndexOfEntity(c) {
        let i = 0;
        for (const constr of this._allEntities.values()) {
            if (c instanceof constr)
                return i;
            i++;
        }
        throw "Entity " + c.constructor.name + " not found";
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
const collisionComponent_1 = __webpack_require__(/*! ../component/collisionComponent */ "./src/component/collisionComponent.ts");
const inputHandlerComponent_1 = __webpack_require__(/*! ../component/inputHandlerComponent */ "./src/component/inputHandlerComponent.ts");
const objectSpriteComponent_1 = __webpack_require__(/*! ../component/objectSpriteComponent */ "./src/component/objectSpriteComponent.ts");
const positionComponent_1 = __webpack_require__(/*! ../component/positionComponent */ "./src/component/positionComponent.ts");
const testAnimSprite_1 = __webpack_require__(/*! ../component/testAnimSprite */ "./src/component/testAnimSprite.ts");
const vehicleComponent_1 = __webpack_require__(/*! ../component/vehicleComponent */ "./src/component/vehicleComponent.ts");
const vehicleSpriteComponent_1 = __webpack_require__(/*! ../component/vehicleSpriteComponent */ "./src/component/vehicleSpriteComponent.ts");
const entityObject_1 = __webpack_require__(/*! ../entity/entityObject */ "./src/entity/entityObject.ts");
const entityPlayer_1 = __webpack_require__(/*! ../entity/entityPlayer */ "./src/entity/entityPlayer.ts");
const entityVehicle_1 = __webpack_require__(/*! ../entity/entityVehicle */ "./src/entity/entityVehicle.ts");
const world_1 = __webpack_require__(/*! ../world/world */ "./src/world/world.ts");
const entityFactory_1 = __webpack_require__(/*! ./entityFactory */ "./src/server/entityFactory.ts");
class Server {
    constructor(game) {
        this.id = "";
        this._worlds = new Map();
        this._game = game;
        this._entityFactory = new entityFactory_1.EntityFactory();
        this.registerEntitiesAndComponents();
    }
    get game() { return this._game; }
    get worlds() { return Array.from(this._worlds.values()); }
    get entityFactory() { return this._entityFactory; }
    registerEntitiesAndComponents() {
        const entityFactory = this._entityFactory;
        entityFactory.registerEntity("EntityPlayer", entityPlayer_1.EntityPlayer);
        entityFactory.registerEntity("EntityObject", entityObject_1.EntityObject);
        entityFactory.registerEntity("EntityVehicle", entityVehicle_1.EntityVehicle);
        entityFactory.registerComponent("PositionComponent", positionComponent_1.PositionComponent);
        entityFactory.registerComponent("CollisionComponent", collisionComponent_1.CollisionComponent);
        entityFactory.registerComponent("InputHandlerComponent", inputHandlerComponent_1.InputHandlerComponent);
        entityFactory.registerComponent("ObjectSpriteComponent", objectSpriteComponent_1.ObjectSpriteComponent);
        entityFactory.registerComponent("TestAnimSpriteComponent", testAnimSprite_1.TestAnimSpriteComponent);
        entityFactory.registerComponent("VehicleComponent", vehicleComponent_1.VehicleComponent);
        entityFactory.registerComponent("VehicleSpriteComponent", vehicleSpriteComponent_1.VehicleSpriteComponent);
    }
    init() {
        console.log(`[server] init`);
        this.createWorld('world');
    }
    update(dt) {
        this.worlds.map(world => world.update(dt));
        this.worlds.map(world => world.postupdate(dt));
    }
    createWorld(name) {
        console.log(`[server] create world '${name}'`);
        const world = new world_1.World(this);
        this._worlds.set(name, world);
        world.init();
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
const matter_js_1 = __importDefault(__webpack_require__(/*! matter-js */ "./node_modules/matter-js/build/matter.js"));
const entityBuilding_1 = __webpack_require__(/*! ../entity/entityBuilding */ "./src/entity/entityBuilding.ts");
const entityObject_1 = __webpack_require__(/*! ../entity/entityObject */ "./src/entity/entityObject.ts");
const entityPlayer_1 = __webpack_require__(/*! ../entity/entityPlayer */ "./src/entity/entityPlayer.ts");
const entityVehicle_1 = __webpack_require__(/*! ../entity/entityVehicle */ "./src/entity/entityVehicle.ts");
class World {
    constructor(server) {
        this._entities = new Map();
        this._server = server;
    }
    get server() { return this._server; }
    ;
    get entities() { return Array.from(this._entities.values()); }
    ;
    get engine() { return this._engine; }
    ;
    get matterWorld() { return this._matterWorld; }
    ;
    init() {
        console.log(`[world] init`);
        this.initMatter();
        this.generateBuldings();
    }
    generateBaseWorld() {
        for (let i = 0; i < 1; i++) {
            this.spawnPlayer();
        }
        for (let i = 0; i < 4; i++) {
            this.spawnObject();
        }
        for (let i = 0; i < 1; i++) {
            this.spawnVehicle();
        }
    }
    generateBuldings() {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                const b = this.spawnBuilding();
                b.position.set((x - 2) * 10 * 6, (y - 2) * 10 * 6);
            }
        }
    }
    initMatter() {
        const engine = this._engine = matter_js_1.default.Engine.create();
        const world = this._matterWorld = engine.world;
        const runner = this._runner = matter_js_1.default.Runner.create();
        engine.gravity.x = 0;
        engine.gravity.y = 0;
        matter_js_1.default.Runner.run(runner, engine);
    }
    spawnPlayer() {
        const entity = new entityPlayer_1.EntityPlayer(this);
        this.addEntity(entity);
        return entity;
    }
    spawnObject() {
        const entity = new entityObject_1.EntityObject(this);
        this.addEntity(entity);
        return entity;
    }
    spawnVehicle() {
        const entity = new entityVehicle_1.EntityVehicle(this);
        this.addEntity(entity);
        return entity;
    }
    spawnBuilding() {
        const entity = new entityBuilding_1.EntityBuilding(this);
        this.addEntity(entity);
        return entity;
    }
    update(dt) {
        this.entities.map(entity => entity.update(dt));
    }
    postupdate(dt) {
        this.entities.map(entity => entity.postupdate(dt));
    }
    getEntity(id) {
        return this._entities.get(id);
    }
    hasEntity(id) {
        return this._entities.has(id);
    }
    addEntity(entity) {
        this._entities.set(entity.id, entity);
        entity.init();
        return entity;
    }
}
exports.World = World;


/***/ }),

/***/ "./src/world/worldSync.ts":
/*!********************************!*\
  !*** ./src/world/worldSync.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorldSync = void 0;
const render_1 = __webpack_require__(/*! ../render/render */ "./src/render/render.ts");
class WorldSync {
    static processEntityPacketData(data) {
        const world = this.world;
        if (!world.hasEntity(data.id)) {
            const constr = world.server.entityFactory.getEntityByIndex(data.type);
            const entity = new constr(world);
            entity.setId(data.id);
            world.addEntity(entity);
        }
        const entity = world.getEntity(data.id);
        if (entity == render_1.Render.player)
            return;
        if (this.entityId == entity.id) {
            render_1.Render.setPlayer(entity);
        }
        for (const component of entity.components) {
            try {
                const cindex = world.server.entityFactory.getIndexOfComponent(component);
                if (data.cdata[cindex])
                    component.unserialize(data.cdata[cindex]);
            }
            catch (error) { }
        }
        console.log(data.cdata);
    }
}
exports.WorldSync = WorldSync;
WorldSync.entityId = "";


/***/ }),

/***/ "./src/playcanvas/glb-utils.js":
/*!*************************************!*\
  !*** ./src/playcanvas/glb-utils.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

const pc = __webpack_require__(/*! playcanvas */ "./node_modules/playcanvas/build/playcanvas.mjs");

(function(){
    var utils = {};
    var app = pc.Application.getApplication();

    /**
     * @name utils#loadGlbContainerFromAsset
     * @function
     * @description Load a GLB container from a binary asset that is a GLB.
     * @param {pc.Asset} glbBinAsset The binary asset that is the GLB.
     * @param {Object} options Optional. Extra options to do extra processing on the GLB.
     * @param {String} assetName. Name of the asset.
     * @param {Function} callback The callback function for loading the asset. Signature is `function(string:error, asset:containerAsset)`.
     * If `error` is null, then the load is successful.
     * @returns {pc.Asset} The asset that is created for the container resource.
     */
    utils.loadGlbContainerFromAsset = function (glbBinAsset, options, assetName, callback) {
        var blob = new Blob([glbBinAsset.resource]);
        var data = URL.createObjectURL(blob);
        return this.loadGlbContainerFromUrl(data, options, assetName, function(error, asset) {
            callback(error, asset);
            URL.revokeObjectURL(data);
        });
    };

    /**
     * @name utils#loadGlbContainerFromUrl
     * @function
     * @description Load a GLB container from a URL that returns a `model/gltf-binary` as a GLB.
     * @param {String} url The URL for the GLB
     * @param {Object} options Optional. Extra options to do extra processing on the GLB.
     * @param {String} assetName. Name of the asset.
     * @param {Function} callback The callback function for loading the asset. Signature is `function(string:error, asset:containerAsset)`.
     * If `error` is null, then the load is successful.
     * @returns {pc.Asset} The asset that is created for the container resource.
     */
    utils.loadGlbContainerFromUrl = function (url, options, assetName, callback) {
        var filename = assetName + '.glb';
        var file = {
            url: url,
            filename: filename
        };

        var asset = new pc.Asset(filename, 'container', file, null, options);
        asset.once('load', function (containerAsset) {
            if (callback) {
                // As we play animations by name, if we have only one animation, keep it the same name as
                // the original container otherwise, postfix it with a number
                var animations = containerAsset.resource.animations;
                if (animations.length == 1) {
                    animations[0].name = assetName;
                } else if (animations.length > 1) {
                    for (var i = 0; i < animations.length; ++i) {
                        animations[i].name = assetName + ' ' + i.toString();
                    }
                }

                callback(null, containerAsset);
            }
        });

        app.assets.add(asset);
        app.assets.load(asset);

        return asset;
    };

    window.utils = utils;
})();

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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors"], () => (__webpack_require__("./index/index.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7OztVQ3JFRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOztVQUVBO1VBQ0E7Ozs7O1dDekJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsK0JBQStCLHdDQUF3QztXQUN2RTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlCQUFpQixxQkFBcUI7V0FDdEM7V0FDQTtXQUNBLGtCQUFrQixxQkFBcUI7V0FDdkM7V0FDQTtXQUNBLEtBQUs7V0FDTDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDM0JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1dDUEQ7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL2luZGV4L2luZGV4LnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9hbmltYXRlZE1hdGVyaWFsL2FuaW1hdGVkTWF0ZXJpYWwudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL2NhbWVyYS9jYW1lcmEudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL2NvbXBvbmVudC9idWlsZGluZ1Nwcml0ZUNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvY29tcG9uZW50L2NvbGxpc2lvbkNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvY29tcG9uZW50L2NvbXBvbmVudC50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvY29tcG9uZW50L2lucHV0SGFuZGxlckNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvY29tcG9uZW50L29iamVjdFNwcml0ZUNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvY29tcG9uZW50L3BsYXllckNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvY29tcG9uZW50L3Bvc2l0aW9uQ29tcG9uZW50LnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9jb21wb25lbnQvdGVzdEFuaW1TcHJpdGUudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL2NvbXBvbmVudC92ZWhpY2xlQ29tcG9uZW50LnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9jb21wb25lbnQvdmVoaWNsZVNwcml0ZUNvbXBvbmVudC50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvZW50aXR5L2VudGl0eS50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvZW50aXR5L2VudGl0eUJ1aWxkaW5nLnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9lbnRpdHkvZW50aXR5T2JqZWN0LnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9lbnRpdHkvZW50aXR5UGxheWVyLnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9lbnRpdHkvZW50aXR5VmVoaWNsZS50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvZ2FtZS9nYW1lLnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9nYW1lL2dhbWVDbGllbnQudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL2dsYkxvYWRlci9nbGJMb2FkZXIudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL2lucHV0L2lucHV0LnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9uZXR3b3JrL25ldHdvcmsudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL3BhY2tldC9wYWNrZXRzLnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9wbGF5Y2FudmFzL3BsYXljYW52YXMudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL3JlbmRlci9yZW5kZXIudHMiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lLy4vc3JjL3NlcnZlci9lbnRpdHlGYWN0b3J5LnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9zZXJ2ZXIvc2VydmVyLnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy93b3JsZC93b3JsZC50cyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvLi9zcmMvd29ybGQvd29ybGRTeW5jLnRzIiwid2VicGFjazovL2RtZGFzc2MtZ2FtZS8uL3NyYy9wbGF5Y2FudmFzL2dsYi11dGlscy5qcyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vZG1kYXNzYy1nYW1lL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9kbWRhc3NjLWdhbWUvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNYXR0ZXIgZnJvbSBcIm1hdHRlci1qc1wiO1xyXG5pbXBvcnQgeyBHYW1lQ2xpZW50IH0gZnJvbSBcIi4uL3NyYy9nYW1lL2dhbWVDbGllbnRcIjtcclxuXHJcbmNvbnN0IGdhbWUgPSBuZXcgR2FtZUNsaWVudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2FtZScpKTtcclxuZ2FtZS5zdGFydCgpO1xyXG5cclxud2luZG93WydnYW1lJ10gPSBnYW1lO1xyXG5cclxuY29uc3Qgd2lkdGggPSA4MDA7XHJcbmNvbnN0IGhlaWdodCA9IDYwMDtcclxuY29uc3QgcyA9IDM7XHJcblxyXG4vLyByZW5kZXJlclxyXG5jb25zdCBlbmdpbmUgPSBnYW1lLm1haW5TZXJ2ZXIud29ybGRzWzBdLmVuZ2luZTtcclxuY29uc3QgcmVuZGVyID0gTWF0dGVyLlJlbmRlci5jcmVhdGUoe1xyXG4gICAgZWxlbWVudDogZG9jdW1lbnQuYm9keSxcclxuICAgIGVuZ2luZTogZW5naW5lLFxyXG4gICAgYm91bmRzOiB7XHJcbiAgICAgICAgbWluOiB7IFxyXG4gICAgICAgICAgICB4OiAtd2lkdGgvMiAqIHMsIFxyXG4gICAgICAgICAgICB5OiAtaGVpZ2h0LzIgKiBzXHJcbiAgICAgICAgfSxcclxuICAgICAgICBtYXg6IHsgXHJcbiAgICAgICAgICAgIHg6IHdpZHRoLzIgKiBzLFxyXG4gICAgICAgICAgICB5OiBoZWlnaHQvMiAqIHNcclxuICAgICAgICB9XHJcbiAgICAgfSxcclxuICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgIGhhc0JvdW5kczogdHJ1ZSxcclxuICAgICAgICAgd2lkdGg6IHdpZHRoLFxyXG4gICAgICAgICBoZWlnaHQ6IGhlaWdodCxcclxuICAgICAgICAgc2hvd0FuZ2xlSW5kaWNhdG9yOiB0cnVlXHJcbiAgICAgfVxyXG59KTtcclxuTWF0dGVyLlJlbmRlci5ydW4ocmVuZGVyKTtcclxuXHJcblxyXG5cclxuLy8gbW91c2UgY29uc3RyYWludFxyXG5jb25zdCBtYXR0ZXJXb3JsZCA9IGdhbWUubWFpblNlcnZlci53b3JsZHNbMF0ubWF0dGVyV29ybGQ7XHJcblxyXG5cclxuY29uc3QgY29uc3RyYWludDogYW55ID0ge1xyXG4gICAgc3RpZmZuZXNzOiAwLjIsXHJcbiAgICByZW5kZXI6IHtcclxuICAgICAgICB2aXNpYmxlOiBmYWxzZVxyXG4gICAgfVxyXG59O1xyXG5jb25zdCBtb3VzZSA9IE1hdHRlci5Nb3VzZS5jcmVhdGUocmVuZGVyLmNhbnZhcyk7XHJcbmNvbnN0IG1vdXNlQ29uc3RyYWludCA9IE1hdHRlci5Nb3VzZUNvbnN0cmFpbnQuY3JlYXRlKGVuZ2luZSwge1xyXG4gICAgbW91c2U6IG1vdXNlLFxyXG4gICAgY29uc3RyYWludDogY29uc3RyYWludFxyXG59KTtcclxuTWF0dGVyLkNvbXBvc2l0ZS5hZGQobWF0dGVyV29ybGQsIG1vdXNlQ29uc3RyYWludCk7IiwiaW1wb3J0ICogYXMgcGMgZnJvbSAncGxheWNhbnZhcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgQW5pbWF0ZWRNYXRlcmlhbCB7XHJcbiAgICBwdWJsaWMgbWF0ZXJpYWwgPSBuZXcgcGMuU3RhbmRhcmRNYXRlcmlhbCgpXHJcblxyXG4gICAgcHJpdmF0ZSBfb2Zmc2V0ID0gbmV3IHBjLlZlYzIoKTtcclxuICAgIHByaXZhdGUgX251bVNwcml0ZXMgPSBuZXcgcGMuVmVjMigpO1xyXG4gICAgcHJpdmF0ZSBfY3VycmVudFNwcml0ZSA9IG5ldyBwYy5WZWMyKDAsIDApO1xyXG4gICAgcHJpdmF0ZSBfYW5pbVRpbWU6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9jaGFuZ2VTcHJpdGVUaW1lOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNwcml0ZXNYOiBudW1iZXIsIHNwcml0ZXNZOiBudW1iZXIsIGFuaW1UaW1lOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9udW1TcHJpdGVzLnggPSBzcHJpdGVzWDtcclxuICAgICAgICB0aGlzLl9udW1TcHJpdGVzLnkgPSBzcHJpdGVzWTtcclxuICAgICAgICB0aGlzLl9hbmltVGltZSA9IGFuaW1UaW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRBc3NldChhc3NldDogcGMuQXNzZXQpIHtcclxuICAgICAgICBjb25zdCBtYXRlcmlhbCA9IHRoaXMubWF0ZXJpYWw7XHJcblxyXG4gICAgICAgIG1hdGVyaWFsLmRpZmZ1c2VNYXAgPSBhc3NldC5yZXNvdXJjZTtcclxuICAgICAgICAvL21hdGVyaWFsLmJsZW5kVHlwZSA9IHBjLkJMRU5ETU9ERV9TUkNfQUxQSEE7XHJcblxyXG4gICAgICAgIG1hdGVyaWFsLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2NoYW5nZVNwcml0ZVRpbWUgKz0gZHQ7XHJcbiAgICAgICAgaWYodGhpcy5fY2hhbmdlU3ByaXRlVGltZSA+PSB0aGlzLl9hbmltVGltZSAvIDEwMDApIHtcclxuICAgICAgICAgICAgdGhpcy5fY2hhbmdlU3ByaXRlVGltZSA9IDA7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50U3ByaXRlLngrKztcclxuICAgICAgICAgICAgaWYodGhpcy5fY3VycmVudFNwcml0ZS54ID49IHRoaXMuX251bVNwcml0ZXMueCkgdGhpcy5fY3VycmVudFNwcml0ZS54ID0gMDtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBjb25zdCBzeCA9IDEgLyB0aGlzLl9udW1TcHJpdGVzLng7XHJcbiAgICAgICAgY29uc3Qgc3kgPSAxIC8gdGhpcy5fbnVtU3ByaXRlcy55O1xyXG5cclxuICAgICAgICB0aGlzLl9vZmZzZXQueCA9IHRoaXMuX2N1cnJlbnRTcHJpdGUueCAqIHN4O1xyXG4gICAgICAgIHRoaXMuX29mZnNldC55ID0gdGhpcy5fY3VycmVudFNwcml0ZS55ICogc3k7XHJcblxyXG4gICAgICAgIGNvbnN0IG1hdGVyaWFsID0gdGhpcy5tYXRlcmlhbDtcclxuICAgICAgICBtYXRlcmlhbC5kaWZmdXNlTWFwT2Zmc2V0LnNldCh0aGlzLl9vZmZzZXQueCwgdGhpcy5fb2Zmc2V0LnkpO1xyXG4gICAgICAgIG1hdGVyaWFsLmRpZmZ1c2VNYXBUaWxpbmcuc2V0KHN4LCBzeSk7XHJcbiAgICAgICAgbWF0ZXJpYWwudXBkYXRlKCk7XHJcbiAgICB9XHJcbiAgICBcclxufSIsImltcG9ydCAqIGFzIHBjIGZyb20gXCJwbGF5Y2FudmFzXCI7XHJcbmltcG9ydCB7IFBvc2l0aW9uQ29tcG9uZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudC9wb3NpdGlvbkNvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBQbGF5Q2FudmFzIH0gZnJvbSBcIi4uL3BsYXljYW52YXMvcGxheWNhbnZhc1wiO1xyXG5pbXBvcnQgeyBSZW5kZXIgfSBmcm9tIFwiLi4vcmVuZGVyL3JlbmRlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENhbWVyYSB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGhlaWdodDogbnVtYmVyID0gMjAwO1xyXG4gICAgcHVibGljIHN0YXRpYyBmb2xsb3dQbGF5ZXI6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIF9wb3NpdGlvbiA9IG5ldyBwYy5WZWMzKCk7XHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdCgpIHtcclxuICAgICAgICB3aW5kb3dbXCJDYW1lcmFcIl0gPSBDYW1lcmE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIGlmKHRoaXMuZm9sbG93UGxheWVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBsYXllciA9IFJlbmRlci5wbGF5ZXI7XHJcblxyXG4gICAgICAgICAgICBpZighcGxheWVyKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbkNvbXBvbmVudCA9IHBsYXllci5nZXRDb21wb25lbnQoUG9zaXRpb25Db21wb25lbnQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zZXRQb3NpdGlvbihwb3NpdGlvbkNvbXBvbmVudC54LCBwb3NpdGlvbkNvbXBvbmVudC55KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb24ueiA9IHRoaXMuaGVpZ2h0O1xyXG5cclxuICAgICAgICBQbGF5Q2FudmFzLmNhbWVyYS5zZXRQb3NpdGlvbih0aGlzLl9wb3NpdGlvbi54IC8gMTAsIHRoaXMuX3Bvc2l0aW9uLnogLyAxMCwgdGhpcy5fcG9zaXRpb24ueSAvIDEwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHNldFBvc2l0aW9uKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb24ueCA9IHg7XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb24ueSA9IHk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgTWF0dGVyIGZyb20gJ21hdHRlci1qcyc7XHJcbmltcG9ydCAqIGFzIHBjIGZyb20gJ3BsYXljYW52YXMnO1xyXG5pbXBvcnQgeyBHTEJMb2FkZXIgfSBmcm9tICcuLi9nbGJMb2FkZXIvZ2xiTG9hZGVyJztcclxuaW1wb3J0IHsgUmVuZGVyIH0gZnJvbSAnLi4vcmVuZGVyL3JlbmRlcic7XHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBQb3NpdGlvbkNvbXBvbmVudCB9IGZyb20gJy4vcG9zaXRpb25Db21wb25lbnQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJ1aWxkaW5nU3ByaXRlQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuXHJcbiAgICBwdWJsaWMgaW5pdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0KCk7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZE1vZGVsKCk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBsb2FkTW9kZWwoKSB7XHJcbiAgICAgICAgdmFyIGFwcCA9IFJlbmRlci5hcHA7XHJcblxyXG5cclxuICAgICAgICB2YXIgd29ybGQgPSB0aGlzLmVudGl0eS53b3JsZDtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBwY0VudGl0eSA9IHRoaXMuZW50aXR5LnBjRW50aXR5O1xyXG5cclxuICAgICAgICBHTEJMb2FkZXIubG9hZE1vZGVsKCcnLCAocmVuZGVyUm9vdEVudGl0eSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZW5kZXJSb290RW50aXR5KVxyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgdmFyIGJkbCA9IHJlbmRlclJvb3RFbnRpdHkuY2hpbGRyZW5bMV0gYXMgcGMuRW50aXR5O1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coYmRsLCAnYmxkJylcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IHdvcmxkLnNwYXduT2JqZWN0KCk7XHJcbiAgICAgICAgICAgIG9iai5wb3NpdGlvbi5zZXQoMjAsIDQwKTtcclxuICAgICAgICAgICAgb2JqLnNldFBjRW50aXR5KGJkbCk7XHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICBDUkVBVEUgQ09MTElTSU9OXHJcblxyXG4gICAgICAgICAgICBjb25zdCBib2RpZXM6IE1hdHRlci5Cb2R5W10gPSBbXTtcclxuICAgICAgICAgICAgY29uc3QgcG9zaXRpb25zOiBwYy5WZWMyW10gPSBbXTtcclxuXHJcblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2YgcmVuZGVyUm9vdEVudGl0eS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYobm9kZS5uYW1lLnN0YXJ0c1dpdGgoXCJDb2xsaXNpb25cIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhub2RlKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2NhbFBvc2l0aW9uID0gbm9kZS5nZXRMb2NhbFBvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9jYWxTY2FsZSA9IG5vZGUuZ2V0TG9jYWxTY2FsZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gbmV3IHBjLlZlYzIoKTtcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi54ID0gbG9jYWxQb3NpdGlvbi54ICogMTAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLnkgPSBsb2NhbFBvc2l0aW9uLnogKiAxMDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9ucy5wdXNoKHBvc2l0aW9uKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzaXplID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4OiBsb2NhbFNjYWxlLnggKiAxMDAgKiAyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiBsb2NhbFNjYWxlLnogKiAxMDAgKiAyXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBib2R5ID0gTWF0dGVyLkJvZGllcy5yZWN0YW5nbGUocG9zaXRpb24ueCwgcG9zaXRpb24ueSwgc2l6ZS54LCBzaXplLnksIHtpc1N0YXRpYzogdHJ1ZX0pO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGJvZGllcy5wdXNoKGJvZHkpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgIFxyXG5cclxuICAgICAgICAgICAgY29uc3QgYm9keUNlbnRlciA9IE1hdHRlci5Cb2R5LmNyZWF0ZSh7aXNTdGF0aWM6IHRydWUsIHBhcnRzOiBPYmplY3QuYXNzaWduKFtdLCBib2RpZXMpfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBNYXR0ZXIuQ29tcG9zaXRlLmFkZCh3b3JsZC5tYXR0ZXJXb3JsZCwgYm9keUNlbnRlcik7XHJcblxyXG4gICAgICAgICAgICBNYXR0ZXIuQm9keS5zZXRDZW50cmUoYm9keUNlbnRlciwge3g6IDAsIHk6IDB9KVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coYm9kaWVzKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhwb3NpdGlvbnMpXHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDw9IGJvZGllcy5sZW5ndGgtMTsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGIgPSBib2RpZXNbaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHAgPSBwb3NpdGlvbnNbaW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5kZXhcIiwgaW5kZXgpXHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocClcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uQ29tcG9uZW50ID0gdGhpcy5lbnRpdHkuZ2V0Q29tcG9uZW50KFBvc2l0aW9uQ29tcG9uZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICBNYXR0ZXIuQm9keS5zZXRBbmdsZShib2R5Q2VudGVyLCBwb3NpdGlvbkNvbXBvbmVudC5hbmdsZSk7XHJcbiAgICAgICAgICAgICAgICBNYXR0ZXIuQm9keS5zZXRQb3NpdGlvbihib2R5Q2VudGVyLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgeDogcG9zaXRpb25Db21wb25lbnQueCAqIDEwLFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IHBvc2l0aW9uQ29tcG9uZW50LnkgKiAxMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSwgMClcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgLy9cclxuXHJcbiAgICAgICAgICAgIHBjRW50aXR5LmFkZENoaWxkKHJlbmRlclJvb3RFbnRpdHkpO1xyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSlcclxuICAgICAgICBcclxuICAgICAgICAvKlxyXG4gICAgICAgIFxyXG4gICAgICAgICovXHJcblxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgIGxvYWRHbHRmKGdsdGYsIGFwcC5ncmFwaGljc0RldmljZSwgZnVuY3Rpb24gKGVyciwgcmVzKSB7XHJcbiAgICAgICAgICAgIC8vIFdyYXAgdGhlIG1vZGVsIGFzIGFuIGFzc2V0IGFuZCBhZGQgdG8gdGhlIGFzc2V0IHJlZ2lzdHJ5XHJcbiAgICAgICAgICAgIHZhciBhc3NldCA9IG5ldyBwYy5Bc3NldCgnZ2x0ZicsICdtb2RlbCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJydcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhc3NldC5yZXNvdXJjZSA9IHJlcy5tb2RlbDtcclxuICAgICAgICAgICAgYXNzZXQubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgYXBwLmFzc2V0cy5hZGQoYXNzZXQpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIHRoZSBsb2FkZWQgc2NlbmUgdG8gdGhlIGhpZXJhcmNoeVxyXG4gICAgICAgICAgICBzZWxmLmVudGl0eS5hZGRDb21wb25lbnQoJ21vZGVsJywge1xyXG4gICAgICAgICAgICAgICAgYXNzZXQ6IGFzc2V0XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgYnVmZmVycyA6IHNlbGYuYmluQXNzZXQucmVzb3VyY2VzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgKi9cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlci51cGRhdGUoZHQpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgcG9zdHVwZGF0ZShkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIucG9zdHVwZGF0ZShkdCk7XHJcblxyXG4gICAgfVxyXG59IiwiaW1wb3J0IE1hdHRlciBmcm9tICdtYXR0ZXItanMnO1xyXG5pbXBvcnQgKiBhcyBwYyBmcm9tICdwbGF5Y2FudmFzJztcclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29sbGlzaW9uQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIHByaXZhdGUgX2JvZHk6IE1hdHRlci5Cb2R5O1xyXG5cclxuICAgIHB1YmxpYyBnZXQgYm9keSgpIHsgcmV0dXJuIHRoaXMuX2JvZHk7IH1cclxuXHJcbiAgICBwdWJsaWMgc2l6ZSA9IG5ldyBwYy5WZWMyKDEwLCAxMCk7XHJcbiAgICBwdWJsaWMgZnJpY3Rpb25BaXI6IG51bWJlciA9IDAuMjtcclxuXHJcbiAgICBwdWJsaWMgaW5pdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0KCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGJvZHkgPSB0aGlzLl9ib2R5ID0gTWF0dGVyLkJvZGllcy5yZWN0YW5nbGUoMCwgMCwgdGhpcy5zaXplLnggKiAxMCwgdGhpcy5zaXplLnkgKiAxMCwgeyBmcmljdGlvbjogMC4wMDEsIGZyaWN0aW9uQWlyOiB0aGlzLmZyaWN0aW9uQWlyIH0pO1xyXG4gICAgICAgIE1hdHRlci5Db21wb3NpdGUuYWRkKHRoaXMuZW50aXR5LndvcmxkLm1hdHRlcldvcmxkLCBib2R5KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlci51cGRhdGUoZHQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRW50aXR5IH0gZnJvbSBcIi4uL2VudGl0eS9lbnRpdHlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21wb25lbnQge1xyXG4gICAgcHVibGljIGVudGl0eTogRW50aXR5O1xyXG4gICAgcHVibGljIHByaW9yaXR5OiBudW1iZXIgPSAwO1xyXG4gICAgXHJcbiAgICBwdWJsaWMgaW5pdCgpIHt9XHJcbiAgICBwdWJsaWMgdXBkYXRlKGR0OiBudW1iZXIpIHt9XHJcbiAgICBwdWJsaWMgcG9zdHVwZGF0ZShkdDogbnVtYmVyKSB7fVxyXG4gICAgcHVibGljIHNlcmlhbGl6ZSgpOiBhbnkge31cclxuICAgIHB1YmxpYyB1bnNlcmlhbGl6ZShkYXRhKSB7fVxyXG59IiwiaW1wb3J0ICogYXMgcGMgZnJvbSAncGxheWNhbnZhcydcclxuaW1wb3J0IE1hdHRlciBmcm9tICdtYXR0ZXItanMnO1xyXG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gJy4uL2lucHV0L2lucHV0JztcclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSW5wdXRIYW5kbGVyQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIHB1YmxpYyBlbmFibGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgc3BlZWQgPSA0O1xyXG4gICAgcHVibGljIGhvcml6b250YWw6IG51bWJlciA9IDA7XHJcbiAgICBwdWJsaWMgdmVydGljYWw6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHVibGljIGluaXQoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShkdCk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuZW5hYmxlZCkge1xyXG4gICAgICAgICAgICBjb25zdCBLRVlfTEVGVCA9IDY1O1xyXG4gICAgICAgICAgICBjb25zdCBLRVlfUklHSFQgPSA2ODtcclxuICAgICAgICAgICAgY29uc3QgS0VZX1VQID0gODc7XHJcbiAgICAgICAgICAgIGNvbnN0IEtFWV9ET1dOID0gODM7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmhvcml6b250YWwgPSAoSW5wdXQuZ2V0S2V5RG93bihLRVlfUklHSFQpID8gMSA6IDApICsgKChJbnB1dC5nZXRLZXlEb3duKEtFWV9MRUZUKSA/IC0xIDogMCkpO1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRpY2FsID0gKElucHV0LmdldEtleURvd24oS0VZX0RPV04pID8gMSA6IDApICsgKChJbnB1dC5nZXRLZXlEb3duKEtFWV9VUCkgPyAtMSA6IDApKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgKiBhcyBwYyBmcm9tICdwbGF5Y2FudmFzJztcclxuaW1wb3J0IHsgQW5pbWF0ZWRNYXRlcmlhbCB9IGZyb20gJy4uL2FuaW1hdGVkTWF0ZXJpYWwvYW5pbWF0ZWRNYXRlcmlhbCc7XHJcbmltcG9ydCB7IFJlbmRlciB9IGZyb20gJy4uL3JlbmRlci9yZW5kZXInO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBPYmplY3RTcHJpdGVDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgcHVibGljIGdldCBhbmltYXRlZE1hdGVyaWFsKCkgeyByZXR1cm4gdGhpcy5fYW5pbWF0ZWRNYXRlcmlhbDsgfVxyXG5cclxuICAgIHByaXZhdGUgX2FuaW1hdGVkTWF0ZXJpYWw6IEFuaW1hdGVkTWF0ZXJpYWw7XHJcblxyXG4gICAgcHVibGljIGluaXQoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdCgpO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRBbmltYXRlZE1hdGVyaWFsKCk7XHJcbiAgXHJcbiAgICAgICAgY29uc3QgcGNFbnRpdHkgPSBuZXcgcGMuRW50aXR5KCk7XHJcbiAgICAgICAgcGNFbnRpdHkuYWRkQ29tcG9uZW50KFwicmVuZGVyXCIsIHtcclxuICAgICAgICAgICAgbWF0ZXJpYWw6IHRoaXMuYW5pbWF0ZWRNYXRlcmlhbC5tYXRlcmlhbCxcclxuICAgICAgICAgICAgdHlwZTogXCJib3hcIixcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmdldFBjRW50aXR5KCkuYWRkQ2hpbGQocGNFbnRpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0UGNFbnRpdHkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50aXR5LnBjRW50aXR5O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdEFuaW1hdGVkTWF0ZXJpYWwoKSB7XHJcbiAgICAgICAgY29uc3QgYW5pbWF0ZWRNYXRlcmlhbCA9IHRoaXMuX2FuaW1hdGVkTWF0ZXJpYWwgPSBuZXcgQW5pbWF0ZWRNYXRlcmlhbCgxLCAxLCAyMDApO1xyXG5cclxuICAgICAgICBSZW5kZXIubG9hZEFzc2V0KCdjcmF0ZS5wbmcnLCAoYXNzZXQpID0+IHtcclxuICAgICAgICAgICAgYW5pbWF0ZWRNYXRlcmlhbC5zZXRBc3NldChhc3NldCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBvc3R1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyLnBvc3R1cGRhdGUoZHQpO1xyXG5cclxuICAgICAgICB0aGlzLmFuaW1hdGVkTWF0ZXJpYWwudXBkYXRlKGR0KTtcclxuICAgIH1cclxufSIsImltcG9ydCBNYXR0ZXIgZnJvbSAnbWF0dGVyLWpzJztcclxuaW1wb3J0ICogYXMgcGMgZnJvbSAncGxheWNhbnZhcyc7XHJcbmltcG9ydCB7IElucHV0IH0gZnJvbSAnLi4vaW5wdXQvaW5wdXQnO1xyXG5pbXBvcnQgeyBDb2xsaXNpb25Db21wb25lbnQgfSBmcm9tICcuL2NvbGxpc2lvbkNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBJbnB1dEhhbmRsZXJDb21wb25lbnQgfSBmcm9tICcuL2lucHV0SGFuZGxlckNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFBvc2l0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi9wb3NpdGlvbkNvbXBvbmVudCc7XHJcblxyXG5leHBvcnQgY2xhc3MgUGxheWVyQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIHB1YmxpYyBzcGVlZDogbnVtYmVyID0gNDA7XHJcblxyXG4gICAgcHVibGljIGluaXQoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShkdCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGlucHV0SGFuZGxlciA9IHRoaXMuZW50aXR5LmdldENvbXBvbmVudChJbnB1dEhhbmRsZXJDb21wb25lbnQpO1xyXG5cclxuICAgICAgICBjb25zdCBtb3ZlID0gbmV3IHBjLlZlYzIoXHJcbiAgICAgICAgICAgIGlucHV0SGFuZGxlci5ob3Jpem9udGFsLFxyXG4gICAgICAgICAgICBpbnB1dEhhbmRsZXIudmVydGljYWxcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBcclxuICAgICAgICBpZihtb3ZlLmxlbmd0aCgpID4gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBjb2xsaXNpb25Db21wb25lbnQgPSB0aGlzLmVudGl0eS5nZXRDb21wb25lbnQoQ29sbGlzaW9uQ29tcG9uZW50KTtcclxuICAgICAgICAgICAgY29uc3QgcyA9IHRoaXMuc3BlZWQgKiAwLjAwMTtcclxuICAgICAgICAgICAgTWF0dGVyLkJvZHkuYXBwbHlGb3JjZShjb2xsaXNpb25Db21wb25lbnQuYm9keSwgY29sbGlzaW9uQ29tcG9uZW50LmJvZHkucG9zaXRpb24sIHt4OiBtb3ZlLnggKiBzLCB5OiBtb3ZlLnkgKiBzfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgTWF0dGVyIGZyb20gJ21hdHRlci1qcyc7XHJcbmltcG9ydCB7IENvbGxpc2lvbkNvbXBvbmVudCB9IGZyb20gXCIuL2NvbGxpc2lvbkNvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBvc2l0aW9uQ29tcG9uZW50X0RhdGEge1xyXG4gICAgeD86IG51bWJlclxyXG4gICAgeT86IG51bWJlclxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUG9zaXRpb25Db21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgcHVibGljIHByaW9yaXR5OiBudW1iZXIgPSAxMDAwO1xyXG5cclxuICAgIHByaXZhdGUgX3g6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF95OiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfYW5nbGU6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHVibGljIGdldCB4KCkgeyByZXR1cm4gdGhpcy5feDsgfVxyXG4gICAgcHVibGljIGdldCB5KCkgeyByZXR1cm4gdGhpcy5feTsgfVxyXG4gICAgcHVibGljIGdldCBhbmdsZSgpIHsgcmV0dXJuIHRoaXMuX2FuZ2xlOyB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKGR0KTtcclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVDb2xsaXNpb25Db21wb25lbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0KHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5feCA9IHg7XHJcbiAgICAgICAgdGhpcy5feSA9IHk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuZW50aXR5Lmhhc0NvbXBvbmVudChDb2xsaXNpb25Db21wb25lbnQpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGMgPSB0aGlzLmVudGl0eS5nZXRDb21wb25lbnQoQ29sbGlzaW9uQ29tcG9uZW50KTtcclxuICAgICAgICAgICAgTWF0dGVyLkJvZHkuc2V0UG9zaXRpb24oYy5ib2R5LCB7eDogdGhpcy5feCAqIDEwLCB5OiB0aGlzLl95ICogMTB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBoYW5kbGVDb2xsaXNpb25Db21wb25lbnQoKSB7XHJcbiAgICAgICAgaWYodGhpcy5lbnRpdHkuaGFzQ29tcG9uZW50KENvbGxpc2lvbkNvbXBvbmVudCkpIHtcclxuICAgICAgICAgICAgY29uc3QgYyA9IHRoaXMuZW50aXR5LmdldENvbXBvbmVudChDb2xsaXNpb25Db21wb25lbnQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5feCA9IGMuYm9keS5wb3NpdGlvbi54ICogMC4xO1xyXG4gICAgICAgICAgICB0aGlzLl95ID0gYy5ib2R5LnBvc2l0aW9uLnkgKiAwLjE7XHJcbiAgICAgICAgICAgIHRoaXMuX2FuZ2xlID0gYy5ib2R5LmFuZ2xlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VyaWFsaXplKCkge1xyXG4gICAgICAgIGNvbnN0IGRhdGE6IElQb3NpdGlvbkNvbXBvbmVudF9EYXRhID0ge1xyXG4gICAgICAgICAgICB4OiB0aGlzLngsXHJcbiAgICAgICAgICAgIHk6IHRoaXMueVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdW5zZXJpYWxpemUoZGF0YTogSVBvc2l0aW9uQ29tcG9uZW50X0RhdGEpIHtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3UG9zID0ge3g6IHRoaXMueCwgeTogdGhpcy55fTtcclxuXHJcbiAgICAgICAgaWYoZGF0YS54ICE9IHVuZGVmaW5lZCkgbmV3UG9zLnggPSBkYXRhLng7XHJcbiAgICAgICAgaWYoZGF0YS55ICE9IHVuZGVmaW5lZCkgbmV3UG9zLnkgPSBkYXRhLnk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0KG5ld1Bvcy54LCBuZXdQb3MueSlcclxuXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgKiBhcyBwYyBmcm9tICdwbGF5Y2FudmFzJztcclxuaW1wb3J0IHsgQW5pbWF0ZWRNYXRlcmlhbCB9IGZyb20gJy4uL2FuaW1hdGVkTWF0ZXJpYWwvYW5pbWF0ZWRNYXRlcmlhbCc7XHJcbmltcG9ydCB7IFJlbmRlciB9IGZyb20gJy4uL3JlbmRlci9yZW5kZXInO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUZXN0QW5pbVNwcml0ZUNvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBwdWJsaWMgZ2V0IGFuaW1hdGVkTWF0ZXJpYWwoKSB7IHJldHVybiB0aGlzLl9hbmltYXRlZE1hdGVyaWFsOyB9XHJcblxyXG4gICAgcHJpdmF0ZSBfYW5pbWF0ZWRNYXRlcmlhbDogQW5pbWF0ZWRNYXRlcmlhbDtcclxuXHJcbiAgICBwdWJsaWMgaW5pdCgpIHtcclxuICAgICAgICBzdXBlci5pbml0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdEFuaW1hdGVkTWF0ZXJpYWwoKTtcclxuICBcclxuICAgICAgICBjb25zdCBwY0VudGl0eSA9IG5ldyBwYy5FbnRpdHkoKTtcclxuICAgICAgICBwY0VudGl0eS5hZGRDb21wb25lbnQoXCJyZW5kZXJcIiwge1xyXG4gICAgICAgICAgICBtYXRlcmlhbDogdGhpcy5hbmltYXRlZE1hdGVyaWFsLm1hdGVyaWFsLFxyXG4gICAgICAgICAgICB0eXBlOiBcInBsYW5lXCIsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0UGNFbnRpdHkoKS5hZGRDaGlsZChwY0VudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRQY0VudGl0eSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbnRpdHkucGNFbnRpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0QW5pbWF0ZWRNYXRlcmlhbCgpIHtcclxuICAgICAgICBjb25zdCBhbmltYXRlZE1hdGVyaWFsID0gdGhpcy5fYW5pbWF0ZWRNYXRlcmlhbCA9IG5ldyBBbmltYXRlZE1hdGVyaWFsKDMsIDEsIDIwMCk7XHJcblxyXG4gICAgICAgIFJlbmRlci5sb2FkQXNzZXQoJ3BsYXllci5wbmcnLCAoYXNzZXQpID0+IHtcclxuICAgICAgICAgICAgYW5pbWF0ZWRNYXRlcmlhbC5zZXRBc3NldChhc3NldCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBvc3R1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyLnBvc3R1cGRhdGUoZHQpO1xyXG5cclxuICAgICAgICB0aGlzLmFuaW1hdGVkTWF0ZXJpYWwudXBkYXRlKGR0KTtcclxuICAgIH1cclxufSIsImltcG9ydCBNYXR0ZXIgZnJvbSAnbWF0dGVyLWpzJztcclxuaW1wb3J0ICogYXMgcGMgZnJvbSAncGxheWNhbnZhcyc7XHJcbmltcG9ydCB7IElucHV0IH0gZnJvbSAnLi4vaW5wdXQvaW5wdXQnO1xyXG5pbXBvcnQgeyBDb2xsaXNpb25Db21wb25lbnQgfSBmcm9tICcuL2NvbGxpc2lvbkNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBJbnB1dEhhbmRsZXJDb21wb25lbnQgfSBmcm9tICcuL2lucHV0SGFuZGxlckNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFBvc2l0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi9wb3NpdGlvbkNvbXBvbmVudCc7XHJcblxyXG5leHBvcnQgY2xhc3MgVmVoaWNsZUNvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBwdWJsaWMgc3BlZWQ6IG51bWJlciA9IDM7XHJcblxyXG4gICAgcHVibGljIGluaXQoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShkdCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGlucHV0SGFuZGxlciA9IHRoaXMuZW50aXR5LmdldENvbXBvbmVudChJbnB1dEhhbmRsZXJDb21wb25lbnQpO1xyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uQ29tcG9uZW50ID0gdGhpcy5lbnRpdHkuZ2V0Q29tcG9uZW50KFBvc2l0aW9uQ29tcG9uZW50KTtcclxuICAgICAgICBjb25zdCBjb2xsaXNpb25Db21wb25lbnQgPSB0aGlzLmVudGl0eS5nZXRDb21wb25lbnQoQ29sbGlzaW9uQ29tcG9uZW50KTtcclxuICAgICAgICBjb25zdCBib2R5ID0gY29sbGlzaW9uQ29tcG9uZW50LmJvZHk7XHJcbiAgICAgICAgY29uc3QgYW5nbGUgPSBwb3NpdGlvbkNvbXBvbmVudC5hbmdsZTtcclxuXHJcbiAgICAgICAgY29uc3QgcyA9IHRoaXMuc3BlZWQgKiAwLjAxO1xyXG4gICAgICAgIGNvbnN0IGZvcmNlID0ge1xyXG4gICAgICAgICAgICB4OiBpbnB1dEhhbmRsZXIudmVydGljYWwgKiBNYXRoLmNvcyhhbmdsZSkgKiBzLFxyXG4gICAgICAgICAgICB5OiBpbnB1dEhhbmRsZXIudmVydGljYWwgKiBNYXRoLnNpbihhbmdsZSkgKiBzXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBNYXR0ZXIuQm9keS5hcHBseUZvcmNlKGNvbGxpc2lvbkNvbXBvbmVudC5ib2R5LCBjb2xsaXNpb25Db21wb25lbnQuYm9keS5wb3NpdGlvbiwge3g6IGZvcmNlLngsIHk6IGZvcmNlLnl9KVxyXG5cclxuICAgICAgICBNYXR0ZXIuQm9keS5zZXRBbmd1bGFyVmVsb2NpdHkoYm9keSwgaW5wdXRIYW5kbGVyLmhvcml6b250YWwgKiAwLjEpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0ICogYXMgcGMgZnJvbSAncGxheWNhbnZhcyc7XHJcbmltcG9ydCB7IEFuaW1hdGVkTWF0ZXJpYWwgfSBmcm9tICcuLi9hbmltYXRlZE1hdGVyaWFsL2FuaW1hdGVkTWF0ZXJpYWwnO1xyXG5pbXBvcnQgeyBHYW1lQ2xpZW50IH0gZnJvbSAnLi4vZ2FtZS9nYW1lQ2xpZW50JztcclxuaW1wb3J0IHsgUmVuZGVyIH0gZnJvbSAnLi4vcmVuZGVyL3JlbmRlcic7XHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBQb3NpdGlvbkNvbXBvbmVudCB9IGZyb20gJy4vcG9zaXRpb25Db21wb25lbnQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZlaGljbGVTcHJpdGVDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgcHVibGljIGdldCBhbmltYXRlZE1hdGVyaWFsKCkgeyByZXR1cm4gdGhpcy5fYW5pbWF0ZWRNYXRlcmlhbDsgfVxyXG5cclxuICAgIHByaXZhdGUgX2FuaW1hdGVkTWF0ZXJpYWw6IEFuaW1hdGVkTWF0ZXJpYWw7XHJcblxyXG4gICAgcHVibGljIGluaXQoKSB7XHJcbiAgICAgICAgc3VwZXIuaW5pdCgpO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRBbmltYXRlZE1hdGVyaWFsKCk7XHJcbiAgXHJcbiAgICAgICAgY29uc3QgcGNFbnRpdHkgPSBuZXcgcGMuRW50aXR5KCk7XHJcbiAgICAgICAgcGNFbnRpdHkuYWRkQ29tcG9uZW50KFwicmVuZGVyXCIsIHtcclxuICAgICAgICAgICAgbWF0ZXJpYWw6IHRoaXMuYW5pbWF0ZWRNYXRlcmlhbC5tYXRlcmlhbCxcclxuICAgICAgICAgICAgdHlwZTogXCJwbGFuZVwiLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZ2V0UGNFbnRpdHkoKS5hZGRDaGlsZChwY0VudGl0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRQY0VudGl0eSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lbnRpdHkucGNFbnRpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0QW5pbWF0ZWRNYXRlcmlhbCgpIHtcclxuICAgICAgICBjb25zdCBhbmltYXRlZE1hdGVyaWFsID0gdGhpcy5fYW5pbWF0ZWRNYXRlcmlhbCA9IG5ldyBBbmltYXRlZE1hdGVyaWFsKDEsIDEsIDIwMCk7XHJcblxyXG4gICAgICAgIFJlbmRlci5sb2FkQXNzZXQoJ2Nhci5wbmcnLCAoYXNzZXQpID0+IHtcclxuICAgICAgICAgICAgYW5pbWF0ZWRNYXRlcmlhbC5zZXRBc3NldChhc3NldCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBvc3R1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyLnBvc3R1cGRhdGUoZHQpO1xyXG5cclxuICAgICAgICB0aGlzLmFuaW1hdGVkTWF0ZXJpYWwudXBkYXRlKGR0KTtcclxuICAgIH1cclxufSIsImltcG9ydCBNYXR0ZXIgZnJvbSAnbWF0dGVyLWpzJztcclxuaW1wb3J0ICogYXMgcGMgZnJvbSAncGxheWNhbnZhcyc7XHJcbmltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gJ3V1aWQnO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnQvY29tcG9uZW50JztcclxuaW1wb3J0IHsgSVBhY2tldF9Db21wb25lbnQsIElQYWNrZXRfRW50aXR5IH0gZnJvbSAnLi4vcGFja2V0L3BhY2tldHMnO1xyXG5pbXBvcnQgeyBXb3JsZCB9IGZyb20gJy4uL3dvcmxkL3dvcmxkJztcclxuXHJcbmV4cG9ydCBjbGFzcyBFbnRpdHkge1xyXG4gICAgcHVibGljIGRhdGE6IGFueSA9IHt9O1xyXG4gICAgcHJpdmF0ZSBfcGNFbnRpdHk6IHBjLkVudGl0eTtcclxuICAgIHByaXZhdGUgX2lkOiBzdHJpbmcgPSB1dWlkdjQoKTtcclxuICAgIHByaXZhdGUgX3dvcmxkOiBXb3JsZDtcclxuICAgIHByaXZhdGUgX2NvbXBvbmVudHM6IENvbXBvbmVudFtdID0gW107XHJcblxyXG4gICAgcHVibGljIGdldCBpZCgpIHsgcmV0dXJuIHRoaXMuX2lkOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHdvcmxkKCkgeyByZXR1cm4gdGhpcy5fd29ybGQ7IH1cclxuICAgIHB1YmxpYyBnZXQgY29tcG9uZW50cygpIHsgcmV0dXJuIHRoaXMuX2NvbXBvbmVudHM7IH1cclxuICAgIHB1YmxpYyBnZXQgcGNFbnRpdHkoKSB7XHJcbiAgICAgICAgaWYoIXRoaXMuX3BjRW50aXR5KSB0aGlzLl9wY0VudGl0eSA9IG5ldyBwYy5FbnRpdHkoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGNFbnRpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3Iod29ybGQ6IFdvcmxkLCBwY0VudGl0eT86IHBjLkVudGl0eSkge1xyXG4gICAgICAgIHRoaXMuX3dvcmxkID0gd29ybGQ7XHJcbiAgICAgICAgaWYocGNFbnRpdHkpIHRoaXMuX3BjRW50aXR5ID0gcGNFbnRpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldElkKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9pZCA9IGlkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRQY0VudGl0eShlbnRpdHk6IHBjLkVudGl0eSkge1xyXG4gICAgICAgIHRoaXMuX3BjRW50aXR5ID0gZW50aXR5O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRDb21wb25lbnQ8QyBleHRlbmRzIENvbXBvbmVudD4oYzogQykge1xyXG4gICAgICAgIGMuZW50aXR5ID0gdGhpcztcclxuICAgICAgICB0aGlzLl9jb21wb25lbnRzLnB1c2goYyk7XHJcbiAgICAgICAgcmV0dXJuIGM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhhc0NvbXBvbmVudDxDIGV4dGVuZHMgQ29tcG9uZW50Pihjb25zdHI6IHsgbmV3KC4uLmFyZ3M6IGFueVtdKTogQyB9KSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgdGhpcy5fY29tcG9uZW50cykgaWYgKGNvbXBvbmVudCBpbnN0YW5jZW9mIGNvbnN0cikgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDb21wb25lbnQ8QyBleHRlbmRzIENvbXBvbmVudD4oY29uc3RyOiB7IG5ldyguLi5hcmdzOiBhbnlbXSk6IEMgfSkge1xyXG4gICAgICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIHRoaXMuX2NvbXBvbmVudHMpIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBjb25zdHIpIHJldHVybiBjb21wb25lbnQgYXMgQztcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvbXBvbmVudCAke2NvbnN0ci5uYW1lfSBub3QgZm91bmQgb24gRW50aXR5ICR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfWApXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluaXQoKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgdGhpcy5fY29tcG9uZW50cykgY29tcG9uZW50LmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGNvbXBvbmVudCBvZiB0aGlzLl9jb21wb25lbnRzKSBjb21wb25lbnQudXBkYXRlKGR0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcG9zdHVwZGF0ZShkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgdGhpcy5fY29tcG9uZW50cykgY29tcG9uZW50LnBvc3R1cGRhdGUoZHQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRW50aXR5IH0gZnJvbSAnLi9lbnRpdHknO1xyXG5pbXBvcnQgeyBXb3JsZCB9IGZyb20gJy4uL3dvcmxkL3dvcmxkJztcclxuaW1wb3J0IHsgUG9zaXRpb25Db21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnQvcG9zaXRpb25Db21wb25lbnQnO1xyXG5pbXBvcnQgeyBDb2xsaXNpb25Db21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnQvY29sbGlzaW9uQ29tcG9uZW50JztcclxuaW1wb3J0IHsgQnVpbGRpbmdTcHJpdGVDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnQvYnVpbGRpbmdTcHJpdGVDb21wb25lbnQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVudGl0eUJ1aWxkaW5nIGV4dGVuZHMgRW50aXR5IHtcclxuXHJcbiAgICBwdWJsaWMgcG9zaXRpb246IFBvc2l0aW9uQ29tcG9uZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHdvcmxkOiBXb3JsZCkge1xyXG4gICAgICAgIHN1cGVyKHdvcmxkKTtcclxuXHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHRoaXMuYWRkQ29tcG9uZW50KG5ldyBQb3NpdGlvbkNvbXBvbmVudCgpKTtcclxuICAgICAgICBcclxuICAgICAgICAvL2NvbnN0IGNvbGxpc2lvbkNvbXBvbmVudCA9IHRoaXMuYWRkQ29tcG9uZW50KG5ldyBDb2xsaXNpb25Db21wb25lbnQoKSk7XHJcbiAgICAgICAgLy9jb2xsaXNpb25Db21wb25lbnQuc2l6ZS5zZXQoMTAsIDEwKVxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBpZih3b3JsZC5zZXJ2ZXIuZ2FtZS5pc0NsaWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZENvbXBvbmVudChuZXcgQnVpbGRpbmdTcHJpdGVDb21wb25lbnQoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRW50aXR5IH0gZnJvbSAnLi9lbnRpdHknO1xyXG5pbXBvcnQgeyBXb3JsZCB9IGZyb20gJy4uL3dvcmxkL3dvcmxkJztcclxuaW1wb3J0IHsgUG9zaXRpb25Db21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnQvcG9zaXRpb25Db21wb25lbnQnO1xyXG5pbXBvcnQgeyBDb2xsaXNpb25Db21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnQvY29sbGlzaW9uQ29tcG9uZW50JztcclxuaW1wb3J0IHsgT2JqZWN0U3ByaXRlQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50L29iamVjdFNwcml0ZUNvbXBvbmVudCc7XHJcblxyXG5leHBvcnQgY2xhc3MgRW50aXR5T2JqZWN0IGV4dGVuZHMgRW50aXR5IHtcclxuXHJcbiAgICBwdWJsaWMgcG9zaXRpb246IFBvc2l0aW9uQ29tcG9uZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHdvcmxkOiBXb3JsZCkge1xyXG4gICAgICAgIHN1cGVyKHdvcmxkKTtcclxuXHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHRoaXMuYWRkQ29tcG9uZW50KG5ldyBQb3NpdGlvbkNvbXBvbmVudCgpKTtcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgY29sbGlzaW9uQ29tcG9uZW50ID0gdGhpcy5hZGRDb21wb25lbnQobmV3IENvbGxpc2lvbkNvbXBvbmVudCgpKTtcclxuICAgICAgICAvKlxyXG4gICAgICAgIGNvbnN0IHMgPSAxMDA7XHJcbiAgICAgICAgY29sbGlzaW9uQ29tcG9uZW50LnNpemUuc2V0KHMsIHMpO1xyXG4gICAgICAgIGNvbGxpc2lvbkNvbXBvbmVudC5mcmljdGlvbkFpciA9IDAuMDM7XHJcbiAgICAgICAgKi9cclxuXHJcbiAgICAgICAgaWYod29ybGQuc2VydmVyLmdhbWUuaXNDbGllbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDb21wb25lbnQobmV3IE9iamVjdFNwcml0ZUNvbXBvbmVudCgpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFbnRpdHkgfSBmcm9tICcuL2VudGl0eSc7XHJcbmltcG9ydCB7IFdvcmxkIH0gZnJvbSAnLi4vd29ybGQvd29ybGQnO1xyXG5pbXBvcnQgeyBQb3NpdGlvbkNvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudC9wb3NpdGlvbkNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENvbGxpc2lvbkNvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudC9jb2xsaXNpb25Db21wb25lbnQnO1xyXG5pbXBvcnQgeyBJbnB1dEhhbmRsZXJDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnQvaW5wdXRIYW5kbGVyQ29tcG9uZW50JztcclxuaW1wb3J0IHsgVGVzdEFuaW1TcHJpdGVDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnQvdGVzdEFuaW1TcHJpdGUnO1xyXG5pbXBvcnQgeyBQbGF5ZXJDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnQvcGxheWVyQ29tcG9uZW50JztcclxuXHJcbmV4cG9ydCBjbGFzcyBFbnRpdHlQbGF5ZXIgZXh0ZW5kcyBFbnRpdHkge1xyXG5cclxuICAgIHB1YmxpYyBwb3NpdGlvbjogUG9zaXRpb25Db21wb25lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3Iod29ybGQ6IFdvcmxkKSB7XHJcbiAgICAgICAgc3VwZXIod29ybGQpO1xyXG5cclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5hZGRDb21wb25lbnQobmV3IFBvc2l0aW9uQ29tcG9uZW50KCkpO1xyXG4gICAgICAgIHRoaXMuYWRkQ29tcG9uZW50KG5ldyBDb2xsaXNpb25Db21wb25lbnQoKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5hZGRDb21wb25lbnQobmV3IElucHV0SGFuZGxlckNvbXBvbmVudCgpKTtcclxuICAgICAgICB0aGlzLmFkZENvbXBvbmVudChuZXcgUGxheWVyQ29tcG9uZW50KCkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHdvcmxkLnNlcnZlci5nYW1lLmlzQ2xpZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ29tcG9uZW50KG5ldyBUZXN0QW5pbVNwcml0ZUNvbXBvbmVudCgpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFbnRpdHkgfSBmcm9tICcuL2VudGl0eSc7XHJcbmltcG9ydCB7IFdvcmxkIH0gZnJvbSAnLi4vd29ybGQvd29ybGQnO1xyXG5pbXBvcnQgeyBQb3NpdGlvbkNvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudC9wb3NpdGlvbkNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENvbGxpc2lvbkNvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudC9jb2xsaXNpb25Db21wb25lbnQnO1xyXG5pbXBvcnQgeyBJbnB1dEhhbmRsZXJDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnQvaW5wdXRIYW5kbGVyQ29tcG9uZW50JztcclxuaW1wb3J0IHsgVmVoaWNsZVNwcml0ZUNvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudC92ZWhpY2xlU3ByaXRlQ29tcG9uZW50JztcclxuaW1wb3J0IHsgVmVoaWNsZUNvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudC92ZWhpY2xlQ29tcG9uZW50JztcclxuZXhwb3J0IGNsYXNzIEVudGl0eVZlaGljbGUgZXh0ZW5kcyBFbnRpdHkge1xyXG5cclxuICAgIHB1YmxpYyBwb3NpdGlvbjogUG9zaXRpb25Db21wb25lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3Iod29ybGQ6IFdvcmxkKSB7XHJcbiAgICAgICAgc3VwZXIod29ybGQpO1xyXG5cclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5hZGRDb21wb25lbnQobmV3IFBvc2l0aW9uQ29tcG9uZW50KCkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuYWRkQ29tcG9uZW50KG5ldyBJbnB1dEhhbmRsZXJDb21wb25lbnQoKSk7XHJcbiAgICAgICAgdGhpcy5hZGRDb21wb25lbnQobmV3IFZlaGljbGVDb21wb25lbnQoKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgY29sbGlzaW9uQ29tcG9uZW50ID0gdGhpcy5hZGRDb21wb25lbnQobmV3IENvbGxpc2lvbkNvbXBvbmVudCgpKTtcclxuICAgICAgICAvL2NvbGxpc2lvbkNvbXBvbmVudC5zaXplLnNldCgxMDAsIDQ1KTtcclxuICAgICAgICAvL2NvbGxpc2lvbkNvbXBvbmVudC5mcmljdGlvbkFpciA9IDAuNDtcclxuICAgICAgICBcclxuICAgICAgICBpZih3b3JsZC5zZXJ2ZXIuZ2FtZS5pc0NsaWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZENvbXBvbmVudChuZXcgVmVoaWNsZVNwcml0ZUNvbXBvbmVudCgpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBTZXJ2ZXIgfSBmcm9tIFwiLi4vc2VydmVyL3NlcnZlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWUge1xyXG4gICAgcHJpdmF0ZSBfc2VydmVycyA9IG5ldyBNYXA8c3RyaW5nLCBTZXJ2ZXI+KCk7XHJcblxyXG4gICAgcHVibGljIGlzQ2xpZW50OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgZ2V0IHNlcnZlcnMoKSB7IHJldHVybiBBcnJheS5mcm9tKHRoaXMuX3NlcnZlcnMudmFsdWVzKCkpOyB9XHJcbiAgICBwdWJsaWMgZ2V0IG1haW5TZXJ2ZXIoKSB7IHJldHVybiB0aGlzLnNlcnZlcnNbMF07IH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQoKSB7fVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuc2VydmVycy5tYXAoc2VydmVyID0+IHNlcnZlci51cGRhdGUoZHQpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlU2VydmVyKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBzZXJ2ZXIgPSBuZXcgU2VydmVyKHRoaXMpO1xyXG4gICAgICAgIHNlcnZlci5pZCA9IGlkO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFkZFNlcnZlcihzZXJ2ZXIpOztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkU2VydmVyKHNlcnZlcjogU2VydmVyKSB7XHJcbiAgICAgICAgdGhpcy5fc2VydmVycy5zZXQoc2VydmVyLmlkLCBzZXJ2ZXIpO1xyXG4gICAgICAgIHNlcnZlci5pbml0KCk7XHJcbiAgICAgICAgcmV0dXJuIHNlcnZlcjtcclxuICAgIH1cclxufSIsImltcG9ydCAqIGFzIHBjIGZyb20gJ3BsYXljYW52YXMnO1xyXG5pbXBvcnQgeyBDYW1lcmEgfSBmcm9tICcuLi9jYW1lcmEvY2FtZXJhJztcclxuXHJcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uL2lucHV0L2lucHV0XCI7XHJcbmltcG9ydCB7IE5ldHdvcmsgfSBmcm9tIFwiLi4vbmV0d29yay9uZXR3b3JrXCI7XHJcbmltcG9ydCB7IFJlbmRlciB9IGZyb20gJy4uL3JlbmRlci9yZW5kZXInO1xyXG5pbXBvcnQgeyBXb3JsZFN5bmMgfSBmcm9tICcuLi93b3JsZC93b3JsZFN5bmMnO1xyXG5pbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4vZ2FtZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWVDbGllbnQgZXh0ZW5kcyBHYW1lIHtcclxuICAgIHB1YmxpYyBnZXQgbmV0d29yaygpIHsgcmV0dXJuIHRoaXMuX25ldHdvcms7IH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfbmV0d29yazogTmV0d29yaztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXMpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuaXNDbGllbnQgPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLl9uZXR3b3JrID0gbmV3IE5ldHdvcmsoKTtcclxuICAgICAgICB0aGlzLl9uZXR3b3JrLmluaXQoKTtcclxuXHJcbiAgICAgICAgUmVuZGVyLmluaXQodGhpcywgY2FudmFzKTtcclxuICAgICAgICBJbnB1dC5pbml0KCk7XHJcbiAgICAgICAgQ2FtZXJhLmluaXQoKTtcclxuXHJcbiAgICAgICAgUmVuZGVyLmFwcC5vbigndXBkYXRlJywgKGR0OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUoZHQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShkdCk7XHJcblxyXG4gICAgICAgIHRoaXMuX25ldHdvcmsudXBkYXRlKGR0KTtcclxuXHJcbiAgICAgICAgUmVuZGVyLnVwZGF0ZShkdCk7XHJcbiAgICAgICAgSW5wdXQudXBkYXRlKGR0KTtcclxuICAgICAgICBDYW1lcmEudXBkYXRlKGR0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQoKSB7XHJcbiAgICAgICAgc3VwZXIuc3RhcnQoKTtcclxuICAgICAgICBjb25zdCBzZXJ2ZXIgPSB0aGlzLmNyZWF0ZVNlcnZlcignc2VydmVyMScpO1xyXG5cclxuICAgICAgICB0aGlzLm5ldHdvcmsuY29ubmVjdCgpO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0TXVsdGlwbGF5ZXIoKTtcclxuXHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGFydFNpbmdsZXBsYXllcigpIHtcclxuICAgICAgICBjb25zdCBzZXJ2ZXIgPSB0aGlzLnNlcnZlcnNbMF07XHJcbiAgICAgICAgY29uc3Qgd29ybGQgPSBzZXJ2ZXIud29ybGRzWzBdO1xyXG5cclxuICAgICAgICAvL2NvbnN0IHBsYXllciA9IHNlcnZlci53b3JsZHNbMF0uc3Bhd25QbGF5ZXIoKTtcclxuICAgICAgICAvL1JlbmRlci5zZXRQbGF5ZXIocGxheWVyKTtcclxuXHJcbiAgICAgICAgY29uc3QgdmVoID0gc2VydmVyLndvcmxkc1swXS5zcGF3blZlaGljbGUoKTtcclxuICAgICAgICBSZW5kZXIuc2V0UGxheWVyKHZlaCk7XHJcblxyXG4gICAgICAgIHdvcmxkLmdlbmVyYXRlQmFzZVdvcmxkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGFydE11bHRpcGxheWVyKCkge1xyXG4gICAgICAgIGNvbnN0IHNlcnZlciA9IHRoaXMuc2VydmVyc1swXTtcclxuICAgICAgICBjb25zdCB3b3JsZCA9IHNlcnZlci53b3JsZHNbMF07XHJcblxyXG4gICAgICAgIFdvcmxkU3luYy53b3JsZCA9IHdvcmxkO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUmVuZGVyIH0gZnJvbSBcIi4uL3JlbmRlci9yZW5kZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBHTEJMb2FkZXIge1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkTW9kZWwodXJsOiBzdHJpbmcsIGNhbGxiYWNrOiAoZW50aXR5OiBwYy5FbnRpdHkpID0+IHZvaWQpIHtcclxuICAgICAgICByZXF1aXJlKCcuLi9wbGF5Y2FudmFzL2dsYi11dGlscy5qcycpXHJcblxyXG4gICAgICAgIFJlbmRlci5hcHAuYXNzZXRzLmxvYWRGcm9tVXJsKCdidWlsZGluZy5nbGInLCAnYmluYXJ5JywgZnVuY3Rpb24gKGVyciwgZ2xiQXNzZXQpIHtcclxuXHJcbiAgICAgICAgICAgIGlmKCFnbGJBc3NldCkgcmV0dXJuIGNvbnNvbGUuZXJyb3IoXCJlcnJvclwiKTtcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgdXRpbHMgPSB3aW5kb3dbJ3V0aWxzJ107XHJcblxyXG4gICAgICAgICAgICB1dGlscy5sb2FkR2xiQ29udGFpbmVyRnJvbUFzc2V0KGdsYkFzc2V0LCBudWxsLCBnbGJBc3NldC5uYW1lLCBmdW5jdGlvbiAoZXJyLCBhc3NldCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlbmRlclJvb3RFbnRpdHkgPSBhc3NldC5yZXNvdXJjZS5pbnN0YW50aWF0ZVJlbmRlckVudGl0eSgpO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2socmVuZGVyUm9vdEVudGl0eSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImltcG9ydCAqIGFzIHBjIGZyb20gJ3BsYXljYW52YXMnXHJcblxyXG5pbXBvcnQgeyBSZW5kZXIgfSBmcm9tICcuLi9yZW5kZXIvcmVuZGVyJztcclxuXHJcbmV4cG9ydCBjbGFzcyBJbnB1dCB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfa2V5cyA9IG5ldyBNYXA8bnVtYmVyLCBib29sZWFuPigpO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImluaXRcIilcclxuXHJcbiAgICAgICAgY29uc3QgYXBwID0gUmVuZGVyLmFwcDtcclxuICAgICAgICBhcHAua2V5Ym9hcmQub24ocGMuRVZFTlRfS0VZRE9XTiwgdGhpcy5vbktleURvd24sIHRoaXMpO1xyXG4gICAgICAgIGFwcC5rZXlib2FyZC5vbihwYy5FVkVOVF9LRVlVUCwgdGhpcy5vbktleVVwLCB0aGlzKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldEtleURvd24oa2V5OiBudW1iZXIgfCBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBrZXlDb2RlczogbnVtYmVyW10gPSBbXVxyXG5cclxuICAgICAgICBpZih0eXBlb2Yga2V5ID09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGtleUNvZGVzLnB1c2goa2V5LnRvTG93ZXJDYXNlKCkuY2hhckNvZGVBdCgwKSlcclxuICAgICAgICAgICAga2V5Q29kZXMucHVzaChrZXkudG9VcHBlckNhc2UoKS5jaGFyQ29kZUF0KDApKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGtleUNvZGVzLnB1c2goa2V5KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBrZXlDb2RlIG9mIGtleUNvZGVzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5fa2V5cy5nZXQoa2V5Q29kZSkgPT09IHRydWU7XHJcbiAgICAgICAgICAgIGlmKHN0YXRlKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBvbktleURvd24oZTogS2V5Ym9hcmRFdmVudCkge1xyXG4gICAgICAgIGNvbnN0IGtleUNvZGUgPSBwYXJzZUludChlLmtleSk7XHJcbiAgICAgICAgdGhpcy5fa2V5cy5zZXQoa2V5Q29kZSwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgb25LZXlVcChlOiBLZXlib2FyZEV2ZW50KSB7XHJcbiAgICAgICAgY29uc3Qga2V5Q29kZSA9IHBhcnNlSW50KGUua2V5KTtcclxuICAgICAgICB0aGlzLl9rZXlzLnNldChrZXlDb2RlLCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgICBcclxufSIsImltcG9ydCB7IGlvLCBTb2NrZXQgfSBmcm9tIFwic29ja2V0LmlvLWNsaWVudFwiO1xyXG5pbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwiLi4vZW50aXR5L2VudGl0eVwiO1xyXG5pbXBvcnQgeyBHYW1lQ2xpZW50IH0gZnJvbSBcIi4uL2dhbWUvZ2FtZUNsaWVudFwiO1xyXG5pbXBvcnQgeyBJUGFja2V0LCBJUGFja2V0X0NvbXBvbmVudCwgSVBhY2tldF9Db250cm9sRW50aXR5LCBJUGFja2V0X0VudGl0eSwgUEFDS0VUX1RZUEUgfSBmcm9tIFwiLi4vcGFja2V0L3BhY2tldHNcIjtcclxuaW1wb3J0IHsgUmVuZGVyIH0gZnJvbSBcIi4uL3JlbmRlci9yZW5kZXJcIjtcclxuaW1wb3J0IHsgV29ybGRTeW5jIH0gZnJvbSBcIi4uL3dvcmxkL3dvcmxkU3luY1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE5ldHdvcmsge1xyXG4gICAgcHVibGljIHNlbmRQYWNrZXRJbnRlcnZhbE1zOiBudW1iZXIgPSA4MDtcclxuXHJcbiAgICBwcml2YXRlIF9nYW1lOiBHYW1lQ2xpZW50O1xyXG4gICAgcHJpdmF0ZSBfc29ja2V0OiBTb2NrZXQ7XHJcbiAgICBwcml2YXRlIF9zZW5kUGFja2V0VGltZTogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGFkZHJlc3MoKSB7XHJcbiAgICAgICAgaWYobG9jYXRpb24uaG9zdC5pbmNsdWRlcygnbG9jYWxob3N0JykpIHJldHVybiBgJHtsb2NhdGlvbi5wcm90b2NvbH0vLyR7bG9jYXRpb24uaG9zdH0vYDtcclxuICAgICAgICByZXR1cm4gYGh0dHBzOi8vZG1kYXNzYy1nYW1lLmdsaXRjaC5tZS9gO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0KCkge1xyXG4gICAgICAgIHRoaXMuX3NvY2tldCA9IGlvKHRoaXMuYWRkcmVzcywge1xyXG4gICAgICAgICAgICAvL3BhdGg6ICcvc29ja2V0JyxcclxuICAgICAgICAgICAgYXV0b0Nvbm5lY3Q6IGZhbHNlLFxyXG4gICAgICAgICAgICByZWNvbm5lY3Rpb246IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX3NvY2tldC5vbigncCcsIChwYWNrZXQ6IElQYWNrZXQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5vblJlY2VpdmVQYWNrZXQocGFja2V0KTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhgW25ldHdvcmtdIEFkZHJlc3M6ICgke3RoaXMuYWRkcmVzc30pYClcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29ubmVjdCgpIHtcclxuICAgICAgICB0aGlzLl9zb2NrZXQuY29ubmVjdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3NlbmRQYWNrZXRUaW1lICs9IGR0O1xyXG5cclxuICAgICAgICBpZih0aGlzLl9zZW5kUGFja2V0VGltZSA+PSB0aGlzLnNlbmRQYWNrZXRJbnRlcnZhbE1zIC8gMTAwMCkge1xyXG4gICAgICAgICAgICB0aGlzLl9zZW5kUGFja2V0VGltZSA9IDA7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwbGF5ZXIgPSBSZW5kZXIucGxheWVyO1xyXG5cclxuICAgICAgICAgICAgaWYoIXBsYXllcikgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcGFja2V0ID0gTmV0d29yay5zZXJpYWxpemVFbnRpdHkocGxheWVyKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2VuZChQQUNLRVRfVFlQRS5FTlRJVFlfREFUQSwgcGFja2V0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZW5kKHBhY2tldElkOiBudW1iZXIsIGRhdGE6IGFueSkge1xyXG4gICAgICAgIGNvbnN0IHBhY2tldDogSVBhY2tldCA9IHtcclxuICAgICAgICAgICAgaWQ6IHBhY2tldElkLFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3NvY2tldC5lbWl0KCdwJywgcGFja2V0KTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coYFtuZXR3b3JrXSBzZW5kYCwgcGFja2V0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25SZWNlaXZlUGFja2V0KHBhY2tldDogSVBhY2tldCkge1xyXG4gICAgICAgIGlmKHBhY2tldC5pZCA9PSBQQUNLRVRfVFlQRS5FTlRJVFlfREFUQSkge1xyXG4gICAgICAgICAgICBXb3JsZFN5bmMucHJvY2Vzc0VudGl0eVBhY2tldERhdGEocGFja2V0LmRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYocGFja2V0LmlkID09IFBBQ0tFVF9UWVBFLkNPTlRST0xfRU5USVRZKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBwYWNrZXQuZGF0YSBhcyBJUGFja2V0X0NvbnRyb2xFbnRpdHk7XHJcbiAgICAgICAgICAgIFdvcmxkU3luYy5lbnRpdHlJZCA9IGRhdGEuaWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgc2VyaWFsaXplRW50aXR5KGVudGl0eTogRW50aXR5KSB7XHJcbiAgICAgICAgY29uc3QgY29tcG9uZW50c0RhdGE6IHtbY29tcG9uZW50OiBzdHJpbmddOiBJUGFja2V0X0NvbXBvbmVudH0gPSB7fTtcclxuXHJcbiAgICAgICAgY29uc3QgZW50aXR5RmFjdG9yeSA9IGVudGl0eS53b3JsZC5zZXJ2ZXIuZW50aXR5RmFjdG9yeTtcclxuXHJcbiAgICAgICAgY29uc3QgcGFja2V0OiBJUGFja2V0X0VudGl0eSA9IHtcclxuICAgICAgICAgICAgaWQ6IGVudGl0eS5pZCxcclxuICAgICAgICAgICAgdHlwZTogZW50aXR5RmFjdG9yeS5nZXRJbmRleE9mRW50aXR5KGVudGl0eSksXHJcbiAgICAgICAgICAgIGNkYXRhOiBjb21wb25lbnRzRGF0YVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgZW50aXR5LmNvbXBvbmVudHMpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2VyaWFsaXplZERhdGEgPSBjb21wb25lbnQuc2VyaWFsaXplKCk7XHJcbiAgICAgICAgICAgIGlmKCFzZXJpYWxpemVkRGF0YSkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpZCA9IGVudGl0eUZhY3RvcnkuZ2V0SW5kZXhPZkNvbXBvbmVudChjb21wb25lbnQpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29tcG9uZW50c0RhdGFbaWRdID0gc2VyaWFsaXplZERhdGE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcGFja2V0O1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGVudW0gUEFDS0VUX1RZUEUge1xyXG4gICAgRU5USVRZX0RBVEEsXHJcbiAgICBDT05UUk9MX0VOVElUWVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQYWNrZXQge1xyXG4gICAgaWQ6IG51bWJlclxyXG4gICAgZGF0YTogYW55XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhY2tldF9Db21wb25lbnQge1xyXG4gICAgdHlwZTogbnVtYmVyXHJcbiAgICBkYXRhOiBhbnlcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUGFja2V0X0NvbnRyb2xFbnRpdHkge1xyXG4gICAgaWQ6IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQYWNrZXRfRW50aXR5IHtcclxuICAgIGlkOiBzdHJpbmdcclxuICAgIHR5cGU6IG51bWJlclxyXG4gICAgY2RhdGE6IHtbY29tcG9uZW50OiBzdHJpbmddOiBJUGFja2V0X0NvbXBvbmVudH1cclxufSIsImltcG9ydCAqIGFzIHBjIGZyb20gJ3BsYXljYW52YXMnXHJcbmltcG9ydCB7IEdhbWVDbGllbnQgfSBmcm9tICcuLi9nYW1lL2dhbWVDbGllbnQnO1xyXG5pbXBvcnQgeyBXb3JsZCB9IGZyb20gJy4uL3dvcmxkL3dvcmxkJztcclxuXHJcbmV4cG9ydCBjbGFzcyBQbGF5Q2FudmFzIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgY2FtZXJhOiBwYy5FbnRpdHk7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzZXR1cEFwcChjYW52YXMpIHtcclxuICAgICAgICBjb25zdCBhcHAgPSBuZXcgcGMuQXBwbGljYXRpb24oY2FudmFzLCB7XHJcbiAgICAgICAgICAgIG1vdXNlOiBuZXcgcGMuTW91c2UoY2FudmFzKSxcclxuICAgICAgICAgICAgdG91Y2g6IG5ldyBwYy5Ub3VjaERldmljZShjYW52YXMpLFxyXG4gICAgICAgICAgICBrZXlib2FyZDogbmV3IHBjLktleWJvYXJkKGRvY3VtZW50LmJvZHkpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFwcC5yZXNpemVDYW52YXMoODAwLCA2MDApO1xyXG4gXHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgY29uc3QgT2JqTW9kZWxQYXJzZXIgPSByZXF1aXJlKCcuL29iak1vZGVsUGFyc2VyLmpzJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IG06IGFueSA9IGFwcC5sb2FkZXIuZ2V0SGFuZGxlcihcIm1vZGVsXCIpO1xyXG4gICAgICAgIG0uYWRkUGFyc2VyKG5ldyBPYmpNb2RlbFBhcnNlcihhcHAuZ3JhcGhpY3NEZXZpY2UpLCBmdW5jdGlvbiAodXJsLCBkYXRhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAocGMucGF0aC5nZXRFeHRlbnNpb24odXJsKSA9PT0gJy5vYmonKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAqL1xyXG5cclxuXHJcblxyXG4gICAgICAgIC8vYXBwLnNldENhbnZhc0ZpbGxNb2RlKHBjLkZJTExNT0RFX0ZJTExfV0lORE9XKTtcclxuICAgICAgICAvL2FwcC5zZXRDYW52YXNSZXNvbHV0aW9uKHBjLlJFU09MVVRJT05fQVVUTyk7XHJcblxyXG4gICAgICAgIHJldHVybiBhcHA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzZXR1cExvY2FsQ2xpZW50U2NlbmUoYXBwOiBwYy5BcHBsaWNhdGlvbikge1xyXG5cclxuICAgICAgICBjb25zdCBjYW1lcmEgPSB0aGlzLmNhbWVyYSA9IG5ldyBwYy5FbnRpdHkoJ2NhbWVyYScpO1xyXG4gICAgICAgIGNhbWVyYS5hZGRDb21wb25lbnQoJ2NhbWVyYScsIHtcclxuICAgICAgICAgICAgY2xlYXJDb2xvcjogbmV3IHBjLkNvbG9yKDAuMSwgMC4xLCAwLjEpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYXBwLnJvb3QuYWRkQ2hpbGQoY2FtZXJhKTtcclxuICAgICAgICBjYW1lcmEuc2V0UG9zaXRpb24oMCwgNTAsIDApO1xyXG4gICAgICAgIC8vY2FtZXJhLmxvb2tBdCgwLCAwLCAwKTtcclxuICAgICAgICBjYW1lcmEuc2V0RXVsZXJBbmdsZXMoLTkwLCAwLCAwKTtcclxuICAgICAgICAoY2FtZXJhLmFkZENvbXBvbmVudCgnc2NyaXB0JykgYXMgcGMuU2NyaXB0Q29tcG9uZW50KS5jcmVhdGUoJ2NhbWVyYUZvbGxvdycpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGxpZ2h0ID0gbmV3IHBjLkVudGl0eSgnbGlnaHQnKTtcclxuICAgICAgICBsaWdodC5hZGRDb21wb25lbnQoJ2xpZ2h0Jyk7XHJcbiAgICAgICAgYXBwLnJvb3QuYWRkQ2hpbGQobGlnaHQpO1xyXG4gICAgICAgIGxpZ2h0LnNldEV1bGVyQW5nbGVzKDMwLCAwLCAwKTtcclxuXHJcbiAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlbmRlcldvcmxkKHdvcmxkOiBXb3JsZCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGdhbWUgPSB3b3JsZC5zZXJ2ZXIuZ2FtZSBhcyBHYW1lQ2xpZW50O1xyXG4gICAgICAgIGNvbnN0IGFwcCA9IGdhbWUuYXBwO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiB3b3JsZC5lbnRpdGllcykge1xyXG4gICAgICAgICAgICBlbnRpdHkucmVuZGVyKCk7XHJcblxyXG4gICAgICAgICAgICBpZihlbnRpdHkucGNFbnRpdHkpIHtcclxuICAgICAgICAgICAgICAgIGlmKCFhcHAucm9vdC5jaGlsZHJlbi5pbmNsdWRlcyhlbnRpdHkucGNFbnRpdHkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXBwLnJvb3QuYWRkQ2hpbGQoZW50aXR5LnBjRW50aXR5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgKi9cclxuXHJcblxyXG59IiwiaW1wb3J0ICogYXMgcGMgZnJvbSAncGxheWNhbnZhcyc7XHJcbmltcG9ydCB7IElucHV0SGFuZGxlckNvbXBvbmVudCB9IGZyb20gXCIuLi9jb21wb25lbnQvaW5wdXRIYW5kbGVyQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7IFBvc2l0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50L3Bvc2l0aW9uQ29tcG9uZW50JztcclxuaW1wb3J0IHsgRW50aXR5IH0gZnJvbSBcIi4uL2VudGl0eS9lbnRpdHlcIjtcclxuaW1wb3J0IHsgR2FtZUNsaWVudCB9IGZyb20gJy4uL2dhbWUvZ2FtZUNsaWVudCc7XHJcbmltcG9ydCB7IFBsYXlDYW52YXMgfSBmcm9tIFwiLi4vcGxheWNhbnZhcy9wbGF5Y2FudmFzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUmVuZGVyIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2FtZTogR2FtZUNsaWVudDtcclxuICAgIHB1YmxpYyBzdGF0aWMgYXBwOiBwYy5BcHBsaWNhdGlvbjtcclxuICAgIHB1YmxpYyBzdGF0aWMgcGxheWVyOiBFbnRpdHk7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IGFwcDogcGMuQXBwbGljYXRpb247XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBpbml0KGdhbWU6IEdhbWVDbGllbnQsIGNhbnZhcykge1xyXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcblxyXG4gICAgICAgIHRoaXMuYXBwID0gUGxheUNhbnZhcy5zZXR1cEFwcChjYW52YXMpO1xyXG4gICAgICAgIHRoaXMuYXBwLnN0YXJ0KCk7XHJcblxyXG4gICAgICAgIFBsYXlDYW52YXMuc2V0dXBMb2NhbENsaWVudFNjZW5lKHRoaXMuYXBwKTtcclxuXHJcbiAgICAgICAgd2luZG93W1wiUmVuZGVyXCJdID0gUmVuZGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCB3b3JsZCA9IHRoaXMuZ2FtZS5tYWluU2VydmVyLndvcmxkc1swXTtcclxuICAgICAgICBjb25zdCBhcHAgPSB0aGlzLmFwcDtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBlbnRpdHkgb2Ygd29ybGQuZW50aXRpZXMpIHtcclxuICAgICAgICAgICAgLy9lbnRpdHkucmVuZGVyKCk7XHJcblxyXG4gICAgICAgICAgICBpZighZW50aXR5LnBjRW50aXR5LnBhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgaWYoIWFwcC5yb290LmNoaWxkcmVuLmluY2x1ZGVzKGVudGl0eS5wY0VudGl0eSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBhcHAucm9vdC5hZGRDaGlsZChlbnRpdHkucGNFbnRpdHkpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgcGMuU3RhbmRhcmRNYXRlcmlhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsLmRpZmZ1c2UgPSBuZXcgcGMuQ29sb3IoMCwgMSwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwudXBkYXRlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNlbnRlclBjRW50aXR5ID0gbmV3IHBjLkVudGl0eSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNlbnRlclBjRW50aXR5LmFkZENvbXBvbmVudChcInJlbmRlclwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsOiBtYXRlcmlhbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJib3hcIixcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBjZW50ZXJQY0VudGl0eS5zZXRMb2NhbFNjYWxlKG5ldyBwYy5WZWMzKDAuMiwgMC4yLCAwLjIpKTtcclxuICAgICAgICAgICAgICAgICAgICBlbnRpdHkucGNFbnRpdHkuYWRkQ2hpbGQoY2VudGVyUGNFbnRpdHkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwY0VudGl0eSA9IGVudGl0eS5wY0VudGl0eTtcclxuICAgICAgICAgICAgY29uc3QgcG9zaXRpb25Db21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFBvc2l0aW9uQ29tcG9uZW50KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHBjRW50aXR5LnNldFBvc2l0aW9uKHBvc2l0aW9uQ29tcG9uZW50LnggLyAxMCwgMCwgcG9zaXRpb25Db21wb25lbnQueSAvIDEwKTtcclxuICAgICAgICAgICAgcGNFbnRpdHkuc2V0RXVsZXJBbmdsZXMoMCwgcGMubWF0aC5SQURfVE9fREVHICogLXBvc2l0aW9uQ29tcG9uZW50LmFuZ2xlLCAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzZXRQbGF5ZXIoZW50aXR5OiBFbnRpdHkpIHtcclxuICAgICAgICB0aGlzLnBsYXllciA9IGVudGl0eTtcclxuICAgICAgICB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoSW5wdXRIYW5kbGVyQ29tcG9uZW50KS5lbmFibGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWRBc3NldCh1cmw6IHN0cmluZywgY2FsbGJhY2s6IChhc3NldDogcGMuQXNzZXQpID0+IHZvaWQpIHtcclxuICAgICAgICBjb25zdCBpbWFnZVVybCA9IHVybDtcclxuICAgICAgICBjb25zdCBhcHAgPSBSZW5kZXIuYXBwO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGFwcC5sb2FkZXIuZ2V0SGFuZGxlcihcInRleHR1cmVcIilbJ2Nyb3NzT3JpZ2luJ10gPSBcImFub255bW91c1wiO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGFzc2V0ID0gbmV3IHBjLkFzc2V0KFwibXlUZXh0dXJlXCIsIFwidGV4dHVyZVwiLCB7dXJsOiBpbWFnZVVybH0pO1xyXG5cclxuICAgICAgICBhc3NldC5vbihcImVycm9yXCIsIGZ1bmN0aW9uIChtZXNzYWdlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhc3NldC5vbihcImxvYWRcIiwgZnVuY3Rpb24gKGFzc2V0KSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGFzc2V0KTsgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFwcC5hc3NldHMuYWRkKGFzc2V0KTtcclxuICAgICAgICBhcHAuYXNzZXRzLmxvYWQoYXNzZXQpO1xyXG4gICAgICAgIHJldHVybiBhc3NldDtcclxuICAgIH1cclxufSIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuLi9jb21wb25lbnQvY29tcG9uZW50XCI7XHJcbmltcG9ydCB7IEVudGl0eSB9IGZyb20gXCIuLi9lbnRpdHkvZW50aXR5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRW50aXR5RmFjdG9yeSB7XHJcbiAgICBwcml2YXRlIF9hbGxDb21wb25lbnRzID0gbmV3IE1hcDxzdHJpbmcsIHsgbmV3KC4uLmFyZ3M6IGFueVtdKTogQ29tcG9uZW50IH0+KCk7XHJcbiAgICBwcml2YXRlIF9hbGxFbnRpdGllcyA9IG5ldyBNYXA8c3RyaW5nLCB7IG5ldyguLi5hcmdzOiBhbnlbXSk6IEVudGl0eSB9PigpO1xyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlckVudGl0eTxUIGV4dGVuZHMgRW50aXR5PihuYW1lOiBzdHJpbmcsIGNvbnN0cjogeyBuZXcoLi4uYXJnczogYW55W10pOiBUIH0pIHtcclxuICAgICAgICB0aGlzLl9hbGxFbnRpdGllcy5zZXQobmFtZSwgY29uc3RyKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJDb21wb25lbnQ8VCBleHRlbmRzIENvbXBvbmVudD4obmFtZTogc3RyaW5nLCBjb25zdHI6IHsgbmV3KC4uLmFyZ3M6IGFueVtdKTogVCB9KSB7XHJcbiAgICAgICAgdGhpcy5fYWxsQ29tcG9uZW50cy5zZXQobmFtZSwgY29uc3RyKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0SW5kZXhPZkNvbXBvbmVudDxUIGV4dGVuZHMgQ29tcG9uZW50PihjOiBUKSB7XHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIGZvciAoY29uc3QgY29uc3RyIG9mIHRoaXMuX2FsbENvbXBvbmVudHMudmFsdWVzKCkpIHtcclxuICAgICAgICAgICAgaWYoYyBpbnN0YW5jZW9mIGNvbnN0cikgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgXCJDb21wb25lbnQgXCIgKyBjLmNvbnN0cnVjdG9yLm5hbWUgKyBcIiBub3QgZm91bmRcIjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RW50aXR5QnlJbmRleChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5fYWxsRW50aXRpZXMudmFsdWVzKCkpW2luZGV4XTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0SW5kZXhPZkVudGl0eTxUIGV4dGVuZHMgRW50aXR5PihjOiBUKSB7XHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIGZvciAoY29uc3QgY29uc3RyIG9mIHRoaXMuX2FsbEVudGl0aWVzLnZhbHVlcygpKSB7XHJcbiAgICAgICAgICAgIGlmKGMgaW5zdGFuY2VvZiBjb25zdHIpIHJldHVybiBpO1xyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRocm93IFwiRW50aXR5IFwiICsgYy5jb25zdHJ1Y3Rvci5uYW1lICsgXCIgbm90IGZvdW5kXCI7XHJcbiAgICB9XHJcbn0iLCJcclxuaW1wb3J0IHsgQ2xpZW50IH0gZnJvbSBcIi4uL2NsaWVudC9jbGllbnRcIjtcclxuaW1wb3J0IHsgQ29sbGlzaW9uQ29tcG9uZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudC9jb2xsaXNpb25Db21wb25lbnRcIjtcclxuaW1wb3J0IHsgSW5wdXRIYW5kbGVyQ29tcG9uZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudC9pbnB1dEhhbmRsZXJDb21wb25lbnRcIjtcclxuaW1wb3J0IHsgT2JqZWN0U3ByaXRlQ29tcG9uZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudC9vYmplY3RTcHJpdGVDb21wb25lbnRcIjtcclxuaW1wb3J0IHsgUG9zaXRpb25Db21wb25lbnQgfSBmcm9tIFwiLi4vY29tcG9uZW50L3Bvc2l0aW9uQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7IFRlc3RBbmltU3ByaXRlQ29tcG9uZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudC90ZXN0QW5pbVNwcml0ZVwiO1xyXG5pbXBvcnQgeyBWZWhpY2xlQ29tcG9uZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudC92ZWhpY2xlQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7IFZlaGljbGVTcHJpdGVDb21wb25lbnQgfSBmcm9tIFwiLi4vY29tcG9uZW50L3ZlaGljbGVTcHJpdGVDb21wb25lbnRcIjtcclxuaW1wb3J0IHsgRW50aXR5T2JqZWN0IH0gZnJvbSBcIi4uL2VudGl0eS9lbnRpdHlPYmplY3RcIjtcclxuaW1wb3J0IHsgRW50aXR5UGxheWVyIH0gZnJvbSBcIi4uL2VudGl0eS9lbnRpdHlQbGF5ZXJcIjtcclxuaW1wb3J0IHsgRW50aXR5VmVoaWNsZSB9IGZyb20gXCIuLi9lbnRpdHkvZW50aXR5VmVoaWNsZVwiO1xyXG5pbXBvcnQgeyBHYW1lIH0gZnJvbSBcIi4uL2dhbWUvZ2FtZVwiO1xyXG5pbXBvcnQgeyBXb3JsZCB9IGZyb20gXCIuLi93b3JsZC93b3JsZFwiO1xyXG5pbXBvcnQgeyBFbnRpdHlGYWN0b3J5IH0gZnJvbSBcIi4vZW50aXR5RmFjdG9yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNlcnZlciB7XHJcbiAgICBwdWJsaWMgaWQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgZ2V0IGdhbWUoKSB7IHJldHVybiB0aGlzLl9nYW1lOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHdvcmxkcygpIHsgcmV0dXJuIEFycmF5LmZyb20odGhpcy5fd29ybGRzLnZhbHVlcygpKTsgfVxyXG4gICAgcHVibGljIGdldCBlbnRpdHlGYWN0b3J5KCkgeyByZXR1cm4gdGhpcy5fZW50aXR5RmFjdG9yeTsgfVxyXG5cclxuICAgIHByaXZhdGUgX2dhbWU6IEdhbWU7XHJcbiAgICBwcml2YXRlIF93b3JsZHMgPSBuZXcgTWFwPHN0cmluZywgV29ybGQ+KCk7XHJcbiAgICBwcml2YXRlIF9lbnRpdHlGYWN0b3J5OiBFbnRpdHlGYWN0b3J5O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGdhbWU6IEdhbWUpIHtcclxuICAgICAgICB0aGlzLl9nYW1lID0gZ2FtZTtcclxuICAgICAgICB0aGlzLl9lbnRpdHlGYWN0b3J5ID0gbmV3IEVudGl0eUZhY3RvcnkoKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyRW50aXRpZXNBbmRDb21wb25lbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWdpc3RlckVudGl0aWVzQW5kQ29tcG9uZW50cygpIHtcclxuICAgICAgICBjb25zdCBlbnRpdHlGYWN0b3J5ID0gdGhpcy5fZW50aXR5RmFjdG9yeTtcclxuXHJcbiAgICAgICAgZW50aXR5RmFjdG9yeS5yZWdpc3RlckVudGl0eShcIkVudGl0eVBsYXllclwiLCBFbnRpdHlQbGF5ZXIpO1xyXG4gICAgICAgIGVudGl0eUZhY3RvcnkucmVnaXN0ZXJFbnRpdHkoXCJFbnRpdHlPYmplY3RcIiwgRW50aXR5T2JqZWN0KTtcclxuICAgICAgICBlbnRpdHlGYWN0b3J5LnJlZ2lzdGVyRW50aXR5KFwiRW50aXR5VmVoaWNsZVwiLCBFbnRpdHlWZWhpY2xlKTtcclxuXHJcbiAgICAgICAgZW50aXR5RmFjdG9yeS5yZWdpc3RlckNvbXBvbmVudChcIlBvc2l0aW9uQ29tcG9uZW50XCIsIFBvc2l0aW9uQ29tcG9uZW50KTtcclxuICAgICAgICBlbnRpdHlGYWN0b3J5LnJlZ2lzdGVyQ29tcG9uZW50KFwiQ29sbGlzaW9uQ29tcG9uZW50XCIsIENvbGxpc2lvbkNvbXBvbmVudCk7XHJcbiAgICAgICAgZW50aXR5RmFjdG9yeS5yZWdpc3RlckNvbXBvbmVudChcIklucHV0SGFuZGxlckNvbXBvbmVudFwiLCBJbnB1dEhhbmRsZXJDb21wb25lbnQpO1xyXG4gICAgICAgIGVudGl0eUZhY3RvcnkucmVnaXN0ZXJDb21wb25lbnQoXCJPYmplY3RTcHJpdGVDb21wb25lbnRcIiwgT2JqZWN0U3ByaXRlQ29tcG9uZW50KTtcclxuICAgICAgICBlbnRpdHlGYWN0b3J5LnJlZ2lzdGVyQ29tcG9uZW50KFwiVGVzdEFuaW1TcHJpdGVDb21wb25lbnRcIiwgVGVzdEFuaW1TcHJpdGVDb21wb25lbnQpO1xyXG4gICAgICAgIGVudGl0eUZhY3RvcnkucmVnaXN0ZXJDb21wb25lbnQoXCJWZWhpY2xlQ29tcG9uZW50XCIsIFZlaGljbGVDb21wb25lbnQpO1xyXG4gICAgICAgIGVudGl0eUZhY3RvcnkucmVnaXN0ZXJDb21wb25lbnQoXCJWZWhpY2xlU3ByaXRlQ29tcG9uZW50XCIsIFZlaGljbGVTcHJpdGVDb21wb25lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbc2VydmVyXSBpbml0YCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlV29ybGQoJ3dvcmxkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy53b3JsZHMubWFwKHdvcmxkID0+IHdvcmxkLnVwZGF0ZShkdCkpO1xyXG4gICAgICAgIHRoaXMud29ybGRzLm1hcCh3b3JsZCA9PiB3b3JsZC5wb3N0dXBkYXRlKGR0KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZVdvcmxkKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBbc2VydmVyXSBjcmVhdGUgd29ybGQgJyR7bmFtZX0nYCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHdvcmxkID0gbmV3IFdvcmxkKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX3dvcmxkcy5zZXQobmFtZSwgd29ybGQpO1xyXG4gICAgICAgIHdvcmxkLmluaXQoKTtcclxuICAgIH1cclxufSIsImltcG9ydCBNYXR0ZXIgZnJvbSBcIm1hdHRlci1qc1wiO1xyXG5pbXBvcnQgeyBJbnB1dEhhbmRsZXJDb21wb25lbnQgfSBmcm9tIFwiLi4vY29tcG9uZW50L2lucHV0SGFuZGxlckNvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwiLi4vZW50aXR5L2VudGl0eVwiO1xyXG5pbXBvcnQgeyBFbnRpdHlCdWlsZGluZyB9IGZyb20gXCIuLi9lbnRpdHkvZW50aXR5QnVpbGRpbmdcIjtcclxuaW1wb3J0IHsgRW50aXR5T2JqZWN0IH0gZnJvbSBcIi4uL2VudGl0eS9lbnRpdHlPYmplY3RcIjtcclxuaW1wb3J0IHsgRW50aXR5UGxheWVyIH0gZnJvbSBcIi4uL2VudGl0eS9lbnRpdHlQbGF5ZXJcIjtcclxuaW1wb3J0IHsgRW50aXR5VmVoaWNsZSB9IGZyb20gXCIuLi9lbnRpdHkvZW50aXR5VmVoaWNsZVwiO1xyXG5pbXBvcnQgeyBTZXJ2ZXIgfSBmcm9tIFwiLi4vc2VydmVyL3NlcnZlclwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJV29ybGRTcGF3bk9wdGlvbnMge1xyXG4gICAgaWQ/OiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdvcmxkIHtcclxuICAgIHByaXZhdGUgX3NlcnZlcjogU2VydmVyO1xyXG4gICAgcHJpdmF0ZSBfZW50aXRpZXMgPSBuZXcgTWFwPHN0cmluZywgRW50aXR5PigpO1xyXG4gICAgcHJpdmF0ZSBfZW5naW5lOiBNYXR0ZXIuRW5naW5lO1xyXG4gICAgcHJpdmF0ZSBfbWF0dGVyV29ybGQ6IE1hdHRlci5Xb3JsZDtcclxuICAgIHByaXZhdGUgX3J1bm5lcjogTWF0dGVyLlJ1bm5lcjtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNlcnZlcigpIHsgcmV0dXJuIHRoaXMuX3NlcnZlciB9O1xyXG4gICAgcHVibGljIGdldCBlbnRpdGllcygpIHsgcmV0dXJuIEFycmF5LmZyb20odGhpcy5fZW50aXRpZXMudmFsdWVzKCkpIH07XHJcbiAgICBwdWJsaWMgZ2V0IGVuZ2luZSgpIHsgcmV0dXJuIHRoaXMuX2VuZ2luZSB9O1xyXG4gICAgcHVibGljIGdldCBtYXR0ZXJXb3JsZCgpIHsgcmV0dXJuIHRoaXMuX21hdHRlcldvcmxkIH07XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2VydmVyOiBTZXJ2ZXIpIHtcclxuICAgICAgICB0aGlzLl9zZXJ2ZXIgPSBzZXJ2ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluaXQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFt3b3JsZF0gaW5pdGApO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRNYXR0ZXIoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmdlbmVyYXRlQnVsZGluZ3MoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2VuZXJhdGVCYXNlV29ybGQoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5zcGF3blBsYXllcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnNwYXduT2JqZWN0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnNwYXduVmVoaWNsZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZUJ1bGRpbmdzKCkge1xyXG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgNDsgeSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgNDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiID0gdGhpcy5zcGF3bkJ1aWxkaW5nKCk7XHJcblxyXG4gICAgICAgICAgICBiLnBvc2l0aW9uLnNldChcclxuICAgICAgICAgICAgICAgICh4LTIpICogMTAgKiA2LFxyXG4gICAgICAgICAgICAgICAgKHktMikgKiAxMCAqIDYsXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgaW5pdE1hdHRlcigpIHtcclxuICAgICAgICBjb25zdCBlbmdpbmUgPSB0aGlzLl9lbmdpbmUgPSBNYXR0ZXIuRW5naW5lLmNyZWF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IHdvcmxkID0gdGhpcy5fbWF0dGVyV29ybGQgPSBlbmdpbmUud29ybGQ7XHJcbiAgICAgICAgY29uc3QgcnVubmVyID0gdGhpcy5fcnVubmVyID0gTWF0dGVyLlJ1bm5lci5jcmVhdGUoKTtcclxuICAgICAgICBcclxuICAgICAgICBlbmdpbmUuZ3Jhdml0eS54ID0gMDtcclxuICAgICAgICBlbmdpbmUuZ3Jhdml0eS55ID0gMDtcclxuXHJcbiAgICAgICAgTWF0dGVyLlJ1bm5lci5ydW4ocnVubmVyLCBlbmdpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzcGF3blBsYXllcigpIHtcclxuICAgICAgICBjb25zdCBlbnRpdHkgPSBuZXcgRW50aXR5UGxheWVyKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuYWRkRW50aXR5KGVudGl0eSk7XHJcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3Bhd25PYmplY3QoKSB7XHJcbiAgICAgICAgY29uc3QgZW50aXR5ID0gbmV3IEVudGl0eU9iamVjdCh0aGlzKTtcclxuICAgICAgICB0aGlzLmFkZEVudGl0eShlbnRpdHkpO1xyXG4gICAgICAgIHJldHVybiBlbnRpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNwYXduVmVoaWNsZSgpIHtcclxuICAgICAgICBjb25zdCBlbnRpdHkgPSBuZXcgRW50aXR5VmVoaWNsZSh0aGlzKTtcclxuICAgICAgICB0aGlzLmFkZEVudGl0eShlbnRpdHkpO1xyXG4gICAgICAgIHJldHVybiBlbnRpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNwYXduQnVpbGRpbmcoKSB7XHJcbiAgICAgICAgY29uc3QgZW50aXR5ID0gbmV3IEVudGl0eUJ1aWxkaW5nKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuYWRkRW50aXR5KGVudGl0eSk7XHJcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlKGR0OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmVudGl0aWVzLm1hcChlbnRpdHkgPT4gZW50aXR5LnVwZGF0ZShkdCkpXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBvc3R1cGRhdGUoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuZW50aXRpZXMubWFwKGVudGl0eSA9PiBlbnRpdHkucG9zdHVwZGF0ZShkdCkpXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEVudGl0eShpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VudGl0aWVzLmdldChpZCkhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoYXNFbnRpdHkoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbnRpdGllcy5oYXMoaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRFbnRpdHkoZW50aXR5OiBFbnRpdHkpIHtcclxuICAgICAgICB0aGlzLl9lbnRpdGllcy5zZXQoZW50aXR5LmlkLCBlbnRpdHkpO1xyXG4gICAgICAgIGVudGl0eS5pbml0KCk7XHJcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEVudGl0eVBsYXllciB9IGZyb20gXCIuLi9lbnRpdHkvZW50aXR5UGxheWVyXCI7XHJcbmltcG9ydCB7IElQYWNrZXRfRW50aXR5IH0gZnJvbSBcIi4uL3BhY2tldC9wYWNrZXRzXCI7XHJcbmltcG9ydCB7IFJlbmRlciB9IGZyb20gXCIuLi9yZW5kZXIvcmVuZGVyXCI7XHJcbmltcG9ydCB7IFdvcmxkIH0gZnJvbSBcIi4vd29ybGRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JsZFN5bmMge1xyXG4gICAgcHVibGljIHN0YXRpYyBlbnRpdHlJZDogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBzdGF0aWMgd29ybGQ6IFdvcmxkO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcHJvY2Vzc0VudGl0eVBhY2tldERhdGEoZGF0YTogSVBhY2tldF9FbnRpdHkpIHtcclxuICAgICAgICBjb25zdCB3b3JsZCA9IHRoaXMud29ybGQ7XHJcblxyXG4gICAgICAgIGlmKCF3b3JsZC5oYXNFbnRpdHkoZGF0YS5pZCkpIHtcclxuICAgICAgICAgICAgY29uc3QgY29uc3RyID0gd29ybGQuc2VydmVyLmVudGl0eUZhY3RvcnkuZ2V0RW50aXR5QnlJbmRleChkYXRhLnR5cGUpO1xyXG4gICAgICAgICAgICBjb25zdCBlbnRpdHkgPSAgbmV3IGNvbnN0cih3b3JsZCk7XHJcbiAgICAgICAgICAgIGVudGl0eS5zZXRJZChkYXRhLmlkKTtcclxuICAgICAgICAgICAgd29ybGQuYWRkRW50aXR5KGVudGl0eSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBlbnRpdHkgPSB3b3JsZC5nZXRFbnRpdHkoZGF0YS5pZCk7XHJcblxyXG4gICAgICAgIGlmKGVudGl0eSA9PSBSZW5kZXIucGxheWVyKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmKHRoaXMuZW50aXR5SWQgPT0gZW50aXR5LmlkKSB7XHJcbiAgICAgICAgICAgIFJlbmRlci5zZXRQbGF5ZXIoZW50aXR5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIGVudGl0eS5jb21wb25lbnRzKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaW5kZXggPSB3b3JsZC5zZXJ2ZXIuZW50aXR5RmFjdG9yeS5nZXRJbmRleE9mQ29tcG9uZW50KGNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgICAgICBpZihkYXRhLmNkYXRhW2NpbmRleF0pIGNvbXBvbmVudC51bnNlcmlhbGl6ZShkYXRhLmNkYXRhW2NpbmRleF0pXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YS5jZGF0YSlcclxuICAgIH1cclxufSIsImNvbnN0IHBjID0gcmVxdWlyZShcInBsYXljYW52YXNcIik7XHJcblxyXG4oZnVuY3Rpb24oKXtcclxuICAgIHZhciB1dGlscyA9IHt9O1xyXG4gICAgdmFyIGFwcCA9IHBjLkFwcGxpY2F0aW9uLmdldEFwcGxpY2F0aW9uKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmFtZSB1dGlscyNsb2FkR2xiQ29udGFpbmVyRnJvbUFzc2V0XHJcbiAgICAgKiBAZnVuY3Rpb25cclxuICAgICAqIEBkZXNjcmlwdGlvbiBMb2FkIGEgR0xCIGNvbnRhaW5lciBmcm9tIGEgYmluYXJ5IGFzc2V0IHRoYXQgaXMgYSBHTEIuXHJcbiAgICAgKiBAcGFyYW0ge3BjLkFzc2V0fSBnbGJCaW5Bc3NldCBUaGUgYmluYXJ5IGFzc2V0IHRoYXQgaXMgdGhlIEdMQi5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIE9wdGlvbmFsLiBFeHRyYSBvcHRpb25zIHRvIGRvIGV4dHJhIHByb2Nlc3Npbmcgb24gdGhlIEdMQi5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhc3NldE5hbWUuIE5hbWUgb2YgdGhlIGFzc2V0LlxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGZvciBsb2FkaW5nIHRoZSBhc3NldC4gU2lnbmF0dXJlIGlzIGBmdW5jdGlvbihzdHJpbmc6ZXJyb3IsIGFzc2V0OmNvbnRhaW5lckFzc2V0KWAuXHJcbiAgICAgKiBJZiBgZXJyb3JgIGlzIG51bGwsIHRoZW4gdGhlIGxvYWQgaXMgc3VjY2Vzc2Z1bC5cclxuICAgICAqIEByZXR1cm5zIHtwYy5Bc3NldH0gVGhlIGFzc2V0IHRoYXQgaXMgY3JlYXRlZCBmb3IgdGhlIGNvbnRhaW5lciByZXNvdXJjZS5cclxuICAgICAqL1xyXG4gICAgdXRpbHMubG9hZEdsYkNvbnRhaW5lckZyb21Bc3NldCA9IGZ1bmN0aW9uIChnbGJCaW5Bc3NldCwgb3B0aW9ucywgYXNzZXROYW1lLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBibG9iID0gbmV3IEJsb2IoW2dsYkJpbkFzc2V0LnJlc291cmNlXSk7XHJcbiAgICAgICAgdmFyIGRhdGEgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxvYWRHbGJDb250YWluZXJGcm9tVXJsKGRhdGEsIG9wdGlvbnMsIGFzc2V0TmFtZSwgZnVuY3Rpb24oZXJyb3IsIGFzc2V0KSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBhc3NldCk7XHJcbiAgICAgICAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwoZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5hbWUgdXRpbHMjbG9hZEdsYkNvbnRhaW5lckZyb21VcmxcclxuICAgICAqIEBmdW5jdGlvblxyXG4gICAgICogQGRlc2NyaXB0aW9uIExvYWQgYSBHTEIgY29udGFpbmVyIGZyb20gYSBVUkwgdGhhdCByZXR1cm5zIGEgYG1vZGVsL2dsdGYtYmluYXJ5YCBhcyBhIEdMQi5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVGhlIFVSTCBmb3IgdGhlIEdMQlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgT3B0aW9uYWwuIEV4dHJhIG9wdGlvbnMgdG8gZG8gZXh0cmEgcHJvY2Vzc2luZyBvbiB0aGUgR0xCLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGFzc2V0TmFtZS4gTmFtZSBvZiB0aGUgYXNzZXQuXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gZm9yIGxvYWRpbmcgdGhlIGFzc2V0LiBTaWduYXR1cmUgaXMgYGZ1bmN0aW9uKHN0cmluZzplcnJvciwgYXNzZXQ6Y29udGFpbmVyQXNzZXQpYC5cclxuICAgICAqIElmIGBlcnJvcmAgaXMgbnVsbCwgdGhlbiB0aGUgbG9hZCBpcyBzdWNjZXNzZnVsLlxyXG4gICAgICogQHJldHVybnMge3BjLkFzc2V0fSBUaGUgYXNzZXQgdGhhdCBpcyBjcmVhdGVkIGZvciB0aGUgY29udGFpbmVyIHJlc291cmNlLlxyXG4gICAgICovXHJcbiAgICB1dGlscy5sb2FkR2xiQ29udGFpbmVyRnJvbVVybCA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMsIGFzc2V0TmFtZSwgY2FsbGJhY2spIHtcclxuICAgICAgICB2YXIgZmlsZW5hbWUgPSBhc3NldE5hbWUgKyAnLmdsYic7XHJcbiAgICAgICAgdmFyIGZpbGUgPSB7XHJcbiAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICBmaWxlbmFtZTogZmlsZW5hbWVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgYXNzZXQgPSBuZXcgcGMuQXNzZXQoZmlsZW5hbWUsICdjb250YWluZXInLCBmaWxlLCBudWxsLCBvcHRpb25zKTtcclxuICAgICAgICBhc3NldC5vbmNlKCdsb2FkJywgZnVuY3Rpb24gKGNvbnRhaW5lckFzc2V0KSB7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgLy8gQXMgd2UgcGxheSBhbmltYXRpb25zIGJ5IG5hbWUsIGlmIHdlIGhhdmUgb25seSBvbmUgYW5pbWF0aW9uLCBrZWVwIGl0IHRoZSBzYW1lIG5hbWUgYXNcclxuICAgICAgICAgICAgICAgIC8vIHRoZSBvcmlnaW5hbCBjb250YWluZXIgb3RoZXJ3aXNlLCBwb3N0Zml4IGl0IHdpdGggYSBudW1iZXJcclxuICAgICAgICAgICAgICAgIHZhciBhbmltYXRpb25zID0gY29udGFpbmVyQXNzZXQucmVzb3VyY2UuYW5pbWF0aW9ucztcclxuICAgICAgICAgICAgICAgIGlmIChhbmltYXRpb25zLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uc1swXS5uYW1lID0gYXNzZXROYW1lO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhbmltYXRpb25zLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFuaW1hdGlvbnMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uc1tpXS5uYW1lID0gYXNzZXROYW1lICsgJyAnICsgaS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBjb250YWluZXJBc3NldCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYXBwLmFzc2V0cy5hZGQoYXNzZXQpO1xyXG4gICAgICAgIGFwcC5hc3NldHMubG9hZChhc3NldCk7XHJcblxyXG4gICAgICAgIHJldHVybiBhc3NldDtcclxuICAgIH07XHJcblxyXG4gICAgd2luZG93LnV0aWxzID0gdXRpbHM7XHJcbn0pKCk7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkc1tpXV0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtkbWRhc3NjX2dhbWVcIl0gPSBzZWxmW1wid2VicGFja0NodW5rZG1kYXNzY19nYW1lXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vaW5kZXgvaW5kZXgudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==