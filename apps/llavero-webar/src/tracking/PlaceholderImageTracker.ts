import type { ImageTracker, TrackingResult } from './types';

/**
 * Punto de sustitucion para el tracker real. No inventa una pose ni afirma que
 * el target fue detectado antes de disponer de un sistema de image tracking.
 */
export class PlaceholderImageTracker implements ImageTracker {
  public async start(): Promise<void> {}

  public update(): TrackingResult {
    return { visible: false, pose: null };
  }

  public stop(): void {}
}
