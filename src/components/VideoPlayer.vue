<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
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
const showPlayButton = ref(true);
const isPlayingOnClick = ref(null);
const isPlayingOnHover = ref(null);

const aspectRatioStyle = useAspectRatio(props.aspectRatio);
const videoType = useVideoType(props.src);

let loopInterval = null;

const playVideo = () => {
  console.log('=== playVideo');

  if (!isPlayingOnClick.value) {
    videoRef.value.currentTime = 0;
  }

  clearInterval(loopInterval);

  //TODO: handle case where if user mutes, then pauses and then resumes, if video remains mute

  videoRef.value.muted = false;
  showPlayButton.value = false;
  videoRef.value.controls = true;
  isPlayingOnClick.value = true;
  videoRef.value.play();
};

const pauseVideo = () => {
  console.log('pauseVideo');

  showPlayButton.value = true;
  videoRef.value.pause();
};

// Funzioni handler
const handlePlay = () => {
  if (isPlayingOnHover.value) return;

  console.log('Evento: play');

  isPlayingOnHover.value = false;
  playVideo();
};

const handlePause = () => {
  console.log('Evento: pause');

  pauseVideo();
};

const handleEnd = () => {
  console.log('Evento: ended');

  videoRef.value.currentTime = 0;
  videoRef.value.load();
};

const handleVolumeChange = () => {
  const video = videoRef.value;
  console.log('Evento: volumechange', video.muted ? 'Mute' : 'Unmute');
};

const handleClick = () => {
  if (!videoRef.value) return;

  if (isPlayingOnClick.value && !videoRef.value.paused) {
    console.log('Click sul video: pause');

    pauseVideo();
  } else {
    console.log('Click sul video: play');

    isPlayingOnHover.value = false;
    playVideo();
  }
};

const handleMouseEnter = () => {
  if (isPlayingOnClick.value || !videoRef.value) return;

  console.log('Mouse enter');

  videoRef.value.muted = true;
  videoRef.value.controls = false;
  isPlayingOnHover.value = true;
  videoRef.value.play();

  clearInterval(loopInterval);

  loopInterval = setInterval(() => {
    if (videoRef.value && !isPlayingOnClick.value) {
      videoRef.value.currentTime = 0;
      videoRef.value.play();
    }
  }, 6000);
};

const handleMouseLeave = () => {
  if (isPlayingOnClick.value || !videoRef.value) return;

  console.log('Mouse leave');

  clearInterval(loopInterval);

  videoRef.value.pause();
  videoRef.value.controls = true;
  videoRef.value.currentTime = 0;
  videoRef.value.load();
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
        v-show="showPlayButton"
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