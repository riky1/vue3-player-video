import { onMounted, onUnmounted } from 'vue';

/**
 * Composable per la gestione degli eventi video
 * @param {Ref} videoRef - Il riferimento al video element
 * @param {Object} events - Un oggetto di eventi con i nomi degli eventi come chiavi e funzioni callback come valori
 */
export function useVideoEvents(videoRef, events) {
  onMounted(() => {
    const video = videoRef.value;

    if (video) {
      Object.entries(events).forEach(([event, handler]) => {
        video.addEventListener(event, handler);
      });
    }
  });

  onUnmounted(() => {
    const video = videoRef.value;
    
    if (video) {
      Object.entries(events).forEach(([event, handler]) => {
        video.removeEventListener(event, handler);
      });
    }
  });
}
