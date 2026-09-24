declare module 'mind-ar/dist/mindar-image-three.prod.js' {
  import type * as THREE from 'three';

  export class MindARThree {
    public readonly renderer: THREE.WebGLRenderer;
    public readonly scene: THREE.Scene;
    public readonly camera: THREE.PerspectiveCamera;
    public imageTargetSrc: string;
    public constructor(options: Record<string, unknown>);
    public addAnchor(targetIndex: number): {
      group: THREE.Group;
      onTargetFound: (() => void) | null;
      onTargetLost: (() => void) | null;
    };
    public start(): Promise<void>;
    public stop(): void;
  }
}

declare module 'mind-ar/src/image-target/compiler.js' {
  export class Compiler {
    public compileImageTargets(images: HTMLImageElement[], progressCallback: (progress: number) => void): Promise<unknown>;
    public exportData(): Uint8Array;
  }
}
