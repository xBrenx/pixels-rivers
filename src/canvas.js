import * as THREE from 'three';
import './index.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import fragment from '../shaders/fragment.glsl';
import vertex from '../shaders/vertex.glsl';
// import * as dat from "dat.gui";

import t1 from "./img/2.jpg";
import t2 from './img/4.jpg';
import t3 from './img/5.jpg';
import t4 from './img/1.jpg';
import t5 from './img/7.jpg';
import t6 from './img/3.jpg';
import t7 from './img/4.jpg';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { CustomPass } from './CustomPass.js';


export default class Sketch{
  constructor(options) {
    this.scene = new THREE.Scene();

    this.urls = [t1, t2, t3, t7, t4, t5, t6]
    this.textures = this.urls.map(url => new THREE.TextureLoader().load(url))

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.useLegacyLights = true;
    this.renderer.TextureEncoding = THREE.SRGBColorSpace;

    this.container.appendChild(this.renderer.domElement);


    this.camera = new THREE.PerspectiveCamera( 
      70, 
      window.innerWidth / window.innerHeight, 
      0.001, 
      1000 
      );

      this.camera.position.set(0, 0, 3);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableZoom = false; // Desactiva el zoom al mover la rueda del mouse
      this.controls.enableRotate = false;
      this.controls.enablePan = false;
      this.time = 0;

      this.isPlaying = true;

      this.initPost();
      this.addObjects();
      this.resize();
      this.render();
      this.setupResize();
      this.settings();
  }

  initPost() {
    this.composer = new EffectComposer( this.renderer );
    this.composer.addPass( new RenderPass(this.scene, this.camera));

    this.effect1 = new ShaderPass( CustomPass );
    this.composer.addPass( this.effect1 );
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  settings() {
    this.settings = {
      progress: 0.9,//circulo de la imgs
      scale: 2.9,
      zoom: 0,
      //  progress: 0.,
      //  scale: 0.,
      // zoom: 0.,
    };
    //Controles 
    // this.gui = new dat.GUI();
    // this.gui.add(this.settings, "progress", 0, 1, 0.01);
    // this.gui.add(this.settings, "scale", 0, 10, 0.01);
  }


  addObjects() {
    // let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0},
        uTexture: { value: this.textures[0]},
        resolution: { value: new THREE.Vector4() },
      },
      vertexShader: vertex,
      fragmentShader: fragment
    });

     this.geometry = new THREE.PlaneGeometry(1.9/2, 1/2, 1, 1);
    // this.geometry = new THREE.BoxGeometry(1, 1, 1);

    this.meshes = []
    this.textures.forEach((t, i) => {
      let m = this.material.clone();
      m.uniforms.uTexture.value = t;
      let mesh = new THREE.Mesh(this.geometry, m);
      this.scene.add(mesh);
      this.meshes.push(mesh);
      mesh.position.x = i - 1.5;

       // Ajustar la posición de la cámara para centrar entre t3 y t4
       if (i === 2 || i === 3) {
        // Añadir un desplazamiento adicional de 0.5
        this.camera.position.x = (mesh.position.x + this.camera.position.x) / 2 + 1.5 ;
      }
      
    });
    
  }
  
  render() {
    this.meshes.forEach((m) => {
      // m.position.y = -this.settings.progress
      m.rotation.z = this.settings.progress*Math.PI/2
    })
    this.time += 0.01;
    this.material.uniforms.time.value = this.time;
    this.effect1.uniforms['time'].value = this.time;
    this.effect1.uniforms['progress'].value = this.settings.progress;
    this.effect1.uniforms['scale'].value = this.settings.scale;
    this.controls.zoom = 8.9;

    if (this.isPlaying) {
      this.composer.render();
    }

    requestAnimationFrame(this.render.bind(this));
  }
}

new Sketch({
  dom: document.getElementById('three')
});
