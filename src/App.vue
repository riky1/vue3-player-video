<script setup>
import { ref, onMounted, watch } from 'vue';
import { useFetchData } from './composables/useFetchData';
import VideoPlayer from './components/VideoPlayer.vue';

const { jsonData, loading, error, loadConfig } = useFetchData();

const videosData = ref([]);
const globalOptions = ref({});

onMounted(() => {
  loadConfig();
});

watch(jsonData, (newValue) => {
  if (newValue && Object.keys(newValue).length > 0) {
    // Accede ai dati specifici
    const videoData = newValue['video-data.json']?.videos || [];
    const options = newValue['video-global-options.json'] || {};

    // Assegna i valori alle costanti
    videosData.value = videoData;
    globalOptions.value = options;

    console.log('videosData:', videosData.value);
    console.log('globalOptions:', globalOptions.value);
  }
});

console.log('jsonData: ', jsonData);
// console.log('jsonFile: ', jsonFile);
// console.log('lang: ', lang);
</script>

<template>
  <main>
    <div v-if="loading">Loading…</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <template v-else>
      <div v-for="(video, index) in videosData" :key="index" class="video-wrapper">
        <VideoPlayer 
          :sources="video.sources"
          :poster="video.poster" 
          :description="video.posterAlt" 
          :aspectRatio="video.aspectRatio"
          :subtitles="video.subtitles"
          :options="video.options"
          :globalOptions="globalOptions"
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
