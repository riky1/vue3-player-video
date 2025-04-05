import { onMounted, onUnmounted } from 'vue';

/**
 * Composable per la gestione degli eventi video
 * @param {Ref} videoRef - Il riferimento al video element
 * @param {Object} events - Un oggetto di eventi con i nomi degli eventi come chiavi e funzioni callback come valori
 */
export function useVideoEvents(videoRef, events) {
  onMounted(() => {
    if (!videoRef.value) return;

    Object.keys(events).forEach((event) => {
      videoRef.value.addEventListener(event, events[event]);
    });
  });

  onUnmounted(() => {
    if (!videoRef.value) return;

    Object.keys(events).forEach((event) => {
      videoRef.value.removeEventListener(event, events[event]);
    });
  });
}
