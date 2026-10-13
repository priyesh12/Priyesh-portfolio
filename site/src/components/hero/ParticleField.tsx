'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const FORMATIONS = [
  { id: 'surface', label: 'Implied-vol surface', meta: 'raw SVI · skew × term' },
  { id: 'lattice', label: 'Neural lattice', meta: '6 layers · 58 units' },
  { id: 'latent', label: 'Latent space', meta: 'embeddings · 7 clusters' },
  { id: 'price', label: 'Price path', meta: 'GBM walk · candles · volume' },
] as const;

type Props = {
  theme: 'dark' | 'light';
  onFormation?: (i: number) => void;
  onStats?: (s: { fps: number; x: number; y: number }) => void;
  jumpRef?: React.MutableRefObject<((i: number) => void) | null>;
};

/* ───────────── deterministic shape generators ───────────── */

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(r: () => number) {
  const u = Math.max(1e-9, r());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
}

function volSurface(n: number) {
  const out = new Float32Array(n * 3);
  const r = mulberry32(11);
  const cols = Math.ceil(Math.sqrt(n * 1.3));
  const rows = Math.ceil(n / cols);
  for (let i = 0; i < n; i++) {
    const u = ((i % cols) / (cols - 1)) * 2 - 1;
    const v = Math.floor(i / cols) / (rows - 1);
    const k = u * 1.4;
    const T = 0.05 + v;
    const a = 0.02 + 0.03 * T;
    const b = 0.12;
    const rho = -0.55 + 0.25 * v;
    const m = 0.05;
    const s = 0.18 + 0.1 * T;
    const w = a + b * (rho * (k - m) + Math.sqrt((k - m) ** 2 + s * s));
    const iv = Math.sqrt(w / (0.25 + T));
    out[i * 3] = u * 3.4 + gauss(r) * 0.004;
    out[i * 3 + 1] = (iv - 0.45) * 4.2 - 0.3;
    out[i * 3 + 2] = (v - 0.5) * 3.4;
  }
  return out;
}

function lattice(n: number) {
  const out = new Float32Array(n * 3);
  const r = mulberry32(23);
  const layers = [6, 10, 14, 14, 10, 4];
  const nodes: [number, number, number][][] = layers.map((count, l) => {
    const x = -3.4 + (l / (layers.length - 1)) * 6.8;
    const spread = 3.4 * Math.sqrt(count / 14);
    return Array.from({ length: count }, (_, j) => {
      const y = count === 1 ? 0 : (j / (count - 1) - 0.5) * spread;
      const z = Math.sin(j * 1.7 + l) * 0.55;
      return [x, y, z] as [number, number, number];
    });
  });
  for (let i = 0; i < n; i++) {
    let p: [number, number, number];
    if (r() < 0.32) {
      const l = Math.floor(r() * layers.length);
      const node = nodes[l][Math.floor(r() * layers[l])];
      p = [node[0] + gauss(r) * 0.05, node[1] + gauss(r) * 0.05, node[2] + gauss(r) * 0.05];
    } else {
      const l = Math.floor(r() * (layers.length - 1));
      const a = nodes[l][Math.floor(r() * layers[l])];
      const b = nodes[l + 1][Math.floor(r() * layers[l + 1])];
      const t = r();
      p = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + gauss(r) * 0.006, a[2] + (b[2] - a[2]) * t];
    }
    out.set(p, i * 3);
  }
  return out;
}

function latent(n: number) {
  const out = new Float32Array(n * 3);
  const r = mulberry32(37);
  const centers = Array.from({ length: 7 }, (_, i) => {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / 7);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const R = 1.7;
    return [R * Math.sin(phi) * Math.cos(theta), R * Math.cos(phi) * 0.8, R * Math.sin(phi) * Math.sin(theta)];
  });
  for (let i = 0; i < n; i++) {
    if (r() < 0.78) {
      const c = centers[Math.floor(r() * centers.length)];
      const sd = 0.22 + r() * 0.18;
      out[i * 3] = c[0] + gauss(r) * sd;
      out[i * 3 + 1] = c[1] + gauss(r) * sd;
      out[i * 3 + 2] = c[2] + gauss(r) * sd;
    } else {
      // sparse background shell
      const u = r() * 2 - 1;
      const th = r() * Math.PI * 2;
      const rad = 2.4 + r() * 0.5;
      const s = Math.sqrt(1 - u * u);
      out[i * 3] = rad * s * Math.cos(th);
      out[i * 3 + 1] = rad * u * 0.8;
      out[i * 3 + 2] = rad * s * Math.sin(th);
    }
  }
  return out;
}

