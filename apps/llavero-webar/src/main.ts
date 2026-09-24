import './style.css';
import { AvatarModel } from './models/AvatarModel';
import { MindArImageTracker } from './tracking/MindArImageTracker';
import { DebugPanel } from './ui/DebugPanel';

const app = requireElement<HTMLElement>('app');
const tracker = new MindArImageTracker(app);
const avatar = new AvatarModel();
const debug = new DebugPanel();

let animationFrameId = 0;

function requireElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`No se encontro el elemento #${id}.`);
  return element as T;
}

function resize(): void {
  // MindAR ajusta video, canvas y proyeccion con su propio listener de resize.
}

function render(): void {
  const tracking = tracker.update();
  tracker.render();
  debug.update(tracking);
  animationFrameId = requestAnimationFrame(render);
}

async function startExperience(): Promise<void> {
  debug.setStatus('Preparando target MindAR...');

  try {
    await avatar.load();
    await tracker.start();
    tracker.attach(avatar.root);
    debug.setStatus('Apunta la camara a track.webp impreso.');
  } catch (error) {
    console.error('No fue posible iniciar MindAR.', error);
    debug.setStatus(`No se pudo iniciar MindAR: ${getErrorName(error)}.`);
  }
}

function getErrorName(error: unknown): string {
  return error instanceof Error ? error.name : 'error desconocido';
}

function stopExperience(): void {
  cancelAnimationFrame(animationFrameId);
  tracker.stop();
  avatar.dispose();
}

resize();
window.addEventListener('resize', resize, { passive: true });
window.addEventListener('pagehide', stopExperience, { once: true });
animationFrameId = requestAnimationFrame(render);
void startExperience();
