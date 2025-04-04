// RendererStats.js
export class RendererStats {
    constructor() {
      this.lastUpdateTime = Date.now();
      this.frameCount = 0;
      this.lastFpsCalcTime = Date.now();
      this.fps = 0;
      this.frameTime = 0;
      this.textures = []; // register textures manually
  
      this.container = document.createElement('div');
      this.container.style.cssText = 'width:140px;opacity:0.9;font-family:monospace;background:#111;padding:4px;color:#f00;font-size:10px;line-height:14px';
  
      this.lines = {};
      const labels = [
        'FPS',
        'Frame Time (ms)',
        'Texture Memory (MB)',
        'Programs',
        'Geometries',
        'Textures',
        'Draw Calls',
        'Triangles',
        'Points',
        'Lines'
      ];
  
      labels.forEach((key) => {
        const line = document.createElement('div');
        line.textContent = `${key}: -`;
        this.container.appendChild(line);
        this.lines[key] = line;
      });
    }
  
    get domElement() {
      return this.container;
    }
  
    
  

  
    update(renderer) {
      if (!renderer || !renderer.info) return;
  
      const now = Date.now();
      const delta = now - this.lastUpdateTime;
      this.lastUpdateTime = now;
  
      this.frameTime = delta;
      this.frameCount++;
  
      if (now - this.lastFpsCalcTime >= 1000) {
        this.fps = (this.frameCount * 1000) / (now - this.lastFpsCalcTime);
        this.lastFpsCalcTime = now;
        this.frameCount = 0;
      }
  
      const info = renderer.info;
      const memory = info.memory;
      const render = info.render;
  
      this.lines['FPS'].textContent = `FPS: ${this.fps.toFixed(1)}`;
      this.lines['Frame Time (ms)'].textContent = `Frame Time (ms): ${this.frameTime.toFixed(1)}`;
  
      this.lines['Geometries'].textContent = `Geometries: ${memory.geometries}`;
      this.lines['Textures'].textContent = `Textures: ${memory.textures}`;
  
      this.lines['Draw Calls'].textContent = `Draw Calls: ${render.calls}`;
      this.lines['Triangles'].textContent = `Triangles: ${render.triangles}`;
    }
  }
  