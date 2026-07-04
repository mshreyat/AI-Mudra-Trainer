import React from "react";

interface VoiceIndicatorProps {
  isSpeaking: boolean;
}

export const VoiceIndicator: React.FC<VoiceIndicatorProps> = ({ isSpeaking }) => {
  if (!isSpeaking) return null;

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-950/40 border border-primary-800/30">
      <div className="w-1.5 h-3 bg-primary-400 rounded-full animate-[bounce_1s_infinite]" />
      <div className="w-1.5 h-4 bg-primary-300 rounded-full animate-[bounce_1s_infinite_0.2s]" />
      <div className="w-1.5 h-3 bg-primary-400 rounded-full animate-[bounce_1s_infinite_0.4s]" />
      <span className="ml-2 text-xs font-medium text-primary-300 tracking-wider">SPEAKING</span>
    </div>
  );
};
