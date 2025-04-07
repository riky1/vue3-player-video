import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

const appEl = document.getElementById('videoApp');

const jsonFile = appEl?.dataset.jsonFile;
const lang = appEl?.dataset.lang;

if (!jsonFile) {
  console.error('⚠️ base-path non specificato in #app');
} else {
  console.log('🌐 Base path:', jsonFile);
  console.log('🌍 Lang:', lang);

  fetch(jsonFile)
    .then(res => res.json())
    .then((data) => {
      const app = createApp(App);
      app.provide('data', data);
      app.provide('jsonFile', jsonFile);
      app.provide('lang', lang);
      app.mount('#videoApp');
    })
    .catch((err) => {
      console.error('Errore nel fetch del config JSON:', err);
    });
}

