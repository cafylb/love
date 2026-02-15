const canvas = document.getElementById("star-map");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;
const cx = W / 2;
const cy = H / 2;
const radius = W * 0.47;

// Tashkent, 15 Nov 2024 16:03 local (UTC+5 => 11:03 UTC).
const OBS_TIME_UTC = new Date(Date.UTC(2024, 10, 15, 11, 3, 0));
const OBS_LAT_DEG = 41.3111;
const OBS_LON_DEG = 69.2797;

const STARS = [
  { id: "polaris", ra: 2.5303, dec: 89.2641, mag: 2.0 },
  { id: "kochab", ra: 14.8451, dec: 74.1555, mag: 2.1 },
  { id: "pherkad", ra: 15.3455, dec: 71.8339, mag: 3.0 },
  { id: "caph", ra: 0.1529, dec: 59.1498, mag: 2.3 },
  { id: "schedar", ra: 0.6751, dec: 56.5373, mag: 2.2 },
  { id: "gammacas", ra: 0.9451, dec: 60.7167, mag: 2.4 },
  { id: "ruchbah", ra: 1.4303, dec: 60.2353, mag: 2.7 },
  { id: "segin", ra: 2.2937, dec: 63.6700, mag: 3.4 },
  { id: "alderamin", ra: 21.3097, dec: 62.5856, mag: 2.5 },
  { id: "alfirk", ra: 21.4777, dec: 70.5607, mag: 3.2 },
  { id: "errai", ra: 23.6558, dec: 77.6323, mag: 3.2 },
  { id: "dubhe", ra: 11.0621, dec: 61.7510, mag: 1.8 },
  { id: "merak", ra: 11.0307, dec: 56.3824, mag: 2.4 },
  { id: "phecda", ra: 11.8972, dec: 53.6948, mag: 2.4 },
  { id: "megrez", ra: 12.2570, dec: 57.0326, mag: 3.3 },
  { id: "alioth", ra: 12.9005, dec: 55.9598, mag: 1.8 },
  { id: "mizar", ra: 13.3987, dec: 54.9254, mag: 2.2 },
  { id: "alkaid", ra: 13.7923, dec: 49.3133, mag: 1.9 },
  { id: "alpheratz", ra: 0.1398, dec: 29.0904, mag: 2.1 },
  { id: "mirach", ra: 1.1622, dec: 35.6206, mag: 2.1 },
  { id: "almach", ra: 2.0650, dec: 42.3297, mag: 2.2 },
  { id: "markab", ra: 23.0794, dec: 15.2053, mag: 2.5 },
  { id: "scheat", ra: 23.0629, dec: 28.0824, mag: 2.4 },
  { id: "algenib", ra: 0.2206, dec: 15.1836, mag: 2.8 },
  { id: "enif", ra: 21.7364, dec: 9.8750, mag: 2.4 },
  { id: "mirfak", ra: 3.4054, dec: 49.8611, mag: 1.8 },
  { id: "algol", ra: 3.1361, dec: 40.9556, mag: 2.1 },
  { id: "capella", ra: 5.2782, dec: 45.9979, mag: 0.1 },
  { id: "aldebaran", ra: 4.5987, dec: 16.5093, mag: 0.9 },
  { id: "betelgeuse", ra: 5.9195, dec: 7.4071, mag: 0.4 },
  { id: "bellatrix", ra: 5.4189, dec: 6.3497, mag: 1.6 },
  { id: "rigel", ra: 5.2423, dec: -8.2016, mag: 0.1 },
  { id: "saiph", ra: 5.7959, dec: -9.6696, mag: 2.1 },
  { id: "alnitak", ra: 5.6793, dec: -1.9426, mag: 1.7 },
  { id: "alnilam", ra: 5.6036, dec: -1.2019, mag: 1.7 },
  { id: "mintaka", ra: 5.5334, dec: -0.2991, mag: 2.2 },
  { id: "sirius", ra: 6.7525, dec: -16.7161, mag: -1.5 },
  { id: "procyon", ra: 7.6550, dec: 5.2250, mag: 0.4 },
  { id: "pollux", ra: 7.7553, dec: 28.0262, mag: 1.1 },
  { id: "castor", ra: 7.5766, dec: 31.8883, mag: 1.6 },
  { id: "vega", ra: 18.6156, dec: 38.7837, mag: 0.0 },
  { id: "deneb", ra: 20.6905, dec: 45.2803, mag: 1.2 },
  { id: "sadr", ra: 20.3705, dec: 40.2567, mag: 2.2 },
  { id: "albireo", ra: 19.5120, dec: 27.9597, mag: 3.1 },
  { id: "altair", ra: 19.8464, dec: 8.8683, mag: 0.8 },
  { id: "tarazed", ra: 19.7700, dec: 10.6133, mag: 2.7 },
  { id: "arcturus", ra: 14.2610, dec: 19.1825, mag: -0.1 }
];

const CONSTELLATION_LINES = [
  ["caph", "schedar"], ["schedar", "gammacas"], ["gammacas", "ruchbah"], ["ruchbah", "segin"],
  ["dubhe", "merak"], ["merak", "phecda"], ["phecda", "megrez"], ["megrez", "dubhe"],
  ["megrez", "alioth"], ["alioth", "mizar"], ["mizar", "alkaid"],
  ["alpheratz", "mirach"], ["mirach", "almach"],
  ["markab", "scheat"], ["scheat", "alpheratz"], ["alpheratz", "algenib"], ["algenib", "markab"],
  ["betelgeuse", "bellatrix"], ["bellatrix", "mintaka"], ["mintaka", "alnilam"], ["alnilam", "alnitak"],
  ["alnitak", "saiph"], ["saiph", "rigel"], ["rigel", "mintaka"], ["betelgeuse", "alnitak"],
  ["castor", "pollux"],
  ["deneb", "sadr"], ["sadr", "albireo"],
  ["altair", "tarazed"],
  ["kochab", "pherkad"]
];

