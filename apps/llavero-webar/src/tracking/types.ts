export interface TargetPose {
  readonly position: readonly [number, number, number];
  readonly quaternion: readonly [number, number, number, number];
  readonly confidence: number | null;
}

export interface TrackingResult {
  readonly visible: boolean;
  readonly pose: TargetPose | null;
}

export interface ImageTracker {
  start(): Promise<void>;
  update(): TrackingResult;
  stop(): void;
}
