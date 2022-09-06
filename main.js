import * as THREE from './threejs/build/three.module.js';   
                import {GLTFLoader} from './threejs/examples/jsm/loaders/GLTFLoader.js';    


                let mixer;
                let modelReady
                

                var scene = new THREE.Scene();

                var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.01, 1000);

                var renderer = new THREE.WebGLRenderer();

                renderer.setSize(window.innerWidth, window.innerHeight);
                document.body.appendChild(renderer.domElement);

                var loader = new GLTFLoader();

                var obj;


                // Model Information:
                // * title:	Buster Drone
                // * source:	https://sketchfab.com/3d-models/buster-drone-294e79652f494130ad2ab00a13fdbafd
                // * author:	LaVADraGoN (https://sketchfab.com/lavadragon)

                

                loader.load("./threejs/examples/models/gltf/Soldier.glb", 
                
                function (gltf){

                    

                    obj = gltf.scene;
                    obj.position.y = 0;
                    


                    const animations = gltf.animations

                    console.log(animations)

                    mixer = new THREE.AnimationMixer(obj);


                    
                    let action = mixer.clipAction( animations[0] ).play();

                    // console.log(action)
                    
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

                var light = new THREE.HemisphereLight(0xffffff, 0x000000, 4);
                
                scene.add(light)

                camera.rotation.x = -0.5 * Math.PI;
                camera.rotation.z = -0.5 * Math.PI;
                
                
                camera.position.set(0, 8, 0);

                const targetRocketPosition = 40;
                const animationDuration = 2000;

                const clock = new THREE.Clock()

                const geometry = new THREE.PlaneGeometry(50, 50 );

                // const PlaneTexture = new THREE.TextureLoader().load( './assets/black.jpg' );

                const material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});

                const plane = new THREE.Mesh(geometry, material);

                plane.rotation.x = -0.5 * Math.PI;

                plane.position.set(0, 0, 0);

                scene.add(plane);




                function animate(){

                    const t = (Date.now() % animationDuration) / animationDuration;


                    if (modelReady) {
                        mixer.update(clock.getDelta())
                    }

                    const delta = targetRocketPosition * Math.sin(Math.PI * 2 * t);
                    if(obj){
                        // obj.rotation.y = -1.6
                        // obj.position.x += 0.02

                
                        // obj.rotation.z += 0.1;


                        // if(obj.position.y < 1000){
                        //     obj.position.y += 1.5
                        // }else{
                        //     obj.position.y = -600;
                        // }

                        
                        // console.log(obj.position.y);

                    }

                    
                    


                    requestAnimationFrame(animate)
                    renderer.render(scene, camera)
                }

                animate()

                document.addEventListener('keydown', (event) => {
                    
                    if(event.key == "w"){
                        obj.position.x += 0.02
                        obj.rotation.y = -1.6
                    } else if(event.key == "s"){
                        obj.position.x -= 0.02
                        obj.rotation.y = 1.6
                    } else if(event.key == "a"){
                        obj.position.z -= 0.02
                        obj.rotation.y = 0
                    } else if(event.key == "d"){
                        obj.position.z += 0.02
                        obj.rotation.y = -3.2
                    }
                
                })
