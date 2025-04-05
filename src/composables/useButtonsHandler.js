import { reactive } from 'vue';

export function useButtonsHandler() {
  const btnState = reactive({
    showPlayButton: true,
    animatePlayButton: false,
    showPauseButton: false,
    animatePauseButton: false,
    loopInterval: null,
  });

  let playButtonTimeout = null;
  let pauseButtonTimeout = null;

  const btnPlayVideo = () => {
    btnState.showPlayButton = true;
    btnState.animatePlayButton = true;
    btnState.showPauseButton = false;
    btnState.animatePauseButton = false;

    clearTimeout(playButtonTimeout);

    playButtonTimeout = setTimeout(() => {
      btnState.animatePlayButton = false;
      btnState.showPlayButton = false;
    }, 200);
  }

  const btnPauseVideo = () => {
    btnState.animatePauseButton = true;
    btnState.showPauseButton = true;
    btnState.animatePlayButton = false;

    clearTimeout(pauseButtonTimeout);

    pauseButtonTimeout = setTimeout(() => {
      btnState.animatePauseButton = false;
      btnState.showPauseButton = false;
    }, 200);
  }

  return {
    btnState,
    btnPlayVideo,
    btnPauseVideo
  };
}