function pricePath(n: number) {
  const out = new Float32Array(n * 3);
  const r = mulberry32(53);
  const steps = 420;
  const p = new Float32Array(steps);
  const vol = new Float32Array(steps);
  let x = 0;
  let sig = 0.06;
  for (let i = 0; i < steps; i++) {
    sig = Math.max(0.03, Math.min(0.14, sig + gauss(r) * 0.006));
    x += 0.006 + gauss(r) * sig;
    p[i] = x;
    vol[i] = sig;
  }
  let lo = Infinity;
  let hi = -Infinity;
  for (const v of p) {
    lo = Math.min(lo, v);
    hi = Math.max(hi, v);
  }
  const norm = (v: number) => ((v - lo) / (hi - lo) - 0.5) * 2.8 + 0.2;
  for (let i = 0; i < n; i++) {
    const roll = r();
    const s = Math.floor(r() * steps);
    const X = -3.8 + (s / (steps - 1)) * 7.6;
    if (roll < 0.58) {
      const z = (r() * 2 - 1) * 0.9;
      out.set([X + gauss(r) * 0.004, norm(p[s]) + gauss(r) * vol[s] * 0.6 * Math.abs(z), z], i * 3);
    } else if (roll < 0.84) {
      const c = Math.floor(s / 7) * 7;
      const Xc = -3.8 + (c / (steps - 1)) * 7.6;
      const span = vol[c] * 4.5;
      out.set([Xc + gauss(r) * 0.01, norm(p[c]) + (r() * 2 - 1) * span, gauss(r) * 0.03], i * 3);
    } else {
      const c = Math.floor(s / 4) * 4;
      const Xc = -3.8 + (c / (steps - 1)) * 7.6;
      out.set([Xc, -2.1 + r() * vol[c] * 9, (r() * 2 - 1) * 0.12], i * 3);
    }
  }
  return out;
}

/* ───────────── shaders ───────────── */

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uMix;
  uniform float uSize;
  uniform float uPR;
  uniform vec3 uMouse;
  uniform float uMouseStrength;
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aRand;
  varying float vAlpha;
  varying float vHi;
  varying float vRand;

  void main() {
    float d = clamp((uMix - aRand * 0.35) / 0.65, 0.0, 1.0);
    float e = d < 0.5 ? 4.0 * d * d * d : 1.0 - pow(-2.0 * d + 2.0, 3.0) / 2.0;
    vec3 p = mix(aFrom, aTo, e);
    float fly = sin(e * 3.14159);
    p += fly * vec3(sin(aRand * 40.0 + uTime), cos(aRand * 31.0 + uTime * 0.7), sin(aRand * 17.0)) * 0.45;
    p += 0.022 * vec3(sin(uTime * 0.9 + p.y * 3.0 + aRand * 6.0), cos(uTime * 0.8 + p.x * 2.0), sin(uTime * 0.7 + p.z * 3.0));

    vec4 world = modelMatrix * vec4(p, 1.0);
    vec2 dm = world.xy - uMouse.xy;
    float f = smoothstep(1.25, 0.0, length(dm)) * uMouseStrength;
    world.xy += normalize(dm + 1e-5) * f * 0.5;
    world.z += f * 0.35;
    vHi = f;

    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    float size = uSize * (0.55 + aRand * 0.9);
    gl_PointSize = size * uPR * (8.0 / -mv.z);
    vAlpha = smoothstep(15.0, 5.0, -mv.z);
    vRand = aRand;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uAcc;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vHi;
  varying float vRand;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.05, r);
    float accent = clamp(step(0.88, vRand) + vHi * 1.4, 0.0, 1.0);
    vec3 col = mix(uBase, uAcc, accent);
    gl_FragColor = vec4(col, a * vAlpha * uOpacity * (0.62 + accent * 0.5));
  }
