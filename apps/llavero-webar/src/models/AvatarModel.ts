import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import avatarUrl from '../../avatar.obj?url';

export class AvatarModel {
  public readonly root = new THREE.Group();
  private readonly model = new THREE.Group();

  public constructor() {
    this.root.add(this.model);
  }

  public async load(): Promise<void> {
    const loader = new OBJLoader();
    const object = await loader.loadAsync(avatarUrl);
    const bounds = new THREE.Box3().setFromObject(object);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const desiredHeight = 0.18;
    const scale = desiredHeight / size.y;

    object.position.set(-center.x, -bounds.min.y, -center.z);
    object.scale.setScalar(scale);
    object.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = false;
      child.receiveShadow = false;
    });

    this.model.add(object);
  }

  public dispose(): void {
    this.model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.geometry.dispose();
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => material.dispose());
    });
  }
}
