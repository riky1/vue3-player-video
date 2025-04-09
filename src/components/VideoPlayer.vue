<script setup>
import { ref } from 'vue';
import { useVideoPlayer } from '../composables/useVideoPlayer';
import { useVideoEvents } from '../composables/useVideoEvents';
import { useButtonsHandler } from '../composables/useButtonsHandler';
import { useAspectRatio } from '../composables/useAspectRatio';
import { useMimeTypes } from '../composables/useMimeTypes';
import '../assets/video-player.css';

const props = defineProps({
  sources: {
    type: Array,
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
const { state, playVideo, pauseVideo, endVideo, mouseEnterVideo, mouseLiveVideo } = useVideoPlayer(videoRef);
const { btnState, handleButtons } = useButtonsHandler(videoRef, state);

const aspectRatioStyle = useAspectRatio(props.aspectRatio);
const mimeType = useMimeTypes(props.src);

// Handler functions

// Eventi:
// play:          La riproduzione è iniziata
// playing:       La riproduzione è pronta per iniziare dopo essere stata messa in pausa o ritardata a causa della mancanza di dati
// pause:         La riproduzione è stata messa in pausa
// ended:         La riproduzione si è interrotta perché raggiunta la fine del contenuto
// seeking:	      Iniziata un'operazione di ricerca (scrubber)
// seeked:	      Operazione di ricerca completata (rilascia scrubber)
// timeupdate:    Durante la riproduzione (o anche durante lo scrubber, a seconda del browser)
// volumechange:  Il volume è cambiato

const handlePlay = () => {
  if (state.isPlayingOnHover) return;
  console.log('handlePlay');

  playVideo();
};

const handlePause = () => {
  console.log('handlePause');

  pauseVideo();
};

const handleEnd = () => {
  console.log('handleEnd');

  endVideo();
};

const handleVolumeChange = () => {
  if (!state.isPlayingOnClick) return;
  console.log('handleVolumeChange');

  state.isMutedByUser = videoRef.value.muted ? true : false
};

const handleClick = () => {
  if (!videoRef.value) return;
  console.log('handleClick');

  if (state.isPlayingOnClick && !videoRef.value.paused) {
    pauseVideo();
  } else {
    playVideo();
  }
};

const handleMouseEnter = () => {
  if (!videoRef.value) return;
  if (state.isPlayingOnClick) return;
  console.log('handleMouseEnter');

  mouseEnterVideo();
};

const handleMouseLeave = () => {
  if (!videoRef.value) return;
  if (state.isPlayingOnClick) return;  
  console.log('handleMouseLeave');

  mouseLiveVideo();
};

const handleSeeking = () => {
  console.log('handleSeeking');
}

const handleSeeked = () => {
  console.log('handleSeeked');
}

useVideoEvents(videoRef, {
  play: handlePlay,
  pause: handlePause,
  ended: handleEnd,
  volumechange: handleVolumeChange,
  seeking: handleSeeking,
  seeked: handleSeeked
},
  (eventName) => {
    handleButtons(eventName); // run at every event
  }
);
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
        <source v-for="src in sources" :key="src" :src="src" :type="mimeType" />
        <p>
          Your browser doesn't support this video. Consider updating to a new version.
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