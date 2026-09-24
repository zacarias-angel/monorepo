import * as THREE from 'three';
import { AvatarModel } from '../models/AvatarModel';
import type { TrackingResult } from '../tracking/types';

export class ARScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  private readonly content = new THREE.Group();
  private readonly cube: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
  private readonly avatar = new AvatarModel();

  public constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x243040, 2.5));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(1, 2, 2);
    this.scene.add(keyLight);

    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.18, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x54e0c4, roughness: 0.35, metalness: 0.1 }),
    );
    this.content.add(this.cube);
    this.avatar.root.visible = false;
    this.content.add(this.avatar.root);
    this.scene.add(this.content);

    // Cubo de comprobacion centrado ante la camara hasta recibir una pose real.
    this.content.position.set(0, 0, -0.65);
  }

  public resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  public async loadAvatar(): Promise<void> {
    await this.avatar.load();
    this.cube.visible = false;
    this.avatar.root.visible = true;
  }

  public render(tracking: TrackingResult, elapsedSeconds: number): void {
    if (tracking.pose) {
      this.content.position.fromArray(tracking.pose.position);
      this.content.quaternion.fromArray(tracking.pose.quaternion);
    }

    this.cube.rotation.y = elapsedSeconds * 0.55;
    this.cube.rotation.x = elapsedSeconds * 0.2;
    this.renderer.render(this.scene, this.camera);
  }

  public dispose(): void {
    this.cube.geometry.dispose();
    this.cube.material.dispose();
    this.avatar.dispose();
    this.renderer.dispose();
  }
}
