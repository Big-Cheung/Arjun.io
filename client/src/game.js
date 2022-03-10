import * as three from "three"
import { Group, Vector3 } from "three"
import { Text } from "troika-three-text"
import { io } from 'socket.io-client'
import { listen, post, read, send } from "./events.js"





/*const loader = new GLTFLoader();    
loader.load("./assets/cat.glb",
    (gltf) => {
        gltf.scene.children[0].geometry.scale(0.05,0.05,0.05)
        geometry = gltf.scene.children[0].geometry;
    },
    (xhr) => {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    (error) => {
        console.log(error.message)
})*/

//game globals
let state = 0;
let game = 0;
let statics = {}
let others = {}
let playerdata = {}
let player;
let needsUpdate = false;
const keys = [false,false,false,false,false]

//socket globals
var socket;
var socketID;
socket = io("http://localhost:3001");
socket.on("connect",(e) => {
    console.log("Connected!");
    socketID = socket.id
    initSockets();
})


//cameraobj
var targetObj = new Vector3(0,0,5);
//motion
let speed = 7;
const lerpspeed = 0.2;
const MIN_X = -15
const MAX_X = 15
const MIN_Z = -15
const MAX_Z = 15
//player loads
var geometry = new three.CylinderGeometry(0.5,0.5);
const playerMat = new three.MeshLambertMaterial( { color: 0x0000ff } );
const otherMat = new three.MeshLambertMaterial( { color: 0x1166ff } );
const infectedMat = new three.MeshBasicMaterial( { color: 0xff0000 } );

const teamColors = [
    0x008800,
    0x0000ff,
    0xff0000
]

//utils
const keyMap = {
    "w":0,
    "a":1,
    "s":2,
    "d":3,
    "r":4,
}

class PlayerModel {
    constructor(name,color) {
        this.material = new three.MeshLambertMaterial( { color: color } ); 
        this.body = new three.Mesh(geometry, this.material);
        this.group = new Group();
        this.tag = new Text();
        this.tag.text = name;
        this.tag.fontSize = 0.5; 
        this.tag.anchorX = "center";
        this.tag.anchory = "center";
        this.tag.position.y = 1.25;
        this.tag.outlineWidth = "10%";

        this.group.add(this.tag);
        this.group.add(this.body);
    }

    dispose() {
        this.tag.dispose();
        this.body.dispose();
        this.group.dispose();
        this.material.dispose();
    }

    changeColor(color) {
        this.material.color.setHex(color)
    }

    update() {
        this.tag.quaternion.copy(statics.camera.quaternion);
    }
}

class OtherPlayer {
    //Constructory/Destructor
    constructor(name,pos=[0,0,0]) {
        this.name = name;
        this.obj = new PlayerModel(name,0x008800);
        this.position = new Vector3(...pos);
    }

    destroy() {
        this.obj.dispose();
        this.position.dispose();
    }

    //Methods
    update() {
        this.obj.group.position.lerp(this.position,lerpspeed);
        this.obj.update();
    }
}

class Player {
    //Constructor/Destructor
    constructor(name) {
        this.name = name;
        this.obj = new PlayerModel(this.name,0x008800);
        this.position = new Vector3(0,0,4);
        targetObj = this.obj.group.position;
        statics.camera.zoom = 2;
        statics.camera.updateProjectionMatrix();

        
        document.addEventListener("keydown", this.keyDown)
        document.addEventListener("keyup", this.keyUp)
    }

    destroy() {
        this.obj.forEach((element) => element.dispose());
        this.position.dispose();
        document.removeEventListener("keydown", this.keyUp)
        document.removeEventListener("keyup", this.keyUp)
    }

    //Methods
    update() {
        const normal = (keys[0] + keys[1] + keys[2] + keys[3]) > 1 ? 0.707 : 1
        this.position.z = bound(this.position.z, MIN_Z, MAX_Z);
        this.position.x = bound(this.position.x, MIN_X, MAX_X);
        this.position.z += 0.01 * speed * (keys[2] - keys[0]) * normal
        this.position.x += 0.01 * speed * (keys[3] - keys[1]) * normal

        this.obj.group.position.lerp(this.position,lerpspeed);
        this.obj.update();
    }

    keyUp(ev) {
        if (ev.key in keyMap) {
            keys[keyMap[ev.key]] = false;
            if (socketID) {
                socket.emit("kc",keys);
            }
        } else if (ev.key === " ") {
            statics.camera.zoom = 2;
            statics.camera.updateProjectionMatrix();
        }
    }

    keyDown(ev) {
        if (ev.key in keyMap) {
            keys[keyMap[ev.key]] = true;
            if (socketID) {
                socket.emit("kc",keys);
            }
        } else if (ev.key === " ") {
            statics.camera.zoom = 3;
            statics.camera.updateProjectionMatrix();
        }
    }
}


