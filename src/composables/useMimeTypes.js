import { computed } from 'vue';

function getFileExtension(src) {
  if (typeof src !== 'string') return '';

  const parts = src.split('?')[0].split('.'); // esclude query string
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
}

export function useMimeTypes(src) {
  return computed(() => {
    const mimeTypesList = {
      opus: 'video/ogg',
      ogv: 'video/ogg',
      mp4: 'video/mp4',
      mov: 'video/mp4',
      m4v: 'video/mp4',
      mkv: 'video/x-matroska',
    };

    const extension = getFileExtension(src);
    return mimeTypesList[extension] || '';
  });
}