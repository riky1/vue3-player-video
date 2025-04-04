<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
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

// Proprietà calcolata per calcolare il padding-bottom in base all'aspect ratio.
const aspectRatioStyle = computed(() => {
  const [width, height] = props.aspectRatio.split('/').map(Number);
  const percentage = (height / width) * 100;

  return {
    paddingBottom: `${percentage}%`
  };
});

// Proprietà calcolata per determinare il tipo MIME del video.
const videoType = computed(() => {
  const extension = props.src.split('.').pop();

  const mimeTypes = {
    mp4: 'video/mp4',
    webm: 'video/webm',
    ogg: 'video/ogg'
  };

  return mimeTypes[extension] || 'video/mp4';
});
</script>

<template>
  <section class="video-player">
    <figure class="video-wrapper" :style="aspectRatioStyle">
      <video 
        class="video" 
        controls 
        preload="auto" 
        playsinline
        :poster="poster" 
        :aria-label="description"
      >
        <source :src="src" :type="videoType" />
        <p>
          Your browser doesn't support this video. Here is a <a :href="src">link to the video</a> instead.
        </p>
      </video>
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