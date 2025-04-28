import React, { useEffect } from 'react';

/**
 * Composant qui précharge les images pour améliorer l'expérience lors de la génération de PDF
 */
const ImagePreloader = ({ images, onProgress, onComplete }) => {
  useEffect(() => {
    if (!images || images.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    let loadedCount = 0;
    const totalImages = images.length;
    
    const preloadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedCount++;
          if (onProgress) onProgress(loadedCount / totalImages);
          resolve(img);
        };
        img.onerror = () => {
          loadedCount++;
          if (onProgress) onProgress(loadedCount / totalImages);
          // Résoudre même en cas d'erreur pour ne pas bloquer le processus
          resolve(null);
        };
      });
    };

    // Précharger toutes les images
    Promise.all(images.map(src => preloadImage(src)))
      .then(() => {
        if (onComplete) onComplete();
      });
      
    return () => {
      // Nettoyer si nécessaire
    };
  }, [images, onProgress, onComplete]);

  // Ce composant ne rend rien visuellement
  return null;
};

export default ImagePreloader;