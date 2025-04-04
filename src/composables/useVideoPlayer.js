import { reactive } from 'vue';

export function useVideoPlayer(videoRef) {
  const state = reactive({
    isPlayingOnClick: false,
    isPlayingOnHover: false,
    isMutedByUser: false,
    showPlayButton: true,
    loopInterval: null,
  });

  const playVideo = () => {
    if (!state.isPlayingOnClick) {
      videoRef.value.currentTime = 0;
    }
  
    clearInterval(state.loopInterval);
  
    if (state.isMutedByUser) {
      videoRef.value.muted = true;
    } else {
      videoRef.value.muted = false;
    }
    
    state.showPlayButton = false;
    videoRef.value.controls = true;
    state.isPlayingOnClick = true;
    videoRef.value.play();
  };

  const pauseVideo = () => {
    state.showPlayButton = true;
    videoRef.value.pause();
  };

  const startLoop = () => {
    clearInterval(state.loopInterval);

    state.loopInterval = setInterval(() => {
      if (videoRef.value && !state.isPlayingOnClick) {
        videoRef.value.currentTime = 0;
        videoRef.value.play();
      }
    }, 6000);
  }

  const stopLoop = () => {
    setTimeout(() => {
      clearInterval(state.loopInterval);
  
      videoRef.value.pause();
      videoRef.value.controls = true;
      videoRef.value.currentTime = 0;
      videoRef.value.muted = false;
      videoRef.value.load();
    }, 4000 - videoRef.value.currentTime * 1000);
  }

  return {
    state,
    playVideo,
    pauseVideo,
    startLoop,
    stopLoop
  };
}