function initSockets() {
    window.addEventListener("beforeunload",socket.disconnect);

    post("socketid",socketID);

    //Player data list
    socket.on("pdl",(e) => {
        playerdata = e;
    })
    //Player list
    socket.on("pl",(e) => {
        for (var el in e) {
            others[el] = new OtherPlayer(e[el]["name"],e[el]["position"]);
            others[el].obj.changeColor(teamColors[e[el]["team"]]);
            statics.scene.add(others[el].obj.group);
        }
    })

    //Game join
    socket.on("gj", (e) => {
        console.log("got game join");
        let name = "Guest " + Math.floor(Math.random() * 10000)
        if (socketID in playerdata) {
            name = playerdata[socketID]
        }
        player = new Player(name);
        statics.scene.add( player.obj.group );
        socket.emit("j",name);
    })

    socket.on("li", (e) => {
        playerdata[e[0]] = e[1];
        if (player && e[0] == socketID) {
            player.obj.tag.text = e[1];
        }
        if (e[0] in others) {
            others[e[0]].obj.tag.text = e[1];
        }
    })

    //Game state updated
    socket.on("gi", (e) => {
        if (player) {
            targetObj = player.obj.group.position
        } else {
            targetObj = new Vector3(0,0,5);
        }
    })

    //Game end
    socket.on("ge", (e,winner) => {
        if (socketID in e) {
            player.obj.changeColor(teamColors[e[socketID]["team"]]);
        }
        for (var el in e) {
            if (el == socketID) {
                continue;
            }
            others[el].obj.changeColor(teamColors[e[el]["team"]]);
        }
        send("gameOver",winner);
    })

    //Join
    socket.on("j",(e) =>{
        console.log("Player " + e[1] + " joined")
        others[e[0]] = new OtherPlayer(e[1]);
        statics.scene.add(others[e[0]].obj.group);
    })

    //Leave
    socket.on("l",(e) => {
        console.log("Player left")
        statics.scene.remove(others[e].obj.group);
        others[e].destroy();
        delete others[e];
        console.log(Object.keys(others));   
    })

    //Update
    socket.on("u",(e)=>{
        if (socketID in e) {
            player.position.set(...e[socketID].position);
        }
        for (var el in e){
            if (el == socketID ) {
                continue;
            }
            others[el].position.set(...e[el].position);
        };
    })

    //Game 1 event update
    socket.on("g1u", (e) => {
        let scores = []
        if (socketID in e) {
            console.log("Team : " + e[socketID]["team"]);
            player.position.set(...e[socketID].position);
            player.obj.changeColor(teamColors[e[socketID]["team"]]);
            scores.push([player.name,e[socketID]["score"],e[socketID]["team"]])
        }
        for (var el in e){
            if (el == socketID ) {
                continue;
            }
            others[el].position.set(...e[el].position);
            others[el].obj.changeColor(teamColors[e[el]["team"]]);
            scores.push([others[el].name,e[el]["score"],e[el]["team"]])
        };
        send("updateScores",scores);
    })
}

function bound(value, min, max) {
    return Math.min(Math.max(min,value),max);
}

function createCamera() {
    statics.camera = new three.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    statics.camera.position.z = 25;
    statics.camera.position.y = 20;
    statics.camera.zoom = 1.3;
    statics.camera.updateProjectionMatrix();
    statics.cameraGroup = new Group();
    statics.cameraGroup.add(statics.camera);
}

function createWorld() {
    statics.world = new Group();
    let floorGeo = new three.BoxGeometry();
    let floorMat = new three.MeshLambertMaterial( { color: 0x333333 } );
    statics.light = new three.PointLight(0xffffff,4,100);
    statics.light.position.set(0,40,20);
    floorGeo.scale(31,99,31);
    statics.floor = new three.Mesh(floorGeo, floorMat);
    statics.floor.position.y = -50;
    statics.world.add(statics.light);
    statics.world.add(statics.floor);
    return statics.world;
}

export default function main() {
    statics.scene = new three.Scene();
    statics.scene.background = new three.Color( 0x87ceeb );
    statics.renderer = new three.WebGLRenderer({antialias:true});
    statics.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( statics.renderer.domElement );

    const loader = new three.CubeTextureLoader();
    const texture = loader.load([
        'assets/pos-x.png',
        'assets/neg-x.png',
        'assets/pos-y.png',
        'assets/neg-y.png',
        'assets/pos-z.png',
        'assets/neg-z.png',
    ]);
    statics.scene.background = texture;
    
    createCamera();
  
    statics.scene.add(createWorld());

    //controls.update();
    function animate() {
        requestAnimationFrame( animate );
        if (player) {
            player.update();
        }
        for (var other in others) {
            others[other].update();
        }
        statics.camera.lookAt( targetObj )
        //controls.update();
        statics.renderer.render( statics.scene, statics.camera );
    }
    animate();
}
