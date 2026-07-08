/**
 * Preloads a video file and resolves to an HTMLVideoElement.
 * This reads the metadata so we know the video duration, height, and width.
 */
export const loadVideo = (file: File): Promise<HTMLVideoElement> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    
    // Create local object URL for the uploaded file
    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    video.onloadedmetadata = () => {
      resolve(video);
    };

    video.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };
  });
};

/**
 * Extracts and samples frames from a video file sequentially.
 *
 * It uses a single recycled canvas to avoid huge memory footprints
 * during sequential extraction, enabling mobile and low-spec browser safety.
 *
 * @param video - The preloaded HTMLVideoElement
 * @param sampleRateMs - How often to sample frames in milliseconds (e.g. 250ms)
 * @param onFrame - Async callback triggered for every drawn frame
 * @param onProgress - Callback indicating progress percentage (0 to 100)
 */
export const extractFrames = async (
  video: HTMLVideoElement,
  sampleRateMs: number,
  onFrame: (canvas: HTMLCanvasElement, timestampSeconds: number) => Promise<void>,
  onProgress: (percentage: number) => void
): Promise<void> => {
  const duration = video.duration;
  if (!duration || isNaN(duration)) {
    throw new Error("Invalid video duration.");
  }

  // Create canvas for drawing frames
  const canvas = document.createElement("canvas");
  
  // Downscale slightly to 640x480 for faster MediaPipe processing and performance
  canvas.width = 640;
  canvas.height = 480;

  const sampleRateSeconds = sampleRateMs / 1000;
  const totalFramesToExtract = Math.floor(duration / sampleRateSeconds) + 1;
  
  let frameIndex = 0;

  for (let time = 0; time <= duration; time += sampleRateSeconds) {
    await new Promise<void>((resolve) => {
      const onSeeked = async () => {
        video.removeEventListener("seeked", onSeeked);

        // Draw current frame to offscreen canvas
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }

        // Run analysis on the drawn frame canvas
        await onFrame(canvas, time);

        // Update progress
        frameIndex++;
        const pct = Math.min(100, Math.round((frameIndex / totalFramesToExtract) * 100));
        onProgress(pct);

        resolve();
      };

      video.addEventListener("seeked", onSeeked);
      video.currentTime = time;
    });
  }

  // Revoke object URL to free memory
  if (video.src) {
    URL.revokeObjectURL(video.src);
  }
};
