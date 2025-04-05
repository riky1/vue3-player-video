<script setup>
import { ref } from 'vue';
import { useVideoPlayer } from '../composables/useVideoPlayer';
import { useVideoEvents } from '../composables/useVideoEvents';
import { useButtonsHandler } from '../composables/useButtonsHandler';
import { useAspectRatio } from '../composables/useAspectRatio';
import { useVideoType } from '../composables/useVideoType';
import '../assets/video-player.css';

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: 'Video Poster',
  },
  aspectRatio: {
    type: String,
    default: '16/9',
    validator: (value) => ['16/9', '9/16', '4/3', '1/1'].includes(value)
  },
});

const videoRef = ref(null);
const { state, playVideo, pauseVideo, startLoop, stopLoop } = useVideoPlayer(videoRef);
const { btnState, btnPlayVideo, btnPauseVideo } = useButtonsHandler();

const aspectRatioStyle = useAspectRatio(props.aspectRatio);
const videoType = useVideoType(props.src);

// Handler functions

//TODO: handle scrubber
// problema: quando viene trascinato si vedono le icone play e pause
// Eventi:
// seeking:	Appena l'utente inizia a cercare (scrub)
// seeked:	Quando ha finito di cercare (rilascia scrub)
// timeupdate: Durante la riproduzione (o anche durante lo scrub, a seconda del browser)

const handlePlay = () => {
  if (state.isPlayingOnHover) return;

  playVideo();
  btnPlayVideo();
};

const handlePause = () => {
  pauseVideo();
  btnPauseVideo();
};

const handleEnd = () => {
  videoRef.value.currentTime = 0;
  videoRef.value.load();
  state.isPlayingOnClick = false;
};

const handleVolumeChange = () => {
  if (!state.isPlayingOnClick) return;

  state.isMutedByUser = videoRef.value.muted ? true : false
};

const handleClick = () => {
  if (!videoRef.value) return;

  if (state.isPlayingOnClick && !videoRef.value.paused) {
    pauseVideo();
    btnPauseVideo();
  } else {
    playVideo();
    btnPlayVideo();
  }
};

const handleMouseEnter = () => {
  if (!videoRef.value) return;

  if (state.isPlayingOnClick) {
    // if (videoRef.value.paused) {
    //   btnState.showPlayButton = true;
    // } 

    return;
  } 

  videoRef.value.muted = true;
  videoRef.value.controls = false;
  state.isPlayingOnHover = true;
  videoRef.value.play();

  startLoop();
};

const handleMouseLeave = () => {
  if (!videoRef.value) return;

  if (state.isPlayingOnClick) {
    // btnState.showPlayButton = false;
    return;
  } 

  stopLoop();
};

useVideoEvents(videoRef, {
  play: handlePlay,
  pause: handlePause,
  ended: handleEnd,
  volumechange: handleVolumeChange
});
</script>

<template>
  <section 
    class="video-player"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <figure class="video-wrapper" :style="aspectRatioStyle">
      <video 
        ref="videoRef"
        class="video" 
        controls 
        preload="auto" 
        playsinline
        :poster="poster" 
        :aria-label="description"
        @click.prevent="handleClick"
      >
        <source :src="src" :type="videoType" />
        <p>
          Your browser doesn't support this video. Here is a <a :href="src">link to the video</a> instead.
        </p>
      </video>

      <button 
        :class="['play-button play',
          { show: btnState.showPlayButton },
          { animate: btnState.animatePlayButton }
        ]" 
        aria-label="Play button"
        @click.prevent="handleClick"
      ></button>

      <button 
        :class="['play-button pause',
          { show: btnState.showPauseButton },
          { animate: btnState.animatePauseButton }
        ]" 
        aria-label="Play button"
        @click.prevent="handleClick"
      >
        <div class="pause-icon"></div>
      </button>
    </figure>
  </section>
</template>

<style lang="scss" scoped>
// Normalize
figure {
  margin: 0;
  padding: 0;
}

// VideoPlayer
.video-player {
  position: relative;
  width: 100%;
  cursor: pointer;
}

.video-wrapper {
  position: relative;
  width: 100%;
}

.video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

// Play Button

.play-button {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;  
  width: 60px;
  height: 60px;
  background: var(--play-button-bg);
  border: none;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);  
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: background 0.3s, box-shadow 0.3s;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  transform-origin: center;

  &.show {
    opacity: 1;      
  }

  &.animate {
    transform: translate(-50%, -50%) scale(1.3);
  }

  &.play { 
    &::before {
      content: '';
      display: block;
      width: 0;
      height: 0;
      margin-left: 2px;
      border-left: 18px solid var(--play-button-arrow);
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
    }
  }

  &.pause {
    .pause-icon {
      width: 20px;
      height: 30px;
      position: relative;
      display: flex;
      justify-content: space-between;
    }

    .pause-icon::before,
    .pause-icon::after {
      content: "";
      width: 8px;
      height: 100%;
      background-color: var(--play-button-arrow);
      border-radius: 2px;
    }
  }
}

.video-player {
  &:hover {
    .play-button {
      background: var(--play-button-bg-hover);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }
  }
}
</style>