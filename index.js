import * as THREE from 'three';
import {
	OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
import {
	FBXLoader
} from 'three/examples/jsm/loaders/FBXLoader.js';

import model_1 from './models/model_1.fbx';

import posx from './materials/posx.jpg';
import negx from './materials/negx.jpg';
import posy from './materials/posy.jpg';
import negy from './materials/negy.jpg';
import posz from './materials/posz.jpg';
import negz from './materials/negz.jpg';


let container, scene, renderer, camera, orbitControls, stats, loaderFBX, textureLoader;
let mixer, clock;

textureLoader = new THREE.TextureLoader();
loaderFBX = new FBXLoader();


init();
loadModel();
animate();


function loadModel() {

	var textureCube = new THREE.CubeTextureLoader().load([posx,negx,posy,negy,posz,negz]);
	textureCube.format = THREE.RGBFormat;

	let model_1Material = new THREE.MeshBasicMaterial( { 
		envMap: textureCube,
	} );

	loaderFBX.load(model_1, function (object) {
		object.traverse(function (child) {

			if (child.isMesh) {
				child.material = model_1Material;
				console.log(child.material);

				
				// child.castShadow = true;
				// child.receiveShadow = true;
			}

		});
		let scale = 0.2;
		object.scale.set(scale, scale, scale)

		scene.add(object);

	});
}

function initClock() {
	clock = new THREE.Clock();
}

function initScene() {
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xa0a0a0);
	scene.fog = new THREE.Fog(0xa0a0a0, 10, 200);
}

function initRenderer() {
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.shadowMap.enabled = true;
	container.appendChild(renderer.domElement);
}

function initCamera() {
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(0, 100, 100);
}

function initLights() {
	const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
	hemiLight.position.set(0, 20, 0);
	scene.add(hemiLight);
	const dirLight = new THREE.DirectionalLight(0xffffff);
	dirLight.position.set(3, 10, 10);
	dirLight.castShadow = true;
	dirLight.shadow.camera.top = 2;
	dirLight.shadow.camera.bottom = -2;
	dirLight.shadow.camera.left = -2;
	dirLight.shadow.camera.right = 2;
	dirLight.shadow.camera.near = 0.1;
	dirLight.shadow.camera.far = 40;
	scene.add(dirLight);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function addPlane() {
	const mesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshPhongMaterial({
		color: 0x999999,
		depthWrite: false
	}));
	mesh.rotation.x = -Math.PI / 2;
	mesh.receiveShadow = true;
	scene.add(mesh);
}

function addOrbitControls() {
	orbitControls = new OrbitControls(camera, renderer.domElement);
	// orbitControls.enablePan = false;
	// orbitControls.enableZoom = false;
	orbitControls.target.set(0, 1, 0);
	orbitControls.update();
}

function init() {
	container = document.getElementById('container');
	initClock();
	initScene();
	initLights();
	initRenderer();
	initCamera();
	addPlane();
	addOrbitControls();
	window.addEventListener('resize', onWindowResize);
}

function animate() {
	requestAnimationFrame(animate);
	const delta = clock.getDelta();

	renderer.render(scene, camera);
}