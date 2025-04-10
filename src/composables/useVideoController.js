// description: This file contains a composable function that manages the state of multiple video elements.
// It allows for registering, unregistering, and controlling the playback of videos in a Vue 3 application.

export function useVideoController(videos, videoId) {

  const pauseOthersVideos = () => {
    videos.value.forEach(({ videoRef, state }, id) => {
      if (id !== videoId && !videoRef.paused && !state.isPlayingOnHover) {
        videoRef.pause();
      }
    });
  }
  
  return {
    pauseOthersVideos,
  };
}