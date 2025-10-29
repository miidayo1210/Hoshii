'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { InstancedMesh } from 'three';

type Comment = { id: string; text: string; ts: number };

export default function HoshiiLandscape({
  actionCount,
  comments,
}: {
  actionCount: number;
  comments: Comment[];
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);

  // 広場上に置く“ランタン”（=アクション数。コメントで明滅が強くなる）
  const lanternsRef = useRef<InstancedMesh | null>(null);
  const currentCountRef = useRef(0);
  const targetCountRef = useRef(0);

  const tmpMatrix = useMemo(() => new THREE.Matrix4(), []);
  const twinkleIntensity = Math.min(1, comments.length / 15); // コメント多いほど明滅UP

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // === Scene / Camera / Renderer ===
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#cfe8ff'); // 明るい“空色”
    scene.fog = new THREE.Fog('#cfe8ff', 20, 60);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200);
    camera.position.set(6, 6, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // === Lights（明るめに） ===
    const hemi = new THREE.HemisphereLight(0xffffff, 0xb8c1cc, 1.0);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(8, 12, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 60;
    scene.add(sun);

    // === Ground Plaza（広場床：明るいタイル & グリッド） ===
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.MeshStandardMaterial({
        color: '#e6e9ef', // 明るいグレー
        roughness: 0.9,
        metalness: 0.0,
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // タイルっぽい見た目（GridHelper）
    const grid = new THREE.GridHelper(40, 40, 0x8aa0b6, 0xd0d7de);
    (grid.material as THREE.Material).opacity = 0.6;
    (grid.material as THREE.Material as any).transparent = true;
    scene.add(grid);

    // === 建物っぽいボリューム（簡易ボックス） ===
    const makeBox = (w: number, h: number, d: number, x: number, z: number, color: string) => {
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.0 })
      );
      m.position.set(x, h / 2, z);
      m.castShadow = true;
      m.receiveShadow = true;
      scene.add(m);
      return m;
    };

    // 広場の周縁に低層ボリューム
    makeBox(2.8, 2.0, 8, -8, 0, '#d1dae6');
    makeBox(2.2, 2.4, 6, 9, -3, '#d7e3f0');
    makeBox(3.0, 2.2, 7, 7, 6, '#d5dfe9');
    makeBox(2.4, 2.0, 6, -2, 9, '#dfe6ee');
    makeBox(2.6, 2.6, 6, -6, -7, '#ccd9e6');

    // 中央モニュメント（円柱）
    const monument = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 2.2, 32),
      new THREE.MeshStandardMaterial({ color: '#b5c8da', roughness: 0.7 })
    );
    monument.position.set(0, 1.1, 0);
    monument.castShadow = true;
    scene.add(monument);

    // ベンチ風（薄いボックス）
    const benchMat = new THREE.MeshStandardMaterial({ color: '#c6d2de', roughness: 0.85 });
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const r = 4.5;
      const bench = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 0.35), benchMat);
      bench.position.set(Math.cos(angle) * r, 0.075, Math.sin(angle) * r);
      bench.rotation.y = -angle;
      bench.castShadow = true;
      bench.receiveShadow = true;
      scene.add(bench);
    }

    // === “ランタン”（=アクションの可視化） ===
    // 広場に置いていく小さな発光球（InstancedMesh）
    const lanternGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const lanternMat = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: '#ffd166', // 暖色光
      emissiveIntensity: 0.6,
      roughness: 0.5,
      metalness: 0.0,
    });
    const maxLanterns = 1200;
    const lanterns = new InstancedMesh(lanternGeom, lanternMat, maxLanterns);
    lanterns.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    lanterns.castShadow = true;
    scene.add(lanterns);
    lanternsRef.current = lanterns;

    // ランタンの初期配置
    const placeLantern = (index: number) => {
      const m = new THREE.Matrix4();
      // モニュメント周りの同心円＋ランダム
      const ring = 2 + Math.floor(Math.random() * 6); // 2~7のリング
      const baseR = 1.2 + ring * 0.6;
      const jitter = (Math.random() - 0.5) * 0.35;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * (baseR + jitter);
      const z = Math.sin(angle) * (baseR + jitter);
      const y = 0.12; // 地面すれすれ
      m.setPosition(x, y, z);
      lanterns.setMatrixAt(index, m);
    };

    // === 簡易オービット（ドラッグで視点回転） ===
    let isDragging = false;
    let lastX = 0, lastY = 0;
    const onDown = (e: MouseEvent) => { isDragging = true; lastX = e.clientX; lastY = e.clientY; };
    const onUp = () => { isDragging = false; };
    const onMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = (e.clientX - lastX) / width;
      const dy = (e.clientY - lastY) / height;
      lastX = e.clientX; lastY = e.clientY;
      camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -dx * 1.8);
      camera.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), -dy * 1.2);
      camera.lookAt(0, 0, 0);
    };
    renderer.domElement.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);

    // === リサイズ ===
    const onResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    // === ループ ===
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    clockRef.current = new THREE.Clock();

    const loop = () => {
      const t = clockRef.current!.getElapsedTime();

      // ランタンの追加（current -> targetへ）
      if (lanternsRef.current && currentCountRef.current < targetCountRef.current) {
        const step = Math.min(10, targetCountRef.current - currentCountRef.current);
        for (let i = 0; i < step; i++) {
          placeLantern(currentCountRef.current);
          currentCountRef.current++;
        }
        lanternsRef.current.count = currentCountRef.current;
        lanternsRef.current.instanceMatrix.needsUpdate = true;
      }

      // 明滅（コメント量で強度UP）
      if (lanternsRef.current) {
        const mat = lanternsRef.current.material as THREE.MeshStandardMaterial;
        const base = 0.55;
        const amp = 0.45 * twinkleIntensity; // コメント多いほど振幅UP
        mat.emissiveIntensity = base + Math.sin(t * 2.0) * amp;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    };
    loop();

    // === クリーンアップ ===
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
      renderer.domElement.removeEventListener('mousedown', onDown);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
      scene.clear();
    };
  }, [tmpMatrix, twinkleIntensity]);

  // アクション数が増えたらランタンを増やす
  useEffect(() => {
    targetCountRef.current = Math.min(actionCount, 1200);
  }, [actionCount]);

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', background: '#cfe8ff' }} // 背景も明るめ
    />
  );
}
