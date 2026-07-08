import { useState } from "react";
import { getAllMudras } from "@/services/mudraLibrary";
import { analyzeVideoPerformance } from "@/services/performanceAnalyzer";
import { generateGuruPerformanceReview } from "@/services/llmService";
import { VideoUploader } from "@/components/review/VideoUploader";
import { VideoPreview } from "@/components/review/VideoPreview";
import { ReviewProgress } from "@/components/review/ReviewProgress";
import { PerformanceSummary } from "@/components/review/PerformanceSummary";
import { PerformanceMetrics } from "@/components/review/PerformanceMetrics";
import { PerformanceTimeline } from "@/components/review/PerformanceTimeline";
import { GuruReviewCard } from "@/components/review/GuruReviewCard";
import { Button } from "@/components/common/Button";
import type { PerformanceReport } from "@/types/review";

export default function ReviewPage() {
  const mudras = getAllMudras();
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [selectedMudraName, setSelectedMudraName] = useState<string>(mudras[0].name);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [report, setReport] = useState<PerformanceReport | null>(null);

  const [guruReview, setGuruReview] = useState("");
  const [guruReviewLoading, setGuruReviewLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setVideoFile(file);
    setError(null);
    setReport(null);
    setGuruReview("");
  };

  const handleClearFile = () => {
    setVideoFile(null);
    setReport(null);
    setGuruReview("");
    setError(null);
  };

  const runAnalysis = async () => {
    if (!videoFile) return;

    setIsAnalyzing(true);
    setProgress(0);
    setError(null);
    setStatus("Initializing hand landmarker models...");

    try {
      const result = await analyzeVideoPerformance(
        videoFile,
        selectedMudraName,
        (pct) => {
          setProgress(pct);
          setStatus(`Analyzing frame-by-frame gestures (${pct}%)...`);
        }
      );

      setReport(result);
      setIsAnalyzing(false);

      // Trigger Guru review generation
      setGuruReviewLoading(true);
      try {
        const reviewText = await generateGuruPerformanceReview({
          expectedMudra: result.expectedMudra,
          averageAccuracy: result.averageAccuracy,
          bestFrame: result.bestFrame,
          worstFrame: result.worstFrame,
          commonFingerErrors: result.commonFingerErrors,
        });
        setGuruReview(reviewText);
      } catch (reviewErr) {
        console.error("AI Guru review generation error:", reviewErr);
      } finally {
        setGuruReviewLoading(false);
      }

    } catch (err: any) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : String(err));
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setVideoFile(null);
    setReport(null);
    setGuruReview("");
    setError(null);
  };

  return (
    <div className="flex-grow py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Section */}
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Review Performance
          </h1>
          <p className="text-surface-400">
            Upload your recorded practice video to run a precise offline gesture assessment.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-fade-in">
            {error}
          </div>
        )}

        {/* ── Workflow Step 1: Upload & Configure ── */}
        {!isAnalyzing && !report && (
          <div className="space-y-6">
            <VideoUploader
              selectedFile={videoFile}
              onFileSelect={handleFileSelect}
              onClear={handleClearFile}
            />

            {videoFile && (
              <div className="glass-card p-6 border border-surface-700/50 space-y-6 animate-fade-in">
                <VideoPreview file={videoFile} />

                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-surface-300 mb-2">
                      Expected Mudra
                    </label>
                    <div className="relative">
                      <select
                        className="w-full bg-surface-900 border border-surface-700 text-white rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer hover:border-surface-600 transition-colors"
                        value={selectedMudraName}
                        onChange={(e) => setSelectedMudraName(e.target.value)}
                      >
                        {mudras.map((m) => (
                          <option key={m.name} value={m.name}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-surface-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={runAnalysis}
                    className="w-full md:w-auto h-12 px-8 font-semibold"
                  >
                    Analyze Video
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Workflow Step 2: Progress ── */}
        {isAnalyzing && (
          <div className="py-12">
            <ReviewProgress progress={progress} status={status} />
          </div>
        )}

        {/* ── Workflow Step 3: Performance Report ── */}
        {!isAnalyzing && report && (
          <div className="space-y-6 animate-fade-in">
            {/* Header Summary */}
            <PerformanceSummary
              expectedMudra={report.expectedMudra}
              averageAccuracy={report.averageAccuracy}
              durationSeconds={report.durationSeconds}
              totalFrames={report.totalFrames}
              detectedFrames={report.detectedFrames}
            />

            {/* Guru review feedback */}
            <GuruReviewCard reviewText={guruReview} loading={guruReviewLoading} />

            {/* Core Metrics & Timeline */}
            <PerformanceMetrics
              bestFrame={report.bestFrame}
              worstFrame={report.worstFrame}
              commonFingerErrors={report.commonFingerErrors}
              detectedFrames={report.detectedFrames}
            />

            <PerformanceTimeline timeline={report.timeline} />

            {/* Bottom upload another action */}
            <div className="flex justify-center pt-4">
              <Button onClick={handleReset} variant="outline" size="md">
                Upload Another Video
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
