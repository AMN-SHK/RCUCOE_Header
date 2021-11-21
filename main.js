import * as THREE from "/node_modules/three/build/three.module.js";
import { EffectComposer } from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "/node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import atmospherevertexShader from "./shaders/atmosphereVertex.glsl";
import atmosphereFragmentShader from "./shaders/atmosphereFragment.glsl";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  35,
  innerWidth / innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

//Earth
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(5,50,50),
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms:{
      globeTexture: {
        value: new THREE.TextureLoader().load('./img/8k_earth_nightmap.jpg')
      }
    }
  })
)
earth.position.x = -5
earth.position.y = -4
scene.add(earth)

//Bloompass
const renderScene = new RenderPass(scene,camera)
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
)
bloomPass.threshhold = 5
bloomPass.strength = 2
bloomPass.radius = 0

const bloomComposer = new EffectComposer(renderer)
bloomComposer.setSize(window.innerWidth, window.innerHeight)
bloomComposer.renderToScreen = true
bloomComposer.addPass(renderScene)
bloomComposer.addPass(bloomPass)

//Atmosphere
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5,50,50),
  new THREE.ShaderMaterial({
    vertexShader: atmospherevertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  })
)
atmosphere.scale.set(1.1, 1.1, 1.1)
atmosphere.position.x = -5
atmosphere.position.y = -4
scene.add(atmosphere)

camera.position.z = 10



function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  earth.rotation.y += 0.001
  bloomComposer.render()
}
animate()