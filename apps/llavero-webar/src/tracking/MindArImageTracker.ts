import * as THREE from 'three';
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';
import targetDataUrl from '../../targets.mind?url';
import type { ImageTracker, TrackingResult } from './types';

export class MindArImageTracker implements ImageTracker {
  private readonly mindar: MindARThree;
  private readonly position = new THREE.Vector3();
  private readonly quaternion = new THREE.Quaternion();
  private readonly scale = new THREE.Vector3();
  private anchor: ReturnType<MindARThree['addAnchor']> | null = null;
  private visible = false;

  public constructor(container: HTMLElement) {
    this.mindar = new MindARThree({
      container,
      imageTargetSrc: targetDataUrl,
      uiLoading: 'no',
      uiScanning: 'no',
      uiError: 'no',
      filterMinCF: 0.0001,
      filterBeta: 10,
      warmupTolerance: 5,
      missTolerance: 5,
    });

    this.mindar.scene.add(new THREE.HemisphereLight(0xffffff, 0x243040, 2.2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(1, 2, 2);
    this.mindar.scene.add(keyLight);
  }

  public async start(): Promise<void> {
    this.anchor = this.mindar.addAnchor(0);
    this.anchor.onTargetFound = () => { this.visible = true; };
    this.anchor.onTargetLost = () => { this.visible = false; };
    await this.mindar.start();
  }

  public attach(content: THREE.Object3D): void {
    if (!this.anchor) throw new Error('El tracker debe iniciarse antes de anclar contenido.');
    this.anchor.group.add(content);
  }

  public update(): TrackingResult {
    if (!this.anchor || !this.visible) return { visible: false, pose: null };

    this.anchor.group.matrix.decompose(this.position, this.quaternion, this.scale);
    return {
      visible: true,
      pose: {
        position: [this.position.x, this.position.y, this.position.z],
        quaternion: [this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w],
        confidence: Number.NaN,
      },
    };
  }

  public render(): void {
    this.mindar.renderer.render(this.mindar.scene, this.mindar.camera);
  }

  public stop(): void {
    this.mindar.stop();
  }
}
