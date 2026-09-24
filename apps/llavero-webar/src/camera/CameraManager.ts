export class CameraManager {
  private stream: MediaStream | null = null;

  public constructor(private readonly video: HTMLVideoElement) {}

  public async start(): Promise<void> {
    this.stop();

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
    });

    this.video.srcObject = this.stream;
    await this.video.play();
  }

  public stop(): void {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.video.srcObject = null;
  }
}
