"use client";
import { useEffect, useRef } from "react";

/**
 * Grand star sky: parallax nebula + twinkling stars + random shooting stars.
 * Canvas-based, runs light enough for mobile.
 */
export default function StarSky({ density = 220 }: { density?: number }){
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(()=>{
    const canvas = ref.current!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let W = 0, H = 0;
    let totalStars = 0;

    const stars: {x:number;y:number;r:number;tw:number;color?:string;name?:string;isConstellation?:boolean;constellationIndex?:number;starIndex?:number;constellationName?:string;connections?:number[][]}[] = [];
    const meteors: {x:number;y:number;vx:number;vy:number;life:number}[] = [];
    
    function resize(){
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    resize();
    const onResize = ()=>resize();
    window.addEventListener("resize", onResize);

    // fetch star count and participation data
    let participations: {action_key: string, created_at: string}[] = [];
    async function fetchStarData(){
      try {
        const [statsResponse, partsResponse] = await Promise.all([
          fetch('/api/leapday/stats'),
          fetch('/api/leapday/comments?limit=200')
        ]);
        const statsData = await statsResponse.json();
        const partsData = await partsResponse.json();
        totalStars = statsData.total || 0;
        participations = partsData.items || [];
      } catch (e) {
        console.log('Failed to fetch star data:', e);
        totalStars = 0;
        participations = [];
      }
    }

    // 星座パターン（ランダムで選択）
            const constellations = [
              {
                name: "カエル",
                stars: [
                  {x: 0.3, y: 0.4, r: 2.5, color: '#FFFFFF'}, // 頭
                  {x: 0.35, y: 0.45, r: 2.5, color: '#FFFFFF'}, // 体
                  {x: 0.4, y: 0.5, r: 2.5, color: '#FFFFFF'}, // お尻
                  {x: 0.28, y: 0.38, r: 2, color: '#FFFFFF'}, // 左目
                  {x: 0.32, y: 0.38, r: 2, color: '#FFFFFF'}, // 右目
                  {x: 0.25, y: 0.5, r: 2.2, color: '#FFFFFF'}, // 左前足
                  {x: 0.45, y: 0.5, r: 2.2, color: '#FFFFFF'}, // 右前足
                  {x: 0.25, y: 0.6, r: 2.2, color: '#FFFFFF'}, // 左後足
                  {x: 0.45, y: 0.6, r: 2.2, color: '#FFFFFF'}, // 右後足
                ],
                connections: [
                  [0, 1], [1, 2], // 体のライン
                  [0, 3], [0, 4], // 頭から目
                  [1, 5], [1, 6], // 体から前足
                  [2, 7], [2, 8], // お尻から後足
                ]
              },
              {
                name: "北斗七星",
                stars: [
                  {x: 0.2, y: 0.3, r: 2.5, color: '#FFFFFF'}, // 柄の先端
                  {x: 0.25, y: 0.35, r: 2.3, color: '#FFFFFF'}, // 柄
                  {x: 0.3, y: 0.4, r: 2.3, color: '#FFFFFF'}, // 柄
                  {x: 0.35, y: 0.45, r: 2.7, color: '#FFFFFF'}, // 柄と斗の接続
                  {x: 0.4, y: 0.5, r: 2.3, color: '#FFFFFF'}, // 斗
                  {x: 0.45, y: 0.45, r: 2.3, color: '#FFFFFF'}, // 斗
                  {x: 0.5, y: 0.4, r: 2.3, color: '#FFFFFF'}, // 斗
                ],
                connections: [
                  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6] // 北斗七星の形
                ]
              },
              {
                name: "オリオン座",
                stars: [
                  {x: 0.3, y: 0.2, r: 2.5, color: '#FFFFFF'}, // 左肩
                  {x: 0.5, y: 0.2, r: 2.5, color: '#FFFFFF'}, // 右肩
                  {x: 0.35, y: 0.35, r: 2.3, color: '#FFFFFF'}, // ベルト1
                  {x: 0.4, y: 0.35, r: 2.3, color: '#FFFFFF'}, // ベルト2
                  {x: 0.45, y: 0.35, r: 2.3, color: '#FFFFFF'}, // ベルト3
                  {x: 0.3, y: 0.5, r: 2.3, color: '#FFFFFF'}, // 左足
                  {x: 0.5, y: 0.5, r: 2.3, color: '#FFFFFF'}, // 右足
                ],
                connections: [
                  [0, 2], [1, 4], // 肩からベルト
                  [2, 3], [3, 4], // ベルト
                  [2, 5], [4, 6], // ベルトから足
                ]
              },
              {
                name: "ハート",
                stars: [
                  {x: 0.35, y: 0.3, r: 2.3, color: '#FFFFFF'}, // 左の丸
                  {x: 0.45, y: 0.3, r: 2.3, color: '#FFFFFF'}, // 右の丸
                  {x: 0.4, y: 0.4, r: 2.3, color: '#FFFFFF'}, // 中央
                  {x: 0.4, y: 0.5, r: 2.3, color: '#FFFFFF'}, // 下
                  {x: 0.4, y: 0.6, r: 2.3, color: '#FFFFFF'}, // 先端
                ],
                connections: [
                  [0, 2], [1, 2], // 上の丸から中央
                  [2, 3], [3, 4], // 中央から下へ
                ]
              }
            ];

    // init stars with colors based on participation phase
    function seed(){
      stars.length = 0;
      const baseStars = 5; // 白い星を5個に
      const n = Math.min(500, baseStars + totalStars); // 黄色い星は回数×1個
      
      for(let i=0;i<n;i++){
        const isNewStar = i >= baseStars;
        let color = '#fff'; // default white for base stars
        let starName = ''; // 星の名前（ホバー時に表示）

        if (isNewStar) {
          const participationIndex = i - baseStars;
          const participation = participations[participationIndex];
          
          if (participation && participation.action_key) {
            // Determine if it's a "before" or "day" action
            const isBeforeAction = participation.action_key.includes('support_message') || 
                                 participation.action_key.includes('memory_ibaraki') ||
                                 participation.action_key.includes('what_student_like') ||
                                 participation.action_key.includes('thanks_parents');
            
            color = isBeforeAction ? '#FFFF00' : '#FF6B6B'; // Bright yellow for before, Red for day
            starName = participation.name || '匿名'; // 星の名前を設定
          } else {
            // Default to bright yellow for new stars if no action_key
            color = '#FFFF00';
            starName = '匿名';
          }
        }
        
        stars.push({ 
          x: Math.random()*W, 
          y: Math.random()*H, 
          r: Math.random()*2.5+1.5, // サイズを大きく（2mm~3mm相当）
          tw: Math.random()*Math.PI*2,
          color: color,
          name: starName
        });
      }
      
      // 30個ごとに星座を追加（ランダムで選択）
      const constellationCount = Math.floor(totalStars / 30);
      
      for(let c = 0; c < constellationCount; c++){
        // ランダムで星座を選択
        const constellation = constellations[c % constellations.length];
        const offsetX = (c % 3) * 0.3; // 横に3つまで
        const offsetY = Math.floor(c / 3) * 0.4; // 縦に配置
        
        constellation.stars.forEach((constellationStar, index) => {
          stars.push({
            x: (constellationStar.x + offsetX) * W,
            y: (constellationStar.y + offsetY) * H,
            r: constellationStar.r,
            tw: Math.random()*Math.PI*2,
            color: constellationStar.color,
            name: `${constellation.name}星座${c+1}の星${index+1}`,
            isConstellation: true,
            constellationIndex: c,
            starIndex: index,
            constellationName: constellation.name,
            connections: constellation.connections
          });
        });
      }
    }
    
    fetchStarData().then(() => seed());

    // mouse parallax and hover detection
    let parX=0, parY=0, targetX=0, targetY=0;
    let hoveredStar: {x:number;y:number;name:string} | null = null;
    let tooltip: HTMLElement | null = null;
    
    const onMove = (e:MouseEvent)=>{
      const rx = (e.clientX/W - 0.5);
      const ry = (e.clientY/H - 0.5);
      targetX = rx*8; targetY = ry*6;
      
      // ホバー検出
      const mouseX = e.clientX - canvas.offsetLeft;
      const mouseY = e.clientY - canvas.offsetTop;
      
      hoveredStar = null;
      for(const star of stars){
        const dx = mouseX - star.x;
        const dy = mouseY - star.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        if(distance < star.r * 3 && star.name){ // ホバー範囲を拡大
          hoveredStar = {x: star.x, y: star.y, name: star.name};
          break;
        }
      }
      
      // ツールチップの表示/非表示
      if(tooltip){
        if(hoveredStar){
          tooltip.textContent = hoveredStar.name;
          tooltip.style.left = (e.clientX + 10) + 'px';
          tooltip.style.top = (e.clientY - 30) + 'px';
          tooltip.style.display = 'block';
        } else {
          tooltip.style.display = 'none';
        }
      }
    };
    window.addEventListener("mousemove", onMove);

    function addMeteor(){
      const y = Math.random()*H*0.6;
      const x = Math.random()*W;
      const speed = 6+Math.random()*4;
      meteors.push({ x, y, vx: -speed, vy: speed*0.35, life: 1 });
    }

    let meteorTimer = 0;
    function loop(t:number){
      raf = requestAnimationFrame(loop);
      parX += (targetX - parX)*0.04;
      parY += (targetY - parY)*0.04;

      // background nebula
      const grd = ctx.createLinearGradient(0,0,W,H);
      grd.addColorStop(0, "#0b1020");
      grd.addColorStop(1, "#141a38");
      ctx.fillStyle = grd; ctx.fillRect(0,0,W,H);

      // big nebula glows
      drawGlow(W*0.2 + parX, H*0.3 + parY, 260, "rgba(179,136,255,0.25)");
      drawGlow(W*0.8 - parX, H*0.2 + parY, 220, "rgba(139,227,255,0.22)");
      drawGlow(W*0.5 + parX*0.5, H*0.9 - parY, 300, "rgba(255,209,232,0.18)");

              // constellation lines (draw before stars) - ネオン風キラキラ効果
              const constellationStars = stars.filter(s => s.isConstellation);
              const constellationGroups = new Map<number, typeof constellationStars>();
              
              constellationStars.forEach(star => {
                if(star.constellationIndex !== undefined){
                  if(!constellationGroups.has(star.constellationIndex)){
                    constellationGroups.set(star.constellationIndex, []);
                  }
                  constellationGroups.get(star.constellationIndex)!.push(star);
                }
              });
              
              // draw constellation lines with neon glow effect
              constellationGroups.forEach((groupStars, constellationIndex) => {
                const firstStar = groupStars[0];
                if(!firstStar || !firstStar.connections) return;
                
                // ネオン風のグラデーション効果
                const gradient = ctx.createLinearGradient(0, 0, W, H);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
                gradient.addColorStop(0.3, 'rgba(179, 136, 255, 0.8)');
                gradient.addColorStop(0.6, 'rgba(139, 227, 255, 0.7)');
                gradient.addColorStop(1, 'rgba(255, 209, 232, 0.6)');
                
                firstStar.connections.forEach(([fromIdx, toIdx]) => {
                  const fromStar = groupStars[fromIdx];
                  const toStar = groupStars[toIdx];
                  if(fromStar && toStar){
                    const x1 = fromStar.x + parX*0.4;
                    const y1 = fromStar.y + parY*0.4;
                    const x2 = toStar.x + parX*0.4;
                    const y2 = toStar.y + parY*0.4;
                    
                    // 外側のグロー効果（複数層）
                    for(let i = 3; i >= 1; i--){
                      ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * i})`;
                      ctx.lineWidth = i * 2;
                      ctx.globalAlpha = 0.3;
                      ctx.beginPath();
                      ctx.moveTo(x1, y1);
                      ctx.lineTo(x2, y2);
                      ctx.stroke();
                    }
                    
                    // メインライン（薄い白）
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.lineWidth = 1.5;
                    ctx.globalAlpha = 0.9;
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                    
                    // キラキラ効果（点滅）
                    const twinkle = Math.sin(t * 0.01 + constellationIndex) * 0.5 + 0.5;
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * twinkle})`;
                    ctx.lineWidth = 0.5;
                    ctx.globalAlpha = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                  }
                });
              });

              // stars
              for(const s of stars){
                s.tw += 0.03 + Math.random()*0.01;
                const tw = (Math.sin(s.tw)*0.5+0.5);
                
                if(s.isConstellation){
                  // 星座の星はネオン風キラキラ効果
                  const x = s.x + parX*0.4;
                  const y = s.y + parY*0.4;
                  const radius = s.r * (0.8 + 0.4 * tw);
                  
                  // 外側のグロー効果
                  for(let i = 4; i >= 1; i--){
                    const glowRadius = radius + i * 2;
                    const glowAlpha = (0.15 - i * 0.03) * tw;
                    ctx.globalAlpha = glowAlpha;
                    ctx.fillStyle = s.color || "#fff";
                    ctx.beginPath();
                    ctx.arc(x, y, glowRadius, 0, Math.PI*2);
                    ctx.fill();
                  }
                  
                  // メインの星
                  ctx.globalAlpha = 0.9 + 0.1 * tw;
                  ctx.fillStyle = s.color || "#fff";
                  ctx.beginPath();
                  ctx.arc(x, y, radius, 0, Math.PI*2);
                  ctx.fill();
                  
                  // 中心のハイライト
                  ctx.globalAlpha = 1;
                  ctx.fillStyle = "#ffffff";
                  ctx.beginPath();
                  ctx.arc(x, y, radius * 0.3, 0, Math.PI*2);
                  ctx.fill();
                } else {
                  // 参加者の星（黄色・赤）はネオン風、白い星は通常
                  const x = s.x + parX*0.4;
                  const y = s.y + parY*0.4;
                  const radius = s.r * (0.8 + 0.4 * tw);
                  
                  if(s.color && s.color !== '#fff'){
                    // 黄色・赤の星はネオン風キラキラ効果
                    
                    // 外側のグロー効果
                    for(let i = 3; i >= 1; i--){
                      const glowRadius = radius + i * 1.5;
                      const glowAlpha = (0.12 - i * 0.03) * tw;
                      ctx.globalAlpha = glowAlpha;
                      ctx.fillStyle = s.color;
                      ctx.beginPath();
                      ctx.arc(x, y, glowRadius, 0, Math.PI*2);
                      ctx.fill();
                    }
                    
                    // メインの星
                    ctx.globalAlpha = 0.8 + 0.2 * tw;
                    ctx.fillStyle = s.color;
                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI*2);
                    ctx.fill();
                    
                    // 中心のハイライト
                    ctx.globalAlpha = 1;
                    ctx.fillStyle = "#ffffff";
                    ctx.beginPath();
                    ctx.arc(x, y, radius * 0.4, 0, Math.PI*2);
                    ctx.fill();
                  } else {
                    // 白い星は通常の表示
                    ctx.globalAlpha = 0.7 + 0.3*tw;
                    ctx.fillStyle = s.color || "#fff";
                    ctx.beginPath(); 
                    ctx.arc(x, y, radius, 0, Math.PI*2); 
                    ctx.fill();
                  }
                }
              }
              ctx.globalAlpha = 1;

      // meteors
      meteorTimer += 1;
      if (meteorTimer % 160 === 0) addMeteor();
      for(let i=meteors.length-1;i>=0;i--){
        const m = meteors[i];
        // trail
        const trail = ctx.createLinearGradient(m.x, m.y, m.x - m.vx*6, m.y - m.vy*6);
        trail.addColorStop(0,"rgba(255,255,255,0.9)");
        trail.addColorStop(1,"rgba(255,255,255,0)");
        ctx.strokeStyle = trail; ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - m.vx*6, m.y - m.vy*6); ctx.stroke();
        // head
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(m.x, m.y, 1.6, 0, Math.PI*2); ctx.fill();
        m.x += m.vx; m.y += m.vy; m.life -= 0.01;
        if(m.x < -50 || m.y > H+50 || m.life <= 0) meteors.splice(i,1);
      }
    }

    function drawGlow(x:number,y:number,r:number,color:string){
      const g = ctx.createRadialGradient(x,y,0,x,y,r);
      g.addColorStop(0,color); g.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    }

    // ツールチップの作成
    tooltip = document.createElement('div');
    tooltip.style.position = 'fixed';
    tooltip.style.background = 'rgba(0,0,0,0.8)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '4px 8px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '12px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.zIndex = '1000';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);

    raf = requestAnimationFrame(loop);

    // Update star count every 30 seconds - disabled for constellation stability
    // const starUpdateInterval = setInterval(() => {
    //   fetchStarData().then(() => seed());
    // }, 30000);

    return ()=>{
      cancelAnimationFrame(raf);
      // clearInterval(starUpdateInterval); // disabled
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      if(tooltip && tooltip.parentNode){
        tooltip.parentNode.removeChild(tooltip);
      }
    };
  }, []);

  return <div className="relative w-full h-[46vh] md:h-[56vh] rounded-2xl overflow-hidden yk-glow">
    <canvas ref={ref} className="w-full h-full block" />
    <div className="pointer-events-none absolute inset-0 yk-halo" />
  </div>;
}
