import * as THREE from './threejs/build/three.module.js';   
import {GLTFLoader} from './threejs/examples/jsm/loaders/GLTFLoader.js';  
import Stats from './threejs/examples/jsm/libs/stats.module.js';
import { GUI } from './threejs/examples/jsm/libs/lil-gui.module.min.js';


let mixer, modelReady, stats;
var obj, animations;


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.01, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

stats = new Stats();
document.body.appendChild( stats.dom );

var loader = new GLTFLoader();
loader.load("./threejs/examples/models/gltf/Soldier.glb", 

    function (gltf){
        obj = gltf.scene;
        obj.position.y = 0;

        obj.traverse( function ( object ) {

            if ( object.isMesh ) object.castShadow = true;

        } );
        
        animations = gltf.animations
        mixer = new THREE.AnimationMixer(obj);

        let action = mixer.clipAction( animations[2] ).play();
        console.log(action)

        
        scene.add(gltf.scene)
        modelReady = true    
    },

    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {
        console.log(error);
        console.log( 'An error happened' );

        
    });

scene.background = new THREE.Color(0x202020)

var light = new THREE.HemisphereLight(0xffffff, 0x000000, 5);
scene.add(light)

const Ambilight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( Ambilight );

camera.rotation.x = -0.5 * Math.PI;
camera.rotation.z = -0.5 * Math.PI;
camera.rotation.y = -0.5 * Math.PI;
camera.position.set(-5, 1.8, 0);

const clock = new THREE.Clock()

const geometry = new THREE.PlaneGeometry(50, 50 );

const PlaneTexture = new THREE.TextureLoader().load( './assets/floor_pebbles/textures/floor_pebbles_01_diff_4k.jpg' );
PlaneTexture.wrapS = THREE.MirroredRepeatWrapping
PlaneTexture.wrapT = THREE.MirroredRepeatWrapping
PlaneTexture.repeat.set( 30, 30 );


const material = new THREE.MeshBasicMaterial({map: PlaneTexture, side: THREE.DoubleSide});
const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = -0.5 * Math.PI;
plane.position.set(0, 0, 0);

scene.add(plane);


const cubeGeometry = new THREE.BoxGeometry( 2, 2, 2 );
const cubeMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
const cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
scene.add( cube );
cube.position.set(10, 0, 10)

const capsuleGeometry = new THREE.CapsuleGeometry( 1, 1, 4, 8 );
const capsuleMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
const capsule = new THREE.Mesh( capsuleGeometry, capsuleMaterial );
scene.add( capsule );

capsule.position.set(10, 1.5, -10)


const coneGeometry = new THREE.ConeGeometry( 2, 10, 12 );
const coneMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
const cone = new THREE.Mesh( coneGeometry, coneMaterial );
const cone2 = new THREE.Mesh( coneGeometry, coneMaterial );
scene.add( cone );

cone.position.set(20, 0, 0)


let controls = {
    rotationSpeed: 0.02,
    numberOfObjects: scene.children.length,
    removeCube: function () {
        var allChildren = scene.children;
        var lastObject = allChildren[allChildren.length - 1];
        if (lastObject instanceof THREE.Mesh) {
            scene.remove(lastObject);
            this.numberOfObjects = scene.children.length;
        }
    },

    addCube: function () {

        var cubeSize = Math.ceil((Math.random() * 3));
        var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        var cubeMaterial = new THREE.MeshLambertMaterial({
            color: Math.random() * 0xffffff
        });
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;
        cube.name = "cube-" + scene.children.length;

        cube.position.x = -30 + Math.round((Math.random() * plane.parameters.width));
        cube.position.y = Math.round((Math.random() * 5));
        cube.position.z = -20 + Math.round((Math.random() * plane.parameters.height));
        scene.add(cube);
        this.numberOfObjects = scene.children.length;
        console.log('Created cube with name: ' + cube.name);
    }
}

var gui = new GUI();
// gui.add(controls, 'rotationSpeed', 0, 0.5);
gui.add(controls, 'addCube');
gui.add(controls, 'removeCube');
gui.add(controls, 'numberOfObjects').listen();


function animate(){


    if (modelReady) {
        mixer.update(clock.getDelta())
    }

    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    stats.update();
}

animate()

document.addEventListener('keydown', (event) => {
    
    if(event.key == "w"){
        obj.position.x += 0.02
        obj.rotation.y = -1.6
        animamationModel("walk")
        mixer.update(clock.getDelta())
    } else if(event.key == "s"){
        obj.position.x -= 0.02
        obj.rotation.y = 1.6
        animamationModel("walk")
    } else if(event.key == "a"){
        obj.position.z -= 0.02
        obj.rotation.y = 0
        animamationModel("walk")
    } else if(event.key == "d"){
        obj.position.z += 0.02
        obj.rotation.y = -3.2
        animamationModel("walk")
    }

})

// document.addEventListener('keyup', (event) => {
//     if(event.key){
//         animamationModel("idle")
//     }
// })


function animamationModel(action){
    if(action == "walk"){
        mixer.clipAction( animations[3] ).play();
    }else if(action == "idle"){
        mixer.clipAction( animations[2] ).play();
    }
}
                


