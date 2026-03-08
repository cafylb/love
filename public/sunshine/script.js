const canvas = document.getElementById("flow");
const ctx = canvas.getContext("2d");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const lines = Array.from({ length: 8 }, (_, index) => ({
  baseRatio: 0.12 + (index / 7) * 0.8,
  amplitude: 22 + Math.random() * 84,
  frequency: 0.55 + Math.random() * 1.1,
  phase: Math.random() * Math.PI * 2,
  speed: 0.45 + Math.random() * 1.25,
  tilt: -0.33 + Math.random() * 0.66,
  alpha: 0.08 + Math.random() * 0.14
}));

let width = 0;
let height = 0;
let dpr = 1;
let rafId = 0;

function getY(progress, line, time) {
  const waveA = Math.sin(progress * Math.PI * 2 * line.frequency + time * 0.00024 * line.speed + line.phase);
  const waveB = Math.cos(progress * Math.PI * 4.4 + time * 0.00016 + line.phase * 0.74);
  const baseline = height * line.baseRatio;
  return baseline + waveA * line.amplitude + waveB * (line.amplitude * 0.36) + (progress - 0.5) * height * line.tilt;
}

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function draw(time) {
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 1;

  lines.forEach((line) => {
    const pointsCount = 10;
    ctx.beginPath();

    for (let pointIndex = 0; pointIndex <= pointsCount; pointIndex += 1) {
      const progress = pointIndex / pointsCount;
      const x = progress * width;
      const y = getY(progress, line, time);

      if (pointIndex === 0) {
        ctx.moveTo(x, y);
      } else {
        const prevProgress = (pointIndex - 1) / pointsCount;
        const prevX = prevProgress * width;
        const prevY = getY(prevProgress, line, time);
        const cpX = (prevX + x) * 0.5;
        ctx.quadraticCurveTo(cpX, prevY, x, y);
      }
    }

    ctx.strokeStyle = `rgba(166, 179, 205, ${line.alpha})`;
    ctx.stroke();
  });
}

function animate(time) {
  draw(time);
  rafId = window.requestAnimationFrame(animate);
}

resize();

if (prefersReducedMotion) {
  draw(0);
} else {
  rafId = window.requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  resize();
  if (prefersReducedMotion) {
    draw(0);
  }
});

window.addEventListener("beforeunload", () => {
  if (rafId) {
    window.cancelAnimationFrame(rafId);
  }
});
