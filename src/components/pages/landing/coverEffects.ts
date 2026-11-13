// Cover-only effects from Christmas Crush. The game screen is not included.
export const STAGE_W = 393;
export const STAGE_H = 852;

export type CoverFx = {
  snow: boolean;
  pump: boolean;
  blink: boolean;
  tail: boolean;
  pumpBurst: number;
  glitterTouch: boolean;
  stir: number;
};

type CoverNodes = {
  lights: HTMLElement;
  bulbClassName: string;
  snow: HTMLCanvasElement;
  globe: HTMLCanvasElement;
  pug: HTMLCanvasElement;
  pugImageUrl: string;
  coverImageUrl: string;
  fx: CoverFx;
};

const PUG_PAD_LEFT = 20;

type Flake = { x: number; y: number; r: number; s: number; d: number; o: number };

type Glitter = {
  x: number;
  y: number;
  z: number;
  vz: number;
  vx: number;
  vy: number;
  ang: number;
  spin: number;
  size: number;
  hue: number;
  sharp: number;
  phase: number;
  wander: number;
  wanderRate: number;
  settle: boolean;
  extra: boolean;
  home: number;
};

const COVER_BULBS: Array<[number, number, number, number]> = [
  [24, 230, 2.1, 58],
  [44, 362, 1.7, 50],
  [12, 342, 2.4, 44],
  [36, 378, 1.9, 42],
  [58, 316, 2.2, 38],
  [16, 200, 1.6, 36],
  [70, 250, 2.3, 34],
  [346, 196, 1.8, 48],
  [362, 270, 2.4, 52],
  [336, 322, 1.7, 44],
  [318, 396, 2.1, 40],
  [352, 348, 1.6, 38],
  [330, 230, 2.2, 36],
  [374, 210, 1.9, 32],
];

function mountLights(root: HTMLElement, bulbClassName: string) {
  root.replaceChildren();
  COVER_BULBS.forEach((bulb, index) => {
    const el = document.createElement("i");
    el.className = bulbClassName;
    el.style.left = `${bulb[0]}px`;
    el.style.top = `${bulb[1]}px`;
    el.style.setProperty("--dur", `${bulb[2]}s`);
    el.style.setProperty("--halo", `${bulb[3]}px`);
    el.style.setProperty("--delay", `${-index * 0.85}s`);
    root.appendChild(el);
  });
}

function makeFlakes(): Flake[] {
  return Array.from({ length: 70 }, () => ({
    x: Math.random() * STAGE_W,
    y: Math.random() * STAGE_H,
    r: Math.random() * 1.8 + 0.7,
    s: Math.random() * 28 + 16,
    d: Math.random() * 16 - 8,
    o: Math.random() * 0.45 + 0.35,
  }));
}

const GLOBE = 292;
const GLOBE_R = GLOBE / 2 - 1;
// The glass ends on a flat base, not the bottom of the circle. Stage y 386.
const GLOBE_FLOOR = 262;
const GLITTER_INK = ["rgb(255,255,255)", "rgb(255,228,170)", "rgb(198,255,214)"];

function glitterHalo(rgb: string) {
  const size = 32;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) return canvas;
  const radius = size / 2;
  const glow = context.createRadialGradient(radius, radius, 0, radius, radius, radius);
  glow.addColorStop(0, `rgba(${rgb},.95)`);
  glow.addColorStop(0.16, `rgba(${rgb},.35)`);
  glow.addColorStop(0.42, `rgba(${rgb},.05)`);
  glow.addColorStop(1, `rgba(${rgb},0)`);
  context.fillStyle = glow;
  context.beginPath();
  context.arc(radius, radius, radius, 0, Math.PI * 2);
  context.fill();
  return canvas;
}

