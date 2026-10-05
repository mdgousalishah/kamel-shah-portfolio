/**
 * SceneTransition.ts
 * High-performance WebGL RenderTarget & Shader pipeline that renders an
 * organic torn / wavy vertical displacement wipe between two scenes.
 */

import * as THREE from 'three';

const TRANSITION_VERTEX_SHADER = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const TRANSITION_FRAGMENT_SHADER = /* glsl */ `
uniform sampler2D uSceneA;
uniform sampler2D uSceneB;
uniform float uProgress;     // 0.0 to 1.0
uniform float uTime;
uniform vec2 uResolution;
uniform float uIntensity;

varying vec2 vUv;

// Fast procedural noise & FBM for torn/liquid edge
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 4; ++i) {
    v += a * noise(p);
    p = rot * p * 2.05 + shift;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  
  // Aspect ratio correction for noise sampling
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 noiseUv = vec2(uv.x * aspect * 3.5, uv.y * 3.5);

  // Multi-frequency organic tear and fluid displacement
  float n1 = fbm(noiseUv + vec2(0.0, uTime * 0.12));
  float n2 = noise(noiseUv * 2.2 - vec2(uTime * 0.08, 0.0));
  float wave = sin(uv.x * 14.0 + uTime * 0.9) * 0.035 + cos(uv.x * 28.0 - uTime * 0.4) * 0.015;

  // Combined organic boundary displacement
  float displacement = (n1 * 0.7 + n2 * 0.3 - 0.5) * 0.28 * uIntensity + wave * uIntensity;
  float distortedY = uv.y + displacement;

  // Progressive top-to-bottom or bottom-to-top organic wipe
  // At uProgress = 0.0 -> Scene A is 100% visible
  // At uProgress = 1.0 -> Scene B is 100% visible
  float softness = 0.07;
  // Threshold moves across the normalized Y range with extra margin
  float threshold = mix(1.15, -0.15, uProgress);
  float mask = smoothstep(threshold - softness, threshold + softness, distortedY);

  // Invert mask so incoming scene B reveals progressively
  mask = 1.0 - mask;

  // Luminescent torn edge highlight (vermilion/crimson #e0231c blending into indigo/cyan)
  float edgeDist = abs(distortedY - threshold);
  float edgeGlow = smoothstep(softness * 1.8, 0.0, edgeDist) * sin(uProgress * 3.14159);

  vec4 colA = texture2D(uSceneA, uv);
  vec4 colB = texture2D(uSceneB, uv);

  // Base mix between Scene A and Scene B
  vec4 finalCol = mix(colA, colB, mask);

  // Vibrant cinematic edge luminescence
  vec3 vermilion = vec3(0.88, 0.14, 0.11);
  vec3 electricIndigo = vec3(0.39, 0.42, 0.96);
  vec3 edgeColor = mix(vermilion, electricIndigo, sin(uv.x * 3.14159));

  finalCol.rgb += edgeColor * (edgeGlow * 0.55);

  gl_FragColor = finalCol;
}
`;

export class SceneTransition {
  private renderTargetA: THREE.WebGLRenderTarget;
  private renderTargetB: THREE.WebGLRenderTarget;
  private postScene: THREE.Scene;
  private postCamera: THREE.OrthographicCamera;
  private material: THREE.ShaderMaterial;
  private quad: THREE.Mesh;

  constructor(width: number, height: number) {
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5);
    const w = Math.max(1, Math.floor(width * dpr));
    const h = Math.max(1, Math.floor(height * dpr));

    const rtParams: THREE.RenderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      depthBuffer: true,
    };

    this.renderTargetA = new THREE.WebGLRenderTarget(w, h, rtParams);
    this.renderTargetB = new THREE.WebGLRenderTarget(w, h, rtParams);

    this.postScene = new THREE.Scene();
    this.postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.material = new THREE.ShaderMaterial({
      vertexShader: TRANSITION_VERTEX_SHADER,
      fragmentShader: TRANSITION_FRAGMENT_SHADER,
      uniforms: {
        uSceneA: { value: this.renderTargetA.texture },
        uSceneB: { value: this.renderTargetB.texture },
        uProgress: { value: 0.0 },
        uTime: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(w, h) },
        uIntensity: { value: 1.0 },
      },
      depthTest: false,
      depthWrite: false,
    });

    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    this.postScene.add(this.quad);
  }

  public setSize(width: number, height: number) {
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5);
    const w = Math.max(1, Math.floor(width * dpr));
    const h = Math.max(1, Math.floor(height * dpr));

    this.renderTargetA.setSize(w, h);
    this.renderTargetB.setSize(w, h);
    this.material.uniforms.uResolution.value.set(w, h);
  }

  public setIntensity(intensity: number) {
    this.material.uniforms.uIntensity.value = intensity;
  }

  public render(
    renderer: THREE.WebGLRenderer,
    sceneA: THREE.Scene,
    sceneB: THREE.Scene,
    camera: THREE.Camera,
    progress: number,
    time: number
  ) {
    // 1. Render Scene A to Target A
    renderer.setRenderTarget(this.renderTargetA);
    renderer.clear();
    renderer.render(sceneA, camera);

    // 2. Render Scene B to Target B
    renderer.setRenderTarget(this.renderTargetB);
    renderer.clear();
    renderer.render(sceneB, camera);

    // 3. Render Post Transition to default canvas framebuffer
    renderer.setRenderTarget(null);
    this.material.uniforms.uSceneA.value = this.renderTargetA.texture;
    this.material.uniforms.uSceneB.value = this.renderTargetB.texture;
    this.material.uniforms.uProgress.value = Math.max(0, Math.min(1, progress));
    this.material.uniforms.uTime.value = time;

    renderer.render(this.postScene, this.postCamera);
  }

  public dispose() {
    this.renderTargetA.dispose();
    this.renderTargetB.dispose();
    this.material.dispose();
    this.quad.geometry.dispose();
  }
}
