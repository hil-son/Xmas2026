// Same snowfall as the cover: 70 flakes over a 393×852 stage, scaled to the game frame.
const STAGE_W = 393;
const STAGE_H = 852;

type Flake = { x: number; y: number; r: number; s: number; d: number; o: number };

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

export function startGameSnow(canvas: HTMLCanvasElement) {
  let alive = true;
  const flakes = makeFlakes();
  const ctx = canvas.getContext("2d");
  let lastTick = 0;
  let frame = 0;

  const fit = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  };

  const observer = new ResizeObserver(fit);
  observer.observe(canvas);
  fit();

  const tick = (now: number) => {
    if (!alive) return;
    if (!lastTick) lastTick = now;
    const dt = Math.min(0.05, (now - lastTick) / 1000);
    lastTick = now;

    if (ctx) {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const cssWidth = canvas.width / dpr;
      const cssHeight = canvas.height / dpr;
      const scaleX = cssWidth / STAGE_W;
      const scaleY = cssHeight / STAGE_H;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      flakes.forEach((flake) => {
        flake.y += flake.s * dt;
        flake.x += Math.sin((flake.y + flake.d) / 40) * 8 * dt;
        if (flake.y > STAGE_H + 8) {
          flake.y = -6;
          flake.x = Math.random() * STAGE_W;
        }
        ctx.globalAlpha = flake.o;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(flake.x * scaleX, flake.y * scaleY, flake.r * scaleX, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);

  return () => {
    alive = false;
    cancelAnimationFrame(frame);
    observer.disconnect();
  };
}
