"use client";
import { useEffect, useRef } from "react";

interface MemberStarSkyProps {
  supportCount: number;
  className?: string;
}

// HSL to RGB conversion function
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export default function MemberStarSky({ supportCount, className = "" }: MemberStarSkyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Generate stars based on support count
    const generateStars = () => {
      const stars = [];
      const baseStars = 5; // Base white stars (always show)
      const supportStars = supportCount; // Support stars (only when supportCount > 0)
      const totalStars = baseStars + supportStars;
      
      for (let i = 0; i < totalStars; i++) {
        const x = Math.random() * canvas.width / window.devicePixelRatio;
        const y = Math.random() * canvas.height / window.devicePixelRatio;
        const r = Math.random() * 2 + 1; // Star size
        const opacity = Math.random() * 0.8 + 0.2;
        
        // Color based on star type
        let color = "#FFFFFF"; // Default white
        let colorWithAlpha = "#FFFFFF80"; // Default white with alpha
        
        if (i >= baseStars && supportCount > 0) {
          // Support stars - gradient from yellow to pink (only when there are supports)
          const hue = 45 + (i - baseStars) * 10; // Yellow to pink
          color = `hsl(${hue}, 80%, 70%)`;
          // Convert HSL to RGB for alpha support
          const rgb = hslToRgb(hue / 360, 0.8, 0.7);
          colorWithAlpha = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.5)`;
        }
        
        stars.push({ x, y, r, opacity, color, colorWithAlpha });
      }
      
      return stars;
    };

    const stars = generateStars();

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
      
      // Draw stars
      stars.forEach((star, index) => {
        const time = Date.now() * 0.001;
        const twinkle = Math.sin(time * 2 + index) * 0.3 + 0.7;
        
        ctx.save();
        ctx.globalAlpha = star.opacity * twinkle;
        
        // Draw star with glow effect
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r * 3);
        gradient.addColorStop(0, star.color);
        gradient.addColorStop(0.5, star.colorWithAlpha);
        gradient.addColorStop(1, "transparent");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw bright center
        ctx.globalAlpha = 1;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });
      
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [supportCount]);

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: "100%", height: "100%" }}
      />
      {/* Support count overlay */}
      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
        ⭐ {supportCount} 応援
      </div>
    </div>
  );
}