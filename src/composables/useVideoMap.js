// description: This composable manages a map of video elements and their states.
// It allows for registering and unregistering video elements, and provides a unique ID for each video element.

import { ref, onMounted, onBeforeUnmount } from 'vue';

const videos = ref(new Map());

export function useVideoMap(videoRef, state) {

  const videoId = `video-${Math.random().toString(36).slice(2)}`;

  const register = () => {
    videos.value.set(videoId, {
      videoRef: videoRef.value,
      state
    });
  };

  const unregister = () => {
    videos.value.delete(videoId);
  };

  onMounted(() => {
    if (videoRef.value) register();
  });
  
  onBeforeUnmount(() => {
    unregister();
  });

  return {
    videos,
    videoId
  };
}