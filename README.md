# Llavero Monorepo

## Aplicaciones

- `apps/llavero-webar`: prototipo WebAR con Three.js y MindAR Image Tracking.

## Desarrollo

```bash
cd apps/llavero-webar
npm install --ignore-scripts
npm run dev
```

## Build de la imagen

```bash
docker build -f apps/llavero-webar/Dockerfile apps/llavero-webar -t llavero-webar
docker run --rm -p 8080:80 llavero-webar
```
