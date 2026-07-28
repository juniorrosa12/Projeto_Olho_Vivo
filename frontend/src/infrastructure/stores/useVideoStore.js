import { create } from 'zustand';

export const useVideoStore = create((set) => ({
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  fps: 30,
  playbackRate: 1.0,
  volume: 1.0,
  isMuted: true,

  setPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setFps: (fps) => set({ fps }),
  setPlaybackRate: (playbackRate) => set({ playbackRate }),
  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  resetVideo: () =>
    set({
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      playbackRate: 1.0,
    }),
}));