function mulberry32(seed) {
  let t = seed >>> 0;
  return function rand() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function normalizeDeg(deg) {
  let out = deg % 360;
  if (out < 0) out += 360;
  return out;
}

function julianDate(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

function localSiderealDeg(date, lonDeg) {
  const jd = julianDate(date);
  const t = (jd - 2451545.0) / 36525.0;
  const gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * t * t -
    (t * t * t) / 38710000.0;
  return normalizeDeg(gmst + lonDeg);
}

function equatorialToHorizontal(raHours, decDeg, latDeg, lstDeg) {
  const raDeg = raHours * 15;
  const hRad = degToRad(normalizeDeg(lstDeg - raDeg));
  const decRad = degToRad(decDeg);
  const latRad = degToRad(latDeg);

  const sinAlt =
    Math.sin(decRad) * Math.sin(latRad) +
    Math.cos(decRad) * Math.cos(latRad) * Math.cos(hRad);
  const altRad = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  const cosAlt = Math.max(1e-9, Math.cos(altRad));

  const sinAz = (-Math.cos(decRad) * Math.sin(hRad)) / cosAlt;
  const cosAz =
    (Math.sin(decRad) - Math.sin(altRad) * Math.sin(latRad)) /
    (cosAlt * Math.cos(latRad));

  let azRad = Math.atan2(sinAz, cosAz);
  if (azRad < 0) azRad += Math.PI * 2;

  return {
    altDeg: (altRad * 180) / Math.PI,
    azRad
  };
}

function horizonProject(altDeg, azRad) {
  // Zenith-centered polar projection.
  const r = ((90 - altDeg) / 90) * radius;
  return {
    x: Math.sin(azRad) * r,
    y: -Math.cos(azRad) * r
  };
}

function drawBase() {
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  ctx.translate(cx, cy);

  ctx.strokeStyle = "rgba(230, 242, 255, 0.9)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(200, 220, 255, 0.18)";
  const altitudeRings = [15, 30, 45, 60, 75];
  altitudeRings.forEach((alt) => {
    const r = ((90 - alt) / 90) * radius;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.strokeStyle = "rgba(200, 220, 255, 0.14)";
  for (let i = 0; i < 24; i += 1) {
    const a = (i / 24) * Math.PI * 2;
    const x2 = Math.sin(a) * radius;
    const y2 = -Math.cos(a) * radius;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

function drawSky() {
  const lst = localSiderealDeg(OBS_TIME_UTC, OBS_LON_DEG);
  const visible = new Map();

  STARS.forEach((star) => {
    const hor = equatorialToHorizontal(star.ra, star.dec, OBS_LAT_DEG, lst);
    if (hor.altDeg <= 0) return;
    const p = horizonProject(hor.altDeg, hor.azRad);
    visible.set(star.id, {
      ...star,
      ...hor,
      ...p
    });
  });

  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(194, 220, 255, 0.35)";
  CONSTELLATION_LINES.forEach(([a, b]) => {
    const s1 = visible.get(a);
    const s2 = visible.get(b);
    if (!s1 || !s2) return;
    ctx.beginPath();
    ctx.moveTo(s1.x, s1.y);
    ctx.lineTo(s2.x, s2.y);
    ctx.stroke();
  });

  visible.forEach((star) => {
    const size = Math.max(0.7, 3.8 - star.mag * 0.8);
    const alpha = Math.min(1, Math.max(0.25, 1 - (star.mag + 1.5) * 0.14));
    ctx.beginPath();
    ctx.fillStyle = `rgba(242, 248, 255, ${alpha})`;
    ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
    ctx.fill();
  });

  // Add dense faint background stars for a fuller sky look.
  const seed =
    OBS_TIME_UTC.getUTCFullYear() * 1000000 +
    (OBS_TIME_UTC.getUTCMonth() + 1) * 10000 +
    OBS_TIME_UTC.getUTCDate() * 100 +
    OBS_TIME_UTC.getUTCHours();
  const rand = mulberry32(seed);
  const faintCount = 1300;
  for (let i = 0; i < faintCount; i += 1) {
    const sinAlt = rand(); // 0..1 hemisphere
    const altDeg = (Math.asin(sinAlt) * 180) / Math.PI;
    const azRad = rand() * Math.PI * 2;
    const p = horizonProject(altDeg, azRad);

    const brightness = Math.pow(rand(), 0.36);
    const size = 0.3 + brightness * 1.35;
    const alpha = 0.16 + brightness * 0.56;

    ctx.beginPath();
    ctx.fillStyle = `rgba(242, 248, 255, ${alpha})`;
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
    ctx.fill();

    if (rand() > 0.992) {
      ctx.strokeStyle = `rgba(232, 241, 255, ${Math.min(0.66, alpha + 0.16)})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(p.x - 2.6, p.y);
      ctx.lineTo(p.x + 2.6, p.y);
      ctx.moveTo(p.x, p.y - 2.6);
      ctx.lineTo(p.x, p.y + 2.6);
      ctx.stroke();
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

  dirs.forEach((d) => ctx.fillText(d.label, d.x, d.y));
}

function render() {
  drawBase();
  drawSky();
  drawDirections();
  ctx.restore();
}

render();
