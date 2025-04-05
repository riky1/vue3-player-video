import { reactive } from 'vue';

export function useVideoPlayer(videoRef) {
  const state = reactive({
    isPlayingOnClick: false,
    isPlayingOnHover: false,
    isMutedByUser: false,
    showPlayButton: true,
    animatePlayButton: false,
    showPauseButton: false,
    animatePauseButton: false,
    loopInterval: null,
  });

  let playButtonTimeout = null;
  let pauseButtonTimeout = null;

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
    
    state.showPlayButton = true;
    state.animatePlayButton = true;
    state.showPauseButton = false;
    state.animatePauseButton = false;

    videoRef.value.controls = true;
    state.isPlayingOnClick = true;
    state.isPlayingOnHover = false;
    
    videoRef.value.play();

    clearTimeout(playButtonTimeout);

    playButtonTimeout = setTimeout(() => {
      state.animatePlayButton = false;
      state.showPlayButton = false;
    }, 200);
  };

  const pauseVideo = () => {
    state.animatePauseButton = true;
    state.showPauseButton = true;
    state.animatePlayButton = false;

    videoRef.value.pause();

    clearTimeout(pauseButtonTimeout);

    pauseButtonTimeout = setTimeout(() => {
      state.animatePauseButton = false;
      state.showPauseButton = false;
    }, 200);
  };

  const startLoop = () => {
    clearInterval(state.loopInterval);

    state.loopInterval = setInterval(() => {      
      videoRef.value.currentTime = 0;
      videoRef.value.play();
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