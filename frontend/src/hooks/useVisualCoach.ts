import { useMemo } from "react";
import { TutorData } from "./useTutor";
import { getVisualInstructions, VisualInstructions } from "../services/visualCoach";

/**
 * Consumes smoothed TutorData and converts it into stable VisualInstructions.
 * Since TutorData is already smoothed via a 20-frame rolling buffer, 
 * this hook primarily acts as a bridge to avoid complex logic in the UI components,
 * while preventing unnecessary re-renders.
 */
export const useVisualCoach = (tutorData: TutorData | null): VisualInstructions | null => {
  return useMemo(() => {
    if (!tutorData || tutorData.smoothedScore === 0 && !tutorData.isCorrect && tutorData.mostIncorrectFinger === null) {
      // Treat as idle / no data if not tracking
      return null;
    }
    
    return getVisualInstructions(tutorData);
  }, [tutorData]);
};
