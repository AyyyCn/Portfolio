export class RendererStats {
  constructor() {
    this.fps = 0;
    this.frameTime = 0;
    this.frameCount = 0;
    this.lastFpsCalcTime = performance.now();
    this._startTime = performance.now();

    this.container = document.createElement('div');
    this.container.style.cssText = `
      width: 160px;
      background: #0e0e13;
      color: #9cf6f6;
      font-family: 'Courier New', monospace;
      font-size: 11px;
      line-height: 16px;
      padding: 8px;
      border: 1px solid #444;
      border-radius: 6px;
      box-shadow: 0 0 8px rgba(0,0,0,0.5);
      opacity: 0.95;
    `;

    this.lines = {};
    const labels = [
      'FPS',
      'Frame Time (ms)',
      'Geometries',
      'Textures',
      'Draw Calls',
      'Triangles'
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

  begin() {
    this._startTime = performance.now();
  }

  end(renderer) {
    if (!renderer || !renderer.info) return;

    const now = performance.now();
    this.frameTime = now - this._startTime;

    this.frameCount++;
    if (now - this.lastFpsCalcTime >= 1000) {
      this.fps = (this.frameCount * 1000) / (now - this.lastFpsCalcTime);
      this.lastFpsCalcTime = now;
      this.frameCount = 0;
    }

    const info = renderer.info;
    const memory = info.memory;
    const render = info.render;

    const fpsColor = this.fps > 50 ? '#4caf50' : this.fps > 30 ? '#ffc107' : '#f44336';
    this.lines['FPS'].innerHTML = `<span style="color:${fpsColor}">FPS: ${this.fps.toFixed(1)}</span>`;
    this.lines['Frame Time (ms)'].innerHTML = `<span style="color:#ccc">Frame Time: ${this.frameTime.toFixed(1)} ms</span>`;

    this.lines['Geometries'].textContent = `Geometries: ${memory.geometries}`;
    this.lines['Textures'].textContent = `Textures: ${memory.textures}`;
    this.lines['Draw Calls'].textContent = `Draw Calls: ${render.calls}`;
    this.lines['Triangles'].textContent = `Triangles: ${render.triangles}`;
  }
}
