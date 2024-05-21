import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

//render
const canvas = document.getElementById('canvas');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(80, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);


camera.position.set(0,10,-50)


//HDRI Loader
new RGBELoader()
    .setDataType(THREE.FloatType)
    .load('asset3D/hdr_sky.hdr', function(hdrCubeMap){
        hdrCubeMap.encoding = THREE.LinearEncoding;
        const paramGenerator = new THREE.PMREMGenerator(renderer);
        paramGenerator.compileEquirectangularShader();

        const envMap = paramGenerator.fromEquirectangular(hdrCubeMap).texture;
        envMap.format = THREE.RGBAFormat;
        scene.environment = envMap;
        hdrCubeMap.dispose();

        scene.background = envMap;
});

//obrbitcontrols
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
controls.enablePan = false;

controls.target.set(0,8,0);
controls.minDistance = 20; 
controls.maxDistance = 120; 

//GLTF Loader
var loader = new GLTFLoader();
    loader.load('./asset3D/SeabedLamp.glb', function(gltf){
        const model = gltf.scene;
        model.position.set(0,0,0);
        model.scale.set(30,30,30);
        scene.add(model)
    }, undefined, function(error){
        console.error(error);
});
    
//point Light
const pointLight = new THREE.PointLight(0xffffff, 5, 80, 0.5);
pointLight.scale.set(10, 4, 1);
pointLight.position.set(0, 8, 3);
scene.add(pointLight);
const pointLight2 = new THREE.PointLight(0xffffff, 8, 80, 0.5);
pointLight2.scale.set(10, 4, 1);
pointLight2.position.set(0, 8, -4);
scene.add(pointLight2);


//tween animation
var pivot1 = new THREE.Vector3(0, 8, 0);
var initialPosition1 = new THREE.Vector3().copy(camera.position);
var distance1 = initialPosition1.distanceTo(pivot1);
var InitialAngle1 = 0;
var tween;
var rotate1;

var isMouseDown = false;
var isZooming = false;

function initialAnimation(distanceFromPivot) {
    tween = new TWEEN.Tween(camera.position)
        .to({ x: pivot1.x + distanceFromPivot * Math.cos(InitialAngle1), y: initialPosition1.y, z: pivot1.z + distanceFromPivot * Math.sin(InitialAngle1) }, 500)
        .onComplete(() => {
            rotate1 = new TWEEN.Tween({ angle: 0 })
                .to({ angle: Math.PI * 2 }, 4000)
                .onUpdate((obj) => {
                    var angle = obj.angle;
                    var newX = pivot1.x + distanceFromPivot * Math.cos(angle);
                    var newZ = pivot1.z + distanceFromPivot * Math.sin(angle);
                    camera.position.set(newX, initialPosition1.y, newZ);
                    camera.lookAt(pivot1);
                })
                .repeat(Infinity)
                .start();
        })
        .start();
}

initialAnimation(distance1);


const musicBox = document.getElementById('music-box');

//Fungsi untuk memeriksa apakah elemen adalah turunan dari elemen lain
function isDescendant(parent, child) {
    let node = child.parentNode;
    while (node != null) {
        if (node === parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}


//Memulai Tween jika tidak sedang menahan tombol mouse
function startTween(distance) {
    if (!isMouseDown && !isZooming) {
        initialAnimation(distance);
    }
}

//Menghentikan Tween saat menahan tombol mouse
function stopTween() {
if (isMouseDown || isZooming) {
    tween.stop();
    if (rotate1) rotate1.stop(); //Menghentikan tween rotate jika ada
}
}

function onMouseDown(event) {
    if (!isDescendant(musicBox, event.target)) {
        isMouseDown = true;
        stopTween();
    }
}

function onMouseUp(event) {
    if (!isDescendant(musicBox, event.target)) {
        isMouseDown = false;
        startTween(new THREE.Vector3().copy(camera.position).distanceTo(pivot1));
    }
}

//Event listener untuk mouse move, mouse down, dan mouse up
document.addEventListener("mousedown", onMouseDown, false);
document.addEventListener("mouseup", onMouseUp, false);

//Event listener untuk touch start dan touch end
document.addEventListener("touchstart", function(event) {
    isZooming = true;
    if (event.touches.length > 0) {
        onMouseDown(event.touches[0]);
    }
    if (event.touches.length === 2) {
        isZooming = true;
        stopTween();
    }
}, false);

document.addEventListener("touchend", function(event) {
    isZooming = false;
    if (event.changedTouches.length > 0) {
        onMouseUp(event.changedTouches[0]);
    }
    if (event.touches.length === 2) {
        isZooming = false;
        startTween(new THREE.Vector3().copy(camera.position).distanceTo(pivot1));
    }
}, false);

// Event listener untuk menghentikan animasi saat zoom dimulai
controls.addEventListener("start", function () {
    isZooming = true;
    stopTween();
});

// Event listener untuk memulai kembali animasi setelah zoom selesai
controls.addEventListener("end", function () {
    isZooming = false;
    startTween(new THREE.Vector3().copy(camera.position).distanceTo(pivot1));
});





//CRT Shader
const crtTVShader = {
    uniforms: {
        "tDiffuse": { value: null },
        "time": { value: 0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float time;
        varying vec2 vUv;

        void main() {
            vec2 uv = vUv;

            // Efek vignette
            float radius = 0.8;
            float softness = 0.3;
            vec2 center = vec2(0.5, 0.5);
            float vignette = smoothstep(radius, radius - softness, length(uv - center));

            // Efek garis lurus
            vec2 p = mod(uv * vec2(600.0, 300.0), vec2(1.0)); //size nya
            vec3 col = texture2D(tDiffuse, uv).rgb;
            col *= 0.9 + 0.1 * sin(30.0 * p.x * sin(time) + 30.0 * p.y * cos(time));
            col *= 0.95 + 0.05 * sin(32.0 * p.x * sin(time) + 32.0 * p.y * cos(time));
            
            // Gabungkan efek vignette dan garis lurus
            col *= vignette;

            gl_FragColor = vec4(col, 1.0);
        }
    `
};

//Render pass
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const shaderPass = new ShaderPass(crtTVShader);
shaderPass.renderToScreen = true;
composer.addPass(shaderPass);



//animation
function animate(){
    requestAnimationFrame(animate);
    shaderPass.uniforms.time.value += 0.01;
    controls.update();
    TWEEN.update();
    // renderer.render(scene, camera);
    composer.render();

}

animate();

