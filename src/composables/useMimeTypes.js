// useMimeTypes.js
export function useMimeTypes(src) {
  const mimeTypesList = {
    mp4: 'video/mp4',
    m4v: 'video/mp4',
    mov: 'video/quicktime',
    webm: 'video/webm',
    ogg: 'video/ogg',
    ogv: 'video/ogg',
    mkv: 'video/x-matroska',
    avi: 'video/x-msvideo',
    flv: 'video/x-flv',
    wmv: 'video/x-ms-wmv',
    mpeg: 'video/mpeg',
    mpg: 'video/mpeg'
  };

  const getFileExtension = src => {
    if (typeof src !== 'string') return '';
    const parts = src.split('?')[0].split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
  };

  const extension = getFileExtension(src);
  return mimeTypesList[extension] || '';
}
