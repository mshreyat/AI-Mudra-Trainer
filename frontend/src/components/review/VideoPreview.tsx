import React, { useEffect, useState } from "react";

interface VideoPreviewProps {
  file: File;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ file }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!videoUrl) return null;

  return (
    <div className="glass-card overflow-hidden border border-surface-700/50 rounded-2xl w-full bg-surface-950 aspect-video relative flex items-center justify-center">
      <video
        src={videoUrl}
        controls
        playsInline
        className="w-full h-full object-contain"
      />
    </div>
  );
};
