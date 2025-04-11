// description: Composable per gestire la logica del video player in Vue 3

import { reactive } from 'vue';

export function useVideoPlayer(videoRef) {
  const state = reactive({
    isPlayingOnClick: false,
    isPlayingOnHover: false,
    isFirstClick: true,
    isMuted: false
  });

  let loopInterval = null;  

  // Helper per resettare il video
  const resetVideo = (reload = true) => {
    videoRef.value.currentTime = 0;
    if (reload) videoRef.value.load();
  };

  // Helper per gestire il mute
  const setMute = (muted) => {
    videoRef.value.muted = muted;
  };

  const playVideoSafely = (video) => {
    if (video.readyState >= 3) {
      video.play();
    } else {
      video.addEventListener('canplay', () => video.play(), { once: true });
    }
  };

  const playVideo = () => {
    if (state.isPlayingOnHover) return;

    if (!state.isPlayingOnClick) {
      resetVideo(false);
    }
  
    clearInterval(loopInterval);
    
    videoRef.value.controls = true;
    state.isPlayingOnClick = true;
    state.isPlayingOnHover = false;

    playVideoSafely(videoRef.value);
  };

  const pauseVideo = () => {
    videoRef.value.pause();
  };

  const endVideo = () => {
    resetVideo();

    state.isPlayingOnClick = false;
    state.isFirstClick = true;
  };

  const mouseEnterVideo = () => {
    if (!videoRef.value || state.isPlayingOnClick) return;
    
    setMute(true);
    videoRef.value.controls = false;
    state.isPlayingOnHover = true;

    playVideoSafely(videoRef.value);
    startLoop();
  }

  const mouseLeaveVideo = () => {
    if (!videoRef.value || state.isPlayingOnClick) return;
    
    stopLoop();
  }

  const startLoop = () => {
    clearInterval(loopInterval);

    loopInterval = setInterval(() => {      
      resetVideo(false);
      playVideoSafely(videoRef.value);
    }, 6000);
  }

  const stopLoop = () => {
    setTimeout(() => {
      clearInterval(loopInterval);
  
      videoRef.value.pause();
      videoRef.value.controls = true;
      resetVideo();
      setMute(state.isMuted);
    }, 4000 - videoRef.value.currentTime * 1000);
  }

  return {
    state,
    playVideo,
    pauseVideo,
    endVideo,
    mouseEnterVideo,
    mouseLeaveVideo
  };
}