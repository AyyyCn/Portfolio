// DrawCallInspector-Full.js (Rebuild w/ per-draw-call heatmap override - FIXED shaders)
import * as THREE from 'three';

class DrawCallInspector {
  constructor(renderer, options = {}) {
    this.renderer = renderer;
    this.enabled = true;
    this.scale = options.scale ?? 0.25;
    this.maxFrameTime = 0;
    this.drawCalls = 0;
    this.drawIndex = 0;
    this._initOverlay();
    this._initMaterial();
    this._hookRenderer();
  }

  _initOverlay() {
    this.container = document.createElement('div');
    this.container.style.cssText = 'position:fixed;right:1em;bottom:1em;z-index:9999;background:#fff;border:1px solid #888;padding:5px;font-family:monospace;font-size:12px;color:#000';

    this.label = document.createElement('div');
    this.container.appendChild(this.label);

    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'margin-top:5px;max-width:256px;border:1px solid #222;image-rendering: pixelated;';
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);

    document.body.appendChild(this.container);

    this.rt = new THREE.WebGLRenderTarget(256, 256);
    this.previewScene = new THREE.Scene();
    this.previewCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.previewQuad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.MeshBasicMaterial({ map: this.rt.texture })
    );
    this.previewScene.add(this.previewQuad);
  }

  _initMaterial() {
    this.flatMaterial = new THREE.ShaderMaterial({
      uniforms: { color: { value: new THREE.Color() } },
      vertexShader: `
        uniform vec3 color;
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        void main() {
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      depthTest: true,
      depthWrite: true,
    });
  }

  _hookRenderer() {
    const original = this.renderer.renderBufferDirect;
    this.renderer.renderBufferDirect = (camera, scene, geometry, material, object, group) => {
      if (this.enabled) {
        this.drawCalls++;

        const r = ((this.drawIndex * 43) % 256) / 255;
        const g = ((this.drawIndex * 97) % 256) / 255;
        const b = ((this.drawIndex * 157) % 256) / 255;
        this.flatMaterial.uniforms.color.value.setRGB(r, g, b);
        this.drawIndex++;

        original.call(this.renderer, camera, scene, geometry, this.flatMaterial, object, group);
      } else {
        original.call(this.renderer, camera, scene, geometry, material, object, group);
      }
    };
  }

  begin() {
    if (!this.enabled) return;
    this.drawCalls = 0;
    this.drawIndex = 0;
    this.startTime = performance.now();
    this.renderer.setRenderTarget(this.rt);
    this.renderer.clear();
  }

  end(scene, camera) {
    if (!this.enabled) return;
    this.renderer.render(scene, camera);
    this.renderer.setRenderTarget(null);
    const frameTime = performance.now() - this.startTime;
    this.maxFrameTime = Math.max(this.maxFrameTime, frameTime);
  }

  update() {
    if (!this.enabled) return;

    const size = this.renderer.getSize(new THREE.Vector2());
    const w = Math.floor(size.x * this.scale);
    const h = Math.floor(size.y * this.scale);
    this.canvas.width = w;
    this.canvas.height = h;

    this.previewQuad.material.map = this.rt.texture;
    this.previewQuad.material.needsUpdate = true;

    const prevViewport = this.renderer.getViewport(new THREE.Vector4());
    const prevScissor = this.renderer.getScissor(new THREE.Vector4());

    this.renderer.setScissorTest(true);
    this.renderer.setViewport(0, 0, w, h);
    this.renderer.setScissor(0, 0, w, h);
    this.renderer.render(this.previewScene, this.previewCamera);
    this.renderer.setViewport(prevViewport);
    this.renderer.setScissor(prevScissor);
    this.renderer.setScissorTest(false);

    this.ctx.clearRect(0, 0, w, h);
    this.ctx.drawImage(this.renderer.domElement, 0, size.y - h, w, h, 0, 0, w, h);

    this.label.innerHTML = `DrawCalls: ${this.drawCalls}<br>Max ms: ${this.maxFrameTime.toFixed(2)}`;
  }
}

export { DrawCallInspector };
