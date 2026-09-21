const FILE_URL = import.meta.env.VITE_FILE_URL;

export function getFileUrl(filePath) {
  if (!filePath) return null;

  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  return `${FILE_URL}${filePath}`;
}
