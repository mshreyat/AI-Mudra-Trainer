import React from "react";

interface VoiceToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const VoiceToggle: React.FC<VoiceToggleProps> = ({ enabled, onToggle }) => {
  return (
    <button
      onClick={() => onToggle(!enabled)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
        enabled
          ? "bg-primary-900/30 border-primary-500/50 text-primary-300"
          : "bg-surface-800/50 border-surface-700/50 text-surface-400 hover:text-surface-300 hover:bg-surface-700/50"
      }`}
      aria-label={enabled ? "Disable Voice Coach" : "Enable Voice Coach"}
    >
      {enabled ? (
        // Speaker ON Icon
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
      ) : (
        // Speaker OFF (Muted) Icon
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      )}
      <span className="text-sm font-medium tracking-wide">
        Voice {enabled ? "On" : "Off"}
      </span>
    </button>
  );
};
