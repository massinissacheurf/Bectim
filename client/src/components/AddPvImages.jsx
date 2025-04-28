import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { toast } from "sonner";
import { FaCamera, FaSpinner, FaTimes } from "react-icons/fa";
import ModalWrapper from "./ModalWrapper";
import Button from "./Button";

const AddPvImages = ({ open, setOpen, pvId, onSuccess }) => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Gérer l'ajout d'images
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Vérifier que ce sont des images et pas trop grandes
    const validImages = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max

      if (!isValidType) toast.error(`${file.name} n'est pas une image valide`);
      if (!isValidSize)
        toast.error(`${file.name} est trop volumineux (max 5MB)`);

      return isValidType && isValidSize;
    });

    // Créer des prévisualisations
    const newImages = validImages.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
    e.target.value = null;
  };

  // Supprimer une image
  const removeImage = (index) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // Mettre à jour la fonction handleSubmit
  const handleSubmit = async () => {
    if (images.length === 0) {
      toast.error("Veuillez ajouter au moins une image");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Début de l'upload des images pour le PV:", pvId);

      // Créer un FormData pour l'upload
      const formData = new FormData();
      images.forEach((img, idx) => {
        console.log(`Ajout de l'image ${idx + 1}:`, img.file.name);
        formData.append("images", img.file);
      });
      formData.append("pvId", pvId);

      // Appel API pour l'ajout d'images
      console.log("Envoi de la requête d'upload");
      const response = await fetch("/api/upload/pv-images", {
        method: "POST",
        body: formData,
      });

      // Analyse de la réponse même si ce n'est pas du JSON
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Réponse non-JSON:", text);
        throw new Error(`Réponse du serveur invalide: ${text}`);
      }

      console.log("Réponse du serveur:", data);

      if (!response.ok) {
        throw new Error(
          data?.message || `Erreur ${response.status}: ${response.statusText}`
        );
      }

      if (!data.success) {
        throw new Error(data.message || "Échec de l'upload des images");
      }

      toast.success("Images ajoutées avec succès");
      console.log("Images ajoutées avec succès:", data.imageUrls);

      // Nettoyer et fermer
      setImages([]);
      setOpen(false);

      // Callback de succès pour rafraîchir les données
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erreur détaillée lors de l'ajout des images:", error);
      toast.error(
        error.message || "Une erreur est survenue lors de l'upload des images"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <Dialog.Title
        as="h2"
        className="text-base font-bold leading-6 text-gray-900 mb-4"
      >
        Ajouter des images au PV
      </Dialog.Title>

      <div className="mt-2 flex flex-col gap-4 max-h-[70vh] overflow-y-auto px-1">
        {/* Section d'upload */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Ajoutez des images à ce PV de surveillance
            </p>
            <label
              htmlFor="image-add-upload"
              className="bg-blue-600 text-white px-3 py-2 rounded text-sm cursor-pointer flex items-center gap-2"
            >
              <FaCamera />
              Sélectionner
            </label>
            <input
              id="image-add-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* Prévisualisation des images */}
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative group border rounded overflow-hidden"
                >
                  <img
                    src={image.preview}
                    alt={`Image ${index + 1}`}
                    className="w-full h-40 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                  >
                    <FaTimes size={16} />
                  </button>
                  <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-xs py-1 px-2">
                    {image.file.name.length > 20
                      ? image.file.name.substring(0, 20) + "..."
                      : image.file.name}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-10 border border-dashed rounded-md">
              <FaCamera className="mx-auto text-gray-400 mb-2" size={30} />
              <p className="text-gray-500">
                Aucune image sélectionnée. Cliquez sur "Sélectionner" pour
                ajouter des images.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          type="button"
          label="Annuler"
          onClick={() => setOpen(false)}
          className="bg-white border border-gray-300 text-gray-700"
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || images.length === 0}
          className={`inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
            isLoading || images.length === 0
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Chargement...
            </>
          ) : (
            "Ajouter les images"
          )}
        </button>
      </div>
    </ModalWrapper>
  );
};

export default AddPvImages;
