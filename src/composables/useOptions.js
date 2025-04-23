import { computed } from 'vue'

const defaultOptions = {
  controls: true,
  autoplay: false,
  loop: false,
  muted: false,
  allowFullscreen: true,
  disablePictureInPicture: false,
  allowPreview: true
}

export function useOptions(globalOptions, videoOptions) {
  return computed(() => {
    return {
      ...defaultOptions,
      ...globalOptions,
      ...videoOptions
    }
  })
}
