import { BaseIsland } from './BaseIsland.js';
import * as THREE from 'three';

export class HubIsland extends BaseIsland {
  constructor({ name, model, animations, position }) {
    super({ name, model, animations, position });
    this.init();
  }

  init() {
    


    
  }



  update(delta) {
    super.update(delta);
  }
}
