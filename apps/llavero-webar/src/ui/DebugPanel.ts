import type { TrackingResult } from '../tracking/types';

export class DebugPanel {
  private readonly status = this.requireElement('status');
  private readonly trackingStatus = this.requireElement('tracking-status');
  private readonly fps = this.requireElement('fps');
  private readonly targetVisible = this.requireElement('target-visible');
  private readonly confidence = this.requireElement('confidence');
  private frameCount = 0;
  private lastFpsSample = performance.now();

  public setStatus(message: string): void {
    this.status.textContent = message;
  }

  public update(tracking: TrackingResult): void {
    this.frameCount += 1;
    const now = performance.now();
    const elapsed = now - this.lastFpsSample;
    if (elapsed >= 500) {
      this.fps.textContent = String(Math.round((this.frameCount * 1000) / elapsed));
      this.frameCount = 0;
      this.lastFpsSample = now;
    }

    this.trackingStatus.textContent = tracking.visible ? 'DETECTADO' : 'PREPARADO';
    this.targetVisible.textContent = tracking.visible ? 'SI' : 'NO';
    this.confidence.textContent = tracking.pose?.confidence?.toFixed(2) ?? '--';
  }

  private requireElement(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) throw new Error(`No se encontro el elemento #${id}.`);
    return element;
  }
}
