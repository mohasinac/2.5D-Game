import * as THREE from 'three';

export class SandboxSprites {
  static addAxisLabel(
    scene: THREE.Scene,
    text: string,
    pos: THREE.Vector3,
    color: string,
    textures: THREE.Texture[],
  ): void {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    ctx.font = 'bold 48px Orbitron, monospace';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 32, 32);

    const tex = new THREE.CanvasTexture(canvas);
    textures.push(tex);
    const mat = new THREE.SpriteMaterial({ map: tex, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.position.copy(pos);
    sprite.scale.set(1, 1, 1);
    scene.add(sprite);
  }

  static setLastSpriteScale(scene: THREE.Scene, s: number): void {
    const children = scene.children;
    for (let i = children.length - 1; i >= 0; i--) {
      if (children[i] instanceof THREE.Sprite) {
        children[i].scale.set(s, s, s);
        break;
      }
    }
  }

  static addTickSprite(
    scene: THREE.Scene,
    text: string,
    pos: THREE.Vector3,
    axis: 'x' | 'z' | 'o',
    gridSize: number,
    textures: THREE.Texture[],
  ): void {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    ctx.font = 'bold 26px Orbitron, monospace';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = axis === 'x' ? 'rgba(255,120,100,0.85)'
                  : axis === 'z' ? 'rgba(100,180,255,0.85)'
                  : 'rgba(220,230,255,0.7)';
    ctx.fillText(text, 64, 32);

    const tex = new THREE.CanvasTexture(canvas);
    textures.push(tex);
    const mat = new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.position.copy(pos);

    const sw = gridSize * 0.05;
    sprite.scale.set(sw, sw * 0.5, 1);
    scene.add(sprite);
  }

  static addGridTicks(
    scene: THREE.Scene,
    interval: number,
    range: number,
    offset: number,
    gridSize: number,
    textures: THREE.Texture[],
  ): void {
    for (let v = -range; v <= range; v += interval) {
      if (v === 0) continue;
      SandboxSprites.addTickSprite(scene, String(v), new THREE.Vector3(v,      0, offset), 'x', gridSize, textures);
      SandboxSprites.addTickSprite(scene, String(v), new THREE.Vector3(offset, 0, v),      'z', gridSize, textures);
    }
    SandboxSprites.addTickSprite(scene, '0', new THREE.Vector3(offset, 0, offset), 'o', gridSize, textures);
  }
}
