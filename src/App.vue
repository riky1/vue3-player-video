<script setup>
import { ref, onMounted, watch } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';
import { useFetchData } from './composables/useFetchData';
import VideoPlayer from './components/VideoPlayer.vue';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const { jsonData, loading, error, loadConfig } = useFetchData();
const swiperModules = [Navigation, Pagination, Keyboard];

const isVisible = ref(false);
const videosData = ref([]);
const globalOptions = ref({});

const breakpoints = {
  640: {
    slidesPerView: 2,
    spaceBetween: 0,
  },
  910: {
    slidesPerView: 3,
    spaceBetween: 0,
  },
}

onMounted(() => {
  loadConfig();

  setTimeout(() => {
    isVisible.value = true;
  }, 1000)
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
  <main v-show="isVisible">
    <div v-if="loading">Loading…</div>
    <div v-else-if="error">Error: {{ error.message }}</div>

    <template v-else>
      <Swiper
        class="swiper-video-container"
        :space-between="0"
        :slides-per-view="1"
        :breakpoints="breakpoints"
        :modules="swiperModules"
        navigation
        :pagination="{ clickable: true }"
        keyboard
      >
        <SwiperSlide v-for="(video, index) in videosData" :key="index">
          <div class="video-slide-wrapper">
            <VideoPlayer 
              :sources="video.sources"
              :poster="video.poster" 
              :title="video.title"
              :description="video.posterAlt" 
              :aspectRatio="video.aspectRatio"
              :subtitles="video.subtitles"
              :options="video.options"
              :globalOptions="globalOptions"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </template>
  </main>
</template>

<style lang="scss">
.swiper-video-container {
  width: calc(100% - 40px);
  padding: 0 20px;

  .swiper-pagination-bullet {
    width: 10px;
    height: 10px;
    margin: 0 3px;
    border: 2px solid #ddd;
    border-radius: 50%;
    background-color: #949494;
    opacity: 1;
  }

  .swiper-pagination-bullet-active {
    background-color: #295eb9;
    opacity: 1;
  }

  .swiper-button-next:after,
  .swiper-button-prev:after {
    font-size: 30px;
    font-weight: 900;
    color: #295eb9;
  }

  .swiper-button-prev {
    left: 5px;
  }

  .swiper-button-next {
    right: 5px;
  }
}
</style>

<style lang="scss" scoped>
.video-slide-wrapper {
  transition: transform 0.3s ease-in-out;
  transform-origin: center;
  margin: 40px auto 50px;
  padding: 0 20px;

  &:hover {
    transform: scale(1.1);
  }
}
</style>
