<script setup>
import { inject } from 'vue';
import VideoPlayer from './components/VideoPlayer.vue';

const data = inject('data');
const jsonFile = inject('jsonFile');
const lang = inject('lang');

console.log('data: ', data);
console.log('jsonFile: ', jsonFile);
console.log('lang: ', lang);
</script>

<template>
  <main>
    <div v-for="item in data" :key="item.id" class="video-wrapper">
      <VideoPlayer 
        :sources="item.sources"
        :poster="item.poster" 
        :description="item.posterAlt" 
        :aspectRatio="item.aspectRatio"
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
