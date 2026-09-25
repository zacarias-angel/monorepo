import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const input = fileURLToPath(new URL('../track.webp', import.meta.url));
const output = fileURLToPath(new URL('../assets/marker/roblox-avatar-marker.png', import.meta.url));

const svg = `
<svg width="720" height="960" viewBox="0 0 720 960" xmlns="http://www.w3.org/2000/svg">
  <rect width="720" height="960" fill="#f7f1e8"/>
  <rect x="18" y="18" width="684" height="924" rx="22" fill="none" stroke="#151515" stroke-width="18"/>
  <rect x="42" y="42" width="636" height="876" rx="12" fill="none" stroke="#e52421" stroke-width="8"/>
  <text x="360" y="142" text-anchor="middle" fill="#151515" font-family="Arial Black, Arial, sans-serif" font-size="86" letter-spacing="-5">ROBLOX</text>
  <text x="360" y="184" text-anchor="middle" fill="#e52421" font-family="Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="7">AVATAR EDITION</text>

  <rect x="110" y="260" width="500" height="500" rx="24" fill="#151515"/>
  <rect x="126" y="276" width="468" height="468" rx="15" fill="#e52421"/>
  <rect x="142" y="292" width="436" height="436" rx="8" fill="#ffffff"/>

  <g fill="#151515">
    <path d="M76 248h42v42H76zM602 248h42v42h-42zM76 730h42v42H76zM602 730h42v42h-42z"/>
    <path d="M76 308h24v24H76zM620 308h24v24h-24zM76 670h24v24H76zM620 670h24v24h-24z"/>
  </g>
  <g fill="#e52421">
    <path d="M86 358l32 18-32 18zM634 358l-32 18 32 18zM86 606l32-18-32-18zM634 606l-32-18 32-18z"/>
  </g>
  <g fill="#151515">
    <circle cx="92" cy="430" r="10"/><circle cx="92" cy="470" r="10"/><circle cx="92" cy="510" r="10"/>
    <circle cx="628" cy="430" r="10"/><circle cx="628" cy="470" r="10"/><circle cx="628" cy="510" r="10"/>
  </g>

  <line x1="92" y1="812" x2="628" y2="812" stroke="#151515" stroke-width="6"/>
  <text x="360" y="862" text-anchor="middle" fill="#151515" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="3">SCAN TO BRING ME TO LIFE</text>
  <text x="360" y="894" text-anchor="middle" fill="#e52421" font-family="Arial, sans-serif" font-size="15" letter-spacing="4">LLAVERO WEBAR</text>
</svg>`;

const avatar = await sharp(input)
  .resize(416, 416, { fit: 'cover' })
  .png()
  .toBuffer();

await sharp(Buffer.from(svg))
  .composite([{ input: avatar, left: 152, top: 302 }])
  .png()
  .toFile(output);

console.log(`Marker created: ${output}`);
