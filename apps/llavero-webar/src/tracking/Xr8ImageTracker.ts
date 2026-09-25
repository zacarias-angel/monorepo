import * as THREE from 'three';
import targetData from '../../assets/image-targets/roblox-avatar.json';

export class Xr8ImageTracker {
  private readonly anchor = new THREE.Group();
  private started = false;

  public async start(): Promise<void> {
    await waitForXr8();
    window.THREE = THREE;
    XR8.XrController.configure({ imageTargetData: [targetData] });

    XR8.addCameraPipelineModules([
      XR8.GlTextureRenderer.pipelineModule(),
      XR8.Threejs.pipelineModule(),
      XR8.XrController.pipelineModule(),
      {
        name: 'llavero-xr8-scene',
        onStart: () => {
          const { scene } = XR8.Threejs.xrScene();
          scene.add(new THREE.HemisphereLight(0xffffff, 0x26303b, 2.2));
          const light = new THREE.DirectionalLight(0xffffff, 1.8);
          light.position.set(1, 2, 2);
          scene.add(light, this.anchor);
        },
      },
    ]);

    window.addEventListener('reality.imagefound', this.onFound as EventListener);
    window.addEventListener('reality.imageupdated', this.onUpdated as EventListener);
    window.addEventListener('reality.imagelost', this.onLost as EventListener);
    const canvas = document.createElement('canvas');
    canvas.id = 'camerafeed';
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '0';
    document.body.appendChild(canvas);
    XR8.run({ canvas, allowedDevices: XR8.XrConfig.device().ANY });
    this.started = true;
  }

  public attach(content: THREE.Object3D): void { this.anchor.add(content); }
  public stop(): void { if (this.started) XR8.stop(); }

  private onFound = (event: CustomEvent): void => { this.applyPose(event.detail); this.anchor.visible = true; };
  private onUpdated = (event: CustomEvent): void => this.applyPose(event.detail);
  private onLost = (): void => { this.anchor.visible = false; };
  private applyPose(detail: { position?: THREE.Vector3; rotation?: THREE.Euler; scale?: number }): void {
    if (detail.position) this.anchor.position.copy(detail.position);
    if (detail.rotation) this.anchor.rotation.copy(detail.rotation);
    if (detail.scale) this.anchor.scale.setScalar(detail.scale);
  }
}

function waitForXr8(): Promise<void> {
  if (window.XR8) return Promise.resolve();
  return new Promise((resolve) => window.addEventListener('xrloaded', () => resolve(), { once: true }));
}
