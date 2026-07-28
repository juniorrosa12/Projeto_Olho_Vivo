/**
 * Engine utilitária para cálculo e navegação precisa frame-a-frame de vídeos de evidências.
 */
export class FrameStepperEngine {
  constructor(fps = 30) {
    this.fps = fps;
  }

  timeToFrame(seconds) {
    return Math.floor(seconds * this.fps);
  }

  frameToTime(frameNumber) {
    return frameNumber / this.fps;
  }

  getNextFrameTime(currentTime) {
    const currentFrame = this.timeToFrame(currentTime);
    return this.frameToTime(currentFrame + 1);
  }

  getPrevFrameTime(currentTime) {
    const currentFrame = this.timeToFrame(currentTime);
    return this.frameToTime(Math.max(0, currentFrame - 1));
  }

  formatTimecode(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00.00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);

    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(mins)}:${pad(secs)}.${pad(ms)}`;
  }
}
