// description: Composable per gestire la logica del video player in Vue 3

import { reactive } from 'vue';

export function useVideoPlayer(videoRef, options = {}) {
  const state = reactive({
    isPlayingOnClick: false,
    isPlayingOnHover: false,
    isFirstClick: true,
    isMuted: false,
    showPoster: true
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

  // video.readyState ritorna un numero da 0 a 4 che indica lo stato del video:
  // 0 (HAVE_NOTHING)	Il video non ha ancora caricato nulla.
  // 1 (HAVE_METADATA)	I metadati (dimensioni, durata ecc.) sono disponibili.
  // 2 (HAVE_CURRENT_DATA)	È disponibile almeno un frame del video.
  // 3 (HAVE_FUTURE_DATA)	Il video può essere riprodotto, ma potrebbe interrompersi.
  // 4 (HAVE_ENOUGH_DATA)	Il video può essere riprodotto fino alla fine senza interruzioni.

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
    
    // options
    if (options.controls) {
      videoRef.value.controls = true;
    } else {
      videoRef.value.controls = false;
    }

    state.isPlayingOnClick = true;
    state.isPlayingOnHover = false;
    state.showPoster = false;

    playVideoSafely(videoRef.value);
  };

  const pauseVideo = () => {
    videoRef.value.pause();
  };

  const endVideo = () => {
    state.isPlayingOnClick = false;
    state.isFirstClick = true;
    state.showPoster = true;

    resetVideo();
  };

  const mouseEnterVideo = () => {
    if (!videoRef.value || state.isPlayingOnClick) return;

    // options
    if (!options.allowPreview) {
      return
    }
    
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
    state.showPoster = false;

    loopInterval = setInterval(() => {  
      // fix: on first click -> video starts, then stopsand shows poster
      if (!state.isPlayingOnHover) return;

      resetVideo(false);
      videoRef.value.play();
    }, 6000);
  }

  const stopLoop = () => {
    const delay = Math.max(0, 4000 - videoRef.value.currentTime * 1000);
  
    setTimeout(() => {
      clearInterval(loopInterval);

      // fix: on first click -> video starts, then stopsand shows poster
      if (!state.isPlayingOnHover || state.isPlayingOnClick) return;
  
      videoRef.value.pause();
      videoRef.value.controls = false;
      state.showPoster = true;
      resetVideo();
      setMute(state.isMuted);
    }, delay);
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