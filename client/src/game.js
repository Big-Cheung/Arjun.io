import * as three from "three"
import { Group, Vector3 } from "three"
import { Text } from "troika-three-text"
import { io } from 'socket.io-client'

//game globals
let states = {}
let statics = {}
let others = {}
let player;
const keys = [0,0,0,0,0,0]

//socket globals
var socket;
var socketID;
socket = io("http://localhost:3001");
socket.on("connect",(e) => {
    console.log("Connected!");
    socketID = socket.id
    initSockets();
})

//motion
let speed = 7;
const lerpspeed = 0.2;
const MAX_X = 15;
//player loads
const geometry = new three.BoxGeometry();
const playerMat = new three.MeshLambertMaterial( { color: 0x0000ff } );
const otherMat = new three.MeshBasicMaterial( { color: 0x00aaff } );
const infectedMat = new three.MeshBasicMaterial( { color: 0xff0000 } );

//utils
const keyMap = {
    "w":0,
    "a":1,
    "s":2,
    "d":3,
    "r":4,
    "t":5
}

class PlayerModel {
    constructor(name,material) {
        this.body = new three.Mesh(geometry, material);
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
    }

    update(dt, camera) {
        this.tag.quaternion.copy(statics.camera.quaternion);
    }
}

class OtherPlayer {
    //Constructory/Destructor
    constructor(name,pos=[0,0,0]) {
        this.obj = new PlayerModel(name,otherMat);
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
        this.obj = new PlayerModel(this.name,playerMat);
        this.position = new Vector3(0,0,0);

        
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
    let name = prompt("Name?") || "LOSER";
    player = new Player(name);
    statics.scene.add( player.obj.group );
    socket.emit("j",name);

    window.addEventListener("beforeunload",socket.disconnect);
    //Player list
    socket.on("pl",(e) => {
        console.log("Server Join")
        for (var el in e) {
            others[el] = new OtherPlayer(e[el]["name"],e[el]["position"]);
            statics.scene.add(others[el].obj.group);
        }
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
}

function createCamera() {
    statics.camera = new three.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    statics.camera.position.z = 20;
    statics.camera.position.y = 20;
    statics.camera.zoom = 2;
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
    floorGeo.scale(30,100,30);
    statics.floor = new three.Mesh(floorGeo, floorMat);
    statics.floor.position.y = -52;
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
        speed += (keys[4] - keys[5])*0.1;
        statics.camera.lookAt( player.obj.group.position )
        //controls.update();
        statics.renderer.render( statics.scene, statics.camera );
    }
    animate();
}