import { ref } from 'vue';

export function useFetchData() {
  const jsonData = ref({});
  const error = ref(null);
  const loading = ref(true);

  const loadConfig = async () => {
    try {
      // Ottieni il percorso base e i nomi dei file JSON dal DOM
      const jsonPath = document.getElementById('videoApp')?.getAttribute('json-path') || '/';
      const jsonFiles = JSON.parse(document.getElementById('videoApp')?.getAttribute('json-files') || '[]');

      // Ciclo su ogni file JSON per caricarlo
      const data = {};
      for (const file of jsonFiles) {
        const res = await fetch(jsonPath + file);
        if (!res.ok) throw new Error(`Errore nel caricamento del JSON: ${file}`);
        data[file] = await res.json();
      }

      // Memorizza tutti i dati caricati
      jsonData.value = data;

    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    jsonData,
    error,
    loading,
    loadConfig
  };
}
