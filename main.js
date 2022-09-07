import * as THREE from './threejs/build/three.module.js';   
import {GLTFLoader} from './threejs/examples/jsm/loaders/GLTFLoader.js';  
import Stats from './threejs/examples/jsm/libs/stats.module.js';
import { GUI } from './threejs/examples/jsm/libs/lil-gui.module.min.js';


let mixer, modelReady, stats;
var obj, animations;
var walk, idle;

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

        obj.scale.set(2, 2, 2);
        
        animations = gltf.animations
        mixer = new THREE.AnimationMixer(obj);

        walk = mixer.clipAction( animations[3] )
        idle = mixer.clipAction( animations[0] ).play();
        

        
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

const backgroundTexture = new THREE.TextureLoader().load('./assets/stars-2.jpg');
backgroundTexture.wrapS = THREE.RepeatWrapping;
backgroundTexture.wrapT = THREE.RepeatWrapping;
backgroundTexture.repeat.set( 2, 2 );

scene.background = backgroundTexture;

var light = new THREE.HemisphereLight(0xffffff, 0x000000, 5);
scene.add(light)

const Ambilight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( Ambilight );

camera.rotation.x = -0.5 * Math.PI;
camera.rotation.z = -0.5 * Math.PI;
camera.rotation.y = -0.5 * Math.PI;
camera.position.set(-5, 1.8, 0);

const clock = new THREE.Clock()

const planeGeometry = new THREE.PlaneGeometry(50, 50 );

const PlaneTexture = new THREE.TextureLoader().load( './assets/floor_pebbles/textures/floor_pebbles_01_diff_4k.jpg' );
PlaneTexture.wrapS = THREE.MirroredRepeatWrapping
PlaneTexture.wrapT = THREE.MirroredRepeatWrapping
PlaneTexture.repeat.set( 30, 30 );


const planeMaterial = new THREE.MeshBasicMaterial({map: PlaneTexture, side: THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
plane.position.set(0, 0, 0);

scene.add(plane);


let controls = {
    rotationSpeed: 0.02,
    numberOfObjects: scene.children.length,
    removeObj: function () {
        var allChildren = scene.children;
        var lastObject = allChildren[allChildren.length - 1];
        if (lastObject instanceof THREE.Mesh) {
            scene.remove(lastObject);
            this.numberOfObjects = scene.children.length;
        }
    },

    addCone: function () {

        var coneSize = Math.ceil((Math.random() * 3));
        var coneGeometry = new THREE.ConeGeometry(coneSize, coneSize + 5, coneSize + 7);
        var coneMaterial = new THREE.MeshToonMaterial({
            color: Math.random() * 0xffffff
        });
        var cone = new THREE.Mesh(coneGeometry, coneMaterial);
        cone.castShadow = true;
        cone.name = "cone-" + scene.children.length;

        cone.position.x = +30 + Math.round((Math.random() * planeGeometry.parameters.width));
        cone.position.y = 0
        cone.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));
        scene.add(cone);
        this.numberOfObjects = scene.children.length;
        console.log('Created cone with name: ' + cone.name);
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

        cube.position.x = +30 + Math.round((Math.random() * planeGeometry.parameters.width));
        cube.position.y = 0
        cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));
        scene.add(cube);
        this.numberOfObjects = scene.children.length;
        console.log('Created cube with name: ' + cube.name);
    }
}

var gui = new GUI();
// gui.add(controls, 'rotationSpeed', 0, 0.5);
gui.add(controls, 'addCube');
gui.add(controls, 'addCone');
gui.add(controls, 'removeObj');
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
        obj.position.x += 0.1
        obj.rotation.y = -1.6
        animamationModel("walk")
        mixer.update(clock.getDelta())
    } else if(event.key == "s"){
        obj.position.x -= 0.1
        obj.rotation.y = 1.6
        animamationModel("walk")
    } else if(event.key == "a"){
        obj.position.z -= 0.1
        obj.rotation.y = 0
        animamationModel("walk")
    } else if(event.key == "d"){
        obj.position.z += 0.1
        obj.rotation.y = -3.2
        animamationModel("walk")
    }

})

document.addEventListener('keyup', (event) => {
    if(event.key){
        animamationModel("idle")
    }
})


function animamationModel(action){
    if(action == "walk"){
        idle.stop()
        walk.play()
    }else if(action == "idle"){
        walk.stop()
        idle.play()
    }
}
                


