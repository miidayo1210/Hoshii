'use client';

import { useEffect, useState } from 'react';

const getSkyTheme = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 8) {
    return {
      name: '朝日',
      cursor: '🌅',
    };
  } else if (hour >= 8 && hour < 12) {
    return {
      name: '朝',
      cursor: '✈️',
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      name: '昼',
      cursor: '🎈',
    };
  } else if (hour >= 17 && hour < 19) {
    return {
      name: '夕焼け',
      cursor: '🌅',
    };
  } else {
    return {
      name: '夜',
      cursor: '🚀',
    };
  }
};

export function FloatingBackground() {
  const [skyTheme, setSkyTheme] = useState(getSkyTheme());

  useEffect(() => {
    // 時間に合わせてテーマを更新
    const updateTheme = () => {
      setSkyTheme(getSkyTheme());
    };
    
    updateTheme();
    const interval = setInterval(updateTheme, 60000); // 1分ごとに更新
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // カスタムカーソルを設定
    const setCustomCursor = () => {
      document.body.style.cursor = 'none';
      
      // カーソル要素を作成
      const cursorElement = document.createElement('div');
      cursorElement.id = 'custom-cursor';
      cursorElement.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        font-size: 24px;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: transform 0.2s ease;
      `;
      cursorElement.textContent = skyTheme.cursor;
      document.body.appendChild(cursorElement);

      // クリック可能な要素を検出する関数
      const isClickableElement = (element: Element): boolean => {
        const tagName = element.tagName.toLowerCase();
        const clickableTags = ['button', 'a', 'input', 'select', 'textarea'];
        
        if (clickableTags.includes(tagName)) return true;
        
        // クリック可能なクラスや属性をチェック
        if (element.getAttribute('role') === 'button') return true;
        if (element.classList.contains('cursor-pointer')) return true;
        if (element.classList.contains('puyo')) return true;
        if (element.classList.contains('glass')) return true;
        
        // 親要素もチェック
        let parent = element.parentElement;
        while (parent && parent !== document.body) {
          if (clickableTags.includes(parent.tagName.toLowerCase())) return true;
          if (parent.getAttribute('role') === 'button') return true;
          if (parent.classList.contains('cursor-pointer')) return true;
          if (parent.classList.contains('puyo')) return true;
          if (parent.classList.contains('glass')) return true;
          parent = parent.parentElement;
        }
        
        return false;
      };

      // マウス移動を追跡
      const handleMouseMove = (e: MouseEvent) => {
        cursorElement.style.left = e.clientX + 'px';
        cursorElement.style.top = e.clientY + 'px';
        
        // マウス下の要素を取得
        const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY);
        
        if (elementUnderMouse && isClickableElement(elementUnderMouse)) {
          // クリック可能な要素の上にいる時はロケットを傾ける
          cursorElement.style.transform = 'translate(-50%, -50%) rotate(15deg) scale(1.1)';
        } else {
          // 通常の状態に戻す
          cursorElement.style.transform = 'translate(-50%, -50%) rotate(0deg) scale(1)';
        }
      };

      // マウスオーバーイベントも追加（より正確な検出のため）
      const handleMouseOver = (e: MouseEvent) => {
        const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY);
        
        if (elementUnderMouse && isClickableElement(elementUnderMouse)) {
          cursorElement.style.transform = 'translate(-50%, -50%) rotate(15deg) scale(1.1)';
        } else {
          cursorElement.style.transform = 'translate(-50%, -50%) rotate(0deg) scale(1)';
        }
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseover', handleMouseOver);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseover', handleMouseOver);
        document.body.style.cursor = 'auto';
        const existingCursor = document.getElementById('custom-cursor');
        if (existingCursor) {
          existingCursor.remove();
        }
      };
    };

    const cleanup = setCustomCursor();
    return cleanup;
  }, [skyTheme]);

  return null; // 背景要素は不要
}