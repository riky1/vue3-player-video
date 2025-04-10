// Description: This file contains a Vue 3 composable that manages audio preferences for a video player.
// It allows for setting and getting the mute state and volume level, and synchronizes these preferences with the video element.

import { ref, watch, onMounted } from 'vue';

const AUDIO_MUTED_KEY = 'userMuted';
const AUDIO_VOLUME_KEY = 'userVolume';

export function useAudioSettings(videoRef, state) {
  const isMuted = ref(getInitialMute());
  const volume = ref(getInitialVolume());

  function getInitialMute() {
    return localStorage.getItem(AUDIO_MUTED_KEY) === 'true';
  }

  function getInitialVolume() {
    const stored = localStorage.getItem(AUDIO_VOLUME_KEY);
    return stored !== null ? parseFloat(stored) : 1;
  }

  function updateAudioPreference(muted, vol, videos) {
    localStorage.setItem(AUDIO_MUTED_KEY, muted);
    localStorage.setItem(AUDIO_VOLUME_KEY, vol);
    isMuted.value = muted;
    volume.value = vol;

    videos.value.forEach(({ videoRef, state }, id) => {
      videoRef.muted = isMuted.value;
      videoRef.volume = volume.value;
    });
  }

  function syncVideoAudioState() {
    if (videoRef.value) {
      videoRef.value.muted = localStorage.getItem(AUDIO_MUTED_KEY) === 'true' || false;
      videoRef.value.volume = parseFloat(localStorage.getItem(AUDIO_VOLUME_KEY)) || 1;
      state.isMuted = videoRef.value.muted;
    }
  }

  // aggiorna il video se cambia lo stato altrove
  watch([isMuted, volume], ([newMuted, newVolume]) => {
    if (videoRef.value) {
      videoRef.value.muted = newMuted;
      videoRef.value.volume = newVolume;
    }
  });

  onMounted(() => {
    syncVideoAudioState();
  });

  return {
    updateAudioPreference,
    syncVideoAudioState,
  };
}
