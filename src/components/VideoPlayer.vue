<script setup>
import { ref } from 'vue';
import { useVideoPlayer } from '../composables/useVideoPlayer';
import { useVideoMap } from '../composables/useVideoMap';
import { useVideoEvents } from '../composables/useVideoEvents';
import { useButtonsHandler } from '../composables/useButtonsHandler';
import { useVideoController } from '../composables/useVideoController';
import { useAudioSettings } from '../composables/useAudioSettings';
import { useOptions } from '../composables/useOptions';
import { useAspectRatio } from '../composables/useAspectRatio';
import { useMimeTypes } from '../composables/useMimeTypes';

import '../assets/video-player.css';

const props = defineProps({
  sources: {
    type: Array,
    required: true
  },
  poster: {
    type: String
  },
  title: {
    type: String
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
  subtitles: {
    type: Array,
    default: () => []
  },
  options: {
    type: Object,
    default: () => ({})
  },
  globalOptions: {
    type: Object,
    default: () => ({})
  }
});

const videoRef = ref(null);

const options = useOptions(props.globalOptions, props.options)
const { state, playVideo, pauseVideo, endVideo, mouseEnterVideo, mouseLeaveVideo } = useVideoPlayer(videoRef, options.value);
const { videos, videoId } = useVideoMap(videoRef, state);
const { btnState, handleButtons } = useButtonsHandler(videoRef, state);
const { pauseOthersVideos } = useVideoController(videos, videoId);
const { syncVideoAudioState, updateAudioPreference } = useAudioSettings(videoRef, state);

const aspectRatioStyle = useAspectRatio(props.aspectRatio);

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

const handleClick = () => {
  if (!videoRef.value) return;
  console.log('handleClick');

  if (state.isPlayingOnClick && !videoRef.value.paused) {
    pauseVideo();
  } else {
    state.isPlayingOnHover = false;

    pauseOthersVideos();
    syncVideoAudioState();
    playVideo();    
  }
};

const handleVolumeChange = () => {
  if (!state.isPlayingOnClick) return;
  console.log('handleVolumeChange');

  const muted = videoRef.value.muted;
  const volume = videoRef.value.volume;
  updateAudioPreference(muted, volume, videos);
};

const handleSeeking = () => {
  console.log('handleSeeking');
}

const handleSeeked = () => {
  console.log('handleSeeked');
}

useVideoEvents(videoRef, {
  play: playVideo,
  pause: pauseVideo,
  ended: endVideo,
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
    @mouseenter="mouseEnterVideo"
    @mouseleave="mouseLeaveVideo"
  >
    <figure class="video-wrapper" :style="{ aspectRatio: aspectRatio }">
      <video 
        ref="videoRef"
        class="video" 
        preload="metadata" 
        playsinline
        :aria-label="description"
        @click.prevent="handleClick"
        :loop="options.loop"
        :autoplay="options.autoplay"
        :disablePictureInPicture="options.disablePictureInPicture"
      >
        <source v-for="src in sources" :key="src" :src="src" :type="useMimeTypes(src)" />
        
        <template v-if="subtitles">
          <track v-for="subtitle in subtitles" 
            kind="subtitles"
            class="subtitles"
            :key="subtitle.src" 
            :src="subtitle.src" 
            :srclang="subtitle.lang" 
            :label="subtitle.label" 
          />
        </template>

        <p>
          Your browser doesn't support this video. Consider updating to a new version.
        </p>
      </video>

      <div v-if="state.showOverlay" 
        class="overlay"
        @click.prevent="handleClick"
        tabindex="-1"
        aria-hidden="true"
      ></div>

      <img  
        :src="poster" 
        :class="['poster', { show: state.showPoster }]"
        :alt="description"
        @click.prevent="handleClick"
        tabindex="-1"
        aria-hidden="true"
      />

      <button 
        :class="['play-button play',
          { show: btnState.showPlayButton },
          { animate: btnState.animatePlayButton }
        ]" 
        aria-label="Play"
        @click.prevent="handleClick"
      ></button>

      <button 
        :class="['play-button pause',
          { show: btnState.showPauseButton },
          { animate: btnState.animatePauseButton }
        ]" 
        aria-label="Pause"
        @click.prevent="handleClick"
      >
        <div class="pause-icon"></div>
      </button>

      <figcaption v-if="state.showTitle" 
        class="video-title"
        @click.prevent="handleClick"
        tabindex="-1"
      >
        {{ title }}
      </figcaption>

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
  width: auto;
  max-height: 80vh;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
}

.video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

// Title

.video-title {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0.5px;
  color: var(--vp-title-color);
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.9);
  z-index: 1;

  @media screen and (min-width: 640px) {
    font-size: 20px;
  }
}

// Subtitles

::cue {
  color: var(--vp-subtitles-color);
  background-color: var(--vp-subtitles-bg);
  opacity: var(--vp-subtitles-opacity);
}

// Poster

.poster {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  visibility: hidden;
  transition: all 0.5s ease-in-out;

  &.show {
    visibility: visible;
    opacity: 1;
    transition: all 0.7s ease-in-out;
  }
}

// Overlay

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--vp-overlay-bg);
  z-index: 1;
}

// Play Button

.play-button {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;  
  width: 70px;
  height: 70px;
  background: var(--vp-play-button-bg);
  border: var(--vp-play-button-border);
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
  z-index: 2;

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
      margin-left: 6px;
      border-left: 22px solid var(--vp-play-button-color);
      border-top: 15px solid transparent;
      border-bottom: 15px solid transparent;
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
      background-color: var(--vp-play-button-color);
      border-radius: 2px;
    }
  }
}

.video-player {
  &:hover {
    .play-button {
      background: var(--vp-play-button-bg-hover);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }
  }
}
</style>