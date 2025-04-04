import { computed } from 'vue';

export function useAspectRatio(aspectRatio) {
  return computed(() => {
    const [width, height] = aspectRatio.split('/').map(Number);
    const percentage = (height / width) * 100;
    return { paddingBottom: `${percentage}%` };
  });
}