`;

export function ParticleField({ theme, onFormation, onStats, jumpRef }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef(theme);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    themeRef.current = theme;
    const m = materialRef.current;
    if (!m) return;
    applyTheme(m, theme);
  }, [theme]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return; // no WebGL: the hero still works without the field
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.innerWidth < 768;
    const N = small ? 12000 : 26000;
    const pr = Math.min(window.devicePixelRatio, 1.75);

    renderer.setPixelRatio(pr);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
    camera.position.set(0, 0.4, 9.5);

    const shapes = [volSurface(N), lattice(N), latent(N), pricePath(N)];
    const rand = new Float32Array(N);
    const rr = mulberry32(7);
    for (let i = 0; i < N; i++) rand[i] = rr();

    const geo = new THREE.BufferGeometry();
    const from = new Float32Array(shapes[0]);
    const to = new Float32Array(shapes[0]);
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    geo.setAttribute('aFrom', new THREE.BufferAttribute(from, 3));
    geo.setAttribute('aTo', new THREE.BufferAttribute(to, 3));
    geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 8);

    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uMix: { value: 1 },
        uSize: { value: small ? 3.0 : 2.9 },
        uPR: { value: pr },
        uMouse: { value: new THREE.Vector3(99, 99, 0) },
        uMouseStrength: { value: 0 },
        uBase: { value: new THREE.Color() },
        uAcc: { value: new THREE.Color() },
        uOpacity: { value: 0 },
      },
    });
    materialRef.current = material;
    applyTheme(material, themeRef.current);

    const points = new THREE.Points(geo, material);
    const group = new THREE.Group();
    group.add(points);
    scene.add(group);

    /* layout */
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const wide = w >= 1024;
      group.position.set(wide ? 2.1 : 0, wide ? 0.35 : -0.6, 0);
      group.scale.setScalar(wide ? 1 : Math.min(0.85, w / 700));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    /* pointer */
    const ndc = new THREE.Vector2(99, 99);
    const target = { x: 0, y: 0 };
    const ray = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const hit = new THREE.Vector3();
    let pointerActive = false;
    const onMove = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      target.x = ndc.x;
      target.y = ndc.y;
      pointerActive = e.clientY >= r.top && e.clientY <= r.bottom;
    };
    const onLeave = () => (pointerActive = false);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    /* morph state */
    let current = 0;
    let morphing = false;
    let morphStart = 0;
    let holdStart = 0;
    const HOLD = 5200;
    const MORPH = 2400;

    const beginMorph = (next: number, now: number) => {
      // freeze whatever is on screen as the new origin
      const mix = material.uniforms.uMix.value as number;
      if (morphing && mix < 1) {
        for (let i = 0; i < N; i++) {
          const d = Math.min(1, Math.max(0, (mix - rand[i] * 0.35) / 0.65));
          const e = d < 0.5 ? 4 * d * d * d : 1 - Math.pow(-2 * d + 2, 3) / 2;
          for (let k = 0; k < 3; k++) from[i * 3 + k] = from[i * 3 + k] + (to[i * 3 + k] - from[i * 3 + k]) * e;
        }
      } else {
        from.set(to);
      }
      to.set(shapes[next]);
      (geo.attributes.aFrom as THREE.BufferAttribute).needsUpdate = true;
      (geo.attributes.aTo as THREE.BufferAttribute).needsUpdate = true;
      material.uniforms.uMix.value = 0;
      current = next;
      morphing = true;
      morphStart = now;
      onFormation?.(next);
    };

    if (jumpRef) jumpRef.current = (i: number) => beginMorph(i, performance.now());
    onFormation?.(0);

    /* visibility */
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(mount);

    /* loop */
    let raf = 0;
    let last = performance.now();
    let fpsAcc = 0;
    let fpsFrames = 0;
    let fpsLast = last;
    const start = last;
    holdStart = last;
    const rot = { x: 0.32, y: -0.5 };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min(64, now - last);
      last = now;
      const t = (now - start) / 1000;

      material.uniforms.uTime.value = reduce ? 0 : t;
      material.uniforms.uOpacity.value = Math.min(1, (material.uniforms.uOpacity.value as number) + dt / 1400);

      if (morphing) {
        const p = Math.min(1, (now - morphStart) / MORPH);
        material.uniforms.uMix.value = p;
        if (p >= 1) {
          morphing = false;
          holdStart = now;
        }
      } else if (!reduce && now - holdStart > HOLD) {
        beginMorph((current + 1) % shapes.length, now);
      }

      // gentle parallax + slow orbit
      const ty = -0.5 + (reduce ? 0 : Math.sin(t * 0.12) * 0.45) + target.x * 0.25;
      const tx = 0.32 - target.y * 0.12;
      rot.y += (ty - rot.y) * 0.04;
      rot.x += (tx - rot.x) * 0.04;
      group.rotation.set(rot.x, rot.y, 0);

      // mouse in world space
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(plane, hit)) material.uniforms.uMouse.value.copy(hit);
      const ms = material.uniforms.uMouseStrength.value as number;
      material.uniforms.uMouseStrength.value = ms + ((pointerActive && !reduce ? 1 : 0) - ms) * 0.08;

      renderer.render(scene, camera);

      fpsAcc += dt;
      fpsFrames++;
      if (now - fpsLast > 500) {
        onStats?.({ fps: Math.round(1000 / (fpsAcc / fpsFrames)), x: pointerActive ? hit.x : NaN, y: pointerActive ? hit.y : NaN });
        fpsAcc = 0;
        fpsFrames = 0;
        fpsLast = now;
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      if (jumpRef) jumpRef.current = null;
      geo.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      materialRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden />;
}

function applyTheme(m: THREE.ShaderMaterial, theme: 'dark' | 'light') {
  if (theme === 'light') {
    m.blending = THREE.NormalBlending;
    (m.uniforms.uBase.value as THREE.Color).set('#26282c');
    (m.uniforms.uAcc.value as THREE.Color).set('#4f8a00');
  } else {
    m.blending = THREE.AdditiveBlending;
    (m.uniforms.uBase.value as THREE.Color).set('#c9ced6');
    (m.uniforms.uAcc.value as THREE.Color).set('#c6ff3d');
  }
  m.needsUpdate = true;
}
