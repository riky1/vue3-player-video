import { computed } from 'vue';

export function useVideoType(src) {
  return computed(() => {
    const extension = src.split('.').pop();
    const mimeTypes = { mp4: 'video/mp4', webm: 'video/webm', ogg: 'video/ogg' };
    return mimeTypes[extension] || 'video/mp4';
  });
}