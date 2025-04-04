import * as THREE from 'three';
import { materialEmissive } from 'three/tsl';
export function makeTextLabel(message, parameters = {}) {
    const font = parameters.font || 'Arial';
    const fontSize = parameters.fontSize || 48;
    const color = parameters.color || 'white';
    const scale = parameters.scale || 0.01;
    const bgColor = parameters.bgColor || 'rgba(0, 0, 0, 0)';

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;

    // First, set font to measure text width
    ctx.font = `${fontSize * dpr}px ${font}`;
    const textWidth = ctx.measureText(message).width;

    // Set canvas size scaled by devicePixelRatio
    canvas.width = (textWidth + 20) * dpr;
    canvas.height = (fontSize + 20) * dpr;

    // Reset font and scale back the context so text renders properly
    ctx.scale(dpr, dpr);
    ctx.font = `${fontSize}px ${font}`;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    ctx.fillStyle = color;
    ctx.fillText(message, 10, fontSize);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16; // optional, improves quality when rotated
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const material = new THREE.SpriteMaterial({ map: texture, transparent: false});
    const sprite = new THREE.Sprite(material);

    sprite.scale.set(canvas.width / dpr * scale, canvas.height / dpr * scale, 1);
    return sprite;
}
