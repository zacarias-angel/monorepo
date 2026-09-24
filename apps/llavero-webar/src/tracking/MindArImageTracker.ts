import * as THREE from 'three';
import { Compiler } from 'mind-ar/src/image-target/compiler.js';
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';
import targetImageUrl from '../../track.webp?url';
import type { ImageTracker, TrackingResult } from './types';

export class MindArImageTracker implements ImageTracker {
  private readonly mindar: MindARThree;
  private readonly position = new THREE.Vector3();
  private readonly quaternion = new THREE.Quaternion();
  private readonly scale = new THREE.Vector3();
  private anchor: ReturnType<MindARThree['addAnchor']> | null = null;
  private targetUrl: string | null = null;
  private visible = false;

  public constructor(container: HTMLElement) {
    this.mindar = new MindARThree({
      container,
      imageTargetSrc: '',
      uiLoading: 'no',
      uiScanning: 'no',
      uiError: 'no',
      filterMinCF: 0.001,
      filterBeta: 1000,
      warmupTolerance: 5,
      missTolerance: 5,
    });
  }

  public async start(): Promise<void> {
    this.mindar.imageTargetSrc = await this.compileTarget();
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
    if (this.targetUrl) URL.revokeObjectURL(this.targetUrl);
    this.targetUrl = null;
  }

  private async compileTarget(): Promise<string> {
    const image = await loadImage(targetImageUrl);
    const compiler = new Compiler();
    await compiler.compileImageTargets([image], () => undefined);
    const data = compiler.exportData();
    const binary = new Uint8Array(data.byteLength);
    binary.set(data);
    this.targetUrl = URL.createObjectURL(new Blob([binary.buffer], { type: 'application/octet-stream' }));
    return this.targetUrl;
  }
}

async function loadImage(url: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = url;
  await image.decode();
  return image;
}
