<script setup>
import { onMounted } from 'vue';
import { useFetchData } from './composables/useFetchData';
import VideoPlayer from './components/VideoPlayer.vue';

const { config, loading, error, loadConfig } = useFetchData();

onMounted(() => {
  loadConfig();
});

// console.log('data: ', data);
// console.log('jsonFile: ', jsonFile);
// console.log('lang: ', lang);
</script>

<template>
  <main>
    <div v-if="loading">Loading…</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <template v-else>
      <div v-for="(video, index) in config.videos" :key="index" class="video-wrapper">
        <VideoPlayer 
          :sources="video.sources"
          :poster="video.poster" 
          :description="video.posterAlt" 
          :aspectRatio="video.aspectRatio"
          :subtitles="video.subtitles"
        />
      </div>
    </template>
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
