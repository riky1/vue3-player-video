import { ref, onMounted, onBeforeUnmount } from 'vue';

const videos = ref(new Map());

export function useVideoController(videoRef, state) {

  const videoId = `video-${Math.random().toString(36).slice(2)}`;

  const register = () => {
    videos.value.set(videoId, {
      videoRef: videoRef.value,
      state,
    });
  };

  const unregister = () => {
    videos.value.delete(videoId);
  };

  const pauseOthersVideos = () => {

    videos.value.forEach(({ videoRef, state }, id) => {
      if (id !== videoId && !videoRef.paused && !state.isPlayingOnHover) {
        videoRef.pause();
      }
    });
    
  }

  onMounted(() => {
    if (videoRef.value) register();
  });
  
  onBeforeUnmount(() => {
    unregister();
  });
  
  return {
    pauseOthersVideos,
  };
}