"use client";
import { useEffect, useRef } from "react";

export default function StarBurst() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function createStarBurst() {
      const container = document.body;
      const burst = document.createElement("div");
      burst.style.position = "fixed";
      burst.style.left = "50%";
      burst.style.bottom = "20%";
      burst.style.transform = "translateX(-50%)";
      burst.style.zIndex = "1000";
      burst.style.pointerEvents = "none";

      const starCount = 8;
      const colors = ['#FFFF00', '#FFD700', '#FFA500', '#FF6B6B', '#B388FF', '#8BE3FF', '#FFD1E8', '#9AF7D7'];

      for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.textContent = "⭐";
        star.style.position = "absolute";
        star.style.fontSize = "20px";
        star.style.filter = "drop-shadow(0 0 10px rgba(255,255,0,0.8))";
        
        const angle = (i / starCount) * Math.PI * 2;
        const distance = 100 + Math.random() * 50;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance - 200; // 上に向かって飛ぶ

        star.style.left = "0px";
        star.style.top = "0px";

        burst.appendChild(star);

        // アニメーション
        star.animate([
          { 
            transform: "translate(0, 0) scale(1)", 
            opacity: 1,
            filter: "drop-shadow(0 0 10px rgba(255,255,0,0.8))"
          },
          { 
            transform: `translate(${x}px, ${y}px) scale(0.3)`, 
            opacity: 0,
            filter: "drop-shadow(0 0 20px rgba(255,255,0,0.4))"
          }
        ], {
          duration: 2000,
          easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
        }).onfinish = () => {
          star.remove();
        };
      }

      container.appendChild(burst);

      // 2秒後にバースト要素を削除
      setTimeout(() => {
        if (burst.parentNode) {
          burst.parentNode.removeChild(burst);
        }
      }, 2000);
    }

    // ボタンクリック時に星を飛ばす
    const handleButtonClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.textContent && target.textContent.includes('茨城Frogsを応援する')) {
        setTimeout(() => {
          createStarBurst();
        }, 300); // 少し遅延させて星を飛ばす
      }
    };

    document.addEventListener('click', handleButtonClick);

    return () => {
      document.removeEventListener('click', handleButtonClick);
    };
  }, []);

  return <div ref={ref} className="fixed inset-0 pointer-events-none z-[60]" />;
}