function makeGlitter(extra: boolean): Glitter {
  const angle = Math.random() * Math.PI * 2;
  const dist = Math.sqrt(Math.random()) * GLOBE_R * 0.97;
  const hueRoll = Math.random();
  return {
    x: GLOBE / 2 + Math.cos(angle) * dist,
    y: GLOBE / 2 + Math.sin(angle) * dist,
    z: Math.random() * 2 - 1,
    vz: (Math.random() - 0.5) * 0.35,
    vx: (Math.random() - 0.5) * 10,
    vy: (Math.random() - 0.5) * 10,
    ang: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * (4 + Math.random() * 10),
    size: Math.random() < 0.84 ? 0.35 + Math.random() * 0.55 : 0.9 + Math.random() * 0.8,
    hue: hueRoll < 0.58 ? 0 : hueRoll < 0.84 ? 1 : 2,
    sharp: 3 + Math.random() * 7,
    phase: Math.random() * Math.PI * 2,
    wander: Math.random() * Math.PI * 2,
    wanderRate: 0.6 + Math.random() * 2.2,
    settle: Math.random() < 0.16,
    home: Math.sqrt(Math.random()) * GLOBE_R * 0.98,
    extra,
  };
}

function smoothStep(value: number) {
  const u = value < 0 ? 0 : value > 1 ? 1 : value;
  return u * u * (3 - 2 * u);
}

