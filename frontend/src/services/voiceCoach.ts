import { TutorData } from "../hooks/useTutor";

export class VoiceCoachEngine {
  private lastSpokenMessage: string | null = null;
  private lastSpeakTime: number = 0;
  private lastScore: number = 0;
  private wasCorrect: boolean = false;
  private handLostSince: number | null = null;

  // Cooldowns
  private readonly GENERAL_COOLDOWN_MS = 4000;
  private readonly REPEAT_COOLDOWN_MS = 10000;
  private readonly HAND_LOST_THRESHOLD_MS = 3000;

  /**
   * Processes the current frame data and returns a string if the voice coach should speak.
   * Returns null if it should remain silent.
   */
  public processFrame(tutorData: TutorData | null, isTracking: boolean): string | null {
    const now = Date.now();

    // 1. Hand Lost Logic
    if (!isTracking) {
      if (!this.handLostSince) {
        this.handLostSince = now;
      } else if (now - this.handLostSince > this.HAND_LOST_THRESHOLD_MS) {
        const msg = "Please show your hand to the camera.";
        if (this.canSpeak(msg, now)) {
          this.commitSpeech(msg, now);
          return msg;
        }
      }
      return null;
    }

    // We are tracking, reset hand lost timer
    this.handLostSince = null;
    
    if (!tutorData) return null;

    let messageToSpeak: string | null = null;

    // 2. Mudra completed or mistake fixed
    if (tutorData.isCorrect) {
      if (!this.wasCorrect) {
        // Transitioned from incorrect to correct
        messageToSpeak = "Excellent. Hold the mudra.";
      }
    } else {
      // 3. New mistake or general correction
      if (tutorData.coachMessage) {
        // Format the message slightly if needed, but TutorEngine already provides good strings
        // like "Straighten your middle finger."
        
        // Speak if it's a new instruction we haven't given recently
        if (tutorData.coachMessage !== this.lastSpokenMessage) {
          messageToSpeak = tutorData.coachMessage;
        } else if (tutorData.smoothedScore < this.lastScore - 15) {
          // Speak if the score dropped significantly, even if it's the same error
          messageToSpeak = tutorData.coachMessage;
        }
      }
    }

    // Update state trackers for the next frame
    this.wasCorrect = tutorData.isCorrect;
    this.lastScore = tutorData.smoothedScore;

    // Evaluate cooldowns
    if (messageToSpeak && this.canSpeak(messageToSpeak, now)) {
      this.commitSpeech(messageToSpeak, now);
      return messageToSpeak;
    }

    return null;
  }

  private canSpeak(message: string, now: number): boolean {
    // Global minimum delay between any two sentences
    if (now - this.lastSpeakTime < this.GENERAL_COOLDOWN_MS) {
      return false;
    }
    
    // Longer delay before repeating the exact same sentence
    if (message === this.lastSpokenMessage && now - this.lastSpeakTime < this.REPEAT_COOLDOWN_MS) {
      return false;
    }
    
    return true;
  }

  private commitSpeech(message: string, now: number): void {
    this.lastSpeakTime = now;
    this.lastSpokenMessage = message;
  }
}
