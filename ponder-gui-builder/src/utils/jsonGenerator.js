// Fonction utilitaire globale pour déclencher un téléchargement de fichier
export const triggerDownload = (content, fileName, contentType) => {
  const blob = new Blob([content], { type: `${contentType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Exporter la configuration du projet en chaîne JSON ordonnée
export const serializeProjectJson = (guiConfig, components) => {
  return JSON.stringify({ guiConfig, components }, null, 2);
};