<script setup>
import { ref } from 'vue';
import { useVideoPlayer } from '../composables/useVideoPlayer';
import { useVideoEvents } from '../composables/useVideoEvents';
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

const aspectRatioStyle = useAspectRatio(props.aspectRatio);
const videoType = useVideoType(props.src);

// Funzioni handler
const handlePlay = () => {
  if (state.isPlayingOnHover) return;

  state.isPlayingOnHover = false;
  playVideo();
};

const handlePause = () => {
  pauseVideo();
};

const handleEnd = () => {
  videoRef.value.currentTime = 0;
  videoRef.value.load();
  state.isPlayingOnClick = false;
};

const handleVolumeChange = () => {
  const video = videoRef.value;

  if (state.isPlayingOnHover) {
    state.isMutedByUser = false;
    return;
  }

  state.isMutedByUser = video.muted ? true : false
};

const handleClick = () => {
  if (!videoRef.value) return;

  if (state.isPlayingOnClick && !videoRef.value.paused) {
    pauseVideo();
  } else {
    state.isPlayingOnHover = false;
    playVideo();
  }
};

const handleMouseEnter = () => {
  if (state.isPlayingOnClick || !videoRef.value) return;

  videoRef.value.muted = true;
  videoRef.value.controls = false;
  state.isPlayingOnHover = true;
  videoRef.value.play();

  startLoop();
};

const handleMouseLeave = () => {
  if (state.isPlayingOnClick || !videoRef.value) return;

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
        v-show="state.showPlayButton"
        class="play-button" 
        aria-label="Play button"
        @click.prevent="handleClick"
      ></button>
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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: var(--play-button-bg);
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: background 0.3s, box-shadow 0.3s;

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

.video-player {
  &:hover {
    .play-button {
      background: var(--play-button-bg-hover);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }
  }
}
</style>