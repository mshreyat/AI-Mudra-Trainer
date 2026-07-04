import { useState, useEffect, useRef } from "react";
import { TutorData } from "./useTutor";
import { VoiceCoachEngine } from "../services/voiceCoach";

export interface VoiceCoachState {
  isSpeaking: boolean;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
}

export const useVoiceCoach = (
  tutorData: TutorData | null,
  isTracking: boolean
): VoiceCoachState => {
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  
  // Persist the engine across re-renders
  const engineRef = useRef<VoiceCoachEngine | null>(null);
  
  if (!engineRef.current) {
    engineRef.current = new VoiceCoachEngine();
  }

  // Handle SpeechSynthesis events and speaking
  useEffect(() => {
    if (!voiceEnabled || !window.speechSynthesis) return;

    // Check if the engine wants to speak this frame
    const message = engineRef.current?.processFrame(tutorData, isTracking);

    if (message) {
      // Cancel any currently speaking utterance before starting a new one
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(message);
      
      // Try to pick a natural-sounding English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith('en-') && (v.name.includes('Female') || v.name.includes('Google')));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Slightly slower rate for a calm, instructional tone
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  }, [tutorData, isTracking, voiceEnabled]);

  // Clean up speech synthesis on unmount or disable
  useEffect(() => {
    if (!voiceEnabled && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [voiceEnabled]);

  return {
    isSpeaking,
    voiceEnabled,
    setVoiceEnabled
  };
};
