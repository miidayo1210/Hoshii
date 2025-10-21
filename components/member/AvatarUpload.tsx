"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import DreamButton from "@/components/leapday/DreamButton";

interface AvatarUploadProps {
  currentAvatar?: string;
  onUpload: (file: File) => void;
  disabled?: boolean;
}

export default function AvatarUpload({ currentAvatar, onUpload, disabled }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-[var(--yk-ink)]">
        プロフィール画像
      </label>
      
      <motion.div
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        className={`
          relative w-32 h-32 rounded-full border-2 border-dashed cursor-pointer
          ${isDragging ? 'border-[var(--yk-accent)] bg-[var(--yk-accent-3)]/20' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[var(--yk-accent)] hover:bg-[var(--yk-accent-3)]/10'}
          transition-all duration-200
        `}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {preview ? (
          <img
            src={preview}
            alt="Avatar preview"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--yk-accent)] to-[var(--yk-accent-2)] flex items-center justify-center text-white">
            <div className="text-center">
              <div className="text-2xl mb-1">📷</div>
              <div className="text-xs">画像を選択</div>
            </div>
          </div>
        )}
        
        {/* Upload overlay */}
        {!disabled && (
          <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-lg mb-1">📷</div>
              <div className="text-xs">変更</div>
            </div>
          </div>
        )}
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className="hidden"
        disabled={disabled}
      />

      <p className="text-xs text-gray-500">
        画像をドラッグ&ドロップまたはクリックして選択
      </p>
    </div>
  );
}


