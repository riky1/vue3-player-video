<script setup>
import { ref, onMounted, watch } from 'vue';
import { register } from 'swiper/element/bundle';
import { useFetchData } from './composables/useFetchData';
import VideoPlayer from './components/VideoPlayer.vue';

register();

const { jsonData, loading, error, loadConfig } = useFetchData();

const swiperRef = ref(null);
const isVisible = ref(false);
const videosData = ref([]);
const globalOptions = ref({});

onMounted(() => {
  loadConfig();

  // per personalizzare gli stili del componente Swiper
  setTimeout(() => {
    const swiperEl = swiperRef.value;

    if (swiperEl) {
      const params = {
        slidesPerView: 1,
        breakpoints: {
          640: {
            slidesPerView: 2,
            spaceBetween: 0,
          },
          910: {
            slidesPerView: 3,
            spaceBetween: 0,
          },
        },
        injectStyles: [
          `
            .swiper {
              width: calc(100% - 40px);
              padding: 0 20px;
            }
              
            .swiper-button-next,
            .swiper-button-prev {
              height: 24px;
              color: #295eb9;
              stroke: #295eb9;
            }

            .swiper-button-prev {
              left: 5px;
            }

            .swiper-button-next {
              right: 5px;
            }

            .swiper-pagination-bullet{
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
          `,
        ],
      };

      Object.assign(swiperEl, params);
      swiperEl.initialize();
      isVisible.value = true;
    }
  }, 1000);

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

<template v-show="isVisible">
  <main>
    <div v-if="loading">Loading…</div>
    <div v-else-if="error">Error: {{ error.message }}</div>

    <template v-else>
      <swiper-container
        ref="swiperRef"
        class="swiper-container"
        init="false"
        :navigation="true"
        :pagination="{
          clickable: true,
        }"
        :keyboard="{
          enabled: true,
        }"
      >
        <swiper-slide
          v-for="(video, index) in videosData" :key="index" 
        >
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
        </swiper-slide>
      </swiper-container>
    </template>
  </main>
</template>

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
