import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  useGetPVByIdQuery,
  useUpdatePVMutation,
} from "../redux/slices/api/pvApiSlice";
import Button from "./Button";
import Loading from "./Loading";
import ModalWrapper from "./ModalWrapper";
import Textbox from "./Textbox";

// Componant EditPV optimisé avec formulaires identiques aux formulaires de création
const EditPV = ({ open, setOpen, pvId, onSuccess }) => {
  // États locaux
  const [pvType, setPvType] = useState("");
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const [lots, setLots] = useState([]);

  // Récupérer les données du PV avec refetch
  const {
    data,
    isLoading: isFetching,
    refetch,
  } = useGetPVByIdQuery(pvId, {
    skip: !open || !pvId,
  });

  const pv = data?.pv || {};

  // Configuration du formulaire
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Mutation Redux pour mettre à jour le PV
  const [updatePV, { isLoading }] = useUpdatePVMutation();

  // Effect pour recharger les données quand le modal s'ouvre
  useEffect(() => {
    // SEUL CHANGEMENT: Réinitialiser proprement lors de l'ouverture/fermeture
    if (!open) {
      setPvType("");
      setIsFormInitialized(false);
      setLots([]);
      reset({});
    } else if (open && pvId) {
      setPvType("");
      setIsFormInitialized(false);
      setLots([]);
      reset({});
      refetch();
    }
  }, [open, pvId, refetch, reset]);

  // Effect pour initialiser le formulaire une fois que les données sont chargées
  useEffect(() => {
    if (!pv || Object.keys(pv).length === 0 || isFormInitialized) return;

    try {
      console.log("Initializing form with data:", pv);

      // Définir le type de PV
      setPvType(pv.type || "");

      // Préparer les données de base du formulaire
      const formData = {
        // Champs communs
        numBL: pv.numBL || "",
        importateur: pv.importateur || "",
        numTC: pv.numTC || "",
        numScelle: pv.numScelle || "",
        nbColis: pv.nbColis || 0,
        navire: pv.navire || "",
        portChargement: pv.portChargement || "",
        portDechargement: pv.portDechargement || "",
        grosArticle: pv.grosArticle || "",
      };

      // Ajouter des champs spécifiques selon le type de PV
      if (pv.type === "surveillance") {
        formData.numFacture = pv.numFacture || "";
        formData.dateIntervention = pv.dateIntervention
          ? new Date(pv.dateIntervention).toISOString().split("T")[0]
          : "";
        formData.transitaire = pv.transitaire || "";
        formData.lieuIntervention = pv.lieuIntervention || "";
        formData.dateArrivee = pv.dateArrivee
          ? new Date(pv.dateArrivee).toISOString().split("T")[0]
          : "";
        formData.natureMarchandise = pv.natureMarchandise || "";
        formData.etatMarchandise = pv.etatMarchandise || "Neuve et sous emballage";
        formData.constatations = pv.surveillance?.Constation || "";
      } else if (pv.type === "depotage") {
        formData.lieuDepotage = pv.lieuDepotage || pv.lieuIntervention || "";
        formData.depotage = {
          numCde: pv.depotage?.numCde || 0,
          observations: pv.depotage?.observations || "",
          produit: pv.depotage?.produit || "",
          nuance: pv.depotage?.nuance || "",
          quantite: pv.depotage?.quantite || 0,
        };

        // Gérer les lots séparément
        if (pv.depotage && pv.depotage.lot && Array.isArray(pv.depotage.lot)) {
          if (pv.depotage.lot.length > 0) {
            setLots(
              pv.depotage.lot.map((lot) => ({
                numLot: lot.numLot || "",
                bonEtat: lot.bonEtat || 0,
                manquant: lot.manquant || 0,
                avarie: lot.avarie || 0,
              }))
            );
          } else {
            setLots([{ numLot: "", bonEtat: 0, manquant: 0, avarie: 0 }]);
          }
        } else {
          setLots([{ numLot: "", bonEtat: 0, manquant: 0, avarie: 0 }]);
        }
      }

      // Réinitialiser le formulaire avec les données
      reset(formData);
      setIsFormInitialized(true);
    } catch (error) {
      console.error("Error initializing form:", error);
      toast.error("Erreur lors du chargement des données");
    }
  }, [pv, reset, isFormInitialized]);

  // Gestionnaires pour les lots
  const handleAddLot = () => {
    setLots([...lots, { numLot: "", bonEtat: 0, manquant: 0, avarie: 0 }]);
  };

  const handleRemoveLot = (index) => {
    setLots(lots.filter((_, i) => i !== index));
  };

  const handleLotChange = (index, field, value) => {
    const newLots = [...lots];
    newLots[index][field] = field === "numLot" ? value : Number(value) || 0;
    setLots(newLots);
  };

  const handleOnSubmit = async (data) => {
    try {
      // Ajouter le type de PV aux données
      let pvData = { ...data, type: pvType };

      // Si c'est un PV de dépotage, ajouter les lots
      if (pvType === "depotage") {
        if (!pvData.depotage) {
          pvData.depotage = {};
        }

        pvData.depotage = {
          ...pvData.depotage,
          lot: lots,
          quantite: Number(pvData.depotage.quantite) || 0,
          numCde: Number(pvData.depotage.numCde) || 0,
        };
      }
      // Si c'est un PV de surveillance, structurer les données correctement
      else if (pvType === "surveillance") {
        pvData.surveillance = {
          Constation: data.constatations || "",
        };
      }

      console.log("Submitting data:", pvData);

      const res = await updatePV({
        id: pvId,
        data: pvData,
      }).unwrap();

      toast.success(res.message || "PV modifié avec succès");

      if (onSuccess) onSuccess();

      // Fermer la modal après un léger délai
      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (err) {
      console.error("Error updating PV:", err);
      toast.error(
        err?.data?.message || err.error || "Erreur lors de la modification"
      );
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        {isFetching ? (
          <div className="py-10">
            <Loading />
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleOnSubmit)} className="">
            <Dialog.Title
              as="h2"
              className="text-base font-bold leading-6 text-gray-900 mb-4"
            >
              {pvType === "surveillance"
                ? "MODIFIER PV DE SURVEILLANCE"
                : "MODIFIER PV DE DÉPOTAGE"}
            </Dialog.Title>

            <div className="mt-2 flex flex-col gap-6 max-h-[70vh] overflow-y-auto px-1">
              {/* Formulaire pour surveillance */}
              {isFormInitialized && pvType === "surveillance" && (
                <>
                  <div className="flex items-center gap-4">
                    <Textbox
                      placeholder="Numéro BL"
                      type="text"
                      name="numBL"
                      label="Numéro BL"
                      className="w-full rounded"
                      register={register("numBL", {
                        required: "Numéro BL est requis!",
                      })}
                      error={errors.numBL ? errors.numBL.message : ""}
                    />
                    <Textbox
                      placeholder="Numéro Facture"
                      type="text"
                      name="numFacture"
                      label="Numéro Facture"
                      className="w-full rounded"
                      register={register("numFacture", {
                        required: "Numéro Facture est requis!",
                      })}
                      error={errors.numFacture ? errors.numFacture.message : ""}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <Textbox
                      placeholder="Date d'Intervention"
                      type="date"
                      name="dateIntervention"
                      label="Date d'Intervention"
                      className="w-full rounded"
                      register={register("dateIntervention", {
                        required: "Date est requise!",
                      })}
                      error={
                        errors.dateIntervention
                          ? errors.dateIntervention.message
                          : ""
                      }
                    />
                    <Textbox
                      placeholder="Importateur"
                      type="text"
                      name="importateur"
                      label="Importateur"
                      className="w-full rounded"
                      register={register("importateur", {
                        required: "Importateur est requis!",
                      })}
                      error={
                        errors.importateur ? errors.importateur.message : ""
                      }
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <Textbox
                      placeholder="Transitaire"
                      type="text"
                      name="transitaire"
                      label="Transitaire"
                      className="w-full rounded"
                      register={register("transitaire", {
                        required: "Transitaire est requis!",
                      })}
                      error={
                        errors.transitaire ? errors.transitaire.message : ""
                      }
                    />
                    <Textbox
                      placeholder="Lieu Intervention"
                      type="text"
                      name="lieuIntervention"
                      label="Lieu Intervention"
                      className="w-full rounded"
                      register={register("lieuIntervention")}
                      error={
                        errors.lieuIntervention
                          ? errors.lieuIntervention.message
                          : ""
                      }
                    />
                  </div>

                  {/* Nouvelle section: Identification du conteneur */}
                  <div className="border-t pt-4 mt-2">
                    <h3 className="font-medium mb-4">
                      Identification du conteneur
                    </h3>
                    <div className="flex items-center gap-4">
                      <Textbox
                        placeholder="Numéro TC"
                        type="text"
                        name="numTC"
                        label="Numéro TC"
                        className="w-full rounded"
                        register={register("numTC", {
                          required: "Numéro TC est requis!",
                        })}
                        error={errors.numTC ? errors.numTC.message : ""}
                      />
                      <Textbox
                        placeholder="Numéro Scellé"
                        type="text"
                        name="numScelle"
                        label="Numéro Scellé"
                        className="w-full rounded"
                        register={register("numScelle", {
                          required: "Numéro Scellé est requis!",
                        })}
                        error={errors.numScelle ? errors.numScelle.message : ""}
                      />
                    </div>
                    <Textbox
                      placeholder="Nombre de Colis"
                      type="number"
                      name="nbColis"
                      label="Nombre de Colis"
                      className="w-full rounded mt-4"
                      register={register("nbColis", {
                        required: "Nombre de Colis est requis!",
                        valueAsNumber: true,
                      })}
                      error={errors.nbColis ? errors.nbColis.message : ""}
                    />
                  </div>

                  {/* Nouvelle section: Renseignements généraux */}
                  <div className="border-t pt-4 mt-2">
                    <h3 className="font-medium mb-4">
                      Renseignements généraux
                    </h3>
                    <div className="flex items-center gap-4">
                      <Textbox
                        placeholder="Nature de la marchandise"
                        type="text"
                        name="natureMarchandise"
                        label="Nature de la marchandise"
                        className="w-full rounded"
                        register={register("natureMarchandise", {
                          required: "Nature de la marchandise est requise",
                        })}
                        error={
                          errors.natureMarchandise
                            ? errors.natureMarchandise.message
                            : ""
                        }
                      />
                      <Textbox
                        placeholder="État de la marchandise"
                        type="text"
                        name="etatMarchandise"
                        label="État de la marchandise"
                        className="w-full rounded"
                        register={register("etatMarchandise")}
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <Textbox
                        placeholder="Navire"
                        type="text"
                        name="navire"
                        label="Navire"
                        className="w-full rounded"
                        register={register("navire")}
                      />
                      <Textbox
                        placeholder="Date d'arrivée"
                        type="date"
                        name="dateArrivee"
                        label="Date d'arrivée"
                        className="w-full rounded"
                        register={register("dateArrivee")}
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <Textbox
                        placeholder="Port de chargement"
                        type="text"
                        name="portChargement"
                        label="Port de chargement"
                        className="w-full rounded"
                        register={register("portChargement")}
                      />
                      <Textbox
                        placeholder="Port de déchargement"
                        type="text"
                        name="portDechargement"
                        label="Port de déchargement"
                        className="w-full rounded"
                        register={register("portDechargement", {
                          value: "Alger",
                        })}
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <Textbox
                        placeholder="Gros/Article"
                        type="text"
                        name="grosArticle"
                        label="Gros/Article"
                        className="w-full rounded"
                        register={register("grosArticle")}
                      />
                      <Textbox
                        placeholder="Lieu d'intervention"
                        type="text"
                        name="lieuIntervention"
                        label="Lieu d'intervention"
                        className="w-full rounded"
                        register={register("lieuIntervention")}
                      />
                    </div>
                  </div>

                  {/* Nouvelle section: Constatations */}
                  <div className="border-t pt-4 mt-2">
                    <h3 className="font-medium mb-4">Constatations</h3>
                    <div className="w-full">
                      <label
                        htmlFor="constatations"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Constatations
                      </label>
                      <textarea
                        id="constatations"
                        rows={5}
                        className="w-full rounded border border-gray-300 p-2"
                        placeholder="Entrez les constatations..."
                        {...register("constatations")}
                      ></textarea>
                    </div>
                  </div>
                </>
              )}
              {/* Formulaire pour dépotage */}
              {isFormInitialized && pvType === "depotage" && (
                <>
                  {/* Section: Informations générales */}
                  <div className="border-t pt-4 mt-2">
                    <h3 className="font-medium mb-4">Informations générales</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Numéro BL et Numéro CDE */}
                      <Textbox
                        placeholder="Numéro BL"
                        type="text"
                        name="numBL"
                        label="Numéro BL"
                        className="w-full rounded"
                        register={register("numBL", {
                          required: "Numéro BL est requis!",
                        })}
                        error={errors.numBL ? errors.numBL.message : ""}
                      />
                      <Textbox
                        placeholder="Numéro de CDE"
                        type="number"
                        name="depotage.numCde"
                        label="Numéro de CDE"
                        className="w-full rounded"
                        register={register("depotage.numCde", {
                          required: "Numéro de commande est requis!",
                          valueAsNumber: true,
                        })}
                        error={
                          errors.depotage?.numCde
                            ? errors.depotage.numCde.message
                            : ""
                        }
                      />
                    </div>

                    {/* Navire et Lieu d'intervention */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <Textbox
                        placeholder="Navire"
                        type="text"
                        name="navire"
                        label="Navire"
                        className="w-full rounded"
                        register={register("navire", {
                          required: "Navire est requis!",
                        })}
                        error={errors.navire ? errors.navire.message : ""}
                      />
                      <Textbox
                        placeholder="Lieu"
                        type="text"
                        name="lieuDepotage"
                        label="Lieu"
                        className="w-full rounded"
                        register={register("lieuDepotage", {
                          required: "Lieu est requis!",
                        })}
                        error={
                          errors.lieuDepotage ? errors.lieuDepotage.message : ""
                        }
                      />
                    </div>

                    {/* Importateur et Embarquement */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <Textbox
                        placeholder="Receptionnaire"
                        type="text"
                        name="importateur"
                        label="Receptionnaire"
                        className="w-full rounded"
                        register={register("importateur", {
                          required: "Importateur est requis!",
                        })}
                        error={
                          errors.importateur ? errors.importateur.message : ""
                        }
                      />
                      <Textbox
                        placeholder="Embarquement (Port de chargement)"
                        type="text"
                        name="portChargement"
                        label="Embarquement"
                        className="w-full rounded"
                        register={register("portChargement", {
                          required: "Port de chargement est requis!",
                        })}
                        error={
                          errors.portChargement
                            ? errors.portChargement.message
                            : ""
                        }
                      />
                    </div>

                    {/* Débarquement et Gros/Article */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <Textbox
                        placeholder="Débarquement"
                        type="text"
                        name="portDechargement"
                        label="Débarquement"
                        className="w-full rounded"
                        register={register("portDechargement", {
                          required: "Port de déchargement est requis!",
                        })}
                        error={
                          errors.portDechargement
                            ? errors.portDechargement.message
                            : ""
                        }
                      />
                      <Textbox
                        placeholder="Gros/Article"
                        type="text"
                        name="grosArticle"
                        label="Gros/Article"
                        className="w-full rounded"
                        register={register("grosArticle", {
                          required: "Gros/Article est requis!",
                        })}
                        error={
                          errors.grosArticle ? errors.grosArticle.message : ""
                        }
                      />
                    </div>

                    {/* Produit et Nombre de colis */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <Textbox
                        placeholder="Produit"
                        type="text"
                        name="depotage.produit"
                        label="Produit"
                        className="w-full rounded"
                        register={register("depotage.produit", {
                          required: "Produit est requis!",
                        })}
                        error={
                          errors.depotage?.produit
                            ? errors.depotage.produit.message
                            : ""
                        }
                      />
                      <Textbox
                        placeholder="Nombre de Colis"
                        type="number"
                        name="nbColis"
                        label="Nombre de Colis"
                        className="w-full rounded"
                        register={register("nbColis", {
                          required: "Nombre de Colis est requis!",
                          valueAsNumber: true,
                        })}
                        error={errors.nbColis ? errors.nbColis.message : ""}
                      />
                    </div>
                  </div>

                  {/* Section: Infos Conteneur */}
                  <div className="border-t pt-4 mt-2">
                    <h3 className="font-medium mb-4">Infos Conteneur</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Textbox
                        placeholder="N° Conteneur"
                        type="text"
                        name="numTC"
                        label="N° Conteneur"
                        className="w-full rounded"
                        register={register("numTC", {
                          required: "N° Conteneur est requis!",
                        })}
                        error={errors.numTC ? errors.numTC.message : ""}
                      />
                      <Textbox
                        placeholder="N° Scellé"
                        type="text"
                        name="numScelle"
                        label="N° Scellé"
                        className="w-full rounded"
                        register={register("numScelle", {
                          required: "N° Scellé est requis!",
                        })}
                        error={errors.numScelle ? errors.numScelle.message : ""}
                      />
                    </div>
                    <div className="w-full mt-4">
                      <label
                        htmlFor="observations"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Observations
                      </label>
                      <textarea
                        id="observations"
                        rows={3}
                        className="w-full rounded border border-gray-300 p-2"
                        placeholder="Entrez les observations..."
                        {...register("depotage.observations")}
                      ></textarea>
                    </div>
                  </div>

                  {/* Section: Constat des dommages */}
                  <div className="border-t pt-4 mt-2">
                    <h3 className="font-medium mb-4">Constat des dommages</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Textbox
                        placeholder="Nuance"
                        type="text"
                        name="depotage.nuance"
                        label="Nuance"
                        className="w-full rounded"
                        register={register("depotage.nuance")}
                      />
                      <Textbox
                        placeholder="Quantité"
                        type="number"
                        name="depotage.quantite"
                        label="Quantité"
                        className="w-full rounded"
                        register={register("depotage.quantite", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>

                    {/* Gestion des lots */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Détail des lots</h4>
                        <button
                          type="button"
                          onClick={handleAddLot}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        >
                          + Ajouter lot
                        </button>
                      </div>

                      {lots.map((lot, index) => (
                        <div
                          key={index}
                          className="mb-4 p-4 border border-gray-200 rounded bg-gray-50"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium">Lot #{index + 1}</h4>
                            {lots.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveLot(index)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Supprimer
                              </button>
                            )}
                          </div>

                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Numéro de lot
                            </label>
                            <input
                              type="text"
                              value={lot.numLot}
                              onChange={(e) =>
                                handleLotChange(index, "numLot", e.target.value)
                              }
                              className="w-full rounded border border-gray-300 p-2"
                              placeholder="Numéro de lot"
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bon état
                              </label>
                              <input
                                type="number"
                                value={lot.bonEtat}
                                onChange={(e) =>
                                  handleLotChange(
                                    index,
                                    "bonEtat",
                                    e.target.value
                                  )
                                }
                                className="w-full rounded border border-gray-300 p-2"
                                placeholder="Bon état"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Manquant
                              </label>
                              <input
                                type="number"
                                value={lot.manquant}
                                onChange={(e) =>
                                  handleLotChange(
                                    index,
                                    "manquant",
                                    e.target.value
                                  )
                                }
                                className="w-full rounded border border-gray-300 p-2"
                                placeholder="Manquant"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Avarie
                              </label>
                              <input
                                type="number"
                                value={lot.avarie}
                                onChange={(e) =>
                                  handleLotChange(
                                    index,
                                    "avarie",
                                    e.target.value
                                  )
                                }
                                className="w-full rounded border border-gray-300 p-2"
                                placeholder="Avarie"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {lots.length === 0 && (
                        <div className="text-center p-6 border border-dashed rounded">
                          Aucun lot n'a été ajouté. Cliquez sur "Ajouter lot"
                          pour commencer.
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              {!isFormInitialized && !isFetching && (
                <div className="py-10 text-center">
                  <p>Chargement du formulaire...</p>
                  <div className="mt-4">
                    <Loading />
                  </div>
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            {isLoading ? (
              <div className="mt-8">
                <Loading />
              </div>
            ) : (
              <div className="py-3 mt-4 flex sm:flex-row-reverse gap-4">
                {isFormInitialized && (
                  <Button
                    type="submit"
                    className="bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 sm:ml-3 sm:w-auto"
                    label={`Modifier PV de ${
                      pvType === "surveillance" ? "Surveillance" : "Dépotage"
                    }`}
                  />
                )}

                <Button
                  type="button"
                  className="bg-white border text-sm font-semibold text-gray-900 sm:w-auto"
                  onClick={() => {
                    setOpen(false);
                  }}
                  label="Annuler"
                />
              </div>
            )}
          </form>
        )}
      </ModalWrapper>
    </>
  );
};

export default EditPV;
