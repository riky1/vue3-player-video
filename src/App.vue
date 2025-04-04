<script setup>
import VideoPlayer from './components/VideoPlayer.vue';

</script>

<template>
  <main>
    <div class="video-wrapper">
      <VideoPlayer src="https://files.vidstack.io/sprite-fight/720p.mp4"
        poster="https://files.vidstack.io/sprite-fight/poster.webp" description="Video Poster" aspectRatio="9/16"
      />
    </div>

    <div class="video-wrapper">
      <VideoPlayer src="https://files.vidstack.io/agent-327/720p.mp4"
        poster="https://files.vidstack.io/agent-327/poster.png" description="Video Poster" aspectRatio="9/16"
      />
    </div>
  </main>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;  
}

.video-wrapper {
  position: relative;
  width: 100%;
  max-width: 300px;
  border: 3px solid red;
  border-radius: 30px;
  overflow: hidden;
  transition: transform 0.3s ease-in-out;
  transform-origin: center;
  margin: 40px;

  &:hover {
    transform: scale(1.1);
  }
}
</style>
