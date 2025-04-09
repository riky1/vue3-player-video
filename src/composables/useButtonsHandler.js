import { reactive } from 'vue';

export function useButtonsHandler(videoRef, state) {
  const btnState = reactive({
    showPlayButton: true,
    animatePlayButton: false,
    showPauseButton: false,
    animatePauseButton: false,
    loopInterval: null,
  });

  let playButtonTimeout = null;
  let pauseButtonTimeout = null;

  const clearAllTimeouts = () => {
    clearTimeout(playButtonTimeout);
    clearTimeout(pauseButtonTimeout);
  };

  const showPlayBtn = (showAtEnd = false, animate = true, timeout = 200) => {
    btnState.showPlayButton = true;
    btnState.animatePlayButton = animate;

    clearTimeout(playButtonTimeout);

    if (timeout) {
      playButtonTimeout = setTimeout(() => {
        btnState.animatePlayButton = false;
        btnState.showPlayButton = showAtEnd;
      }, timeout);
    }
  };

  const showPauseBtn = (animate = true, timeout = 200) => {
    btnState.showPauseButton = true;
    btnState.animatePauseButton = animate;

    clearTimeout(pauseButtonTimeout);

    if (timeout) {
      pauseButtonTimeout = setTimeout(() => {
        btnState.animatePauseButton = false;
        btnState.showPauseButton = false;
      }, timeout);
    }
  };

  const hideButtons = () => {
    btnState.showPlayButton = false;
    btnState.animatePlayButton = false;
    btnState.showPauseButton = false;
    btnState.animatePauseButton = false;
  };

  const handleButtons = (eventName) => {
    console.log(`eventName: ${eventName}`);

    if (state.isPlayingOnHover && ['play', 'seeked', 'seeking'].includes(eventName)) {
      return;
    }

    switch (eventName) {
      case 'play':
        showPlayBtn();
        break;

      case 'pause':
        if (videoRef.value.currentTime !== videoRef.value.duration) {
          showPauseBtn();
        }
        break;

      case 'seeked':
        if (state.isFirstClick) {
          showPlayBtn();
          state.isFirstClick = false;
        }
        break;

      case 'seeking':
        clearAllTimeouts();
        hideButtons();
        break;

      case 'ended':
        showPlayBtn(true);
        break;
    }
  };

  return {
    btnState,
    handleButtons
  };
}