export function startCoverEffects({
  lights,
  bulbClassName,
  snow,
  globe,
  pug,
  pugImageUrl,
  coverImageUrl,
  fx,
}: CoverNodes) {
  let alive = true;
  mountLights(lights, bulbClassName);

  const flakes = makeFlakes();
  const snowCtx = snow.getContext("2d");

  const globeCtx = globe.getContext("2d");
  const globeDpr = Math.min(2, window.devicePixelRatio || 1);
  if (globeCtx) {
    globe.width = GLOBE * globeDpr;
    globe.height = GLOBE * globeDpr;
    globeCtx.setTransform(globeDpr, 0, 0, globeDpr, 0, 0);
  }
  const glitterHalos = [
    glitterHalo("255,255,255"),
    glitterHalo("255,220,150"),
    glitterHalo("190,255,210"),
  ];
  const glitter = [
    ...Array.from({ length: 520 }, () => makeGlitter(false)),
    ...Array.from({ length: 420 }, () => makeGlitter(true)),
  ];
  let globeTime = 0;

  const pugCtx = pug.getContext("2d");
  let pugSrc: Uint8ClampedArray | null = null;
  let pugW = 0;
  let pugH = 0;
  let pugOut: ImageData | null = null;
  let pugTime = 0;
  let pugPlate: HTMLCanvasElement | null = null;
  const pugImage = new Image();
  const coverImage = new Image();
  let pugReady = false;
  let coverReady = false;

  const composePug = () => {
    if (!alive || !pugCtx || !pugReady || !coverReady) return;
    pugW = pugImage.width + PUG_PAD_LEFT;
    pugH = pugImage.height;
    pug.width = pugW;
    pug.height = pugH;
    const scratch = document.createElement("canvas");
    scratch.width = pugW;
    scratch.height = pugH;
    const scratchCtx = scratch.getContext("2d");
    if (!scratchCtx) return;
    const srcX = (212 - PUG_PAD_LEFT) * (coverImage.width / STAGE_W);
    const srcY = 240 * (coverImage.height / STAGE_H);
    const srcW = PUG_PAD_LEFT * (coverImage.width / STAGE_W);
    const srcH = pugImage.height * (coverImage.height / STAGE_H);
    scratchCtx.drawImage(coverImage, srcX, srcY, srcW, srcH, 0, 0, PUG_PAD_LEFT, pugH);
    const strip = scratchCtx.getImageData(0, 0, PUG_PAD_LEFT, pugH);
    for (let i = 0; i < strip.data.length; i += 4) {
      const lum = (strip.data[i] + strip.data[i + 1] + strip.data[i + 2]) / 3;
      if (lum > 150) strip.data[i + 3] = 0;
    }
    scratchCtx.putImageData(strip, 0, 0);
    scratchCtx.drawImage(pugImage, PUG_PAD_LEFT, 0);
    pugPlate = scratch;
    pugSrc = scratchCtx.getImageData(0, 0, pugW, pugH).data;
    pugOut = pugCtx.createImageData(pugW, pugH);
  };

  pugImage.onload = () => {
    pugReady = true;
    composePug();
  };
  coverImage.onload = () => {
    coverReady = true;
    composePug();
  };
  pugImage.src = pugImageUrl;
  coverImage.src = coverImageUrl;

  const samplePug = (x: number, y: number) => {
    if (!pugSrc || x < 0 || y < 0 || x >= pugW - 1 || y >= pugH - 1) return [0, 0, 0, 0];
    const xi = x | 0;
    const yi = y | 0;
    const fx = x - xi;
    const fy = y - yi;
    const i00 = (yi * pugW + xi) * 4;
    const i10 = i00 + 4;
    const i01 = i00 + pugW * 4;
    const i11 = i01 + 4;
    const out = [0, 0, 0, 0];
    for (let channel = 0; channel < 4; channel += 1) {
      const a = pugSrc[i00 + channel] * (1 - fx) + pugSrc[i10 + channel] * fx;
      const b = pugSrc[i01 + channel] * (1 - fx) + pugSrc[i11 + channel] * fx;
      out[channel] = a * (1 - fy) + b * fy;
    }
    return out;
  };

  const stepSnow = (dt: number) => {
    if (!snowCtx) return;
    snowCtx.clearRect(0, 0, STAGE_W, STAGE_H);
    if (!fx.snow) return;
    flakes.forEach((flake) => {
      flake.y += flake.s * dt;
      flake.x += Math.sin((flake.y + flake.d) / 40) * 8 * dt;
      if (flake.y > STAGE_H + 8) {
        flake.y = -6;
        flake.x = Math.random() * STAGE_W;
      }
      snowCtx.globalAlpha = flake.o;
      snowCtx.fillStyle = "#fff";
      snowCtx.beginPath();
      snowCtx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
      snowCtx.fill();
    });
    snowCtx.globalAlpha = 1;
  };

  const stepGlobe = (dt: number) => {
    if (!globeCtx) return;
    globeTime += dt;
    if (fx.pumpBurst > 0) fx.pumpBurst = Math.max(0, fx.pumpBurst - dt);
    if (!fx.glitterTouch) fx.stir = 0;
    else if (fx.stir > 0) fx.stir = Math.max(0, fx.stir - dt / 4);
    const pump = fx.pump ? 1 : 0;
    const burst = fx.pumpBurst > 0 ? fx.pumpBurst / 1.8 : 0;
    const stir = fx.stir > 0 ? 0.5 - 0.5 * Math.cos(Math.PI * fx.stir) : 0;
    const speed = 1 + stir * 3;
    const cx = GLOBE / 2;
    const cy = GLOBE / 2 + 8;
    const swirl = (5 + pump * 22 + burst * 48) * (0.7 + 0.3 * Math.sin(globeTime * 0.37));
    const swirlSign = Math.sin(globeTime * 0.13 + burst * 2) >= 0 ? 1 : -1;
    const jitter = 9 + pump * 14 + burst * 20;
    globeCtx.clearRect(0, 0, GLOBE, GLOBE);
    globeCtx.save();
    globeCtx.beginPath();
    globeCtx.arc(GLOBE / 2, GLOBE / 2, GLOBE_R, 0, Math.PI * 2);
    globeCtx.clip();
    globeCtx.beginPath();
    globeCtx.rect(0, 0, GLOBE, GLOBE_FLOOR);
    globeCtx.clip();
    globeCtx.lineCap = "round";
    for (let i = 0; i < glitter.length; i += 1) {
      const particle = glitter[i];
      if (particle.extra && !pump) continue;
      const dx = particle.x - cx;
      const dy = particle.y - cy;
      const radius = Math.hypot(dx, dy) || 1;
      const tx = -dy / radius;
      const ty = dx / radius;
      particle.wander +=
        (Math.sin(globeTime * particle.wanderRate + particle.phase) + (Math.random() - 0.5) * 1.4) *
        dt *
        2.2 *
        speed;
      const sink = particle.settle ? 10 : 1;
      const radial = (particle.home - radius) * 2.4;
      const wantX = tx * swirl * swirlSign * 0.45 + Math.cos(particle.wander) * jitter + (dx / radius) * radial;
      const wantY =
        ty * swirl * swirlSign * 0.45 +
        Math.sin(particle.wander * 1.17 + particle.phase) * jitter +
        sink -
        burst * 40 +
        (dy / radius) * radial;
      const follow = Math.min(1, dt * (1.3 + burst));
      particle.vx += (wantX - particle.vx) * follow;
      particle.vy += (wantY - particle.vy) * follow;
      particle.x += particle.vx * dt * speed;
      particle.y += particle.vy * dt * speed;
      particle.z += particle.vz * dt;
      if (particle.z > 1 || particle.z < -1) particle.vz *= -1;
      particle.ang += particle.spin * dt * (1 + pump * 1.8 + burst * 2.4) * speed;
      const ddx = particle.x - GLOBE / 2;
      const ddy = particle.y - GLOBE / 2;
      const rr = Math.hypot(ddx, ddy);
      if (rr > GLOBE_R - 0.5) {
        const nx = ddx / rr;
        const ny = ddy / rr;
        particle.x = GLOBE / 2 + nx * (GLOBE_R - 1);
        particle.y = GLOBE / 2 + ny * (GLOBE_R - 1);
        const vn = particle.vx * nx + particle.vy * ny;
        if (vn > 0) {
          particle.vx -= vn * nx * 1.6;
          particle.vy -= vn * ny * 1.6;
        }
      }
      if (particle.y > GLOBE_FLOOR - 1) {
        const limit = GLOBE_FLOOR - 1;
        particle.y = limit - (particle.y - limit);
        if (particle.vy > 0) particle.vy *= -0.5;
      }
      const floorFade = particle.y > GLOBE_FLOOR - 16 ? Math.max(0, (GLOBE_FLOOR - particle.y) / 16) : 1;
      if (floorFade <= 0.02) continue;
      const depth = 0.5 + 0.5 * (particle.z * 0.5 + 0.5);
      const facing = Math.cos(particle.ang - 0.7);
      const power = particle.sharp * (pump ? 0.7 : 1);
      const glint = Math.min(
        1,
        Math.pow(Math.max(0, facing), power) + Math.pow(Math.max(0, -facing), power * 0.75) * 0.45
      );
      const speck = Math.max(0.6, particle.size * depth * 1.15);
      globeCtx.globalAlpha = (0.16 + glint * 0.2) * (0.45 + depth * 0.55) * floorFade;
      globeCtx.fillStyle = GLITTER_INK[particle.hue];
      globeCtx.fillRect(particle.x - speck / 2, particle.y - speck / 2, speck, speck);
      if (glint > 0.18) {
        const len = 0.7 + glint * particle.size * 2.8 * depth;
        const c = Math.cos(particle.ang);
        const s = Math.sin(particle.ang);
        globeCtx.globalAlpha = Math.min(1, 0.2 + glint * 0.85) * floorFade;
        globeCtx.strokeStyle = glint > 0.82 ? "#fff" : GLITTER_INK[particle.hue];
        globeCtx.lineWidth = 0.45 + glint * 0.45;
        globeCtx.beginPath();
        globeCtx.moveTo(particle.x - c * len, particle.y - s * len);
        globeCtx.lineTo(particle.x + c * len, particle.y + s * len);
        globeCtx.stroke();
        globeCtx.globalAlpha = Math.min(1, glint) * floorFade;
        globeCtx.fillStyle = glint > 0.75 ? "#fff" : GLITTER_INK[particle.hue];
        const core = 0.7 + glint * 1.05;
        globeCtx.fillRect(particle.x - core / 2, particle.y - core / 2, core, core);
      }
      if (glint > 0.78) {
        const halo = 1.6 + glint * 2.4;
        globeCtx.globalAlpha = (glint - 0.55) * 0.7 * floorFade;
        globeCtx.drawImage(glitterHalos[particle.hue], particle.x - halo, particle.y - halo, halo * 2, halo * 2);
      }
    }
    globeCtx.restore();
    globeCtx.globalAlpha = 1;
  };

  let dogStill = false;
  const blinkClock = { phase: -1, wait: 0.4 + Math.random() * 0.6 };
  const blinkEyes = [
    { x: 6 + PUG_PAD_LEFT, y: 46, rx: 6.8, ry: 5.2 },
    { x: 43 + PUG_PAD_LEFT, y: 46, rx: 7, ry: 5.2 },
  ];

  const eyeBlink = (dt: number) => {
    if (!fx.blink) {
      blinkClock.phase = -1;
      return 0;
    }
    if (blinkClock.phase < 0) {
      blinkClock.wait -= dt;
      if (blinkClock.wait > 0) return 0;
      blinkClock.phase = 0;
    }
    blinkClock.phase += dt;
    const duration = 0.46;
    if (blinkClock.phase >= duration) {
      blinkClock.phase = -1;
      blinkClock.wait = 0.7 + Math.random() * 1.4;
      return 0;
    }
    const u = blinkClock.phase / duration;
    if (u < 0.28) return smoothStep(u / 0.28);
    if (u < 0.58) return 1;
    return 1 - smoothStep((u - 0.58) / 0.42);
  };

  const stepPug = (dt: number) => {
    if (!pugCtx || !pugSrc || !pugOut) return;
    if (!(fx.tail || fx.blink)) {
      if (!dogStill && pugW) {
        pugCtx.clearRect(0, 0, pugW, pugH);
        if (pugPlate) pugCtx.drawImage(pugPlate, 0, 0);
        dogStill = true;
      }
      return;
    }
    dogStill = false;
    pugTime += dt;
    const t = pugTime;
    const blink = eyeBlink(dt);
    const wag = fx.tail ? Math.sin(t * 2.1 * Math.PI * 2) * 2.1 : 0;
    const data = pugOut.data;
    data.fill(0);
    for (let y = 0; y < pugH; y += 1) {
      const tailY = y + 20;
      const inRear = tailY > 70 && tailY < 110;
      const rear = inRear ? Math.sin(((tailY - 70) / 40) * Math.PI) : 0;
      for (let x = 0; x < pugW; x += 1) {
        let sx = x;
        let sy = y;
        if (blink > 0.01) {
          for (let eyeIndex = 0; eyeIndex < blinkEyes.length; eyeIndex += 1) {
            const eye = blinkEyes[eyeIndex];
            const nx = (x - eye.x) / eye.rx;
            const ny = (y - eye.y) / eye.ry;
            const r2 = nx * nx + ny * ny;
            if (r2 >= 1) continue;
            const edge = Math.pow(1 - r2, 0.7);
            const lid = eye.y - eye.ry * 0.35;
            const below = sy - lid;
            if (below > 0) sy -= below * blink * edge * 0.8;
          }
        }
        if (wag && rear) {
          const side = smoothStep((x - (74 + PUG_PAD_LEFT)) / 16);
          sx -= wag * side * rear;
        }
        const pixel = samplePug(sx, sy);
        const offset = (y * pugW + x) * 4;
        data[offset] = pixel[0];
        data[offset + 1] = pixel[1];
        data[offset + 2] = pixel[2];
        data[offset + 3] = pixel[3];
      }
    }
    pugCtx.putImageData(pugOut, 0, 0);
  };

  let lastTick = 0;
  let frame = 0;
  const tick = (now: number) => {
    if (!alive) return;
    if (!lastTick) lastTick = now;
    const dt = Math.min(0.05, (now - lastTick) / 1000);
    lastTick = now;
    stepSnow(dt);
    stepGlobe(dt);
    stepPug(dt);
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);

  return () => {
    alive = false;
    cancelAnimationFrame(frame);
    lights.replaceChildren();
  };
}
