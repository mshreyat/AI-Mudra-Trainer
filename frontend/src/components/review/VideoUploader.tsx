import React, { useState, useRef } from "react";

interface VideoUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  onFileSelect,
  selectedFile,
  onClear,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("video/")) {
        onFileSelect(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (selectedFile) {
    return (
      <div className="glass-card p-6 border border-surface-700/50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-primary-600/10 flex items-center justify-center text-primary-400 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{selectedFile.name}</p>
            <p className="text-xs text-surface-400">
              {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="p-2 rounded-lg hover:bg-surface-800 text-surface-400 hover:text-red-400 transition-colors cursor-pointer"
          title="Remove video"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" x2="6" y1="6" y2="18" />
            <line x1="6" x2="18" y1="6" y2="18" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerFileInput}
      className={`glass-card p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
        isDragOver
          ? "border-primary-500 bg-primary-950/10"
          : "border-surface-700/60 hover:border-surface-600 hover:bg-surface-800/20"
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/*"
        className="hidden"
      />
      <div className="w-16 h-16 rounded-2xl bg-surface-800 flex items-center justify-center text-surface-400 mb-4 transition-transform group-hover:scale-105 duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
          <line x1="7" x2="17" y1="2" y2="2" />
          <line x1="7" x2="17" y1="22" y2="22" />
          <line x1="2" x2="2" y1="7" y2="17" />
          <line x1="22" x2="22" y1="7" y2="17" />
          <path d="M12 9v6" />
          <path d="M9 12h6" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-white mb-1">
        Drag & drop your practice video
      </h3>
      <p className="text-xs text-surface-400 max-w-xs mb-4">
        Supports MP4, MOV, WebM, and other video file formats (Recommended size under 50MB).
      </p>
      <span className="text-xs font-semibold bg-surface-800 text-primary-300 px-3 py-1.5 rounded-full border border-surface-700">
        Browse Files
      </span>
    </div>
  );
};
