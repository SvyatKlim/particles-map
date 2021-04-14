import "three";
import { TweenLite } from "gsap/TweenMax";

import InteractiveControls from "./controls/InteractiveControls";
import Particles from "./particles/Particles";

const glslify = require("glslify");

export default class WebGLView {
  constructor(app, nameTexture) {
    this.app = app;
    this.textureContainer = this.app.container;
    this.parentEl = document.querySelector(this.app.container);
    if (nameTexture === "map") {
      this.samples = [
        "images/image-523-test.png",
        "images/image-523-test-2.png",
        "images/image-523-test-3.png",
        "images/image-523-test-4.png",
      ];
    }
    //  else {
    //   this.samples = [
    //     // 'images/sample-01.png',
    //     // 'images/sample-02.png',
    //     // 'images/sample-03.png',
    //     // 'images/sample-04.png',
    //     // 'images/sample-05.png',
    //     // 'images/sample-07.png',
    //     // 'images/sample-08.png',
    //     "images/sample-09.png",
    //     "images/sample-10.png",
    //     "images/sample-11.png",
    //   ];
    // }

    this.initThree();
    this.initParticles();
    this.initControls();

    const rnd = ~~(Math.random() * this.samples.length);
    this.goto(rnd);
  }

  initThree() {
    // scene
    this.scene = new THREE.Scene();

    // camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.parentEl.clientWidth / this.parentEl.clientHeight,
      1,
      10000
    );
    this.camera.position.z = 300;

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    // clock
    this.clock = new THREE.Clock(true);
  }

  initControls() {
    this.interactive = new InteractiveControls(
      this.camera,
      this.renderer.domElement
    );
  }

  initParticles() {
    this.particles = new Particles(this, this.textureContainer);
    this.scene.add(this.particles.container);
  }

  // ---------------------------------------------------------------------------------------------
  // PUBLIC
  // ---------------------------------------------------------------------------------------------

  update() {
    const delta = this.clock.getDelta();

    if (this.particles) this.particles.update(delta);
  }

  draw() {
    this.renderer.render(this.scene, this.camera);
  }

  goto(index) {
    console.log(this.currSample);
    // init next
    if (this.currSample == null) this.particles.init(this.samples[index]);
    // hide curr then init next
    else {
      this.particles.hide(true).then(() => {
        this.particles.init(this.samples[index]);
      });
    }
    var p = document.createElement("p");
    document.body.appendChild(p);
    document.querySelector("p").innerHTML = `This url picture = ${this.samples[index]}`;

    this.currSample = index;
  }

  next() {
    if (this.currSample < this.samples.length - 1)
      this.goto(this.currSample + 1);
    else this.goto(0);
  }

  // ---------------------------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------------------------

  resize() {
    if (!this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.fovHeight =
      2 *
      Math.tan((this.camera.fov * Math.PI) / 180 / 2) *
      this.camera.position.z;

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    if (this.interactive) this.interactive.resize();
    if (this.particles) this.particles.resize();
  }
}
