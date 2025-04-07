import { ref } from 'vue';

export function useFetchData() {
  const config = ref(null);
  const error = ref(null);
  const loading = ref(true);

  const loadConfig = async () => {
    try {
      const jsonFile = document.getElementById('videoApp')?.getAttribute('json-file') || '/';
      const res = await fetch(jsonFile);
      if (!res.ok) throw new Error('Errore nel caricamento del JSON');

      config.value = await res.json();
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    config,
    error,
    loading,
    loadConfig
  };
}
