import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { CameraView } from '@/components/camera/CameraView';
import { ScoreCard } from '@/components/tutor/ScoreCard';
import { FingerScore } from '@/components/tutor/FingerScore';
import { CoachCard } from '@/components/tutor/CoachCard';
import { VoiceToggle } from '@/components/voice/VoiceToggle';
import { VoiceIndicator } from '@/components/voice/VoiceIndicator';
import { getAllMudras, MudraDefinition } from '@/services/mudraLibrary';
import { getRuleByName } from '@/services/ruleRegistry';
import { useTutor } from '@/hooks/useTutor';
import { useVoiceCoach } from '@/hooks/useVoiceCoach';
import { HandGeometry } from '@/utils/geometry/handGeometry';
import { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { useAnalytics } from '@/hooks/useAnalytics';
import { SessionSummaryCard } from '@/components/analytics/SessionSummaryCard';
import { useAICoach } from '@/hooks/useAICoach';
import { AICoachCard } from '@/components/ai/AICoachCard';

export default function PracticePage() {

  console.log("Groq Key:", import.meta.env.VITE_GROQ_API_KEY);

  const mudras = getAllMudras();
  const [selectedMudra, setSelectedMudra] = useState<MudraDefinition>(mudras[0]);
  const [handGeometry, setHandGeometry] = useState<HandGeometry | null>(null);
  const [landmarks, setLandmarks] = useState<NormalizedLandmark[] | null>(null);

  const mudraRule = useMemo(() => getRuleByName(selectedMudra.name), [selectedMudra.name]);

  // Tutor pipeline: hand geometry + rule → smoothed tutor data
  const tutorData = useTutor(handGeometry, mudraRule, landmarks);

  const isTracking = handGeometry !== null;
  const { isSpeaking, voiceEnabled, setVoiceEnabled } = useVoiceCoach(tutorData, isTracking);

  // ── AI Coach Integration (additive) ──
  const {
    feedback: aiFeedback,
    loading: aiLoading,
    error: aiError,
    refresh: refreshAICoach,
  } = useAICoach(tutorData, selectedMudra.name);

  // ── Analytics Integration (additive) ──
  const {
    startSession,
    finishSession,
    recordScore,
    recordMistake,
    markCompleted,
    isSessionActive,
    lastCompletedSession,
    dismissSummary,
  } = useAnalytics();

  // Start a session when the page mounts or mudra changes
  const prevMudraRef = useRef<string | null>(null);
  useEffect(() => {
    if (selectedMudra.name !== prevMudraRef.current) {
      prevMudraRef.current = selectedMudra.name;
      startSession(selectedMudra.name);
    }
  }, [selectedMudra.name, startSession]);

  // Record scores and mistakes as tutor data updates
  useEffect(() => {
    if (!isTracking || !isSessionActive) return;
    recordScore(tutorData.smoothedScore);
    if (tutorData.mostIncorrectFinger) {
      recordMistake(tutorData.mostIncorrectFinger);
    }
  }, [tutorData.smoothedScore, tutorData.mostIncorrectFinger, isTracking, isSessionActive, recordScore, recordMistake]);

  // Auto-finish when mudra is completed
  const completionHandledRef = useRef(false);
  useEffect(() => {
    if (tutorData.isCompleted && !completionHandledRef.current) {
      completionHandledRef.current = true;
      markCompleted();
      finishSession();
    }
    if (!tutorData.isCompleted) {
      completionHandledRef.current = false;
    }
  }, [tutorData.isCompleted, markCompleted, finishSession]);

  const handleFinishSession = useCallback(() => {
    finishSession();
    // Start a new session for the same mudra
    startSession(selectedMudra.name);
  }, [finishSession, startSession, selectedMudra.name]);

  // Callback for CameraView to push hand geometry up
  const handleHandGeometryUpdate = useCallback((geometry: HandGeometry | null) => {
    setHandGeometry(geometry);
  }, []);

  return (
    <div className="flex-grow py-8">
      <div className="container mx-auto px-4">

        {/* Header Section */}
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Practice Session</h1>
          <p className="text-surface-400">
            Select a Mudra and follow the real-time guidance to perfect your hand gesture.
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">

          {/* ── Left Column: Camera + Mudra Selector ── */}
          <div className="lg:col-span-8 flex flex-col space-y-6">

            {/* Camera */}
            <CameraView
              onHandGeometryUpdate={handleHandGeometryUpdate}
              onLandmarksUpdate={setLandmarks}
              tutorData={tutorData}
            />

            {/* Mudra Selector + Description */}
            <div className="glass-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Dropdown */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-surface-300 mb-2">Target Mudra</label>
                  <div className="relative">
                    <select
                      className="w-full bg-surface-900 border border-surface-700 text-white rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer transition-colors hover:border-surface-600"
                      value={selectedMudra.name}
                      onChange={(e) => {
                        const found = mudras.find(m => m.name === e.target.value);
                        if (found) setSelectedMudra(found);
                      }}
                    >
                      {mudras.map(mudra => (
                        <option key={mudra.name} value={mudra.name}>{mudra.name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-surface-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                  </div>
                </div>

                {/* Difficulty badge */}
                <div className="sm:pt-7">
                  <span className="text-xs font-medium bg-surface-800 text-primary-300 px-3 py-1.5 rounded-full border border-surface-700">
                    {selectedMudra.difficulty}
                  </span>
                </div>
              </div>

              {/* Reference Image */}
              <div className="mt-6 aspect-video w-full rounded-xl overflow-hidden bg-surface-800 border border-surface-700">
                <img
                  src={selectedMudra.image}
                  alt={selectedMudra.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Description */}
              <p className="text-surface-300 text-sm leading-relaxed mt-4">
                {selectedMudra.description}
              </p>

              {/* History */}
              {selectedMudra.history && (
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">History & Significance</h4>
                  <p className="text-surface-400 text-sm leading-relaxed">
                    {selectedMudra.history}
                  </p>
                </div>
              )}

              {/* Steps */}
              {selectedMudra.steps && selectedMudra.steps.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">How to form</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-surface-400">
                    {selectedMudra.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Common Mistakes */}
              {selectedMudra.commonMistakes && selectedMudra.commonMistakes.length > 0 && (
                <div className="mt-4 pt-4 border-t border-surface-700/50">
                  <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Common Mistakes</h4>
                  <ul className="space-y-1 text-sm text-surface-400">
                    {selectedMudra.commonMistakes.map((mistake, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* ── Right Column: Tutor Panel ── */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            <div className="lg:sticky lg:top-24 flex flex-col space-y-6">

              {/* Voice Controls */}
              <div className="flex justify-end">
                <VoiceToggle enabled={voiceEnabled} onToggle={setVoiceEnabled} />
              </div>

              {/* Score Card with Progress Ring */}
              <ScoreCard
                score={tutorData.smoothedScore}
                mudraName={selectedMudra.name}
                isCorrect={tutorData.isCorrect}
                performanceBand={tutorData.performanceBand}
                isCompleted={tutorData.isCompleted}
                isTracking={isTracking}
              />

              {/* Per-Finger Accuracy Breakdown */}
              <FingerScore
                fingerAccuracy={tutorData.fingerAccuracy}
              />

              {/* Coach Instructions */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end px-2">
                  <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Coach</span>
                  <VoiceIndicator isSpeaking={isSpeaking} />
                </div>
                <CoachCard
                  coachMessage={tutorData.coachMessage}
                  suggestedCorrections={tutorData.suggestedCorrections}
                  isCorrect={tutorData.isCorrect}
                  isTracking={isTracking}
                />
                
                <AICoachCard
                  feedback={aiFeedback}
                  loading={aiLoading}
                  error={aiError}
                  onRefresh={refreshAICoach}
                  isTracking={isTracking}
                />
              </div>

              {/* Finish Session Button (additive) */}
              {isSessionActive && (
                <button
                  onClick={handleFinishSession}
                  className="w-full h-10 rounded-full bg-surface-800 text-surface-300 text-sm font-medium hover:bg-surface-700 hover:text-white transition-colors border border-surface-700 cursor-pointer"
                >
                  Finish Session
                </button>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* Session Summary Overlay (additive) */}
      {lastCompletedSession && (
        <SessionSummaryCard
          session={lastCompletedSession}
          onDismiss={dismissSummary}
        />
      )}
    </div>
  );
}
