const canvas = document.getElementById("star-map");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;
const cx = W / 2;
const cy = H / 2;
const radius = W * 0.47;

function mulberry32(seed) {
  let t = seed >>> 0;
  return function rand() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function clear() {
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  ctx.translate(cx, cy);

  ctx.strokeStyle = "rgba(230, 242, 255, 0.9)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(200, 220, 255, 0.2)";
  for (let i = 1; i <= 8; i += 1) {
    ctx.beginPath();
    ctx.arc(0, 0, (radius / 8) * i, 0, Math.PI * 2);
    ctx.stroke();
  }

  for (let i = 0; i < 24; i += 1) {
    const a = (i / 24) * Math.PI * 2;
    const x1 = Math.cos(a) * (radius * 0.12);
    const y1 = Math.sin(a) * (radius * 0.12);
    const x2 = Math.cos(a) * radius;
    const y2 = Math.sin(a) * radius;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

function pointInCircle(rand) {
  const t = rand() * Math.PI * 2;
  const r = Math.sqrt(rand()) * radius * 0.97;
  return { x: Math.cos(t) * r, y: Math.sin(t) * r };
}

function drawStars() {
  const dateSeed = 202411151603;
  const rand = mulberry32(dateSeed);
  const stars = [];

  for (let i = 0; i < 1100; i += 1) {
    const p = pointInCircle(rand);
    const brightness = Math.pow(rand(), 0.3);
    const size = 0.25 + brightness * 2.2;

    ctx.beginPath();
    ctx.fillStyle = `rgba(242, 248, 255, ${0.12 + brightness * 0.85})`;
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
    ctx.fill();

    if (rand() > 0.92) {
      ctx.strokeStyle = `rgba(218, 237, 255, ${0.2 + brightness * 0.5})`;
      ctx.lineWidth = 0.65;
      ctx.beginPath();
      ctx.moveTo(p.x - 4, p.y);
      ctx.lineTo(p.x + 4, p.y);
      ctx.moveTo(p.x, p.y - 4);
      ctx.lineTo(p.x, p.y + 4);
      ctx.stroke();
    }

    if (brightness > 0.75) {
      stars.push({ ...p, b: brightness });
    }
  }

  ctx.lineWidth = 1.1;
  ctx.strokeStyle = "rgba(194, 220, 255, 0.34)";

  const constellationCount = 22;
  for (let i = 0; i < constellationCount; i += 1) {
    const start = Math.floor(rand() * stars.length);
    const chainLength = 3 + Math.floor(rand() * 6);
    let prev = stars[start];
    for (let j = 0; j < chainLength; j += 1) {
      const candidate = stars[Math.floor(rand() * stars.length)];
      const dx = candidate.x - prev.x;
      const dy = candidate.y - prev.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < radius * 0.24 && dist > 12) {
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(candidate.x, candidate.y);
        ctx.stroke();
        prev = candidate;
      }
    }
  }
}

function drawDirections() {
  ctx.fillStyle = "rgba(228, 239, 255, 0.92)";
  ctx.font = "600 18px Jura";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const dirs = [
    { label: "NORTH", x: 0, y: -radius - 24 },
    { label: "EAST", x: radius + 24, y: 0 },
    { label: "SOUTH", x: 0, y: radius + 24 },
    { label: "WEST", x: -radius - 24, y: 0 }
  ];

  dirs.forEach((d) => {
    ctx.fillText(d.label, d.x, d.y);
  });
}

function render() {
  clear();
  drawStars();
  drawDirections();
  ctx.restore();
}

render();
