import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "@headlessui/react";
import {
  FaTrash,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaUpload
} from "react-icons/fa";
import { toast } from "sonner";
import ModalWrapper from "./ModalWrapper";
import Button from "./Button";

// Fonction fixImageUrl inchangée
const fixImageUrl = (url) => {
  if (!url) return "";
  
  // C'est un chemin relatif
  if (url.startsWith('/uploads/')) {
    return url;
  }
  
  // C'est une URL absolue (avec http)
  try {
    const urlObj = new URL(url);
    return `/uploads/images/${urlObj.pathname.split('/').pop()}`;
  } catch (e) {
    console.error("Erreur de parsing d'URL:", e);
    // Si ce n'est ni une URL ni un chemin relatif, essayer de récupérer juste le nom du fichier
    const parts = url.split('/');
    if (parts.length > 0) {
      const filename = parts[parts.length - 1];
      return `/uploads/images/${filename}`;
    }
    return url;
  }
};

const ImageGallery = ({ open, setOpen, images, pvId, onSuccess }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagesArray, setImagesArray] = useState([]);
  const fileInputRef = useRef(null);

  // Mettre à jour les images locales lorsqu'elles changent
  useEffect(() => {
    if (images && Array.isArray(images)) {
      setImagesArray([...images, ...uploadedImages]);
    }
  }, [images, uploadedImages]);

  // Navigation des images
  const nextImage = () => {
    setCurrentIndex((prev) => (prev === imagesArray.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? imagesArray.length - 1 : prev - 1));
  };

  // Déclencher l'input de fichier
  const handleAddImagesClick = () => {
    fileInputRef.current?.click();
  };

  // Gérer la sélection de fichiers
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      // Créer un FormData pour l'upload
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      formData.append('pvId', pvId);
      
      // Appel API pour l'ajout d'images
      const response = await fetch('/api/upload/pv-images', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Échec de l'upload des images");
      }
      
      toast.success(`${files.length} image(s) ajoutée(s) avec succès`);
      
      // Ajouter les nouvelles images au tableau local
      setUploadedImages(prev => [...prev, ...data.imageUrls]);
      
      // Reset l'input file
      e.target.value = '';
      
      // Callback de succès pour rafraîchir les données si nécessaire
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error("Erreur lors de l'ajout des images:", error);
      toast.error(error.message || "Une erreur est survenue lors de l'upload");
    } finally {
      setIsUploading(false);
    }
  };

  // Supprimer une image
  const handleDeleteImage = async () => {
    if (!imagesArray || imagesArray.length === 0) return;

    try {
      setIsDeleting(true);

      // Récupérer l'URL de l'image à supprimer
      const imageToDelete = imagesArray[currentIndex];

      // Appel API pour supprimer l'image
      const response = await fetch("/api/upload/delete-image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pvId,
          imageUrl: imageToDelete,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Échec de la suppression");
      }

      toast.success("Image supprimée avec succès");

      // Retirer l'image du tableau local
      const newImages = imagesArray.filter((_, idx) => idx !== currentIndex);
      
      // Mettre à jour l'état local
      setImagesArray(newImages);
      
      // Ajuster l'index actuel si nécessaire
      if (currentIndex >= newImages.length) {
        setCurrentIndex(Math.max(0, newImages.length - 1));
      }
      
      // Appeler le callback de succès pour mettre à jour les données du parent
      if (onSuccess) {
        await onSuccess();  // Attendre que onSuccess se termine si c'est une promesse
      }
      
      // Si c'était la dernière image, ne pas fermer la galerie immédiatement
      // mais attendre que les données soient rechargées
      if (newImages.length === 0) {
        // Petit délai pour permettre au parent de recharger les données
        setTimeout(() => {
          // Vérifier si de nouvelles images ont été chargées entre-temps
          if (imagesArray.length === 0) {
            setOpen(false);
          }
        }, 500);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image:", error);
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!imagesArray || imagesArray.length === 0) {
    return (
      <ModalWrapper open={open} setOpen={setOpen}>
        <div className="p-6 text-center">
          {isDeleting ? (
            <p className="mb-4">Mise à jour des données...</p>
          ) : (
            <p className="mb-4">Aucune image n'est disponible pour ce PV.</p>
          )}
          
          <div className="flex justify-center gap-4">
            <Button
              type="button"
              className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
              onClick={handleAddImagesClick}
              label="Ajouter des images"
              icon={<FaPlus />}
              disabled={isUploading}
            />
            <Button
              type="button"
              className="bg-gray-500 text-white"
              onClick={() => setOpen(false)}
              label="Fermer"
            />
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange} 
            multiple 
            accept="image/*"
          />
        </div>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper open={open} setOpen={setOpen} size="lg">
      <div className="relative">
        <Dialog.Title
          as="h2"
          className="text-base font-bold leading-6 text-gray-900 mb-4 flex justify-between items-center"
        >
          <span>
            Galerie d'images ({currentIndex + 1}/{imagesArray.length})
          </span>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </Dialog.Title>

        <div className="relative h-[60vh] bg-black flex items-center justify-center">
          {/* Image courante */}
          <img
            src={fixImageUrl(imagesArray[currentIndex])}
            alt={`Image ${currentIndex + 1}`}
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              console.error(
                "Erreur de chargement d'image:",
                imagesArray[currentIndex]
              );
              e.target.onerror = null;
              e.target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='20' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3EImage non disponible%3C/text%3E%3C/svg%3E";
            }}
          />

          {/* Boutons de navigation */}
          {imagesArray.length > 1 && (
            <>
              <button
                className="absolute left-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                onClick={prevImage}
              >
                <FaChevronLeft />
              </button>
              <button
                className="absolute right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                onClick={nextImage}
              >
                <FaChevronRight />
              </button>
            </>
          )}
        </div>

        {/* Miniatures */}
        <div className="flex overflow-x-auto py-2 gap-2 mt-2">
          {imagesArray.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`flex-shrink-0 w-16 h-16 border-2 ${
                idx === currentIndex ? "border-blue-500" : "border-transparent"
              }`}
            >
              <img
                src={fixImageUrl(img)}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='10' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3E?%3C/text%3E%3C/svg%3E";
                }}
              />
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-between">
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              label="Fermer"
            />
            
            <Button
              type="button"
              onClick={handleAddImagesClick}
              className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
              label="Ajouter"
              icon={<FaUpload />}
              disabled={isUploading}
            />
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange} 
              multiple 
              accept="image/*"
            />
          </div>

          <Button
            type="button"
            onClick={handleDeleteImage}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
            label={isDeleting ? "Suppression..." : "Supprimer"}
            icon={<FaTrash />}
          />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ImageGallery;
