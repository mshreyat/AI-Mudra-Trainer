import React, { useRef, useEffect } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { useHandTracking } from '@/hooks/useHandTracking';
import { drawHandSkeleton } from '@/utils/drawHandSkeleton';
import { Button } from '@/components/common/Button';
import { HandGeometry } from '@/utils/geometry/handGeometry';
import { TutorData } from '@/hooks/useTutor';
import { useVisualCoach } from '@/hooks/useVisualCoach';
import { FingerOverlay } from '@/components/coach/FingerOverlay';
import { FingerHighlight } from '@/components/coach/FingerHighlight';
import { CoachBubble } from '@/components/coach/CoachBubble';
import { NormalizedLandmark } from '@mediapipe/tasks-vision';

interface CameraViewProps {
  /** Optional callback invoked on every frame with the latest HandGeometry (or null if no hand). */
  onHandGeometryUpdate?: (geometry: HandGeometry | null) => void;
  /** Optional callback invoked on every frame with the raw landmarks. */
  onLandmarksUpdate?: (landmarks: NormalizedLandmark[] | null) => void;
  /** Optional tutor data to drive the Visual Coach overlay. */
  tutorData?: TutorData;
}

export const CameraView: React.FC<CameraViewProps> = ({ onHandGeometryUpdate, onLandmarksUpdate, tutorData }) => {
  const { videoRef, isLoading: isCameraLoading, error, startCamera } = useCamera();
  const { handDetected, landmarks, handedness, handGeometry, fps } = useHandTracking(videoRef);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visualInstructions = useVisualCoach(tutorData || null);

  // Draw overlay whenever landmarks change
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (canvas && video && video.readyState >= 2) {
      // Ensure canvas strictly matches video dimensions for accurate overlay
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (landmarks && handDetected) {
          drawHandSkeleton(ctx, landmarks, canvas.width, canvas.height);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  }, [landmarks, handDetected, videoRef]);

  // Notify parent of hand geometry changes
  useEffect(() => {
    onHandGeometryUpdate?.(handGeometry);
  }, [handGeometry, onHandGeometryUpdate]);

  // Notify parent of landmarks changes
  useEffect(() => {
    onLandmarksUpdate?.(landmarks);
  }, [landmarks, onLandmarksUpdate]);

  return (
    <div className="relative w-full max-w-5xl mx-auto aspect-video rounded-3xl overflow-hidden bg-surface-900 border border-surface-700/50 shadow-2xl flex flex-col items-center justify-center">
      {/* Loading State */}
      {isCameraLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-900 z-30">
          <div className="w-12 h-12 border-4 border-surface-700 border-t-primary-500 rounded-full animate-spin mb-4"></div>
          <p className="text-surface-300 font-medium">Initializing camera...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && !isCameraLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-900 p-6 text-center z-30">
          <div className="w-16 h-16 rounded-full bg-red-900/20 text-red-500 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="12" y1="10" x2="12" y2="16"/></svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">Camera Unavailable</h3>
          <p className="text-surface-400 max-w-md mb-6">{error}</p>
          <Button onClick={() => startCamera()} variant="outline">
            Try Again
          </Button>
        </div>
      )}

      {/* Video Stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-700 ${
          isCameraLoading || error ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      {/* Canvas Overlay for MediaPipe - Must mirror identically to video */}
      <canvas 
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full object-cover transform scale-x-[-1] z-10 transition-opacity duration-700 ${
          isCameraLoading || error ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      {/* Overlay UI (Status badges, FPS, Hand detection) */}
      {!isCameraLoading && !error && (
        <>
          <div className="absolute top-4 left-4 bg-surface-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-surface-700/50 flex items-center space-x-2 z-20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-medium text-white tracking-wide">CAMERA ACTIVE</span>
            <span className="text-xs text-surface-400 border-l border-surface-700 pl-2 ml-2">{fps} FPS</span>
          </div>

          <div className="absolute top-4 right-4 bg-surface-950/60 backdrop-blur-md px-4 py-2 rounded-xl border border-surface-700/50 flex flex-col items-end z-20 transition-colors">
            {!handDetected ? (
              <span className="text-sm font-medium text-surface-400">No hand detected</span>
            ) : (
              <>
                <span className="text-sm font-medium text-primary-300 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2"></span>
                  Hand Detected
                </span>
                {handedness && (
                  <span className="text-xs text-surface-300 mt-0.5">{handedness} Hand</span>
                )}
              </>
            )}
          </div>
          
          {/* Debugging Panel for Geometry Engine */}
          {handGeometry && handDetected && (
            <div className="absolute bottom-4 left-4 bg-surface-950/80 backdrop-blur-md p-4 rounded-xl border border-surface-700/50 z-20 min-w-[200px] hidden lg:block">
              <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3 border-b border-surface-700/50 pb-2">Geometry Engine</h4>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-surface-300">Thumb</span>
                  <span className="font-medium text-white">{handGeometry.thumb.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-300">Index</span>
                  <span className="font-medium text-white">{handGeometry.index.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-300">Middle</span>
                  <span className="font-medium text-white">{handGeometry.middle.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-300">Ring</span>
                  <span className="font-medium text-white">{handGeometry.ring.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-300">Little</span>
                  <span className="font-medium text-white">{handGeometry.little.state}</span>
                </div>
                <div className="flex justify-between pt-2 mt-2 border-t border-surface-700/50">
                  <span className="text-surface-300">Palm</span>
                  <span className="font-medium text-primary-300">{handGeometry.palm.orientation}</span>
                </div>
              </div>
            </div>
          )}

          {/* Visual AI Coach Overlay */}
          {visualInstructions && landmarks && handDetected && (
            <>
              <FingerOverlay 
                landmarks={landmarks} 
                fingerColors={visualInstructions.fingerColors} 
              />
              <FingerHighlight 
                landmarks={landmarks}
                highlightedFinger={visualInstructions.highlightedFinger}
                highlightColor={visualInstructions.highlightColor}
                animationType={visualInstructions.animationType}
              />
              <CoachBubble
                landmarks={landmarks}
                highlightedFinger={visualInstructions.highlightedFinger}
                message={visualInstructions.overlayMessage}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};
